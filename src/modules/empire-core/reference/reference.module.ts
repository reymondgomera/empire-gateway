import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ReferenceService } from './reference.service'
import { ReferenceController } from './reference.controller'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [ReferenceService],
  controllers: [ReferenceController]
})
export class ReferenceModule {}
