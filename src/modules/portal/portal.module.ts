import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { PortalService } from './portal.service'
import { PortalController } from './portal.controller'
import { JwtModule } from '@nestjs/jwt'
import { config } from '../../common/config/config'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    }),
    ConfigModule.forRoot({
      load: [config]
    }),
    JwtModule.register({})
  ],
  providers: [PortalService],
  controllers: [PortalController],
  exports: [PortalService]
})
export class PortalModule {}
