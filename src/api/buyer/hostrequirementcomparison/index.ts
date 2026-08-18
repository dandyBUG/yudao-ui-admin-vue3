import request from '@/config/axios'

export interface HostRequirementComparisonRespVO {
  chassisOnlinePlanDate?: string
  productModel?: string
  productionOrder?: string
  bareMachineOrderNo?: string
  drivingUnitOrderNo?: string
  quota1?: number
  quota2?: number
  unitQuantity?: number
  versionDate?: string
  cylinderName?: string
  materialNo?: string
  teliCode?: string
  config?: number
  requiredQuantity?: number
  fallbackMatched?: number
}

export interface HostRequirementComparisonPageReqVO {
  pageNo: number
  pageSize: number
  productModel?: string
  seqNo2026?: string
  bareMachineOrderNo?: string
  materialNo?: string
  currentDate?: string   // 新增
  compareDate?: string   // 新增
  fallbackMatched?: number | null
}

export const HostRequirementComparisonApi = {
  // 分页查询
  getPage: async (params: HostRequirementComparisonPageReqVO) => {
    return await request.get({ url: `/buyer/host-requirement-comparison/page`, params })
  },

  // 导出 Excel
  exportExcel: async (params: HostRequirementComparisonPageReqVO) => {
    return await request.download({ url: `/buyer/host-requirement-comparison/export-excel`, params })
  },

  // 获取可选的导入日期列表
  getAvailableDates: async () => {
    return await request.get({ url: `/buyer/host-requirement-comparison/available-dates` })
  },
}
