import request from '@/config/axios'

// 订单组件需求进度报表 VO
export interface OrderComponentProgressReportVO {
  productionOrderNo: string          // 生产订单号
  componentMaterialNo: string        // 组件物料号
  materialDesc: string               // 组件物料描述
  orderQuantity: number              // 订单数量
  unitUsage: number                  // 单机用量
  totalRequirement: number           // 总需求
  stockQuantity: number              // 库存
  workInProgress: number             // 在制
  openPoQuantity: number             // 采购未清订单数量
  satisfy: string                    // 是否满足
  scheduledDate: string              // 计划开始日期
  basicEndDate: string               // 计划完成日期
  productionWorkshop: string         // 生产车间
  procurementType: string            // 采购类型
}

// 分页请求参数 VO
export interface OrderComponentProgressReportPageReqVO {
  pageNo: number
  pageSize: number
  productionOrderNo?: string
  componentMaterialNo?: string
  materialDesc?: string
  productionWorkshop?: string
  scheduledDateStart?: string
  scheduledDateEnd?: string
  basicEndDateStart?: string
  basicEndDateEnd?: string
}

// API 方法
export const OrderComponentProgressReportApi = {
  // 分页查询
  getPage: async (params: OrderComponentProgressReportPageReqVO) => {
    return await request.get({
      url: `/aps/order-component-progress-report/page`,
      params,
      timeout: 600000
    })
  },

  // 导出 Excel
  exportExcel: async (params: OrderComponentProgressReportPageReqVO) => {
    return await request.download({
      url: `/aps/order-component-progress-report/export-excel`,
      params,
      timeout: 600000
    })
  }
}
