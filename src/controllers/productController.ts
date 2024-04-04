import { Request, Response } from "express"
import { ProductModel } from "../models/productModel"
import { Types } from "mongoose"
import { productCategoryModel } from "../models/productCategoryModel"

const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, image, quantity } = req.body
    if (!name || !category || !price || !image) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios!" })
    }
    const product = new ProductModel({
      name: name,
      category: category,
      price: price,
      image: image,
      quantity: quantity | 0,
    })
    await product.save()
    res.status(201).json({ message: "O produto foi criado com sucesso " })
  } catch (error) {
    res.status(500).send({ erro: "Erro no servidor: " + error })
  }
}
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find()
      .populate("category")
      .sort({ createdAt: -1 })

    if (!products || products.length === 0) {
      return res.status(404).json(products)
    }

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ err: "Erro no servidor: " + error })
  }
}
const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { cat } = req.query
    const category = await productCategoryModel.findOne({ name: cat })
    const products = await ProductModel.find({ category: category?._id })

    res.json(products)
  } catch (error) {
    res.json(error)
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
  const { name, category, price, quantity } = req.body
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "O id provido não é válido" })
    }
    const product = await ProductModel.findById(id)
    if (!product) {
      return res.status(404).json({ message: "O produto não foi encontrado!" })
    }

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      {
        name: name ? name : product!!.name,
        category: category ? category : product!!.category,
        price: price ? price : product!!.price,
        quantity: quantity ? quantity : product!!.quantity,
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
  getProductsByCategory,
}
