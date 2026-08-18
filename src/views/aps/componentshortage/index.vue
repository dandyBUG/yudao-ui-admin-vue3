<!-- component-shortage/index.vue -->
<template>
  <div>
    <!-- 头部：返回按钮 + 标题 -->
    <ContentWrap>
      <div class="page-header">
        <el-button @click="goBack" type="default" size="default">
          <Icon icon="ep:arrow-left" class="mr-5px" /> 返回
        </el-button>
        <span class="page-title">📊 所有组件缺口统计</span>
        <span class="page-subtitle">按组件物料汇总所有总成的缺口数据</span>
      </div>
    </ContentWrap>

    <!-- 搜索工作栏 -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="组件编码" prop="componentMaterialNo">
          <el-input
            v-model="queryParams.componentMaterialNo"
            placeholder="请输入组件物料编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-200px"
          />
        </el-form-item>
        <el-form-item label="组件名称" prop="componentDesc">
          <el-input
            v-model="queryParams.componentDesc"
            placeholder="请输入组件名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-200px"
          />
        </el-form-item>
        <el-form-item label="仅显示缺口" prop="onlyShortage">
          <el-switch v-model="queryParams.onlyShortage" @change="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['aps:material-shortage:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        row-key="componentMaterialNo"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="组件物料编码" align="center" prop="componentMaterialNo" min-width="160" />
        <el-table-column label="组件名称" align="center" prop="componentDesc" min-width="200" />

        <!-- 需求-库存-已投料 核心三列 -->
        <el-table-column label="需求总量" align="center" prop="totalRequirement" width="140">
          <template #default="scope">
            {{ scope.row.totalRequirement?.toFixed?.(2) ?? '0.00' }}
          </template>
        </el-table-column>
        <el-table-column label="库存数量" align="center" prop="stockQuantity" width="140">
          <template #default="scope">
            {{ scope.row.stockQuantity?.toFixed?.(2) ?? '0.00' }}
          </template>
        </el-table-column>
        <el-table-column label="在途数量" align="center" prop="transit" width="140">
          <template #default="scope">
            {{ scope.row.transit?.toFixed?.(2) ?? '0.00' }}
          </template>
        </el-table-column>
        <el-table-column label="已投料" align="center" prop="totalIssue" width="140">
          <template #default="scope">
            {{ scope.row.totalIssue?.toFixed?.(2) ?? '0.00' }}
          </template>
        </el-table-column>

        <!-- 缺口数量（高亮） -->
        <el-table-column label="缺口数量" align="center" prop="shortageQty" width="140">
          <template #default="scope">
            <el-tag :type="scope.row.shortageQty > 0 ? 'danger' : 'success'" size="large">
              {{ scope.row.shortageQty?.toFixed?.(2) ?? '0.00' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 涉及成品信息 -->
        <el-table-column label="涉及成品数" align="center" prop="mainCount" width="120" />
        <el-table-column label="涉及成品列表" align="center" prop="mainMaterialNos" min-width="250">
          <template #default="scope">
            <el-tooltip
              v-if="scope.row.mainMaterialNos"
              :content="scope.row.mainMaterialNos"
              placement="top"
            >
              <span class="main-material-list">{{ scope.row.mainMaterialNos }}</span>
            </el-tooltip>
            <span v-else>-</span>
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
  </div>
</template>

<script setup lang="ts">
import { MaterialShortageApi, MaterialShortageComponentSummaryVO } from '@/api/aps/materialshortage'
import download from '@/utils/download'
import { useRouter } from 'vue-router'

defineOptions({ name: 'ComponentShortage' })

const router = useRouter()
const message = useMessage()

const loading = ref(true)
const exportLoading = ref(false)
const list = ref<MaterialShortageComponentSummaryVO[]>([])
const total = ref(0)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  componentMaterialNo: undefined,
  componentDesc: undefined,
  onlyShortage: false,
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialShortageApi.getComponentSummaryPage(queryParams)
    list.value = data.list || []
    total.value = data.total || 0
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
  queryFormRef.value.resetFields()
  queryParams.onlyShortage = false
  handleQuery()
}

/** 导出 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await MaterialShortageApi.exportComponentExcel(queryParams)
    download.excel(data, '组件缺口汇总.xls')
  } catch {
    // 取消
  } finally {
    exportLoading.value = false
  }
}

/** 返回上一页 */
const goBack = () => {
  router.back()
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin-left: 8px;
}

.main-material-list {
  display: inline-block;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #409EFF;
  cursor: pointer;
}
</style>
