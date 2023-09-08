import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { DataCenterService } from './data-center.service'
import { DataCenterController } from './data-center.controller'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [DataCenterService],
  controllers: [DataCenterController]
})
export class DataCenterModule {}
