import request from '@/config/axios'

// 营销数据导入 VO
export interface DataImportVO {
  id: number // 主键编号
  danhao: string // 主计划单号
  productCode: string // 总成图号
  quantity: number // 总成数量
  orderDate: Date // 创建订单日期
  eventTime: Date // 主计划完成日期
  status: number // 状态（0=正常，1=停用）
  remark: string // 备注
}

// 营销数据导入 API
export const DataImportApi = {
  // 查询营销数据导入分页
  getDataImportPage: async (params: any) => {
    return await request.get({ url: `/aps/data-import/page`, params })
  },

  // 查询营销数据导入详情
  getDataImport: async (id: number) => {
    return await request.get({ url: `/aps/data-import/get?id=` + id })
  },

  // 新增营销数据导入
  createDataImport: async (data: DataImportVO) => {
    return await request.post({ url: `/aps/data-import/create`, data })
  },

  // 修改营销数据导入
  updateDataImport: async (data: DataImportVO) => {
    return await request.put({ url: `/aps/data-import/update`, data })
  },

  // 删除营销数据导入
  deleteDataImport: async (id: number) => {
    return await request.delete({ url: `/aps/data-import/delete?id=` + id })
  },

  // 导出营销数据导入 Excel
  exportDataImport: async (params) => {
    return await request.download({ url: `/aps/data-import/export-excel`, params })
  },
}