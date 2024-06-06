import { Request, Response } from "express"
import { TipsModel } from "../models/tips-model"
import { Types } from "mongoose"

type CreateTipRequest = {
  title: string
  image: string
  author: string
  content: string
  category: string
}

type UpdateTipRequest = {
  title?: string
  image?: string
  author?: string
  content?: string
  category?: string
}

export const createTip = async (
  req: Request<{}, {}, CreateTipRequest>,
  res: Response
) => {
  try {
    const { author, content, image, title } = req.body
    if (!author || !content || !image || !title) {
      return res
        .status(500)
        .json({ message: "Preencha todos os campos obrigatórios" })
    }
    const newTip = new TipsModel({
      title,
      author,
      content,
      image,
    })
    await newTip.save()
    return res.status(200).json({ message: "A dica foi criada com sucesso" })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
export const getTips = async (req: Request, res: Response) => {
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
export const getSingleTip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      return res.status(500).json({ message: "Id inválido" })
    }

    const tip = await TipsModel.findById({ _id: id }).populate({
      path: "author",
      select: "_id firstname lastname image",
    })

    if (!tip) {
      return res.status(404).json({ message: "Dica não encontrada" })
    }

    return res.status(200).json(tip)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
export const updateTip = async (
  req: Request<{ id: string }, {}, UpdateTipRequest>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { author, content, image, title } = req.body

    if (!Types.ObjectId.isValid(id)) {
      return res.status(500).json({ message: "Id inválido" })
    }
    const updatedTip = await TipsModel.findByIdAndUpdate(
      { _id: id },
      { author, title, content, image },
      { new: true }
    )
    return res.status(200).json({ message: "Atualizado", updatedTip })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
export const deleteTip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) {
      return res.status(500).json({ message: "Id inválido" })
    }
    await TipsModel.findByIdAndDelete({ _id: id })
    return res.status(200).json({ message: "Tip deletado" })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
