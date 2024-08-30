export type CreatePartnerRequestDTO = {
  date: string
  image: string
  title: string
  author: string
  content: string
  author_notes?: string
  tags: string[] | string
}

export type UpdatePartnerRequestDTO = {
  date?: string
  image?: string
  title?: string
  author?: string
  content?: string
  author_notes?: string
  tags?: string[] | string | undefined
}

export type PartnerQueryParams = {
  page: string
}
