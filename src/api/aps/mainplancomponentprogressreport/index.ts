import request from '@/config/axios'

// 组件物料需求报表 VO
export interface MainPlanComponentProgressReportVO {
  productionOrderNo: string       //生产订单号
  assemblyMaterialNo: string      // 主物料号
  componentMaterialNo: string     // 组件物料号
  materialDesc: string            // 组件物料描述
  productionWorkshop: string      // 生产车间
  totalRequirement: number        // 总需求
  stockQuantity: number           // 库存
  orderQuantity: number          // 在制
  openPoQuantity: number          // 采购未清订单数量
  satisfy: string                 // 是否满足
  materialPreparation: string     // 备料
  procurementType: string         // 采购类型
  supplier: string                // 供方
}

// 分页请求参数 VO
export interface MainPlanComponentProgressReportPageReqVO {
  pageNo: number
  pageSize: number
  productionOrderNo?: string
  assemblyMaterialNo?: string
  componentMaterialNo?: string
  materialDesc?: string
  productionWorkshop?: string
  scheduledDateStart?: string
  scheduledDateEnd?: string
}

// API 方法
export const MainPlanComponentProgressReportApi = {
  // 分页查询
  getPage: async (params: MainPlanComponentProgressReportPageReqVO) => {
    return await request.get({ url: `/aps/main-plan-component-progress-report/page`,
      params,
      timeout: 600000  })
  },

  // 导出 Excel
  exportExcel: async (params: MainPlanComponentProgressReportPageReqVO) => {
    return await request.download({ url: `/aps/main-plan-component-progress-report/export-excel`,
      params,
      timeout: 600000  })
  }
}
