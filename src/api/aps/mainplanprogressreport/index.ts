import request from '@/config/axios'

export interface MainPlanProgressReportVO {
  productionOrderNo: string
  assemblyOrderQuantity: number
  assemblyMaterialNo: string
  mainMaterialDesc: string
  baseCompletionDate: Date
  productionWorkshop: string
  orderCreateTime: Date
  scheduledQuantity: number
  scheduledDate: Date
  workshopOutput: number
  difference: number
}

export interface MainPlanProgressReportPageReqVO {
  pageNo: number
  pageSize: number
  productionOrderNo?: string
  assemblyMaterialNo?: string
  mainMaterialDesc?: string
  scheduledDateStart?: string
  scheduledDateEnd?: string
  scheduledQuantity?: number
  productionWorkshop?: string
  createTimeStart?: string
  createTimeEnd?: string
}

export const MainPlanProgressReportApi = {
  // 分页查询
  getPage: async (params: MainPlanProgressReportPageReqVO) => {
    return await request.get({ url: `/aps/main-plan-progress-report/page`, params })
  },
  // 导出
  exportExcel: async (params: MainPlanProgressReportPageReqVO) => {
    return await request.download({ url: `/aps/main-plan-progress-report/export-excel`, params })
  }
}

// ================= 新增部分：驾驶舱 API =================
export const MatchingResultApi = {
  // 概览卡片
  getDashboardOverview: async (params: any) => {
    return await request.get({ url: '/aps/main-plan-progress-report/overview', params })
  },
  // 车间统计
  getWorkshopStats: async (params: any) => {
    return await request.get({ url: '/aps/main-plan-progress-report/workshop-stats', params })
  },
  // 供应商统计
  getSupplierStats: async (params: any) => {
    return await request.get({ url: '/aps/main-plan-progress-report/supplier-stats', params })
  },
  // 物料短缺 Top5
  getMaterialShortage: async (params: any) => {
    return await request.get({ url: '/aps/main-plan-progress-report/material-shortage', params })
  },
  // 订单分页
  getOrderPage: async (params: any) => {
    return await request.get({ url: '/aps/main-plan-progress-report/order-page', params })
  },
  // 订单缺料零件
  getOrderShortages: async (orderNo: string) => {
    return await request.get({ url: '/aps/main-plan-progress-report/order-shortages', params: { orderNo } })
  },
  // 零件采购单
  getComponentPurchases: async (componentCode: string, orderNo: string) => {
    return await request.get({ url: '/aps/main-plan-progress-report/component-purchases', params: { componentCode, orderNo } })
  }
}
