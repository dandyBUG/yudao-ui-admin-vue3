<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="110px">
      <el-row :gutter="20">
        <el-col v-for="field in textFields" :key="field.prop" :span="12">
          <el-form-item :label="field.label" :prop="field.prop">
            <el-input v-model="formData[field.prop]" :placeholder="`请输入${field.label}`" />
          </el-form-item>
        </el-col>
        <el-col v-for="field in numberFields" :key="field.prop" :span="12">
          <el-form-item :label="field.label" :prop="field.prop">
            <el-input-number v-model="formData[field.prop]" :precision="0" controls-position="right" :placeholder="`请输入${field.label}`" class="!w-100%" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" :disabled="formLoading" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { OverseasInventoryApi, OverseasInventoryVO } from '@/api/buyer/overseasinventory'

defineOptions({ name: 'OverseasInventoryForm' })
const textFields: Array<{ label: string; prop: string }> = [
  { label: '货主代码', prop: 'ownerCode' },
  { label: '供应商代码', prop: 'supplierCode' }, { label: '供应商名称', prop: 'supplierName' },
  { label: '货品编码', prop: 'itemCode' }, { label: '货品名称', prop: 'itemName' },
  { label: '货品规格', prop: 'itemSpecification' }
]
const numberFields: Array<{ label: string; prop: string }> = [
  { label: '库存数量', prop: 'inventoryQuantity' }, { label: '占用数量', prop: 'occupiedQuantity' },
  { label: '可用量', prop: 'availableQuantity' }, { label: '冻结数量', prop: 'frozenQuantity' }
]
const { t } = useI18n()
const message = useMessage()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formRef = ref()
const formData = ref<Record<string, any>>({})
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t(`action.${type}`)
  formType.value = type
  formData.value = {}
  formRef.value?.resetFields()
  if (id) {
    formLoading.value = true
    try { formData.value = await OverseasInventoryApi.get(id) } finally { formLoading.value = false }
  }
}
defineExpose({ open })
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await OverseasInventoryApi.create(formData.value as OverseasInventoryVO)
      message.success(t('common.createSuccess'))
    } else {
      await OverseasInventoryApi.update(formData.value as OverseasInventoryVO)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally { formLoading.value = false }
}
</script>
