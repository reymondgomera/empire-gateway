import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const DataCenterPrismaQuerySchema = z.object({
  skip: z
    .preprocess((val) => Number(val), z.number())
    .default(0)
    .optional(),
  take: z
    .preprocess((val) => Number(val), z.number())
    .default(10)
    .optional(),
  requireTotalCount: z.coerce.boolean().default(true).optional()
})

export class DataCenterPrismaQueryDto extends createZodDto(DataCenterPrismaQuerySchema) {}

// OLD PAGINATION
export type PaginatedResource = {
  data: any[]
  meta: PaginationMetaType
}

export type PaginationMetaType = {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev?: number
  next?: number
}

export type PaginateQuery = {
  perPage?: string
  page?: string
  includes?: string
  sort?: string
  filter?: string
}
