<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="计划日期" prop="planDate">
        <el-date-picker
          v-model="planDateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :default-time="[new Date('00:00:00'), new Date('23:59:59')]"
          class="!w-260px"
          @change="handleDateChange"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-select v-model="queryParams.workshop" placeholder="请选择车间" clearable class="!w-150px">
          <el-option label="长缸车间(Y01)" value="Y01" />
          <el-option label="综合车间(Y02)" value="Y02" />
          <el-option label="综合车间(Y07)" value="Y07" />
          <el-option label="特种缸车间(Y11)" value="Y11" />
          <el-option label="短缸车间(Y16)" value="Y16" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:plan-completion-report:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="horizontalList" :stripe="true" border>
      <!-- 固定列：计划日期 -->
      <el-table-column label="计划日期" align="center" prop="planDate" :formatter="dateFormatter" width="110px" fixed="left" />

      <!-- 动态生成每个车间的列组 -->
      <template v-for="workshop in workshops" :key="workshop.code">
        <el-table-column :label="workshop.name" align="center">
          <el-table-column label="计划数" align="center" :prop="`${workshop.code}_dailyPlanQty`" width="100px" />
          <el-table-column label="当日完成数" align="center" :prop="`${workshop.code}_dailyActualQty`" width="110px" />
          <el-table-column label="计划内完成数" align="center" :prop="`${workshop.code}_plannedCompletion`" width="120px" />
          <el-table-column label="计划内完成率(%)" align="center" :prop="`${workshop.code}_plannedCompletionRate`" width="140px">
            <template #default="scope">
              <span v-if="scope.row[`${workshop.code}_plannedCompletionRate`] != null">{{ scope.row[`${workshop.code}_plannedCompletionRate`] }}%</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="累计未完订单" align="center" :prop="`${workshop.code}_unfinishedQty`" width="120px" />
          <el-table-column label="累计未完成总数" align="center" :prop="`${workshop.code}_cumUnfinishedQty`" width="140px" />
          <el-table-column label="主计划数量" align="center" :prop="`${workshop.code}_mainPlanQty`" width="110px" />
          <el-table-column label="主计划完成数量" align="center" :prop="`${workshop.code}_mainPlannedCompletion`" width="140px" />
          <el-table-column label="主计划完成率(%)" align="center" :prop="`${workshop.code}_mainPlannedCompletionRate`" width="150px">
            <template #default="scope">
              <span v-if="scope.row[`${workshop.code}_mainPlannedCompletionRate`] != null">{{ scope.row[`${workshop.code}_mainPlannedCompletionRate`] }}%</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="紧急件未完订单" align="center" :prop="`${workshop.code}_urgentUnfinishedQty`" width="130px" />
        </el-table-column>
      </template>
    </el-table>
    <!-- 数据量小，无需分页组件 -->
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PlanCompletionReportApi, PlanCompletionReportRespVO } from '@/api/aps/plancompletionreport'

// 车间配置
const workshops = [
  { code: 'Y01', name: '长缸车间' },
  { code: 'Y02', name: '综合车间(Y02)' },
  { code: 'Y07', name: '综合车间(Y07)' },
  { code: 'Y11', name: '特种缸车间' },
  { code: 'Y16', name: '短缸车间' }
]

defineOptions({ name: 'PlanCompletionReport' })

const message = useMessage()
const loading = ref(false)
const queryFormRef = ref()
const exportLoading = ref(false)

// 原始纵向数据列表
const list = ref<PlanCompletionReportRespVO[]>([])
// 转换后的横向数据列表
const horizontalList = ref<any[]>([])

const queryParams = reactive({
  beginPlanDate: undefined as string | undefined,
  endPlanDate: undefined as string | undefined,
  workshop: undefined as string | undefined
})

const planDateRange = ref<string[]>([])

const handleDateChange = (val: string[] | null) => {
  if (val && val.length === 2) {
    queryParams.beginPlanDate = val[0] + ' 00:00:00'
    queryParams.endPlanDate = val[1] + ' 23:59:59'
  } else {
    queryParams.beginPlanDate = undefined
    queryParams.endPlanDate = undefined
  }
}

// 将纵向数据转换为横向（按日期聚合）
const transformToHorizontal = (verticalData: PlanCompletionReportRespVO[]) => {
  const map = new Map<string, any>()

  for (const item of verticalData) {
    const date = item.planDate
    if (!map.has(date)) {
      // 初始化该日期对应的行数据
      const initRow: any = { planDate: date }
      workshops.forEach(w => {
        initRow[`${w.code}_dailyPlanQty`] = 0
        initRow[`${w.code}_dailyActualQty`] = 0
        initRow[`${w.code}_plannedCompletion`] = 0
        initRow[`${w.code}_plannedCompletionRate`] = null
        initRow[`${w.code}_unfinishedQty`] = 0
        initRow[`${w.code}_cumUnfinishedQty`] = 0
        initRow[`${w.code}_mainPlanQty`] = 0
        initRow[`${w.code}_mainPlannedCompletion`] = 0
        initRow[`${w.code}_mainPlannedCompletionRate`] = null
        initRow[`${w.code}_urgentUnfinishedQty`] = 0
      })
      map.set(date, initRow)
    }
    const row = map.get(date)
    const workshopCode = item.workshop
    if (workshopCode) {
      row[`${workshopCode}_dailyPlanQty`] = item.dailyPlanQty ?? 0
      row[`${workshopCode}_dailyActualQty`] = item.dailyActualQty ?? 0
      row[`${workshopCode}_plannedCompletion`] = item.plannedCompletion ?? 0
      row[`${workshopCode}_plannedCompletionRate`] = item.plannedCompletionRate
      row[`${workshopCode}_unfinishedQty`] = item.unfinishedQty ?? 0
      row[`${workshopCode}_cumUnfinishedQty`] = item.cumUnfinishedQty ?? 0
      row[`${workshopCode}_mainPlanQty`] = item.mainPlanQty ?? 0
      row[`${workshopCode}_mainPlannedCompletion`] = item.mainPlannedCompletion ?? 0
      row[`${workshopCode}_mainPlannedCompletionRate`] = item.mainPlannedCompletionRate
      row[`${workshopCode}_urgentUnfinishedQty`] = item.urgentUnfinishedQty ?? 0
    }
  }

  // 按日期排序
  return Array.from(map.values()).sort((a, b) => new Date(a.planDate).getTime() - new Date(b.planDate).getTime())
}

// 获取全部数据（循环请求所有分页）
const getList = async () => {
  loading.value = true
  try {
    let allData: PlanCompletionReportRespVO[] = []
    let currentPage = 1
    const pageSize = 100   // 后端允许的最大值
    let hasMore = true

    while (hasMore) {
      const params = {
        ...queryParams,
        pageNo: currentPage,
        pageSize: pageSize
      }
      const data = await PlanCompletionReportApi.getPage(params)
      if (data.list && data.list.length > 0) {
        allData = allData.concat(data.list)
        currentPage++
        // 如果返回的数量小于 pageSize，说明是最后一页
        hasMore = data.list.length === pageSize
      } else {
        hasMore = false
      }
    }
    list.value = allData
    horizontalList.value = transformToHorizontal(allData)
  } catch (error) {
    console.error('加载数据失败', error)
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  planDateRange.value = []
  queryParams.beginPlanDate = undefined
  queryParams.endPlanDate = undefined
  queryParams.workshop = undefined
  handleQuery()
}

const handleExport = async () => {
  try {
    exportLoading.value = true
    const data = await PlanCompletionReportApi.exportExcel(queryParams)
    download.excel(data, '计划完成情况报表.xls')
  } catch (error) {
    console.error('导出失败', error)
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>
