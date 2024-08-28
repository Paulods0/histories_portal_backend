export type CreateScheduleRequestDTO = {
  file: string
  title: string
  author: string
}

export type UpdateScheduleRequestDTO = {
  file?: string
  title?: string
  author?: string
}

export type ScheduleQueryParams = {
  page: string
}
