import {
  PostQueryParams,
  CreatePostRequestDTO,
  UpdatePostRequestDTO,
} from "./post-controller.types"
import { Types } from "mongoose"
import { PostModel } from "../../models/post-model"
import { UserModel } from "../../models/user-model"
import { EmailProps, mailSend } from "../../helpers"
import { NextFunction, Request, Response } from "express"
import { SubscriberModel } from "../../models/subscriber-model"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"

// export const WEBMASTER_EMAIL = "webmaster.overlandangola@aol.com"
export const EMAIL_TEST = "pauloluguenda0@gmail.com"

export class PostController {
  public static async createPost(
    req: Request<{}, {}, CreatePostRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    const {
      tag,
      date,
      title,
      content,
      category,
      latitude,
      longitude,
      mainImage,
      author_id,
      author_notes,
      highlighted,
    } = req.body

    if (!title) throw new ValidationError("O título é obrigatório.")
    if (!date) throw new ValidationError("A categoria é obrigatória.")
    if (!author_id) throw new ValidationError("O autor é obrigatório.")
    if (!content) throw new ValidationError("O conteúdo é obrigatório.")
    if (!category) throw new ValidationError("A categoria é obrigatória.")
    if (!mainImage) throw new ValidationError("A imagem o é obrigatória.")

    try {
      if (highlighted) {
        const currentHighlightedPost = await PostModel.findOne({
          highlighted: true,
        })

        if (currentHighlightedPost) {
          currentHighlightedPost.highlighted = false
          await currentHighlightedPost.save()
        }
      }

      const postSlug = category.toLowerCase().replace(" ", "-")

      if (!Types.ObjectId.isValid(author_id))
        throw new ValidationError("Id inválido.")

      const post = new PostModel({
        date,
        title,
        content,
        tag: tag,
        category,
        mainImage,
        highlighted,
        author: author_id,
        latitude: latitude,
        longitude: longitude,
        category_slug: postSlug,
        author_notes: author_notes,
      })

      const user = await UserModel.findById({ _id: author_id })
      if (!user) throw new NotFoundError("Usuário não encontrado.")

      await post.save()
      user.posts.push(post._id)
      await user?.save()

      const lastPosts = await PostModel.find().limit(3).sort({ createdAt: -1 })

      const subscribers = await SubscriberModel.find()

      let subsEmail: string[] = [""]
      subscribers.forEach((sub) => {
        subsEmail.push(sub.email!!)
      })

      const data: EmailProps = {
        to: subsEmail,
        data: lastPosts,
        from: EMAIL_TEST,
        subject: "NEWSLETTER",
        // from: WEBMASTER_EMAIL,
        template: "newsletter-posts-template.ejs",
      }

      await mailSend(data)

      res.status(201).json({ message: "Criado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async getAllPosts(
    req: Request<{}, {}, {}, PostQueryParams>,
    res: Response,
    next: NextFunction
  ) {
    const { category, limit: queryLimit, page: queryPage } = req.query
    const page = parseInt(queryPage, 10) || 1
    const limit = parseInt(queryLimit) || 20
    const skip = limit * (page - 1)
    const filter = category ? { category_slug: category } : {}
    const totalDocuments = await PostModel.countDocuments(filter)
    const totalPages = Math.ceil(totalDocuments / limit)

    try {
      const posts = await PostModel.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ date: -1 })
        .populate({
          path: "author",
          select: "_id firstname lastname image",
        })
      res.status(200).json({ total: totalDocuments, pages: totalPages, posts })
    } catch (error) {
      next(error)
    }
  }

  public static async getSinglePost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      const post = await PostModel.findById(id).populate({
        path: "author",
        select: "_id firstname lastname image",
      })

      if (!post) throw new NotFoundError("Não encontrado.")

      post.views += 1
      await post.save()
      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  public static async getHighlightedPost(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const highlightedPosts = await PostModel.findOne({
        highlighted: true,
      }).populate({
        path: "author",
        select: "firstname lastname",
      })
      res.status(200).json(highlightedPosts)
    } catch (error) {
      next(error)
    }
  }

  public static async getUserPosts(
    req: Request<{ user_id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id } = req.params

    if (!Types.ObjectId.isValid(user_id))
      throw new ValidationError("Id inválido.")

    try {
      const posts = await PostModel.find({
        author: {
          _id: user_id,
        },
      }).populate({
        path: "author",
        select: "_id firstname lastname image",
      })

      return res.json(posts)
    } catch (error) {
      next(error)
    }
  }

  public static async getMostViewedPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const posts = await PostModel.find().sort({ views: -1 })
      return res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  }

  public static async getSearchedPosts(req: Request, res: Response) {
    const value = req.query.value || "".toLowerCase()
    try {
      const posts = await PostModel.find()
        .populate({
          path: "author",
          select: "firstname lastname",
        })
        .sort({ createdAt: -1 })

      const searchResults = posts.filter((post) =>
        post.title.toLowerCase().includes(value as string)
      )
      res.status(200).json({ data: searchResults, count: searchResults.length })
    } catch (error) {
      console.error(error)
      res.status(404).json(error)
    }
  }

  public static async deletePost(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const post = await PostModel.findById({ _id: id })

      if (!post) throw new NotFoundError("Não encontrado.")

      await PostModel.deleteOne({ _id: id })
      res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async updatePost(
    req: Request<{ id: string }, {}, UpdatePostRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params
      const {
        tag,
        date,
        title,
        category,
        content,
        latitude,
        longitude,
        mainImage,
        author_id,
        highlighted,
        author_notes,
      } = req.body

      const postExists = await PostModel.findById(id)

      if (!postExists) throw new ValidationError("Não encontrado.")

      if (highlighted) {
        const currentlyHighlighted = await PostModel.findOne({
          highlighted: true,
        })
        if (currentlyHighlighted) {
          currentlyHighlighted.highlighted = false
          await currentlyHighlighted.save()
        } else {
          postExists.highlighted = true
          await postExists.save()
        }
      }

      const slug = category
        ? category.toLowerCase().replace(" ", "-")
        : postExists.category_slug

      await PostModel.findOneAndUpdate(
        { _id: id },
        {
          tag: tag,
          date: date,
          title: title,
          content: content,
          author: author_id,
          category: category,
          latitude: latitude,
          category_slug: slug,
          mainImage: mainImage,
          longitude: longitude,
          highlighted: highlighted,
          author_notes: author_notes,
        }
      )
      res.status(200).json({ message: "Atualizado com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  public static async likePost(req: Request, res: Response) {
    try {
      const post = await PostModel.findById(req.params.id)
      if (!post) {
        return res.status(404).json({ message: "Não encontrado" })
      }
      post.rating += 1
      await post.save()
      return res.status(200).json({ clicked: true, rating: post.rating })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Erro No Servidor" })
    }
  }

  public static async deslikePost(req: Request, res: Response) {
    try {
      const post = await PostModel.findById(req.params.id)
      if (!post) {
        return res.status(404).json({ message: "Não encontrado" })
      }
      if (post.rating >= 1) {
        post.rating -= 1
      } else {
        return res.status(400).json(post.rating)
      }
      await post.save()
      return res.status(200).json({ clicked: false, rating: post.rating })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Erro No Servidor" })
    }
  }

  public static async getMostLikedPosts(req: Request, res: Response) {
    try {
      const posts = await PostModel.find()
        .populate({
          path: "author",
          select: "firstname lastname",
        })
        .sort({ rating: -1 })
        .limit(3)
      return res.status(200).json(posts)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: "Error" + error })
    }
  }
}
