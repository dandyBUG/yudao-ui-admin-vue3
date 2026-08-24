<template>
  <ContentWrap>
    <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="-mb-15px" label-width="90px">
      <el-form-item v-for="field in queryFields" :key="field.prop" :label="field.label" :prop="field.prop">
        <el-input v-model="queryParams[field.prop]" clearable :placeholder="`请输入${field.label}`" class="!w-200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        <el-button type="primary" plain v-hasPermi="['buyer:overseas-inventory:create']" @click="openForm('create')"><Icon icon="ep:plus" class="mr-5px" />新增</el-button>
        <el-button type="success" plain :loading="exportLoading" v-hasPermi="['buyer:overseas-inventory:export']" @click="handleExport"><Icon icon="ep:download" class="mr-5px" />导出</el-button>
        <el-button type="info" plain v-hasPermi="['buyer:overseas-inventory:import']" @click="handleDownloadTemplate"><Icon icon="ep:download" class="mr-5px" />下载模板</el-button>
        <el-button type="warning" plain v-hasPermi="['buyer:overseas-inventory:import']" @click="fileInputRef?.click()"><Icon icon="ep:upload" class="mr-5px" />导入</el-button>
        <input ref="fileInputRef" type="file" accept=".xls,.xlsx" class="hidden" @change="uploadFile" />
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" border stripe show-overflow-tooltip>
      <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop" align="center" :min-width="column.width" />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button link type="primary" v-hasPermi="['buyer:overseas-inventory:update']" @click="openForm('update', scope.row.id)">编辑</el-button>
          <el-button link type="danger" v-hasPermi="['buyer:overseas-inventory:delete']" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" :total="total" @pagination="getList" />
  </ContentWrap>
  <OverseasInventoryForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus'
import download from '@/utils/download'
import { OverseasInventoryApi, OverseasInventoryPageReqVO, OverseasInventoryVO } from '@/api/buyer/overseasinventory'
import OverseasInventoryForm from './OverseasInventoryForm.vue'

defineOptions({ name: 'OverseasInventory' })
type QueryKey = Exclude<keyof OverseasInventoryPageReqVO, 'pageNo' | 'pageSize'>
const queryFields: Array<{ label: string; prop: QueryKey }> = [
  { label: '货主代码', prop: 'ownerCode' }, { label: '供应商代码', prop: 'supplierCode' },
  { label: '货品编码', prop: 'itemCode' }, { label: '货品名称', prop: 'itemName' }
]
const columns = [
  { label: '货主代码', prop: 'ownerCode', width: 110 },
  { label: '供应商代码', prop: 'supplierCode', width: 130 }, { label: '供应商名称', prop: 'supplierName', width: 180 },
  { label: '货品编码', prop: 'itemCode', width: 160 }, { label: '货品名称', prop: 'itemName', width: 200 },
  { label: '货品规格', prop: 'itemSpecification', width: 200 }, { label: '库存数量', prop: 'inventoryQuantity', width: 100 },
  { label: '占用数量', prop: 'occupiedQuantity', width: 100 }, { label: '可用量', prop: 'availableQuantity', width: 100 },
  { label: '冻结数量', prop: 'frozenQuantity', width: 100 }
]
const { t } = useI18n()
const message = useMessage()
const loading = ref(true)
const exportLoading = ref(false)
const list = ref<OverseasInventoryVO[]>([])
const total = ref(0)
const queryFormRef = ref()
const formRef = ref()
const fileInputRef = ref<HTMLInputElement>()
const queryParams = reactive<OverseasInventoryPageReqVO>({ pageNo: 1, pageSize: 10 })
const getList = async () => {
  loading.value = true
  try {
    const data = await OverseasInventoryApi.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally { loading.value = false }
}
const handleQuery = () => { queryParams.pageNo = 1; getList() }
const resetQuery = () => { queryFormRef.value.resetFields(); handleQuery() }
const openForm = (type: string, id?: string) => formRef.value.open(type, id)
const handleDelete = async (id: string) => {
  try {
    await message.delConfirm()
    await OverseasInventoryApi.delete(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    download.excel(await OverseasInventoryApi.export(queryParams), '驻外库存.xls')
  } finally { exportLoading.value = false }
}
const handleDownloadTemplate = async () => download.excel(await OverseasInventoryApi.downloadImportTemplate(), '驻外库存导入模板.xlsx')
const uploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const instance = ElLoading.service({ fullscreen: true, text: '正在导入...' })
  try {
    const count = await OverseasInventoryApi.importExcel(file)
    message.success(`导入成功，共 ${count} 条`)
    await getList()
  } catch (error: any) {
    message.error(`导入失败：${error.message || ''}`)
  } finally {
    instance.close()
    target.value = ''
  }
}
onMounted(getList)
</script>
