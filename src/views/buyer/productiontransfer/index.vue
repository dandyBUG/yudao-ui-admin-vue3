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
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
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
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产调度员" prop="productionScheduler">
        <el-input
          v-model="queryParams.productionScheduler"
          placeholder="请输入生产调度员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="转序发起人" prop="transferInitiator">
        <el-input
          v-model="queryParams.transferInitiator"
          placeholder="请输入转序发起人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发起日期" prop="initiatorDate">
        <el-date-picker
          v-model="queryParams.initiatorDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
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
      <el-form-item label="转序单号" prop="transferNo">
        <el-input
          v-model="queryParams.transferNo"
          placeholder="请输入转序单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="计划批次" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="请输入计划批次"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="签收人" prop="signer">
        <el-input
          v-model="queryParams.signer"
          placeholder="请输入签收人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="签收时间" prop="signTime">
        <el-date-picker
          v-model="queryParams.signTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="创建者" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建者"
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
      <el-form-item label="更新者" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新者"
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
          v-hasPermi="['buyer:production-transfer:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['buyer:production-transfer:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
         <el-button
          type="warning"
          plain
          @click="handleImport"
          v-hasPermi="['buyer:production-transfer:import']"
        >
          <Icon icon="ep:upload" class="mr-5px" /> 导入
        </el-button>
        <!-- 隐藏的文件输入框 -->
        <input ref="fileInputRef" type="file" accept=".xls,.xlsx" style="display: none" @change="uploadFile" />
        <el-button
          type="primary"
          plain
          @click="openSyncDialog"
          v-hasPermi="['buyer:production-transfer:sync']"
        >
          <Icon icon="ep:refresh-right" class="mr-5px" /> 同步MES
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="物料编码" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" />
      <el-table-column label="生产调度员" align="center" prop="productionScheduler" />
      <el-table-column label="转序发起人" align="center" prop="transferInitiator" />
      <el-table-column
        label="发起日期"
        align="center"
        prop="initiatorDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="转序单号" align="center" prop="transferNo" />
      <el-table-column label="计划批次" align="center" prop="batchNo" />
      <el-table-column label="签收人" align="center" prop="signer" />
      <el-table-column
        label="签收时间"
        align="center"
        prop="signTime"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['buyer:production-transfer:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['buyer:production-transfer:delete']"
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
  <ProductionTransferForm ref="formRef" @success="getList" />

  <!-- 同步MES弹窗 -->
  <el-dialog title="同步MES数据" v-model="syncDialogVisible" width="500px">
    <el-form :model="syncForm" ref="syncFormRef" label-width="100px">
      <el-form-item label="工厂编号" prop="plantNo" :rules="[{ required: true, message: '请输入工厂编号' }]">
        <el-input v-model="syncForm.plantNo" placeholder="例如：6400" />
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime" :rules="[{ required: true, message: '请选择开始时间' }]">
        <el-date-picker
          v-model="syncForm.beginTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime" :rules="[{ required: true, message: '请选择结束时间' }]">
        <el-date-picker
          v-model="syncForm.endTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="计划员" prop="plannerName">
        <el-input v-model="syncForm.plannerName" placeholder="可选" />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="syncForm.orderNo" placeholder="可选" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="syncDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitSync" :loading="syncLoading">确认同步</el-button>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductionTransferApi, ProductionTransferVO } from '@/api/buyer/productiontransfer'
import ProductionTransferForm from './ProductionTransferForm.vue'
import { ElLoading } from 'element-plus'

/** MES转序单信息 列表 */
defineOptions({ name: 'ProductionTransfer' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProductionTransferVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNo: undefined,
  materialCode: undefined,
  materialDesc: undefined,
  productionScheduler: undefined,
  transferInitiator: undefined,
  initiatorDate: [],
  quantity: undefined,
  transferNo: undefined,
  batchNo: undefined,
  signer: undefined,
  signTime: [],
  createBy: undefined,
  createTime: [],
  updateBy: undefined,
  delFlag: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
// 新增：文件输入引用
const fileInputRef = ref<HTMLInputElement>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductionTransferApi.getProductionTransferPage(queryParams)
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
    await ProductionTransferApi.deleteProductionTransfer(id)
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
    const data = await ProductionTransferApi.exportProductionTransfer(queryParams)
    download.excel(data, 'MES转序单信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// ========== 新增导入相关方法 ==========
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
    const res = await ProductionTransferApi.importProductionTransfer(file)
    // 假设接口返回 CommonResult<Integer>，res 即为导入数量
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

// 同步相关
const syncDialogVisible = ref(false)
const syncLoading = ref(false)
const syncFormRef = ref()
const syncForm = reactive({
  plantNo: '6400',
  beginTime: '',
  endTime: '',
  plannerName: '',
  orderNo: ''
})

/** 打开同步弹窗 */
const openSyncDialog = () => {
  // 设置默认时间范围：最近3个月
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 3)
  syncForm.beginTime = formatDate(start, 'yyyy-MM-dd')
  syncForm.endTime = formatDate(end, 'yyyy-MM-dd')
  syncForm.plantNo = '6400'
  syncForm.plannerName = ''
  syncForm.orderNo = ''
  syncDialogVisible.value = true
}

/** 提交同步 */
const submitSync = async () => {
  await syncFormRef.value.validate()
  syncLoading.value = true
  try {
    const res = await ProductionTransferApi.syncFromMes(syncForm)
    message.success(`同步成功，共处理 ${res} 条数据`)
    syncDialogVisible.value = false
    await getList() // 刷新列表
  } catch (error: any) {
    message.error('同步失败：' + (error.message || ''))
  } finally {
    syncLoading.value = false
  }
}

// 辅助函数：日期格式化
const formatDate = (date: Date, fmt: string) => {
  const o: any = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
