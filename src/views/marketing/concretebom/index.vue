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
      <el-form-item label="车型（物料编码或车型名称）" prop="vehicleModel">
        <el-input
          v-model="queryParams.vehicleModel"
          placeholder="请输入车型（物料编码或车型名称）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分解油缸（部件名称及路径）" prop="cylinderName">
        <el-input
          v-model="queryParams.cylinderName"
          placeholder="请输入分解油缸（部件名称及路径）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="SBP编码" prop="sbpCode">
        <el-input
          v-model="queryParams.sbpCode"
          placeholder="请输入SBP编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="配置（如数量等）" prop="config">
        <el-input
          v-model="queryParams.config"
          placeholder="请输入配置（如数量等）"
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
          v-hasPermi="['marketing:concrete-bom:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['marketing:concrete-bom:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:concrete-bom:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="info"
          plain
          @click="openCompareDialog"
          v-hasPermi="['marketing:concrete-bom:compare']"
        >
          <Icon icon="ep:data-line" class="mr-5px" /> 差异对比
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="车型（物料编码或车型名称）" align="center" prop="vehicleModel" />
      <el-table-column label="分解油缸（部件名称及路径）" align="center" prop="cylinderName" />
      <el-table-column label="SBP编码" align="center" prop="sbpCode" />
      <el-table-column label="配置（如数量等）" align="center" prop="config" />
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
            v-hasPermi="['marketing:concrete-bom:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['marketing:concrete-bom:delete']"
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
  <el-dialog title="导入混凝土BOM" v-model="importDialogVisible" width="500px">
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
        <div class="el-upload__tip">请上传包含车型、分解油缸、SBP编码、配置的Excel文件，表头需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 差异对比对话框 -->
  <el-dialog title="混凝土BOM差异对比（最新批次 vs 上一批次）" v-model="compareDialogVisible" width="85%">
    <!-- 工具栏 -->
    <div class="mb-15px flex justify-between">
      <el-input
        v-model="compareSearchKeyword"
        placeholder="请输入车型或SBP编码"
        clearable
        style="width: 260px"
        @input="handleCompareSearch"
      >
        <template #prefix>
          <Icon icon="ep:search" />
        </template>
      </el-input>
      <el-button type="success" plain @click="exportCompareExcel" :loading="compareExportLoading">
        <Icon icon="ep:download" class="mr-5px" /> 导出对比结果
      </el-button>
    </div>

    <el-table v-loading="compareLoading" :data="filteredCompareList" border stripe>
      <el-table-column label="车型" prop="vehicleModel" min-width="180" show-overflow-tooltip />
      <el-table-column label="SBP编码" prop="sbpCode" min-width="150" show-overflow-tooltip />
      <el-table-column label="当前配置" prop="currentConfig" min-width="100" />
      <el-table-column label="上一配置" prop="previousConfig" min-width="100" />
      <el-table-column label="差异状态" prop="state" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getStateTagType(row.state)">{{ row.state }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="compareDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗：添加/修改 -->
  <ConcreteBomForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ConcreteBomApi, ConcreteBomVO } from '@/api/marketing/concretebom'
import ConcreteBomForm from './ConcreteBomForm.vue'
import { getAccessToken } from '@/utils/auth'
import { ElLoading, ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'

/** 混凝土BOM 列表 */
defineOptions({ name: 'ConcreteBom' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ConcreteBomVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  vehicleModel: undefined,
  cylinderName: undefined,
  sbpCode: undefined,
  config: undefined,
  importTime: [],
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const importDialogVisible = ref(false)
const importTime = ref('')
const uploadRef = ref()
const selectedFile = ref<File | null>(null)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ConcreteBomApi.getConcreteBomPage(queryParams)
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
    await ConcreteBomApi.deleteConcreteBom(id)
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
    const data = await ConcreteBomApi.exportConcreteBom(queryParams)
    download.excel(data, '混凝土BOM.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
const downloadTemplate = () => {
  // 方式1：使用静态文件（需将模板文件放到 public 目录）
  window.location.href = '/template/混凝土BOM模板.xlsx'
  // 方式2：调用后端接口动态生成（若有）
  // window.location.href = '/marketing/concrete-bom/template'
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
const handleImport = () => {
  importDialogVisible.value = true
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

  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' })
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('importTime', importTime.value)

    const baseURL = import.meta.env.VITE_BASE_URL
    const url = `${baseURL}/admin-api/marketing/concrete-bom/import`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAccessToken()}` },
      body: formData
    })
    const result = await response.json()
    if (result.code === 0) {
      ElMessage.success('导入成功')
      importDialogVisible.value = false
      selectedFile.value = null
      uploadRef.value?.clearFiles()
      getList() // 刷新列表
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

// 差异对比相关
const compareDialogVisible = ref(false)
const compareLoading = ref(false)
const compareList = ref<any[]>([])
const compareSearchKeyword = ref('')
const compareExportLoading = ref(false)

// 筛选后的数据
const filteredCompareList = computed(() => {
  if (!compareSearchKeyword.value) return compareList.value
  const keyword = compareSearchKeyword.value.toLowerCase()
  return compareList.value.filter(item =>
    item.vehicleModel?.toLowerCase().includes(keyword) ||
    item.sbpCode?.toLowerCase().includes(keyword)
  )
})

// 处理搜索输入
const handleCompareSearch = () => {
  // computed 自动响应，无需额外代码
}

// 打开对比对话框
const openCompareDialog = async () => {
  compareDialogVisible.value = true
  compareLoading.value = true
  compareSearchKeyword.value = ''  // 清空搜索关键词
  try {
    const data = await ConcreteBomApi.compareDifference()
    compareList.value = data
  } catch (error) {
    console.error('获取对比数据失败', error)
    ElMessage.error('获取对比数据失败')
  } finally {
    compareLoading.value = false
  }
}

// 导出对比结果 Excel
const exportCompareExcel = async () => {
  if (!compareList.value.length) {
    ElMessage.warning('没有数据可导出')
    return
  }
  compareExportLoading.value = true
  try {
    // 准备导出数据（当前筛选后的数据）
    const exportData = filteredCompareList.value.map(item => ({
      '车型': item.vehicleModel,
      'SBP编码': item.sbpCode,
      '当前配置': item.currentConfig,
      '上一配置': item.previousConfig,
      '差异状态': item.state
    }))

    // 创建工作簿和工作表
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '差异对比')

    // 下载文件
    XLSX.writeFile(wb, `混凝土BOM差异对比_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
    ElMessage.error('导出失败')
  } finally {
    compareExportLoading.value = false
  }
}

// 根据状态返回标签类型
const getStateTagType = (state: string) => {
  switch (state) {
    case '无差异': return 'success'
    case '新增': return 'primary'
    case '存在差异': return 'danger'
    default: return 'info'
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
