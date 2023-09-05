import { Body, Controller, Get, ParseBoolPipe, Post, Query } from '@nestjs/common'
import { PortalService } from './portal.service'
import { PortalServiceDto } from './dto/portal.dto'
import { Public } from '../../common/decorators'
import { GetPortalAuth } from '../../common/decorators/get-portal-auth.decorator'
import { PortalAuth } from '../../types'

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  // @Get('get-master')
  // getPortalMaster(): Promise<PortalServiceDto> {
  //   return this.portalService.getPortalMaster()
  // }

  @Public()
  @Get('public')
  testPublic() {
    return [{ id: 'public', code: 'public route' }]
  }

  @Get('private')
  testPrivate(@GetPortalAuth() data: PortalAuth) {
    return [{ id: 'private', code: 'private route from GATEWAY API' }]
  }

  @Post('update-organization')
  updateOrganization(@Body() body: PortalServiceDto) {
    return this.portalService.updateOrganization(body)
  }

  @Public()
  @Get('generate-api-key')
  generateApiKey(@Query() payload) {
    return this.portalService.generateApiKey(payload)
  }

  @Public()
  @Post('validate-api-key')
  validateApiKey(@Query('apiKey') apiKey, @Query('ignoreExpiration', ParseBoolPipe) ignoreExpiration: boolean) {
    return this.portalService.validateApiKey(apiKey, ignoreExpiration)
  }
}
