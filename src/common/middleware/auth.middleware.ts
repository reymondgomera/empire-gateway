import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { PortalService } from '@/modules/portal/portal.service'
import { ConfigService } from '@nestjs/config'
import { AuthenticationError } from '../utils/custom-error'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly portalService: PortalService // private reflector: Reflector
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(AuthenticationMiddleware.name)

    // REQUEST
    const reqUrl = req.originalUrl
    const apiKey = req.headers.authorization?.replace('Bearer ', '')

    //CHECK IF REQ. IS PUBLIC
    const bg_api_service_key = req.headers.bg_api_service_key
    const publicUrl = this.configService.get('publicUrl') as string[]

    for (const value of publicUrl) {
      if (reqUrl.includes(value)) {
        if (value === 'registration') {
          // console.log('xxx')
          const payload = await this.portalService.validateApiKey(apiKey)

          if (payload) {
            next()
            return
          }
        }

        const ENV_bg_api_service_key = this.configService.get('secret').BG_API_SERVICE_KEY

        if (bg_api_service_key !== ENV_bg_api_service_key) {
          throw new AuthenticationError('Unauthorized Access: BG_API_SERVICE_KEY is not valid.')
        }

        next()
        return
      }
    }

    // TODO: this should be one time validation
    // Token API Key should have expiry
    // const payload = await this.portalService.validateApiKey(apiKey)

    const locationCode = req.headers['x-location-code'] as string
    const cpuId = req.headers['x-cpu-id'] as string
    const macAddress = req.headers['x-mac-address'] as string
    const mbSerial = req.headers['x-mb-serial'] as string
    const hddSerial = req.headers['x-hdd-serial'] as string

    const isValid = await this.portalService.authenticateLocation(locationCode, { cpuId, macAddress, mbSerial, hddSerial })

    if (isValid) {
      next()
      return
      // const isValid = await this.portalService.verifyAccount(locationCode)

      // if (isValid) {
      // }
    }

    throw new UnauthorizedException()
  }
}
