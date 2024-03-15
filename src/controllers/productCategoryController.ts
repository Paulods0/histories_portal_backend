import { Request, Response } from "express"
import { productCategoryModel } from "../models/productCategoryModel"
import { Types } from "mongoose"

const createProductCategory = async (req: Request, res: Response) => {
  const { name } = req.body
  if (!name) {
    return res
      .status(400)
      .json({ message: "O nome da categoria é obrigatório" })
  }
  try {
    const productCategory = new productCategoryModel({ name })
    await productCategory.save()
    res
      .status(201)
      .json({ message: "Categoria criada com sucesso", data: productCategory })
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}
const getAllProductCategories = async (req: Request, res: Response) => {
  try {
    const productCategories = await productCategoryModel.find()

    if (!productCategoryModel || productCategories.length === 0) {
      return res.status(404).json({ message: "Não há nenhuma categoria" })
    }
    res.status(200).json(productCategories)
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}
const getProductCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "O id provido não é um id válido." })
  }
  try {
    const category = await productCategoryModel.findById(id)

    if (!category) {
      return res.status(404).json({ message: "A categoria não existe" })
    }
    return res.status(200).json(category)
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}
const updateProductCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name } = req.body
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "O id provido não é um id válido." })
  }
  try {
    const category = await productCategoryModel.findById(id)
    if (!category) {
      return res.status(404).json({ message: "A categoria não existe." })
    }
    const updatedCategory = await productCategoryModel.findOneAndUpdate(
      { _id: id },
      { name: name ? name : category.name },
      { new: true }
    )
    res.status(200).json({
      message: "A categoria foi atualizada com sucesso",
      updatedCategory,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}
const deleteProductCategory = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "O id provido não é um id válido" })
  }
  try {
    const category = await productCategoryModel.findById(id)
    if (!category) {
      return res.status(404).json({ message: "A categoria não exite" })
    }
    await category.deleteOne()
    res.status(200).json({ message: "A categoria foi deletada com sucesso" })
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}

export {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
}
