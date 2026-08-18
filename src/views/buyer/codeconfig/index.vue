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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="主机编码" prop="hostCode">
        <el-input
          v-model="queryParams.hostCode"
          placeholder="请输入主机编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="特力编码" prop="teliCode">
        <el-input
          v-model="queryParams.teliCode"
          placeholder="请输入特力编码"
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
          v-hasPermi="['buyer:code-config:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['buyer:code-config:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
         <!-- 新增下载模版按钮 -->
        <el-button
          type="info"
          plain
          @click="handleDownloadTemplate"
          v-hasPermi="['buyer:code-config:import']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 下载模版
        </el-button>
        <!-- 导入按钮，使用 warning 类型 -->
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['buyer:code-config:import']"
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
      <el-table-column label="主键ID（雪花算法）" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="主机编码" align="center" prop="hostCode" />
      <el-table-column label="特力编码" align="center" prop="teliCode" />
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
            v-hasPermi="['buyer:code-config:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['buyer:code-config:delete']"
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
  <CodeConfigForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CodeConfigApi, CodeConfigVO } from '@/api/buyer/codeconfig'
import CodeConfigForm from './CodeConfigForm.vue'
import { ElLoading } from 'element-plus'


/** 主机编码配置 列表 */
defineOptions({ name: 'CodeConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CodeConfigVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  hostCode: undefined,
  teliCode: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

// 新增响应式变量
const fileInputRef = ref<HTMLInputElement>() // 文件输入引用

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CodeConfigApi.getCodeConfigPage(queryParams)
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
    await CodeConfigApi.deleteCodeConfig(id)
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
    const data = await CodeConfigApi.exportCodeConfig(queryParams)
    download.excel(data, '主机编码配置.xls')
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
    const res = await CodeConfigApi.importCodeConfig(file)
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
    const blob = await CodeConfigApi.downloadImportTemplate()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '主机编码对照导入模板.xlsx'   // 固定文件名
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载模版失败:', error)
    message.error('下载模版失败，请稍后重试')
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
