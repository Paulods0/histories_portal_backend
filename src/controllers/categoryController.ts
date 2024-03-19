import { Request, Response } from "express"
import { CategoryModel } from "../models/categoryModel"

//CREATE CATEGORY
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body
  if (!name) {
    return res
      .status(404)
      .json({ message: "O nome da categoria/tópico é obrigatório!" })
  }
  try {
    const category = new CategoryModel({ name })
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
//GET ALL CATEGORY
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find()

    res.status(200).json(categories)
  } catch (error) {
    res.status(400).json({
      error,
      err: "Erro no servidor ao tentar obter a categoria/tópico",
    })
  }
}
//GET SINGLE CATEGORY
export const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await CategoryModel.findById({ _id: id })
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
//DELTE SINGLE CATEGORY
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await CategoryModel.findById({ _id: id })
    if (!category) {
      return res.status(400).json({
        message:
          "Não foi possível deletar a categoria/tópico pois ela não existe.",
      })
    }
    await category.deleteOne()
    res.status(200).json({ message: "Deletado com sucesso!" })
  } catch (error) {
    res.status(400).json({
      error,
      err: "Erro do servidor ao tentar deletar a categoria/tópico.",
    })
  }
}
//UPDATE CATEGORY
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const newCategory = await CategoryModel.findOneAndUpdate(
      { _id: id },
      { name },
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
