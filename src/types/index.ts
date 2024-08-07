import { SchemaType } from "mongoose"

export type ClassifiedPostAuthor = {
  firstname: string
  lastname: string
  email: string
  phone: string
}

export type ClassifiedPost = {
  price: string
  title: string
  content: string
  images?: string
  category: string
  mainImage: string
  type: "sell" | "buy"
  category_slug: string
  author: ClassifiedPostAuthor
  status: "active" | "suspended" | "inactive"
}

export type Post = {
  title: string
  mainImage: string
  content: string
  author_id: string
  highlighted: boolean
  date: string
  category?: string
  author_notes?: string
  tag?: string[]
  category_slug?: string
  rating?: number
  price?: number
  views?: number
  longitude?: string
  latitude?: string
}

export type SchedulePost = {
  author: string
  title: string
  file: string
}

export type Role = "admin" | "store-manager" | "publicator"

export type User = {
  _id: string
  firstname: string
  lastname: string
  image?: string
  email: string
  password: string
  role: Role
}
