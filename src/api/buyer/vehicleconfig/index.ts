import request from '@/config/axios'

// 主机车型配置 VO
export interface VehicleConfigVO {
  id: string                     // 主键ID（雪花算法）
  orderNo: string                // 订单号
  vehicleModel: string           // 车型
  seqNo2025: string              // 2025年顺序号
  seqNo2026: string              // 2026年顺序号
  requiredArrivalTime: string    // 要求到货时间
  materialDesc: string           // 物料描述
  quota1: number                 // 配额1
  quota2: number                 // 配额2（默认6400）
  materialNo: string             // 物料号
  factory: string                // 工厂
  requiredQuantity: number       // 需求数量
  deliveredQuantity: number      // 已交货数量
  importDate?: Date              // 导入日期（新增）
  createTime: Date               // 创建时间
}

// 主机车型配置分页请求参数
export interface VehicleConfigPageReqVO {
  pageNo: number
  pageSize: number
  vehicleModel?: string
  seqNo2026?: string
  materialNo?: string
  orderNo?: string
  factory?: string
  createTime?: string[]
  importDate?: string
}

// 主机车型配置 API
export const VehicleConfigApi = {
  // 查询主机车型配置分页
  getVehicleConfigPage: async (params: VehicleConfigPageReqVO) => {
    return await request.get({ url: `/buyer/vehicle-config/page`, params })
  },

  // 查询主机车型配置详情
  getVehicleConfig: async (id: number) => {
    return await request.get({ url: `/buyer/vehicle-config/get?id=` + id })
  },

  // 新增主机车型配置
  createVehicleConfig: async (data: VehicleConfigVO) => {
    return await request.post({ url: `/buyer/vehicle-config/create`, data })
  },

  // 修改主机车型配置
  updateVehicleConfig: async (data: VehicleConfigVO) => {
    return await request.put({ url: `/buyer/vehicle-config/update`, data })
  },

  // 删除主机车型配置
  deleteVehicleConfig: async (id: number) => {
    return await request.delete({ url: `/buyer/vehicle-config/delete?id=` + id })
  },

  // 导出主机车型配置 Excel
  exportVehicleConfig: async (params: VehicleConfigPageReqVO) => {
    return await request.download({ url: `/buyer/vehicle-config/export-excel`, params })
  },

// 下载导入模版
  downloadImportTemplate:async() => {
    return request.download({
      url: `/buyer/vehicle-config/import-template`,
      method: 'get',
      responseType: 'blob'   // 关键设置
    })
  },

  // 导入主机车型配置 Excel
  importVehicleConfig: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return await request.post({
      url: `/buyer/vehicle-config/import-excel`,
      data: formData,
      headersType: 'multipart/form-data'
    })
  },
}
