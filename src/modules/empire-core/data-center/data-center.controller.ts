import { Controller, Get, Post, Body, Query, Delete, Put, UseFilters, Headers, UseGuards } from '@nestjs/common'
import { DataCenterService } from './data-center.service'

import { GetPortalAuth } from '../../../common/decorators/get-portal-auth.decorator'
import { DataCenterPrismaQueryDto, PortalAuth, DataCenterPutDto, DataCenterPostDto, DataCenterDeleteDto } from '../../../types'
import { GetReferenceModel } from '../../../common/decorators/get-reference-model'
import { DATACENTER_TABLES } from '../../../constant/data-center'
import { PrismaClientExceptionFilter } from '../../../common/exception/prisma-client-exception.filter'
import { ApiBearerAuth, ApiHeader, ApiHeaders, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AtGuard } from '../../../common/guards'

// const dataCenterTables = DATACENTER_TABLES.map((table) => {
//   return '/' + table
// })

export const createDataCenterController = (table: string) => {
  @ApiTags(table)
  @Controller(table)
  class DataCenterController {
    constructor(public readonly dataCenterService: DataCenterService) {}

    @Get()
    @ApiBearerAuth()
    @ApiHeader({
      name: 'x-business-code',
      description: 'Business Code',
      required: true,
      schema: { type: 'string' }
    })
    @ApiOperation({ summary: 'Fetches all the data from the table' })
    @ApiResponse({ status: 200, description: 'Data' })
    getAll(@Query() query: DataCenterPrismaQueryDto, @GetReferenceModel() model: string, @GetPortalAuth() auth: PortalAuth) {
      return this.dataCenterService.getAll(query, model, auth)
    }

    @Post()
    @ApiBearerAuth()
    @ApiHeader({
      name: 'x-business-code',
      description: 'Business Code',
      required: true,
      schema: { type: 'string' }
    })
    @ApiOperation({ summary: 'Creates an entry from the  table' })
    @ApiResponse({ status: 200, description: 'Data' })
    create(@Body() bodyData: DataCenterPostDto, @GetReferenceModel() model: string, @GetPortalAuth() auth: PortalAuth) {
      return this.dataCenterService.create(bodyData, model, auth)
    }

    @Put()
    @ApiBearerAuth()
    @ApiHeader({
      name: 'x-business-code',
      description: 'Business Code',
      required: true,
      schema: { type: 'string' }
    })
    @ApiOperation({ summary: 'Updates an entry to from the table' })
    @ApiResponse({ status: 200, description: 'Data' })
    update(@Body() bodyData: DataCenterPutDto, @GetReferenceModel() model: string) {
      return this.dataCenterService.update(bodyData, model)
    }

    @Delete()
    @ApiBearerAuth()
    @ApiHeader({
      name: 'x-business-code',
      description: 'Business Code',
      required: true,
      schema: { type: 'string' }
    })
    @ApiOperation({ summary: 'Deletes an entry  from the table' })
    @ApiResponse({ status: 200, description: 'Data' })
    delete(@Body() bodyData: DataCenterDeleteDto, @GetReferenceModel() model: string) {
      return this.dataCenterService.delete(bodyData, model)
    }
  }

  return DataCenterController
}
