import request from '@/config/axios'

// 高机臂式周计划 VO
export interface AerialBoomWplanVO {
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

// 高机臂式周计划 API
export const AerialBoomWplanApi = {
  // 查询高机臂式周计划分页
  getAerialBoomWplanPage: async (params: any) => {
    return await request.get({ url: `/marketing/aerial-boom-wplan/page`, params })
  },

  // 查询高机臂式周计划详情
  getAerialBoomWplan: async (id: number) => {
    return await request.get({ url: `/marketing/aerial-boom-wplan/get?id=` + id })
  },

  // 新增高机臂式周计划
  createAerialBoomWplan: async (data: AerialBoomWplanVO) => {
    return await request.post({ url: `/marketing/aerial-boom-wplan/create`, data })
  },

  // 修改高机臂式周计划
  updateAerialBoomWplan: async (data: AerialBoomWplanVO) => {
    return await request.put({ url: `/marketing/aerial-boom-wplan/update`, data })
  },

  // 删除高机臂式周计划
  deleteAerialBoomWplan: async (id: number) => {
    return await request.delete({ url: `/marketing/aerial-boom-wplan/delete?id=` + id })
  },

  // 导出高机臂式周计划 Excel
  exportAerialBoomWplan: async (params) => {
    return await request.download({ url: `/marketing/aerial-boom-wplan/export-excel`, params })
  },

  importExcel: (file: File, importTime: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('importTime', importTime)
    return request.upload({ url: '/marketing/aerial-boom-wplan/import', data: formData })
  },
}
