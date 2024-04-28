import { SchemaType } from "mongoose"

export type ClassifiedPost = {
  title: string
  mainImage: string
  content: string
  author: {
    firstname: string
    lastname: string
    email: string
    phone: string
  }
  category: string
  price: string
  category_slug: string
}

export type Post = {
  title: string
  mainImage: string
  content: string
  author_id: string
  highlighted: boolean
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

export type User = {
  _id: string
  firstname: string
  lastname: string
  image?: string
  email: string
  password: string
}
