import { Request, Response } from "express"
import { ClassifiedPost as ClassifiedPostType } from "../types"
import { ClassifiedPostModel } from "../models/classified-post-model"
import { Types } from "mongoose"

export class ClassifiedPostController {
  public static async createClassifiedsPost(
    req: Request<{}, {}, ClassifiedPostType>,
    res: Response
  ) {
    try {
      const { author, content, mainImage, price, title, type, images } =
        req.body
      if (!author || !content || !mainImage || !price || !title || !type) {
        return res.status(400).json({
          success: false,
          message: "Por favor preencha todos os campos obrigatórios.",
        })
      }

      const CATEGORY = "classificados"
      const slug = CATEGORY.toLowerCase().replace(" ", "-")

      const newClassifiedPost = new ClassifiedPostModel({
        type,
        title,
        price,
        author,
        images,
        content,
        mainImage,
        category: CATEGORY,
        category_slug: slug,
      })

      await newClassifiedPost.save()
      return res.status(201).json({
        success: true,
        message: "Post criado com sucesso.",
      })
    } catch (error) {
      console.error("Error: " + error)
      return res
        .status(400)
        .send({ success: false, message: "Erro no servidor: " + error })
    }
  }
  public static async getSinlgeClassifiedPost(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json()
      }

      const post = await ClassifiedPostModel.findById(id)
      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado." })
      }
      return res.status(200).json({ success: true, data: post })
    } catch (error) {
      console.error("Error: " + error)
      return res.status(400).send({ message: "Erro no servidor: " + error })
    }
  }
  public static async getAllClassifiedPost(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1
    const limit = 20

    const skip = limit * (page - 1)
    const totalDocuments = await ClassifiedPostModel.countDocuments()
    const totalPages = Math.ceil(totalDocuments / limit)

    try {
      const posts = await ClassifiedPostModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      if (!posts || posts.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Não há nenhum post ainda." })
      }

      return res
        .status(200)
        .json({ total: totalDocuments, pages: totalPages, posts })
    } catch (error) {
      console.error("Error: " + error)
      return res.status(400).send({ message: "Erro no servidor: " + error })
    }
  }
  public static async deleteClassifiedPost(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Id inválido." })
      }

      const post = await ClassifiedPostModel.findById(id)

      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Não encontrado." })
      }

      await post.deleteOne()
      return res
        .status(200)
        .json({ success: true, message: "Apagado com sucesso." })
    } catch (error) {
      console.error("Error: " + error)
      return res.status(400).send({ message: "Erro no servidor: " + error })
    }
  }
  public static async updateClassifiedPost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { newStatus, images } = req.body

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Id inválido." })
      }

      const existingPost = await ClassifiedPostModel.findById(id)
      if (!existingPost) {
        return res
          .status(404)
          .json({ success: false, message: "Post não encontrado" })
      }

      await existingPost.updateOne(
        { status: newStatus, images: images },
        { new: true }
      )

      return res.status(200).json({
        success: true,
        message: "Atualizado com sucesso!",
        existingPost,
      })
    } catch (error) {
      console.error("Error: " + error)
      return res.status(400).send({ message: "Erro no servidor: " + error })
    }
  }
}
