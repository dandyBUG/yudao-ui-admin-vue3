import request from '@/config/axios'

// 高机臂式/剪叉BOM物料清单 VO
export interface AerialBoomBomVO {
  id: number // 主键ID
  materialCode: string // 物料编码
  materialDesc: string // 物料描述
  supplier: string // 供应商
  jitFlag: string // JIT标识（1表示JIT物料）
  colorManagement: string // 是否颜色管理（X表示是）
  supplyOnDemand: string // 是否按需供货（X表示是）
  applicableModel: string // 适配机型（多机型逗号分隔）
  remark: string // 备注
  productModel: string // 产品型号（如ZA10RJE）
  preciseBom: string // 精准BOM（如ZA10RJE-001）
  quantity: number // 数量
  sourceCategory: string // 物料来源分类（臂式专用物料/剪叉专用物料/剪叉和臂式共用物料/走车物资及选配件）
  plate: string // 板块（默认高机）
  importTime: Date // 导入批次时间
}

// 高机臂式/剪叉BOM物料清单 API
export const AerialBoomBomApi = {
  // 查询高机臂式/剪叉BOM物料清单分页
  getAerialBoomBomPage: async (params: any) => {
    return await request.get({ url: `/marketing/aerial-boom-bom/page`, params })
  },

  // 查询高机臂式/剪叉BOM物料清单详情
  getAerialBoomBom: async (id: number) => {
    return await request.get({ url: `/marketing/aerial-boom-bom/get?id=` + id })
  },

  // 新增高机臂式/剪叉BOM物料清单
  createAerialBoomBom: async (data: AerialBoomBomVO) => {
    return await request.post({ url: `/marketing/aerial-boom-bom/create`, data })
  },

  // 修改高机臂式/剪叉BOM物料清单
  updateAerialBoomBom: async (data: AerialBoomBomVO) => {
    return await request.put({ url: `/marketing/aerial-boom-bom/update`, data })
  },

  // 删除高机臂式/剪叉BOM物料清单
  deleteAerialBoomBom: async (id: number) => {
    return await request.delete({ url: `/marketing/aerial-boom-bom/delete?id=` + id })
  },

  // 导出高机臂式/剪叉BOM物料清单 Excel
  exportAerialBoomBom: async (params) => {
    return await request.download({ url: `/marketing/aerial-boom-bom/export-excel`, params })
  },
  // 在 AerialBoomBomApi 对象中添加
  importExcel: (file: File, importTime: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('importTime', importTime)
    return request.upload({ url: '/marketing/aerial-boom-bom/import', data: formData })
  },
}
