import request from '@/config/axios'

// 高机剪叉日计划 VO
export interface ScissorLiftDplanVO {
  id: number // 主键ID
  lineType: string // 线别
  preciseModel: string // 精准车型
  productModel: string // 产品型号
  zpsModel: string // ZPS型号
  preciseBom: string // 精准BOM
  carNo: string // 车号
  orderNo: string // 订单号
  remark: string // 备注
  tradeVersion: string // 内外贸版本
  unitCount: number // 台份
  onlinePlan: Date // 上线计划
  completePlan: Date // 成台计划
  reportDate: Date // 报缴日期
  country: string // 国家
  contractNo: string // 合同号
  marketingNoticeTime: string // 营销通知时间
  orderCreateTime: Date // 订单开立时间
  plate: string // 板块
  importTime: Date // 导入批次时间
}

// 高机剪叉日计划 API
export const ScissorLiftDplanApi = {
  // 查询高机剪叉日计划分页
  getScissorLiftDplanPage: async (params: any) => {
    return await request.get({ url: `/marketing/scissor-lift-dplan/page`, params })
  },

  // 查询高机剪叉日计划详情
  getScissorLiftDplan: async (id: number) => {
    return await request.get({ url: `/marketing/scissor-lift-dplan/get?id=` + id })
  },

  // 新增高机剪叉日计划
  createScissorLiftDplan: async (data: ScissorLiftDplanVO) => {
    return await request.post({ url: `/marketing/scissor-lift-dplan/create`, data })
  },

  // 修改高机剪叉日计划
  updateScissorLiftDplan: async (data: ScissorLiftDplanVO) => {
    return await request.put({ url: `/marketing/scissor-lift-dplan/update`, data })
  },

  // 删除高机剪叉日计划
  deleteScissorLiftDplan: async (id: number) => {
    return await request.delete({ url: `/marketing/scissor-lift-dplan/delete?id=` + id })
  },

  // 导出高机剪叉日计划 Excel
  exportScissorLiftDplan: async (params) => {
    return await request.download({ url: `/marketing/scissor-lift-dplan/export-excel`, params })
  },
}