<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="显示日期" prop="currentDate" required>
        <el-select v-model="queryParams.currentDate" placeholder="请选择显示日期" clearable class="!w-200px" @change="handleQuery">
          <el-option v-for="date in dateOptions" :key="date" :label="date" :value="date" />
        </el-select>
      </el-form-item>
      <el-form-item label="对比日期" prop="compareDate" required>
        <el-select v-model="queryParams.compareDate" placeholder="请选择对比日期" clearable class="!w-200px" @change="handleQuery">
          <el-option v-for="date in dateOptions" :key="date" :label="date" :value="date" />
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe>
      <el-table-column label="车型" align="center" prop="productModel" min-width="150" />
      <el-table-column label="出产顺序" align="center" prop="productionOrder" min-width="130" />
      <el-table-column label="中联订单号" align="center" prop="bareMachineOrderNo" min-width="150" />
      <el-table-column label="底盘订单号" align="center" prop="drivingUnitOrderNo" min-width="150" />

      <el-table-column label="显示月份" align="center" prop="chassisOnlinePlanDate" min-width="130" />
      <el-table-column label="显示月份配额" align="center" prop="quota2" width="120">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.quota1Diff }">{{ row.quota2 || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示月份主机图号" align="center" prop="materialNo" min-width="150">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.materialNoDiff }">{{ row.materialNo || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示月份特力图号" align="center" prop="telicode" min-width="150" />
      <el-table-column label="显示月份分解油缸" align="center" prop="cylinderName" min-width="200" />
      <el-table-column label="显示月份配置" align="center" prop="config" width="80">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.configDiff }">{{ row.config ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示月份需配数量" align="center" prop="requiredQuantity" width="100">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.requiredQuantityDiff }">{{ row.requiredQuantity ?? '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="对比月份" align="center" prop="versionDate" min-width="130" />
      <el-table-column label="对比月份配额" align="center" prop="quota1" width="120">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.quota1Diff }">{{ row.quota1 || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对比月份主机图号" align="center" prop="materialNoCompare" min-width="150">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.materialNoDiff }">{{ row.materialNoCompare || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对比月份配置" align="center" prop="configCompare" width="80">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.configDiff }">{{ row.configCompare ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对比月份需配数量" align="center" prop="requiredQuantityCompare" width="100">
        <template #default="{ row }">
          <span :class="{ 'diff-highlight': row.requiredQuantityDiff }">{{ row.requiredQuantityCompare ?? '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需配数量增量" align="center" prop="requiredQuantityIncrease" width="120">
        <template #default="{ row }">
          <span :class="getIncreaseClass(row.requiredQuantityIncrease)">
            {{ row.requiredQuantityIncrease !== undefined ? (row.requiredQuantityIncrease > 0 ? '+' : '') + row.requiredQuantityIncrease : '-' }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import download from '@/utils/download'
import { HostRequirementComparisonDiffApi, HostRequirementComparisonDiffVO, HostRequirementComparisonDiffReqVO } from '@/api/buyer/hostrequirementcomparisondiff'

defineOptions({ name: 'HostRequirementComparisonDiff' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(false)
const list = ref<HostRequirementComparisonDiffVO[]>([])
const total = ref(0)
const dateOptions = ref<string[]>([])

const queryParams = reactive<HostRequirementComparisonDiffReqVO>({
  pageNo: 1,
  pageSize: 10,
  currentDate: '',
  compareDate: '',
  productModel: undefined,
  seqNo2026: undefined,
  bareMachineOrderNo: undefined,
  materialNo: undefined,
})

const queryFormRef = ref()
const exportLoading = ref(false)

// 获取日期选项并设置默认值
const getDateOptions = async () => {
  try {
    const dates = await HostRequirementComparisonDiffApi.getAvailableDates()
    dateOptions.value = dates
    if (dates.length >= 2) {
      queryParams.currentDate = dates[0]
      queryParams.compareDate = dates[1]
    } else if (dates.length === 1) {
      queryParams.currentDate = dates[0]
      queryParams.compareDate = dates[0]
    }
    if (queryParams.currentDate && queryParams.compareDate) {
      await getList()
    }
  } catch (error) {
    console.error('获取日期选项失败', error)
    message.error('获取日期选项失败')
  }
}

const getList = async () => {
  if (!queryParams.currentDate || !queryParams.compareDate) return
  loading.value = true
  try {
    const data = await HostRequirementComparisonDiffApi.getDiffPage(queryParams)
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
  // 重置后恢复到默认日期（最新和次新）
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
    const data = await HostRequirementComparisonDiffApi.exportDiffExcel(queryParams)
    download.excel(data, '主机需求差异对比.xls')
    message.success('导出成功')
  } catch (error: any) {
    console.error('导出失败:', error)
    message.error('导出失败：' + (error.message || '未知错误'))
  } finally {
    exportLoading.value = false
  }
}

const getIncreaseClass = (value?: number) => {
  if (value === undefined || value === null) return ''
  if (value > 0) return 'increase-positive'
  if (value < 0) return 'increase-negative'
  return ''
}

onMounted(() => {
  getDateOptions()
})
</script>

<style scoped>
.diff-highlight {
  background-color: #ffcccc;
  font-weight: bold;
}
.increase-positive {
  color: green;
  font-weight: bold;
}
.increase-negative {
  color: red;
  font-weight: bold;
}
</style>
