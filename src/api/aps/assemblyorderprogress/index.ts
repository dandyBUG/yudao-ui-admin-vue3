import request from '@/config/axios'

export interface AssemblyOrderProgressVO {
  materialCode: string
  materialDesc: string
  timeDimension: string
  planQty: number
  completedQty: number
  stockQty: number
  shortageCount: number
  _children?: any[]
  _loading?: boolean
}

export interface AssemblyOrderShortageVO {
  purchaseMaterial: string
  purchaseMaterialDesc: string
  shortageQty: number
  expectedDate: string
  supplierName: string
  scheduleTime: string
}

export const AssemblyOrderProgressApi = {
  // 分页查询
  getPage: async (params: any) => {
    return await request.get({ url: '/aps/assembly-order-progress/page', params })
  },

  // 缺料零件
  getShortages: async (params: { materialCode: string; scheduleTime?: string }) => {
    return await request.get({ url: '/aps/assembly-order-progress/shortages', params })
  },

  // 导出
  exportExcel: async (params: any) => {
    return await request.download({ url: '/aps/assembly-order-progress/export-excel', params })
  }
}
