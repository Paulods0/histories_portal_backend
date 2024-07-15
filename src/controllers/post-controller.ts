import { Types } from "mongoose"
import { Request, Response } from "express"
import { Post as PostType } from "../types"
import { PostModel } from "../models/post-model"
import { UserModel } from "../models/user-model"
import { EmailProps, mailSend } from "../helpers"
import { SubscriberModel } from "../models/subscriber-model"

export class PostController {
  public static async createPost(
    req: Request<{}, {}, PostType>,
    res: Response
  ) {
    const {
      title,
      category,
      content,
      highlighted,
      mainImage,
      author_id,
      author_notes,
      tag,
      date,
      longitude,
      latitude,
    } = req.body
    if (!title || !mainImage || !content || !category || !date) {
      return res.status(400).json({
        sucess: false,
        message: "Por favor preencha todos os campos obrigatórios.",
      })
    }

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

      if (!Types.ObjectId.isValid(author_id)) {
        return res.status(400).json({
          success: false,
          message: "O id do usuário, não é um id válido.",
        })
      }

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
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado." })
      }
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
        subject: "Newsletter",
        from: "overlandangolateste@gmail.com",
        template: "newsletter-posts-template.ejs",
      }

      await mailSend(data)

      res
        .status(201)
        .json({ success: true, message: "O post foi criado com sucesso." })
    } catch (error) {
      res
        .status(400)
        .json({ success: false, erro: error, message: "Erro ao criar o post." })
    }
  }

  public static async getAllPosts(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1
    const category = req.query.category
    const limit = 20

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
      console.error(error)
      res.status(500).json({
        err: "Erro no servidor, por favor tente novamente!",
        message: error,
      })
    }
  }

  public static async getSinglePost(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const { id } = req.params
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Id inválido." })
      }
      const post = await PostModel.findById(id).populate({
        path: "author",
        select: "_id firstname lastname image",
      })

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Não encontrado.",
        })
      }

      post.views += 1
      await post.save()
      res.status(200).json(post)
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Erro ao tentar obter o post solicitado.",
        erro: error,
      })
    }
  }

  public static async getByCategory(
    req: Request<{ category_slug: string }>,
    res: Response
  ) {
    try {
      const posts = await PostModel.find({
        category_slug: req.params.category_slug,
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
          select: "_id firstname lastname image",
        })
      return res.status(200).json(posts)
    } catch (error) {
      res.status(500).json({
        err: error,
        message: "Erro no servidor ao tentar obter os posts por categoria",
      })
    }
  }

  public static async getHighlightedPost(req: Request, res: Response) {
    try {
      const highlightedPosts = await PostModel.findOne({
        highlighted: true,
      }).populate({
        path: "author",
        select: "firstname lastname",
      })
      res.status(200).json(highlightedPosts)
    } catch (error) {
      res.status(500).json({ err: error })
    }
  }

  public static async getUserPosts(
    req: Request<{ user_id: string }>,
    res: Response
  ) {
    const { user_id } = req.params

    if (!Types.ObjectId.isValid(user_id)) {
      return res
        .status(400)
        .json({ message: "O id do usuário não é um id válido." })
    }

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
      return res.json(error)
    }
  }

  public static async getMostViewedPosts(req: Request, res: Response) {
    try {
      const posts = await PostModel.find().sort({ views: -1 })
      return res.status(200).json(posts)
    } catch (error) {
      return res.status(400).json({ err: error })
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

  public static async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const post = await PostModel.findById({ _id: id })
      if (!post) {
        res.status(400).json({
          message: "Não foi possível deletar o post pois ele não existe",
        })
      }
      await PostModel.deleteOne({ _id: id })
      res.status(200).json({ message: "O post foi deletado" })
    } catch (error) {
      res.status(404).json({ err: "Erro no servidor ao tentar apagar o post" })
    }
  }

  public static async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params
      const {
        title,
        content,
        mainImage,
        date,
        category,
        highlighted,
        tag,
        latitude,
        longitude,
        author,
        author_notes,
      } = req.body
      const postExists = await PostModel.findById(id)
      if (!postExists) {
        return res
          .status(404)
          .json({ message: "O post solicitado não existe!" })
      }
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

      const newPost = await PostModel.findOneAndUpdate(
        { _id: id },
        {
          tag: tag,
          date: date,
          title: title,
          author: author,
          content: content,
          category: category,
          latitude: latitude,
          category_slug: slug,
          mainImage: mainImage,
          longitude: longitude,
          highlighted: highlighted,
          author_notes: author_notes,
        },
        { new: true }
      )
      res.status(200).json({ message: "Post atualizado com sucesso", newPost })
    } catch (error) {
      res
        .status(404)
        .json({ err: "Erro no servidor ao tentar atualizar o post!: " + error })
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
