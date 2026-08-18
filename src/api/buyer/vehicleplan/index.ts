import request from '@/config/axios'

// 买家车辆营销计划表（主机厂计划） VO
export interface VehiclePlanVO {
  id: string
  importDate?: string
  importDateYearMonth?: string   // 已格式化的年月字符串
  productLine: string            // 产品线
  productModel: string           // 产品机型
  vehicleCode: string            // 车型代码
  seqNo2025: string              // 2025年度顺序号/车号
  seqNo2026: string              // 2026年度顺序号/车号
  vin: string                    // VIN（新增）
  bareMachineOrderNo: string     // 裸机订单号
  drivingUnitOrderNo: string     // 行驶单元订单号
  tradeType: string              // 内外贸（内贸/外贸）
  unitQuantity: number           // 台份数量
  // 新增五个完工计划日期
  blankingFinishPlanDate?: Date  // 下料完工计划
  outriggerFinishPlanDate?: Date // 吊臂板/中吨位支腿完工计划
  boomFinishPlanDate?: Date      // 吊臂或主臂顶底完工计划
  turntableFinishPlanDate?: Date // 转台结构件完工计划
  frameFinishPlanDate?: Date     // 车架结构件完工计划
  chassisOnlinePlanDate: Date    // 底盘上线计划日期
  finishedProductPlanDate: Date  // 成台完工计划日期
}

// 买家车辆营销计划表（主机厂计划） API
export const VehiclePlanApi = {
  // 查询分页
  getVehiclePlanPage: async (params: any) => {
    return await request.get({ url: `/buyer/vehicle-plan/page`, params })
  },

  // 查询详情
  getVehiclePlan: async (id: number) => {
    return await request.get({ url: `/buyer/vehicle-plan/get?id=` + id })
  },

  // 新增
  createVehiclePlan: async (data: VehiclePlanVO) => {
    return await request.post({ url: `/buyer/vehicle-plan/create`, data })
  },

  // 修改
  updateVehiclePlan: async (data: VehiclePlanVO) => {
    return await request.put({ url: `/buyer/vehicle-plan/update`, data })
  },

  // 删除
  deleteVehiclePlan: async (id: number) => {
    return await request.delete({ url: `/buyer/vehicle-plan/delete?id=` + id })
  },

  // 导出 Excel
  exportVehiclePlan: async (params) => {
    return await request.download({ url: `/buyer/vehicle-plan/export-excel`, params })
  },

// 下载导入模版
  downloadImportTemplate: () => {
    return request.download({
      url: `/buyer/vehicle-plan/import-template`,
      method: 'get',
      responseType: 'blob'
    })
  },

  // 导入 Excel
  importVehiclePlan: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return await request.post({
      url: `/buyer/vehicle-plan/import-excel`,
      data: formData,
      headersType: 'multipart/form-data'
    })
  },
}
