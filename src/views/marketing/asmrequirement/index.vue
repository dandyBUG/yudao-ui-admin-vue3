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
      <!-- 新增：主机单位 -->
      <el-form-item label="主机单位" prop="hostUnit">
        <el-input
          v-model="queryParams.hostUnit"
          placeholder="请输入主机单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-160px"
        />
      </el-form-item>
      <!-- 新增：车型 -->
      <el-form-item label="车型" prop="vehicleModel">
        <el-input
          v-model="queryParams.vehicleModel"
          placeholder="请输入车型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-160px"
        />
      </el-form-item>
      <el-form-item label="总成物料编码" prop="assemblyMaterialNo">
        <el-input
          v-model="queryParams.assemblyMaterialNo"
          placeholder="请输入总成物料编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="总成物料名称" prop="mainMaterialDesc">
        <el-input
          v-model="queryParams.mainMaterialDesc"
          placeholder="请输入总成物料名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-180px"
        />
      </el-form-item>
      <el-form-item label="需求日期" prop="requireDate">
        <el-date-picker
          v-model="queryParams.requireDate"
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
          v-hasPermi="['marketing:asm-requirement:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['marketing:asm-requirement:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:asm-requirement:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键ID" align="center" prop="id" width="100" />
      <!-- 新增：主机单位 -->
      <el-table-column label="主机单位" align="center" prop="hostUnit" width="120" />
      <!-- 新增：车型 -->
      <el-table-column label="车型" align="center" prop="vehicleModel" width="120" />
      <el-table-column label="总成物料编码" align="center" prop="assemblyMaterialNo" width="180" />
      <el-table-column label="总成物料名称" align="center" prop="mainMaterialDesc" min-width="160" />
      <el-table-column label="需求数量" align="center" prop="requireQuantity" width="100" />
      <el-table-column
        label="需求日期"
        align="center"
        prop="requireDate"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="操作" align="center" min-width="120" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['marketing:asm-requirement:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['marketing:asm-requirement:delete']"
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

  <!-- 导入对话框（不变） -->
  <el-dialog title="导入营销总成需求" v-model="importDialogVisible" width="500px">
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
        <div class="el-upload__tip">请上传包含总成需求数据的Excel文件，表头格式需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗 -->
  <AsmRequirementForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AsmRequirementApi, AsmRequirementVO } from '@/api/marketing/asmrequirement'
import AsmRequirementForm from './AsmRequirementForm.vue'
import { ElLoading } from 'element-plus'

defineOptions({ name: 'AsmRequirement' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<AsmRequirementVO[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  hostUnit: undefined,          // 新增
  vehicleModel: undefined,      // 新增
  assemblyMaterialNo: undefined,
  mainMaterialDesc: undefined,
  requireQuantity: undefined,
  requireDate: [],
  createTime: [],
})
const queryFormRef = ref()
const exportLoading = ref(false)

const getList = async () => {
  loading.value = true
  try {
    const data = await AsmRequirementApi.getAsmRequirementPage(queryParams)
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
    await AsmRequirementApi.deleteAsmRequirement(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await AsmRequirementApi.exportAsmRequirement(queryParams)
    download.excel(data, '营销总成需求.xls')
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
  window.location.href = '/template/营销总成需求模板.xlsx'
}

const submitImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }
  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' })
  try {
    await AsmRequirementApi.importExcel(selectedFile.value)
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
