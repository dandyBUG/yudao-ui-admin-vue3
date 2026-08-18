<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
       <!-- 新增日期选择 -->
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
      <!-- 原有搜索项保持不变 -->
      <el-form-item label="车型" prop="productModel">
        <el-input v-model="queryParams.productModel" placeholder="请输入车型" clearable class="!w-200px" />
      </el-form-item>
      <el-form-item label="2026年顺序号" prop="seqNo2026">
        <el-input v-model="queryParams.seqNo2026" placeholder="请输入2026年顺序号" clearable class="!w-200px" />
      </el-form-item>
      <el-form-item label="中联订单号" prop="bareMachineOrderNo">
        <el-input v-model="queryParams.bareMachineOrderNo" placeholder="请输入中联订单号" clearable class="!w-200px" />
      </el-form-item>
      <el-form-item label="主机图号" prop="materialNo">
        <el-input v-model="queryParams.materialNo" placeholder="请输入主机图号" clearable class="!w-200px" />
      </el-form-item>

      <el-form-item label="匹配类型" prop="fallbackMatched">
        <el-select v-model="queryParams.fallbackMatched" placeholder="全部" clearable @change="handleQuery" class="!w-150px">
          <el-option label="正常匹配" :value="0" />
          <el-option label="后备匹配" :value="1" />
          <el-option label="无配置" :value="2" />
          <el-option label="全部" :value="null" />
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

  <!-- 列表，动态列标题 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe>
      <el-table-column :label="queryParams.currentDate + '版本'" align="center" prop="chassisOnlinePlanDate" min-width="130" />
      <el-table-column label="车型" align="center" prop="productModel" min-width="150" />
      <el-table-column label="出产顺序" align="center" prop="productionOrder" min-width="130" />
      <el-table-column label="中联订单号" align="center" prop="bareMachineOrderNo" min-width="150" />
      <el-table-column label="底盘订单号" align="center" prop="drivingUnitOrderNo" min-width="150" />
      <el-table-column :label="'配额' + queryParams.compareDate" align="center" prop="quota1" width="120" />
      <el-table-column :label="'配额' + queryParams.currentDate" align="center" prop="quota2" width="120" />
      <el-table-column label="台套" align="center" prop="unitQuantity" width="80" />
      <el-table-column :label="queryParams.compareDate + '版本'" align="center" prop="versionDate" min-width="130" />
      <el-table-column label="分解油缸" align="center" prop="cylinderName" min-width="200" />
      <el-table-column label="主机图号" align="center" prop="materialNo" min-width="150" />
      <el-table-column label="特力图号" align="center" prop="teliCode" min-width="150" />
      <el-table-column label="配置" align="center" prop="config" width="80" />
      <el-table-column label="需配数量" align="center" prop="requiredQuantity" width="100" />
      <el-table-column label="匹配类型" align="center" prop="fallbackMatched" width="100">
        <template #default="{ row }">
          <el-tag :type="getMatchTypeTag(row.fallbackMatched)" size="small">
            {{ getMatchTypeText(row.fallbackMatched) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { HostRequirementComparisonApi, HostRequirementComparisonRespVO, HostRequirementComparisonPageReqVO } from '@/api/buyer/hostrequirementcomparison'
import { ref, reactive, onMounted } from 'vue'

defineOptions({ name: 'HostRequirementComparison' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<HostRequirementComparisonRespVO[]>([])
const total = ref(0)
const dateOptions = ref<string[]>([])  // 可选的日期列表

const queryParams = reactive<HostRequirementComparisonPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  productModel: undefined,
  seqNo2026: undefined,
  bareMachineOrderNo: undefined,
  materialNo: undefined,
  currentDate: undefined,
  compareDate: undefined,
  fallbackMatched: null,   // 新增
})

const queryFormRef = ref()
const exportLoading = ref(false)

// 获取日期选项并设置默认值
const getDateOptions = async () => {
  const dates = await HostRequirementComparisonApi.getAvailableDates()
  dateOptions.value = dates
  if (dates.length >= 2) {
    queryParams.currentDate = dates[0]   // 最新
    queryParams.compareDate = dates[1]   // 次新
  } else if (dates.length === 1) {
    queryParams.currentDate = dates[0]
    queryParams.compareDate = dates[0]
  }
  // 如果有日期选项，再加载列表
  if (queryParams.currentDate && queryParams.compareDate) {
    await getList()
  }
}

const getList = async () => {
  if (!queryParams.currentDate || !queryParams.compareDate) return
  loading.value = true
  try {
    const data = await HostRequirementComparisonApi.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.fallbackMatched = null   // 重置为全部
  // 重置日期为默认
  if (dateOptions.value.length >= 2) {
    queryParams.currentDate = dateOptions.value[0]
    queryParams.compareDate = dateOptions.value[1]
  } else if (dateOptions.value.length === 1) {
    queryParams.currentDate = dateOptions.value[0]
    queryParams.compareDate = dateOptions.value[0]
  }
  handleQuery()
}

const handleExport = async () => {
  try {
    exportLoading.value = true
    const data = await HostRequirementComparisonApi.exportExcel(queryParams)
    download.excel(data, '主机需求对比.xls')
  } finally {
    exportLoading.value = false
  }
}
const getMatchTypeText = (type: number) => {
  if (type === 0) return '正常匹配'
  if (type === 1) return '后备匹配'
  if (type === 2) return '无配置'
  return ''
}
const getMatchTypeTag = (type: number) => {
  if (type === 0) return 'success'
  if (type === 1) return 'warning'
  if (type === 2) return 'danger'
  return ''
}

onMounted(() => {
  getDateOptions()
})
</script>
