import { PrismaService } from '@/modules/prisma/prisma.service'
import { AuthenticationError, InternalServerError, UnprocessableEntity } from '@/common/utils/custom-error'
import { HttpService } from '@nestjs/axios'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'
import { lastValueFrom, map } from 'rxjs'

import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { PortalServiceDto, PortalServiceSchema, TokenPayloadDto } from './dto'
// import { encryptData } from '@/common/utils/crypto-js'
// import { encryptPassword } from '@/common/utils/crypto-js'
type RegistrationHeader = {
  cpuId: string
  macAddress: string
  mbSerial: string
  hddSerial: string
}

@Injectable()
export class PortalService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService
  ) {}
  async create() {
    try {
      const portalData = await this.findAll()
      const parseData = PortalServiceSchema.safeParse(portalData)

      if (parseData.success === false) {
        throw new UnprocessableEntity({ error: parseData.error, description: 'Portal Service Parsing Data.' })
      }

      const { user, organization, business, location } = parseData.data
      // console.log('🚀 -> PortalService -> create -> user:', user)

      await this.prisma.$transaction(async (db) => {
        try {
          // await db.portalUser.deleteMany()
          await db.portalUser.createMany({ data: user })
        } catch (error) {
          console.log('🚀 -> PortalService -> awaitthis.prisma.$transaction -> error:', error)
          throw new UnprocessableEntity('Error saving User Portal Data.')
        }

        try {
          await db.organization.deleteMany()
          await db.organization.createMany({ data: organization })
        } catch (error) {
          throw new UnprocessableEntity('Error saving Organization Data.')
        }

        try {
          await db.business.deleteMany()
          await db.business.createMany({ data: business })
        } catch (error) {
          throw new UnprocessableEntity('Error saving Business Data.')
        }

        try {
          await db.location.deleteMany()
          await db.location.createMany({ data: location })
        } catch (error) {
          throw new UnprocessableEntity('Error saving Location Data.')
        }
      })

      return { success: true }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async findAll(): Promise<PortalServiceDto> {
    const BG_API_SERVICE_KEY = this.configService.get('secret').BG_API_SERVICE_KEY
    const PORTAL_NEXT_API_URL = this.configService.get('url').PORTAL_NEXT_API_URL

    const requestConfig: AxiosRequestConfig = {
      headers: {
        BG_API_SERVICE_KEY
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'POST',
        // 'Access-Control-Allow-Headers': 'Content-Type'
      }
    }

    const requestUrl = PORTAL_NEXT_API_URL + '/service/portal'

    const responseData = await lastValueFrom(
      this.httpService.post(requestUrl, null, requestConfig).pipe(
        map((response) => {
          return response.data
        })
      )
    )

    return responseData
  }

  async verifyAccount(locationCode: string | undefined) {
    // const { location } = payload

    // const business = await this.prisma.business.findFirst({ where: { id: businessId, isActive: true } })

    // if (!business) {
    //   throw new AuthenticationError({ message: 'Kindly check your API key or Please contact your provider.', table: 'Business' })
    // }

    if (!locationCode)
      throw new AuthenticationError({ message: 'Location Header not found! Please contact your provider.', module: 'Verify Account' })

    // TODO: SHOULD ADD WHITELISTED ACCOUNT BY MACHINE NO.
    const locationData = await this.prisma.location.findFirst({ where: { code: locationCode, isActive: true } })

    if (!locationData) {
      throw new AuthenticationError({ message: 'Location not found! Please contact your provider.', table: 'Location - Verify Account' })
    }

    return true
  }

  async generateApiKey(payload: any) {
    try {
      const secret = this.configService.get('secret').API_KEY_SIGNATURE_SECRET

      const expiresIn = payload.expiresIn || 60 //60seconds

      const apiKey = await this.jwtService.signAsync(payload, { secret, expiresIn })

      return { apiKey, payload }
    } catch (error) {
      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        throw new AuthenticationError(error)
      }

      throw new InternalServerError(error)
    }
  }

  async validateApiKey(apiKey: string | undefined, ignoreExpirationParams?: boolean): Promise<TokenPayloadDto | undefined> {
    if (!apiKey) throw new AuthenticationError('API Key or Token not found.')

    try {
      const { API_KEY_SIGNATURE_SECRET: secret, API_KEY_IGNORE_EXPIRATION: ignoreExpirationEnv } = this.configService.get('secret')
      const ignoreExpiration = ignoreExpirationEnv === 'true' || ignoreExpirationParams

      const payload: TokenPayloadDto = await this.jwtService.verifyAsync(apiKey, { secret, ignoreExpiration })

      return { ...payload, iatDate: new Date(payload.iat * 1000), expDate: new Date(payload.exp * 1000), apiKey }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new AuthenticationError(error)
      }

      throw new InternalServerError(error)
    }
  }

  async authenticateLocation(locationCode: string | undefined, details: Partial<RegistrationHeader>) {
    // const { location } = payload

    // const business = await this.prisma.business.findFirst({ where: { id: businessId, isActive: true } })

    // if (!business) {
    //   throw new AuthenticationError({ message: 'Kindly check your API key or Please contact your provider.', table: 'Business' })
    // }

    if (!locationCode) {
      throw new AuthenticationError({
        message: 'LOCATION HEADER not found! Please contact your provider.',
        module: 'Authenticate Location'
      })
    }

    const { cpuId, hddSerial, macAddress, mbSerial } = details

    const hasDetails = cpuId || hddSerial || macAddress || mbSerial

    if (!hasDetails) {
      throw new AuthenticationError({
        message: 'MACHINE HEADER not found! Please contact your provider.',
        module: 'Authenticate Location'
      })
    }

    const locationData = await this.prisma.registration.findFirst({
      where: {
        OR: [{ cpuId }, { hddSerial }, { macAddress }, { mbSerial }],
        locationCode
      }
    })

    if (!locationData) {
      throw new AuthenticationError({
        message: 'Location OR machine details not found! Please contact your provider.',
        table: 'Authenticate Location'
      })
    }

    if (locationData.statusId !== 'whitelisted') {
      throw new AuthenticationError({
        message: 'Forbidden access! Please contact your provider.',
        status: locationData.statusId
      })
    }

    return true
  }
}
