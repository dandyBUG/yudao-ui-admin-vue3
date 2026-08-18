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
      <el-form-item label="导入日期" prop="importDate">
        <el-date-picker
          v-model="queryParams.importDate"
          type="date"
          placeholder="选择导入日期"
          clearable
          value-format="YYYY-MM-DD"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="车型" prop="vehicleModel">
        <el-input
          v-model="queryParams.vehicleModel"
          placeholder="请输入车型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="2026年顺序号" prop="seqNo2026">
        <el-input
          v-model="queryParams.seqNo2026"
          placeholder="请输入2026年顺序号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="物料号" prop="materialNo">
        <el-input
          v-model="queryParams.materialNo"
          placeholder="请输入物料号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="工厂" prop="factory">
        <el-input
          v-model="queryParams.factory"
          placeholder="请输入工厂"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
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
          v-hasPermi="['buyer:vehicle-config:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['buyer:vehicle-config:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
            type="info"
            plain
            @click="handleDownloadTemplate"
            v-hasPermi="['buyer:vehicle-config:import']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 下载模版
          </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['buyer:vehicle-config:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <input ref="fileInputRef" type="file" accept=".xls,.xlsx" style="display: none" @change="uploadFile" />
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" border>
      <el-table-column label="导入日期" align="center" min-width="100">
        <template #default="scope">
          {{ formatImportDate(scope.row.importDate) }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="150" />
      <el-table-column label="车型" align="center" prop="vehicleModel" min-width="150" />
      <el-table-column label="2025顺序号" align="center" prop="seqNo2025" min-width="120" />
      <el-table-column label="2026顺序号" align="center" prop="seqNo2026" min-width="120" />
      <el-table-column label="要求到货时间" align="center" prop="requiredArrivalTime" min-width="120" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" min-width="200" />
      <el-table-column label="配额1" align="center" prop="quota1" width="100" />
      <el-table-column label="配额2" align="center" prop="quota2" width="100" />
      <el-table-column label="物料号" align="center" prop="materialNo" min-width="150" />
      <el-table-column label="工厂" align="center" prop="factory" width="100" />
      <el-table-column label="需求数量" align="center" prop="requiredQuantity" width="100" />
      <el-table-column label="已交货数量" align="center" prop="deliveredQuantity" width="100" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['buyer:vehicle-config:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['buyer:vehicle-config:delete']"
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
  <VehicleConfigForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { VehicleConfigApi, VehicleConfigVO, VehicleConfigPageReqVO } from '@/api/buyer/vehicleconfig'
import VehicleConfigForm from './VehicleConfigForm.vue'
import { ElLoading } from 'element-plus'

defineOptions({ name: 'VehicleConfig' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<VehicleConfigVO[]>([])
const total = ref(0)
const queryParams = reactive<VehicleConfigPageReqVO>({
  pageNo: 1,
  pageSize: 10,
  orderNo: undefined,
  vehicleModel: undefined,
  seqNo2026: undefined,
  materialNo: undefined,
  factory: undefined,
  importDate: undefined,
  createTime: []
})
const queryFormRef = ref()
const exportLoading = ref(false)
const fileInputRef = ref<HTMLInputElement>()

// 自定义导入日期格式化：将 Date 转为 yyyy-M 格式
const formatImportDate = (date?: Date | string): string => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getList = async () => {
  loading.value = true
  try {
    const data = await VehicleConfigApi.getVehicleConfigPage(queryParams)
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
  queryParams.importDate = undefined
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await VehicleConfigApi.deleteVehicleConfig(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await VehicleConfigApi.exportVehicleConfig(queryParams)
    download.excel(data, '主机车型配置.xls')
  } finally {
    exportLoading.value = false
  }
}

const handleImport = () => {
  fileInputRef.value?.click()
}

const uploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const loadingInstance = ElLoading.service({ fullscreen: true, text: '正在导入...' })
  try {
    const res = await VehicleConfigApi.importVehicleConfig(file)
    message.success(`导入成功，共 ${res} 条`)
    await getList()
  } catch (error: any) {
    console.error('导入失败:', error)
    message.error('导入失败：' + (error.message || ''))
  } finally {
    loadingInstance.close()
    target.value = ''
  }
}
// 下载导入模版
const handleDownloadTemplate = async () => {
  try {
    const blob = await VehicleConfigApi.downloadImportTemplate()
    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '主机车型配置导入模版.xlsx'   // 固定文件名
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载模版失败:', error)
    message.error('下载模版失败，请稍后重试')
  }
}

onMounted(() => {
  getList()
})
</script>
