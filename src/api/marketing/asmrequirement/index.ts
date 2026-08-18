import request from '@/config/axios'

// 营销总成需求 VO
export interface AsmRequirementVO {
  id: number // 主键ID
  hostUnit: string           // 新增
  vehicleModel: string       // 新增
  assemblyMaterialNo: string // 总成物料编码
  mainMaterialDesc: string // 总成物料名称
  requireQuantity: number // 需求数量
  requireDate: Date // 需求日期
}

// 营销总成需求 API
export const AsmRequirementApi = {
  // 查询营销总成需求分页
  getAsmRequirementPage: async (params: any) => {
    return await request.get({ url: `/marketing/asm-requirement/page`, params })
  },

  // 查询营销总成需求详情
  getAsmRequirement: async (id: number) => {
    return await request.get({ url: `/marketing/asm-requirement/get?id=` + id })
  },

  // 新增营销总成需求
  createAsmRequirement: async (data: AsmRequirementVO) => {
    return await request.post({ url: `/marketing/asm-requirement/create`, data })
  },

  // 修改营销总成需求
  updateAsmRequirement: async (data: AsmRequirementVO) => {
    return await request.put({ url: `/marketing/asm-requirement/update`, data })
  },

  // 删除营销总成需求
  deleteAsmRequirement: async (id: number) => {
    return await request.delete({ url: `/marketing/asm-requirement/delete?id=` + id })
  },

  // 导出营销总成需求 Excel
  exportAsmRequirement: async (params) => {
    return await request.download({ url: `/marketing/asm-requirement/export-excel`, params })
  },

  // 新增：导入 Excel
  importExcel: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.upload({ url: '/marketing/asm-requirement/import', data: formData })
  },
}
