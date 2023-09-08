import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const DataCenterBaseSchema = z.object({
  code: z.string(),
  name: z.string(),
  default: z.boolean().default(false),
  active: z.boolean().default(true)
})

export const DataCenterPostSchema = z.object({
  values: z.string()
})

export class DataCenterPostDto extends createZodDto(DataCenterPostSchema) {}

const DataCenterPutSchema = z.object({
  key: z.string(),
  values: z.string()
})

export class DataCenterPutDto extends createZodDto(DataCenterPutSchema) {}

const DataCenterDeleteSchema = z.object({
  key: z.string()
})

export class DataCenterDeleteDto extends createZodDto(DataCenterDeleteSchema) {}

// REFERENCE & DATA CENTER SCHEMA
export const RefCategorySchema = DataCenterBaseSchema.extend({ colorCode: z.string().optional() })
export const RefPaymentSchema = DataCenterBaseSchema.extend({
  operator: z.number().default(0).optional(),
  hide: z.boolean().default(false).optional()
})

export const RefDiscountSchema = DataCenterBaseSchema.extend({
  discRate: z.number().default(0).optional(),
  lessTax: z.boolean().default(false).optional(),
  senior: z.boolean().default(false).optional(),
  promo: z.boolean().default(false).optional(),
  claim: z.boolean().default(false).optional(),
  hide: z.boolean().default(false).optional()
})

export const RefTermsSchema = DataCenterBaseSchema.extend({
  days: z.number().default(0).optional()
})
