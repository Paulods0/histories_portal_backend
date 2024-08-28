export type CreatePartnerRequestDTO = {
  image: string
  title: string
  author: string
  content: string
}

export type UpdatePartnerRequestDTO = {
  image?: string
  title?: string
  author?: string
  content?: string
}

export type PartnerQueryParams = {
  page: string
}
