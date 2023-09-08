import { PrismaService } from '../../prisma/prisma.service'
import { InternalServerError, UnprocessableEntity } from '../../../common/utils/custom-error'
import { Injectable } from '@nestjs/common'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PortalAuth, DataCenterPrismaQueryDto } from '../../../types'
import { Prisma } from '@prisma/client'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: DataCenterPrismaQueryDto, auth: PortalAuth) {
    try {
      const refWhere: Prisma.MasterItemFindManyArgs = { where: { businessCode: auth.businessCode } }
      const refQuery: Prisma.MasterItemFindManyArgs = query.take && query.take ? { skip: query.skip, take: query.take } : {}

      const data = await this.prisma.masterItem.findMany({ ...refWhere, ...refQuery, orderBy: { code: 'asc' } })
      const totalCount = await this.prisma.masterItem.count()

      return { data, totalCount }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new UnprocessableEntity({
            error: 'Item already exist.',
            message: 'Item already exist.'
          })
        }

        throw new UnprocessableEntity(error)
      }

      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }
}
