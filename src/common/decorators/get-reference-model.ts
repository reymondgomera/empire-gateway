import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetReferenceModel = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const path = (request.path as string) ?? ''
  const model = path.split('/')[4]

  return model ?? ''
})
