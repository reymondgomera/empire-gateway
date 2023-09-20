import { Prisma } from '@prisma/client'
import {  RefCategorySchema, RefDiscountSchema, RefPaymentSchema, RefTermsSchema } from '../types'
import { z } from 'zod'

export const DATACENTER_TABLES = [
  'brand',
  'division',
  'family',
  'generic-type',
  'uom',
  'bank',
  'card-type',
  'shipping-method',
  'category',
  'payment',
  'discount',
  'terms',
  'supplier-class',
  'supplier-group'
] as const

export type DataCenterTables = (typeof DATACENTER_TABLES)[number] | (string & {})

export const DATACENTER_OBJECT: Record<DataCenterTables, { model: Prisma.ModelName; zodSchema?: z.ZodObject<any> }> = {
  brand: { model: 'RefBrand' },
  division: { model: 'RefDivision' },
  family: { model: 'RefFamily' },
  'generic-type': { model: 'RefGenericType' },
  uom: { model: 'RefUOM' },
  'supplier-group': { model: 'RefSupplierGroup'},
  'supplier-class': { model: 'RefSupplierClass'},
  bank: { model: 'RefBank' },
  'card-type': { model: 'RefCardType' },
  'shipping-method': { model: 'RefShippingMethod' },
  category: { model: 'RefCategory', zodSchema: RefCategorySchema },
  payment: { model: 'RefPayment', zodSchema: RefPaymentSchema },
  discount: { model: 'RefDiscount', zodSchema: RefDiscountSchema },
  terms: { model: 'RefTerms', zodSchema: RefTermsSchema }
}
