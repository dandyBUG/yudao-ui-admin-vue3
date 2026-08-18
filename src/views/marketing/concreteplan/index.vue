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
      <el-form-item label="计划编号" prop="planNo">
        <el-input
          v-model="queryParams.planNo"
          placeholder="请输入计划编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="序号" prop="seqNo">
        <el-input
          v-model="queryParams.seqNo"
          placeholder="请输入序号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="米段" prop="meter">
        <el-input
          v-model="queryParams.meter"
          placeholder="请输入米段"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="型号" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入型号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产编号" prop="prodNo">
        <el-input
          v-model="queryParams.prodNo"
          placeholder="请输入生产编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input
          v-model="queryParams.quantity"
          placeholder="请输入数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="结构件编号/环保编码" prop="structSerialNo">
        <el-input
          v-model="queryParams.structSerialNo"
          placeholder="请输入结构件编号/环保编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="出料批次" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="请输入出料批次"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="组单情况" prop="groupStatus">
        <el-select
          v-model="queryParams.groupStatus"
          placeholder="请选择组单情况"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="支腿类型" prop="legType">
        <el-select
          v-model="queryParams.legType"
          placeholder="请选择支腿类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="国家（国内/海外）" prop="countryType">
        <el-select
          v-model="queryParams.countryType"
          placeholder="请选择国家（国内/海外）"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="计划下达时间" prop="planIssueTime">
        <el-date-picker
          v-model="queryParams.planIssueTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="装配上线时间" prop="assemblyStartTime">
        <el-date-picker
          v-model="queryParams.assemblyStartTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="装配下线时间" prop="assemblyEndTime">
        <el-date-picker
          v-model="queryParams.assemblyEndTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="调试下线时间" prop="debugTime">
        <el-date-picker
          v-model="queryParams.debugTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="涂装下线时间" prop="paintingTime">
        <el-date-picker
          v-model="queryParams.paintingTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="入库时间" prop="warehouseTime">
        <el-date-picker
          v-model="queryParams.warehouseTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="营运要求产出月份" prop="outputMonth">
        <el-input
          v-model="queryParams.outputMonth"
          placeholder="请输入营运要求产出月份"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="特殊要求" prop="specialReq">
        <el-input
          v-model="queryParams.specialReq"
          placeholder="请输入特殊要求"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="涂装要求" prop="paintingReq">
        <el-input
          v-model="queryParams.paintingReq"
          placeholder="请输入涂装要求"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="异常说明" prop="exceptionNote">
        <el-input
          v-model="queryParams.exceptionNote"
          placeholder="请输入异常说明"
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
      <el-form-item label="发货要求" prop="deliveryReq">
        <el-input
          v-model="queryParams.deliveryReq"
          placeholder="请输入发货要求"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="工厂" prop="factory">
        <el-input
          v-model="queryParams.factory"
          placeholder="请输入工厂"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input
          v-model="queryParams.customer"
          placeholder="请输入客户"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="修改后车号" prop="modifiedCarNo">
        <el-input
          v-model="queryParams.modifiedCarNo"
          placeholder="请输入修改后车号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
          v-hasPermi="['marketing:concrete-plan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['marketing:concrete-plan:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:concrete-plan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="计划编号" align="center" prop="planNo" width="110px"/>
      <el-table-column label="序号" align="center" prop="seqNo" />
      <el-table-column label="米段" align="center" prop="meter" />
      <el-table-column label="型号" align="center" prop="modelName" />
      <el-table-column label="物料名称" align="center" prop="materialName" width="300px"/>
      <el-table-column label="物料编码" align="center" prop="materialCode" width="170px"/>
      <el-table-column label="生产编号" align="center" prop="prodNo" width="170px"/>
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="结构件编号/环保编码" align="center" prop="structSerialNo" width="130px"/>
      <el-table-column label="订单号" align="center" prop="orderNo" width="120px"/>
      <el-table-column label="出料批次" align="center" prop="batchNo" />
      <el-table-column label="组单情况" align="center" prop="groupStatus" />
      <el-table-column label="支腿类型" align="center" prop="legType" />
      <el-table-column label="国家（国内/海外）" align="center" prop="countryType" />
      <el-table-column label="计划下达时间" align="center" prop="planIssueTime" width="170px"/>
      <el-table-column
        label="装配上线时间"
        align="center"
        prop="assemblyStartTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="装配下线时间"
        align="center"
        prop="assemblyEndTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="调试下线时间"
        align="center"
        prop="debugTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="涂装下线时间"
        align="center"
        prop="paintingTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="入库时间"
        align="center"
        prop="warehouseTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="营运要求产出月份" align="center" prop="outputMonth" />
      <el-table-column label="特殊要求" align="center" prop="specialReq" width="170px"/>
      <el-table-column label="涂装要求" align="center" prop="paintingReq" />
      <el-table-column label="异常说明" align="center" prop="exceptionNote" />
      <el-table-column label="排产时间" align="center" prop="scheduleTime" />
      <el-table-column label="发货要求" align="center" prop="deliveryReq" />
      <el-table-column label="工厂" align="center" prop="factory" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="客户" align="center" prop="customer" />
      <el-table-column label="修改后车号" align="center" prop="modifiedCarNo" />
      <el-table-column label="板块" align="center" prop="plate" width="150px"/>
      <el-table-column
        label="导入时间"
        align="center"
        prop="importTime"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['marketing:concrete-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['marketing:concrete-plan:delete']"
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
  <el-dialog title="导入混凝土计划需求" v-model="importDialogVisible" width="500px">
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
        <div class="el-upload__tip">请上传包含混凝土计划数据的Excel文件，表头格式需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗：添加/修改 -->
  <ConcretePlanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ConcretePlanApi, ConcretePlanVO } from '@/api/marketing/concreteplan'
import ConcretePlanForm from './ConcretePlanForm.vue'
import { ElLoading, ElMessage } from 'element-plus'

/** 混凝土计划需求 列表 */
defineOptions({ name: 'ConcretePlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ConcretePlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  planNo: undefined,
  seqNo: undefined,
  meter: undefined,
  modelName: undefined,
  materialName: undefined,
  materialCode: undefined,
  prodNo: undefined,
  quantity: undefined,
  structSerialNo: undefined,
  orderNo: undefined,
  batchNo: undefined,
  groupStatus: undefined,
  legType: undefined,
  countryType: undefined,
  planIssueTime: [],
  assemblyStartTime: [],
  assemblyEndTime: [],
  debugTime: [],
  paintingTime: [],
  warehouseTime: [],
  outputMonth: undefined,
  specialReq: undefined,
  paintingReq: undefined,
  exceptionNote: undefined,
  scheduleTime: [],
  deliveryReq: undefined,
  factory: undefined,
  status: undefined,
  customer: undefined,
  modifiedCarNo: undefined,
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
    const data = await ConcretePlanApi.getConcretePlanPage(queryParams)
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
    await ConcretePlanApi.deleteConcretePlan(id)
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
    const data = await ConcretePlanApi.exportConcretePlan(queryParams)
    download.excel(data, '混凝土计划需求.xls')
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

// 打开导入对话框
const handleImport = () => {
  importDialogVisible.value = true
}

// 文件选择变化
const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

// 上传前校验
const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件')
    return false
  }
  return true
}

// 下载模板（可暂时提示或实现下载）
const downloadTemplate = () => {
  // 方式1：从后端下载模板
  // window.location.href = '/marketing/concrete-plan/template'
  // 方式2：提示暂无模板
  ElMessage.info('暂无模板，请参考示例 Excel 格式')
}

// 提交导入
const submitImport = async () => {
  if (!importTime.value || !selectedFile.value) {
    ElMessage.warning('请选择导入批次时间和文件');
    return;
  }
  const loading = ElLoading.service({ fullscreen: true, text: '导入中...' });
  try {
    await ConcretePlanApi.importExcel(selectedFile.value, importTime.value);
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
