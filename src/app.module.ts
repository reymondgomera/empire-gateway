import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AtGuard } from './common/guards'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { CacheModule } from '@nestjs/cache-manager'

// COMMON
import { ZodValidationPipe } from 'nestjs-zod'

import { PortalModule } from './modules/portal/portal.module'
import { EmpireModule } from './modules/empire/empire.module'
import { config } from './common/config/config'
import { AuthenticationMiddleware } from './common/middleware/auth.middleware'
import { RequestService } from './common/request.service'
import { PrismaModule } from './modules/prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    CacheModule.register({
      ttl: 5000 // 5 seconds
    }),
    // AuthModule,
    // UserModule,
    PrismaModule,
    PortalModule,
    EmpireModule
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AtGuard
    // },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    RequestService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*')
  }
}
