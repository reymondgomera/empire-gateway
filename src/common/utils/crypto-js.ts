import CryptoJS from 'crypto-js'
import crypto from 'crypto'

const secretPass = process.env.PASSWORD_SECRET || 'P@SSWORD'
const secret_key = secretPass
const secret_iv = 'secretIV'
const ecnryption_method = 'aes-256-cbc'

// export function encryptPassword(password: string) {
//   return CryptoJS.AES.encrypt(password, 'secretPass').toString()
// }

// export function decryptPassword(password: string) {
//   const bytes = CryptoJS.AES.decrypt(password, 'secretPass')

//   return bytes.toString(CryptoJS.enc.Utf8)
// }

const key = crypto.createHash('sha512').update(secret_key).digest('hex').substring(0, 32)
const encryptionIV = crypto.createHash('sha512').update(secret_iv).digest('hex').substring(0, 16)

// Encrypt data
export function encryptData(data) {
  const cipher = crypto.createCipheriv(ecnryption_method, key, encryptionIV)
  return Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64') // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv(ecnryption_method, key, encryptionIV)
  return decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8') // Decrypts data and converts to utf8
}
