import request from '@/config/axios'

export interface OverseasInventoryVO {
  id?: string
  warehouse?: string
  ownerCode?: string
  supplierCode?: string
  supplierName?: string
  itemCode?: string
  itemName?: string
  itemSpecification?: string
  inventoryQuantity?: number
  occupiedQuantity?: number
  availableQuantity?: number
  frozenQuantity?: number
}

export interface OverseasInventoryPageReqVO {
  pageNo: number
  pageSize: number
  ownerCode?: string
  supplierCode?: string
  itemCode?: string
  itemName?: string
}

export const OverseasInventoryApi = {
  getPage: (params: OverseasInventoryPageReqVO) => request.get({ url: '/buyer/overseas-inventory/page', params }),
  get: (id: string) => request.get({ url: `/buyer/overseas-inventory/get?id=${id}` }),
  create: (data: OverseasInventoryVO) => request.post({ url: '/buyer/overseas-inventory/create', data }),
  update: (data: OverseasInventoryVO) => request.put({ url: '/buyer/overseas-inventory/update', data }),
  delete: (id: string) => request.delete({ url: `/buyer/overseas-inventory/delete?id=${id}` }),
  export: (params: OverseasInventoryPageReqVO) => request.download({ url: '/buyer/overseas-inventory/export-excel', params }),
  downloadImportTemplate: () => request.download({ url: '/buyer/overseas-inventory/import-template' }),
  importExcel: (file: File) => {
    const data = new FormData()
    data.append('file', file)
    return request.post({ url: '/buyer/overseas-inventory/import-excel', data, headersType: 'multipart/form-data' })
  }
}
