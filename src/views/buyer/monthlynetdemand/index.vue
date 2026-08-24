<template>
  <ContentWrap>
    <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="-mb-15px" label-width="90px">
      <el-form-item label="计划月份" prop="planMonth">
        <el-date-picker v-model="queryParams.planMonth" type="month" value-format="YYYY-MM" placeholder="请选择计划月份" clearable class="!w-180px" />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialNo">
        <el-input v-model="queryParams.materialNo" placeholder="特力或主机编码" clearable class="!w-200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="queryParams.materialName" placeholder="请输入物料名称" clearable class="!w-200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="映射状态" prop="mapped">
        <el-select v-model="queryParams.mapped" placeholder="全部" clearable class="!w-140px">
          <el-option label="已映射" :value="true" />
          <el-option label="未映射" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip>
      <el-table-column label="月份" prop="planMonth" align="center" width="100" />
      <el-table-column label="主机编码" prop="hostCode" align="center" min-width="160" />
      <el-table-column label="特力物料编码" prop="materialNo" align="center" min-width="160">
        <template #default="scope">{{ scope.row.materialNo || '-' }}</template>
      </el-table-column>
      <el-table-column label="物料名称" prop="materialName" align="center" min-width="200" />
      <el-table-column label="映射状态" prop="mapped" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.mapped ? 'success' : 'danger'">{{ scope.row.mapped ? '已映射' : '未映射' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总需求" prop="totalDemand" align="right" min-width="110" />
      <el-table-column label="SAP可用库存" prop="sapAvailableStock" align="right" min-width="130" />
      <el-table-column label="驻外库存" prop="overseasAvailableStock" align="right" min-width="110" />
      <el-table-column label="在制订单" prop="inProcessOrderQuantity" align="right" min-width="110" />
      <el-table-column label="净需求" prop="netDemand" align="right" fixed="right" min-width="110">
        <template #default="scope"><span class="font-bold text-[var(--el-color-primary)]">{{ scope.row.netDemand }}</span></template>
      </el-table-column>
    </el-table>
    <Pagination v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { MonthlyNetDemandApi, MonthlyNetDemandPageReqVO, MonthlyNetDemandVO } from '@/api/buyer/monthlynetdemand'

defineOptions({ name: 'MonthlyNetDemand' })
const message = useMessage()
const loading = ref(false)
const list = ref<MonthlyNetDemandVO[]>([])
const total = ref(0)
const queryFormRef = ref()
const queryParams = reactive<MonthlyNetDemandPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  planMonth: dayjs().format('YYYY-MM')
})

const getList = async () => {
  if (!queryParams.planMonth) {
    message.warning('请选择计划月份')
    return
  }
  loading.value = true
  try {
    const data = await MonthlyNetDemandApi.getPage(queryParams)
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
  queryParams.planMonth = dayjs().format('YYYY-MM')
  handleQuery()
}
onMounted(getList)
</script>
