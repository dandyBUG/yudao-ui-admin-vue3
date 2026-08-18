<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="订单编号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="售达方" prop="soldToParty">
        <el-input
          v-model="queryParams.soldToParty"
          placeholder="请输入售达方编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="销售组织" prop="salesOrganization">
        <el-input
          v-model="queryParams.salesOrganization"
          placeholder="请输入销售组织"
          clearable
          @keyup.enter="handleQuery"
          class="!w-160px"
        />
      </el-form-item>
      <el-form-item label="交货状态" prop="deliveryStatus">
        <el-input
          v-model="queryParams.deliveryStatus"
          placeholder="请输入交货状态"
          clearable
          @keyup.enter="handleQuery"
          class="!w-160px"
        />
      </el-form-item>
      <el-form-item label="订单日期" prop="orderDate">
        <el-date-picker
          v-model="queryParams.orderDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="最早交货" prop="earliestDeliveryDate">
        <el-date-picker
          v-model="queryParams.earliestDeliveryDate"
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
          v-hasPermi="['marketing:sales-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['marketing:sales-order:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:sales-order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="订单编号" align="center" prop="orderNumber" width="150" />
      <el-table-column label="行项目" align="center" prop="orderItem" width="80" />
      <el-table-column label="物料编码" align="center" prop="materialCode" width="160" />
      <el-table-column label="物料描述" align="center" prop="materialDescription" min-width="160" />
      <el-table-column label="订单数量" align="center" prop="orderQuantity" width="100" />
      <el-table-column label="已交货" align="center" prop="deliveredQuantity" width="100" />
      <el-table-column label="交货状态" align="center" prop="deliveryStatus" width="120" />
      <el-table-column label="订单日期" align="center" prop="orderDate" :formatter="dateFormatter" width="120" />
      <el-table-column label="最早交货" align="center" prop="earliestDeliveryDate" :formatter="dateFormatter" width="120" />
      <el-table-column label="操作" align="center" min-width="120" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)" v-hasPermi="['marketing:sales-order:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['marketing:sales-order:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList" />
  </ContentWrap>

  <!-- 导入对话框 -->
  <el-dialog title="导入销售订单" v-model="importDialogVisible" width="500px">
    <el-form label-width="100px">
      <el-form-item label="Excel文件">
        <div style="display: flex; gap: 10px;">
          <el-upload
            ref="uploadRef"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
            :auto-upload="false"
            :limit="1"
            accept=".xls,.xlsx"
          >
            <el-button type="primary">选择文件</el-button>
          </el-upload>
          <el-button type="info" plain @click="downloadTemplate">下载模板</el-button>
        </div>
        <div class="el-upload__tip">请上传包含销售订单数据的Excel文件，表头格式需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗 -->
  <SalesOrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { SalesOrderApi, SalesOrderVO } from '@/api/marketing/salesorder'
import SalesOrderForm from './SalesOrderForm.vue'
import { ElLoading, ElMessage } from 'element-plus'

defineOptions({ name: 'SalesOrder' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<SalesOrderVO[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNumber: undefined,
  materialCode: undefined,
  soldToParty: undefined,
  salesOrganization: undefined,
  deliveryStatus: undefined,
  orderDate: [],
  earliestDeliveryDate: [],
})
const queryFormRef = ref()
const exportLoading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const data = await SalesOrderApi.getSalesOrderPage(queryParams)
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
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await SalesOrderApi.deleteSalesOrder(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await SalesOrderApi.exportSalesOrder(queryParams)
    download.excel(data, '销售订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 导入相关
const importDialogVisible = ref(false)
const uploadRef = ref()
const selectedFile = ref<File | null>(null)

const handleImport = () => {
  importDialogVisible.value = true
}

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件')
    return false
  }
  return true
}

const downloadTemplate = () => {
  window.location.href = '/template/销售订单模板.xlsx'
}

const submitImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }
  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' })
  try {
    await SalesOrderApi.importExcel(selectedFile.value)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    selectedFile.value = null
    uploadRef.value?.clearFiles()
    getList()
  } catch (error: any) {
    console.error('导入失败', error)
    ElMessage.error(error.message || '导入失败')
  } finally {
    loading.close()
  }
}

onMounted(() => {
  getList()
})
</script>
