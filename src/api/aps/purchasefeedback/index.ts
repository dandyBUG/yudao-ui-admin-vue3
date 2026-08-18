import request from '@/config/axios'

// 采购反馈 VO
export interface PurchaseFeedbackVO {
  id: number
  orderNo: string
  scheduleTime: Date | string
  purchaseMaterial: string
  feedbackRemark: string
}

// 采购反馈 API
export const PurchaseFeedbackApi = {
  // 分页查询
  getPage: async (params: any) => {
    return await request.get({ url: '/aps/purchase-feedback/page', params })
  },

  // 详情
  get: async (id: number) => {
    return await request.get({ url: '/aps/purchase-feedback/get?id=' + id })
  },

  // 新增
  create: async (data: PurchaseFeedbackVO) => {
    return await request.post({ url: '/aps/purchase-feedback/create', data })
  },

  // 修改
  update: async (data: PurchaseFeedbackVO) => {
    return await request.put({ url: '/aps/purchase-feedback/update', data })
  },

  // 删除
  delete: async (id: number) => {
    return await request.delete({ url: '/aps/purchase-feedback/delete?id=' + id })
  },

  // 导出 Excel
  export: async (params: any) => {
    return await request.download({ url: '/aps/purchase-feedback/export-excel', params })
  },

  // ✅ 修正后的导入方法（与主计划保持一致）
  import: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return await request.post({
      url: '/aps/purchase-feedback/import-excel',   // 改为与主计划一致
      data: formData,
      headersType: 'multipart/form-data'
    })
  },
}
