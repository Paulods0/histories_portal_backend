import { Request, Response } from "express"
import { UserModel } from "../models/user-model"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { User as UserType } from "../types"
import { UpdateUser } from "../types/update"

export class UserController {
  public static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      if (!email) {
        return res.status(400).json({ message: "Email é obrigatório" })
      }
      if (!password) {
        return res.status(400).json({ message: "Password é obrigatória" })
      }

      const user = await UserModel.findOne({ email }).populate("posts")

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }
      //@ts-ignore
      const isPasswordCorrect = bcrypt.compareSync(password, user.password)

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Password incorreta" })
      }

      const secret = process.env.SECRET as string
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" })

      res.status(200).json({
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
      res.status(400).json({ error })
    }
  }

  public static async createUser(
    req: Request<{}, {}, UserType>,
    res: Response
  ) {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    try {
      const { firstname, lastname, email, password, image, role } = req.body
      if (!firstname) {
        return res.status(400).json({ message: "Firstname is required" })
      }
      if (!lastname) {
        return res.status(400).json({ message: "Lastname is required" })
      }
      if (!email) {
        return res.status(400).json({ message: "Email is required" })
      }
      if (!password || password.length < 6) {
        return res.status(400).json({
          message: "Password is required and should be greather or equal to 6",
        })
      }
      if (!role) {
        return res.status(400).json({
          message: "A role é obrigatória",
        })
      }

      const userExists = await UserModel.findOne({ email })
      if (userExists) {
        return res.status(409).json({ message: "User already exists" })
      }
      const hashedPassword = bcrypt.hashSync(password, salt)
      const user = new UserModel({
        role,
        email,
        firstname,
        lastname,
        image: image,
        password: hashedPassword,
      })
      const response = await user.save()
      res.status(201).json({ message: "User saved successfully", response })
    } catch (error) {
      res.status(500).json({ error: error, message: "Could not create user" })
    }
  }

  public static async getUsers(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = 2
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
        return res.status(404).json({ message: "Não há nenhum usuário" })
      }

      res.status(200).json({ pages: totalPages, users: users })
    } catch (error) {
      res.status(500).json({ error: error, message: "Internal Server Error" })
    }
  }

  public static async getSingleUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await UserModel.findById({ _id: id })
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(404).json({ error: error, message: "User not found" })
    }
  }

  public static async updateUser(
    req: Request<{ id: string }, {}, UpdateUser>,
    res: Response
  ) {
    try {
      const { id } = req.params
      const { firstname, lastname, image, role, email } = req.body
      const newUser = await UserModel.findOneAndUpdate(
        { _id: id },
        { firstname, lastname, image, role, email },
        { new: true }
      )
      res.status(200).json(newUser)
    } catch (error) {
      res
        .status(404)
        .json({ error: error, message: "Erro ao atualizar o usuário" })
    }
  }

  public static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const user = await UserModel.findById({ _id: id })

      if (!user) {
        return res.status(404).json({ message: "usuário não encontrado" })
      }
      //@ts-ignore
      await user.deleteOne()
      res.status(200).json({ message: "Usuário removido com sucesso" })
    } catch (error) {
      res
        .status(400)
        .json({ error: error, message: "Erro ao remover o usuário" })
    }
  }

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
