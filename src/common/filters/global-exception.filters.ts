import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date().toISOString(),
      path: request.url
    })
  }
}
