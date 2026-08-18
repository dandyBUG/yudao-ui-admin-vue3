import request from '@/config/axios'

// 混凝土BOM VO
export interface ConcreteBomVO {
  id: number // 主键ID
  vehicleModel: string // 车型（物料编码或车型名称）
  cylinderName: string // 分解油缸（部件名称及路径）
  sbpCode: string // SBP编码
  config: string // 配置（如数量等）
  importTime: Date // 导入时间
}

// 混凝土BOM API
export const ConcreteBomApi = {
  // 查询混凝土BOM分页
  getConcreteBomPage: async (params: any) => {
    return await request.get({ url: `/marketing/concrete-bom/page`, params })
  },

  // 查询混凝土BOM详情
  getConcreteBom: async (id: number) => {
    return await request.get({ url: `/marketing/concrete-bom/get?id=` + id })
  },

  // 新增混凝土BOM
  createConcreteBom: async (data: ConcreteBomVO) => {
    return await request.post({ url: `/marketing/concrete-bom/create`, data })
  },

  // 修改混凝土BOM
  updateConcreteBom: async (data: ConcreteBomVO) => {
    return await request.put({ url: `/marketing/concrete-bom/update`, data })
  },

  // 删除混凝土BOM
  deleteConcreteBom: async (id: number) => {
    return await request.delete({ url: `/marketing/concrete-bom/delete?id=` + id })
  },

  // 导出混凝土BOM Excel
  exportConcreteBom: async (params) => {
    return await request.download({ url: `/marketing/concrete-bom/export-excel`, params })
  },
  // 导入混凝土BOM Excel
  importExcel: (file: File, importTime: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('importTime', importTime)
    return request.upload({ url: '/marketing/concrete-bom/import', data: formData })
  },
  // 差异对比
  compareDifference: async () => {
    return await request.get({ url: `/marketing/concrete-bom/compare` })
  },
}
