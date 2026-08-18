import request from '@/config/axios'

// 缺口汇总 VO
export interface MaterialShortageSummaryVO {
  mainMaterialNo: string
  materialDesc: string
  totalShortageQty: number
  componentCount: number
  // ===== 新增：总成层级的四个字段 =====
  mainRequirement: number      // 总成需求数量
  mainStockQuantity: number    // 总成当前库存
  mainTransit: number          // 总成在途数量
  mainDelivered: number        // 总成已交付数量（销售出库）
}

// 缺口明细 VO
export interface MaterialShortageDetailVO {
  componentMaterialNo: string
  componentDesc: string
  unitUsage: number
  stockQuantity: number
  transit: number
  issue: number
  shortageQty: number
}

// 分页请求
export interface MaterialShortagePageReqVO {
  pageNo: number
  pageSize: number
  mainMaterialNo?: string
  materialDesc?: string
}

// 组件缺口汇总 VO
export interface MaterialShortageComponentSummaryVO {
  componentMaterialNo: string
  componentDesc: string
  totalRequirement: number      // 需求总量
  stockQuantity: number          // 库存
  transit: number                // 在途
  totalIssue: number             // 已投料
  shortageQty: number            // 缺口
  mainCount: number              // 涉及成品数
  mainMaterialNos: string        // 涉及成品列表（逗号分隔）
}

// 组件缺口分页请求
export interface MaterialShortageComponentPageReqVO {
  pageNo: number
  pageSize: number
  componentMaterialNo?: string
  componentDesc?: string
  onlyShortage?: boolean
}


export const MaterialShortageApi = {
  // 查询缺口汇总分页
  getSummaryPage: async (params: MaterialShortagePageReqVO) => {
    return await request.get({ url: `/aps/material-shortage/summary-page`, params })
  },

  // 查询缺口明细
  getDetails: async (mainMaterialNo: string) => {
    return await request.get({ url: `/aps/material-shortage/details?mainMaterialNo=` + mainMaterialNo })
  },

  // 刷新缺口数据
  refreshData: async () => {
    return await request.post({ url: `/aps/material-shortage/refresh` })
  },

  // 导出Excel
  exportExcel: async (params: MaterialShortagePageReqVO) => {
    return await request.download({ url: `/aps/material-shortage/export-excel`, params })
  },

  // 查询组件缺口汇总分页
  getComponentSummaryPage: async (params: MaterialShortageComponentPageReqVO) => {
    return await request.get({ url: `/aps/material-shortage/component-summary-page`, params })
  },

  // 导出组件缺口Excel
  exportComponentExcel: async (params: MaterialShortageComponentPageReqVO) => {
    return await request.download({ url: `/aps/material-shortage/export-component-excel`, params })
  },
}
