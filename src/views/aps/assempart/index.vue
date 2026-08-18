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
      <el-form-item label="总成订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入总成订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总成数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入总成数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="零部件订单号" prop="componentOrder">
        <el-input
          v-model="queryParams.componentOrder"
          placeholder="请输入零部件订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="零部件数量" prop="allocQty">
        <el-input
          v-model="queryParams.allocQty"
          placeholder="请输入零部件数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          v-hasPermi="['aps:assem-part:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- 新增：导入按钮 -->
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['aps:assem-part:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:assem-part:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="总成订单号" align="center" prop="orderNo" />
      <el-table-column label="总成数量" align="center" prop="quantity" />
      <el-table-column label="零部件订单号" align="center" prop="componentOrder" />
      <el-table-column label="零部件数量" align="center" prop="allocQty" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['aps:assem-part:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['aps:assem-part:delete']"
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
  <AssemPartForm ref="formRef" @success="getList" />

  <!-- 新增：导入对话框 -->
  <el-dialog title="导入总成子件数据" v-model="importDialogVisible" width="500px">
    <el-form label-width="100px">
      <el-form-item label="导入时间">
        <el-date-picker
          v-model="importTime"
          type="date"
          placeholder="选择导入日期（可选）"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
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
        <div class="el-upload__tip">请上传包含总成与子件关联数据的Excel文件，表头格式需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AssemPartApi, AssemPartVO } from '@/api/aps/assempart'
import AssemPartForm from './AssemPartForm.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getAccessToken } from '@/utils/auth'


/** 总成与子件关联表管理 列表 */
defineOptions({ name: 'AssemPart' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AssemPartVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNo: undefined,
  quantity: undefined,
  componentOrder: undefined,
  allocQty: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AssemPartApi.getAssemPartPage(queryParams)
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
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await AssemPartApi.deleteAssemPart(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await AssemPartApi.exportAssemPart(queryParams)
    download.excel(data, '总成与子件关联表管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// ========== 新增：导入相关 ==========
const importDialogVisible = ref(false)
const importTime = ref('')
const uploadRef = ref()
const selectedFile = ref<File | null>(null)

const handleImport = () => {
  importDialogVisible.value = true
  // 导入时间默认为空，可手动选择
  importTime.value = ''
}

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件')
    return false
  }
  return true
}

const downloadTemplate = () => {
  window.location.href = '/template/总成自制对照表模板.xlsx'
}

const submitImport = async () => {
  if (!importTime.value) {
    ElMessage.warning('请选择导入批次时间')
    return
  }
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  // 如果后端需要 importTime 参数，可取消下一行注释
  // formData.append('importTime', importTime.value)

  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' })
  try {
    const baseURL = import.meta.env.VITE_BASE_URL
    const url = `${baseURL}/admin-api/aps/assem-part/import-excel`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
        // 不要手动写 Content-Type，fetch 会自动生成 multipart/form-data + boundary
      },
      body: formData
    })
    const result = await response.json()
    if (result.code === 0) {
      ElMessage.success(`导入成功，共 ${result.data} 条`)
      importDialogVisible.value = false
      selectedFile.value = null
      uploadRef.value?.clearFiles()
      getList()
    } else {
      ElMessage.error(result.msg || '导入失败')
    }
  } catch (error: any) {
    console.error('导入失败', error)
    ElMessage.error(error.message || '导入失败，请检查网络或文件格式')
  } finally {
    loading.close()
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
