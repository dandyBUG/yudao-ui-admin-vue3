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
      <el-form-item label="线别" prop="lineType">
        <el-select
          v-model="queryParams.lineType"
          placeholder="请选择线别"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
      <el-form-item label="ZPS型号" prop="zpsModel">
        <el-input
          v-model="queryParams.zpsModel"
          placeholder="请输入ZPS型号"
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
      <el-form-item label="车号" prop="carNo">
        <el-input
          v-model="queryParams.carNo"
          placeholder="请输入车号"
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
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="内外贸版本" prop="tradeVersion">
        <el-input
          v-model="queryParams.tradeVersion"
          placeholder="请输入内外贸版本"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="台份" prop="unitCount">
        <el-input
          v-model="queryParams.unitCount"
          placeholder="请输入台份"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="上线计划" prop="onlinePlan">
        <el-date-picker
          v-model="queryParams.onlinePlan"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="选择上线计划"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="成台计划" prop="completePlan">
        <el-date-picker
          v-model="queryParams.completePlan"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="选择成台计划"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="报缴日期" prop="reportDate">
        <el-date-picker
          v-model="queryParams.reportDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入国家"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同号" prop="contractNo">
        <el-input
          v-model="queryParams.contractNo"
          placeholder="请输入合同号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="营销通知时间" prop="marketingNoticeTime">
        <el-date-picker
          v-model="queryParams.marketingNoticeTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="订单开立时间" prop="orderCreateTime">
        <el-date-picker
          v-model="queryParams.orderCreateTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
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
          v-hasPermi="['marketing:aerial-boom-dplan:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['marketing:aerial-boom-dplan:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="线别" align="center" prop="lineType" />
      <el-table-column label="精准车型" align="center" prop="preciseModel" width="250px"/>
      <el-table-column label="产品型号" align="center" prop="productModel" width="90px"/>
      <el-table-column label="ZPS型号" align="center" prop="zpsModel" width="150px"/>
      <el-table-column label="精准BOM" align="center" prop="preciseBom" width="140px"/>
      <el-table-column label="车号" align="center" prop="carNo" width="180px"/>
      <el-table-column label="订单号" align="center" prop="orderNo" width="150px"/>
      <el-table-column label="备注" align="center" prop="remark" width="110px"/>
      <el-table-column label="内外贸版本" align="center" prop="tradeVersion" />
      <el-table-column label="台份" align="center" prop="unitCount" />
      <el-table-column
        label="上线计划"
        align="center"
        prop="onlinePlan"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="成台计划"
        align="center"
        prop="completePlan"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="报缴日期"
        align="center"
        prop="reportDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="国家" align="center" prop="country" />
      <el-table-column label="合同号" align="center" prop="contractNo" width="200px"/>
      <el-table-column label="营销通知时间" align="center" prop="marketingNoticeTime" />
      <el-table-column
        label="订单开立时间"
        align="center"
        prop="orderCreateTime"
        :formatter="dateFormatter"
        width="180px"
      />
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
            v-hasPermi="['marketing:aerial-boom-dplan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['marketing:aerial-boom-dplan:delete']"
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
  <AerialBoomDplanForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AerialBoomDplanApi, AerialBoomDplanVO } from '@/api/marketing/aerialboomdplan'
import AerialBoomDplanForm from './AerialBoomDplanForm.vue'

/** 高机臂式日计划 列表 */
defineOptions({ name: 'AerialBoomDplan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AerialBoomDplanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  lineType: undefined,
  preciseModel: undefined,
  productModel: undefined,
  zpsModel: undefined,
  preciseBom: undefined,
  carNo: undefined,
  orderNo: undefined,
  remark: undefined,
  tradeVersion: undefined,
  unitCount: undefined,
  onlinePlan: undefined,
  onlinePlan: [],
  completePlan: undefined,
  completePlan: [],
  reportDate: [],
  country: undefined,
  contractNo: undefined,
  marketingNoticeTime: [],
  orderCreateTime: [],
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
    const data = await AerialBoomDplanApi.getAerialBoomDplanPage(queryParams)
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
    await AerialBoomDplanApi.deleteAerialBoomDplan(id)
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
    const data = await AerialBoomDplanApi.exportAerialBoomDplan(queryParams)
    download.excel(data, '高机臂式日计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
