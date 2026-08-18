import request from '@/config/axios'

// 请求参数（继承 PageParam）
export interface HostRequirementComparisonDiffReqVO {
  pageNo: number
  pageSize: number
  currentDate?: string   // yyyy-MM-dd
  compareDate?: string   // yyyy-MM-dd
  productModel?: string
  seqNo2026?: string
  bareMachineOrderNo?: string
  materialNo?: string
}

// 响应数据（与后端 VO 一致）
export interface HostRequirementComparisonDiffVO {
  // 基础信息
  productModel: string
  productionOrder: string
  bareMachineOrderNo: string
  drivingUnitOrderNo: string

  // 本月数据
  chassisOnlinePlanDate?: string   // 显示月份日期
  quota2?: string                   // 显示月份配额
  materialNo?: string               // 显示月份主机图号
  cylinderName?: string             // 显示月份分解油缸
  telicode?: string                 // 显示月份特力图号
  config?: number                   // 显示月份配置
  requiredQuantity?: number         // 显示月份需配数量
  unitQuantity?: number             // 台套

  // 对比月数据
  versionDate?: string              // 对比月份日期
  quota1?: string                   // 对比月份配额
  materialNoCompare?: string        // 对比月份主机图号
  telicodeCompare?: string          // 对比月份特力图号
  configCompare?: number            // 对比月份配置
  requiredQuantityCompare?: number  // 对比月份需配数量

  // 差异标志
  quota1Diff?: boolean
  materialNoDiff?: boolean
  configDiff?: boolean
  requiredQuantityDiff?: boolean

  // 增量
  requiredQuantityIncrease?: number
}

// API 方法
export const HostRequirementComparisonDiffApi = {
  getDiffPage: async (params: HostRequirementComparisonDiffReqVO) => {
    return await request.get({ url: `/buyer/host-requirement-comparison-diff/page`,
      params,
        timeout: 600000  // 设置超时时间（毫秒）
         })
  },
  exportDiffExcel: async (params: HostRequirementComparisonDiffReqVO) => {
    return await request.download({ url: `/buyer/host-requirement-comparison-diff/export-excel`, params })
  },
  getAvailableDates: async () => {
    return await request.get({ url: `/buyer/host-requirement-comparison-diff/available-dates` })
  }
}
