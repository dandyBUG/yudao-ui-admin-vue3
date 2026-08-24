import request from '@/config/axios'

export interface MonthlyNetDemandVO {
  planMonth: string
  hostCode?: string
  materialNo?: string
  materialName?: string
  mapped: boolean
  totalDemand: number
  sapAvailableStock: number
  overseasAvailableStock: number
  inProcessOrderQuantity: number
  netDemand: number
}

export interface MonthlyNetDemandPageReqVO {
  pageNo: number
  pageSize: number
  planMonth: string
  materialNo?: string
  materialName?: string
  mapped?: boolean
}

export const MonthlyNetDemandApi = {
  getPage: (params: MonthlyNetDemandPageReqVO) =>
    request.get({ url: '/buyer/monthly-net-demand/page', params })
}
