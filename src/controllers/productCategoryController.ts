import { Request, Response } from "express"

const createProductCategory = async (req: Request, res: Response) => {}
const getAllProductCategories = async (req: Request, res: Response) => {}
const getProductCategoryById = async (req: Request, res: Response) => {}
const updateProductCategory = async (req: Request, res: Response) => {}
const deleteProductCategory = async (req: Request, res: Response) => {}

export {
  createProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  getProductCategoryById,
  updateProductCategory,
}
