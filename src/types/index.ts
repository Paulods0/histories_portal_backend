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

export type PostType = {
  title: string
  mainImage: string
  content: string
  author: string
  isHighlighted: boolean
  category: string
  author_notes?: string
  tag?: string[]
  slug: string
  rating: number
  price?: number
  views: number
  longitude?: string
  latitude?: string
}

export type SchedulePost = {
  author: string
  title: string
  file: string
}
