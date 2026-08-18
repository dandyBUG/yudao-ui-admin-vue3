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
     <el-form-item label="订单号" prop="orderNosText">
       <el-input
         v-model="queryParams.orderNosText"
         type="textarea"
         :rows="3"
         placeholder="请输入订单号，每行一个"
         style="width: 300px"
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
      <el-form-item label="责任车间（总成）" prop="workshop">
        <el-input
          v-model="queryParams.workshop"
          placeholder="请输入责任车间（总成）"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['aps:matching-result:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['aps:matching-result:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button
          type="warning"
          plain
          @click="handleRunProcedure"
          :loading="procedureLoading"
          v-hasPermi="['aps:matching-result:run-procedure']"
        >
          <Icon icon="ep:video-play" class="mr-5px" /> 运行程序
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--
      <el-table-column label="主键ID（雪花算法生成）" align="center" prop="id" />
      -->
      <el-table-column label="订单号" align="center" prop="orderNo"  width="130px" />
      <el-table-column
        label="排产时间"
        align="center"
        prop="scheduleTime"
        :formatter="dateOnlyFormatter"
        width="180px"
      />
      <el-table-column label="物料编码" align="center" prop="materialCode"  width="180px" />
      <el-table-column label="物料描述" align="center" prop="materialDesc"  width="180px" />
      <el-table-column label="责任车间（总成）" align="center" prop="workshop" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="已完成数量" align="center" prop="completedQuantity" />
      <el-table-column label="库存" align="center" prop="stock" />
      <el-table-column label="转序（数量）" align="center" prop="transferOrder" />
      <el-table-column label="零部件订单" align="center" prop="componentOrder"  width="180px"/>
      <el-table-column label="零部件编码" align="center" prop="componentCode" />
      <el-table-column label="零部件描述" align="center" prop="componentDesc" />
      <el-table-column label="责任车间（零部件）" align="center" prop="componentWorkshop" />
      <el-table-column
        label="基本开始日期"
        align="center"
        prop="basicStartDate"
        :formatter="dateOnlyFormatter"
        width="180px"
      />
      <el-table-column label="需求数量（零部件）" align="center" prop="requiredQuantity" />

      <!--
      <el-table-column label="本次未完成数量" align="center" prop="unfinishedQuantity" />
      -->
      <el-table-column label="采购物料" align="center" prop="purchaseMaterial"  width="180px"/>
      <el-table-column label="采购物料描述" align="center" prop="purchaseMaterialDesc" />
      <el-table-column label="大小/尺寸" align="center" prop="sizeDimension" width="120px" />
      <el-table-column label="需求数量（采购）" align="center" prop="purchaseRequiredQty" />
      <el-table-column label="已配送数量" align="center" prop="deliveredQuantity" />
      <el-table-column label="待配送数量" align="center" prop="toDeliverQuantity" />
      <el-table-column label="物料齐套数量" align="center" prop="kitQtySingle" />
      <el-table-column label="分配需求数量" align="center" prop="allocatedRequiredQty" />
      <el-table-column label="剩余需采购数量" align="center" prop="remainRequiredQty" />
      <el-table-column label="未清采购订单数量" align="center" prop="openOrderQuantity" />
      <el-table-column label="采购订单" align="center" prop="purchaseOrder" />
      <el-table-column label="行号" align="center" prop="lineNumber" />
      <el-table-column
        label="下单日期"
        align="center"
        prop="orderDate"
        :formatter="dateOnlyFormatter"
        width="180px"
      />
      <el-table-column
        label="要求交货日期"
        align="center"
        prop="requiredDeliveryDate"
        :formatter="dateOnlyFormatter"
        width="180px"
      />
      <el-table-column
        label="实际到货日期"
        align="center"
        prop="actualArrivalDate"
        :formatter="dateOnlyFormatter"
        width="180px"
      />
      <el-table-column label="供应商名称" align="center" prop="supplierName" />

      <el-table-column label="采购反馈备注" align="center" prop="feedbackRemarks" min-width="150px" show-overflow-tooltip />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['aps:matching-result:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['aps:matching-result:delete']"
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
  <MatchingResultForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MatchingResultApi, MatchingResultVO } from '@/api/aps/matchingresult'
import MatchingResultForm from './MatchingResultForm.vue'
import dayjs from 'dayjs'

/** 主计划物料需求匹配 列表 */
defineOptions({ name: 'MatchingResult' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MatchingResultVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  orderNosText: '',   // 界面输入的多行文本
  orderNos: [],       // 处理后传给后端的数组
  pageNo: 1,
  pageSize: 10,
  orderNo: undefined,
  scheduleTime: [],
  materialCode: undefined,
  materialDesc: undefined,
  workshop: undefined,
  quantity: undefined,
  completedQuantity: undefined,
  stock: undefined,
  transferOrder: undefined,
  componentOrder: undefined,
  componentCode: undefined,
  componentDesc: undefined,
  componentWorkshop: undefined,
  basicStartDate: [],
  requiredQuantity: undefined,
  unfinishedQuantity: undefined,
  purchaseMaterial: undefined,
  purchaseMaterialDesc: undefined,
  purchaseRequiredQty: undefined,
  deliveredQuantity: undefined,
  toDeliverQuantity: undefined,
  purchaseOrder: undefined,
  lineNumber: undefined,
  sizeDimension: undefined,
  orderDate: [],
  requiredDeliveryDate: [],
  actualArrivalDate: [],
  supplierName: undefined,
  openOrderQuantity: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MatchingResultApi.getMatchingResultPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  // 将文本域内容按换行分割，过滤空行，去除首尾空格
  if (queryParams.orderNosText) {
    const lines = queryParams.orderNosText.split(/\r?\n/)
    queryParams.orderNos = lines
      .map(line => line.trim())
      .filter(line => line !== '')
  } else {
    queryParams.orderNos = []
  }

  // 调用分页接口（具体调用方式根据你的项目封装）
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.orderNosText = ''
  queryParams.orderNos = []
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
    await MatchingResultApi.deleteMatchingResult(id)
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
    const data = await MatchingResultApi.exportMatchingResult(queryParams)
    download.excel(data, '主计划物料需求匹配.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const procedureLoading = ref(false); // 按钮加载

/** 运行程序 */
const handleRunProcedure = async () => {
  try {
    await message.confirm('确认要运行主计划物料分配程序吗？');
    procedureLoading.value = true;
    await MatchingResultApi.runProcedure();
    message.success('程序执行完成');
    // 如果需要可自动刷新列表
    // getList();
  } catch (e) {
    // 用户取消或接口报错
  } finally {
    procedureLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getList()
})

// 只显示 yyyy-MM-dd
const dateOnlyFormatter = (row: any, column: any, cellValue: any) => {
  if (!cellValue) return ''
  return dayjs(cellValue).format('YYYY-MM-DD')
}
</script>
