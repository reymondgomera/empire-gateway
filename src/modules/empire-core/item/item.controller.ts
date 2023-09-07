import { Controller, Get, Post, Body, Query, Headers, Delete } from '@nestjs/common'
import { ItemService } from './item.service'

import { Public } from '../../../common/decorators'
import { GetPortalAuth } from '../../../common/decorators/get-portal-auth.decorator'
import { RefPrismaQueryDto, PortalAuth } from '../../../types'

@Controller()
export class ItemController {
  prisma: any
  constructor(private readonly itemService: ItemService) {}

  @Get()
  getAll(@Query() query: RefPrismaQueryDto) {
    return this.itemService.getAll(query)
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
