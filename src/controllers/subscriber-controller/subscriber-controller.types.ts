export type CreateSubRequestDTO = {
  email: string
  name: string
  phone: string
  country: string
  countryCode: string
}

export type UpdateSubRequestDTO = {
  name?: string
  email?: string
  phone?: string
  country?: string
  countryCode?: string
}

export type SubsQueryParams = {
  page: string
}
