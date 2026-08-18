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
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="formData.materialCode" placeholder="请输入物料编码" />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input v-model="formData.materialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="责任车间（总成）" prop="workshop">
        <el-input v-model="formData.workshop" placeholder="请输入责任车间（总成）" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="已完成数量" prop="completedQuantity">
        <el-input v-model="formData.completedQuantity" placeholder="请输入已完成数量" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" placeholder="请输入库存" />
      </el-form-item>
      <el-form-item label="转序（数量）" prop="transferOrder">
        <el-input v-model="formData.transferOrder" placeholder="请输入转序（数量）" />
      </el-form-item>
      <el-form-item label="零部件订单" prop="componentOrder">
        <el-input v-model="formData.componentOrder" placeholder="请输入零部件订单" />
      </el-form-item>
      <el-form-item label="零部件编码" prop="componentCode">
        <el-input v-model="formData.componentCode" placeholder="请输入零部件编码" />
      </el-form-item>
      <el-form-item label="零部件描述" prop="componentDesc">
        <el-input v-model="formData.componentDesc" placeholder="请输入零部件描述" />
      </el-form-item>
      <el-form-item label="责任车间（零部件）" prop="componentWorkshop">
        <el-input v-model="formData.componentWorkshop" placeholder="请输入责任车间（零部件）" />
      </el-form-item>
      <el-form-item label="基本开始日期" prop="basicStartDate">
        <el-date-picker
          v-model="formData.basicStartDate"
          type="date"
          value-format="x"
          placeholder="选择基本开始日期"
        />
      </el-form-item>
      <el-form-item label="需求数量（零部件）" prop="requiredQuantity">
        <el-input v-model="formData.requiredQuantity" placeholder="请输入需求数量（零部件）" />
      </el-form-item>
      <el-form-item label="本次未完成数量" prop="unfinishedQuantity">
        <el-input v-model="formData.unfinishedQuantity" placeholder="请输入本次未完成数量" />
      </el-form-item>
      <el-form-item label="采购物料" prop="purchaseMaterial">
        <el-input v-model="formData.purchaseMaterial" placeholder="请输入采购物料" />
      </el-form-item>
      <el-form-item label="采购物料描述" prop="purchaseMaterialDesc">
        <el-input v-model="formData.purchaseMaterialDesc" placeholder="请输入采购物料描述" />
      </el-form-item>
      <el-form-item label="需求数量（采购）" prop="purchaseRequiredQty">
        <el-input v-model="formData.purchaseRequiredQty" placeholder="请输入需求数量（采购）" />
      </el-form-item>
      <el-form-item label="已配送数量" prop="deliveredQuantity">
        <el-input v-model="formData.deliveredQuantity" placeholder="请输入已配送数量" />
      </el-form-item>
      <el-form-item label="待配送数量" prop="toDeliverQuantity">
        <el-input v-model="formData.toDeliverQuantity" placeholder="请输入待配送数量" />
      </el-form-item>
      <el-form-item label="采购订单" prop="purchaseOrder">
        <el-input v-model="formData.purchaseOrder" placeholder="请输入采购订单" />
      </el-form-item>
      <el-form-item label="行号" prop="lineNumber">
        <el-input v-model="formData.lineNumber" placeholder="请输入行号" />
      </el-form-item>
      <el-form-item label="下单日期" prop="orderDate">
        <el-date-picker
          v-model="formData.orderDate"
          type="date"
          value-format="x"
          placeholder="选择下单日期"
        />
      </el-form-item>
      <el-form-item label="要求交货日期" prop="requiredDeliveryDate">
        <el-date-picker
          v-model="formData.requiredDeliveryDate"
          type="date"
          value-format="x"
          placeholder="选择要求交货日期"
        />
      </el-form-item>
      <el-form-item label="实际到货日期" prop="actualArrivalDate">
        <el-date-picker
          v-model="formData.actualArrivalDate"
          type="date"
          value-format="x"
          placeholder="选择实际到货日期"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="formData.supplierName" placeholder="请输入供应商名称" />
      </el-form-item>
      <el-form-item label="未清订单数量" prop="openOrderQuantity">
        <el-input v-model="formData.openOrderQuantity" placeholder="请输入未清订单数量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MatchingResultApi, MatchingResultVO } from '@/api/aps/matchingresult'

/** 主计划物料需求匹配 表单 */
defineOptions({ name: 'MatchingResultForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderNo: undefined,
  scheduleTime: undefined,
  materialCode: undefined,
  materialDesc: undefined,
  workshop: undefined,
  quantity: undefined,
  completedQuantity: undefined,
  stock: undefined,
  transferOrder: undefined,
  componentOrder: undefined,
  componentCode: undefined,
  componentDesc: undefined,
  componentWorkshop: undefined,
  basicStartDate: undefined,
  requiredQuantity: undefined,
  unfinishedQuantity: undefined,
  purchaseMaterial: undefined,
  purchaseMaterialDesc: undefined,
  purchaseRequiredQty: undefined,
  deliveredQuantity: undefined,
  toDeliverQuantity: undefined,
  purchaseOrder: undefined,
  lineNumber: undefined,
  orderDate: undefined,
  requiredDeliveryDate: undefined,
  actualArrivalDate: undefined,
  supplierName: undefined,
  openOrderQuantity: undefined,
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
      formData.value = await MatchingResultApi.getMatchingResult(id)
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
    const data = formData.value as unknown as MatchingResultVO
    if (formType.value === 'create') {
      await MatchingResultApi.createMatchingResult(data)
      message.success(t('common.createSuccess'))
    } else {
      await MatchingResultApi.updateMatchingResult(data)
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
    scheduleTime: undefined,
    materialCode: undefined,
    materialDesc: undefined,
    workshop: undefined,
    quantity: undefined,
    completedQuantity: undefined,
    stock: undefined,
    transferOrder: undefined,
    componentOrder: undefined,
    componentCode: undefined,
    componentDesc: undefined,
    componentWorkshop: undefined,
    basicStartDate: undefined,
    requiredQuantity: undefined,
    unfinishedQuantity: undefined,
    purchaseMaterial: undefined,
    purchaseMaterialDesc: undefined,
    purchaseRequiredQty: undefined,
    deliveredQuantity: undefined,
    toDeliverQuantity: undefined,
    purchaseOrder: undefined,
    lineNumber: undefined,
    orderDate: undefined,
    requiredDeliveryDate: undefined,
    actualArrivalDate: undefined,
    supplierName: undefined,
    openOrderQuantity: undefined,
  }
  formRef.value?.resetFields()
}
</script>