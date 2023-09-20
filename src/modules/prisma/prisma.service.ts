import { Injectable, OnModuleInit, OnModuleDestroy, Scope, Inject } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { buildWhereClause } from '../../../src/common/utils/filters';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  }

  async onModuleInit() {
    await this.$connect()
    this.$use(this.FilterMiddleware)
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  FilterMiddleware: Prisma.Middleware = async (params, next) => {
    if (params.action === 'findMany') {
      const { args } = params
  
      if (args.filter) {
        const filterArray = JSON.parse(args.filter);
        const where = buildWhereClause(filterArray);
        args.where = {
          AND: [
            args.where,
            where
          ]
        }
      }
      
      params.args = args
      
    }
  
    return next(params)
  }
}
