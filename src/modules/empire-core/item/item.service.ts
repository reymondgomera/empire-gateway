import { PrismaService } from '../../prisma/prisma.service'
import { InternalServerError, UnprocessableEntity } from '../../../common/utils/custom-error'
import { Injectable } from '@nestjs/common'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { RefPrismaQueryDto } from 'src/types'
import { Prisma } from '@prisma/client'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: RefPrismaQueryDto) {
    try {
      const paginate: Prisma.MasterItemFindManyArgs = query.take && query.take ? { skip: query.skip, take: query.take } : {}

      const data = await this.prisma.masterItem.findMany({ ...paginate, orderBy: { code: 'asc' } })
      const totalCount = await this.prisma.masterItem.count()

      return { data, totalCount }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new UnprocessableEntity({
            error: 'Registration exist.',
            message: 'Location code and Machine Details already registered.'
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
