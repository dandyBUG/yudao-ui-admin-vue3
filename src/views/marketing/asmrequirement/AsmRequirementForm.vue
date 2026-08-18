<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!-- 新增：主机单位 -->
      <el-form-item label="主机单位" prop="hostUnit">
        <el-input v-model="formData.hostUnit" placeholder="请输入主机单位" />
      </el-form-item>
      <!-- 新增：车型 -->
      <el-form-item label="车型" prop="vehicleModel">
        <el-input v-model="formData.vehicleModel" placeholder="请输入车型" />
      </el-form-item>
      <el-form-item label="总成物料编码" prop="assemblyMaterialNo">
        <el-input v-model="formData.assemblyMaterialNo" placeholder="请输入总成物料编码" />
      </el-form-item>
      <el-form-item label="总成物料名称" prop="mainMaterialDesc">
        <el-input v-model="formData.mainMaterialDesc" placeholder="请输入总成物料名称" />
      </el-form-item>
      <el-form-item label="需求数量" prop="requireQuantity">
        <el-input v-model="formData.requireQuantity" placeholder="请输入需求数量" />
      </el-form-item>
      <el-form-item label="需求日期" prop="requireDate">
        <el-date-picker
          v-model="formData.requireDate"
          type="date"
          value-format="x"
          placeholder="选择需求日期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AsmRequirementApi, AsmRequirementVO } from '@/api/marketing/asmrequirement'

/** 营销总成需求 表单 */
defineOptions({ name: 'AsmRequirementForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  hostUnit: undefined,           // 新增
  vehicleModel: undefined,       // 新增
  assemblyMaterialNo: undefined,
  mainMaterialDesc: undefined,
  requireQuantity: undefined,
  requireDate: undefined,
})
const formRules = reactive({
  assemblyMaterialNo: [{ required: true, message: '总成物料编码不能为空', trigger: 'blur' }],
  requireDate: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
})
const formRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      const data = await AsmRequirementApi.getAsmRequirement(id)
      formData.value = data
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
    const data = formData.value as unknown as AsmRequirementVO
    if (formType.value === 'create') {
      await AsmRequirementApi.createAsmRequirement(data)
      message.success(t('common.createSuccess'))
    } else {
      await AsmRequirementApi.updateAsmRequirement(data)
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
    hostUnit: undefined,
    vehicleModel: undefined,
    assemblyMaterialNo: undefined,
    mainMaterialDesc: undefined,
    requireQuantity: undefined,
    requireDate: undefined,
  }
  formRef.value?.resetFields()
}
</script>
