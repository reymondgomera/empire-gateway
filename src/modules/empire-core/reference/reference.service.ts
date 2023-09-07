import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { InternalServerError, NotFoundException, UnprocessableEntity } from '../../../common/utils/custom-error'
import { REF_OBJECT } from '../../../constant/reference'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PortalAuth, RefDeleteDto, RefPostDto, RefPutDto, Ref2ColsSchema, RefPrismaQueryDto } from '../../../types'
import { Prisma } from '@prisma/client'

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: RefPrismaQueryDto, modelPath: string) {
    try {
      const { model } = REF_OBJECT[modelPath]

      if (!model) {
        throw new NotFoundException(`Model [${model}] does not exist in reference.`)
      }

      const paginate: Prisma.RefBrandFindManyArgs = query.take && query.take ? { skip: query.skip, take: query.take } : {}

      const data = await this.prisma?.[model].findMany({ ...paginate, orderBy: { updatedAt: 'desc' } })
      const totalCount = await this.prisma?.[model].count()

      return { data, totalCount }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new UnprocessableEntity(error)
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerError(error)
    }
  }

  async create(bodyData: RefPostDto, modelPath: string, auth: PortalAuth) {
    try {
      const { model, zodSchema } = REF_OBJECT[modelPath]
      const schema = zodSchema ? zodSchema : Ref2ColsSchema

      if (!model) {
        throw new NotFoundException(`Model [${model}] does not exist in reference.`)
      }

      const { values } = bodyData
      const parseData = schema.safeParse(JSON.parse(values))

      if (parseData.success) {
        return await this.prisma?.[model].create({ data: { ...parseData.data, businessCode: auth.businessCode } })
      }

      throw new UnprocessableEntity()
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new UnprocessableEntity({
            error: 'Reference Data already exist.'
          })
        }

        throw new UnprocessableEntity(error)
      }

      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerError(error)
    }
  }

  async update(bodyData: RefPutDto, modelPath: string) {
    try {
      const { model, zodSchema } = REF_OBJECT[modelPath]
      const schema = zodSchema ? zodSchema : Ref2ColsSchema

      if (!model) {
        throw new NotFoundException(`Model [${model}] does not exist in reference.`)
      }

      const { key, values } = bodyData
      const parseData = schema.partial().safeParse(JSON.parse(values))

      if (parseData.success) {
        return await this.prisma?.[model].update({ where: { id: key }, data: parseData.data })
      }

      throw new UnprocessableEntity()
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new UnprocessableEntity({
            error: 'Reference Data already exist.'
          })
        }

        throw new UnprocessableEntity(error)
      }

      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerError(error)
    }
  }

  async delete(bodyData: RefDeleteDto, modelPath: string) {
    try {
      const { model } = REF_OBJECT[modelPath]

      if (!model) {
        throw new NotFoundException(`Model [${model}] does not exist in reference.`)
      }

      const { key } = bodyData

      const data = await this.prisma?.[model].delete({ where: { id: key } })
      return { data }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new UnprocessableEntity(error)
      }

      if (error instanceof NotFoundException) {
        throw new NotFoundException(error)
      }

      throw new InternalServerError(error)
    }
  }
}
