import { Request, Response } from "express"
import { ProductModel } from "../models/product-model"
import { Types } from "mongoose"
import { productCategoryModel } from "../models/product-category-model"
import { EmailProps, mailSend } from "../helpers"

type CreateProduct = {
  name: string
  category: string
  price: string
  image: string
  quantity: number
  description?: string
}

export class ProductController {
  public static async createProduct(
    req: Request<{}, {}, CreateProduct>,
    res: Response
  ) {
    try {
      const { name, price, image, quantity, category, description } = req.body

      if (!name || !category || !price || !image) {
        return res
          .status(400)
          .json({ message: "Preencha todos os campos obrigatórios!" })
      }
      const category_slug = category.toLowerCase().replace(" ", "-")
      const product = new ProductModel({
        name: name,
        price: price,
        image: image,
        quantity: quantity,
        category: category,
        slug: category_slug,
        description: description,
      })
      await product.save()
      res.status(201).json({ message: "O produto foi criado com sucesso " })
    } catch (error) {
      res.status(500).send({ erro: "Erro no servidor: " + error })
    }
  }
  
  public static async getAllProducts(req: Request, res: Response) {
    const category = req.query.category
    const page = parseInt(req.query.page as string) || 1
    const limit = 40

    const skip = limit * (page - 1)

    let filter = category ? { slug: category } : {}

    try {
      const totalDocuments = await ProductModel.countDocuments(filter)
      const products = await ProductModel.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

      const pages = Math.ceil(totalDocuments / limit)
      res.status(200).json({ pages: pages, products: products })
    } catch (error) {
      res.status(500).json({ err: "Erro no servidor: " + error })
    }
  }

  public static async getProductsByCategory(req: Request, res: Response) {
    try {
      const { cat } = req.query
      const category = await productCategoryModel.findOne({ name: cat })
      const products = await ProductModel.find({ category: category?._id })

      res.json(products)
    } catch (error) {
      res.json(error)
    }
  }

  public static async getProductById(req: Request, res: Response) {
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

  public static async updateProduct(req: Request, res: Response) {
    const { id } = req.params
    const { name, category, price, quantity, image, description } = req.body
    try {
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "O id provido não é válido" })
      }
      const product = await ProductModel.findById(id)
      if (!product) {
        return res
          .status(404)
          .json({ message: "O produto não foi encontrado!" })
      }

      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: id },
        {
          description: description,
          name: name ? name : product!!.name,
          price: price ? price : product!!.price,
          image: image ? image : product!!.image,
          category: category ? category : product!!.category,
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

  public static async deleteProduct(req: Request, res: Response) {
    const { id } = req.params
    if (!Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "O id provido não é um id válido." })
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

 
}
