<template>
  <div class="dashboard-light">
    <!-- ==================== 顶部标题栏 ==================== -->
    <div class="header-bar">
      <div class="title-section">
        <h1 class="main-title">主计划进度管控驾驶舱</h1>
        <span class="update-time" v-if="overview.lastUpdateTime">
          <i class="el-icon-time"></i> 数据更新：{{ overview.lastUpdateTime }}
        </span>
      </div>
    </div>

    <!-- ==================== 顶部筛选区 ==================== -->
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
          <el-form-item label="快捷">
            <el-button-group>
              <el-button size="small" @click="setQuick('month')" :type="quickType === 'month' ? 'primary' : ''">本月</el-button>
              <el-button size="small" @click="setQuick('lastMonth')" :type="quickType === 'lastMonth' ? 'primary' : ''">上月</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item label="车间">
            <el-select v-model="filter.workshop" clearable placeholder="全部" style="width: 120px">
              <el-option v-for="w in workshops" :key="w" :label="w" :value="w" />
            </el-select>
          </el-form-item>
          <el-form-item label="供应商">
            <el-select v-model="filter.supplier" clearable filterable placeholder="全部" style="width: 160px">
              <el-option v-for="s in suppliers" :key="s" :label="s" :value="s" />
            </el-select>
          </el-form-item>
          <el-form-item label="物料号">
            <el-input v-model="filter.materialCode" placeholder="零件编码" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item>
            <el-switch v-model="filter.onlyAbnormal" active-text="仅看异常" />
          </el-form-item>
        </el-form>
      </div>
      <div class="filter-right">
        <el-button type="primary" icon="Search" @click="handleFilter">查询</el-button>
        <el-button icon="Refresh" @click="resetFilter">重置</el-button>
      </div>
    </div>

    <!-- ==================== 核心指标卡片 ==================== -->
    <div class="kpi-row">
      <div
        v-for="(card, index) in kpiCards"
        :key="card.label"
        class="kpi-card"
        :style="{ borderTopColor: card.color }"
      >
        <div class="kpi-icon" v-html="card.iconEmoji"></div>
        <div class="kpi-content">
          <div class="kpi-label">{{ card.label }}</div>
          <div class="kpi-value" :style="{ color: card.color }">
            {{ (displayValues[index] !== null && displayValues[index] !== undefined) ? displayValues[index].toFixed(card.isPercent ? 1 : 0) : '-' }}
            <small v-if="card.sub">{{ card.sub }}</small>
          </div>
          <div class="kpi-compare" v-if="card.trend !== undefined">
            <span :class="card.trend > 0 ? 'trend-up' : 'trend-down'">
              {{ card.trend > 0 ? '▲' : '▼' }} {{ Math.abs(card.trend) }}%
            </span>
            <span class="compare-label">较昨日</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 多维度分析区（带点击联动） ==================== -->
    <div class="analysis-panels">
      <!-- 车间面板 -->
      <div class="panel panel-workshop">
        <div class="panel-header">
          <span class="panel-title">🔧 车间完成情况</span>
          <span class="panel-subtitle">计划量(蓝) vs 完工量(绿) | 点击车间可下钻</span>
        </div>
        <div ref="workshopChartRef" style="height: 220px"></div>
        <div class="panel-table">
          <el-table :data="workshopData" size="small" @row-click="handleWorkshopClick">
            <el-table-column prop="workshop" width="50" />
            <el-table-column label="完工率" width="140">
              <template #default="{ row }">
                <el-progress
                  :percentage="parseFloat(row.completionRate)"
                  :stroke-width="6"
                  :color="row.completionRate > 80 ? '#67C23A' : row.completionRate > 60 ? '#E6A23C' : '#F56C6C'"
                />
              </template>
            </el-table-column>
            <el-table-column prop="shortageOrders" label="缺料单" width="70" align="right" />
          </el-table>
        </div>
      </div>

      <!-- 供应商面板 -->
      <div class="panel panel-supplier">
        <div class="panel-header">
          <span class="panel-title">📦 供应商交付风险 TOP10</span>
          <span class="panel-subtitle">未清订单数量 | 点击供应商可下钻</span>
        </div>
        <div ref="supplierChartRef" style="height: 280px"></div>
        <div class="panel-table" style="max-height: 200px; overflow-y: auto;">
          <el-table :data="supplierData" size="small" @row-click="handleSupplierClick">
            <el-table-column prop="supplier" label="供应商" width="250" show-overflow-tooltip />
            <el-table-column prop="openQty" label="未清采购物料缺件数量" width="140">
              <template #default="{ row }">
                <span :class="row.openQty > 5 ? 'danger-text' : ''">{{ row.openQty }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="affectedOrders" label="影响订单" width="80" align="right" /> -->
          </el-table>
        </div>
      </div>

      <!-- 物料短缺面板 -->
      <div class="panel panel-shortage">
        <div class="panel-header">
          <span class="panel-title">⚠️ 物料短缺 TOP5</span>
          <span class="panel-subtitle">点击物料可查看受影响订单</span>
        </div>
        <div class="panel-table">
          <el-table :data="materialData" size="small" @row-click="handleMaterialClick">
            <el-table-column prop="componentCode" label="零件编码" width="160" />
            <el-table-column prop="componentDesc" label="零件描述" />
            <el-table-column prop="shortageQty" label="缺口" width="70" align="right">
              <template #default="{ row }">
                <span class="danger-text">{{ row.shortageQty }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="affectedOrders" label="涉及订单数" width="90" align="right" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- ==================== 总成订单执行明细（可展开穿透） ==================== -->
    <div class="detail-section">
      <div class="section-header">
        <span class="section-title">📋 总成订单执行明细</span>
        <span class="section-summary">
          共 {{ total }} 条 | 缺料
          <span class="danger-text">{{ overview.shortageOrders }}</span>
          条
          <span v-if="filter.workshop"> | 车间：{{ filter.workshop }}</span>
          <span v-if="filter.supplier"> | 供应商：{{ filter.supplier }}</span>
          <span v-if="filter.materialCode"> | 物料：{{ filter.materialCode }}</span>
          <el-button size="small" type="primary" link @click="clearFilters" v-if="filter.workshop || filter.supplier || filter.materialCode">清除联动</el-button>
        </span>
      </div>
      <el-table :data="list" row-key="orderNo" @expand-change="onExpand" v-loading="orderLoading">
        <el-table-column type="expand" width="50">
          <template #default="scope">
            <div v-if="scope.row._loading" class="expand-loading">
              <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon> 加载中...
            </div>
            <div v-else-if="scope.row._children" class="expand-content">
              <h4>🔍 缺料零件及采购进度</h4>
              <el-table :data="scope.row._children" size="small" border>
                <el-table-column prop="componentCode" label="零件编码" width="160" />
                <el-table-column prop="componentDesc" label="零件描述" />
                <el-table-column prop="requiredQty" label="需求" width="70" />
                <!-- 新增排产时间列
                  <el-table-column label="排产时间" width="120">
                    <template #default="{ row: part }">
                      {{ part.scheduleTime ? dayjs(part.scheduleTime).format('YYYY-MM-DD') : '-' }}
                    </template>
                  </el-table-column>-->
                <el-table-column prop="shortage" label="缺口" width="70">
                  <template #default="{ row: part }">
                    <span class="danger-text">{{ part.shortage }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="expectedDate" label="预计齐套日" width="120" />
                <el-table-column label="建议措施" width="160">
                  <template #default="{ row: part }">
                    <span v-if="part.inTransit" class="warning-text">在途 {{ part.inTransit }}，预计{{ part.expectedDate }}到</span>
                    <span v-else class="danger-text">无在途，立即催料</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template #default="{ row: part }">
                    <el-button size="small" type="primary" link @click="showPurchaseDetail(part, scope.row.orderNo)">采购单</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else class="expand-hint">点击查看缺料分析</div>
          </template>
        </el-table-column>

        <el-table-column label="订单号" prop="orderNo" width="160" />
         <el-table-column label="物料编码" prop="materialCode" width="180" />
        <el-table-column label="物料描述" prop="materialDesc" min-width="160" />
        <el-table-column label="车间" prop="workshop" width="70" />
        <el-table-column label="排产时间" width="120">
          <template #default="{ row }">
            {{ row.scheduleTime ? dayjs(row.scheduleTime).format('YYYY-MM-DD') : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="订单总数" prop="totalQty" width="80" />
        <el-table-column label="计划数量" prop="quantity" width="80" />
        <el-table-column label="已完工" prop="completedQuantity" width="80" />
        <el-table-column label="转序(涂装)" prop="transferOrder" width="90">
          <template #default="{ row }">
            <el-tag :type="row.transferOrder >= row.quantity ? 'success' : 'warning'" effect="dark">
              {{ row.transferOrder }}/{{ row.quantity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="投料状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.shortageCount ? 'danger' : 'success'">
              {{ row.shortageCount ? `缺${row.shortageCount}种` : '齐套' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="缺料状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getShortageStatusTag(row)">
              {{ getShortageStatusText(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预警信息" prop="warning" min-width="140">
          <template #default="{ row }">
            <span v-if="row.warning" class="warning-icon">⚠ {{ row.warning }}</span>
            <span v-else class="normal-text">正常</span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="loadOrderPage"
      />
    </div>

    <!-- 采购详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="采购订单详情" size="780px" direction="rtl">
      <template #header>
        <span style="font-weight: bold">{{ drawerTitle }}</span>
      </template>
     <el-table :data="purchaseOrders" size="small" border stripe v-loading="purchaseLoading">
       <el-table-column prop="purchaseOrder" label="采购订单号" width="150" />
       <el-table-column prop="supplier" label="供应商" width="150" />
       <!-- 下单日期：使用 dayjs 格式化 -->
       <el-table-column label="下单日期" width="120">
         <template #default="{ row }">
           {{ row.orderDate ? dayjs(Number(row.orderDate)).format('YYYY-MM-DD') : '-' }}
         </template>
       </el-table-column>
       <!-- 要求到货：使用 dayjs 格式化 -->
       <el-table-column label="要求到货" width="120">
         <template #default="{ row }">
           {{ row.requiredDate ? dayjs(Number(row.requiredDate)).format('YYYY-MM-DD') : '-' }}
         </template>
       </el-table-column>
       <el-table-column label="已投/订单量" width="120">
         <template #default="{ row: po }">
           {{ po.receivedQty }} / {{ po.orderQty }}
         </template>
       </el-table-column>
       <el-table-column label="未交数量" width="100">
         <template #default="{ row: po }">
           <span class="danger-text">{{ po.openQty }}</span>
         </template>
       </el-table-column>
     </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { MatchingResultApi } from '@/api/aps/mainplanprogressreport'

// ---------- 动态数据 ----------
const overview = reactive({
  totalOrders: 0,
  totalPlanQty: 0,
  totalCompletedQty: 0,
  completionRate: 0,
  shortageOrders: 0,
  totalRequiredQty: 0,         // 新增：物料需求总量
  completedShortageQty: 0,     // 新增：转序完成且缺料的订单的物料缺口总量
  kitRate: 0,
  lastUpdateTime: ''
})

const workshops = ref<string[]>(['Y01', 'Y02', 'Y07', 'Y11', 'Y18'])
const suppliers = ref<string[]>(['供应商A', '供应商B', '供应商C', '供应商D'])

const filter = reactive({
  dateRange: [
    dayjs().startOf('month').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  ],
  workshop: '',
  supplier: '',
  materialCode: '',
  onlyAbnormal: false
})

const quickType = ref('month')

// KPI 卡片数据结构（value 会动态替换）
const kpiCards = ref([
  { label: '计划总量', value: 0, sub: '根', color: '#67C23A', iconEmoji: '🏭', isPercent: false, trend: -2.1 },
  { label: '完工总量', value: 0, sub: '根', color: '#E6A23C', iconEmoji: '✅', isPercent: false, trend: 3.8 },
  { label: '完工率', value: 0, sub: '%', color: '#409EFF', iconEmoji: '📈', isPercent: true, trend: 1.5 },
   { label: '投料未完成数量', value: 0, sub: '', color: '#E6A23C', iconEmoji: '📉', isPercent: false, trend: 0 },
  { label: '缺料订单', value: 0, sub: '单', color: '#F56C6C', iconEmoji: '⚠️', isPercent: false, trend: -8.3 },
  { label: '订单齐套率', value: 0, sub: '%', color: '#409EFF', iconEmoji: '🧩', isPercent: true, trend: 2.7 }
])

const displayValues = ref([0, 0, 0, 0, 0, 0])
let animationFrames: number[] = []

const startAnimation = () => {
  kpiCards.value.forEach((card, index) => {
    const target = card.value
    const duration = 1000
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      displayValues.value[index] = target * eased
      if (progress < 1) {
        animationFrames[index] = requestAnimationFrame(step)
      } else {
        displayValues.value[index] = target
      }
    }
    if (animationFrames[index]) cancelAnimationFrame(animationFrames[index])
    animationFrames[index] = requestAnimationFrame(step)
  })
}

// 面板动态数据
const workshopData = ref([])
const supplierData = ref([])
const materialData = ref([])

// 订单列表
const list = ref([])
const total = ref(0)
const queryParams = reactive({ pageNo: 1, pageSize: 10 })
const orderLoading = ref(false)

// 图表
const workshopChartRef = ref(null)
const supplierChartRef = ref(null)
let workshopChart: echarts.ECharts | null = null
let supplierChart: echarts.ECharts | null = null

const initWorkshopChart = () => {
  if (!workshopChartRef.value) return
  if (workshopChart) workshopChart.dispose()
  workshopChart = echarts.init(workshopChartRef.value)
  workshopChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['计划量', '完工量'], orient: 'vertical', right: 5, top: 5, textStyle: { color: '#606266' } },
    grid: { top: 20, right: 50, bottom: 20, left: 40 },
    xAxis: { type: 'value', axisLabel: { color: '#606266' } },
    yAxis: { type: 'category', data: workshopData.value.map((w: any) => w.workshop), inverse: true, axisLabel: { color: '#606266' } },
    series: [
      {
        name: '计划量', type: 'bar', data: workshopData.value.map((w: any) => w.planQty),
        itemStyle: { color: '#409EFF' }, barWidth: 12
      },
      {
        name: '完工量', type: 'bar', data: workshopData.value.map((w: any) => w.completeQty),
        itemStyle: { color: '#67C23A' }, barWidth: 12
      }
    ]
  })
}

const initSupplierChart = () => {
  if (!supplierChartRef.value) return
  if (supplierChart) supplierChart.dispose()

  // 取前10条用于图表展示
  const topSuppliers = supplierData.value.slice(0, 10)

  supplierChart = echarts.init(supplierChartRef.value)
  supplierChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, right: 50, bottom: 20, left: 120 }, // left保留足够空间
    xAxis: { type: 'value', axisLabel: { color: '#606266' } },
    yAxis: {
      type: 'category',
      data: topSuppliers.map((s: any) => s.supplier),     // Y轴只显示TOP10供应商名称
      inverse: true,
      axisLabel: { color: '#606266', width: 100, overflow: 'truncate' }
    },
    series: [
      {
        type: 'bar',
        data: topSuppliers.map((s: any) => s.openQty), // 对应TOP10的未清订单数
        barWidth: 14,
        itemStyle: { color: '#E57373' },
        label: { show: true, position: 'right', color: '#303133' }
      }
    ]
  })
}

// ---------- 数据加载 ----------
const loadOverview = async () => {
  const [startDate, endDate] = filter.dateRange
  const data = await MatchingResultApi.getDashboardOverview({
    startDate, endDate,
    workshop: filter.workshop,
    supplier: filter.supplier
  })
  Object.assign(overview, data)

  // 投料未完成率 = 转序完成且缺料的订单的物料缺口总量 / 所有物料需求总量 * 100
  const materialShortageRate = overview.completedShortageQty

  kpiCards.value[0].value = overview.totalPlanQty
  kpiCards.value[1].value = overview.totalCompletedQty
  kpiCards.value[2].value = overview.completionRate
  kpiCards.value[3].value = materialShortageRate
  kpiCards.value[4].value = overview.shortageOrders   // 缺料订单数，保持不变
  kpiCards.value[5].value = overview.kitRate


  kpiCards.value[0].trend = data.planQtyTrend;
  kpiCards.value[1].trend = data.completeQtyTrend;
  kpiCards.value[2].trend = data.completionRateTrend;
  kpiCards.value[3].trend = data.materialRateTrend;
  kpiCards.value[4].trend = data.shortageOrdersTrend;
  kpiCards.value[5].trend = data.kitRateTrend;

  startAnimation()
}

const loadWorkshopStats = async () => {
  const [startDate, endDate] = filter.dateRange
  workshopData.value = await MatchingResultApi.getWorkshopStats({
    startDate, endDate,
    workshop: filter.workshop,
    supplier: filter.supplier
  })
  // 更新车间下拉列表
  const wsList = workshopData.value.map((w: any) => w.workshop)
  if (wsList.length) workshops.value = wsList
  nextTick(() => initWorkshopChart())
}

const loadSupplierStats = async () => {
  const [startDate, endDate] = filter.dateRange
  supplierData.value = await MatchingResultApi.getSupplierStats({
    startDate, endDate,
    workshop: filter.workshop,
    supplier: filter.supplier
  })
  const spList = supplierData.value.map((s: any) => s.supplier)
  if (spList.length) suppliers.value = spList
  nextTick(() => initSupplierChart())
}

const loadMaterialShortage = async () => {
  const [startDate, endDate] = filter.dateRange
  materialData.value = await MatchingResultApi.getMaterialShortage({
    startDate, endDate,
    workshop: filter.workshop,
    supplier: filter.supplier
  })
}

const loadOrderPage = async () => {
  orderLoading.value = true
  try {
    const [startDate, endDate] = filter.dateRange
    const params: any = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      startDate, endDate,
      workshop: filter.workshop,
      supplier: filter.supplier,
      materialCode: filter.materialCode,
      onlyAbnormal: filter.onlyAbnormal
    }
    const res = await MatchingResultApi.getOrderPage(params)
    list.value = res.list.map((item: any) => ({
      ...item,
      _children: null,
      _loading: false
    }))
    total.value = res.total
  } finally {
    orderLoading.value = false
  }
}

const refreshAll = async () => {
  await Promise.all([
    loadOverview(),
    loadWorkshopStats(),
    loadSupplierStats(),
    loadMaterialShortage()
  ])
  queryParams.pageNo = 1
  await loadOrderPage()
}

// ---------- 交互事件 ----------
const handleWorkshopClick = (row: any) => {
  filter.workshop = row.workshop
  filter.supplier = ''
  filter.materialCode = ''
  handleFilter()
}
const handleSupplierClick = (row: any) => {
  filter.workshop = ''
  filter.supplier = row.supplier
  filter.materialCode = ''
  handleFilter()
}
const handleMaterialClick = (row: any) => {
  filter.workshop = ''
  filter.supplier = ''
  filter.materialCode = row.componentCode
  handleFilter()
}
const clearFilters = () => {
  filter.workshop = ''
  filter.supplier = ''
  filter.materialCode = ''
  filter.onlyAbnormal = false
  handleFilter()
}

const onExpand = async (row: any, expandedRows: any[]) => {
  if (!expandedRows.includes(row) || row._children !== null) return
  row._loading = true
  try {
    const children = await MatchingResultApi.getOrderShortages(row.orderNo)
    row._children = children
  } catch {
    row._children = []
  } finally {
    row._loading = false
  }
}

// 获取缺料状态文本
const getShortageStatusText = (row: any) => {
  // 转序已完成时忽略实际缺料，显示齐套
  if (row.transferOrder >= row.quantity) {
    return '齐套';
  }
  return row.shortageCount ? `缺${row.shortageCount}种` : '齐套';
}

// 获取缺料状态标签类型
const getShortageStatusTag = (row: any) => {
  if (row.transferOrder >= row.quantity) {
    return 'success';
  }
  return row.shortageCount ? 'danger' : 'success';
}

const drawerVisible = ref(false)
const drawerTitle = ref('')
const purchaseOrders = ref([])
const purchaseLoading = ref(false)

const showPurchaseDetail = async (part: any, orderNo: string) => {
    drawerTitle.value = `零件: ${part.componentCode} - ${part.componentDesc}`;
    purchaseLoading.value = true;
    try {
        purchaseOrders.value = await MatchingResultApi.getComponentPurchases(part.componentCode, orderNo);
    } finally {
        purchaseLoading.value = false;
    }
    drawerVisible.value = true;
}

// 快捷时间选择
const setQuick = (type: string) => {
  quickType.value = type
  const now = dayjs()
  if (type === 'month') {
    filter.dateRange = [now.startOf('month').format('YYYY-MM-DD'), now.subtract(1, 'day').format('YYYY-MM-DD')]
  } else if (type === 'lastMonth') {
    filter.dateRange = [now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD'), now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD')]
  }
  handleFilter()
}

const handleFilter = () => {
  refreshAll()
}

const resetFilter = () => {
  filter.dateRange = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')]
  filter.workshop = ''
  filter.supplier = ''
  filter.materialCode = ''
  filter.onlyAbnormal = false
  quickType.value = 'month'
  handleFilter()
}

// ---------- 生命周期 ----------
onMounted(() => {
  refreshAll()
})

onBeforeUnmount(() => {
  animationFrames.forEach(id => cancelAnimationFrame(id))
  workshopChart?.dispose()
  supplierChart?.dispose()
})
</script>

<style scoped>
.dashboard-light {
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
.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.kpi-card {
  background: white;
  border: 1px solid #ebeef5;
  border-top: 4px solid;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s;
}
.kpi-card:hover { transform: translateY(-2px); }
.kpi-icon { font-size: 28px; }
.kpi-label { font-size: 14px; color: #909399; margin-bottom: 6px; }
.kpi-value { font-size: 26px; font-weight: bold; }
.kpi-compare { font-size: 12px; margin-top: 4px; }
.trend-up { color: #67c23a; }
.trend-down { color: #f56c6c; }
.analysis-panels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.panel {
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.panel-header { margin-bottom: 12px; }
.panel-title { font-size: 16px; font-weight: 600; }
.panel-subtitle { font-size: 12px; color: #909399; margin-left: 8px; }
.panel-table { margin-top: 12px; }
.detail-section {
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.section-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.section-title { font-size: 18px; font-weight: 600; }
.danger-text { color: #f56c6c; font-weight: bold; }
.warning-text { color: #e6a23c; }
.normal-text { color: #67c23a; }
.expand-hint { color: #909399; padding: 10px; }
.expand-content { padding: 10px 20px; background: #f9fafc; border-radius: 4px; }
.expand-content h4 { margin: 5px 0 10px; color: #303133; }
.expand-loading { color: #909399; padding: 20px; }
</style>
