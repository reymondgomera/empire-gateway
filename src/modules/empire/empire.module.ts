import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { EmpireService } from './empire.service'
import { EmpireController } from './empire.controller'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  providers: [EmpireService],
  controllers: [EmpireController]
})
export class EmpireModule {}
