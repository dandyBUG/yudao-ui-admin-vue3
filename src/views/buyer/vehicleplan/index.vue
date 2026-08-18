<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >

      <el-form-item label="产品线" prop="productLine">
        <el-input
          v-model="queryParams.productLine"
          placeholder="请输入产品线"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品机型" prop="productModel">
        <el-input
          v-model="queryParams.productModel"
          clearable
          placeholder="请输入产品机型"
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="车型代码" prop="vehicleCode">
        <el-input
          v-model="queryParams.vehicleCode"
          placeholder="请输入车型代码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="2025年度顺序号/车号" prop="seqNo2025">
        <el-input
          v-model="queryParams.seqNo2025"
          placeholder="请输入2025年度顺序号/车号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="2026年度顺序号/车号" prop="seqNo2026">
        <el-input
          v-model="queryParams.seqNo2026"
          placeholder="请输入2026年度顺序号/车号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="裸机订单号" prop="bareMachineOrderNo">
        <el-input
          v-model="queryParams.bareMachineOrderNo"
          placeholder="请输入裸机订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="行驶单元订单号" prop="drivingUnitOrderNo">
        <el-input
          v-model="queryParams.drivingUnitOrderNo"
          placeholder="请输入行驶单元订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="内外贸（内贸/外贸）" prop="tradeType">
        <el-select
          v-model="queryParams.tradeType"
          placeholder="请选择内外贸（内贸/外贸）"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="台份数量" prop="unitQuantity">
        <el-input
          v-model="queryParams.unitQuantity"
          placeholder="请输入台份数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="底盘上线计划日期" prop="chassisOnlinePlanDate">
        <el-date-picker
          v-model="queryParams.chassisOnlinePlanDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="成台完工计划日期" prop="finishedProductPlanDate">
        <el-date-picker
          v-model="queryParams.finishedProductPlanDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
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
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['buyer:vehicle-plan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['buyer:vehicle-plan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
          <!-- 新增下载模版按钮 -->
          <el-button
            type="info"
            plain
            @click="handleDownloadTemplate"
            v-hasPermi="['buyer:vehicle-plan:import']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 下载模版
          </el-button>
          <!-- 导入按钮，使用 warning 类型 -->
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['buyer:vehicle-plan:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <!-- 隐藏的文件输入框 -->
        <input ref="fileInputRef" type="file" accept=".xls,.xlsx" style="display: none" @change="uploadFile" />
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
     <el-table-column label="导入日期" align="center" width="120px">
       <template #default="scope">
         {{ formatDate(scope.row.importDate) }}
       </template>
     </el-table-column>
      <el-table-column label="产品线" align="center" prop="productLine" />
      <el-table-column label="产品机型" align="center" prop="productModel" />
      <el-table-column label="车型代码" align="center" prop="vehicleCode" />
      <el-table-column label="2025年度顺序号/车号" align="center" prop="seqNo2025" />
      <el-table-column label="2026年度顺序号/车号" align="center" prop="seqNo2026" />
      <el-table-column label="VIN" align="center" prop="vin" />
      <el-table-column label="裸机订单号" align="center" prop="bareMachineOrderNo" />
      <el-table-column label="行驶单元订单号" align="center" prop="drivingUnitOrderNo" />
      <el-table-column label="内外贸（内贸/外贸）" align="center" prop="tradeType" />
      <el-table-column label="台份数量" align="center" prop="unitQuantity" />
      <el-table-column label="下料完工计划" align="center" prop="blankingPlanDate" width="140px" />
      <el-table-column label="吊臂板/中吨位支腿完工计划" align="center" prop="boomLegPlanDate" width="180px" />
      <el-table-column label="吊臂或主臂顶底完工计划" align="center" prop="boomTopBottomPlanDate"  width="180px" />
      <el-table-column label="转台结构件完工计划" align="center" prop="turntablePlanDate"  width="150px" />
      <el-table-column label="车架结构件完工计划" align="center" prop="framePlanDate"  width="150px" />
      <el-table-column
        label="底盘上线计划日期"
        align="center"
        prop="chassisOnlinePlanDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="成台完工计划日期"
        align="center"
        prop="finishedProductPlanDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['buyer:vehicle-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['buyer:vehicle-plan:delete']"
          >
            删除
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <VehiclePlanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { VehiclePlanApi, VehiclePlanVO } from '@/api/buyer/vehicleplan'
import VehiclePlanForm from './VehiclePlanForm.vue'
import { ElLoading } from 'element-plus'  // 需要引入 ElLoading

/** 买家车辆营销计划表（主机厂计划） 列表 */
defineOptions({ name: 'VehiclePlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<VehiclePlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  displaySeq: undefined,
  productLine: undefined,
  productModel: undefined,
  vehicleCode: undefined,
  seqNo2025: undefined,
  seqNo2026: undefined,
  bareMachineOrderNo: undefined,
  drivingUnitOrderNo: undefined,
  tradeType: undefined,
  unitQuantity: undefined,
  chassisOnlinePlanDate: [],
  finishedProductPlanDate: [],
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
// 响应式变量
const fileInputRef = ref<HTMLInputElement>() // 文件输入引用

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await VehiclePlanApi.getVehiclePlanPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await VehiclePlanApi.deleteVehiclePlan(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await VehiclePlanApi.exportVehiclePlan(queryParams)
    download.excel(data, '主机车辆营销计划表（主机厂计划）.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
/** 导入按钮操作：触发文件选择 */
const handleImport = () => {
  fileInputRef.value?.click()
}

/** 上传文件 */
const uploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 显示加载提示
  const loadingInstance = ElLoading.service({ fullscreen: true, text: '正在导入...' })
  try {
    const res = await VehiclePlanApi.importVehiclePlan(file)
    message.success(`导入成功，共 ${res} 条`)
    await getList() // 刷新列表
  } catch (error: any) {
    console.error('导入失败:', error)
    message.error('导入失败：' + (error.message || ''))
  } finally {
    loadingInstance.close()
    target.value = '' // 清空输入，允许再次选择同一文件
  }
}

// 下载导入模版
const handleDownloadTemplate = async () => {
  try {
    const blob = await VehiclePlanApi.downloadImportTemplate()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '主机计划导入模板.xlsx'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载模版失败:', error)
    message.error('下载模版失败，请稍后重试')
  }
}

const formatDate = (date: any) => {
  if (!date) return ''
  if (typeof date === 'string') return date
  // 如果是 Date 对象
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}


/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
