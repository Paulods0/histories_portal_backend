import { Request, Response } from "express"
import { PostCategory } from "../models/post-category-model"
import { PostModel } from "../models/post-model"

export const createPostCategory = async (req: Request, res: Response) => {
  const { name, creator } = req.body
  if (!name) {
    return res
      .status(404)
      .json({ message: "O nome da categoria/tópico é obrigatório!" })
  }
  try {
    const category_slug = name.trim().replace(" ", "-").toLowerCase()
    const category = new PostCategory({ name, creator, slug: category_slug })
    await category.save()
    res
      .status(200)
      .json({ message: "A categoria/tópico foi criado com sucesso!", category })
  } catch (error) {
    res.status(400).json({
      error,
      err: "Erro no servidor ao tentar criar uma categoria/tópico",
    })
  }
}
export const getAllPostCategories = async (req: Request, res: Response) => {
  try {
    const categories = await PostCategory.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "creator",
        select: "firstname lastname",
      })

    res.status(200).json(categories)
  } catch (error) {
    res.status(400).json({
      error,
      err: "Erro no servidor ao tentar obter a categoria/tópico",
    })
  }
}
export const getSinglePostCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await PostCategory.findById({ _id: id })
    if (!category) {
      return res
        .status(404)
        .json({ message: "A categoria/tópico solicitada não existe" })
    }
    res.status(200).json(category)
  } catch (error) {
    res
      .status(400)
      .json({ error, err: "Erro ao tentar obter a categoria/tópico" })
  }
}
export const deletePostCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await PostCategory.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(400).json({
        message:
          "Não foi possível deletar a categoria/tópico pois ela não existe.",
      })
    }
    await PostModel.deleteMany({ category: id })

    res.status(200).json({ message: "Deletado com sucesso!" })
  } catch (error) {
    res.status(400).json({
      error,
      err: "Erro do servidor ao tentar deletar a categoria/tópico.",
    })
  }
}
export const updatePostCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const category_slug = name.trim().replace(" ", "-").toLowerCase()
    const newCategory = await PostCategory.findOneAndUpdate(
      { _id: id },
      { name, slug: category_slug },
      { new: true }
    )
    res.status(200).json({ message: "Atualizado com sucesso", newCategory })
  } catch (error) {
    res.status(400).json({
      error,
      err: "Erro no servidor ao tentar atualizar a categoria/tópico",
    })
  }
}
