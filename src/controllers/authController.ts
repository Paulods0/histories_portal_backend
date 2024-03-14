import { Request, Response } from "express"
import { UserModel } from "../models/userModel"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" })
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    const secret = process.env.SECRET as string
    const token = jwt.sign({ id: user._id, name: user.firstname }, secret)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password incorrect" })
    }
    res.status(200).json({ message: "Success", token })
  } catch (error) {
    res.status(400).json({ error })
  }
}
export const createUser = async (req: Request, res: Response) => {
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  try {
    const { firstname, lastname, email, password } = req.body
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
    const userExists = await UserModel.findOne({ email })
    if (userExists) {
      return res.status(409).json({ message: "User already exists" })
    }
    const hashedPassword = bcrypt.hashSync(password, salt)
    const user = new UserModel({
      firstname,
      lastname,
      email,
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
    res.status(200).json({ message: "ok", user })
  } catch (error) {
    res.status(404).json({ error: error, message: "User not found" })
  }
}
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { firstame, lastname } = req.body
    const newUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { firstame, lastname },
      { new: true }
    )
    res.status(200).json({ message: "User succefuly updated", newUser })
  } catch (error) {
    res.status(404).json({ error: error, message: "Error while updating user" })
  }
}
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await UserModel.findOneAndDelete({ _id: id })
    res.status(200).json({ message: "User deleted successfuly" })
  } catch (error) {
    res.status(400).json({ error: error, message: "Error while deleting user" })
  }
}
