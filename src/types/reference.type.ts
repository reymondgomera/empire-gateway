import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const Ref2ColsSchema = z.object({
  code: z.string(),
  name: z.string(),
  default: z.boolean().default(false),
  active: z.boolean().default(true)
})

export const RefCategorySchema = Ref2ColsSchema.extend({ colorCode: z.string().optional() })

export const RefPostSchema = z.object({
  values: z.string()
})

export class RefPostDto extends createZodDto(RefPostSchema) {}

const RefPutSchema = z.object({
  key: z.string(),
  values: z.string()
})

export class RefPutDto extends createZodDto(RefPutSchema) {}

const RefDeleteSchema = z.object({
  key: z.string()
})

export class RefDeleteDto extends createZodDto(RefDeleteSchema) {}
