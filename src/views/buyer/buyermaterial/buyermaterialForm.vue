<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="需求物料" prop="reqMaterial">
        <el-input v-model="formData.reqMaterial" placeholder="请输入需求物料" />
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="formData.customer" placeholder="请输入客户" />
      </el-form-item>
      <el-form-item label="车型" prop="vehicleModel">
        <el-input v-model="formData.vehicleModel" placeholder="请输入车型" />
      </el-form-item>
      <el-form-item label="总成需求数量" prop="assemblyQty">
        <el-input v-model="formData.assemblyQty" placeholder="请输入总成需求数量" />
      </el-form-item>
      <el-form-item label="采购子件物料" prop="compMaterial">
        <el-input v-model="formData.compMaterial" placeholder="请输入采购子件物料" />
      </el-form-item>
      <el-form-item label="采购子件描述" prop="compDesc">
        <el-input v-model="formData.compDesc" placeholder="请输入采购子件描述" />
      </el-form-item>
      <el-form-item label="规格型号" prop="specModel">
        <el-input v-model="formData.specModel" placeholder="请输入规格型号" />
      </el-form-item>
      <el-form-item label="单台用量" prop="unitUsage">
        <el-input v-model="formData.unitUsage" placeholder="请输入单台用量" />
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-input v-model="formData.supplier" placeholder="请输入供应商" />
      </el-form-item>
      <el-form-item label="采购员" prop="buyer">
        <el-input v-model="formData.buyer" placeholder="请输入采购员" />
      </el-form-item>
      <el-form-item label="需求月份" prop="demandMonth">
        <el-date-picker
          v-model="formData.demandMonth"
          type="month"
          value-format="YYYY-MM"
          placeholder="选择需求月份"
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
//import { BuyerMaterialApi, BuyerMaterialVO } from '@/api/buyer/buyermaterial'
/** 备件查询 表单 */
defineOptions({ name: 'BuyerMaterialForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  reqMaterial: undefined,
  customer: undefined,
  vehicleModel: undefined,
  assemblyQty: undefined,
  compMaterial: undefined,
  compDesc: undefined,
  specModel: undefined,
  unitUsage: undefined,
  compDemandQty: undefined,
  preparedQty: undefined,
  stockQty: undefined,
  difference: undefined,
  stockStatus: undefined,
  supplier: undefined,
  buyer: undefined,
  procGroup: undefined,
  demandMonth: undefined,
})
const formRules = reactive({
  reqMaterial: [{ required: true, message: '需求物料不能为空', trigger: 'blur' }],
  customer: [{ required: true, message: '客户不能为空', trigger: 'blur' }],
  compMaterial: [{ required: true, message: '采购子件物料不能为空', trigger: 'blur' }],
  supplier: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
  buyer: [{ required: true, message: '采购员不能为空', trigger: 'blur' }],
  demandMonth: [{ required: true, message: '需求月份不能为空', trigger: 'blur' }],
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
      formData.value = await BuyerMaterialApi.getBuyerMaterial(id)
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
    const data = formData.value as unknown as BuyerMaterialVO
    if (formType.value === 'create') {
      await BuyerMaterialApi.createBuyerMaterial(data)
      message.success(t('common.createSuccess'))
    } else {
      await BuyerMaterialApi.updateBuyerMaterial(data)
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
    reqMaterial: undefined,
    customer: undefined,
    vehicleModel: undefined,
    assemblyQty: undefined,
    compMaterial: undefined,
    compDesc: undefined,
    specModel: undefined,
    unitUsage: undefined,
    compDemandQty: undefined,
    preparedQty: undefined,
    preparedQty: undefined,
    preparedQty: undefined,
    preparedQty: undefined,
    preparedQty: undefined,
    stockQty: undefined,
    difference: undefined,
    stockStatus: undefined,
    supplier: undefined,
    buyer: undefined,
    procGroup: undefined,
    demandMonth: undefined,
  }
  formRef.value?.resetFields()
}
</script>
