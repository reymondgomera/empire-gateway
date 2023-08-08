import { Injectable, Scope } from '@nestjs/common'

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private location!: string

  setLocation(location: string) {
    this.location = location
  }

  getLocation() {
    return this.location
  }
}
