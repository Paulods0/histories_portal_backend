export type ClassifiedPostStatus = "active" | "suspended" | "inactive"

export type ClassifiedPostAuthor = {
  firstname: string
  lastname: string
  email: string
  phone: string
}

export type CreateClassifiedPostRequestDTO = {
  price: string
  title: string
  content: string
  images?: string
  category: string
  mainImage: string
  type: "sell" | "buy"
  category_slug: string
  author: ClassifiedPostAuthor
  status: ClassifiedPostStatus
}

export type ClassifiedsQueryParams = {
  page: string
}

export type UpdateClassifiedPostRequestDTO = {
  newStatus?: string
  images?: string[]
}
