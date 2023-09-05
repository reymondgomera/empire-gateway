import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { CoreService } from './core.service'
import { CoreController } from './core.controller'
import { RouterModule, Routes } from '@nestjs/core'
import { ItemModule } from './item/item.module'

const routes: Routes = [
  {
    path: '/core',
    children: [
      {
        path: '/item',
        module: ItemModule
      }
    ]
  }
]

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    RouterModule.register(routes),
    ItemModule
  ],
  providers: [CoreService],
  controllers: [CoreController]
})
export class CoreModule {}
