import request from '@/config/axios'

// 销售订单 VO
export interface SalesOrderVO {
  id: number
  salesOrganization: string
  salesDepartment: string
  soldToParty: string
  soldToPartyName: string
  salesRegion: string
  orderDate: Date
  orderType: string
  approvalStatus: string
  orderNumber: string
  orderItem: number
  accountSettingGroup: string
  materialCode: string
  materialDescription: string
  earliestDeliveryDate: Date
  orderQuantity: number
  unit: string
  shipToParty: string
  shipToPartyName: string
  unloadingPoint: string
  priceListType: string
  pricingDate: Date
  unitPrice: number
  netSalesValue: number
  subtotal: number
  taxAmount: number
  latestSalesPrice: number
  priceExclTax: number
  latestAmount: number
  netWeight: number
  grossWeight: number
  weightUnit: string
  plant: string
  shippingPoint: string
  storageLocation: string
  deliveredQuantity: number
  shippedQuantity: number
  invoicedQuantity: number
  deliveryStatus: string
  creatorName: string
  creationDate: Date
  deliveryBlock: string
  invoiceBlock: string
  orderReason: string
  rejectionReason: string
  invoiceType: string
  materialGroup: string
}

// 销售订单 API
export const SalesOrderApi = {
  // 分页查询
  getSalesOrderPage: async (params: any) => {
    return await request.get({ url: `/marketing/sales-order/page`, params })
  },

  // 详情
  getSalesOrder: async (id: number) => {
    return await request.get({ url: `/marketing/sales-order/get?id=` + id })
  },

  // 新增
  createSalesOrder: async (data: SalesOrderVO) => {
    return await request.post({ url: `/marketing/sales-order/create`, data })
  },

  // 修改
  updateSalesOrder: async (data: SalesOrderVO) => {
    return await request.put({ url: `/marketing/sales-order/update`, data })
  },

  // 删除
  deleteSalesOrder: async (id: number) => {
    return await request.delete({ url: `/marketing/sales-order/delete?id=` + id })
  },

  // 导出
  exportSalesOrder: async (params: any) => {
    return await request.download({ url: `/marketing/sales-order/export-excel`, params })
  },

  // 导入 Excel
  importExcel: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload({ url: '/marketing/sales-order/import', data: formData })
  },
}
