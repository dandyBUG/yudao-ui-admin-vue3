import request from '@/config/axios'

export interface PlanCompletionReportRespVO {
  planDate: Date
  workshop: string
  dailyPlanQty: number
  dailyActualQty: number
  plannedCompletion: number
  plannedCompletionRate: number
  cumCompletionQty: number
  delayedCompletion: number
  unfinishedQty: number
  cumUnfinishedQty: number
  mainPlanQty: number
  mainPlannedCompletion: number
  mainPlannedCompletionRate: number
  urgentUnfinishedQty: number
}

export interface PlanCompletionReportPageReqVO {
  pageNo: number
  pageSize: number
  beginPlanDate?: string
  endPlanDate?: string
  workshop?: string
}

export const PlanCompletionReportApi = {
  // 分页查询
  getPage: async (params: PlanCompletionReportPageReqVO) => {
    return await request.get({ url: '/aps/plan-completion-report/page', params })
  },

  // 导出 Excel
  exportExcel: async (params: PlanCompletionReportPageReqVO) => {
    return await request.download({ url: '/aps/plan-completion-report/export-excel', params })
  }
}