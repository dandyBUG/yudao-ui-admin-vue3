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
      <el-form-item label="工厂" prop="plant">
        <el-input
          v-model="queryParams.plant"
          placeholder="请输入工厂"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="配送单号" prop="deliveryOrderNo">
        <el-input
          v-model="queryParams.deliveryOrderNo"
          placeholder="请输入配送单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="配送日期" prop="deliveryDate">
        <el-date-picker
          v-model="queryParams.deliveryDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建日期（业务）" prop="creationDate">
        <el-date-picker
          v-model="queryParams.creationDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建时间（业务）" prop="creationTime">
        <el-date-picker
          v-model="queryParams.creationTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建人（业务）" prop="createdBy">
        <el-input
          v-model="queryParams.createdBy"
          placeholder="请输入创建人（业务）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="最后更新日期（业务）" prop="lastUpdateDate">
        <el-date-picker
          v-model="queryParams.lastUpdateDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="最后更新时间（业务）" prop="lastUpdateTime">
        <el-date-picker
          v-model="queryParams.lastUpdateTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="最后更新人（业务）" prop="lastUpdatedBy">
        <el-input
          v-model="queryParams.lastUpdatedBy"
          placeholder="请输入最后更新人（业务）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产订单号" prop="partOrderNo">
        <el-input
          v-model="queryParams.partOrderNo"
          placeholder="请输入生产订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产调度员" prop="productionWorkshop">
        <el-input
          v-model="queryParams.productionWorkshop"
          placeholder="请输入生产调度员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="主物料编码" prop="partMatCode">
        <el-input
          v-model="queryParams.partMatCode"
          placeholder="请输入主物料编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="主物料描述" prop="partMatDesc">
        <el-input
          v-model="queryParams.partMatDesc"
          placeholder="请输入主物料描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="预留号" prop="reservationNo">
        <el-input
          v-model="queryParams.reservationNo"
          placeholder="请输入预留号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="预留项目" prop="reservationItem">
        <el-input
          v-model="queryParams.reservationItem"
          placeholder="请输入预留项目"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="应发数量" prop="plannedIssueQty">
        <el-input
          v-model="queryParams.plannedIssueQty"
          placeholder="请输入应发数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="已发数量" prop="deliveredQty">
        <el-input
          v-model="queryParams.deliveredQty"
          placeholder="请输入已发数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="未配送数量" prop="undeliveredQty">
        <el-input
          v-model="queryParams.undeliveredQty"
          placeholder="请输入未配送数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料号" prop="buyerMaterialNo">
        <el-input
          v-model="queryParams.buyerMaterialNo"
          placeholder="请输入物料号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="旧物料号" prop="oldMaterialNo">
        <el-input
          v-model="queryParams.oldMaterialNo"
          placeholder="请输入旧物料号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="buyerMaterialDesc">
        <el-input
          v-model="queryParams.buyerMaterialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商编码(配送单)" prop="deliverySupplierCode">
        <el-input
          v-model="queryParams.deliverySupplierCode"
          placeholder="请输入供应商编码(配送单)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商描述(配送单)" prop="deliverySupplierName">
        <el-input
          v-model="queryParams.deliverySupplierName"
          placeholder="请输入供应商描述(配送单)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="库存是否满足" prop="stockSufficientFlag">
        <el-input
          v-model="queryParams.stockSufficientFlag"
          placeholder="请输入库存是否满足"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="总库存" prop="totalStockQty">
        <el-input
          v-model="queryParams.totalStockQty"
          placeholder="请输入总库存"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="本次消耗库存" prop="currentStockConsumeQty">
        <el-input
          v-model="queryParams.currentStockConsumeQty"
          placeholder="请输入本次消耗库存"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="库存地点(配送)" prop="deliveryStorageLoc">
        <el-input
          v-model="queryParams.deliveryStorageLoc"
          placeholder="请输入库存地点(配送)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购是否满足" prop="poSufficientFlag">
        <el-input
          v-model="queryParams.poSufficientFlag"
          placeholder="请输入采购是否满足"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购订单号" prop="buyerOrderNo">
        <el-input
          v-model="queryParams.buyerOrderNo"
          placeholder="请输入采购订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购项目" prop="lineItem">
        <el-input
          v-model="queryParams.lineItem"
          placeholder="请输入采购项目"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="需求跟踪号" prop="requirementTrackingNo">
        <el-input
          v-model="queryParams.requirementTrackingNo"
          placeholder="请输入需求跟踪号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购订单数量" prop="orderQty">
        <el-input
          v-model="queryParams.orderQty"
          placeholder="请输入采购订单数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购订单未收货数量" prop="openQty">
        <el-input
          v-model="queryParams.openQty"
          placeholder="请输入采购订单未收货数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="本次交货数量" prop="receivedQty">
        <el-input
          v-model="queryParams.receivedQty"
          placeholder="请输入本次交货数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购订单交货日期" prop="poDeliveryDate">
        <el-date-picker
          v-model="queryParams.poDeliveryDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="供应商(采购订单)" prop="poSupplierCode">
        <el-input
          v-model="queryParams.poSupplierCode"
          placeholder="请输入供应商(采购订单)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商描述(采购订单)" prop="supplierDesc">
        <el-input
          v-model="queryParams.supplierDesc"
          placeholder="请输入供应商描述(采购订单)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购组" prop="buyerPurchasingGroup">
        <el-input
          v-model="queryParams.buyerPurchasingGroup"
          placeholder="请输入采购组"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="下单采购员" prop="orderingBuyer">
        <el-input
          v-model="queryParams.orderingBuyer"
          placeholder="请输入下单采购员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="交货采购员" prop="deliveryBuyer">
        <el-input
          v-model="queryParams.deliveryBuyer"
          placeholder="请输入交货采购员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间（系统）" prop="createTime">
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
          v-hasPermi="['buyer:deliver:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- 新增导入按钮 -->
        <el-button type="warning" plain @click="handleImport" v-hasPermi="['buyer:deliver:import']">
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['buyer:deliver:export']"
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
      <el-table-column label="工厂" align="center" prop="plant" />
      <el-table-column label="配送单号" align="center" prop="deliveryOrderNo" />
      <el-table-column
        label="配送日期"
        align="center"
        prop="deliveryDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="创建日期（业务）"
        align="center"
        prop="creationDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="创建时间（业务）" align="center" prop="creationTime" />
      <el-table-column label="创建人（业务）" align="center" prop="createdBy" />
      <el-table-column
        label="最后更新日期（业务）"
        align="center"
        prop="lastUpdateDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="最后更新时间（业务）" align="center" prop="lastUpdateTime" />
      <el-table-column label="最后更新人（业务）" align="center" prop="lastUpdatedBy" />
      <el-table-column label="生产订单号" align="center" prop="partOrderNo" />
      <el-table-column label="生产调度员" align="center" prop="productionWorkshop" />
      <el-table-column label="主物料编码" align="center" prop="partMatCode" />
      <el-table-column label="主物料描述" align="center" prop="partMatDesc" />
      <el-table-column label="预留号" align="center" prop="reservationNo" />
      <el-table-column label="预留项目" align="center" prop="reservationItem" />
      <el-table-column label="应发数量" align="center" prop="plannedIssueQty" />
      <el-table-column label="已发数量" align="center" prop="deliveredQty" />
      <el-table-column label="未配送数量" align="center" prop="undeliveredQty" />
      <el-table-column label="物料号" align="center" prop="buyerMaterialNo" />
      <el-table-column label="旧物料号" align="center" prop="oldMaterialNo" />
      <el-table-column label="物料描述" align="center" prop="buyerMaterialDesc" />
      <el-table-column label="供应商编码(配送单)" align="center" prop="deliverySupplierCode" />
      <el-table-column label="供应商描述(配送单)" align="center" prop="deliverySupplierName" />
      <el-table-column label="库存是否满足" align="center" prop="stockSufficientFlag" />
      <el-table-column label="总库存" align="center" prop="totalStockQty" />
      <el-table-column label="本次消耗库存" align="center" prop="currentStockConsumeQty" />
      <el-table-column label="库存地点(配送)" align="center" prop="deliveryStorageLoc" />
      <el-table-column label="采购是否满足" align="center" prop="poSufficientFlag" />
      <el-table-column label="采购订单号" align="center" prop="buyerOrderNo" />
      <el-table-column label="采购项目" align="center" prop="lineItem" />
      <el-table-column label="需求跟踪号" align="center" prop="requirementTrackingNo" />
      <el-table-column label="采购订单数量" align="center" prop="orderQty" />
      <el-table-column label="采购订单未收货数量" align="center" prop="openQty" />
      <el-table-column label="本次交货数量" align="center" prop="receivedQty" />
      <el-table-column
        label="采购订单交货日期"
        align="center"
        prop="poDeliveryDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="供应商(采购订单)" align="center" prop="poSupplierCode" />
      <el-table-column label="供应商描述(采购订单)" align="center" prop="supplierDesc" />
      <el-table-column label="采购组" align="center" prop="buyerPurchasingGroup" />
      <el-table-column label="下单采购员" align="center" prop="orderingBuyer" />
      <el-table-column label="交货采购员" align="center" prop="deliveryBuyer" />
      <el-table-column
        label="创建时间（系统）"
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
            v-hasPermi="['buyer:deliver:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['buyer:deliver:delete']"
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

  <!-- 导入对话框（新增） -->
    <el-dialog title="导入配送与采购报表数据" v-model="importDialogVisible" width="500px">
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
          <div class="el-upload__tip">请上传包含配送与采购数据的Excel文件，表头格式需与模板一致。</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitImport">开始导入</el-button>
      </template>
    </el-dialog>


  <!-- 表单弹窗：添加/修改 -->
  <DeliverForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DeliverApi, DeliverVO } from '@/api/buyer/deliver'
import DeliverForm from './DeliverForm.vue'
import { getAccessToken } from '@/utils/auth'                     // 新增
import { ElLoading, ElMessage } from 'element-plus'               // 新增
import dayjs from 'dayjs'                                         // 可选，如需默认日期

/** 配送与采购报表 列表 */
defineOptions({ name: 'Deliver' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<DeliverVO[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  plant: undefined,
  deliveryOrderNo: undefined,
  deliveryDate: [],
  creationDate: [],
  creationTime: [],
  createdBy: undefined,
  lastUpdateDate: [],
  lastUpdateTime: [],
  lastUpdatedBy: undefined,
  partOrderNo: undefined,
  productionWorkshop: undefined,
  partMatCode: undefined,
  partMatDesc: undefined,
  reservationNo: undefined,
  reservationItem: undefined,
  plannedIssueQty: undefined,
  deliveredQty: undefined,
  undeliveredQty: undefined,
  buyerMaterialNo: undefined,
  oldMaterialNo: undefined,
  buyerMaterialDesc: undefined,
  deliverySupplierCode: undefined,
  deliverySupplierName: undefined,
  stockSufficientFlag: undefined,
  totalStockQty: undefined,
  currentStockConsumeQty: undefined,
  deliveryStorageLoc: undefined,
  poSufficientFlag: undefined,
  buyerOrderNo: undefined,
  lineItem: undefined,
  requirementTrackingNo: undefined,
  orderQty: undefined,
  openQty: undefined,
  receivedQty: undefined,
  poDeliveryDate: [],
  poSupplierCode: undefined,
  supplierDesc: undefined,
  buyerPurchasingGroup: undefined,
  orderingBuyer: undefined,
  deliveryBuyer: undefined,
  createTime: [],
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeliverApi.getDeliverPage(queryParams)
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
    await DeliverApi.deleteDeliver(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await DeliverApi.exportDeliver(queryParams)
    download.excel(data, '配送与采购报表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// ========== 导入相关（新增） ==========
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
  // 模板文件放在 public/template 目录下，请确保文件存在
  window.location.href = '/template/配送与采购报表模板.xlsx'
}

const submitImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择文件')
    return
  }

  const loadingInstance = ElLoading.service({ fullscreen: true, text: '导入中...' })
  try {
    // 使用 fetch 方式直接发送 multipart/form-data，绕过 axios 封装的问题
    const baseURL = import.meta.env.VITE_BASE_URL
    const url = `${baseURL}/admin-api/buyer/deliver/import-excel`
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getAccessToken()}` },
      body: formData
    })
    const result = await response.json()
    if (result.code === 0) {
      ElMessage.success(`导入成功，共 ${result.data} 条`)
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
    loadingInstance.close()
  }
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
