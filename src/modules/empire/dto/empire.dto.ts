import { ModTransferHeader } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

export const SalesParamSchema = z.object({
  fromDate: z.dateString().format('date'),
  toDate: z.dateString().format('date')
})

export class SalesParamDto extends createZodDto(SalesParamSchema) {}

export const SalesDataSchema = z.object({
  salesDetails: z.array(
    z.object({
      locationCode: z.string(),
      tranDate: z.dateString(),
      tranCode: z.string(),
      cashierCode: z.string(),
      itemCode: z.string(),
      qty: z.number(),
      total: z.number()
    })
  )
})

export class SalesDataDto extends createZodDto(SalesDataSchema) {}

export const RegistrationLocationSchema = z.object({
  data: z.object({
    bgLocationCode: z.string(),
    cpuId: z.string(),
    macAddress: z.string(),
    mbSerial: z.string(),
    hddSerial: z.string()
  })
})

export class RegistrationLocationDto extends createZodDto(RegistrationLocationSchema) {}

export const InventoryDataSchema = z.object({
  items: z.array(
    z.object({
      locationCode: z.string(),
      itemCode: z.string(),
      qty: z.number(),
      cost: z.number(),
      price: z.number()
    })
  )
})

export class InventoryDataDto extends createZodDto(InventoryDataSchema) {}

export const ItemMasterSchema = z.object({
  items: z.array(
    z.object({
      businessCode: z.string(),
      itemCode: z.string(),
      code: z.string(),
      name: z.string(),
      brand: z.string().nullish(),
      category: z.string().nullish(),
      generic: z.string().nullish(),
      uom: z.string().nullish(),
      cost: z.number().nullish(),
      price: z.number().nullish()
    })
  )
})

export class ReferenceDto extends createZodDto(ItemMasterSchema) {}

export const ModTransferHeaderDataSchema = z.object({
  transferHeader: z.array(
    z.object({
      locationCode: z.string(),
      tran_ty: z.number(),
      flocid_no: z.number(),
      tlocid_no: z.number(),
      direct_yn: z.boolean().optional(),
      transitid_no: z.number().optional(),
      statid_no: z.number().optional(),
      doc_nb: z.string(),
      doc_dt: z.dateString().optional(),
      post_dt: z.dateString().optional(),
      userid_no: z.number().optional(),
      pi_nm: z.string().optional(),
      ship_dt: z.dateString().optional(),
      shipid_no: z.number().optional(),
      shipagentid_no: z.number().optional(),
      receipt_dt: z.dateString().optional(),
      locid_no: z.number().optional(),
      contact_nm: z.string().optional(),
      phone_nb: z.string().optional(),
      mobile_nb: z.string().optional(),
      approverid_no: z.number().optional().nullable(),
      approvalid_no: z.number().optional().nullable(),
      createid_no: z.number().optional(),
      postid_no: z.number().optional(),
      actid_no: z.number().optional(),
      link_nb: z.string().optional().nullable(),
      produce_yn: z.boolean().optional().nullable(),
      audit_yn: z.boolean().optional().nullable(),
      audit_dt: z.dateString().optional().nullable(),
      year_tx: z.string().optional().nullable().nullable(),
      ystatid_no: z.number().optional().nullable(),
      brtran_ty: z.number().optional().nullable(),
      remarks_tx: z.string().optional().nullable(),
      sttrantyid_no: z.number().optional().nullable(),
      refid_no: z.number().optional().nullable()
    })
  )
})

export const ModStockDetailsDataSchema = z.object({
  stockDetails: z.array(
    z.object({
      locationCode: z.string(),
      doc_nb: z.string(),
      typeid_no: z.number().optional(),
      itemid_no: z.number(),
      item_cd: z.string().optional(),
      item_nm: z.string().optional(),
      locid_no: z.number(),
      qty_am: z.number(),
      uomid_no: z.number().optional(),
      cost_am: z.number(),
      tcost_am: z.number(),
      tax_yn: z.boolean().optional(),
      taxid_no: z.number().optional(),
      tax_am: z.number().optional(),
      disc_rt: z.number().optional().nullable(),
      disc_am: z.number().optional().nullable(),
      tran_am: z.number().optional().nullable(),
      qtypost_am: z.number(),
      lot_yn: z.boolean(),
      count_am: z.number().optional().nullable(),
      sourceid_no: z.number(),
      qtyprod_am: z.number().optional(),
      line_no: z.number().optional().nullable(),
      beginv_am: z.number().optional(),
      in_am: z.number().optional(),
      out_am: z.number().optional(),
      transfer_am: z.number().optional(),
      sold_am: z.number().optional(),
      production_am: z.number().optional().nullable(),
      remarks_tx: z.string().optional().nullable(),
      update_yn: z.boolean().optional(),
      recvdt_tx: z.string().optional().nullable(),
      invdt_tx: z.string().optional().nullable(),
      inv_nb: z.string().optional().nullable()
    })
  )
})

export const ModPostingDataSchema = z.object({
  posting: z.array(
    z.object({
      locationCode: z.string(),
      line_no: z.number(),
      tran_ty: z.number(),
      module_nm: z.string(),
      source_nb: z.string(),
      post_nb: z.string().nullable(),
      locid_no: z.number(),
      itemid_no: z.number(),
      qty_am: z.number(),
      brrecvd_am: z.number().nullable(),
      uomid_no: z.number().nullable(),
      serial_nb: z.string().nullable(),
      batch_nb: z.string().nullable(),
      lot_nb: z.string().nullable(),
      exp_dt: z.dateString().nullable(),
      postedid_no: z.number(),
      tran_dt: z.dateString().nullable(),
      userid_no: z.number().nullable(),
      count_am: z.number().nullable(),
      variance_am: z.number().nullable(),
      child_yn: z.boolean().nullable(),
      year_tx: z.string().nullable(),
      recvdt_tx: z.string().nullable(),
      invdt_tx: z.string().nullable(),
      inv_nb: z.string().nullable()
    })
  )
})

export class ModTransferDataDto extends createZodDto(
  ModTransferHeaderDataSchema.merge(ModStockDetailsDataSchema).merge(ModPostingDataSchema)
) {}

export const TransferQueryParamSchema = z.object({ tlocid_no: z.string(), getAll: z.string().optional() })
export class TransferQueryParamDto extends createZodDto(TransferQueryParamSchema) {}
