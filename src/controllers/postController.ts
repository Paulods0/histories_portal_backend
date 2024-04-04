import { Request, Response } from "express"
import { IPostDB, PostModel } from "../models/postModel"
import { Schema, Types } from "mongoose"
import { UserModel } from "../models/userModel"

// CREATE POST
const createPost = async (req: Request, res: Response) => {
  // const userId = req.headers
  const {
    title,
    category,
    content,
    isHighlighted,
    mainImage,
    author_id,
    author_notes,
    tag,
    longitude,
    latitude,
  } = req.body
  if (!title) {
    return res.status(400).json({ message: "O título é obrigatório" })
  }
  if (!category) {
    return res.status(400).json({ message: "A categoria é obrigatória" })
  }
  if (!content) {
    return res.status(400).json({ message: "O conteúdo é obrigatório" })
  }
  if (!mainImage) {
    return res.status(400).json({ message: "A imagem principal é obrigatória" })
  }
  try {
    if (isHighlighted) {
      const currentlyHighlighted = await PostModel.findOne({
        isHighlighted: true,
      })
      if (currentlyHighlighted) {
        currentlyHighlighted.isHighlighted = false
        await currentlyHighlighted.save()
      }
    }
    const post = new PostModel({
      title,
      category,
      content,
      isHighlighted,
      mainImage,
      author: author_id,
      author_notes: author_notes,
      tag: tag ? tag : [],
      longitude: longitude ? longitude : "",
      latitude: latitude ? latitude : "",
    })
    const user = await UserModel.findById(author_id)

    await post.save()
    user?.posts.push(post._id)
    await user?.save()
    res.status(200).json({ message: "O post foi criado", data: post })
  } catch (error) {
    res.status(404).json({ error, err: "Fail while creating the post" })
  }
}
// GET ALL POSTS
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "_id firstname lastname image",
      })
      .populate({
        path: "category",
        select: "_id name",
      })

    res.status(200).json(posts)
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor, por favor tente novamente!" })
  }
}
const getAllPostsPagination = async (req: Request, res: Response) => {
  const postsPerPage = 3
  const { page } = req.query
  const skipp = postsPerPage * Number(page)
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("category")
      .limit(postsPerPage)
      .skip(skipp)

    if (posts.length === 0) {
      return res.status(500).json({ message: "Nada a mostrar" })
    }
    res.status(200).json({ posts: posts.length, data: posts })
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor, por favor tente novamente!" })
  }
}
// GET SINGLE POST
const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const post = await PostModel.findById({ _id: id })
      .populate("category")
      .populate({
        path: "author",
        select: "_id firstname lastname image",
      })

    if (!post) {
      return res
        .status(404)
        .json({ error: "O post solicitado não foi encontrado!" })
    }

    post.views += 1
    post.save()
    res.status(200).json(post)
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor ao tentar obter o post solicitado" })
  }
}
//GET POST BY CATEGORY
const getAllPostsByCategory = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({
      category: req.params.category,
    })
      .populate({
        path: "author",
        select: "_id firstname lastname image",
      })
      .populate({
        path: "category",
        select: ":_id name",
      })

    const filteredPosts: {
      title: string
      mainImage: string
      content: string
      author: Schema.Types.ObjectId
      isHighlighted: boolean
      author_notes?: string
      category: Schema.Types.ObjectId
    }[] = posts.filter((post) => post.category !== null)

    if (!filteredPosts) {
      return res.status(404).json({ message: "O post não foi encontrado!" })
    }
    res.status(200).json(filteredPosts)
  } catch (error) {
    res.status(500).json({
      err: error,
      message: "Erro no servidor ao tentar obter os posts por categoria",
    })
  }
}
//GET HIGHLIGHTED POST
const getHighlightedPost = async (req: Request, res: Response) => {
  try {
    const highlightedPosts = await PostModel.findOne({
      isHighlighted: true,
    }).populate({
      path: "author",
      select: "firstname lastname",
    })
    res.status(200).json(highlightedPosts)
  } catch (error) {
    res.status(500).json({ err: error })
  }
}
//GET USER POSTS
const getUserPosts = async (req: Request, res: Response) => {
  const { user_id } = req.params

  if (!Types.ObjectId.isValid(user_id)) {
    return res
      .status(400)
      .json({ message: "O id do usuário não é um id válido" })
  }

  try {
    const posts = await PostModel.find({
      author: {
        _id: user_id,
      },
    })
      .populate({
        path: "author",
        select: "_id firstname lastname",
      })
      .populate({
        path: "category",
        select: "name _id",
      })

    res.json(posts)
  } catch (error) {
    res.json(error)
  }
}
//GET POSTS BY VIEWS
const getMostViewedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().sort({ views: -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.json(error)
  }
}
//GET SEARCHED POST
const getSearchedPosts = async (req: Request, res: Response) => {
  const value = req.query.value || "".toLowerCase()
  try {
    const posts = await PostModel.find()
      .populate("category")
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
// DELETE POST
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
    const { title, content, mainImage, category, isHighlighted, tag } = req.body
    const postExists = await PostModel.findById(id)
    if (!postExists) {
      return res.status(404).json({ message: "O post solicitado não existe!" })
    }
    if (isHighlighted) {
      const currentlyHighlighted = await PostModel.findOne({
        isHighlighted: true,
      })
      if (currentlyHighlighted) {
        currentlyHighlighted.isHighlighted = false
        await currentlyHighlighted.save()
      }
    }
    const newPost = await PostModel.findOneAndUpdate(
      { _id: id },
      {
        title: title,
        mainImage: mainImage,
        content: content,
        isHighlighted: isHighlighted,
        category: category,
        tag: tag,
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

export {
  createPost,
  getAllPosts,
  deletePost,
  getAllPostsByCategory,
  getAllPostsPagination,
  getSearchedPosts,
  getSinglePost,
  getHighlightedPost,
  getUserPosts,
  updatePost,
  getMostViewedPosts,
}
