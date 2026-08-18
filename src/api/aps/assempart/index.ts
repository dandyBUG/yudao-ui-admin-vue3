import request from '@/config/axios'

// 总成与子件关联表管理 VO
export interface AssemPartVO {
  orderNo: string // 总成订单号
  quantity: number // 总成数量
  componentOrder: string // 零部件订单号
  allocQty: number // 零部件数量
  id: number // 编号
}

// 总成与子件关联表管理 API
export const AssemPartApi = {
  // 查询总成与子件关联表管理分页
  getAssemPartPage: async (params: any) => {
    return await request.get({ url: `/aps/assem-part/page`, params })
  },

  // 查询总成与子件关联表管理详情
  getAssemPart: async (id: number) => {
    return await request.get({ url: `/aps/assem-part/get?id=` + id })
  },

  // 新增总成与子件关联表管理
  createAssemPart: async (data: AssemPartVO) => {
    return await request.post({ url: `/aps/assem-part/create`, data })
  },

  // 修改总成与子件关联表管理
  updateAssemPart: async (data: AssemPartVO) => {
    return await request.put({ url: `/aps/assem-part/update`, data })
  },

  // 删除总成与子件关联表管理
  deleteAssemPart: async (id: number) => {
    return await request.delete({ url: `/aps/assem-part/delete?id=` + id })
  },

  // 导出总成与子件关联表管理 Excel
  exportAssemPart: async (params) => {
    return await request.download({ url: `/aps/assem-part/export-excel`, params })
  },

  // 导入总成与子件关联表管理 Excel
  importAssemPart: (file: File, importTime?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (importTime) {
      formData.append('importTime', importTime)
    }
    return request.post({
      url: `/aps/assem-part/import-excel`,
      data: formData
      // ✅ 注意：这里不能有任何 headers、params 等多余配置
    })
  },
}
