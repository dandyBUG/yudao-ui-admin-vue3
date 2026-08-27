<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      class="-mb-15px"
      :model="queryParams"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="生产订单" prop="productionOrderNo">
        <el-input
          v-model="queryParams.productionOrderNo"
          class="!w-190px"
          clearable
          placeholder="请输入生产订单"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总成物料" prop="assemblyMaterialNo">
        <el-input
          v-model="queryParams.assemblyMaterialNo"
          class="!w-190px"
          clearable
          placeholder="请输入总成物料号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件物料" prop="componentMaterialNo">
        <el-input
          v-model="queryParams.componentMaterialNo"
          class="!w-190px"
          clearable
          placeholder="请输入组件物料号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组件描述" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          class="!w-190px"
          clearable
          placeholder="请输入组件描述"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购类型" prop="procurementType">
        <el-select
          v-model="queryParams.procurementType"
          class="!w-150px"
          clearable
          placeholder="全部"
        >
          <el-option label="E - 外购" value="E" />
          <el-option label="F - 内部生产" value="F" />
        </el-select>
      </el-form-item>
      <el-form-item label="排产日期" required>
        <el-date-picker
          v-model="scheduledDateRange"
          class="!w-240px"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <el-form-item label="仅显示缺口" prop="onlyShortage">
        <el-switch v-model="queryParams.onlyShortage" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button
          v-hasPermi="['aps:production-material-supply:export']"
          type="success"
          plain
          :loading="exportLoading"
          @click="handleExport"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-alert
      class="mb-15px"
      type="info"
      :closable="false"
      show-icon
      title="E 类仅使用采购订单在途，F 类仅使用生产订单在途；投料日期未落库时按主计划排产日期判断交货期。"
    />
    <el-table v-loading="loading" :data="list" border stripe height="620">
      <el-table-column fixed label="生产订单" prop="productionOrderNo" min-width="140" />
      <el-table-column label="总成物料号" prop="assemblyMaterialNo" min-width="145" />
      <el-table-column label="总成物料描述" prop="assemblyMaterialDesc" min-width="200" show-overflow-tooltip />
      <el-table-column label="总成数量" prop="assemblyDemandQuantity" width="100" align="right" />
      <el-table-column label="排产日期" prop="scheduledDate" :formatter="dateFormatter" width="115" />
      <el-table-column label="组件编码" prop="componentMaterialNo" min-width="145" />
      <el-table-column label="组件描述" prop="componentMaterialDesc" min-width="200" show-overflow-tooltip />
      <el-table-column label="需求数量" prop="demandQuantity" width="100" align="right" />
      <el-table-column label="采购类型" prop="procurementType" width="100" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.procurementType === 'E' ? 'warning' : 'success'">
            {{ scope.row.procurementType === 'E' ? 'E 外购' : 'F 内部生产' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="日期来源" prop="dateSource" min-width="210" show-overflow-tooltip />
      <el-table-column label="已投料" prop="investedQuantity" width="95" align="right" />
      <el-table-column label="分配库存" prop="stockQuantity" width="100" align="right" />
      <el-table-column label="生产订单在途" prop="productionTransit" width="120" align="right" />
      <el-table-column label="采购订单在途" prop="purchaseTransit" width="120" align="right" />
      <el-table-column label="适用在途" prop="applicableTransit" width="100" align="right" />
      <el-table-column label="缺口" prop="shortageQuantity" width="100" align="right">
        <template #default="scope">
          <el-tag :type="scope.row.shortageQuantity > 0 ? 'danger' : 'success'">
            {{ scope.row.shortageQuantity }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="采购下单日期" prop="purchaseOrderDateSummary" min-width="130" show-overflow-tooltip />
      <el-table-column label="采购订单" prop="purchaseOrderSummary" min-width="150" show-overflow-tooltip />
      <el-table-column label="项目号" prop="projectNo" min-width="130" />
      <el-table-column label="采购物料号" prop="purchaseMaterialNo" min-width="145" />
      <el-table-column label="采购物料描述" prop="purchaseMaterialDesc" min-width="180" show-overflow-tooltip />
      <el-table-column label="采购交货期" prop="deliveryDateSummary" min-width="130" show-overflow-tooltip />
      <el-table-column label="供应商" prop="supplierSummary" min-width="180" show-overflow-tooltip />
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
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import download from '@/utils/download'
import { dateFormatter } from '@/utils/formatTime'
import {
  ProductionMaterialSupplyApi,
  ProductionMaterialSupplyPageReqVO,
  ProductionMaterialSupplyVO
} from '@/api/aps/productionmaterialsupply'

defineOptions({ name: 'ProductionMaterialSupply' })

const message = useMessage()
const loading = ref(false)
const exportLoading = ref(false)
const list = ref<ProductionMaterialSupplyVO[]>([])
const total = ref(0)
const createDefaultScheduledDateRange = () => [
  dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
]
const scheduledDateRange = ref<string[]>(createDefaultScheduledDateRange())
const queryFormRef = ref()
type QueryForm = Omit<
  ProductionMaterialSupplyPageReqVO,
  'scheduledDateStart' | 'scheduledDateEnd'
>
const queryParams = reactive<QueryForm>({
  pageNo: 1,
  pageSize: 10,
  onlyShortage: false
})

const buildParams = (): ProductionMaterialSupplyPageReqVO => ({
  ...queryParams,
  scheduledDateStart: scheduledDateRange.value[0],
  scheduledDateEnd: scheduledDateRange.value[1]
})

const validateScheduledDateRange = () => {
  if (!scheduledDateRange.value || scheduledDateRange.value.length !== 2) {
    message.warning('请选择排产开始日期和结束日期')
    return false
  }
  const start = dayjs(scheduledDateRange.value[0])
  const end = dayjs(scheduledDateRange.value[1])
  if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
    message.warning('排产日期开始不能晚于结束日期')
    return false
  }
  if (end.isAfter(start.add(3, 'month'))) {
    message.warning('排产日期范围不能超过 3 个自然月')
    return false
  }
  return true
}

const getList = async () => {
  if (!validateScheduledDateRange()) return
  loading.value = true
  try {
    const data = await ProductionMaterialSupplyApi.getPage(buildParams())
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
  queryFormRef.value?.resetFields()
  scheduledDateRange.value = createDefaultScheduledDateRange()
  queryParams.onlyShortage = false
  handleQuery()
}

const handleExport = async () => {
  if (!validateScheduledDateRange()) return
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await ProductionMaterialSupplyApi.exportExcel(buildParams())
    download.excel(data, '生产订单物料供需.xls')
  } finally {
    exportLoading.value = false
  }
}

onMounted(getList)
</script>
