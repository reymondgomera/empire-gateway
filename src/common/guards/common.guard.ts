import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { PortalAuth } from 'src/types'

@Injectable()
export class CommonAuthGuard implements CanActivate {
  private readonly logger = new Logger(CommonAuthGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.log(CommonAuthGuard.name)

    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])

    if (isPublic) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user as PortalAuth

    if (user) {
      return true
    }

    return false
  }
  // ! IMPORTANT ---> THIS WILL THROW 403 IF RESULT RETURN [FALSE]
  // {
  //     "message": "Forbidden resource",
  //     "error": "Forbidden",
  //     "statusCode": 403
  // }
}
