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
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料编号" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="装配数量（计划数）" prop="assemblyQuantity">
        <el-input
          v-model="queryParams.assemblyQuantity"
          placeholder="请输入装配数量（计划数）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="已装配数量（完成数）" prop="assembledQuantity">
        <el-input
          v-model="queryParams.assembledQuantity"
          placeholder="请输入已装配数量（完成数）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="排产时间" prop="scheduleTime">
        <el-date-picker
          v-model="queryParams.scheduleTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入车间"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="导入时间" prop="importTime">
        <el-date-picker
          v-model="queryParams.importTime"
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
          v-hasPermi="['aps:assembly-plan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['aps:assembly-plan:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:assembly-plan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="物料编号" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" />
      <el-table-column label="装配数量（计划数）" align="center" prop="assemblyQuantity" />
      <el-table-column label="已装配数量（完成数）" align="center" prop="assembledQuantity" />
      <el-table-column
        label="排产时间"
        align="center"
        prop="scheduleTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="车间" align="center" prop="workshop" />
      <el-table-column
        label="导入时间"
        align="center"
        prop="importTime"
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
            v-hasPermi="['aps:assembly-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['aps:assembly-plan:delete']"
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

<!-- 导入对话框 -->
<el-dialog title="导入各车间开装计划" v-model="importDialogVisible" width="500px">
  <el-form label-width="100px">
    <el-form-item label="导入批次时间" required>
      <el-date-picker
        v-model="importTime"
        type="date"
        placeholder="选择导入日期"
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
      <div class="el-upload__tip">请上传包含开装计划数据的Excel文件，表头格式需与模板一致。</div>
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button @click="importDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="submitImport">开始导入</el-button>
  </template>
</el-dialog>
  <!-- 表单弹窗：添加/修改 -->
  <AssemblyPlanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AssemblyPlanApi, AssemblyPlanVO } from '@/api/aps/assemblyplan'
import AssemblyPlanForm from './AssemblyPlanForm.vue'

/** 各车间开装计划 列表 */
defineOptions({ name: 'AssemblyPlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AssemblyPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNo: undefined,
  materialCode: undefined,
  materialDesc: undefined,
  assemblyQuantity: undefined,
  assembledQuantity: undefined,
  scheduleTime: [],
  workshop: undefined,
  importTime: [],
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AssemblyPlanApi.getAssemblyPlanPage(queryParams)
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
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AssemblyPlanApi.deleteAssemblyPlan(id)
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
    const data = await AssemblyPlanApi.exportAssemblyPlan(queryParams)
    download.excel(data, '各车间开装计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 导入相关
const importDialogVisible = ref(false)
const importTime = ref('')
const uploadRef = ref()
const selectedFile = ref<File | null>(null)

const handleImport = () => {
  importDialogVisible.value = true
}

const downloadTemplate = () => {
  AssemblyPlanApi.downloadTemplate()
}

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.ms-excel' ||
                  file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件')
    return false
  }
  return true
}

const submitImport = async () => {
  if (!importTime.value || !selectedFile.value) {
    ElMessage.warning('请选择导入批次时间和文件')
    return
  }
  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' })
  try {
    await AssemblyPlanApi.importExcel(selectedFile.value, importTime.value)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
    selectedFile.value = null
    uploadRef.value?.clearFiles()
    getList() // 刷新列表
  } catch (error: any) {
    console.error('导入失败', error)
    ElMessage.error(error.message || '导入失败')
  } finally {
    loading.close()
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
