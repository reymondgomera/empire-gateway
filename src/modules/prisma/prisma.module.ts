import { Module, Global } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaHealthIndicator } from './prisma-health.service'
import { DATACENTER_OBJECT, DATACENTER_TABLES } from 'src/constant/data-center'
import { DataCenterController } from '../empire-core/data-center/data-center.controller'

@Global()
@Module({
  providers: [PrismaService, PrismaHealthIndicator],
  exports: [PrismaService, PrismaHealthIndicator],
})
export class PrismaModule {}
