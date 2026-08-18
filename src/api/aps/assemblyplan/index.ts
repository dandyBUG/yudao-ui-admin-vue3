import request from '@/config/axios'

// 各车间开装计划 VO
export interface AssemblyPlanVO {
  id: number // 主键ID
  orderNo: string // 订单号
  materialCode: string // 物料编号
  materialDesc: string // 物料描述
  assemblyQuantity: number // 装配数量（计划数）
  assembledQuantity: number // 已装配数量（完成数）
  scheduleTime: Date // 排产时间
  workshop: string // 车间
  importTime: Date // 导入时间
}

// 各车间开装计划 API
export const AssemblyPlanApi = {
  // 查询各车间开装计划分页
  getAssemblyPlanPage: async (params: any) => {
    return await request.get({ url: `/aps/assembly-plan/page`, params })
  },

  // 查询各车间开装计划详情
  getAssemblyPlan: async (id: number) => {
    return await request.get({ url: `/aps/assembly-plan/get?id=` + id })
  },

  // 新增各车间开装计划
  createAssemblyPlan: async (data: AssemblyPlanVO) => {
    return await request.post({ url: `/aps/assembly-plan/create`, data })
  },

  // 修改各车间开装计划
  updateAssemblyPlan: async (data: AssemblyPlanVO) => {
    return await request.put({ url: `/aps/assembly-plan/update`, data })
  },

  // 删除各车间开装计划
  deleteAssemblyPlan: async (id: number) => {
    return await request.delete({ url: `/aps/assembly-plan/delete?id=` + id })
  },

  // 导出各车间开装计划 Excel
  exportAssemblyPlan: async (params) => {
    return await request.download({ url: `/aps/assembly-plan/export-excel`, params })
  },
  // 导入各车间开装计划
  importExcel: (file: File, importTime: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('importTime', importTime)
    return request.upload({ url: '/aps/assembly-plan/import', data: formData })
  },

  // 下载导入模板
  downloadTemplate: () => {
    window.location.href = '/template/各车间开装计划模板.xlsx'
  },
}
