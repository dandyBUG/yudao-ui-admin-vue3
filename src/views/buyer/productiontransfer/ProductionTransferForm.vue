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
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="formData.materialCode" placeholder="请输入物料编码" />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input v-model="formData.materialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="生产调度员" prop="productionScheduler">
        <el-input v-model="formData.productionScheduler" placeholder="请输入生产调度员" />
      </el-form-item>
      <el-form-item label="转序发起人" prop="transferInitiator">
        <el-input v-model="formData.transferInitiator" placeholder="请输入转序发起人" />
      </el-form-item>
      <el-form-item label="发起日期" prop="initiatorDate">
        <el-date-picker
          v-model="formData.initiatorDate"
          type="date"
          value-format="x"
          placeholder="选择发起日期"
        />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="转序单号" prop="transferNo">
        <el-input v-model="formData.transferNo" placeholder="请输入转序单号" />
      </el-form-item>
      <el-form-item label="计划批次" prop="batchNo">
        <el-input v-model="formData.batchNo" placeholder="请输入计划批次" />
      </el-form-item>
      <el-form-item label="签收人" prop="signer">
        <el-input v-model="formData.signer" placeholder="请输入签收人" />
      </el-form-item>
      <el-form-item label="签收时间" prop="signTime">
        <el-date-picker
          v-model="formData.signTime"
          type="date"
          value-format="x"
          placeholder="选择签收时间"
        />
      </el-form-item>
      <el-form-item label="创建者" prop="createBy">
        <el-input v-model="formData.createBy" placeholder="请输入创建者" />
      </el-form-item>
      <el-form-item label="更新者" prop="updateBy">
        <el-input v-model="formData.updateBy" placeholder="请输入更新者" />
      </el-form-item>
      <el-form-item label="删除标志（0存在 2删除）" prop="delFlag">
        <el-input v-model="formData.delFlag" placeholder="请输入删除标志（0存在 2删除）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProductionTransferApi, ProductionTransferVO } from '@/api/buyer/productiontransfer'

/** MES转序单信息 表单 */
defineOptions({ name: 'ProductionTransferForm' })

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
  productionScheduler: undefined,
  transferInitiator: undefined,
  initiatorDate: undefined,
  quantity: undefined,
  transferNo: undefined,
  batchNo: undefined,
  signer: undefined,
  signTime: undefined,
  createBy: undefined,
  updateBy: undefined,
  delFlag: undefined,
})
const formRules = reactive({
  orderNo: [{ required: true, message: '订单号不能为空', trigger: 'blur' }],
  materialCode: [{ required: true, message: '物料编码不能为空', trigger: 'blur' }],
  delFlag: [{ required: true, message: '删除标志（0存在 2删除）不能为空', trigger: 'blur' }],
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
      formData.value = await ProductionTransferApi.getProductionTransfer(id)
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
    const data = formData.value as unknown as ProductionTransferVO
    if (formType.value === 'create') {
      await ProductionTransferApi.createProductionTransfer(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductionTransferApi.updateProductionTransfer(data)
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
    productionScheduler: undefined,
    transferInitiator: undefined,
    initiatorDate: undefined,
    quantity: undefined,
    transferNo: undefined,
    batchNo: undefined,
    signer: undefined,
    signTime: undefined,
    createBy: undefined,
    updateBy: undefined,
    delFlag: undefined,
  }
  formRef.value?.resetFields()
}
</script>