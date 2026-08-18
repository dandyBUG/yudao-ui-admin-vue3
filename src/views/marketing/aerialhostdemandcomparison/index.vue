<template>
  <ContentWrap>
    <!-- 搜索栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="110px">
      <el-form-item label="当前版本日期" prop="currentDate">
        <el-select v-model="queryParams.currentDate" placeholder="请选择" clearable @change="handleQuery" class="!w-180px">
          <el-option v-for="date in dateOptions" :key="date" :label="date" :value="date" />
        </el-select>
      </el-form-item>
      <el-form-item label="对比版本日期" prop="compareDate">
        <el-select v-model="queryParams.compareDate" placeholder="请选择" clearable @change="handleQuery" class="!w-180px">
          <el-option v-for="date in dateOptions" :key="date" :label="date" :value="date" />
        </el-select>
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="queryParams.materialCode" placeholder="请输入物料编码" clearable @keyup.enter="handleQuery" class="!w-200px" />
      </el-form-item>
      <el-form-item label="产品型号" prop="productModel">
        <el-input v-model="queryParams.productModel" placeholder="请输入产品型号" clearable @keyup.enter="handleQuery" class="!w-200px" />
      </el-form-item>
      <el-form-item label="维度">
        <el-radio-group v-model="dimension" @change="handleDimensionChange">
          <el-radio-button label="day">日视图</el-radio-button>
          <el-radio-button label="week">周视图</el-radio-button>
        </el-radio-group>
      </el-form-item>
       <el-form-item label="板块" prop="plate">
        <el-select v-model="queryParams.plate" placeholder="请选择板块" clearable @change="handleQuery" class="!w-150px">
          <el-option v-for="plate in plateOptions" :key="plate" :label="plate" :value="plate" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表：动态转置宽表 + 前端分页 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="pagedWideList" border>
      <!-- 固定列 -->
      <el-table-column label="物料编码" prop="materialCode" min-width="150" />
      <el-table-column label="特力编码" prop="teliCode" min-width="120" />
      <el-table-column label="物料描述" prop="materialDesc" min-width="200" show-overflow-tooltip />
      <el-table-column label="产品型号" prop="productModel" min-width="120" />

      <!-- 动态列：根据维度生成日期或周列组 -->
      <template v-for="col in dynamicColumns" :key="col.label">
        <el-table-column :label="col.label" align="center">
          <el-table-column label="本次数量" :prop="`${col.prop}_cur`" width="90" />
          <el-table-column label="对比数量" :prop="`${col.prop}_cmp`" width="90" />
          <el-table-column label="差异" :prop="`${col.prop}_diff`" width="90">
            <template #default="{ row }">
              <span :style="{ color: (row[`${col.prop}_diff`] || 0) > 0 ? '#f56c6c' : (row[`${col.prop}_diff`] || 0) < 0 ? '#67c23a' : '' }">
                {{ row[`${col.prop}_diff`] ?? '-' }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
    </el-table>

    <!-- 前端分页 -->
    <Pagination
      :total="wideList.length"
      v-model:page="currentPage"
      v-model:limit="pageSize"
      @pagination="onPageChange"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { AerialHostDemandComparisonApi, DayComparisonVO, WeekComparisonVO } from '@/api/marketing/aerialhostdemandcomparison'
//import download from '@/utils/download'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { ref, reactive, onMounted, computed, watch } from 'vue'


defineOptions({ name: 'AerialHostDemandComparison' })

//const message = useMessage()
const loading = ref(false)
const exportLoading = ref(false)
const dateOptions = ref<string[]>([])
const dimension = ref<'day' | 'week'>('day')  // 当前维度

// 原始长格式数据
const rawDayList = ref<DayComparisonVO[]>([])
const rawWeekList = ref<WeekComparisonVO[]>([])

// 宽表数据（每个物料一行）
const wideList = ref<any[]>([])
// 前端分页
const currentPage = ref(1)
const pageSize = ref(10)

const queryParams = reactive({
  currentDate: undefined as string | undefined,
  compareDate: undefined as string | undefined,
  materialCode: undefined,
  productModel: undefined,
  plate: undefined
})
const queryFormRef = ref()

// 根据当前维度获取动态列（日期或周标识）
const dynamicColumns = computed(() => {
  if (dimension.value === 'day') {
    // 提取所有唯一日期（去掉时间部分，排序）
    const dates = [...new Set(rawDayList.value.map(item => item.onlinePlan?.split(' ')[0] || ''))]
      .filter(d => d)
      .sort()
    return dates.map(date => ({
      label: date,
      prop: date
    }))
  } else {
    // 周级别：提取所有唯一周标识（显示为 "周次(起始-结束)"）
    const weeks = [...new Map(rawWeekList.value.map(item => [item.weekKey, {
      weekKey: item.weekKey,
      label: `${item.weekKey} (${item.weekStartDate} ~ ${item.weekEndDate})`
    }])).values()]
    weeks.sort((a, b) => a.weekKey.localeCompare(b.weekKey))
    return weeks.map(week => ({
      label: week.label,
      prop: week.weekKey
    }))
  }
})

// 将长格式数据转换为宽表（按物料分组）
const transformToWide = () => {
  if (dimension.value === 'day') {
    const map = new Map<string, any>()
    rawDayList.value.forEach(item => {
      const key = item.materialCode
      if (!map.has(key)) {
        map.set(key, {
          materialCode: item.materialCode,
          teliCode: item.teliCode,
          materialDesc: item.materialDesc,
          productModel: item.productModel
        })
      }
      const row = map.get(key)
      // 关键修改：只取日期部分（YYYY-MM-DD）
      const date = item.onlinePlan?.split(' ')[0]
      if (date) {
        row[`${date}_cur`] = item.currentQty
        row[`${date}_cmp`] = item.compareQty
        row[`${date}_diff`] = item.diffQty
      }
    })
    wideList.value = Array.from(map.values())
  } else {
    const map = new Map<string, any>()
    rawWeekList.value.forEach(item => {
      const key = item.materialCode
      if (!map.has(key)) {
        map.set(key, {
          materialCode: item.materialCode,
          teliCode: item.teliCode,
          materialDesc: item.materialDesc,
          productModel: item.productModel
        })
      }
      const row = map.get(key)
      const week = item.weekKey
      row[`${week}_cur`] = item.currentQty
      row[`${week}_cmp`] = item.compareQty
      row[`${week}_diff`] = item.diffQty
    })
    wideList.value = Array.from(map.values())
  }
  currentPage.value = 1
}

// 前端分页后的数据
const pagedWideList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return wideList.value.slice(start, end)
})

// 加载数据（根据当前维度）
const loadData = async () => {
  if (!queryParams.currentDate || !queryParams.compareDate) return
  loading.value = true
  try {
    let res
    if (dimension.value === 'day') {
      res = await AerialHostDemandComparisonApi.getDayComparison({
        currentDate: queryParams.currentDate,
        compareDate: queryParams.compareDate,
        materialCode: queryParams.materialCode,
        productModel: queryParams.productModel,
        plate: queryParams.plate,
      })
    } else {
      res = await AerialHostDemandComparisonApi.getWeekComparison({
        currentDate: queryParams.currentDate,
        compareDate: queryParams.compareDate,
        materialCode: queryParams.materialCode,
        productModel: queryParams.productModel,
        plate: queryParams.plate,
      })
    }

    // 兼容多种返回格式
    let dataArray: any[] = []
    if (Array.isArray(res)) {
      dataArray = res
    } else if (res && Array.isArray(res.data)) {
      dataArray = res.data
    } else if (res && Array.isArray(res.rows)) {
      dataArray = res.rows
    } else if (res && res.data && Array.isArray(res.data.list)) {
      dataArray = res.data.list
    } else if (res && res.code === 0 && Array.isArray(res.data)) {
      dataArray = res.data
    }

    if (dimension.value === 'day') {
      rawDayList.value = dataArray
    } else {
      rawWeekList.value = dataArray
    }

    transformToWide()
    console.log('数据加载完成，共', dataArray.length, '条原始记录')
  } catch (e) {
    console.error(e)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 获取可用日期选项并设置默认
const getDateOptions = async () => {
  try {
    // 后端需要支持 plate 参数
    const params: any = {}
    if (queryParams.plate) {
      params.plate = queryParams.plate
    }
    const res = await AerialHostDemandComparisonApi.getAvailableDates(params)
    let dates: string[] = []
    if (Array.isArray(res)) {
      dates = res
    } else if (res && Array.isArray(res.data)) {
      dates = res.data
    } else if (res && res.code === 0 && Array.isArray(res.data)) {
      dates = res.data
    }
    dateOptions.value = dates
    // 根据获取的日期设置默认值
    if (dates.length >= 2) {
      queryParams.currentDate = dates[0]
      queryParams.compareDate = dates[1]
    } else if (dates.length === 1) {
      queryParams.currentDate = dates[0]
      queryParams.compareDate = dates[0]
    } else {
      queryParams.currentDate = undefined
      queryParams.compareDate = undefined
    }
    // 如果有日期，则重新加载数据
    if (queryParams.currentDate && queryParams.compareDate) {
      await loadData()
    }
  } catch (error) {
    console.error('获取日期列表失败', error)
    dateOptions.value = []
  }
}

// 监听板块变化，重新获取日期选项
watch(() => queryParams.plate, async (newPlate, oldPlate) => {
  if (newPlate !== oldPlate) {
    // 清空当前日期选择
    queryParams.currentDate = undefined
    queryParams.compareDate = undefined
    // 重新获取日期列表（基于新板块）
    await getDateOptions()
  }
})

// 查询
const handleQuery = () => {
  loadData()
}

// 重置
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  if (dateOptions.value.length >= 2) {
    queryParams.currentDate = dateOptions.value[0]
    queryParams.compareDate = dateOptions.value[1]
  } else if (dateOptions.value.length === 1) {
    queryParams.currentDate = dateOptions.value[0]
    queryParams.compareDate = dateOptions.value[0]
  }
  // 重置板块为第一个（如果存在）
  if (plateOptions.value.length > 0) {
    queryParams.plate = plateOptions.value[0]
  } else {
    queryParams.plate = undefined
  }
  handleQuery()
}

// 导出（可调用后端导出接口，或前端导出当前宽表）
//const handleExport = async () => {
  // 简化：直接调用后端导出，后端需要实现对应维度的导出
  // 或者前端生成 Excel
//  ElMessage.info('导出功能按需实现')
//}

// 维度切换
const handleDimensionChange = () => {
  loadData()
}

// 分页变化
const onPageChange = () => {
  // 无需额外操作，computed 会自动重新计算
}

const plateOptions = ref<string[]>([])

// 获取板块选项（从后端查询数据表去重）
const getPlateOptions = async () => {
  try {
    const res = await AerialHostDemandComparisonApi.getAvailablePlates()
    // 兼容多种返回格式
    let plates: string[] = []
    if (Array.isArray(res)) {
      plates = res
    } else if (res && Array.isArray(res.data)) {
      plates = res.data
    } else if (res && res.code === 0 && Array.isArray(res.data)) {
      plates = res.data
    }
    plateOptions.value = plates
    // 默认选中第一个板块
    if (plates.length > 0 && !queryParams.plate) {
      queryParams.plate = plates[0]
      // 如果已有日期选项，则重新加载数据
      if (queryParams.currentDate && queryParams.compareDate) {
        await loadData()
      }
    }
  } catch (error) {
    console.error('获取板块列表失败', error)
    plateOptions.value = []
  }
}

// 构建表头
const buildHeaders = () => {
  const fixedHeaders = ['物料编码', '特力编码', '物料描述', '产品型号']
  const dynamicHeaders: string[] = []
  if (dimension.value === 'day') {
    dynamicColumns.value.forEach(col => {
      dynamicHeaders.push(`${col.label}（本次）`, `${col.label}（对比）`, `${col.label}（差异）`)
    })
  } else {
    dynamicColumns.value.forEach(col => {
      dynamicHeaders.push(`${col.label}（本次）`, `${col.label}（对比）`, `${col.label}（差异）`)
    })
  }
  return [...fixedHeaders, ...dynamicHeaders]
}

// 构建数据行
const buildDataRows = () => {
  const rows: any[][] = []
  for (const row of wideList.value) {
    const fixedRow = [
      row.materialCode,
      row.teliCode,
      row.materialDesc,
      row.productModel
    ]
    const dynamicRow: any[] = []
    if (dimension.value === 'day') {
      dynamicColumns.value.forEach(col => {
        dynamicRow.push(row[`${col.prop}_cur`] ?? 0)
        dynamicRow.push(row[`${col.prop}_cmp`] ?? 0)
        dynamicRow.push(row[`${col.prop}_diff`] ?? 0)
      })
    } else {
      dynamicColumns.value.forEach(col => {
        dynamicRow.push(row[`${col.prop}_cur`] ?? 0)
        dynamicRow.push(row[`${col.prop}_cmp`] ?? 0)
        dynamicRow.push(row[`${col.prop}_diff`] ?? 0)
      })
    }
    rows.push([...fixedRow, ...dynamicRow])
  }
  return rows
}

// 导出按钮操作
const handleExport = async () => {
  if (!wideList.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  exportLoading.value = true
  try {
    const headers = buildHeaders()
    const dataRows = buildDataRows()
    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '主机需求对比')
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    const fileName = `高机主机需求对比_${dimension.value === 'day' ? '日视图' : '周视图'}.xlsx`
    saveAs(blob, fileName)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
    ElMessage.error('导出失败，请重试')
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
getPlateOptions()
  getDateOptions()
})
</script>
