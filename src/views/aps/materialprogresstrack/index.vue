<template>
  <div class="material-progress-page">
    <!-- ===== 标题栏 ===== -->
    <div class="header-bar">
      <div class="title-section">
        <h1 class="main-title">📦 物料进度跟踪套表</h1>
        <span class="update-time" v-if="lastUpdateTime">
          <i class="el-icon-time"></i> 数据更新：{{ lastUpdateTime }}
        </span>
      </div>
    </div>

    <!-- ===== 筛选区 ===== -->
    <div class="filter-bar-light">
      <div class="filter-left">
        <el-form :model="filter" :inline="true">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filter.dateRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始"
              end-placeholder="结束"
              value-format="YYYY-MM-DD"
              style="width: 280px"
            />
          </el-form-item>
          <el-form-item label="车间">
            <el-select v-model="filter.workshop" clearable placeholder="全部" style="width: 120px">
              <el-option v-for="w in workshops" :key="w" :label="w" :value="w" />
            </el-select>
          </el-form-item>
          <el-form-item label="物料编码">
            <el-input v-model="filter.materialCode" placeholder="模糊搜索" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="物料描述">
            <el-input v-model="filter.materialDesc" placeholder="模糊搜索" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item>
            <el-switch v-model="filter.onlyAbnormal" active-text="仅看异常" />
          </el-form-item>
        </el-form>
      </div>
      <div class="filter-right">
        <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
        <el-button icon="Refresh" @click="resetFilter">重置</el-button>
        <el-button @click="toggleExpandAll">
          {{ isAllExpanded ? '收起全部' : '展开全部' }}
        </el-button>
      </div>
    </div>

    <!-- ===== 主表 ===== -->
    <div class="table-section">
      <div class="section-header">
        <span class="section-title">📋 物料需求汇总（按月）</span>
        <span class="section-summary">
          共 {{ total }} 条
          <el-button size="small" type="primary" link @click="exportExcel" v-if="total > 0">导出</el-button>
        </span>
      </div>

      <el-table
        ref="tableRef"
        :data="list"
        row-key="id"
        :expand-row-keys="expandedKeys"
        @expand-change="onExpand"
        v-loading="loading"
        border
        stripe
        style="width: 100%"
      >
        <!-- 展开列 -->
        <el-table-column type="expand" width="50">
          <template #default="{ row }">
            <div v-if="row._loading" class="expand-loading">
              <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon> 加载中...
            </div>
            <div v-else-if="row._children && row._children.length" class="expand-content">
              <h4>🔧 子件物料需求及供应商</h4>
              <el-table :data="row._children" size="small" border style="width: 100%">
                <el-table-column prop="childMaterialCode" label="子件物料号" width="160" />
                <el-table-column prop="childMaterialDesc" label="子件描述" min-width="140" />
                <el-table-column prop="totalDemand" label="需求数量汇总" width="120" align="right" />
                <el-table-column prop="totalIssued" label="已出库数量" width="120" align="right" />
                <el-table-column prop="stockQty" label="库存数量" width="120" align="right" />
                <el-table-column prop="shortageQty" label="缺口数量" width="120" align="right">
                  <template #default="{ row: child }">
                    <span :class="child.shortageQty > 0 ? 'danger-text' : 'normal-text'">
                      {{ child.shortageQty }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="供应商信息" min-width="180">
                  <template #default="{ row: child }">
                    <div v-if="child.suppliers && child.suppliers.length">
                      <el-tag
                        v-for="sup in child.suppliers"
                        :key="sup.supplierName"
                        size="small"
                        style="margin: 2px 4px 2px 0"
                      >
                        {{ sup.supplierName }}: {{ sup.supplyQty }}
                      </el-tag>
                    </div>
                    <span v-else class="normal-text">无供应商</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else class="expand-hint">暂无子件数据</div>
          </template>
        </el-table-column>

        <!-- 主列 -->
        <el-table-column prop="materialCode" label="物料编码" width="200" />
        <el-table-column prop="materialDesc" label="物料描述" min-width="160" />
        <el-table-column prop="workshop" label="车间" width="80" />
        <el-table-column prop="demandMonth" label="需求月份" width="120">
          <template #default="{ row }">
            {{ row.demandMonth ? dayjs(row.demandMonth).format('YYYY-MM') : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="totalDemand" label="需求数量汇总" width="140" align="right" />
        <el-table-column prop="totalCompleted" label="已完工数量汇总" width="140" align="right" />
        <el-table-column prop="stock" label="库存数量" width="140" align="right" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.totalCompleted >= row.totalDemand ? 'success' : 'warning'">
              {{ row.totalCompleted >= row.totalDemand ? '已完成' : '未完成' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadMainTable"
          @current-change="loadMainTable"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { MaterialProgressTrackApi } from '@/api/aps/materialprogresstrack'

// ---------- 筛选 ----------
const filter = reactive({
  dateRange: null,
  workshop: '',
  materialCode: '',
  materialDesc: '',
  onlyAbnormal: false
})

const workshops = ref<string[]>(['Y01', 'Y02', 'Y07', 'Y11', 'Y18'])
const lastUpdateTime = ref('')

// ---------- 主表 ----------
const tableRef = ref()
const list = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const queryParams = reactive({ pageNo: 1, pageSize: 10 })

// ---------- 展开控制 ----------
const expandedKeys = ref<string[]>([])

// 计算是否全部展开（仅当前页）
const isAllExpanded = computed(() => {
  if (!list.value.length) return false
  const allKeys = list.value.map((item) => item.id)
  return allKeys.every((key) => expandedKeys.value.includes(key))
})

// ---------- 加载主表 ----------
const loadMainTable = async () => {
  loading.value = true
  // 查询前清空展开状态，避免旧数据残留
  expandedKeys.value = []
  try {
    const params: any = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      workshop: filter.workshop,
      materialCode: filter.materialCode,
      materialDesc: filter.materialDesc,
      onlyAbnormal: filter.onlyAbnormal
    }

    if (filter.dateRange && Array.isArray(filter.dateRange) && filter.dateRange.length === 2) {
      const [startDate, endDate] = filter.dateRange
      params.startDate = startDate
      params.endDate = endDate
    }

    const res = await MaterialProgressTrackApi.getMaterialSummary(params)
    list.value = res.list.map((item: any) => ({
      ...item,
      id: `${item.materialCode}|${item.workshop}|${item.demandMonth}`,
      _children: null,
      _loading: false
    }))
    total.value = res.total
    lastUpdateTime.value = res.updateTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
  } catch (error: any) {
    console.error('加载主表失败:', error)
    ElMessage.error(error.message || '加载主表数据失败，请检查网络或联系管理员')
    list.value = []
    total.value = 0
    lastUpdateTime.value = ''
  } finally {
    loading.value = false
  }
}

// ---------- 展开事件 ----------
const onExpand = async (row: any, expandedRows: any[]) => {
  // 如果行已展开（展开状态）
  const isExpanded = expandedRows.some((r) => r.id === row.id)

  // 管理展开键列表
  if (isExpanded) {
    // 展开：加入 key
    if (!expandedKeys.value.includes(row.id)) {
      expandedKeys.value.push(row.id)
    }
  } else {
    // 收起：移除 key
    expandedKeys.value = expandedKeys.value.filter((key) => key !== row.id)
    // 收起时不继续加载，直接返回
    return
  }

  // 已加载过则不再加载
  if (row._children !== null) return

  row._loading = true
  try {
    const children = await MaterialProgressTrackApi.getMaterialChildren({
      materialCode: row.materialCode,
      workshop: row.workshop,
      demandMonth: row.demandMonth
    })
    row._children = children
  } catch (error: any) {
    console.error('加载子件失败:', error)
    ElMessage.error(error.message || '加载子件数据失败')
    row._children = []
  } finally {
    row._loading = false
  }
}

// ---------- 一键展开/收起 ----------
const toggleExpandAll = () => {
  if (isAllExpanded.value) {
    // 全部收起
    expandedKeys.value = []
  } else {
    // 全部展开当前页
    const allKeys = list.value.map((item) => item.id)
    expandedKeys.value = allKeys
    // 触发加载子件（由于 expand-change 监听，需要手动触发）
    // 但展开后会自动触发 @expand-change，每个行会触发一次
    // 由于 expandedKeys 已更新，el-table 会自动展开，但不会自动调用 onExpand
    // 我们需要手动调用 onExpand 来加载数据
    list.value.forEach((row) => {
      // 只有行展开且未加载时才加载
      if (expandedKeys.value.includes(row.id) && row._children === null) {
        // 模拟 expand-change 事件
        // 注意：这里不能直接调用 onExpand，因为它的参数格式不同
        // 我们直接调用加载逻辑
        loadChildren(row)
      }
    })
  }
}

// 加载子件（供 toggleExpandAll 调用）
const loadChildren = async (row: any) => {
  if (row._children !== null) return
  row._loading = true
  try {
    const children = await MaterialProgressTrackApi.getMaterialChildren({
      materialCode: row.materialCode,
      workshop: row.workshop,
      demandMonth: row.demandMonth
    })
    row._children = children
  } catch (error: any) {
    console.error('加载子件失败:', error)
    ElMessage.error(error.message || '加载子件数据失败')
    row._children = []
  } finally {
    row._loading = false
  }
}

// ---------- 查询 / 重置 ----------
const handleQuery = () => {
  queryParams.pageNo = 1
  // 重置展开状态在 loadMainTable 中处理
  loadMainTable()
}

const resetFilter = () => {
  filter.dateRange = null
  filter.workshop = ''
  filter.materialCode = ''
  filter.materialDesc = ''
  filter.onlyAbnormal = false
  // 重置展开状态
  expandedKeys.value = []
  handleQuery()
}

const exportExcel = () => {
  ElMessage.info('导出功能待实现')
}

onMounted(() => {
  loadMainTable()
})
</script>

<style scoped>
/* 样式保持不变 */
.material-progress-page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
  color: #303133;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.main-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}
.update-time {
  font-size: 14px;
  color: #909399;
}
.filter-bar-light {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.filter-right {
  display: flex;
  gap: 8px;
  align-items: center;
}
.table-section {
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.section-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
}
.section-summary {
  font-size: 14px;
  color: #909399;
}
.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
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
}
.expand-hint {
  color: #909399;
  padding: 10px;
}
.danger-text {
  color: #f56c6c;
  font-weight: bold;
}
.normal-text {
  color: #67c23a;
}
.el-tag {
  margin: 2px 4px 2px 0;
}
</style>
