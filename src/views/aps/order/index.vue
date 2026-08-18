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
      <el-form-item label="物料号" prop="assemblyMaterialNo">
        <el-input
          v-model="queryParams.assemblyMaterialNo"
          placeholder="请输入物料号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="mainMaterialDesc">
        <el-input
          v-model="queryParams.mainMaterialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单类型(如ZY02)" prop="componentOrderType">
        <el-select
          v-model="queryParams.componentOrderType"
          placeholder="请选择订单类型(如ZY02)"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单数量" prop="scheduledQuantity">
        <el-input
          v-model="queryParams.scheduledQuantity"
          placeholder="请输入订单数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="已交货数量(已入库数量)" prop="deliveredQuantity">
        <el-input
          v-model="queryParams.deliveredQuantity"
          placeholder="请输入已交货数量(已入库数量)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建日期" prop="creationDate">
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
      <el-form-item label="创建者/输入者" prop="createdBy">
        <el-input
          v-model="queryParams.createdBy"
          placeholder="请输入创建者/输入者"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="系统状态(如REL PCNF等)" prop="systemStatus">
        <el-select
          v-model="queryParams.systemStatus"
          placeholder="请选择系统状态(如REL PCNF等)"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="计划开始日期" prop="scheduledDate">
        <el-date-picker
          v-model="queryParams.scheduledDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="实际开始时间(日期+时间)" prop="actualStartTime">
        <el-date-picker
          v-model="queryParams.actualStartTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="计划完成日期" prop="basicEndDate">
        <el-date-picker
          v-model="queryParams.basicEndDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="工厂代码" prop="plant">
        <el-input
          v-model="queryParams.plant"
          placeholder="请输入工厂代码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="MRP控制员代码" prop="mrpController">
        <el-input
          v-model="queryParams.mrpController"
          placeholder="请输入MRP控制员代码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产主管" prop="productionWorkshop">
        <el-input
          v-model="queryParams.productionWorkshop"
          placeholder="请输入生产主管"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="计量单位(如PC)" prop="unitOfMeasure">
        <el-input
          v-model="queryParams.unitOfMeasure"
          placeholder="请输入计量单位(如PC)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产版本(如0001)" prop="productionVersion">
        <el-input
          v-model="queryParams.productionVersion"
          placeholder="请输入生产版本(如0001)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="实际完成日期 (Actual End Date)" prop="actualEndDate">
        <el-date-picker
          v-model="queryParams.actualEndDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="处理开始日期 (Process Start Date)" prop="processStartDate">
        <el-date-picker
          v-model="queryParams.processStartDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="提交日期 (Submit Date)" prop="submitDate">
        <el-date-picker
          v-model="queryParams.submitDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="处理下达 (Process Released)" prop="processReleased">
        <el-input
          v-model="queryParams.processReleased"
          placeholder="请输入处理下达 (Process Released)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="集中订单处理 (Central Processing)" prop="centralProc">
        <el-input
          v-model="queryParams.centralProc"
          placeholder="请输入集中订单处理 (Central Processing)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="更改日期 (Change Date)" prop="changeDate">
        <el-date-picker
          v-model="queryParams.changeDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="最后更改人 (Last Changed By)" prop="lastChangedBy">
        <el-input
          v-model="queryParams.lastChangedBy"
          placeholder="请输入最后更改人 (Last Changed By)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单类别 (Order Category)" prop="orderCategory">
        <el-input
          v-model="queryParams.orderCategory"
          placeholder="请输入订单类别 (Order Category)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="销售订单 (Sales Order)" prop="salesOrder">
        <el-input
          v-model="queryParams.salesOrder"
          placeholder="请输入销售订单 (Sales Order)"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="确认产量" prop="confirmedQuantity">
        <el-input
          v-model="queryParams.confirmedQuantity"
          placeholder="请输入确认产量"
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
          v-hasPermi="['aps:order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:order:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <!-- 查询SAP订单 -->
        <el-button
          type="info"
          plain
          @click="handleSearchSap"
          :loading="searchLoading"
          v-hasPermi="['wm:sap-order:query']"
        >
          <Icon icon="ep:search" class="mr-5px" /> 查询SAP
        </el-button>

        <!-- 同步SAP订单 -->
        <el-button
          type="primary"
          plain
          @click="handleSyncSap"
          :loading="syncLoading"
          v-hasPermi="['wm:sap-order:sync']"
        >
          <Icon icon="ep:refresh-right" class="mr-5px" /> 同步SAP
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="订单号(主键)" align="center" prop="productionOrderNo" />
      <el-table-column label="物料号" align="center" prop="assemblyMaterialNo" />
      <el-table-column label="物料描述" align="center" prop="mainMaterialDesc" />
      <el-table-column label="订单类型(如ZY02)" align="center" prop="componentOrderType" />
      <el-table-column label="订单数量" align="center" prop="scheduledQuantity" />
      <el-table-column label="已交货数量(已入库数量)" align="center" prop="deliveredQuantity" />
      <el-table-column
        label="创建日期"
        align="center"
        prop="creationDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="创建者/输入者" align="center" prop="createdBy" />
      <el-table-column label="系统状态(如REL PCNF等)" align="center" prop="systemStatus" />
      <el-table-column
        label="计划开始日期"
        align="center"
        prop="scheduledDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="实际开始时间(日期+时间)"
        align="center"
        prop="actualStartTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="计划完成日期"
        align="center"
        prop="basicEndDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="工厂代码" align="center" prop="plant" />
      <el-table-column label="MRP控制员代码" align="center" prop="mrpController" />
      <el-table-column label="生产主管" align="center" prop="productionWorkshop" />
      <el-table-column label="计量单位(如PC)" align="center" prop="unitOfMeasure" />
      <el-table-column label="生产版本(如0001)" align="center" prop="productionVersion" />
      <el-table-column
        label="实际完成日期 (Actual End Date)"
        align="center"
        prop="actualEndDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="处理开始日期 (Process Start Date)"
        align="center"
        prop="processStartDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="提交日期 (Submit Date)"
        align="center"
        prop="submitDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="处理下达 (Process Released)" align="center" prop="processReleased" />
      <el-table-column label="集中订单处理 (Central Processing)" align="center" prop="centralProc" />
      <el-table-column
        label="更改日期 (Change Date)"
        align="center"
        prop="changeDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="最后更改人 (Last Changed By)" align="center" prop="lastChangedBy" />
      <el-table-column label="订单类别 (Order Category)" align="center" prop="orderCategory" />
      <el-table-column label="销售订单 (Sales Order)" align="center" prop="salesOrder" />
      <el-table-column label="描述 (Description)" align="center" prop="description" />
      <el-table-column label="确认产量" align="center" prop="confirmedQuantity" />
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
            v-hasPermi="['aps:order:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['aps:order:delete']"
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
  <OrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OrderApi, OrderVO } from '@/api/aps/order'
import OrderForm from './OrderForm.vue'
import { ElMessageBox } from 'element-plus'


/** 订单表 - SAP订单信息 列表 */
defineOptions({ name: 'Order' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  assemblyMaterialNo: undefined,
  mainMaterialDesc: undefined,
  componentOrderType: undefined,
  scheduledQuantity: undefined,
  deliveredQuantity: undefined,
  creationDate: [],
  createdBy: undefined,
  systemStatus: undefined,
  scheduledDate: [],
  actualStartTime: [],
  basicEndDate: [],
  plant: undefined,
  mrpController: undefined,
  productionWorkshop: undefined,
  unitOfMeasure: undefined,
  productionVersion: undefined,
  actualEndDate: [],
  processStartDate: [],
  submitDate: [],
  processReleased: undefined,
  centralProc: undefined,
  changeDate: [],
  lastChangedBy: undefined,
  orderCategory: undefined,
  salesOrder: undefined,
  description: undefined,
  confirmedQuantity: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderApi.getOrderPage(queryParams)
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
    await OrderApi.deleteOrder(id)
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
    const data = await OrderApi.exportOrder(queryParams)
    download.excel(data, '订单表 - SAP订单信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 新增加载状态
const searchLoading = ref(false)
const syncLoading = ref(false)

/** 查询 SAP 订单（弹窗展示 JSON） */
const handleSearchSap = () => {
  ElMessageBox.prompt('请输入查询条件 (JSON 格式)', 'SAP订单查询', {
    confirmButtonText: '查询',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '示例: {"aufnr": "1000001", "plant": "6400"}'
  }).then(async ({ value }) => {
    try {
      const params = JSON.parse(value)
      searchLoading.value = true
      const res = await OrderApi.searchOrderFromSap(params)
      ElMessageBox.alert(
        `<pre>${JSON.stringify(res, null, 2)}</pre>`,
        'SAP查询结果',
        {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        }
      )
    } catch (error: any) {
      message.error('查询失败：' + (error.message || '参数格式错误'))
    } finally {
      searchLoading.value = false
    }
  }).catch(() => {})
}

/** 同步 SAP 订单到数据库 */
const handleSyncSap = () => {
  ElMessageBox.prompt('请输入同步条件 (JSON 格式)', 'SAP订单同步', {
    confirmButtonText: '同步',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '示例: {"aufnr": "1000001", "plant": "6400"}'
  }).then(async ({ value }) => {
    try {
      const params = JSON.parse(value)
      syncLoading.value = true
      const res = await OrderApi.syncOrderFromSap(params)
      message.success(`同步成功，共处理 ${res} 条数据`)
      await getList() // 刷新列表
    } catch (error: any) {
      message.error('同步失败：' + (error.message || '参数格式错误'))
    } finally {
      syncLoading.value = false
    }
  }).catch(() => {})
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
