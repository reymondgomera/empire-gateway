import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ErrorReferencesController } from './error-references.controller'
import { ErrorReferencesService } from './error-references.service'


@Module({
    imports: [
    HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
    })
    ],
    providers: [ErrorReferencesService],
    controllers: [ErrorReferencesController]
})
export class ErrorReferencesModule {}