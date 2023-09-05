import { Controller, Get, Post, Body, Query, Headers, Delete } from '@nestjs/common'
import { CoreService } from './core.service'

import { Public } from '../../common/decorators'
import { GetPortalAuth } from '../../common/decorators/get-portal-auth.decorator'
import { PortalAuth } from '../../types'

@Controller('core')
export class CoreController {
  prisma: any
  constructor(private readonly coreService: CoreService) {}

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
