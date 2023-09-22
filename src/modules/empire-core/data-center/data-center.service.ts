import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { InternalServerError, NotFoundException, UnprocessableEntity } from '../../../common/utils/custom-error'
import { DATACENTER_OBJECT } from '../../../constant/data-center'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import {
  PortalAuth,
  DataCenterDeleteDto,
  DataCenterPostDto,
  DataCenterPutDto,
  DataCenterBaseSchema,
  DataCenterPrismaQueryDto
} from '../../../types'
import { Prisma } from '@prisma/client'
import { buildWhereClause } from '../../../common/utils/filters'

@Injectable()
export class DataCenterService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: DataCenterPrismaQueryDto, modelPath: string, auth: PortalAuth) {
    const { model } = DATACENTER_OBJECT[modelPath]

    if (!model) {
      throw new NotFoundException(`Model [${model}] does not exist in data center.`)
    }

    const refWhere: Prisma.RefBrandFindManyArgs = { where: { businessCode: auth.businessCode } }
    const refQuery: Prisma.RefBrandFindManyArgs =
      query.take && query.take
        ? {
            skip: query.skip,
            take: query.take,
            ...(query.filter && {
              where: buildWhereClause(query.filter)
            }),
            orderBy: query.sort?.map((sortOption) => ({
              [sortOption.selector]: sortOption.desc ? 'desc' : 'asc'
            })) || { updatedAt: 'desc' }
          }
        : {}

    const data = await this.prisma?.[model].findMany({ ...refWhere, ...refQuery })
    const totalCount = await this.prisma?.[model].count()

    return { data, totalCount }
  }

  async create(bodyData: DataCenterPostDto, modelPath: string, auth: PortalAuth) {
    const { model, zodSchema } = DATACENTER_OBJECT[modelPath]
    const schema = zodSchema ? zodSchema : DataCenterBaseSchema
    if (!model) {
      throw new NotFoundException(`Model [${model}] does not exist in data center.`)
    }
    const { values } = bodyData
    const parseData = schema.safeParse(JSON.parse(values))

    if (parseData.success) {
      return await this.prisma?.[model].create({ data: { ...parseData.data, businessCode: auth.businessCode } })
    }
    throw new UnprocessableEntity()
  }

  async update(bodyData: DataCenterPutDto, modelPath: string) {
    const { model, zodSchema } = DATACENTER_OBJECT[modelPath]
    const schema = zodSchema ? zodSchema : DataCenterBaseSchema

    if (!model) {
      throw new NotFoundException(`Model [${model}] does not exist in data center.`)
    }

    const { key, values } = bodyData
    const parseData = schema.partial().safeParse(JSON.parse(values))

    if (parseData.success) {
      return await this.prisma?.[model].update({ where: { id: key }, data: parseData.data })
    }

    throw new UnprocessableEntity()
  }

  async delete(bodyData: DataCenterDeleteDto, modelPath: string) {
    const { model } = DATACENTER_OBJECT[modelPath]

    if (!model) {
      throw new NotFoundException(`Model [${model}] does not exist in data center.`)
    }

    const { key } = bodyData

    const data = await this.prisma?.[model].delete({ where: { id: key } })
    return { data }
  }
}
