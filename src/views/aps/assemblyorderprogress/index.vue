<template>
  <ContentWrap>
    <!-- 搜索筛选栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="时间维度" prop="dimension">
        <el-radio-group v-model="queryParams.dimension" @change="handleQuery">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="week">周</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker
          v-model="queryParams.startDate"
          value-format="YYYY-MM-DD"
          placeholder="开始日期"
          clearable
        />
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="queryParams.endDate"
          value-format="YYYY-MM-DD"
          placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item label="图号" prop="materialCode">
        <el-input v-model="queryParams.materialCode" placeholder="请输入图号" clearable />
      </el-form-item>
      <el-form-item label="名称" prop="materialDesc">
        <el-input v-model="queryParams.materialDesc" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-input v-model="queryParams.workshop" placeholder="请输入车间" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:assembly-order-progress:export']"
        >
          <Icon icon="ep:download" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 表格 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      stripe
      show-overflow-tooltip
      row-key="materialCode"
      @expand-change="onExpand"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <div v-if="scope.row._loading" class="expand-loading">
            <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon> 加载中...
          </div>
          <div v-else-if="scope.row._children" class="expand-content">
            <h4>🔍 缺料零件详情</h4>
            <el-table :data="scope.row._children" size="small" border>
              <el-table-column prop="purchaseMaterial" label="采购物料编码" width="180" />
              <el-table-column prop="purchaseMaterialDesc" label="采购物料描述" />
              <el-table-column prop="shortageQty" label="缺口数量" width="100" align="right">
                <template #default="{ row }">
                  <span class="danger-text">{{ row.shortageQty }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="expectedDate" label="预计到货日期" width="120" />
              <el-table-column prop="supplierName" label="供应商" width="150" />
              <el-table-column label="排产时间" width="120">
                <template #default="{ row }">
                  {{ row.scheduleTime ? dayjs(row.scheduleTime).format('YYYY-MM-DD') : '-' }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else class="expand-hint">点击查看缺料零件</div>
        </template>
      </el-table-column>

      <el-table-column prop="materialCode" label="图号" width="180" />
      <el-table-column prop="materialDesc" label="名称" min-width="160" />
      <el-table-column prop="timeDimension" label="时间（维度）" width="150" />
      <el-table-column prop="planQty" label="计划数量" width="120" align="right" />
      <el-table-column prop="completedQty" label="完成数量" width="120" align="right" />
      <el-table-column prop="stockQty" label="库存数量" width="120" align="right" />
      <el-table-column label="缺料状态" width="120" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.shortageCount > 0 ? 'danger' : 'success'">
            {{ scope.row.shortageCount > 0 ? `缺${scope.row.shortageCount}种` : '齐套' }}
          </el-tag>
        </template>
      </el-table-column>
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
import { reactive, ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import download from '@/utils/download'
import { AssemblyOrderProgressApi, AssemblyOrderProgressVO } from '@/api/aps/assemblyorderprogress'

defineOptions({ name: 'AssemblyOrderProgress' })

const loading = ref(false)
const exportLoading = ref(false)
const list = ref<AssemblyOrderProgressVO[]>([])
const total = ref(0)
const queryFormRef = ref()
const queryParams = reactive({
  dimension: 'week',
  startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  materialCode: '',
  materialDesc: '',
  workshop: '',
  pageNo: 1,
  pageSize: 10
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AssemblyOrderProgressApi.getPage(queryParams)
    list.value = data.list.map(item => ({
      ...item,
      _children: null,
      _loading: false
    }))
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryParams.dimension = 'week'
  queryParams.startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
  queryParams.endDate = dayjs().format('YYYY-MM-DD')
  queryParams.materialCode = ''
  queryParams.materialDesc = ''
  queryParams.workshop = ''
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 导出 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await AssemblyOrderProgressApi.exportExcel(queryParams)
    download.excel(data, '总成订单进度追踪.xls')
  } finally {
    exportLoading.value = false
  }
}

/** 展开行 - 加载缺料零件 */
const onExpand = async (row: any, expandedRows: any[]) => {
  if (!expandedRows.includes(row) || row._children !== null) return
  row._loading = true
  try {
    const children = await AssemblyOrderProgressApi.getShortages({
      materialCode: row.materialCode,
      scheduleTime: row.timeDimension // 传当前维度值，后端按需过滤
    })
    row._children = children
  } catch {
    row._children = []
  } finally {
    row._loading = false
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.expand-hint { color: #909399; padding: 10px; }
.expand-content { padding: 10px 20px; background: #f9fafc; border-radius: 4px; }
.expand-content h4 { margin: 5px 0 10px; color: #303133; }
.expand-loading { color: #909399; padding: 20px; }
.danger-text { color: #f56c6c; font-weight: bold; }
</style>
