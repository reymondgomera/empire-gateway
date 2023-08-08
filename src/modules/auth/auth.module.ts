import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ATokenStrategy, RTokenStrategy } from './strategies'
import { JwtModule } from '@nestjs/jwt'


@Module({
    imports: [JwtModule.register({})],
    providers: [AuthService, ATokenStrategy, RTokenStrategy],
    controllers: [AuthController]
})
export class AuthModule { }
