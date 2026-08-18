import request from '@/config/axios'

// 订单表 - SAP订单信息 VO
export interface OrderVO {
  productionOrderNo: string // 订单号(主键)
  assemblyMaterialNo: string // 物料号
  mainMaterialDesc: string // 物料描述
  componentOrderType: string // 订单类型(如ZY02)
  scheduledQuantity: number // 订单数量
  deliveredQuantity: number // 已交货数量(已入库数量)
  creationDate: Date // 创建日期
  createdBy: string // 创建者/输入者
  systemStatus: string // 系统状态(如REL PCNF等)
  scheduledDate: Date // 计划开始日期
  actualStartTime: Date // 实际开始时间(日期+时间)
  basicEndDate: Date // 计划完成日期
  plant: string // 工厂代码
  mrpController: string // MRP控制员代码
  productionWorkshop: string // 生产主管
  unitOfMeasure: string // 计量单位(如PC)
  productionVersion: string // 生产版本(如0001)
  actualEndDate: Date // 实际完成日期 (Actual End Date)
  processStartDate: Date // 处理开始日期 (Process Start Date)
  submitDate: Date // 提交日期 (Submit Date)
  processReleased: string // 处理下达 (Process Released)
  centralProc: string // 集中订单处理 (Central Processing)
  changeDate: Date // 更改日期 (Change Date)
  lastChangedBy: string // 最后更改人 (Last Changed By)
  orderCategory: string // 订单类别 (Order Category)
  salesOrder: string // 销售订单 (Sales Order)
  description: string // 描述 (Description)
  confirmedQuantity: number // 确认产量
}

// 订单表 - SAP订单信息 API
export const OrderApi = {
  // 查询订单表 - SAP订单信息分页
  getOrderPage: async (params: any) => {
    return await request.get({ url: `/aps/order/page`, params })
  },

  // 查询订单表 - SAP订单信息详情
  getOrder: async (id: number) => {
    return await request.get({ url: `/aps/order/get?id=` + id })
  },

  // 新增订单表 - SAP订单信息
  createOrder: async (data: OrderVO) => {
    return await request.post({ url: `/aps/order/create`, data })
  },

  // 修改订单表 - SAP订单信息
  updateOrder: async (data: OrderVO) => {
    return await request.put({ url: `/aps/order/update`, data })
  },

  // 删除订单表 - SAP订单信息
  deleteOrder: async (id: number) => {
    return await request.delete({ url: `/aps/order/delete?id=` + id })
  },

  // 导出订单表 - SAP订单信息 Excel
  exportOrder: async (params) => {
    return await request.download({ url: `/aps/order/export-excel`, params })
  },
  // 查询 SAP 订单数据（仅查询，不保存）
  searchOrderFromSap: async (data: any) => {
    return await request.post({ url: `/wm/sap-order/search-from-sap`, data })
  },
  syncOrderFromSap: async (data: any) => {
    return await request.post({ url: `/wm/sap-order/sync-from-sap`, data })
  },
}
