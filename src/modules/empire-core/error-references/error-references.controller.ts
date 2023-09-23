import { Controller, Get } from '@nestjs/common';
import { ErrorReferencesService } from './error-references.service';

@Controller()
export class ErrorReferencesController {
  constructor(private readonly errorService: ErrorReferencesService) {}

  @Get()
  getAllErrorReferences() {
    return this.errorService.getAllErrorReferences();
  }
}