<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="formData.orderNo" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="排产时间" prop="scheduleTime">
        <el-date-picker
          v-model="formData.scheduleTime"
          type="date"
          value-format="x"
          placeholder="选择排产时间"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="采购物料" prop="purchaseMaterial">
        <el-input v-model="formData.purchaseMaterial" placeholder="请输入采购物料" />
      </el-form-item>
      <el-form-item label="反馈备注" prop="feedbackRemark">
        <el-input
          v-model="formData.feedbackRemark"
          type="textarea"
          :rows="4"
          placeholder="请输入采购反馈备注"
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
import { PurchaseFeedbackApi, PurchaseFeedbackVO } from '@/api/aps/purchasefeedback'

defineOptions({ name: 'PurchaseFeedbackForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('') // 'create' 或 'update'
const formData = ref<PurchaseFeedbackVO>({
  id: undefined,
  orderNo: '',
  scheduleTime: undefined,
  purchaseMaterial: '',
  feedbackRemark: '',
})

const formRules = {
  orderNo: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
}

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
      const data = await PurchaseFeedbackApi.get(id)
      formData.value = data
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await PurchaseFeedbackApi.create(formData.value)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseFeedbackApi.update(formData.value)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    orderNo: '',
    scheduleTime: undefined,
    purchaseMaterial: '',
    feedbackRemark: '',
  }
  formRef.value?.resetFields()
}
</script>
