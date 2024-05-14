import { Request, Response } from "express"
import { ClassifiedPost } from "../types"
import { ClassifiedPostModel } from "../models/classified-post-model"
import { Types } from "mongoose"
import { PostCategory } from "../models/post-category-model"

export const createClassifiedsPost = async (
  req: Request<{}, {}, ClassifiedPost>,
  res: Response
) => {
  try {
    const { author, content, mainImage, price, title } = req.body
    if (!author || !content || !mainImage || !price || !title) {
      return res.status(400).json({
        success: false,
        message: "Por favor preencha todos os campos obrigatórios.",
      })
    }

    const CATEGORY = "660569dab133266bd148379e"
    const existingCategory = await PostCategory.findById(CATEGORY)
    const categoryName = existingCategory?.name.toLowerCase().replace(" ", "-")

    const newClassifiedPost = new ClassifiedPostModel({
      author,
      title,
      content,
      category: existingCategory,
      mainImage,
      price,
      category_slug: categoryName,
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
export const getSinlgeClassifiedPost = async (
  req: Request<{ id: string }>,
  res: Response
) => {
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
export const getAllClassifiedPost = async (req: Request, res: Response) => {
  try {
    const posts = await ClassifiedPostModel.find()
    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Não há nenhum post ainda." })
    }
    return res.status(200).json({ sucess: true, data: posts })
  } catch (error) {
    console.error("Error: " + error)
    return res.status(400).send({ message: "Erro no servidor: " + error })
  }
}
export const deleteClassifiedPost = async (
  req: Request<{ id: string }>,
  res: Response
) => {
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
export const updateClassifiedPost = async (
  req: Request<{ id: string }, {}, ClassifiedPost>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { author, category, content, mainImage, price, title } = req.body

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Id inválido." })
    }

    const existingPost = await ClassifiedPostModel.findById(id)
    if (!existingPost) {
      return
    }

    await existingPost.updateOne({
      author: {
        firstname: author.firstname,
        lastname: author.lastname,
        email: author.email,
        phone: author.phone,
      },
      category: category,
      content: content,
      mainImage,
      price: price,
      title: title,
    })

    return res
      .status(200)
      .json({ success: true, message: "Atualizado com sucesso!", existingPost })
  } catch (error) {
    console.error("Error: " + error)
    return res.status(400).send({ message: "Erro no servidor: " + error })
  }
}
