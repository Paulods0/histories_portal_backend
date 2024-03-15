import { Request, Response } from "express"
import { ProductModel } from "../models/productModel"
import { Types } from "mongoose"

const createProduct = async (req: Request, res: Response) => {
  const { name, category } = req.body
  if (!name) {
    return res.status(400).json({ message: "O nome do produto é obrigatório!" })
  }
  if (!category) {
    return res.status(400).json({ message: "A categoria é obrigatória!" })
  }
  try {
    const product = new ProductModel({ name, category })
    const data = await product.save()
    res
      .status(201)
      .json({ message: "O produto foi criado com sucesso ", data: data })
  } catch (error) {
    res.status(500).json({ err: "Erro no servidor: " + error })
  }
}
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find().populate("category")
    if (!products || products.length === 0) {
      res.status(404).json({ message: "Não há nenhum produto criado." })
    }
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ err: "Erro no servidor: " + error })
  }
}
const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "O id provido não é válido" })
    }
    const product = await ProductModel.findById(id).populate("category")
    if (!product) {
      return res
        .status(404)
        .json({ message: "O produto solicitado não existe!" })
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ err: "Erro no servidor: " + error })
  }
}
const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, category } = req.body
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "O id provido não é válido" })
    }
    const product = await ProductModel.findById(id)
    if (!product) {
      return res.status(404).json({ message: "O produto não foi encontrado!" })
    }

    const updatedProduct = await ProductModel.updateOne(
      { _id: id },
      {
        name: name ? name : product!!.name,
        category: category ? category : product!!.category,
      },
      { new: true }
    )

    res
      .status(200)
      .json({ message: "Produto atualizado com sucesso!", updatedProduct })
  } catch (error) {
    res.status(500).json({ err: "Erro no servidor: " + error })
  }
}
const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "O id provido não é um id válido." })
  }
  try {
    const product = await ProductModel.findById(id)
    if (!product) {
      return res.status(400).json({ message: "Este produto não existe." })
    }
    await ProductModel.deleteOne({ _id: product._id })
    res.status(200).json({ message: "O produto foi deletado com sucesso" })
  } catch (error) {
    res.status(500).json({ err: "Erro no servidor: " + error })
  }
}

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
