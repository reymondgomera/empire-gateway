import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ItemService } from './item.service'
import { ItemController } from './item.controller'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [ItemService],
  controllers: [ItemController]
})
export class ItemModule {}
