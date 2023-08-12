import { PrismaService } from '@/modules/prisma/prisma.service'
import { BadRequest, InternalServerError, NoRecordFound, UnprocessableEntity } from '@/common/utils/custom-error'
import { Injectable } from '@nestjs/common'
import {
  SalesParamDto,
  SalesDataDto,
  InventoryDataDto,
  ModTransferDataDto,
  TransferQueryParamDto,
  RegistrationLocationDto,
  ReferenceDto
} from './dto'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { sliceIntoChunks } from '@/common/utils/helper'
import { clearConfigCache } from 'prettier'

@Injectable()
export class EmpireService {
  constructor(private readonly prisma: PrismaService) {}

  async locationRegistration(body: RegistrationLocationDto) {
    try {
      // const { salesDetails } = data
      // const fromDate = new Date(param.fromDate).toISOString()
      // const toDate = new Date(param.toDate).toISOString()

      // await this.prisma.$transaction([
      //   this.prisma.salesDetails.deleteMany({ where: { AND: { locationCode, tranDate: { gte: fromDate, lte: toDate } } } }),
      //   this.prisma.salesDetails.createMany({ data: salesDetails })
      // ])

      const { bgLocationCode, ...restOfData } = body.data

      await this.prisma.registration.create({ data: { locationCode: bgLocationCode, ...restOfData } })

      return { success: true }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new UnprocessableEntity({
            error: 'Registration exist.',
            message: 'Location code and Machine Details already registered.'
          })
        }

        throw new UnprocessableEntity(error)
      }

      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async postSales(locationCode: string, param: SalesParamDto, data: SalesDataDto) {
    try {
      const { salesDetails } = data
      const fromDate = new Date(param.fromDate).toISOString()
      const toDate = new Date(param.toDate).toISOString()

      await this.prisma.$transaction([
        this.prisma.salesDetails.deleteMany({ where: { AND: { locationCode, tranDate: { gte: fromDate, lte: toDate } } } }),
        this.prisma.salesDetails.createMany({ data: salesDetails })
      ])

      return { success: true }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async postInventory(locationCode: string, data: InventoryDataDto) {
    try {
      const { items } = data

      const dataItems = sliceIntoChunks(items, 1000)
      let tempItems: InventoryDataDto['items'] = []

      for (let i = 0; i < dataItems.length; i++) {
        const e = dataItems[i]
        tempItems.push(e)
      }

      const createInventory = tempItems.map((itemArr) => this.prisma.inventory.createMany({ data: itemArr }))

      try {
        await this.prisma.$executeRaw`DELETE FROM Inventory WHERE locationCode = ${locationCode}`
        await Promise.all(createInventory)

        return { success: true }
      } catch (error) {
        throw new UnprocessableEntity('Error posting Inventory Data.')
      }

      // await this.prisma.$transaction(async (db) => {
      //   try {
      //     await db.$executeRaw`DELETE FROM Inventory WHERE locationCode = ${locationCode}`
      //   } catch (error) {
      //     throw new UnprocessableEntity('Error deleting Inventory Data.')
      //   }

      //   try {
      //     await db.inventory.createMany({ data: items })
      //   } catch (error) {
      //     throw new UnprocessableEntity('Error creating Inventory Data.')
      //   }
      // })

      return { success: true }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async postReference(businessCode: string, data: ReferenceDto) {
    if (!businessCode) {
      throw new BadRequest({ message: '[HEADER] Business code not found.', code: 'H002' })
      // return { message: '[HEADER] Business code not found.' }
      // throw new Error('Business Code HEADER not found.')
    }

    try {
      const { items } = data

      const upsertItems = items.map((item) =>
        this.prisma.masterItem.upsert({ where: { itemCode: item.itemCode }, create: item, update: item })
      )

      Promise.all(upsertItems)

      return { success: true }

      // const dataItems = sliceIntoChunks(items, 1000)
      // let tempItems: ReferenceDto['items'] = []

      // for (let i = 0; i < dataItems.length; i++) {
      //   const e = dataItems[i]
      //   tempItems.push(e)
      // }

      // const createItems = tempItems.map((itemArr) => this.prisma.masterItem.createMany({ data: itemArr }))

      // try {
      //   await this.prisma.$executeRaw`DELETE FROM MasterItem WHERE businessCode = ${businessCode}`
      //   await Promise.all(createItems)

      //   return { success: true }
      // } catch (error) {
      //   throw new UnprocessableEntity('Error posting Item Master Data.')
      // }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async getInventoryData(businessCode: string, locationCode: string) {
    console.log('🚀 ~ file: empire.service.ts:97 ~ EmpireService ~ getInventoryData ~ businessCode:', businessCode)
    if (!businessCode) {
      throw new BadRequest({ message: '[HEADER] Business code not found.', code: 'H002' })
      // return { message: '[HEADER] Business code not found.' }
      // throw new Error('Business Code HEADER not found.')
    }

    try {
      // const businessData = await this.prisma.business.findUnique({
      //   where: { bgBusinessCode: businessCode },
      //   include: { location: { include: { inventory: true } } }
      // })

      const businessData = await this.prisma.business.findUnique({
        where: { bgBusinessCode: businessCode },
        select: { location: { select: { bgLocationCode: true } } }
      })

      if (!businessData) {
        throw new NoRecordFound({ message: 'No business code found.' })
      }

      const locationCodes = businessData.location.map((loc) => loc.bgLocationCode)
      const inventory = await this.prisma.inventory.findMany({ where: { locationCode: { in: locationCodes } } })

      if (!inventory) {
        throw new NoRecordFound({ message: 'No inventory data found.' })
      }

      return { inventory }
    } catch (error) {
      if (error instanceof NoRecordFound) {
        throw new NoRecordFound({ message: error.message, code: 'H001' })
      }

      throw new InternalServerError(error)
    }
  }

  async postModTransfer(data: ModTransferDataDto) {
    try {
      const { transferHeader, stockDetails, posting } = data

      const newHeader = transferHeader[0]
      const { locationCode, doc_nb } = newHeader

      await this.prisma.$transaction([
        this.prisma.modTransferHeader.upsert({
          create: newHeader,
          update: newHeader,
          where: { locationCode_doc_nb: { locationCode, doc_nb } }
        }),
        this.prisma.modStockDetails.deleteMany({
          where: { AND: { locationCode, doc_nb } }
        }),
        this.prisma.modStockDetails.createMany({ data: stockDetails }),
        this.prisma.modPosting.deleteMany({
          where: { AND: { locationCode, source_nb: doc_nb } }
        }),
        this.prisma.modPosting.createMany({ data: posting })
      ])

      return { success: true }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new UnprocessableEntity({
            error: 'Unique constraint failed.',
            message: 'Please double check your data.',
            prismaError: error
          })
        }

        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async getTransferData(locationCode: string, params: TransferQueryParamDto) {
    try {
      const { tlocid_no, getAll } = params
      const newLocId = Number(tlocid_no)
      const newGetAll = getAll === 'true'
      // const isGetAll = newGetAll ? undefined : { isGet: true }

      const isGetAll = newGetAll
        ? { locationCode: locationCode, tlocid_no: newLocId }
        : { locationCode: locationCode, tlocid_no: newLocId, isGet: false }

      //console.log(isGetAll)
      const header = await this.prisma.modTransferHeader.findMany({
        // where: { AND: { locationCode: locationCode, tlocid_no: newLocId, ...isGetAll } },
        where: { AND: isGetAll },
        select: { doc_nb: true }
      })

      const doc_nb = header.map((row) => {
        return row.doc_nb
      })

      const result = await this.prisma.modTransferHeader.findMany({
        where: { AND: { doc_nb: { in: doc_nb } } },
        include: { details: true }
      })

      // SET TO TRUE IF ALREADY GET. ---> IKAW NA BAHALA IF ANO YUNG POLICY MO SA SERVER AGENT.
      await this.prisma.modTransferHeader.updateMany({ where: { doc_nb: { in: doc_nb } }, data: { isGet: true } })

      return result
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async removeRecord(locationCode: string, doc_nb: string) {
    try {
      await this.prisma.$transaction([
        this.prisma.modTransferHeader.deleteMany({
          where: { AND: { locationCode: locationCode, doc_nb: doc_nb } }
        }),
        this.prisma.modStockDetails.deleteMany({
          where: { AND: { locationCode, doc_nb } }
        })
      ])

      return { success: true, empire: 'empire' }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }

  async findAll() {
    try {
      return { success: true, empire: 'empire' }
    } catch (error) {
      if (error instanceof UnprocessableEntity) {
        throw new UnprocessableEntity(error)
      }

      throw new InternalServerError(error)
    }
  }
}
