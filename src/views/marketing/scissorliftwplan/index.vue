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
      <el-form-item label="精准车型" prop="preciseModel">
        <el-input
          v-model="queryParams.preciseModel"
          placeholder="请输入精准车型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品型号" prop="productModel">
        <el-input
          v-model="queryParams.productModel"
          placeholder="请输入产品型号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="精准BOM" prop="preciseBom">
        <el-input
          v-model="queryParams.preciseBom"
          placeholder="请输入精准BOM"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产日期" prop="planDate">
        <el-date-picker
          v-model="queryParams.planDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="周次" prop="weekNo">
        <el-input
          v-model="queryParams.weekNo"
          placeholder="请输入周次"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="周起始日期" prop="weekStartDate">
        <el-date-picker
          v-model="queryParams.weekStartDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="周结束日期" prop="weekEndDate">
        <el-date-picker
          v-model="queryParams.weekEndDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="当日数量" prop="dailyQuantity">
        <el-input
          v-model="queryParams.dailyQuantity"
          placeholder="请输入当日数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="车号范围" prop="carNumberRange">
        <el-input
          v-model="queryParams.carNumberRange"
          placeholder="请输入车号范围"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产线条类型" prop="productionLineType">
        <el-select
          v-model="queryParams.productionLineType"
          placeholder="请选择生产线条类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="板块" prop="plate">
        <el-input
          v-model="queryParams.plate"
          placeholder="请输入板块"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="导入批次时间" prop="importTime">
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
          v-hasPermi="['marketing:scissor-lift-wplan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['marketing:scissor-lift-wplan:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:scissor-lift-wplan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产品线" align="center" prop="productLine" />
      <el-table-column label="精准车型" align="center" prop="preciseModel" width="150px"/>
      <el-table-column label="产品型号" align="center" prop="productModel" />
      <el-table-column label="精准BOM" align="center" prop="preciseBom" width="150px"/>
      <el-table-column
        label="生产日期"
        align="center"
        prop="planDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="周次" align="center" prop="weekNo" />
      <el-table-column
        label="周起始日期"
        align="center"
        prop="weekStartDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="周结束日期"
        align="center"
        prop="weekEndDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="当日数量" align="center" prop="dailyQuantity" />
      <el-table-column label="车号范围" align="center" prop="carNumberRange" />
      <el-table-column label="生产线条类型" align="center" prop="productionLineType" />
      <el-table-column label="板块" align="center" prop="plate" width="100px"/>
      <el-table-column
        label="导入批次时间"
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
            v-hasPermi="['marketing:scissor-lift-wplan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['marketing:scissor-lift-wplan:delete']"
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
  <el-dialog title="导入剪叉周计划" v-model="importDialogVisible" width="500px">
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
        <div class="el-upload__tip">请上传包含周计划数据的Excel文件，表头格式需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗：添加/修改 -->
  <ScissorLiftWplanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ScissorLiftWplanApi, ScissorLiftWplanVO } from '@/api/marketing/scissorliftwplan'
import ScissorLiftWplanForm from './ScissorLiftWplanForm.vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getAccessToken } from '@/utils/auth'

/** 高机剪叉周计划 列表 */
defineOptions({ name: 'ScissorLiftWplan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ScissorLiftWplanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productLine: undefined,
  preciseModel: undefined,
  productModel: undefined,
  preciseBom: undefined,
  planDate: [],
  weekNo: undefined,
  weekStartDate: [],
  weekEndDate: [],
  dailyQuantity: undefined,
  carNumberRange: undefined,
  productionLineType: undefined,
  plate: undefined,
  importTime: [],
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ScissorLiftWplanApi.getScissorLiftWplanPage(queryParams)
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
    await ScissorLiftWplanApi.deleteScissorLiftWplan(id)
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
    const data = await ScissorLiftWplanApi.exportScissorLiftWplan(queryParams)
    download.excel(data, '高机剪叉周计划.xls')
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

const downloadTemplate = () => {
  // 模板文件需放置于 public/template/剪叉周计划模板.xlsx
  window.location.href = '/template/剪叉周计划模板.xlsx'
}

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

const submitImport = async () => {
  if (!importTime.value || !selectedFile.value) {
    ElMessage.warning('请选择导入批次时间和文件');
    return;
  }
  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' });
  try {
    await ScissorLiftWplanApi.importExcel(selectedFile.value, importTime.value);
    ElMessage.success('导入成功');
    importDialogVisible.value = false;
    selectedFile.value = null;
    uploadRef.value?.clearFiles();
    getList();
  } catch (error: any) {
    console.error('导入失败', error);
    ElMessage.error(error.message || '导入失败');
  } finally {
    loading.close();
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
