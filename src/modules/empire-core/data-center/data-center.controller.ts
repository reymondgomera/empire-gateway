import { Controller, Get, Post, Body, Query, Delete, Put } from '@nestjs/common'
import { DataCenterService } from './data-center.service'

import { GetPortalAuth } from '../../../common/decorators/get-portal-auth.decorator'
import { DataCenterPrismaQueryDto, PortalAuth, DataCenterPutDto, DataCenterPostDto, DataCenterDeleteDto } from '../../../types'
import { GetReferenceModel } from '../../../common/decorators/get-reference-model'
import { DATACENTER_TABLES } from '../../../constant/data-center'

const dataCenterTables = DATACENTER_TABLES.map((table) => {
  return '/' + table
})

@Controller()
export class DataCenterController {
  constructor(private readonly dataCenterService: DataCenterService) {}

  @Get(dataCenterTables)
  getAll(@Query() query: DataCenterPrismaQueryDto, @GetReferenceModel() model: string, @GetPortalAuth() auth: PortalAuth) {
    return this.dataCenterService.getAll(query, model, auth)
  }

  @Post(dataCenterTables)
  create(@Body() bodyData: DataCenterPostDto, @GetReferenceModel() model: string, @GetPortalAuth() auth: PortalAuth) {
    return this.dataCenterService.create(bodyData, model, auth)
  }

  @Put(dataCenterTables)
  update(@Body() bodyData: DataCenterPutDto, @GetReferenceModel() model: string) {
    return this.dataCenterService.update(bodyData, model)
  }

  @Delete(dataCenterTables)
  delete(@Body() bodyData: DataCenterDeleteDto, @GetReferenceModel() model: string) {
    return this.dataCenterService.delete(bodyData, model)
  }
}
