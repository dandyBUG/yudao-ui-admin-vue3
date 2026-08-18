<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="总成订单号" prop="orderNo">
        <el-input v-model="formData.orderNo" placeholder="请输入总成订单号" />
      </el-form-item>
      <el-form-item label="总成数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入总成数量" />
      </el-form-item>
      <el-form-item label="零部件订单号" prop="componentOrder">
        <el-input v-model="formData.componentOrder" placeholder="请输入零部件订单号" />
      </el-form-item>
      <el-form-item label="零部件数量" prop="allocQty">
        <el-input v-model="formData.allocQty" placeholder="请输入零部件数量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AssemPartApi, AssemPartVO } from '@/api/aps/assempart'

/** 总成与子件关联表管理 表单 */
defineOptions({ name: 'AssemPartForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  orderNo: undefined,
  quantity: undefined,
  componentOrder: undefined,
  allocQty: undefined,
  id: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AssemPartApi.getAssemPart(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AssemPartVO
    if (formType.value === 'create') {
      await AssemPartApi.createAssemPart(data)
      message.success(t('common.createSuccess'))
    } else {
      await AssemPartApi.updateAssemPart(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    orderNo: undefined,
    quantity: undefined,
    componentOrder: undefined,
    allocQty: undefined,
    id: undefined,
  }
  formRef.value?.resetFields()
}
</script>
