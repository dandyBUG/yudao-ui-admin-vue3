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
      <el-form-item label="总成订单号" prop="productionOrderNo">
        <el-input
          v-model="queryParams.productionOrderNo"
          placeholder="请输入总成订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="主物料号" prop="assemblyMaterialNo">
        <el-input
          v-model="queryParams.assemblyMaterialNo"
          placeholder="请输入主物料号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="组件物料号" prop="componentMaterialNo">
        <el-input
          v-model="queryParams.componentMaterialNo"
          placeholder="请输入组件物料号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="生产车间" prop="productionWorkshop">
        <el-input
          v-model="queryParams.productionWorkshop"
          placeholder="请输入生产车间"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="排产时间" prop="scheduledDate">
        <el-date-picker
          v-model="queryParams.scheduledDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:main-plan-component-progress-report:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe>
      <el-table-column label="总成订单号" align="center" prop="productionOrderNo" min-width="150" />
      <el-table-column label="主物料号" align="center" prop="assemblyMaterialNo" min-width="150" />
      <el-table-column label="组件物料号" align="center" prop="componentMaterialNo" min-width="150" />
      <el-table-column label="组件物料描述" align="center" prop="materialDesc" min-width="200" />
      <el-table-column label="生产车间" align="center" prop="productionWorkshop" min-width="100" />
      <el-table-column label="采购类型" align="center" prop="procurementType" width="100" />
      <el-table-column label="总需求" align="center" prop="totalRequirement" width="100" />
      <el-table-column label="库存" align="center" prop="stockQuantity" width="100" />
      <el-table-column label="在制" align="center" prop="orderQuantity" width="100" />
      <el-table-column label="采购未清订单数量" align="center" prop="openPoQuantity" width="140" />
      <!-- <el-table-column label="是否满足" align="center" prop="satisfy" width="100" /> -->
      <el-table-column label="备料" align="center" prop="materialPreparation" width="100" />
      <el-table-column label="供方" align="center" prop="supplier" min-width="150" />
    </el-table>

    <!-- 分页 -->
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
import { MainPlanComponentProgressReportApi, MainPlanComponentProgressReportVO, MainPlanComponentProgressReportPageReqVO } from '@/api/aps/mainplancomponentprogressreport'

defineOptions({ name: 'MainPlanComponentProgressReport' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(false)
const list = ref<MainPlanComponentProgressReportVO[]>([])
const total = ref(0)
const queryParams = reactive<MainPlanComponentProgressReportPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  productionOrderNo: undefined,
  assemblyMaterialNo: undefined,
  componentMaterialNo: undefined,
  materialDesc: undefined,
  productionWorkshop: undefined,
  scheduledDateStart: undefined,
  scheduledDateEnd: undefined,
})
const queryFormRef = ref()
const exportLoading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const data = await MainPlanComponentProgressReportApi.getPage(queryParams)
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
  // 重置日期数组
  queryParams.productionOrderNo = undefined
  queryParams.scheduledDateStart = undefined
  queryParams.scheduledDateEnd = undefined
  handleQuery()
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await MainPlanComponentProgressReportApi.exportExcel(queryParams)
    download.excel(data, '组件物料需求报表.xls')
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>
