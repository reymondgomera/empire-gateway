import { Controller, Get } from '@nestjs/common'
import { type HealthCheckResult, HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus'

import { PrismaHealthIndicator } from './modules/prisma/prisma-health.service'
import { Public } from './common/decorators'

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mem: MemoryHealthIndicator,
    private readonly orm: PrismaHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.orm.isHealthy('prisma'),
      () => this.mem.checkRSS('mem_rss', 768 * 2 ** 20 /* 768 MB */),
      () => this.mem.checkHeap('mem_heap', 512 * 2 ** 20 /* 512 MB */)
    ])
  }
}
