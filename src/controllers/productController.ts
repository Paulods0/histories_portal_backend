import { Request, Response } from "express"
import { ProductModel } from "../models/productModel"

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
const getAllProducts = (req: Request, res: Response) => {}
const getProductById = (req: Request, res: Response) => {}
const updateProduct = (req: Request, res: Response) => {}
const deleteProduct = (req: Request, res: Response) => {}

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}
