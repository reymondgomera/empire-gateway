import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const PortalServiceSchema = z.object({
  user: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional().nullable(),
      username: z.string().optional().nullable(),
      password: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      createdAt: z.dateString(),
      updatedAt: z.dateString()
    })
  ),
  organization: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      bgOrganizationCode: z.string(),
      userId: z.string(),
      isActive: z.boolean(),
      isDefault: z.boolean(),
      createdAt: z.dateString(),
      updatedAt: z.dateString()
    })
  ),
  business: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      bgBusinessCode: z.string(),
      isActive: z.boolean(),
      isDefault: z.boolean(),
      status: z.string(),
      organizationId: z.string(),
      createdAt: z.dateString(),
      updatedAt: z.dateString()
    })
  ),
  location: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
      bgLocationCode: z.string(),
      isActive: z.boolean(),
      businessId: z.string(),
      organizationId: z.string(),
      createdAt: z.dateString(),
      updatedAt: z.dateString()
    })
  )
})

export class PortalServiceDto extends createZodDto(PortalServiceSchema) {}

export const TokenPayload = z.object({
  apiKey: z.string(),
  bgLocationCode: z.string(),
  bgBusinessCode: z.string(),
  iat: z.number(),
  exp: z.number(),
  iatDate: z.date(),
  expDate: z.date()
})
export class TokenPayloadDto extends createZodDto(TokenPayload) {}
