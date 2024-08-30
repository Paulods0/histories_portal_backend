import {
  CreatePartnerRequestDTO,
  PartnerQueryParams,
  UpdatePartnerRequestDTO,
} from "./partner-controller.types"
import { Types } from "mongoose"
import { NextFunction, Request, Response } from "express"
import { PartnerModel } from "../../models/partner-model"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"

export class PartnerController {
  public static async createPartner(
    req: Request<{}, {}, CreatePartnerRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { author, content, image, title, date, tags, author_notes } =
        req.body

      if (!content) {
        throw new ValidationError("O conteúdo é obrigatório.")
      }
      if (!image) {
        throw new ValidationError("A imagem é obrigatório.")
      }
      if (!author) {
        throw new ValidationError("O autor é obrigatório.")
      }
      if (!title) {
        throw new ValidationError("O título é obrigatório.")
      }
      if (!date) {
        throw new ValidationError("A data é obrigatória.")
      }

      const partner = new PartnerModel({
        title,
        content,
        image,
        author,
        author_notes,
        tags,
        date,
      })
      await partner.save()

      return res.status(201).json({ message: "Criado com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  public static async getAllPartners(
    req: Request<{}, {}, {}, PartnerQueryParams>,
    res: Response
  ) {
    const { page: queryPage } = req.query

    const page = Number(queryPage) || 1
    const limit = 20
    const skip = limit * (page - 1)

    try {
      const totalDocuments = await PartnerModel.countDocuments()
      const partners = await PartnerModel.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate({
          path: "author",
          select: "_id firstname lastname image",
        })

      const pages = Math.ceil(totalDocuments / limit)

      return res.status(200).json({ pages, partners })
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  public static async getSinglePartner(req: Request, res: Response) {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Id inválido" })
      }
      const partner = await PartnerModel.findById({ _id: id }).populate({
        path: "author",
        select: "-id firstname lastname",
      })
      return res.status(200).json(partner)
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  public static async updatePartner(
    req: Request<{ id: string }, {}, UpdatePartnerRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const { author_notes, date, tags, author, content, image, title } =
        req.body

      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido")
      }

      const existingPartner = await PartnerModel.findById({ _id: id })
      if (!existingPartner) {
        throw new NotFoundError("Id inválido")
      }

      await existingPartner.updateOne({
        tags: tags ?? existingPartner.tags,
        date: date ?? existingPartner.date,
        title: title ?? existingPartner.title,
        image: image ?? existingPartner.image,
        author: author ?? existingPartner.author,
        content: content ?? existingPartner.content,
        author_notes: author_notes ?? existingPartner.author_notes,
      })

      return res.status(200).json({ message: "Atualizado com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  public static async deletePartner(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Id inválido.")
      }
      await PartnerModel.findByIdAndDelete({ _id: id })
      return res.status(200).json({ message: "Removido com sucesso" })
    } catch (error) {
      next(error)
    }
  }
}
