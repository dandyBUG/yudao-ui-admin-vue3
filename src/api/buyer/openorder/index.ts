import request from '@/config/axios'

// 采购未清订单 VO
export interface OpenOrderVO {
  id: number // 主键ID
  orderDate: Date // 订单日期
  buyerOrderNo: string // 采购订单号
  lineItem: number // 订单行项目
  materialNo: string // 物料号
  materialDesc: string // 物料描述
  orderQty: number // 订单数量
  receivedQty: number // 实收数量
  openQty: number // 未清数量
  unit: string // 单位
  requiredArrivalDate: Date // 要求到货日期
  actualArrivalDate: Date // 实际到货日期
  supplierDesc: string // 供应商描述
  customer: string // 客户
  buyerGroup: string // 采购组
  documentType: string // 凭证类型
  productionOrderNo: string // 生产订单号
  brandInfo: string // 品牌信息
  unitPrice: number // 单价（净价）
  supplierCode: string // 供应商代码
  receivingWarehouse: string // 收货仓库
  totalAmount: number // 合计金额（净价）
  buyerReqNo: string // 采购申请
}

// 采购未清订单 API
export const OpenOrderApi = {
  // 查询采购未清订单分页
  getOpenOrderPage: async (params: any) => {
    return await request.get({ url: `/buyer/open-order/page`, params })
  },

  // 查询采购未清订单详情
  getOpenOrder: async (id: number) => {
    return await request.get({ url: `/buyer/open-order/get?id=` + id })
  },

  // 新增采购未清订单
  createOpenOrder: async (data: OpenOrderVO) => {
    return await request.post({ url: `/buyer/open-order/create`, data })
  },

  // 修改采购未清订单
  updateOpenOrder: async (data: OpenOrderVO) => {
    return await request.put({ url: `/buyer/open-order/update`, data })
  },

  // 删除采购未清订单
  deleteOpenOrder: async (id: number) => {
    return await request.delete({ url: `/buyer/open-order/delete?id=` + id })
  },

  // 导出采购未清订单 Excel
  exportOpenOrder: async (params) => {
    return await request.download({ url: `/buyer/open-order/export-excel`, params })
  },
  // 同步SAP
  // 同步SAP
  syncFromSap: async (data: any) => {
    return await request.post({
      url: `/buyer/open-order/sync/from-sap`,
      data,          // 改为 data，这样参数会放在请求体中
      timeout: 600000
    })
  },
}
