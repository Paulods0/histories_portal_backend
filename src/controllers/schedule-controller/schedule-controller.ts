import {
  ScheduleQueryParams,
  CreateScheduleRequestDTO,
  UpdateScheduleRequestDTO,
} from "./schedule-controller.types"
import { Types } from "mongoose"
import { NextFunction, Request, Response } from "express"
import { ScheduleModel } from "../../models/schedule-model"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"

export class ScheduleController {
  public static async createSchedulePost(
    req: Request<{}, {}, CreateScheduleRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { author, file, title } = req.body

      if (!author) throw new ValidationError("O autor é obrigatório.")
      if (!title) throw new ValidationError("O título é obrigatório.")
      if (!file) throw new ValidationError("O ficheiro é obrigatório.")

      const schedulePost = new ScheduleModel({ author, title, file })
      await schedulePost.save()

      return res.status(201).json({ message: "Criado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async getAllSchedulePosts(
    req: Request<{}, {}, {}, ScheduleQueryParams>,
    res: Response,
    next: NextFunction
  ) {
    const { page: queryPage } = req.query
    const page = parseInt(queryPage) || 1
    const postPerPage = 2
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
      next(error)
    }
  }

  public static async getSingleSchedulePost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      const existingPost = await ScheduleModel.findById(id).populate({
        path: "author",
        select: "_id firstname lastname image",
      })

      if (!existingPost) throw new NotFoundError("Não encontrado.")

      return res.status(200).json({ data: existingPost })
    } catch (error) {
      next(error)
    }
  }

  public static async updateSchedulePost(
    req: Request<{ id: string }, {}, UpdateScheduleRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const { author, file, title } = req.body

      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      await ScheduleModel.findByIdAndUpdate(
        { _id: id },
        {
          author,
          file,
          title,
        }
      )

      return res.status(200).json({ message: "Atualizado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async deleteSchedulePost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      const existingSchedulePost = await ScheduleModel.findById(id)
      if (!existingSchedulePost) throw new NotFoundError("Não encontrado.")

      await existingSchedulePost.deleteOne()
      return res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}
