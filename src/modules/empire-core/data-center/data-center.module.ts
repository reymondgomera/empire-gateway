import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DataCenterService } from './data-center.service'
import { createDataCenterController } from './data-center.controller'
import { DATACENTER_TABLES } from '../../../constant/data-center';

const dataCenterControllers = DATACENTER_TABLES.map(table => createDataCenterController(table));

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [DataCenterService],
  controllers: [...dataCenterControllers],
})
export class DataCenterModule {}
