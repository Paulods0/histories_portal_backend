import { Request, Response } from "express"
import { UserModel } from "../models/auth-model"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import { User } from "../types"
import { UpdateUser } from "../types/update"
import { PostModel } from "../models/post-model"

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" })
    }

    const user = await UserModel.findOne({ email }).populate("posts")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    //@ts-ignore
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password incorrect" })
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
export const createUser = async (req: Request<{}, {}, User>, res: Response) => {
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
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find()
      .sort({ createdAt: -1 })
      .select("-password")
    if (!users) {
      return res.status(404).json({ message: "There is no users" })
    }
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error, message: "Internal Server Error" })
  }
}
export const getSingleUser = async (req: Request, res: Response) => {
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
export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUser>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { firstname, lastname, image, role } = req.body
    const newUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { firstname, lastname, image, role },
      { new: true }
    )
    res.status(200).json(newUser)
  } catch (error) {
    res
      .status(404)
      .json({ error: error, message: "Erro ao atualizar o usuário" })
  }
}
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await UserModel.findById({ _id: id })

    if (!user) {
      return res.status(404).json({ message: "usuário não encontrado" })
    }

    await user.deleteOne()
    res.status(200).json({ message: "Usuário removido com sucesso" })
  } catch (error) {
    res.status(400).json({ error: error, message: "Erro ao remover o usuário" })
  }
}
export const forgetPassword = async (req: Request, res: Response) => {
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

// export const testAuthMail = async (req: Request, res: Response) => {
//   try {
//     const { email, firstname, lastname, password, role } = req.body
//     const user = {
//       email,
//       firstname,
//       lastname,
//       password,
//       role,
//       roleInfo: "",
//     }
//     let roleInfo = ""
//     if (role === "admin") {
//       roleInfo =
//         "ter acesso à todas as funcionalidades do site, tais como: adicionar novos usuários e fazer a gestão dos mesmos, publicar, editar e remover posts, fazer a gestão da loja (adicionar produtos e removê-los)."
//     } else if (role === "publicator") {
//       roleInfo =
//         "fazer publicações bem como gerir as mesmas. Não poderá adicionar novos usuários nem gerir os produtos da loja."
//     } else {
//       roleInfo =
//         "fazer a gestão dos produtos da loja. Não poderá fazer publicações nem adicionar novos usuários."
//     }
//     await welcomeUserMail({ ...user, roleInfo: roleInfo })
//     return res
//       .status(200)
//       .json({ message: `Email enviado com sucesso para: ${email}`, user })
//   } catch (error) {
//     return res.status(400).json(error)
//     console.log(error)
//   }
// }

// export const testAuthMail = async (
//   req: Request<{}, {}, BuyProductData>,
//   res: Response
// ) => {
//   try {
//     const { product, user } = req.body

//     await buyProduct({ product, user })

//     return res
//       .status(200)
//       .json({ message: `Email enviado com sucesso para: ${user.email}`, user })
//   } catch (error) {
//     return res.status(400).json(error)
//     console.log(error)
//   }
// }
