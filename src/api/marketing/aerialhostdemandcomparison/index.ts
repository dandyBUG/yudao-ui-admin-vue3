import request from '@/config/axios'

// 日级别响应
export interface DayComparisonVO {
  materialCode: string
  teliCode: string
  materialDesc: string
  productModel: string
  onlinePlan: string
  currentQty: number
  compareQty: number
  diffQty: number
}

// 周级别响应
export interface WeekComparisonVO {
  materialCode: string
  teliCode: string
  materialDesc: string
  productModel: string
  weekKey: string
  weekStartDate: string
  weekEndDate: string
  currentQty: number
  compareQty: number
  diffQty: number
}

// 请求参数
export interface ComparisonReqVO {
  currentDate?: string
  compareDate?: string
  materialCode?: string
  productModel?: string
  plate?: string
}

export const AerialHostDemandComparisonApi = {
  // 获取日对比数据（全量）
  getDayComparison: async (params: ComparisonReqVO) => {
    return await request.get({ url: '/marketing/aerial-host-demand-comparison/day-comparison', params ,timeout: 600000 })
  },
  // 获取周对比数据（全量）
  getWeekComparison: async (params: ComparisonReqVO) => {
    return await request.get({ url: '/marketing/aerial-host-demand-comparison/week-comparison', params ,timeout: 600000 })
  },
  // 获取可用日期列表
  getAvailableDates: async (params?: { plate?: string }) => {
    return await request.get({ url: '/marketing/aerial-host-demand-comparison/available-dates', params })
  },
  // 获取可用的板块列表（从数据库动态获取）
  getAvailablePlates: async () => {
    return await request.get({ url: '/marketing/aerial-host-demand-comparison/available-plates' })
  },
}
