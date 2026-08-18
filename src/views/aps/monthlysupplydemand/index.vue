<template>
  <div class="monthly-supply-demand-page">
    <!-- 标题栏 -->
    <div class="header-bar">
      <div class="title-section">
        <h1 class="main-title">📊 月度供需总览表</h1>
        <span class="update-time" v-if="lastUpdateTime">
          <i class="el-icon-time"></i> 数据更新：{{ lastUpdateTime }}
        </span>
      </div>
    </div>

    <!-- 筛选区 -->
    <div class="filter-bar-light">
      <div class="filter-left">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
          <el-form-item label="物料号" prop="assemblyMaterialNo">
            <el-input
              v-model="queryParams.assemblyMaterialNo"
              placeholder="请输入总成物料号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="物料描述" prop="materialDesc">
            <el-input
              v-model="queryParams.materialDesc"
              placeholder="请输入物料描述"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="月份范围" prop="scheduledDateRange">
            <el-date-picker
              v-model="scheduledDateRange"
              type="monthrange"
              :disabled-date="disabledDate"
              :default-value="getDefaultMonthRange()"
              range-separator="~"
              start-placeholder="开始月"
              end-placeholder="结束月"
              value-format="YYYY-MM"
              style="width: 260px"
              @change="handleDateRangeChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="filter-right">
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:monthly-supply-demand-summary:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </div>
    </div>

    <!-- 主表 -->
    <div class="table-section">
      <div class="section-header">
        <span class="section-title">📋 供需数据明细</span>
        <span class="section-summary">
          共 {{ pivotData.length }} 个物料，{{ monthList.length }} 个月份
          <el-tag v-if="loading" type="warning" size="small" style="margin-left: 10px">
            <i class="el-icon-loading"></i> 加载中...
          </el-tag>
        </span>
      </div>

      <el-table
        v-loading="loading"
        :data="pivotData"
        border
        stripe
        style="width: 100%"
        :show-overflow-tooltip="true"
        max-height="600"
      >
        <!-- 固定列：物料号 -->
        <el-table-column prop="assemblyMaterialNo" label="总成物料号" width="180" fixed="left" />
        <!-- 固定列：物料描述 -->
        <el-table-column prop="materialDesc" label="物料描述" min-width="160" fixed="left" />

        <!-- 动态月份列（多级表头） -->
        <el-table-column
          v-for="month in monthList"
          :key="month"
          :label="month"
          align="center"
        >
          <!-- 需求 -->
          <el-table-column
            :label="'需求'"
            width="90"
            align="right"
            prop="requireQuantity"
          >
            <template #default="{ row }">
              {{ getMonthValue(row, month, 'requireQuantity') }}
            </template>
          </el-table-column>

          <!-- 销售出库 -->
          <el-table-column
            label="销售出库"
            width="90"
            align="right"
          >
            <template #default="{ row }">
              {{ getMonthValue(row, month, 'salesOutQuantity') }}
            </template>
          </el-table-column>

          <!-- 实时库存 -->
          <el-table-column
            label="实时库存"
            width="90"
            align="right"
          >
            <template #default="{ row }">
              {{ getMonthValue(row, month, 'stockQuantity') }}
            </template>
          </el-table-column>
          <!-- 在制/在途 -->
          <el-table-column
            label="在制/在途"
            width="90"
            align="right"
          >
            <template #default="{ row }">
              {{ getMonthValue(row, month, 'wip') }}
            </template>
          </el-table-column>
          <!-- 缺口shortage -->
          <el-table-column
            label="缺口"
            width="90"
            align="right"
          >
            <template #default="{ row }">
              <span :class="getMonthValue(row, month, 'netRequirement') > 0 ? 'danger-text' : 'success-text'">
                {{ getMonthValue(row, month, 'netRequirement') }}
              </span>
            </template>
          </el-table-column>
          <!-- 计划数量 -->
          <!-- <el-table-column
            label="计划数量"
            width="90"
            align="right"
          >
            <template #default="{ row }">
              {{ getMonthValue(row, month, 'scheduledQuantity') }}
            </template>
          </el-table-column>
          -->
        </el-table-column>
      </el-table>

      <!-- 无数据提示 -->
      <div v-if="!loading && pivotData.length === 0" class="empty-tip">
        <el-empty description="暂无数据，请刷新存储过程或调整筛选条件" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { Icon } from '@/components/Icon'
import { MonthlySupplyDemandSummaryApi, MonthlySupplyDemandSummaryPageReqVO } from '@/api/aps/monthlysupplydemand'
import download from '@/utils/download'

defineOptions({ name: 'MonthlySupplyDemandSummary' })

// ---------- 查询参数 ----------
const queryParams = reactive<MonthlySupplyDemandSummaryPageReqVO>({
  pageNo: 1,
  pageSize: 100,
  assemblyMaterialNo: '',
  materialDesc: '',
  scheduledDate: '',
  scheduledDateStart: '',
  scheduledDateEnd: '',
  createTimeStart: '',
  createTimeEnd: ''
})

const scheduledDateRange = ref<string[]>([])
const queryFormRef = ref()

// ---------- 表格数据 ----------
const loading = ref(false)
const exportLoading = ref(false)
const rawList = ref<any[]>([])
const lastUpdateTime = ref('')

// ---------- 透视数据 ----------
const monthList = ref<string[]>([])
const pivotData = ref<any[]>([])

// ---------- 日期范围变化 ----------
const handleDateRangeChange = (val: string[] | null) => {
  if (val && val.length === 2) {
    queryParams.scheduledDateStart = val[0]
    queryParams.scheduledDateEnd = val[1]
  } else {
    queryParams.scheduledDateStart = ''
    queryParams.scheduledDateEnd = ''
  }
  queryParams.scheduledDate = ''
}

// ---------- 数据透视函数 ----------
const buildPivotData = (data: any[]) => {
  if (!data || data.length === 0) {
    pivotData.value = []
    monthList.value = []
    return
  }

  // 1. 提取所有月份并排序
  const months = [...new Set(data.map(item => item.scheduledDate))].sort()
  monthList.value = months

  // 2. 按物料分组
  const groupMap = new Map()
  data.forEach(item => {
    const key = item.assemblyMaterialNo
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        assemblyMaterialNo: item.assemblyMaterialNo,
        materialDesc: item.materialDesc || '',
        months: {}
      })
    }
    const group = groupMap.get(key)
    group.months[item.scheduledDate] = {
      requireQuantity: item.requireQuantity || 0,
      stockQuantity: item.stockQuantity || 0,
      wip: item.wip || 0,
      netRequirement: item.netRequirement || 0,
      scheduledQuantity: item.scheduledQuantity || 0,
      shortage: item.shortage || 0,
      salesOutQuantity: item.salesOutQuantity || 0  // 新增
    }
  })

  // 3. 转换为数组
  const result: any[] = []
  groupMap.forEach((group) => {
    const row: any = {
      assemblyMaterialNo: group.assemblyMaterialNo,
      materialDesc: group.materialDesc,
      _months: group.months
    }
    result.push(row)
  })

  // 按物料号排序
  result.sort((a, b) => a.assemblyMaterialNo.localeCompare(b.assemblyMaterialNo))

  pivotData.value = result
}

// 禁止选择未来月份
const disabledDate = (time: Date) => {
  const sixMonthsLater = new Date()
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)
  return time.getTime() > sixMonthsLater.getTime()
}

// 设置默认范围为上个月+本月（或 2026年7月）
const getDefaultMonthRange = () => {
  const startMonth = new Date(2026, 6, 1) // 2026年7月1日
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // 如果当前月 <= 2026年7月，返回 [7月, 7月]
  if (thisMonth <= startMonth) {
    return [startMonth, startMonth]
  }
  return [lastMonth, thisMonth]
}

// ---------- 获取某物料某月份某指标的值 ----------
const getMonthValue = (row: any, month: string, field: string) => {
  const monthData = row._months?.[month]
  if (!monthData) return '0.00'
  const val = monthData[field]
  return val?.toFixed?.(2) ?? '0.00'
}

// ---------- 分页循环查询（全量获取） ----------
const fetchAllData = async () => {
  loading.value = true
  rawList.value = []
  let allData: any[] = []
  let currentPage = 1
  const pageSize = 100
  let totalPages = 1

  try {
    // 构建基础参数（不含分页）
    const baseParams: any = {}
    if (queryParams.assemblyMaterialNo?.trim()) {
      baseParams.assemblyMaterialNo = queryParams.assemblyMaterialNo.trim()
    }
    if (queryParams.materialDesc?.trim()) {
      baseParams.materialDesc = queryParams.materialDesc.trim()
    }
    if (queryParams.scheduledDateStart?.trim()) {
      baseParams.scheduledDateStart = queryParams.scheduledDateStart.trim()
    }
    if (queryParams.scheduledDateEnd?.trim()) {
      baseParams.scheduledDateEnd = queryParams.scheduledDateEnd.trim()
    }

    // 第一页请求（获取总条数）
    const firstRes = await MonthlySupplyDemandSummaryApi.getPage({
      ...baseParams,
      pageNo: 1,
      pageSize: pageSize
    })

    const firstList = firstRes.list || []
    const total = firstRes.total || 0
    allData = [...firstList]
    totalPages = Math.ceil(total / pageSize)

    // 如果有更多页，并发请求
    if (totalPages > 1) {
      const remainingPages = []
      for (let i = 2; i <= totalPages; i++) {
        remainingPages.push(
          MonthlySupplyDemandSummaryApi.getPage({
            ...baseParams,
            pageNo: i,
            pageSize: pageSize
          })
        )
      }
      const results = await Promise.all(remainingPages)
      results.forEach(res => {
        if (res.list && res.list.length > 0) {
          allData = allData.concat(res.list)
        }
      })
    }

    rawList.value = allData
    buildPivotData(allData)

    if (allData.length > 0) {
      lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    } else {
      lastUpdateTime.value = ''
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败')
    rawList.value = []
    pivotData.value = []
    monthList.value = []
  } finally {
    loading.value = false
  }
}

// ---------- 搜索 / 重置 ----------
const handleQuery = () => {
  fetchAllData()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.assemblyMaterialNo = ''
  queryParams.materialDesc = ''
  queryParams.scheduledDate = ''
  queryParams.createTimeStart = ''
  queryParams.createTimeEnd = ''

  const now = new Date()
  const currentMonth = dayjs(now).format('YYYY-MM')
  const nextMonth = dayjs(now).add(1, 'month').format('YYYY-MM')

  scheduledDateRange.value = [currentMonth, nextMonth]
  queryParams.scheduledDateStart = currentMonth
  queryParams.scheduledDateEnd = nextMonth

  handleQuery()
}

// ---------- 导出 ----------
const handleExport = async () => {
  try {
    exportLoading.value = true
    ElMessage.info('正在获取全部数据，请稍候...')

    // 构建基础参数（同查询）
    const baseParams: any = {}
    if (queryParams.assemblyMaterialNo?.trim()) {
      baseParams.assemblyMaterialNo = queryParams.assemblyMaterialNo.trim()
    }
    if (queryParams.materialDesc?.trim()) {
      baseParams.materialDesc = queryParams.materialDesc.trim()
    }
    if (queryParams.scheduledDateStart?.trim()) {
      baseParams.scheduledDateStart = queryParams.scheduledDateStart.trim()
    }
    if (queryParams.scheduledDateEnd?.trim()) {
      baseParams.scheduledDateEnd = queryParams.scheduledDateEnd.trim()
    }

    // 分页循环获取全部数据
    let allData: any[] = []
    const pageSize = 100
    let totalPages = 1

    const firstRes = await MonthlySupplyDemandSummaryApi.getPage({
      ...baseParams,
      pageNo: 1,
      pageSize: pageSize
    })
    allData = firstRes.list || []
    const total = firstRes.total || 0
    totalPages = Math.ceil(total / pageSize)

    if (totalPages > 1) {
      const remainingPages = []
      for (let i = 2; i <= totalPages; i++) {
        remainingPages.push(
          MonthlySupplyDemandSummaryApi.getPage({
            ...baseParams,
            pageNo: i,
            pageSize: pageSize
          })
        )
      }
      const results = await Promise.all(remainingPages)
      results.forEach(res => {
        if (res.list && res.list.length > 0) {
          allData = allData.concat(res.list)
        }
      })
    }

    if (allData.length === 0) {
      ElMessage.warning('没有数据可导出')
      return
    }

    // 构建透视数据
    const months = [...new Set(allData.map(item => item.scheduledDate))].sort()
    const groupMap = new Map()
    allData.forEach(item => {
      const key = item.assemblyMaterialNo
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          assemblyMaterialNo: item.assemblyMaterialNo,
          materialDesc: item.materialDesc || '',
          months: {}
        })
      }
      const group = groupMap.get(key)
      group.months[item.scheduledDate] = {
        requireQuantity: item.requireQuantity || 0,
        stockQuantity: item.stockQuantity || 0,
        wip: item.wip || 0,
        netRequirement: item.netRequirement || 0,
        scheduledQuantity: item.scheduledQuantity || 0,
        shortage: item.shortage || 0,
        salesOutQuantity: item.salesOutQuantity || 0
      }
    })

    // ---------- 构建 Excel 数据（两行表头） ----------
    const XLSX = await import('xlsx')

    // 第一行表头：总成物料号、物料描述、月份（跨6列合并）
    const headerRow1: string[] = ['总成物料号', '物料描述']
    months.forEach(month => {
      // 每个月份占7列，只填一次月份名（后续合并）
      headerRow1.push(month, '', '', '', '', '', '')
    })

    // 第二行表头：具体指标
    const headerRow2: string[] = ['', ''] // 前两列留空（对应总成物料号、物料描述）
    months.forEach(() => {
      headerRow2.push('需求', '实时库存', '在制/在途', '销售出库', '缺口')  //, '计划数量'
    })

    // 数据行
    const dataRows: any[][] = []
    groupMap.forEach((group) => {
      const row: any[] = [group.assemblyMaterialNo, group.materialDesc]
      months.forEach(month => {
        const monthData = group.months[month] || {}
        row.push(
          monthData.requireQuantity?.toFixed(2) || '0.00',
          monthData.stockQuantity?.toFixed(2) || '0.00',
          monthData.wip?.toFixed(2) || '0.00',
          monthData.salesOutQuantity?.toFixed(2) || '0.00',  // 新增
          monthData.netRequirement?.toFixed(2) || '0.00' //shortage
          //monthData.scheduledQuantity?.toFixed(2) || '0.00'
        )
      })
      dataRows.push(row)
    })

    // 创建工作簿
    const wsData = [headerRow1, headerRow2, ...dataRows]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // 合并单元格：第一行按月份合并（每个月份6列）
    const merges: any[] = []
    let colIndex = 2 // 从第3列开始（0=总成物料号，1=物料描述）
    months.forEach(() => {
      merges.push({
        s: { r: 0, c: colIndex },
        e: { r: 0, c: colIndex + 6 }
      })
      colIndex += 6
    })
    ws['!merges'] = merges

    // 设置列宽
    ws['!cols'] = [
      { wch: 18 }, // 总成物料号
      { wch: 20 }  // 物料描述
    ]
    // 每个指标列宽 12
    for (let i = 0; i < months.length * 7; i++) {
      ws['!cols'].push({ wch: 12 })
    }

    // 导出
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '月度供需总览')
    XLSX.writeFile(wb, '月度供需总览表.xlsx')

    ElMessage.success(`导出成功，共 ${groupMap.size} 个物料，${months.length} 个月份`)
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error(error.message || '导出失败')
  } finally {
    exportLoading.value = false
  }
}


// ---------- 初始化 ----------
// ---------- 初始化 ----------
onMounted(() => {
  const now = new Date()
  const currentMonth = dayjs(now).format('YYYY-MM')
  const nextMonth = dayjs(now).add(1, 'month').format('YYYY-MM')

  scheduledDateRange.value = [currentMonth, nextMonth]
  queryParams.scheduledDateStart = currentMonth
  queryParams.scheduledDateEnd = nextMonth

  fetchAllData()
})
</script>

<style scoped>
.monthly-supply-demand-page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
  color: #303133;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #303133;
}

.update-time {
  font-size: 14px;
  color: #909399;
  background: #f0f2f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.filter-bar-light {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.filter-left {
  flex: 1;
}
.filter-left :deep(.el-form-item) {
  margin-bottom: 8px;
}

.filter-right {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4px;
}

.table-section {
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.section-summary {
  font-size: 14px;
  color: #909399;
}

.empty-tip {
  padding: 40px 0;
}

.mr-5px {
  margin-right: 5px;
}

.primary-text {
  color: #409eff;
  font-weight: 600;
}
.danger-text {
  color: #f56c6c;
  font-weight: 600;
}
.success-text {
  color: #67c23a;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .filter-bar-light {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-right {
    margin-top: 8px;
    justify-content: flex-end;
  }
}

:deep(.el-table .cell) {
  padding: 0 6px;
}
:deep(.el-table__header th) {
  background-color: #f5f7fa !important;
  color: #303133;
  font-weight: 600;
}
:deep(.el-table__body .el-table__cell) {
  padding: 2px 0;
}
</style>
