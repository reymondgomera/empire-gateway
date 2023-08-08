import { Controller, Post, Body, HttpCode, UseGuards, Get } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { Tokens } from './types'
import { GetCurrentUser, GetCurrentUserId, Public } from '@/common/decorators'
import { RtGuard } from '@/common/guards'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto)
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto)
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId)
  }

  @Public() // bypass atguard
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@GetCurrentUserId() userId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
