import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { PortalService } from '../../modules/portal/portal.service'
import { ConfigService } from '@nestjs/config'
import { AuthenticationError } from '../utils/custom-error'

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthenticationMiddleware.name)

  constructor(private readonly configService: ConfigService, private readonly portalService: PortalService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(AuthenticationMiddleware.name)
    this.logger.log({ method: req.method, baseUrl: req.baseUrl, body: req.body })

    // REQUEST
    const reqUrl = req.baseUrl

    // console.log('🚀 -> AuthenticationMiddleware -> use -> reqUrl:', reqUrl)

    // THIS SHOULD BE IN TABLE OF BUSINESS & LOCATION
    // THIS SHOULD VERIFY BEFORE PROCEEDING TO GUARD.
    const apiKey = req.headers.authorization?.replace('Bearer ', '')

    // TEMPORARY
    if (reqUrl.includes('generate-api-key')) {
      const bg_api_service_key = req.headers.bg_api_service_key
      const ENV_bg_api_service_key = this.configService.get('secret').BG_API_SERVICE_KEY

      if (bg_api_service_key !== ENV_bg_api_service_key) {
        throw new AuthenticationError('Unauthorized Access: BG_API_SERVICE_KEY is not valid.')
      }

      next()
      return
    }

    // FOR EMPIRE LOCAL ROUTE
    const reqRootUrl = reqUrl.split('/')[2]

    if (reqRootUrl === 'empire') {
      if (reqUrl.includes('registration')) {
        const payload = await this.portalService.validateApiKey(apiKey)

        if (payload) {
          req.user = { locationCode: payload.bgLocationCode, app: 'empire' }
          next()
          return
        }
      }

      const locationCode = req.headers['x-location-code'] as string
      const isValid = await this.portalService.authenticateLocation(locationCode, req.headers)

      if (isValid) {
        req.user = { locationCode, app: 'empire' }
        next()
        return
      }

      throw new UnauthorizedException()
    }

    // FOR CORE EMPIRE WEB ROUTE
    if (reqRootUrl === 'empire-core') {
      const payload = await this.portalService.validateApiKey(apiKey, true)

      if (payload) {
        const businessCode = req.headers['x-business-code'] as string
        const isValid = await this.portalService.authenticateBusiness(businessCode, payload.apiKey)

        if (isValid) {
          req.user = { businessCode, app: 'empire-core' }
          next()
          return
        }

        throw new UnauthorizedException()
      }
    }

    // ALL ROUTES SHOULD FALL HERE. ---> PROCEED TO COMMON AUTH GUARD
    next()
    return
  }
}
