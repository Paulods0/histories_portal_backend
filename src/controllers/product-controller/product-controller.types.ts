export type CreateProductRequestDTO = {
  name: string
  category: string
  price: string
  image: string
  quantity: number
  description?: string
}

export type ProductQueryParams = {
  category: string
  page: string
}

export type UpdateProductRequestDTO = {
  name?: string
  price?: string
  image?: string
  quantity?: number
  category?: string
  description?: string
}
