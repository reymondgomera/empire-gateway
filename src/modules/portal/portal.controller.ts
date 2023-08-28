import { Body, Controller, Get, ParseBoolPipe, Post, Query } from '@nestjs/common'
import { PortalService } from './portal.service'
import { PortalServiceDto } from './dto/portal.dto'

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('get-master')
  getPortalMaster(): Promise<PortalServiceDto> {
    return this.portalService.getPortalMaster()
  }

  @Post('validate-master')
  validateMaster() {
    return this.portalService.validateMaster()
  }

  @Get('generate-api-key')
  generateToken(@Query() payload) {
    return this.portalService.generateApiKey(payload)
  }

  @Post('validate-api-key')
  validateToken(@Query('apiKey') apiKey, @Query('ignoreExpiration', ParseBoolPipe) ignoreExpiration: boolean) {
    return this.portalService.validateApiKey(apiKey, ignoreExpiration)
  }
}
