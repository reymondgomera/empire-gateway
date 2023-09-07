import { Controller, Get, Post, Body, Query, Headers, Delete } from '@nestjs/common'
import { EmpireCoreService } from './empire-core.service'

import { Public } from '../../common/decorators'
import { GetPortalAuth } from '../../common/decorators/get-portal-auth.decorator'
import { PortalAuth } from '../../types'

@Controller('empire-core')
export class EmpireCoreController {
  prisma: any
  constructor(private readonly coreService: EmpireCoreService) {}

  @Public()
  @Get()
  index() {
    return [{ id: 'index', code: 'index home&dashboard' }]
  }

  @Public()
  @Get('public')
  testPublic() {
    return [{ id: 'public', code: 'public route' }]
  }

  @Get('private')
  testPrivate(@GetPortalAuth() data: PortalAuth) {
    return [{ id: 'private', code: 'private route from GATEWAY API' }]
  }
}
