<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单日期" prop="orderDate">
        <el-date-picker
          v-model="formData.orderDate"
          type="date"
          value-format="x"
          placeholder="选择订单日期"
        />
      </el-form-item>
      <el-form-item label="采购订单号" prop="buyerOrderNo">
        <el-input v-model="formData.buyerOrderNo" placeholder="请输入采购订单号" />
      </el-form-item>
      <el-form-item label="订单行项目" prop="lineItem">
        <el-input v-model="formData.lineItem" placeholder="请输入订单行项目" />
      </el-form-item>
      <el-form-item label="物料号" prop="materialNo">
        <el-input v-model="formData.materialNo" placeholder="请输入物料号" />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input v-model="formData.materialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="订单数量" prop="orderQty">
        <el-input v-model="formData.orderQty" placeholder="请输入订单数量" />
      </el-form-item>
      <el-form-item label="实收数量" prop="receivedQty">
        <el-input v-model="formData.receivedQty" placeholder="请输入实收数量" />
      </el-form-item>
      <el-form-item label="未清数量" prop="openQty">
        <el-input v-model="formData.openQty" placeholder="请输入未清数量" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="formData.unit" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="要求到货日期" prop="requiredArrivalDate">
        <el-date-picker
          v-model="formData.requiredArrivalDate"
          type="date"
          value-format="x"
          placeholder="选择要求到货日期"
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
      <el-form-item label="供应商描述" prop="supplierDesc">
        <el-input v-model="formData.supplierDesc" placeholder="请输入供应商描述" />
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="formData.customer" placeholder="请输入客户" />
      </el-form-item>
      <el-form-item label="采购组" prop="buyerGroup">
        <el-input v-model="formData.buyerGroup" placeholder="请输入采购组" />
      </el-form-item>
      <el-form-item label="凭证类型" prop="documentType">
        <el-select v-model="formData.documentType" placeholder="请选择凭证类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="生产订单号" prop="productionOrderNo">
        <el-input v-model="formData.productionOrderNo" placeholder="请输入生产订单号" />
      </el-form-item>
      <el-form-item label="品牌信息" prop="brandInfo">
        <el-input v-model="formData.brandInfo" placeholder="请输入品牌信息" />
      </el-form-item>
      <el-form-item label="单价（净价）" prop="unitPrice">
        <el-input v-model="formData.unitPrice" placeholder="请输入单价（净价）" />
      </el-form-item>
      <el-form-item label="供应商代码" prop="supplierCode">
        <el-input v-model="formData.supplierCode" placeholder="请输入供应商代码" />
      </el-form-item>
      <el-form-item label="收货仓库" prop="receivingWarehouse">
        <el-input v-model="formData.receivingWarehouse" placeholder="请输入收货仓库" />
      </el-form-item>
      <el-form-item label="合计金额（净价）" prop="totalAmount">
        <el-input v-model="formData.totalAmount" placeholder="请输入合计金额（净价）" />
      </el-form-item>
      <el-form-item label="采购申请" prop="buyerReqNo">
        <el-input v-model="formData.buyerReqNo" placeholder="请输入采购申请" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OpenOrderApi, OpenOrderVO } from '@/api/buyer/openorder'

/** 采购未清订单 表单 */
defineOptions({ name: 'OpenOrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderDate: undefined,
  buyerOrderNo: undefined,
  lineItem: undefined,
  materialNo: undefined,
  materialDesc: undefined,
  orderQty: undefined,
  receivedQty: undefined,
  openQty: undefined,
  unit: undefined,
  requiredArrivalDate: undefined,
  actualArrivalDate: undefined,
  supplierDesc: undefined,
  customer: undefined,
  buyerGroup: undefined,
  documentType: undefined,
  productionOrderNo: undefined,
  brandInfo: undefined,
  unitPrice: undefined,
  supplierCode: undefined,
  receivingWarehouse: undefined,
  totalAmount: undefined,
  buyerReqNo: undefined,
})
const formRules = reactive({
  buyerOrderNo: [{ required: true, message: '采购订单号不能为空', trigger: 'blur' }],
  lineItem: [{ required: true, message: '订单行项目不能为空', trigger: 'blur' }],
  materialNo: [{ required: true, message: '物料号不能为空', trigger: 'blur' }],
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
      formData.value = await OpenOrderApi.getOpenOrder(id)
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
    const data = formData.value as unknown as OpenOrderVO
    if (formType.value === 'create') {
      await OpenOrderApi.createOpenOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await OpenOrderApi.updateOpenOrder(data)
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
    orderDate: undefined,
    buyerOrderNo: undefined,
    lineItem: undefined,
    materialNo: undefined,
    materialDesc: undefined,
    orderQty: undefined,
    receivedQty: undefined,
    openQty: undefined,
    unit: undefined,
    requiredArrivalDate: undefined,
    actualArrivalDate: undefined,
    supplierDesc: undefined,
    customer: undefined,
    buyerGroup: undefined,
    documentType: undefined,
    productionOrderNo: undefined,
    brandInfo: undefined,
    unitPrice: undefined,
    supplierCode: undefined,
    receivingWarehouse: undefined,
    totalAmount: undefined,
    buyerReqNo: undefined,
  }
  formRef.value?.resetFields()
}
</script>