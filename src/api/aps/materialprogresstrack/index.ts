import request from '@/config/axios'

export interface MaterialSummaryItem {
  id: number
  materialCode: string
  materialDesc: string
  workshop: string
  demandMonth: string
  totalDemand: number
  totalCompleted: number
  stock: number
}

export interface MaterialChildItem {
  childMaterialCode: string
  childMaterialDesc: string
  totalDemand: number
  totalIssued: number
  stockQty: number
  shortageQty: number
  suppliers: { supplierName: string; supplyQty: number }[]
}

export interface MaterialSummaryResponse {
  list: MaterialSummaryItem[]
  total: number
  updateTime?: string
}

export const MaterialProgressTrackApi = {
  getMaterialSummary: async (params: {
    pageNo: number
    pageSize: number
    startDate: string
    endDate: string
    workshop?: string
    materialCode?: string
    materialDesc?: string
    onlyAbnormal?: boolean
  }): Promise<MaterialSummaryResponse> => {
    return await request.get({
      url: '/aps/material-progresstrack/material-summary',   // 修改为实际后端路径
      params
    })
  },

  getMaterialChildren: async (params: {
    materialCode: string
    workshop: string
    demandMonth: string
  }): Promise<MaterialChildItem[]> => {
    return await request.get({
      url: '/aps/material-progresstrack/material-children',  // 修改为实际后端路径
      params
    })
  },

  exportMaterialSummary: async (params: any) => {
    return await request.download({
      url: '/aps/material-progresstrack/export',
      params
    })
  }
}
