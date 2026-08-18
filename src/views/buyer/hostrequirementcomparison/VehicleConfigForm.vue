<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="2026-2-12版本" prop="chassisOnlinePlanDate">
            <el-date-picker v-model="formData.chassisOnlinePlanDate" type="datetime" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型" prop="vehicleModel">
            <el-input v-model="formData.vehicleModel" placeholder="请输入车型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出产顺序" prop="productionOrder">
            <el-input v-model="formData.productionOrder" placeholder="例如 2025-84-84" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="中联订单号" prop="bareMachineOrderNo">
            <el-input v-model="formData.bareMachineOrderNo" placeholder="请输入中联订单号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="底盘订单号" prop="drivingUnitOrderNo">
            <el-input v-model="formData.drivingUnitOrderNo" placeholder="请输入底盘订单号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配额2026.1.25" prop="quota1">
            <el-input-number v-model="formData.quota1" :min="0" :precision="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配额2026.2.13" prop="quota2">
            <el-input-number v-model="formData.quota2" :min="0" :precision="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="台套" prop="unitQuantity">
            <el-input-number v-model="formData.unitQuantity" :min="0" :precision="3" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="2026-1-20版本" prop="versionDate">
            <el-date-picker v-model="formData.versionDate" type="datetime" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分解油缸" prop="cylinderName">
            <el-input v-model="formData.cylinderName" placeholder="请输入分解油缸" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主机图号" prop="materialNo">
            <el-input v-model="formData.materialNo" placeholder="请输入主机图号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特力图号" prop="teliCode">
            <el-input v-model="formData.teliCode" placeholder="请输入特力图号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置" prop="config">
            <el-input-number v-model="formData.config" :min="0" :precision="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需配数量" prop="requiredQuantity">
            <el-input-number v-model="formData.requiredQuantity" :min="0" :precision="3" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="领料日期" prop="pickingDate">
            <el-date-picker v-model="formData.pickingDate" type="datetime" placeholder="选择日期" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已领" prop="pickedQuantity">
            <el-input-number v-model="formData.pickedQuantity" :min="0" :precision="3" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实欠数" prop="actualOweQuantity">
            <el-input-number v-model="formData.actualOweQuantity" :min="0" :precision="3" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结否" prop="closedStatus">
            <el-select v-model="formData.closedStatus" placeholder="请选择" style="width: 100%">
              <el-option label="否" value="否" />
              <el-option label="结" value="结" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="category">
            <el-input v-model="formData.category" placeholder="请输入分类" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主机计划下达时间" prop="hostPlanReleaseTime">
            <el-input v-model="formData.hostPlanReleaseTime" type="textarea" :rows="2" placeholder="请输入主机计划下达时间" />
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
  chassisOnlinePlanDate: undefined,
  vehicleModel: undefined,
  productionOrder: undefined,
  bareMachineOrderNo: undefined,
  drivingUnitOrderNo: undefined,
  quota1: undefined,
  quota2: undefined,
  unitQuantity: undefined,
  versionDate: undefined,
  cylinderName: undefined,
  materialNo: undefined,
  teliCode: undefined,
  config: undefined,
  requiredQuantity: undefined,
  pickingDate: undefined,
  pickedQuantity: undefined,
  actualOweQuantity: undefined,
  closedStatus: undefined,
  category: undefined,
  hostPlanReleaseTime: undefined,
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
    chassisOnlinePlanDate: undefined,
    vehicleModel: undefined,
    productionOrder: undefined,
    bareMachineOrderNo: undefined,
    drivingUnitOrderNo: undefined,
    quota1: undefined,
    quota2: undefined,
    unitQuantity: undefined,
    versionDate: undefined,
    cylinderName: undefined,
    materialNo: undefined,
    teliCode: undefined,
    config: undefined,
    requiredQuantity: undefined,
    pickingDate: undefined,
    pickedQuantity: undefined,
    actualOweQuantity: undefined,
    closedStatus: undefined,
    category: undefined,
    hostPlanReleaseTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
