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
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="采购物料" prop="purchaseMaterial">
        <el-input
          v-model="queryParams.purchaseMaterial"
          placeholder="请输入采购物料"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
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
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="反馈备注" prop="feedbackRemark">
        <el-input
          v-model="queryParams.feedbackRemark"
          placeholder="请输入反馈备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['aps:purchase-feedback:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- 导入按钮 -->
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['aps:purchase-feedback:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <!-- 导出按钮 -->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:purchase-feedback:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="ID" align="center" prop="id" width="100px" />
      <el-table-column label="订单号" align="center" prop="orderNo" min-width="150px" />
      <el-table-column
        label="排产时间"
        align="center"
        prop="scheduleTime"
        :formatter="dateOnlyFormatter"
        width="180px"
      />
      <el-table-column label="采购物料" align="center" prop="purchaseMaterial" min-width="150px" />
      <el-table-column label="反馈备注" align="center" prop="feedbackRemark" min-width="200px" />
      <el-table-column label="操作" align="center" width="160px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['aps:purchase-feedback:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['aps:purchase-feedback:delete']"
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

  <!-- 表单弹窗 -->
  <PurchaseFeedbackForm ref="formRef" @success="getList" />

  <!-- 导入弹窗（放在外面，避免嵌套问题） -->
  <el-dialog v-model="importDialogVisible" title="导入采购反馈" width="500px">
    <el-upload
      ref="uploadRef"
      accept=".xlsx,.xls"
      :auto-upload="false"
      :limit="1"
      :on-change="handleFileChange"
      :on-exceed="handleExceed"
      drag
    >
      <Icon icon="ep:upload" class="text-3xl text-gray-400" />
      <div class="el-upload__text">
        将文件拖到此处，或 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip text-sm text-gray-400">
          仅支持 .xlsx, .xls 格式，请使用 <el-link type="primary" @click="downloadTemplate">下载模板</el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="importDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitImport" :loading="importLoading">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { PurchaseFeedbackApi, PurchaseFeedbackVO } from '@/api/aps/purchasefeedback'
import PurchaseFeedbackForm from './PurchaseFeedbackForm.vue'
import download from '@/utils/download'
import dayjs from 'dayjs'

defineOptions({ name: 'PurchaseFeedback' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(false)
const list = ref<PurchaseFeedbackVO[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNo: '',
  purchaseMaterial: '',
  feedbackRemark: '',
  scheduleTime: [],
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseFeedbackApi.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.scheduleTime = []
  handleQuery()
}

/** 打开表单弹窗 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await PurchaseFeedbackApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 导出 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await PurchaseFeedbackApi.export(queryParams)
    download.excel(data, '采购反馈.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 日期格式化（仅日期） */
const dateOnlyFormatter = (row: any, column: any, cellValue: any) => {
  if (!cellValue) return ''
  return dayjs(cellValue).format('YYYY-MM-DD')
}

// 导入相关
const importDialogVisible = ref(false)
const importLoading = ref(false)
const uploadRef = ref()
const importFile = ref<File>()

/** 导入按钮操作 */
const handleImport = () => {
  importDialogVisible.value = true
  // 重置上传组件
  setTimeout(() => {
    uploadRef.value?.clearFiles()
    importFile.value = undefined
  }, 0)
}

/** 文件选择变化 */
const handleFileChange = (file: any) => {
  importFile.value = file.raw
}

/** 文件数量超出限制 */
const handleExceed = () => {
  message.warning('最多只能上传一个文件，请先移除当前文件')
}

/** 下载导入模板 */
const downloadTemplate = () => {
  // 静态模板（需放在 public/templates 目录）
  window.location.href = '/templates/采购反馈表模板.xlsx'
}

/** 提交导入 */
const submitImport = async () => {
  if (!importFile.value) {
    message.warning('请先选择文件')
    return
  }
  importLoading.value = true
  try {
    const res = await PurchaseFeedbackApi.import(importFile.value)
    const count = res.data
    message.success(`导入成功，共导入 ${count} 条数据`)
    importDialogVisible.value = false
    // 刷新列表
    await getList()
  } catch (e) {
    // 错误已由拦截器处理
  } finally {
    importLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>
