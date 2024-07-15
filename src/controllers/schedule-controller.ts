import { Request, Response } from "express"
import { SchedulePost } from "../types"
import { ScheduleModel } from "../models/schedule-model"
import { Types } from "mongoose"

export class ScheduleController {
  public static async createSchedulePost  (
    req: Request<{}, {}, SchedulePost>,
    res: Response
  )  {
    try {
      const { author, file, title } = req.body
      if (!author || !file || !title) {
        return res.status(400).json({
          succes: false,
          message: "Por favor preencha todos os campos obrigatórios.",
        })
      }

      const schedulePost = new ScheduleModel({
        author,
        title,
        file,
      })

      await schedulePost.save()
      return res
        .status(201)
        .json({ success: true, message: "Post criado com sucesso." })
    } catch (error) {
      console.log("Erro no servidor: " + error)
      return res.status(400).json({ message: "Erro no servidor: " + error })
    }
  }

  public static async getAllSchedulePosts  (req: Request, res: Response)  {
    const page = parseInt(req.query.page as string) || 1
    const postPerPage = 12
    const skip = postPerPage * (page - 1)

    const totalPosts = await ScheduleModel.countDocuments()
    const pages = Math.ceil(totalPosts / postPerPage)

    try {
      const post = await ScheduleModel.find()
        .limit(postPerPage)
        .skip(skip)
        .sort({ createdAt: -1 })

      return res
        .status(200)
        .json({ total: totalPosts, pages: pages, posts: post })
    } catch (error) {
      console.log("Erro no servidor: " + error)
      return res.status(400).json({ message: "Erro no servidor: " + error })
    }
  }

  public static async getSingleSchedulePost  (
    req: Request<{ id: string }>,
    res: Response
  )  {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Id inválido." })
      }

      const existingPost = await ScheduleModel.findById(id).populate({
        path: "author",
        select: "_id firstname lastname image",
      })
      if (!existingPost) {
        return res
          .status(404)
          .json({ success: false, message: "Não encontrado." })
      }
      return res.status(200).json({ success: true, data: existingPost })
    } catch (error) {
      console.log("Erro no servidor: " + error)
      return res.status(400).json({ message: "Erro no servidor: " + error })
    }
  }

  public static async updateSchedulePost  (
    req: Request<{ id: string }, {}, SchedulePost>,
    res: Response
  )  {
    try {
      const { id } = req.params
      const { author, file, title } = req.body
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Id inválido." })
      }

      const updatedPost = await ScheduleModel.findByIdAndUpdate(
        { _id: id },
        {
          author,
          file,
          title,
        },
        { new: true }
      )

      return res.status(200).json({
        success: true,
        message: "Atualizado com sucesso.",
        data: updatedPost,
      })
    } catch (error) {
      console.log("Erro no servidor: " + error)
      return res.status(400).json({ message: "Erro no servidor: " + error })
    }
  }
  
  public static async deleteSchedulePost  (req: Request<{ id: string }>, res: Response)  {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Id inválido." })
      }

      const existingSchedulePost = await ScheduleModel.findById(id)
      if (!existingSchedulePost) {
        return res
          .status(404)
          .json({ success: false, message: "Não encontrado." })
      }
      await existingSchedulePost.deleteOne()
      return res
        .status(200)
        .json({ success: true, message: "Apagado com sucesso." })
    } catch (error) {
      console.log("Erro no servidor: " + error)
      return res.status(400).json({ message: "Erro no servidor: " + error })
    }
  }
}
