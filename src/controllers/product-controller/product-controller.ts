import {
  ProductQueryParams,
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from "./product-controller.types"
import { Types } from "mongoose"
import { ProductModel } from "../../models/product-model"
import { NextFunction, Request, Response } from "express"
import { ValidationError } from "../../middlewares/error/validation"
import { NotFoundError } from "../../middlewares/error/not-found-error"

export class ProductController {
  public static async createProduct(
    req: Request<{}, {}, CreateProductRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, price, image, quantity, category, description } = req.body

      if (!name) {
        throw new ValidationError("O nome é obrigatório.")
      }
      if (!category) {
        throw new ValidationError("A categoria é obrigatória.")
      }
      if (!price) {
        throw new ValidationError("O preço é obrigatório.")
      }
      if (!image) {
        throw new ValidationError("A imagem é obrigatória.")
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
      res.status(201).json({ message: "Criado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async getAllProducts(
    req: Request<{}, {}, {}, ProductQueryParams>,
    res: Response,
    next: NextFunction
  ) {
    const { category, page: queryPage, limit: queryLimit } = req.query
    const page: number = queryPage ? parseInt(queryPage) : 1
    const limit: number = queryLimit ? Number(queryLimit) : 20
    const skip: number = limit * (page - 1)

    let filter = category ? { slug: category } : {}

    try {
      const totalDocuments = await ProductModel.countDocuments(filter)
      const products = await ProductModel.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

      const pages = Math.ceil(totalDocuments / limit)
      res
        .status(200)
        .json({ total: totalDocuments, pages: pages, products: products })
    } catch (error) {
      next(error)
    }
  }

  public static async getProductById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params

    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError("Id inválido.")
      }

      const product = await ProductModel.findById(id).populate("category")

      if (!product) throw new NotFoundError("Não encontrado.")

      res.status(200).json(product)
    } catch (error) {
      next(error)
    }
  }

  public static async updateProduct(
    req: Request<{ id: string }, {}, UpdateProductRequestDTO>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params
    const { name, category, price, quantity, image, description } = req.body

    try {
      if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

      const product = await ProductModel.findById(id)

      if (!product) throw new NotFoundError("Não encontrado.")

      await ProductModel.findOneAndUpdate(
        { _id: id },
        {
          description: description,
          name: name ? name : product!!.name,
          price: price ? price : product!!.price,
          image: image ? image : product!!.image,
          category: category ? category : product!!.category,
          quantity: quantity ? quantity : product!!.quantity,
        }
      )

      res.status(200).json({ message: "Atualizado com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  public static async deleteProduct(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params

    if (!Types.ObjectId.isValid(id)) throw new ValidationError("Id inválido.")

    try {
      const product = await ProductModel.findById(id)

      if (!product) throw new NotFoundError("Não encontrado.")

      await ProductModel.deleteOne({ _id: product._id })
      res.status(200).json({ message: "Removido com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}
