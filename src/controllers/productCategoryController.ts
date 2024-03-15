import { Request, Response } from "express"
import { productCategoryModel } from "../models/productCategoryModel"

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
  try {
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}
const updateProductCategory = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: "Erro no servidor: " + error,
    })
  }
}
const deleteProductCategory = async (req: Request, res: Response) => {
  try {
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
