import { Prisma } from '@prisma/client'
import { RefCategorySchema } from '../types'
import { z } from 'zod'

export const REF_TABLES = [
  'brand',
  'division',
  'family',
  'generic-type',
  'uom',
  'bank',
  'card-type',
  'shipping-method',
  'category'
] as const

export type RefTables = (typeof REF_TABLES)[number] | (string & {})

export const REF_OBJECT: Record<RefTables, { model: Prisma.ModelName; zodSchema?: z.ZodObject<any> }> = {
  brand: { model: 'RefBrand' },
  division: { model: 'RefDivision' },
  family: { model: 'RefFamily' },
  'generic-type': { model: 'RefGenericType' },
  uom: { model: 'RefUOM' },
  bank: { model: 'RefBank' },
  'card-type': { model: 'RefCardType' },
  'shipping-method': { model: 'RefShippingMethod' },
  category: { model: 'RefCategory', zodSchema: RefCategorySchema }
}
