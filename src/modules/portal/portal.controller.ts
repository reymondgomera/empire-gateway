import { Controller, Get, ParseBoolPipe, Post, Query, Headers } from '@nestjs/common'
import { PortalService } from './portal.service'
import { PortalServiceDto } from './dto/portal.dto'
import { ConfigService } from '@nestjs/config'

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('get-master')
  findAll(): Promise<PortalServiceDto> {
    return this.portalService.findAll()
  }

  @Post('validate-master')
  create() {
    return this.portalService.create()
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
