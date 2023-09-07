import { HttpException, HttpStatus } from '@nestjs/common'

export class AuthenticationError extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response || 'Unable to process request! Please check your API Key & Data.', HttpStatus.UNAUTHORIZED)
  }
}

export class BadRequest extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response || 'Unable to process request! Please check your data.', HttpStatus.BAD_REQUEST)
  }
}

export class NoRecordFound extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response || 'No record found.', HttpStatus.NOT_FOUND)
  }
}

export class NotFoundException extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response || 'Request Not found.', HttpStatus.NOT_FOUND)
  }
}

export class UnprocessableEntity extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response || 'Unable to process request! Please check your data.', HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export class InternalServerError extends HttpException {
  constructor(response?: string | Record<string, any> | unknown) {
    super(response || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export class ForbiddenAccess extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response || 'Unable to process request! Please check your API Key & Data.', HttpStatus.FORBIDDEN)
  }
}
