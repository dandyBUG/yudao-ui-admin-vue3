import request from '@/config/axios'
import {HostRequirementComparisonDiffReqVO} from "@/api/buyer/hostrequirementcomparisondiff";

// 主计划物料需求匹配 VO
export interface MatchingResultVO {
  id: number // 主键ID（雪花算法生成）
  orderNo: string // 订单号
  scheduleTime: Date // 排产时间
  materialCode: string // 物料编码
  materialDesc: string // 物料描述
  workshop: string // 责任车间（总成）
  quantity: number // 数量
  completedQuantity: number // 已完成数量
  stock: number // 库存
  transferOrder: number // 转序（数量）
  componentOrder: string // 零部件订单
  componentCode: string // 零部件编码
  componentDesc: string // 零部件描述
  componentWorkshop: string // 责任车间（零部件）
  basicStartDate: Date // 基本开始日期
  requiredQuantity: number // 需求数量（零部件）
  unfinishedQuantity: number // 本次未完成数量
  purchaseMaterial: string // 采购物料
  purchaseMaterialDesc: string // 采购物料描述
  purchaseRequiredQty: number // 需求数量（采购）
  deliveredQuantity: number // 已配送数量
  toDeliverQuantity: number // 待配送数量
  purchaseOrder: string // 采购订单
  lineNumber: number // 行号
  orderDate: Date // 下单日期
  requiredDeliveryDate: Date // 要求交货日期
  actualArrivalDate: Date // 实际到货日期
  supplierName: string // 供应商名称
  openOrderQuantity: number // 未清订单数量
  allocatedRequiredQty: number // 分配需求数量
  remainRequiredQty: number // 剩余需采购数量
  kitQty: number          // 齐套数量（不展示）
  kitQtySingle: number    // 物料齐套数量（展示）
  feedbackRemarks?: string
}

// 主计划物料需求匹配 API
export const MatchingResultApi = {
  // 查询主计划物料需求匹配分页
  getMatchingResultPage: async (params: any) => {
    return await request.get({ url: `/aps/matching-result/page`, params })
  },

  // 查询主计划物料需求匹配详情
  getMatchingResult: async (id: number) => {
    return await request.get({ url: `/aps/matching-result/get?id=` + id })
  },

  // 新增主计划物料需求匹配
  createMatchingResult: async (data: MatchingResultVO) => {
    return await request.post({ url: `/aps/matching-result/create`, data })
  },

  // 修改主计划物料需求匹配
  updateMatchingResult: async (data: MatchingResultVO) => {
    return await request.put({ url: `/aps/matching-result/update`, data })
  },

  // 删除主计划物料需求匹配
  deleteMatchingResult: async (id: number) => {
    return await request.delete({ url: `/aps/matching-result/delete?id=` + id })
  },

  // 导出主计划物料需求匹配 Excel
  // exportMatchingResult: async (params) => {
  //   return await request.download({ url: `/aps/matching-result/export-excel`, params })
  // },

  exportMatchingResult: async (params: MatchingResultVO) => {
    // 使用 request.download 或直接调用 download 工具
    return await request.download({
      url: `/aps/matching-result/export-excel`,
      params,
      timeout: 600000
    })
  },
  // 运行存储过程
  runProcedure: async () => {
    return await request.post({ url: `/aps/matching-result/run-procedure` });
  },
}
