import request from '@/config/axios'

// 高机剪叉周计划 VO
export interface ScissorLiftWplanVO {
  id: number // 主键ID
  productLine: string // 产品线
  preciseModel: string // 精准车型
  productModel: string // 产品型号
  preciseBom: string // 精准BOM
  planDate: Date // 生产日期
  weekNo: string // 周次
  weekStartDate: Date // 周起始日期
  weekEndDate: Date // 周结束日期
  dailyQuantity: number // 当日数量
  carNumberRange: string // 车号范围
  productionLineType: string // 生产线条类型
  plate: string // 板块
  importTime: Date // 导入批次时间
}

// 高机剪叉周计划 API
export const ScissorLiftWplanApi = {
  // 查询高机剪叉周计划分页
  getScissorLiftWplanPage: async (params: any) => {
    return await request.get({ url: `/marketing/scissor-lift-wplan/page`, params })
  },

  // 查询高机剪叉周计划详情
  getScissorLiftWplan: async (id: number) => {
    return await request.get({ url: `/marketing/scissor-lift-wplan/get?id=` + id })
  },

  // 新增高机剪叉周计划
  createScissorLiftWplan: async (data: ScissorLiftWplanVO) => {
    return await request.post({ url: `/marketing/scissor-lift-wplan/create`, data })
  },

  // 修改高机剪叉周计划
  updateScissorLiftWplan: async (data: ScissorLiftWplanVO) => {
    return await request.put({ url: `/marketing/scissor-lift-wplan/update`, data })
  },

  // 删除高机剪叉周计划
  deleteScissorLiftWplan: async (id: number) => {
    return await request.delete({ url: `/marketing/scissor-lift-wplan/delete?id=` + id })
  },

  // 导出高机剪叉周计划 Excel
  exportScissorLiftWplan: async (params) => {
    return await request.download({ url: `/marketing/scissor-lift-wplan/export-excel`, params })
  },
  importExcel: (file: File, importTime: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('importTime', importTime)
    return request.upload({ url: '/marketing/scissor-lift-wplan/import', data: formData })
  },
}
