import request from '@/config/axios'

// 混凝土计划需求 VO
export interface ConcretePlanVO {
  id: number // 主键ID
  planNo: string // 计划编号
  seqNo: string // 序号
  meter: string // 米段
  modelName: string // 型号
  materialName: string // 物料名称
  materialCode: string // 物料编码
  prodNo: string // 生产编号
  quantity: number // 数量
  structSerialNo: string // 结构件编号/环保编码
  orderNo: string // 订单号
  batchNo: string // 出料批次
  groupStatus: string // 组单情况
  legType: string // 支腿类型
  countryType: string // 国家（国内/海外）
  planIssueTime: string // 计划下达时间
  assemblyStartTime: Date // 装配上线时间
  assemblyEndTime: Date // 装配下线时间
  debugTime: Date // 调试下线时间
  paintingTime: Date // 涂装下线时间
  warehouseTime: Date // 入库时间
  outputMonth: string // 营运要求产出月份
  specialReq: string // 特殊要求
  paintingReq: string // 涂装要求
  exceptionNote: string // 异常说明
  scheduleTime: string // 排产时间
  deliveryReq: string // 发货要求
  factory: string // 工厂
  status: string // 状态
  customer: string // 客户
  modifiedCarNo: string // 修改后车号
  plate: string // 板块
  importTime: Date // 导入时间
}

// 混凝土计划需求 API
export const ConcretePlanApi = {
  // 查询混凝土计划需求分页
  getConcretePlanPage: async (params: any) => {
    return await request.get({ url: `/marketing/concrete-plan/page`, params })
  },

  // 查询混凝土计划需求详情
  getConcretePlan: async (id: number) => {
    return await request.get({ url: `/marketing/concrete-plan/get?id=` + id })
  },

  // 新增混凝土计划需求
  createConcretePlan: async (data: ConcretePlanVO) => {
    return await request.post({ url: `/marketing/concrete-plan/create`, data })
  },

  // 修改混凝土计划需求
  updateConcretePlan: async (data: ConcretePlanVO) => {
    return await request.put({ url: `/marketing/concrete-plan/update`, data })
  },

  // 删除混凝土计划需求
  deleteConcretePlan: async (id: number) => {
    return await request.delete({ url: `/marketing/concrete-plan/delete?id=` + id })
  },

  // 导出混凝土计划需求 Excel
  exportConcretePlan: async (params) => {
    return await request.download({ url: `/marketing/concrete-plan/export-excel`, params })
  },
  //导入
  importExcel: (file: File, importTime: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('importTime', importTime)
    return request.upload({ url: '/marketing/concrete-plan/import', data: formData })
  },
}
