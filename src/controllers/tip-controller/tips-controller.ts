import {
  CreateTipRequestDTO,
  UpdateTipRequestDTO,
} from "./tip-controller.types"
import { Types } from "mongoose"
import { TipsModel } from "../../models/tips-model"
import { NextFunction, Request, Response } from "express"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"

export class TipController {
  public static async createTip(
    req: Request<{}, {}, CreateTipRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { author_notes, category, author, content, image, title } = req.body
      if (!title) {
        throw new ValidationError("O título é obrigatório")
      }
      if (!image) {
        throw new ValidationError("A imagem é obrigatória")
      }
      if (!author) {
        throw new ValidationError("O autor é obrigatório")
      }
      if (!content) {
        throw new ValidationError("O conteúdo é obrigatório")
      }

      const newTip = new TipsModel({
        title,
        image,
        author,
        content,
        category,
        author_notes,
      })
      await newTip.save()
      return res.status(200).json({ message: "A dica foi criada com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  public static async getTips(req: Request, res: Response) {
    const page = Number(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit

    try {
      const totalDocuments = await TipsModel.countDocuments()
      const totalPages = Math.ceil(totalDocuments / limit)

      const allTips = await TipsModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "author",
          select: "_id image firstname lastname",
        })

      return res.status(200).json({ pages: totalPages, posts: allTips })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ error })
    }
  }

  public static async getSingleTip(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido.")
      }

      const tip = await TipsModel.findById({ _id: id }).populate({
        path: "author",
        select: "_id firstname lastname image",
      })

      if (!tip) {
        throw new NotFoundError("Não encontrado.")
      }

      return res.status(200).json(tip)
    } catch (error) {
      next(error)
    }
  }

  public static async updateTip(
    req: Request<{ id: string }, {}, UpdateTipRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const { author, content, image, title, author_notes } = req.body

      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido")
      }

      await TipsModel.findByIdAndUpdate(
        { _id: id },
        { author, title, content, image, author_notes }
      )

      return res.status(200).json({ message: "Atualizado com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  public static async deleteTip(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido.")
      }

      await TipsModel.findByIdAndDelete({ _id: id })

      return res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}
