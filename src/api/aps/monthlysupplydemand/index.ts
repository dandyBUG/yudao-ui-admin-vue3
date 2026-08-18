import request from '@/config/axios'

export interface MonthlySupplyDemandSummaryVO {
  id: number
  assemblyMaterialNo: string
  materialDesc: string
  scheduledDate: string
  requireQuantity: number
  salesOutQuantity: number  // 销售出库数量
  stockQuantity: number
  wip: number
  netRequirement: number
  scheduledQuantity: number
  shortage: number
  createTime: string
}

export interface MonthlySupplyDemandSummaryPageReqVO {
  pageNo: number
  pageSize: number
  assemblyMaterialNo?: string
  materialDesc?: string
  scheduledDate?: string
  scheduledDateStart?: string
  scheduledDateEnd?: string
  createTimeStart?: string
  createTimeEnd?: string
}

export const MonthlySupplyDemandSummaryApi = {
  getPage: async (params: MonthlySupplyDemandSummaryPageReqVO) => {
    return await request.get({
      url: `/aps/monthly-supply-demand-summary/page`,
      params
    })
  },
  exportExcel: async (params: MonthlySupplyDemandSummaryPageReqVO) => {
    return await request.download({
      url: `/aps/monthly-supply-demand-summary/export-excel`,
      params
    })
  }
}
