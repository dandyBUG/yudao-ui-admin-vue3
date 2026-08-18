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
      <el-form-item label="物料编码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编码"
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
      <el-form-item label="供应商" prop="supplier">
        <el-input
          v-model="queryParams.supplier"
          placeholder="请输入供应商"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="JIT标识（1表示JIT物料）" prop="jitFlag">
        <el-input
          v-model="queryParams.jitFlag"
          placeholder="请输入JIT标识（1表示JIT物料）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否颜色管理（X表示是）" prop="colorManagement">
        <el-input
          v-model="queryParams.colorManagement"
          placeholder="请输入是否颜色管理（X表示是）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否按需供货（X表示是）" prop="supplyOnDemand">
        <el-input
          v-model="queryParams.supplyOnDemand"
          placeholder="请输入是否按需供货（X表示是）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="适配机型（多机型逗号分隔）" prop="applicableModel">
        <el-input
          v-model="queryParams.applicableModel"
          placeholder="请输入适配机型（多机型逗号分隔）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品型号（如ZA10RJE）" prop="productModel">
        <el-input
          v-model="queryParams.productModel"
          placeholder="请输入产品型号（如ZA10RJE）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="精准BOM（如ZA10RJE-001）" prop="preciseBom">
        <el-input
          v-model="queryParams.preciseBom"
          placeholder="请输入精准BOM（如ZA10RJE-001）"
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
      <el-form-item label="物料来源分类（臂式专用物料/剪叉专用物料/剪叉和臂式共用物料/走车物资及选配件）" prop="sourceCategory">
        <el-input
          v-model="queryParams.sourceCategory"
          placeholder="请输入物料来源分类（臂式专用物料/剪叉专用物料/剪叉和臂式共用物料/走车物资及选配件）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="板块（默认高机）" prop="plate">
        <el-input
          v-model="queryParams.plate"
          placeholder="请输入板块（默认高机）"
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
          v-hasPermi="['marketing:aerial-boom-bom:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['marketing:aerial-boom-bom:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:aerial-boom-bom:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料编码" align="center" prop="materialCode" width="200px"/>
      <el-table-column label="物料描述" align="center" prop="materialDesc" width="400px"/>
      <el-table-column label="供应商" align="center" prop="supplier" width="200px"/>
      <el-table-column label="JIT标识（1表示JIT物料）" align="center" prop="jitFlag" />
      <el-table-column label="是否颜色管理（X表示是）" align="center" prop="colorManagement" />
      <el-table-column label="是否按需供货（X表示是）" align="center" prop="supplyOnDemand" />
      <el-table-column label="适配机型（多机型逗号分隔）" align="center" prop="applicableModel" width="300px"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="产品型号" align="center" prop="productModel" width="240px"/>
      <el-table-column label="精准BOM" align="center" prop="preciseBom" width="240px"/>
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="物料来源分类" align="center" prop="sourceCategory" /><!--（臂式专用物料/剪叉专用物料/剪叉和臂式共用物料/走车物资及选配件）-->
      <el-table-column label="板块" align="center" prop="plate" />
      <el-table-column
        label="导入批次时间"
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
            v-hasPermi="['marketing:aerial-boom-bom:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['marketing:aerial-boom-bom:delete']"
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
  <el-dialog title="导入BOM物料清单" v-model="importDialogVisible" width="500px">
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
        <div class="el-upload__tip">请上传包含BOM物料清单的Excel文件，表头格式需与模板一致。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="importDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitImport">开始导入</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗：添加/修改 -->
  <AerialBoomBomForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AerialBoomBomApi, AerialBoomBomVO } from '@/api/marketing/aerialboombom'
import AerialBoomBomForm from './AerialBoomBomForm.vue'
import { ElLoading, ElMessage } from 'element-plus'
import { getAccessToken } from '@/utils/auth'


/** 高机臂式/剪叉BOM物料清单 列表 */
defineOptions({ name: 'AerialBoomBom' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AerialBoomBomVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  materialCode: undefined,
  materialDesc: undefined,
  supplier: undefined,
  jitFlag: undefined,
  colorManagement: undefined,
  supplyOnDemand: undefined,
  applicableModel: undefined,
  remark: undefined,
  productModel: undefined,
  preciseBom: undefined,
  quantity: undefined,
  sourceCategory: undefined,
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
    const data = await AerialBoomBomApi.getAerialBoomBomPage(queryParams)
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
    await AerialBoomBomApi.deleteAerialBoomBom(id)
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
    const data = await AerialBoomBomApi.exportAerialBoomBom(queryParams)
    download.excel(data, '高机臂式/剪叉BOM物料清单.xls')
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
  // 提供模板下载链接，需将模板文件放置于 public 目录或后端提供
  window.location.href = '/template/BOM模板.xlsx'
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
    await AerialBoomBomApi.importExcel(selectedFile.value, importTime.value);
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
