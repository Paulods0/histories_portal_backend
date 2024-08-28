export type CreatePostRequestDTO = {
  date: string
  title: string
  tag?: string[]
  content: string
  category?: string
  mainImage: string
  author_id: string
  latitude?: string
  longitude?: string
  highlighted: boolean
  author_notes?: string
  category_slug?: string
}

export type UpdatePostRequestDTO = {
  date?: string
  title?: string
  tag?: string[]
  content?: string
  category?: string
  mainImage?: string
  author_id?: string
  latitude?: string
  longitude?: string
  highlighted?: boolean
  author_notes?: string
  category_slug?: string
}

export type PostQueryParams = {
  page: string
  limit: string
  category: string
}
