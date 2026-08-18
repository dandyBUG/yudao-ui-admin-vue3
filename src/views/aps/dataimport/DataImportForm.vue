<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="主计划单号" prop="danhao">
        <el-input v-model="formData.danhao" placeholder="请输入主计划单号" />
      </el-form-item>
      <el-form-item label="总成图号" prop="productCode">
        <el-input v-model="formData.productCode" placeholder="请输入总成图号" />
      </el-form-item>
      <el-form-item label="总成数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入总成数量" />
      </el-form-item>
      <el-form-item label="创建订单日期" prop="orderDate">
        <el-date-picker
          v-model="formData.orderDate"
          type="date"
          value-format="x"
          placeholder="选择创建订单日期"
        />
      </el-form-item>
      <el-form-item label="主计划完成日期" prop="eventTime">
        <el-date-picker
          v-model="formData.eventTime"
          type="date"
          value-format="x"
          placeholder="选择主计划完成日期"
        />
      </el-form-item>
      <el-form-item label="状态（0=正常，1=停用）" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DataImportApi, DataImportVO } from '@/api/aps/dataimport'

/** 营销数据导入 表单 */
defineOptions({ name: 'DataImportForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  danhao: undefined,
  productCode: undefined,
  quantity: undefined,
  orderDate: undefined,
  eventTime: undefined,
  status: undefined,
  remark: undefined,
})
const formRules = reactive({
  danhao: [{ required: true, message: '主计划单号不能为空', trigger: 'blur' }],
  productCode: [{ required: true, message: '总成图号不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '总成数量不能为空', trigger: 'blur' }],
  eventTime: [{ required: true, message: '主计划完成日期不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态（0=正常，1=停用）不能为空', trigger: 'blur' }],
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
      formData.value = await DataImportApi.getDataImport(id)
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
    const data = formData.value as unknown as DataImportVO
    if (formType.value === 'create') {
      await DataImportApi.createDataImport(data)
      message.success(t('common.createSuccess'))
    } else {
      await DataImportApi.updateDataImport(data)
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
    danhao: undefined,
    productCode: undefined,
    quantity: undefined,
    orderDate: undefined,
    eventTime: undefined,
    status: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>