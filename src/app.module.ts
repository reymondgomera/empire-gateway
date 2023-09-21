import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AtGuard } from './common/guards'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { CacheModule } from '@nestjs/cache-manager'

// COMMON
import { ZodValidationPipe } from 'nestjs-zod'

import { PortalModule } from './modules/portal/portal.module'
import { EmpireModule } from './modules/empire/empire.module'
import { config } from './common/config/config'
import { AuthenticationMiddleware } from './common/middleware/auth.middleware'
import { CommonAuthGuard } from './common/guards/common.guard'
import { RequestService } from './common/request.service'
import { PrismaModule } from './modules/prisma/prisma.module'
import { EmpireCoreModule } from './modules/empire-core/empire-core.module'
import { HealthController } from './health.controller'
import { TerminusModule } from '@nestjs/terminus'
import { GlobalExceptionFilter } from './common/filters/global-exception.filters'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    CacheModule.register({
      ttl: 5000 // 5 seconds
    }),
    TerminusModule.forRoot(),
    // AuthModule,
    // UserModule,
    PrismaModule,
    PortalModule,
    EmpireModule,
    EmpireCoreModule
  ],
  providers: [
    
    {
      provide: APP_GUARD,
      useClass: CommonAuthGuard
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    RequestService
  ],
  controllers: [HealthController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*')
  }
}
