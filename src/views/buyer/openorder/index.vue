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
      <el-form-item label="订单日期" prop="orderDate">
        <el-date-picker
          v-model="queryParams.orderDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
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
      <el-form-item label="订单行项目" prop="lineItem">
        <el-input
          v-model="queryParams.lineItem"
          placeholder="请输入订单行项目"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料号" prop="materialNo">
        <el-input
          v-model="queryParams.materialNo"
          placeholder="请输入物料号"
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
      <el-form-item label="订单数量" prop="orderQty">
        <el-input
          v-model="queryParams.orderQty"
          placeholder="请输入订单数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="实收数量" prop="receivedQty">
        <el-input
          v-model="queryParams.receivedQty"
          placeholder="请输入实收数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="未清数量" prop="openQty">
        <el-input
          v-model="queryParams.openQty"
          placeholder="请输入未清数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入单位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="要求到货日期" prop="requiredArrivalDate">
        <el-date-picker
          v-model="queryParams.requiredArrivalDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="实际到货日期" prop="actualArrivalDate">
        <el-date-picker
          v-model="queryParams.actualArrivalDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="供应商描述" prop="supplierDesc">
        <el-input
          v-model="queryParams.supplierDesc"
          placeholder="请输入供应商描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
      <el-form-item label="采购组" prop="buyerGroup">
        <el-input
          v-model="queryParams.buyerGroup"
          placeholder="请输入采购组"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="凭证类型" prop="documentType">
        <el-select
          v-model="queryParams.documentType"
          placeholder="请选择凭证类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产订单号" prop="productionOrderNo">
        <el-input
          v-model="queryParams.productionOrderNo"
          placeholder="请输入生产订单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品牌信息" prop="brandInfo">
        <el-input
          v-model="queryParams.brandInfo"
          placeholder="请输入品牌信息"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="单价（净价）" prop="unitPrice">
        <el-input
          v-model="queryParams.unitPrice"
          placeholder="请输入单价（净价）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="供应商代码" prop="supplierCode">
        <el-input
          v-model="queryParams.supplierCode"
          placeholder="请输入供应商代码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="收货仓库" prop="receivingWarehouse">
        <el-input
          v-model="queryParams.receivingWarehouse"
          placeholder="请输入收货仓库"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合计金额（净价）" prop="totalAmount">
        <el-input
          v-model="queryParams.totalAmount"
          placeholder="请输入合计金额（净价）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购申请" prop="buyerReqNo">
        <el-input
          v-model="queryParams.buyerReqNo"
          placeholder="请输入采购申请"
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
          v-hasPermi="['buyer:open-order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['buyer:open-order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="warning"
          plain
          @click="openSyncDialog"
          :loading="syncLoading"
          v-hasPermi="['buyer:open-order:sync']"
        >
          <Icon icon="ep:refresh" class="mr-5px" /> 同步SAP订单
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column
        label="订单日期"
        align="center"
        prop="orderDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="采购订单号" align="center" prop="buyerOrderNo" />
      <el-table-column label="订单行项目" align="center" prop="lineItem" />
      <el-table-column label="物料号" align="center" prop="materialNo" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" />
      <el-table-column label="订单数量" align="center" prop="orderQty" />
      <el-table-column label="实收数量" align="center" prop="receivedQty" />
      <el-table-column label="未清数量" align="center" prop="openQty" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column
        label="要求到货日期"
        align="center"
        prop="requiredArrivalDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="实际到货日期"
        align="center"
        prop="actualArrivalDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="供应商描述" align="center" prop="supplierDesc" />
      <el-table-column label="客户" align="center" prop="customer" />
      <el-table-column label="采购组" align="center" prop="buyerGroup" />
      <el-table-column label="凭证类型" align="center" prop="documentType" />
      <el-table-column label="生产订单号" align="center" prop="productionOrderNo" />
      <el-table-column label="品牌信息" align="center" prop="brandInfo" />
      <el-table-column label="单价（净价）" align="center" prop="unitPrice" />
      <el-table-column label="供应商代码" align="center" prop="supplierCode" />
      <el-table-column label="收货仓库" align="center" prop="receivingWarehouse" />
      <el-table-column label="合计金额（净价）" align="center" prop="totalAmount" />
      <el-table-column label="采购申请" align="center" prop="buyerReqNo" />
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
            v-hasPermi="['buyer:open-order:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['buyer:open-order:delete']"
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

  <!-- 同步订单弹窗 -->
  <el-dialog title="同步 SAP 采购订单" v-model="syncDialogVisible" width="500px">
    <el-form :model="syncForm" label-width="100px">
      <el-form-item label="工厂" required>
        <el-input v-model="syncForm.werks" placeholder="请输入工厂编码" />
      </el-form-item>
      <el-form-item label="采购订单号">
        <el-input v-model="syncForm.ebeln" placeholder="可选" />
      </el-form-item>
      <el-form-item label="物料号">
        <el-input v-model="syncForm.matnr" placeholder="可选" />
      </el-form-item>
      <el-form-item label="下单日期起">
        <el-date-picker v-model="syncForm.bedatS" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="下单日期止">
        <el-date-picker v-model="syncForm.bedatE" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="交货日期起">
        <el-date-picker v-model="syncForm.eindtS" type="date" placeholder="开始日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="交货日期止">
        <el-date-picker v-model="syncForm.eindtE" type="date" placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="syncForm.lifnr" placeholder="可选" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="syncDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSync" :loading="syncSubmitting">开始同步</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗：添加/修改 -->
  <OpenOrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OpenOrderApi, OpenOrderVO } from '@/api/buyer/openorder'
import OpenOrderForm from './OpenOrderForm.vue'

/** 采购未清订单 列表 */
defineOptions({ name: 'OpenOrder' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OpenOrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderDate: [],
  buyerOrderNo: undefined,
  lineItem: undefined,
  materialNo: undefined,
  materialDesc: undefined,
  orderQty: undefined,
  receivedQty: undefined,
  openQty: undefined,
  unit: undefined,
  requiredArrivalDate: [],
  actualArrivalDate: [],
  supplierDesc: undefined,
  customer: undefined,
  buyerGroup: undefined,
  documentType: undefined,
  productionOrderNo: undefined,
  brandInfo: undefined,
  unitPrice: undefined,
  supplierCode: undefined,
  receivingWarehouse: undefined,
  totalAmount: undefined,
  buyerReqNo: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OpenOrderApi.getOpenOrderPage(queryParams)
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
    await OpenOrderApi.deleteOpenOrder(id)
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
    const data = await OpenOrderApi.exportOpenOrder(queryParams)
    download.excel(data, '采购未清订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 同步相关状态
const syncDialogVisible = ref(false)
const syncLoading = ref(false)
const syncSubmitting = ref(false)
const syncForm = reactive({
  werks: '',
  ebeln: '',
  matnr: '',
  bedatS: '',
  bedatE: '',
  eindtS: '',
  eindtE: '',
  lifnr: '',
})
// 打开同步弹窗
const openSyncDialog = () => {
  syncForm.werks = ''  // 可根据需要设置默认工厂
  syncDialogVisible.value = true
}

// 执行同步
const handleSync = async () => {
  if (!syncForm.werks) {
    message.warning('工厂不能为空')
    return
  }
  syncSubmitting.value = true
  try {
    await OpenOrderApi.syncFromSap(syncForm)
    message.success('同步任务已提交，请稍后查看数据')
    syncDialogVisible.value = false
    // 可选：延迟刷新列表
    setTimeout(() => {
      getList()
    }, 2000)
  } catch (error) {
    console.error('同步失败', error)
    message.error(error.message || '同步失败')
  } finally {
    syncSubmitting.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
