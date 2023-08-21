import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { userData } from './data'

async function main() {
  await seedMasterUser()
}

const masterUser = userData.map(async (data) => {
  await prisma.masterUser.upsert({ where: { userName: data.userName }, update: data, create: data })
})

const status = ['whitelisted', 'blocklisted']
const regStatus = status.map(async (stat) => {
  const data = { id: stat, code: stat, name: stat, isActive: true }

  await prisma.registrationStatus.upsert({ where: { id: stat }, update: data, create: data })
})

async function seedMasterUser() {
  await Promise.all([masterUser, regStatus])
}

// async function seedEntities() {
//     await Promise.all(entitiesData.map(async (data) => {
//         await prisma.entity.upsert({ where: { id: data.id }, update: {}, create: data })
//     }))
// }

// async function seedReference() {
//     await Promise.all(referenceData.map(async(data) => {
//         await prisma.reference.upsert({ where: { id: data.id }, update: {}, create: data })
//     }))
// }

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
