<template>
  <ContentWrap>
    <!-- 搜索工作栏（不变） -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="成品物料编码" prop="mainMaterialNo">
        <el-input
          v-model="queryParams.mainMaterialNo"
          placeholder="请输入成品物料编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="成品物料名称" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          placeholder="请输入成品物料名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="warning"
          plain
          @click="handleRefresh"
          v-hasPermi="['aps:material-shortage:refresh']"
          :loading="refreshLoading"
        >
          <Icon icon="ep:refresh-right" class="mr-5px" /> 刷新数据
        </el-button>
        <el-button
          type="primary"
          plain
          @click="goComponentShortage"
        >
          <Icon icon="ep:grid" class="mr-5px" /> 组件缺口统计
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:material-shortage:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="primary" plain @click="expandAll">展开全部</el-button>
        <el-button type="info" plain @click="collapseAll">收起全部</el-button>
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
      row-key="mainMaterialNo"
      ref="tableRef"
      @expand-change="handleExpandChange"
    >
      <!-- 展开列 -->
      <el-table-column type="expand" width="50">
        <template #default="scope">
          <!-- 加载中 -->
          <div v-if="scope.row._loading" class="expand-loading">
            <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon> 加载中...
          </div>
          <!-- 有数据 -->
          <div v-else-if="scope.row._details && scope.row._details.length > 0" class="expand-content">
            <h4>🔍 缺口明细</h4>
            <el-table :data="scope.row._details" size="small" border stripe>
              <el-table-column prop="componentMaterialNo" label="组件物料编码" min-width="160" />
              <el-table-column prop="componentDesc" label="组件名称" min-width="180" />
              <el-table-column prop="unitUsage" label="总需求数量" align="right" width="100" />
              <el-table-column prop="stockQuantity" label="库存数量" align="right" width="110" />
              <el-table-column prop="issue" label="已发数量" align="right" width="110" />
              <el-table-column prop="shortageQty" label="缺口数量" align="right" width="120">
                <template #default="{ row: detail }">
                  <el-tag :type="detail.shortageQty > 0 ? 'danger' : 'success'">
                    {{ detail.shortageQty }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 无数据 -->
          <div v-else class="expand-hint">暂无缺口明细</div>
        </template>
      </el-table-column>

      <el-table-column label="序号" align="center" type="index" width="60" />
      <el-table-column label="成品物料编码" align="center" prop="mainMaterialNo" min-width="150" />
      <el-table-column label="成品物料名称" align="center" prop="materialDesc" min-width="180" />

      <!-- ===== 新增：总成层级四个字段 ===== -->
      <el-table-column label="总成需求" align="center" prop="mainRequirement" width="120">
        <template #default="scope">
          {{ scope.row.mainRequirement?.toFixed?.(2) ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column label="总成库存" align="center" prop="mainStockQuantity" width="120">
        <template #default="scope">
          {{ scope.row.mainStockQuantity?.toFixed?.(2) ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column label="总成在途" align="center" prop="mainTransit" width="120">
        <template #default="scope">
          {{ scope.row.mainTransit?.toFixed?.(2) ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column label="已交付" align="center" prop="mainDelivered" width="120">
        <template #default="scope">
          {{ scope.row.mainDelivered?.toFixed?.(2) ?? '0.00' }}
        </template>
      </el-table-column>

      <el-table-column label="缺口子件数" align="center" prop="componentCount" width="120" />
      <el-table-column label="总缺口数量" align="center" prop="totalShortageQty" width="140">
        <template #default="scope">
          <span style="color: #F56C6C; font-weight: bold;">
            {{ scope.row.totalShortageQty }}
          </span>
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
import { MaterialShortageApi, MaterialShortageSummaryVO } from '@/api/aps/materialshortage'
import download from '@/utils/download'
import { useRouter } from 'vue-router'

defineOptions({ name: 'MaterialShortage' })

const message = useMessage()
const router = useRouter()

const goComponentShortage = () => {
  console.log('按钮被点击，准备跳转')
  const routes = router.getRoutes()
  console.log('当前所有路由：', routes.map(r => ({ name: r.name, path: r.path })))
  try {
    router.push({ name: 'ComponentShortage' })
  } catch (err) {
    console.error('跳转异常：', err)
  }
}

const loading = ref(true)
const refreshLoading = ref(false)
const exportLoading = ref(false)
const list = ref<MaterialShortageSummaryVO[]>([])
const total = ref(0)
const tableRef = ref()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  mainMaterialNo: undefined,
  materialDesc: undefined,
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialShortageApi.getSummaryPage(queryParams)
    list.value = data.list.map((item: any) => ({
      ...item,
      _details: null,
      _loading: false,
      _expanded: false
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
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 刷新数据 */
const handleRefresh = async () => {
  try {
    await message.confirm('确认刷新物料缺口数据？此操作将从BOM、库存、订单等重新计算。')
    refreshLoading.value = true
    await MaterialShortageApi.refreshData()
    message.success('缺口数据刷新成功！')
    await getList()
  } catch {
    // 取消操作
  } finally {
    refreshLoading.value = false
  }
}

/** 导出 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await MaterialShortageApi.exportExcel(queryParams)
    download.excel(data, '物料缺口汇总.xls')
  } catch {
    // 取消
  } finally {
    exportLoading.value = false
  }
}

// ========== 展开/收起处理 ==========

/** 行展开事件 */
const handleExpandChange = (row: any, expandedRows: any[]) => {
  const isExpanded = expandedRows.includes(row);
  row._expanded = isExpanded;

  if (!isExpanded) return;

  // ===== 新增：无缺口子件时直接返回，不加载 =====
  if (row.componentCount === 0) {
    row._details = [];
    return;
  }

  if (row._details !== null && row._details !== undefined) return;
  if (row._loading) return;

  loadDetails(row);
};

/** 加载明细数据 */
const loadDetails = async (row: any) => {
  // ===== 新增：若缺口子件数为0，直接置空，不请求 =====
  if (row.componentCount === 0) {
    row._details = [];
    row._loading = false;
    return;
  }

  // 已有数据或正在加载，避免重复请求
  if (row._details !== null && row._details !== undefined) return;
  if (row._loading) return;

  row._loading = true;
  try {
    const details = await MaterialShortageApi.getDetails(row.mainMaterialNo);
    row._details = details || [];
  } catch {
    row._details = [];
    message.error('加载明细失败');
  } finally {
    row._loading = false;
  }
};

/** 展开全部（当前页） */
const expandAll = async () => {
  if (!tableRef.value) return;

  // 仅对 componentCount > 0 的行加载明细
  const loadPromises = list.value
    .filter(row => row.componentCount > 0 && (row._details === null || row._details === undefined))
    .map(async (row) => {
      row._loading = true;
      try {
        const details = await MaterialShortageApi.getDetails(row.mainMaterialNo);
        row._details = details || [];
      } catch {
        row._details = [];
      } finally {
        row._loading = false;
      }
    });

  // 对 componentCount === 0 的行直接置空，不请求
  list.value.forEach(row => {
    if (row.componentCount === 0) {
      row._details = [];
    }
  });

  await Promise.all(loadPromises);

  // 全部展开（仅展开有缺口子件的行，也可全部展开，但无数据行显示空状态）
  list.value.forEach(row => {
    tableRef.value.toggleRowExpansion(row, true);
    row._expanded = true;
  });
};


/** 收起全部 */
const collapseAll = () => {
  if (!tableRef.value) return
  list.value.forEach(row => {
    tableRef.value.toggleRowExpansion(row, false)
    row._expanded = false
  })
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped>
.expand-content {
  padding: 10px 20px;
  background: #f9fafc;
  border-radius: 4px;
}
.expand-content h4 {
  margin: 5px 0 10px;
  color: #303133;
}
.expand-loading {
  color: #909399;
  padding: 20px;
  text-align: center;
}
.expand-hint {
  color: #909399;
  padding: 10px 20px;
}
</style>
