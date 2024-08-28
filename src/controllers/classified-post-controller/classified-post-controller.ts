import {
  ClassifiedsQueryParams,
  CreateClassifiedPostRequestDTO,
  UpdateClassifiedPostRequestDTO,
} from "./classified-post.types"
import { Types } from "mongoose"
import { NextFunction, Request, Response } from "express"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"
import { ClassifiedPostModel } from "../../models/classified-post-model"

export class ClassifiedPostController {
  public static async createClassifiedsPost(
    req: Request<{}, {}, CreateClassifiedPostRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { author, content, mainImage, price, title, type, images } =
        req.body

      if (!author) {
        throw new ValidationError("O autor é obrigatório.")
      }
      if (!content) {
        throw new ValidationError("O conteúdo é obrigatório.")
      }
      if (!mainImage) {
        throw new ValidationError("A imagem é obrigatória.")
      }
      if (!price) {
        throw new ValidationError("O preço é obrigatório.")
      }
      if (!title) {
        throw new ValidationError("O título é obrigatório.")
      }
      if (!type) {
        throw new ValidationError("O tipo é obrigatório.")
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
      return res.status(201).json({ message: "Criado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async getSinlgeClassifiedPost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json()
      }

      const post = await ClassifiedPostModel.findById(id)

      if (!post) {
        throw new NotFoundError("Não encontrado.")
      }

      return res.status(200).json({ data: post })
    } catch (error) {
      next(error)
    }
  }

  public static async getAllClassifiedPost(
    req: Request<{}, {}, {}, ClassifiedsQueryParams>,
    res: Response,
    next: NextFunction
  ) {
    const { page: queryPage } = req.query
    const page = parseInt(queryPage, 10) || 1
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
        throw new NotFoundError("Não há nenhum post ainda.")
      }

      return res
        .status(200)
        .json({ total: totalDocuments, pages: totalPages, posts })
    } catch (error) {
      next(error)
    }
  }

  public static async deleteClassifiedPost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido")
      }

      const post = await ClassifiedPostModel.findById(id)

      if (!post) {
        throw new NotFoundError("Não encontrado.")
      }

      await post.deleteOne()

      return res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async updateClassifiedPost(
    req: Request<{ id: string }, {}, UpdateClassifiedPostRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const { newStatus, images } = req.body

      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido.")
      }

      const existingPost = await ClassifiedPostModel.findById(id)
      if (!existingPost) {
        throw new NotFoundError("Não encontrado.")
      }

      await existingPost.updateOne({ status: newStatus, images: images })
      return res.status(200).json({ message: "Atualizado com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}
