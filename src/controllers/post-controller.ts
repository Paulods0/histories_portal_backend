import { Request, Response } from "express"
import { PostModel } from "../models/post-model"
import { Types } from "mongoose"
import { UserModel } from "../models/auth-model"
import { Post } from "../types"
import { SubscriberModel } from "../models/subscriber-model"
import { sendNewsletterPosts } from "../helpers"

const createPost = async (req: Request<{}, {}, Post>, res: Response) => {
  const {
    title,
    category,
    content,
    highlighted,
    mainImage,
    author_id,
    author_notes,
    tag,
    longitude,
    latitude,
  } = req.body
  if (!title || !mainImage || !content || !category) {
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

    const lastPosts = await PostModel
      .find()
      .limit(3)
      .sort({ createdAt: -1 })

    const subscribers = await SubscriberModel.find()

    let subsEmail: string[] = [""]
    subscribers.forEach((sub) => {
      subsEmail.push(sub.email!!)
    })

    await sendNewsletterPosts(subsEmail, lastPosts)

    res
      .status(201)
      .json({ success: true, message: "O post foi criado com sucesso." })
  } catch (error) {
    res
      .status(400)
      .json({ success: false, erro: error, message: "Erro ao criar o post." })
  }
}
const getAllPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1
  const category = req.query.category
  const limit = parseInt(req.query.limit as string) || 4

  const skip = limit * (page - 1)

  const filter = category ? { category_slug: category } : {}
  const totalDocuments = await PostModel.countDocuments(filter)
  const totalPages = Math.ceil(totalDocuments / limit)

  try {
    const posts = await PostModel.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
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
const getAllPostsPagination = async (req: Request, res: Response) => {
  const postsPerPage = 7
  const page = req.params.page || 1
  const skipp = postsPerPage * Number(page)

  try {
    const totalPosts = await PostModel.countDocuments()
    let posts
    if (req.params.page) {
      posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
          select: "_id firstname lastname image",
        })
        .populate({
          path: "category",
          select: "_id name",
        })
        .limit(postsPerPage)
        .skip(skipp)
    } else {
      posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
          select: "_id firstname lastname image",
        })
        .populate({
          path: "category",
          select: "_id name",
        })
    }

    const totalPages = Math.floor(totalPosts / postsPerPage)
    return res.status(200).json({ pages: totalPages, posts })
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor, por favor tente novamente!" })
  }
}
const getSinglePost = async (req: Request<{ id: string }>, res: Response) => {
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
const getByCategory = async (
  req: Request<{ category_slug: string }>,
  res: Response
) => {
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
const getHighlightedPost = async (req: Request, res: Response) => {
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
const getUserPosts = async (
  req: Request<{ user_id: string }>,
  res: Response
) => {
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
const getMostViewedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().sort({ views: -1 })
    return res.status(200).json(posts)
  } catch (error) {
    return res.status(400).json({ err: error })
  }
}
const getSearchedPosts = async (req: Request, res: Response) => {
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
const deletePost = async (req: Request, res: Response) => {
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
const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const {
      title,
      content,
      mainImage,
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
      return res.status(404).json({ message: "O post solicitado não existe!" })
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
        title: title,
        mainImage: mainImage,
        content: content,
        highlighted: highlighted,
        category: category,
        tag: tag,
        latitude: latitude,
        longitude: longitude,
        author: author,
        author_notes: author_notes,
        category_slug: slug,
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
const likePost = async (req: Request, res: Response) => {
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
const deslikePost = async (req: Request, res: Response) => {
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
const testController = async (req: Request, res: Response) => {
  const categoryId = req.query.category || ""
  try {
    const search = req.query.name || ""
    const postLimit = Number(req.query.limit || 5)
    const posts = await PostModel.find({
      title: { $regex: search, $options: "i" },
    })
      .where("category")
      .equals(categoryId)
      .limit(postLimit)

    if (!posts) {
      return res.status(404).json({ message: "Not foud", posts })
    }
    return res.status(200).json(posts)
  } catch (error) {
    return res.status(400).json({ message: "Error", err: error })
  }
}
const getMostLikedPosts = async (req: Request, res: Response) => {
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

export {
  createPost,
  getAllPosts,
  deletePost,
  getByCategory,
  getMostLikedPosts,
  getAllPostsPagination,
  getSearchedPosts,
  getSinglePost,
  getUserPosts,
  getHighlightedPost,
  updatePost,
  getMostViewedPosts,
  likePost,
  deslikePost,
  testController,
}
