export interface Config {
  nodeEnv: string
  url: {
    DATABASE_URL: string
    PORTAL_NEXT_API_URL: string
  }
  port: number
  secret: {
    BG_API_SERVICE_KEY: string
    API_KEY_SIGNATURE_SECRET: string
    API_KEY_IGNORE_EXPIRATION: boolean
    AT_SECRET: string
    RT_SECRET: string
  }
  // publicUrl: string[]
}

const port = (process.env.PORT as unknown as number) || 4000
const isProduction = process.env.NODE_ENV === 'production'
const PORTAL_NEXT_API_URL = isProduction ? process.env.PORTAL_NEXT_API_URL : process.env.PORTAL_NEXT_API_URL_LOCAL

console.group('CONFIG ENV')
console.log('-> NODE_ENV:', process.env.NODE_ENV)
console.log('-> PORT:', port)
console.log('-> PORTAL_NEXT_API_URL:', PORTAL_NEXT_API_URL)

export const config = (): Config => ({
  nodeEnv: process.env.NODE_ENV || '',
  url: {
    DATABASE_URL: process.env.DATABASE_URL || '',
    PORTAL_NEXT_API_URL: PORTAL_NEXT_API_URL || 'http://localhost:3000/api'
  },
  port: port,
  secret: {
    BG_API_SERVICE_KEY: process.env.BG_API_SERVICE_KEY || '@BOREDGUYS1440',
    API_KEY_SIGNATURE_SECRET: process.env.API_KEY_SIGNATURE_SECRET || '@BOREDGUYS1440',
    API_KEY_IGNORE_EXPIRATION: process.env.API_KEY_IGNORE_EXPIRATION === 'true' || false,
    AT_SECRET: process.env.AT_SECRET || '',
    RT_SECRET: process.env.RT_SECRET || ''
  }
  // NO AUTHORIZATION PAGE
  // publicUrl: ['test', 'registration', 'get-master', 'update-master', 'generate-api-key', 'validate-api-key']
})
