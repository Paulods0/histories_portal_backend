import { Request, Response, Router } from "express"
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
} from "../controllers/product-controller"
import { EmailProps, mailSend } from "../helpers"

const route = Router()

route.post("/", createProduct)
route.get("/", getAllProducts)
route.put("/:id", updateProduct)
route.get("/:id", getProductById)
route.delete("/:id", deleteProduct)
route.get("/product-cat", getProductsByCategory)

type BodyProps = {
  email: string
  lastname: string
  firstname: string
  phone: string | number
  products: {
    name: string
    quantity: string
    totalPrice: string
  }[]
}
route.post(
  "/buy-product",
  async function (req: Request<{}, {}, BodyProps>, res: Response) {
    try {
      const { email, firstname, lastname, products, phone } = req.body

      const data: EmailProps = {
        data: {
          user: {
            email,
            phone,
            lastname,
            firstname,
          },
          products,
        },
        from: email,
        to: "pauloluguenda0@gmail.com",
        subject: "COMPRA DE ARTIGO(S)",
        template: "buy-product-email-template.ejs",
      }
      await mailSend(data)
      return res.status(200).end()
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
)

export = route
