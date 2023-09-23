import { Injectable } from '@nestjs/common'
import { errorMappings } from '../../../common/exception/prisma-client-exception.filter'

@Injectable()
export class ErrorReferencesService {
  getAllErrorReferences() {
    const errorReferences = Object.entries(errorMappings).map(([errorCode, errorInfo]) => ({
      code: errorCode.replace("P", "BG"),
      status: errorInfo.status,
      message: errorInfo.message
    }))

    return { errorReferences }
  }
}
