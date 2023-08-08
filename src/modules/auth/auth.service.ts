import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthDto } from './dto'
import * as bcrypt from 'bcrypt'
import { Tokens } from './types'
import { JwtService } from '@nestjs/jwt/dist'
import { ForbiddenException } from '@nestjs/common/exceptions'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async updateRtHash(userId: any, rt: string) {
    const hash = await this.hashData(rt)

    await this.prisma.masterUser.update({
      where: { id: userId },
      data: {
        refreshToken: hash
      }
    })
  }

  async signup(dto: AuthDto): Promise<any> {
    const password = await this.hashData(dto.password)
    const newUser = await this.prisma.masterUser.create({
      data: {
        email: dto.email,
        password,
        userName: '',
        firstName: '',
        lastName: ''
      }
    })

    const tokens = await this.getTokens(newUser.id, newUser.email!)

    await this.updateRtHash(newUser.id, tokens.refresh_token) // update users's refresh token

    return tokens
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.masterUser.findUnique({ where: { email: dto.email } })
    if (!user) throw new ForbiddenException('Access Denied')

    const passwordMatches = await bcrypt.compare(dto.password, user.password)
    if (!passwordMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user.id, user.email!)

    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  async logout(userId: any) {
    await this.prisma.masterUser.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: null
      }
    })
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.prisma.masterUser.findUnique({
      where: { id: userId }
    })

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    const rtMatches = await bcrypt.compare(rt, user.refreshToken)
    if (!rtMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user.id, user.email!)
    await this.updateRtHash(user.id, tokens.refresh_token)

    return tokens
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: any, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: 60 * 60 * 60 // 1 hour
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: 60 * 60 * 24 * 7 // 1 week
        }
      )
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }
}
