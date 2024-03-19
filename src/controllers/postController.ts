import { Request, Response } from "express"
import { IPostDB, PostModel } from "../models/postModel"
import { Schema, Types } from "mongoose"
import { UserModel } from "../models/userModel"

// CREATE POST
const createPost = async (req: Request, res: Response) => {
  // const userId = req.headers
  const {
    title,
    subtitle,
    category,
    content,
    isHighlighted,
    mainImage,
    author_id,
  } = req.body
  if (!title) {
    return res.status(400).json({ message: "O título é obrigatório" })
  }
  if (!subtitle) {
    return res.status(400).json({ message: "O subtítulo é obrigatório" })
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
    const post = new PostModel({
      title,
      subtitle,
      category,
      content,
      isHighlighted,
      mainImage,
      author: author_id,
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
  const postsPerPage = 3
  const { page } = req.query
  const skipp = postsPerPage * Number(page)
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("author")

    if (posts.length === 0) {
      return res.status(500).json({ message: "Não há nenhum post ainda." })
    }
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
    const post = await PostModel.findById({ _id: id }).populate("category")

    if (!post) {
      return res
        .status(404)
        .json({ error: "O post solicitado não foi encontrado!" })
    }
    res.status(200).json(post)
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor ao tentar obter o post solicitado" })
  }
}
// GET SINGLE POST
const getHighlightedPost = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.find(req.query)
      .sort({ createdAt: -1 })
      .limit(1)
    if (!post) {
      res.status(400).json({ message: "O post não foi encontrado" })
    }
    res.status(200).json({ data: post })
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor, por favor tente novamente!" })
  }
}
//GET POST BY CATEGORY
const getAllPostsByCategory = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({ category: req.params.category })
    const filteredPosts: {
      title: string
      subtitle: string
      mainImage: string
      content: string
      author?: Schema.Types.ObjectId
      isHighlighted: boolean
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
const getHighlightedPosts = async (req: Request, res: Response) => {
  try {
    const { highlighted } = req.query
    const highlightedPosts = await PostModel.find()
      .where("isHighlighted")
      .equals(true)
    res.status(200).json(highlightedPosts)
  } catch (error) {
    res.status(500).json({ err: error })
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
    const { title, subtitle, content, mainImage, category, isHighlighted } =
      req.body
    const postExists = await PostModel.findById(id)
    if (!postExists) {
      return res.status(404).json({ message: "O post solicitado não existe!" })
    }
    const newPost = await PostModel.findOneAndUpdate(
      { _id: id },
      {
        title: title,
        subtitle: subtitle,
        mainImage: mainImage,
        content: content,
        isHighlighted: isHighlighted,
        category: category,
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
  getHighlightedPost,
  getSinglePost,
  getHighlightedPosts,
  updatePost,
}
