import request from '@/config/axios'

// 主机编码配置 VO
export interface CodeConfigVO {
  id: number // 主键ID（雪花算法）
  name: string // 名称
  hostCode: string // 主机编码
  teliCode: string // 特力编码
}

// 主机编码配置 API
export const CodeConfigApi = {
  // 查询主机编码配置分页
  getCodeConfigPage: async (params: any) => {
    return await request.get({ url: `/buyer/code-config/page`, params })
  },

  // 查询主机编码配置详情
  getCodeConfig: async (id: number) => {
    return await request.get({ url: `/buyer/code-config/get?id=` + id })
  },

  // 新增主机编码配置
  createCodeConfig: async (data: CodeConfigVO) => {
    return await request.post({ url: `/buyer/code-config/create`, data })
  },

  // 修改主机编码配置
  updateCodeConfig: async (data: CodeConfigVO) => {
    return await request.put({ url: `/buyer/code-config/update`, data })
  },

  // 删除主机编码配置
  deleteCodeConfig: async (id: number) => {
    return await request.delete({ url: `/buyer/code-config/delete?id=` + id })
  },

  // 导出主机编码配置 Excel
  exportCodeConfig: async (params) => {
    return await request.download({ url: `/buyer/code-config/export-excel`, params })
  },

  // 下载导入模版
  downloadImportTemplate: () => {
    return request.download({
      url: `/buyer/code-config/import-template`,
      method: 'get',
      responseType: 'blob'   // 关键设置
    })
  },

  // 导入主机编码配置 Excel
  importCodeConfig: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return await request.post({
      url: `/buyer/code-config/import-excel`,
      data: formData,
      headersType: 'multipart/form-data'
    })
  },
}
