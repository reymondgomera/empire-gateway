import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { EmpireCoreService } from './empire-core.service'
import { EmpireCoreController } from './empire-core.controller'
import { RouterModule, Routes } from '@nestjs/core'
import { ItemModule } from './item/item.module'
import { ReferenceModule } from './reference/reference.module'

const routes: Routes = [
  {
    path: '/empire-core',
    children: [
      {
        path: '/item',
        module: ItemModule
      },
      {
        path: '/reference',
        module: ReferenceModule
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
    ItemModule,
    ReferenceModule
  ],
  providers: [EmpireCoreService],
  controllers: [EmpireCoreController]
})
export class EmpireCoreModule {}
