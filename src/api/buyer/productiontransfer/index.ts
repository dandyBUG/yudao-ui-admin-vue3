import request from '@/config/axios'

// MES转序单信息 VO
export interface ProductionTransferVO {
  id: number // 主键ID
  orderNo: string // 订单号
  materialCode: string // 物料编码
  materialDesc: string // 物料描述
  productionScheduler: string // 生产调度员
  transferInitiator: string // 转序发起人
  initiatorDate: Date // 发起日期
  quantity: number // 数量
  transferNo: string // 转序单号
  batchNo: string // 计划批次
  signer: string // 签收人
  signTime: Date // 签收时间
  createBy: string // 创建者
  updateBy: string // 更新者
}

// MES转序单信息 API
export const ProductionTransferApi = {
  // 查询MES转序单信息分页
  getProductionTransferPage: async (params: any) => {
    return await request.get({ url: `/buyer/production-transfer/page`, params })
  },

  // 查询MES转序单信息详情
  getProductionTransfer: async (id: number) => {
    return await request.get({ url: `/buyer/production-transfer/get?id=` + id })
  },

  // 新增MES转序单信息
  createProductionTransfer: async (data: ProductionTransferVO) => {
    return await request.post({ url: `/buyer/production-transfer/create`, data })
  },

  // 修改MES转序单信息
  updateProductionTransfer: async (data: ProductionTransferVO) => {
    return await request.put({ url: `/buyer/production-transfer/update`, data })
  },

  // 删除MES转序单信息
  deleteProductionTransfer: async (id: number) => {
    return await request.delete({ url: `/buyer/production-transfer/delete?id=` + id })
  },

  // 导出MES转序单信息 Excel
  exportProductionTransfer: async (params) => {
    return await request.download({ url: `/buyer/production-transfer/export-excel`, params })
  },
  // 导入MES转序单信息 Excel
  importProductionTransfer: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return await request.post({
      url: `/buyer/production-transfer/import-excel`,
      data: formData,
      headersType: 'multipart/form-data'
    })
  },
  // 同步MES数据
  syncFromMes: async (data: any) => {
    return await request.post({ url: `/buyer/production-transfer/sync-from-mes`, data })
  },
}
