import { Controller, Get, Post, Body, Query, Headers, Delete } from '@nestjs/common'
import { EmpireService } from './empire.service'
import { SalesParamDto, SalesDataDto, InventoryDataDto, ModTransferDataDto, TransferQueryParamDto, RegistrationLocationDto } from './dto'

@Controller('empire')
export class EmpireController {
  prisma: any
  constructor(private readonly empireService: EmpireService) {}

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

  @Post('transfer')
  postModTransfer(@Body() data: ModTransferDataDto) {
    return this.empireService.postModTransfer(data)
  }

  @Get('transfer')
  getInventory(@Headers('x-location-code') locationCode: string, @Query() params: TransferQueryParamDto) {
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
