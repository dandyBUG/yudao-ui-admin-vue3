import request from '@/config/axios'

// 高机臂式日计划 VO
export interface AerialBoomDplanVO {
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

// 高机臂式日计划 API
export const AerialBoomDplanApi = {
  // 查询高机臂式日计划分页
  getAerialBoomDplanPage: async (params: any) => {
    return await request.get({ url: `/marketing/aerial-boom-dplan/page`, params })
  },

  // 查询高机臂式日计划详情
  getAerialBoomDplan: async (id: number) => {
    return await request.get({ url: `/marketing/aerial-boom-dplan/get?id=` + id })
  },

  // 新增高机臂式日计划
  createAerialBoomDplan: async (data: AerialBoomDplanVO) => {
    return await request.post({ url: `/marketing/aerial-boom-dplan/create`, data })
  },

  // 修改高机臂式日计划
  updateAerialBoomDplan: async (data: AerialBoomDplanVO) => {
    return await request.put({ url: `/marketing/aerial-boom-dplan/update`, data })
  },

  // 删除高机臂式日计划
  deleteAerialBoomDplan: async (id: number) => {
    return await request.delete({ url: `/marketing/aerial-boom-dplan/delete?id=` + id })
  },

  // 导出高机臂式日计划 Excel
  exportAerialBoomDplan: async (params) => {
    return await request.download({ url: `/marketing/aerial-boom-dplan/export-excel`, params })
  },
}