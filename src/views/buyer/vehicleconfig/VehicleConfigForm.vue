<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="800px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="formData.orderNo" placeholder="请输入订单号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型" prop="vehicleModel">
            <el-input v-model="formData.vehicleModel" placeholder="请输入车型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="2025年顺序号" prop="seqNo2025">
            <el-input v-model="formData.seqNo2025" placeholder="请输入2025年顺序号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="2026年顺序号" prop="seqNo2026">
            <el-input v-model="formData.seqNo2026" placeholder="请输入2026年顺序号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="要求到货时间" prop="requiredArrivalTime">
            <el-input v-model="formData.requiredArrivalTime" placeholder="请输入要求到货时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料描述" prop="materialDesc">
            <el-input v-model="formData.materialDesc" placeholder="请输入物料描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配额1" prop="quota1">
            <el-input-number v-model="formData.quota1" :min="0" :precision="0" placeholder="配额1" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配额2" prop="quota2">
            <el-input-number v-model="formData.quota2" :min="0" :precision="0" placeholder="配额2" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料号" prop="materialNo">
            <el-input v-model="formData.materialNo" placeholder="请输入物料号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工厂" prop="factory">
            <el-input v-model="formData.factory" placeholder="请输入工厂" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需求数量" prop="requiredQuantity">
            <el-input-number v-model="formData.requiredQuantity" :min="0" :precision="3" placeholder="需求数量" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已交货数量" prop="deliveredQuantity">
            <el-input-number v-model="formData.deliveredQuantity" :min="0" :precision="3" placeholder="已交货数量" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { VehicleConfigApi, VehicleConfigVO } from '@/api/buyer/vehicleconfig'

defineOptions({ name: 'VehicleConfigForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<Partial<VehicleConfigVO>>({
  id: undefined,
  orderNo: undefined,
  vehicleModel: undefined,
  seqNo2025: undefined,
  seqNo2026: undefined,
  requiredArrivalTime: undefined,
  materialDesc: undefined,
  quota1: undefined,
  quota2: undefined,
  materialNo: undefined,
  factory: undefined,
  requiredQuantity: undefined,
  deliveredQuantity: undefined,
})
const formRules = reactive({
  // 可根据需要添加必填校验
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      const res = await VehicleConfigApi.getVehicleConfig(id)
      formData.value = { ...res }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value as VehicleConfigVO
    if (formType.value === 'create') {
      await VehicleConfigApi.createVehicleConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await VehicleConfigApi.updateVehicleConfig(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    orderNo: undefined,
    vehicleModel: undefined,
    seqNo2025: undefined,
    seqNo2026: undefined,
    requiredArrivalTime: undefined,
    materialDesc: undefined,
    quota1: undefined,
    quota2: undefined,
    materialNo: undefined,
    factory: undefined,
    requiredQuantity: undefined,
    deliveredQuantity: undefined,
  }
  formRef.value?.resetFields()
}
</script>
