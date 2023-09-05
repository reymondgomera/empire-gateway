import { Controller, Get, Post, Body, Query, Headers, Delete } from '@nestjs/common'
import { EmpireService } from './empire.service'
import {
  SalesParamDto,
  SalesDataDto,
  InventoryDataDto,
  ModTransferDataDto,
  TransferQueryParamDto,
  RegistrationLocationDto,
  ReferenceDto
} from './dto'

@Controller('empire')
export class EmpireController {
  prisma: any
  constructor(private readonly empireService: EmpireService) {}

  @Get('test')
  test() {
    return this.empireService.test()
  }

  @Post('registration')
  postRegistration(@Body() body: RegistrationLocationDto) {
    return this.empireService.locationRegistration(body)
  }

  @Post('sales')
  postSales(@Headers('x-location-code') locationCode: string, @Query() param: SalesParamDto, @Body() data: SalesDataDto) {
    return this.empireService.postSales(locationCode, param, data)
  }

  @Post('inventory')
  postInventory(@Headers('x-location-code') locationCode: string, @Body() data: InventoryDataDto) {
    return this.empireService.postInventory(locationCode, data)
  }

  @Post('reference')
  postReference(@Headers('x-business-code') businessCode: string, @Body() data: ReferenceDto) {
    return this.empireService.postReference(businessCode, data)
  }

  // @Get('inventory')
  // getInventory(@Headers('x-business-code') businessCode: string, @Headers('x-location-code') locationCode: string) {
  //   return this.empireService.getInventoryData(businessCode, locationCode)
  // }

  @Post('transfer')
  postModTransfer(@Body() data: ModTransferDataDto) {
    return this.empireService.postModTransfer(data)
  }

  @Get('transfer')
  getTransfer(@Headers('x-business-code') locationCode: string, @Query() params: TransferQueryParamDto) {
    return this.empireService.getTransferData(locationCode, params)
  }

  // @Delete('transfer')
  // removeRecord(@Headers('x-location-code') locationCode: string, @Headers('doc_nb') doc_nb: string) {
  //   return this.empireService.removeRecord(locationCode, doc_nb)
  // }

  @Get()
  findAll(): Promise<any> {
    return this.empireService.findAll()
  }
}
