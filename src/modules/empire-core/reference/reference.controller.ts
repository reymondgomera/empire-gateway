import { Controller, Get, Post, Body, Query, Delete, Put } from '@nestjs/common'
import { ReferenceService } from './reference.service'

import { GetPortalAuth } from '../../../common/decorators/get-portal-auth.decorator'
import { RefPrismaQueryDto, PortalAuth, RefPutDto, RefPostDto, RefDeleteDto } from '../../../types'
import { GetReferenceModel } from '../../../common/decorators/get-reference-model'
import { REF_TABLES } from '../../../constant/reference'

const ref2Cols = REF_TABLES.map((table) => {
  return '/' + table
})

@Controller()
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get(ref2Cols)
  getAll(@Query() query: RefPrismaQueryDto, @GetReferenceModel() model: string) {
    return this.referenceService.getAll(query, model)
  }

  @Post(ref2Cols)
  create(@Body() bodyData: RefPostDto, @GetReferenceModel() model: string, @GetPortalAuth() auth: PortalAuth) {
    return this.referenceService.create(bodyData, model, auth)
  }

  @Put(ref2Cols)
  update(@Body() bodyData: RefPutDto, @GetReferenceModel() model: string) {
    return this.referenceService.update(bodyData, model)
  }

  @Delete(ref2Cols)
  delete(@Body() bodyData: RefDeleteDto, @GetReferenceModel() model: string) {
    return this.referenceService.delete(bodyData, model)
  }
}
