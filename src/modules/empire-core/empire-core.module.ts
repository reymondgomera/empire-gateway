import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { EmpireCoreService } from './empire-core.service'
import { EmpireCoreController } from './empire-core.controller'
import { RouterModule, Routes } from '@nestjs/core'
import { ItemModule } from './item/item.module'
import { DataCenterModule } from './data-center/data-center.module'
import { ErrorReferencesController } from './error-references/error-references.controller'
import { ErrorReferencesModule } from './error-references/error-references.module'

const routes: Routes = [
  {
    path: '/empire-core',
    children: [
      {
        path: '/item',
        module: ItemModule
      },
      {
        path: '/data-center',
        module: DataCenterModule
      },
      {
        path: '/error-references',
        module: ErrorReferencesModule
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
    DataCenterModule,
    ErrorReferencesModule
  ],
  providers: [EmpireCoreService],
  controllers: [EmpireCoreController]
})
export class EmpireCoreModule {}
