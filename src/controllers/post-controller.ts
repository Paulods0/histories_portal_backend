import { Request, Response } from "express"
import { PostModel } from "../models/post-model"
import { Schema, Types } from "mongoose"
import { UserModel } from "../models/auth-model"

// CREATE POST
const createPost = async (req: Request, res: Response) => {
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
    if (highlighted) {
      const currentlyHighlighted = await PostModel.findOne({
        highlighted: true,
      })
      if (currentlyHighlighted) {
        currentlyHighlighted.highlighted = false
        await currentlyHighlighted.save()
      }
    }
    const post = new PostModel({
      title,
      category,
      content,
      highlighted,
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
  const { page } = req.query || 1
  const postsPerPage = 4
  const skip = postsPerPage * Number(page!!)
  try {
    let posts
    if (req.query.page) {
      posts = await PostModel.find()
        .limit(postsPerPage)
        .skip(skip)
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
          select: "_id firstname lastname image",
        })
        .populate({
          path: "category",
          select: "_id name",
        })
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

    res.status(200).json(posts)
  } catch (error) {
    res
      .status(404)
      .json({ err: "Erro no servidor, por favor tente novamente!" })
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
        select: ":_id name slug",
      })
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
        select: "_id firstname lastname image",
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
      }
    }

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
    const post = await PostModel.findById(req.params.postId)
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
    const post = await PostModel.findById(req.params.postId)
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
  // const search = req.query.name || ""
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
  likePost,
  deslikePost,
  testController,
}
