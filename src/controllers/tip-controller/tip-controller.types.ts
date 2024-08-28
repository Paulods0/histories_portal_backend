
export type CreateTipRequestDTO = {
  title: string
  image: string
  author: string
  content: string
  category: string
  author_notes?: string
}

export type UpdateTipRequestDTO = {
  title?: string
  image?: string
  author?: string
  content?: string
  category?: string
  author_notes?: string
}