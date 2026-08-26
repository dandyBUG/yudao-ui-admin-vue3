import request from '@/config/axios'

export interface ProductionMaterialSupplyVO {
  productionOrderNo: string
  assemblyMaterialNo: string
  assemblyMaterialDesc: string
  assemblyDemandQuantity: number
  scheduledDate?: string
  componentMaterialNo: string
  componentMaterialDesc: string
  demandQuantity: number
  procurementType: string
  investmentDate?: string
  dateSource: string
  investedQuantity: number
  stockQuantity: number
  productionTransit: number
  purchaseTransit: number
  applicableTransit: number
  shortageQuantity: number
  purchaseOrderDateSummary: string
  purchaseOrderSummary: string
  projectNo: string
  purchaseMaterialNo: string
  purchaseMaterialDesc: string
  deliveryDateSummary: string
  supplierSummary: string
}

export interface ProductionMaterialSupplyPageReqVO {
  pageNo: number
  pageSize: number
  productionOrderNo?: string
  assemblyMaterialNo?: string
  componentMaterialNo?: string
  materialDesc?: string
  procurementType?: string
  scheduledDateStart: string
  scheduledDateEnd: string
  onlyShortage?: boolean
}

export const ProductionMaterialSupplyApi = {
  getPage: async (params: ProductionMaterialSupplyPageReqVO) => {
    return await request.get({
      url: '/aps/production-material-supply/page',
      params,
      timeout: 600000
    })
  },

  exportExcel: async (params: ProductionMaterialSupplyPageReqVO) => {
    return await request.download({
      url: '/aps/production-material-supply/export-excel',
      params,
      timeout: 600000
    })
  }
}
