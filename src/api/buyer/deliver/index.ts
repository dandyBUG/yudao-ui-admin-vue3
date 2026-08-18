import request from '@/config/axios'

// 配送与采购报表 VO
export interface DeliverVO {
  id: number // 主键ID
  plant: string // 工厂
  deliveryOrderNo: string // 配送单号
  deliveryDate: Date // 配送日期
  creationDate: Date // 创建日期（业务）
  creationTime: string // 创建时间（业务）
  createdBy: string // 创建人（业务）
  lastUpdateDate: Date // 最后更新日期（业务）
  lastUpdateTime: string // 最后更新时间（业务）
  lastUpdatedBy: string // 最后更新人（业务）
  partOrderNo: string // 生产订单号
  productionWorkshop: string // 生产调度员
  partMatCode: string // 主物料编码
  partMatDesc: string // 主物料描述
  reservationNo: string // 预留号
  reservationItem: number // 预留项目
  plannedIssueQty: number // 应发数量
  deliveredQty: number // 已发数量
  undeliveredQty: number // 未配送数量
  buyerMaterialNo: string // 物料号
  oldMaterialNo: string // 旧物料号
  buyerMaterialDesc: string // 物料描述
  deliverySupplierCode: string // 供应商编码(配送单)
  deliverySupplierName: string // 供应商描述(配送单)
  stockSufficientFlag: string // 库存是否满足
  totalStockQty: number // 总库存
  currentStockConsumeQty: number // 本次消耗库存
  deliveryStorageLoc: string // 库存地点(配送)
  poSufficientFlag: string // 采购是否满足
  buyerOrderNo: string // 采购订单号
  lineItem: number // 采购项目
  requirementTrackingNo: string // 需求跟踪号
  orderQty: number // 采购订单数量
  openQty: number // 采购订单未收货数量
  receivedQty: number // 本次交货数量
  poDeliveryDate: Date // 采购订单交货日期
  poSupplierCode: string // 供应商(采购订单)
  supplierDesc: string // 供应商描述(采购订单)
  buyerPurchasingGroup: string // 采购组
  orderingBuyer: string // 下单采购员
  deliveryBuyer: string // 交货采购员
}

// 配送与采购报表 API
export const DeliverApi = {
  // 查询配送与采购报表分页
  getDeliverPage: async (params: any) => {
    return await request.get({ url: `/buyer/deliver/page`, params })
  },

  // 查询配送与采购报表详情
  getDeliver: async (id: number) => {
    return await request.get({ url: `/buyer/deliver/get?id=` + id })
  },

  // 新增配送与采购报表
  createDeliver: async (data: DeliverVO) => {
    return await request.post({ url: `/buyer/deliver/create`, data })
  },

  // 修改配送与采购报表
  updateDeliver: async (data: DeliverVO) => {
    return await request.put({ url: `/buyer/deliver/update`, data })
  },

  // 删除配送与采购报表
  deleteDeliver: async (id: number) => {
    return await request.delete({ url: `/buyer/deliver/delete?id=` + id })
  },

  // 导出配送与采购报表 Excel
  exportDeliver: async (params) => {
    return await request.download({ url: `/buyer/deliver/export-excel`, params })
  },

  // 导入配送与采购报表 Excel (新增)
  importDeliver: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post({
      url: `/buyer/deliver/import-excel`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}
