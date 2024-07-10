import { Request, Response } from "express"
import { PartnerModel } from "../models/partner-model"
import { Types } from "mongoose"

type CreatePartnerReq = {
  image: string
  title: string
  author: string
  content: string
}

type UpdatePartnerReq = {
  image?: string
  title?: string
  author?: string
  content?: string
}

export class Partner {
  public static async createPartner(
    req: Request<{}, {}, CreatePartnerReq>,
    res: Response
  ) {
    try {
      const { author, content, image, title } = req.body
      if (!author || !content || !image || !title) {
        return res
          .status(400)
          .json({ message: "Preencha todos os campos obrigatórios" })
      }
      const partner = new PartnerModel({ title, content, image, author })
      await partner.save()
      return res.status(201).json({ message: "Criado com sucesso" })
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  public static async getAllPartners(req: Request, res: Response) {
    const page = Number(req.query.page) || 1
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
      const partner = await PartnerModel.findById({ _id: id })
      return res.status(200).json(partner)
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  public static async updatePartner(
    req: Request<{ id: string }, {}, UpdatePartnerReq>,
    res: Response
  ) {
    try {
      const { id } = req.params
      const { author, content, image, title } = req.body
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Id inválido" })
      }
      const existingPartner = await PartnerModel.findById({ _id: id })
      if (!existingPartner) {
        return res.status(404).json({ message: "Não encontrado" })
      }

      await existingPartner.updateOne(
        {
          title: title ?? existingPartner.title,
          image: image ?? existingPartner.image,
          author: author ?? existingPartner.author,
          content: content ?? existingPartner.content,
        },
        { new: true }
      )
      return res.status(200).json({ message: "Atualizado com sucesso" })
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  public static async deletePartner(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Id inválido" })
      }
      await PartnerModel.findByIdAndDelete({ _id: id })
      return res.status(200).json({ message: "Eliminado com sucesso" })
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }
}
