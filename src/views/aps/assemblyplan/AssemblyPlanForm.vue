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
      <el-form-item label="物料编号" prop="materialCode">
        <el-input v-model="formData.materialCode" placeholder="请输入物料编号" />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input v-model="formData.materialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="装配数量（计划数）" prop="assemblyQuantity">
        <el-input v-model="formData.assemblyQuantity" placeholder="请输入装配数量（计划数）" />
      </el-form-item>
      <el-form-item label="已装配数量（完成数）" prop="assembledQuantity">
        <el-input v-model="formData.assembledQuantity" placeholder="请输入已装配数量（完成数）" />
      </el-form-item>
      <el-form-item label="排产时间" prop="scheduleTime">
        <el-date-picker
          v-model="formData.scheduleTime"
          type="date"
          value-format="x"
          placeholder="选择排产时间"
        />
      </el-form-item>
      <el-form-item label="车间" prop="workshop">
        <el-input v-model="formData.workshop" placeholder="请输入车间" />
      </el-form-item>
      <el-form-item label="导入时间" prop="importTime">
        <el-date-picker
          v-model="formData.importTime"
          type="date"
          value-format="x"
          placeholder="选择导入时间"
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
import { AssemblyPlanApi, AssemblyPlanVO } from '@/api/aps/assemblyplan'

/** 各车间开装计划 表单 */
defineOptions({ name: 'AssemblyPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderNo: undefined,
  materialCode: undefined,
  materialDesc: undefined,
  assemblyQuantity: undefined,
  assembledQuantity: undefined,
  scheduleTime: undefined,
  workshop: undefined,
  importTime: undefined,
})
const formRules = reactive({
  orderNo: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
  materialCode: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  assemblyQuantity: [{ required: true, message: '装配数量（计划数）不能为空', trigger: 'blur' }],
  assembledQuantity: [{ required: true, message: '已装配数量（完成数）不能为空', trigger: 'blur' }],
  scheduleTime: [{ required: true, message: '排产时间不能为空', trigger: 'blur' }],
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
      formData.value = await AssemblyPlanApi.getAssemblyPlan(id)
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
    const data = formData.value as unknown as AssemblyPlanVO
    if (formType.value === 'create') {
      await AssemblyPlanApi.createAssemblyPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await AssemblyPlanApi.updateAssemblyPlan(data)
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
    id: undefined,
    orderNo: undefined,
    materialCode: undefined,
    materialDesc: undefined,
    assemblyQuantity: undefined,
    assembledQuantity: undefined,
    scheduleTime: undefined,
    workshop: undefined,
    importTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>