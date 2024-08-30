import {
  CreateUserRequestDTO,
  GetUsersQueryParams,
  LoginRequestDTO,
  UpdateUserRequestDTO,
} from "./user-controller.types"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { UserModel } from "../../models/user-model"
import { NextFunction, Request, Response } from "express"
import { CommonError } from "../../middlewares/error/common-error"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"
import { AuthenticationError } from "../../middlewares/error/authentication-error"
import { sendMail } from "../../config/nodemailer"
import { EmailProps, mailSend } from "../../helpers"

export class UserController {
  public static async loginUser(
    req: Request<{}, {}, LoginRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    const { email, password } = req.body
    try {
      if (!email || typeof email !== "string" || !email.trim()) {
        throw new ValidationError("Email é obrigatório")
      }
      if (!password || typeof password !== "string" || !password.trim()) {
        throw new ValidationError("Password é obrigatória")
      }

      const user = await UserModel.findOne({ email: email }).populate("posts")

      if (!user) {
        throw new NotFoundError("Usuário não encontrado")
      }

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        user.password as string
      )

      if (!isPasswordCorrect) {
        throw new AuthenticationError("Password incorreta")
      }

      const secret = process.env.SECRET as string
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" })

      return res.status(200).json({
        id: user._id,
        user: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          image: user.image,
          role: user.role,
        },
        token,
      })
    } catch (error) {
      next(error)
    }
  }

  public static async createUser(
    req: Request<{}, {}, CreateUserRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)

    try {
      const { firstname, lastname, email, password, image, role } = req.body

      if (!firstname) {
        throw new ValidationError("O nome é obrigatório")
      }
      if (!lastname) {
        throw new ValidationError("O sobrenome é obrigatório")
      }
      if (!email) {
        throw new ValidationError("O email é obrigatório")
      }
      if (!password || password.length < 6) {
        throw new ValidationError(
          "A password é obrigatória e deve ser maior ou igual a 6"
        )
      }
      if (!role) {
        throw new ValidationError("A role é obrigatória")
      }

      const userExists = await UserModel.findOne({ email })
      if (userExists) {
        throw new CommonError("Usuário já existe", 409)
      }

      const hashedPassword = bcrypt.hashSync(password, salt)
      const user = new UserModel({
        role,
        email,
        lastname,
        firstname,
        image: image,
        password: hashedPassword,
      })
      await user.save()

      const roleInfo = {
        admin:
          "acesso total ao sistema, podendo gerenciar usuários, configurar permissões, e realizar qualquer ação administrativa necessária.",
        storeManager:
          "gerenciar a loja, o que inclui adicionar e atualizar produtos e monitorar o desempenho da loja.",
        publisher:
          "criar, editar e publicar conteúdo, garantindo que as informações disponíveis estejam sempre atualizados e de acordo com os padrões do Clube Overland.",
      }

      const emailProps: EmailProps = {
        to: email,
        data: {
          role: user.role,
          email: user.email,
          password: password,
          lastname: user.lastname,
          firstname: user.firstname,
          roleInfo:
            user.role === "admin"
              ? roleInfo.admin
              : user.role === "store-manager"
              ? roleInfo.storeManager
              : roleInfo.publisher,
        },
        from: "pauloluguenda0@gmail.com",
        template: "admin-welcome-template.ejs",
        subject: "SEJA BEM-VINDO AO OVERLAND ANGOLA",
      }
      await mailSend(emailProps)

      return res.status(201).json({ message: "Usuário criado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async getUsers(
    req: Request<{}, {}, {}, GetUsersQueryParams>,
    res: Response,
    next: NextFunction
  ) {
    const { limit: queryLimit, page: queryPage } = req.query
    const page = parseInt(queryPage) || 1
    const limit = parseInt(queryLimit)
    const skip = limit * (page - 1)
    const totalDocuments = await UserModel.countDocuments()
    const totalPages = Math.ceil(totalDocuments / limit)

    try {
      const users = await UserModel.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .select("-password")

      if (!users) {
        throw new NotFoundError("Não há nenhum usuário ainda.")
      }

      res
        .status(200)
        .json({ total: totalDocuments, pages: totalPages, users: users })
    } catch (error) {
      next(error)
    }
  }

  public static async getSingleUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const user = await UserModel.findById({ _id: id })

      if (!user) {
        throw new NotFoundError("User not found")
      }

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  public static async updateUser(
    req: Request<{ id: string }, {}, UpdateUserRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const { firstname, lastname, image, role, email } = req.body

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: id },
        { firstname, lastname, image, role, email },
        { new: true }
      )

      if (!updatedUser) {
        throw new NotFoundError("Usuário não encontrado")
      }

      return res.status(200).json(updatedUser)
    } catch (error) {
      next(error)
    }
  }

  public static async deleteUser(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const user = await UserModel.findById({ _id: id })

      if (!user) {
        throw new NotFoundError("usuário não encontrado")
      }

      await user.deleteOne()
      return res.status(200).json({ message: "Usuário removido com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  //EM FASE DE TESTES, AINDA NÃO ESTÁ EM USO.
  public static async forgetPassword(req: Request, res: Response) {
    const { email, newPassword } = req.body
    try {
      const user = UserModel.findOne({ email: email })
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }
      const SALT = bcrypt.genSaltSync(10)
      const newHashedPassword = bcrypt.hashSync(newPassword, SALT)
      const newUser = await user.updateOne({ password: newHashedPassword })
      return res.status(200).json(newUser)
    } catch (error) {
      console.error("Error: " + error)
      return res.status(400).json(error)
    }
  }
}
