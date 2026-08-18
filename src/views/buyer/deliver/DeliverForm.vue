<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="工厂" prop="plant">
        <el-input v-model="formData.plant" placeholder="请输入工厂" />
      </el-form-item>
      <el-form-item label="配送单号" prop="deliveryOrderNo">
        <el-input v-model="formData.deliveryOrderNo" placeholder="请输入配送单号" />
      </el-form-item>
      <el-form-item label="配送日期" prop="deliveryDate">
        <el-date-picker
          v-model="formData.deliveryDate"
          type="date"
          value-format="x"
          placeholder="选择配送日期"
        />
      </el-form-item>
      <el-form-item label="创建日期（业务）" prop="creationDate">
        <el-date-picker
          v-model="formData.creationDate"
          type="date"
          value-format="x"
          placeholder="选择创建日期（业务）"
        />
      </el-form-item>
      <el-form-item label="创建时间（业务）" prop="creationTime">
        <el-date-picker
          v-model="formData.creationTime"
          type="date"
          value-format="x"
          placeholder="选择创建时间（业务）"
        />
      </el-form-item>
      <el-form-item label="创建人（业务）" prop="createdBy">
        <el-input v-model="formData.createdBy" placeholder="请输入创建人（业务）" />
      </el-form-item>
      <el-form-item label="最后更新日期（业务）" prop="lastUpdateDate">
        <el-date-picker
          v-model="formData.lastUpdateDate"
          type="date"
          value-format="x"
          placeholder="选择最后更新日期（业务）"
        />
      </el-form-item>
      <el-form-item label="最后更新时间（业务）" prop="lastUpdateTime">
        <el-date-picker
          v-model="formData.lastUpdateTime"
          type="date"
          value-format="x"
          placeholder="选择最后更新时间（业务）"
        />
      </el-form-item>
      <el-form-item label="最后更新人（业务）" prop="lastUpdatedBy">
        <el-input v-model="formData.lastUpdatedBy" placeholder="请输入最后更新人（业务）" />
      </el-form-item>
      <el-form-item label="生产订单号" prop="partOrderNo">
        <el-input v-model="formData.partOrderNo" placeholder="请输入生产订单号" />
      </el-form-item>
      <el-form-item label="生产调度员" prop="productionWorkshop">
        <el-input v-model="formData.productionWorkshop" placeholder="请输入生产调度员" />
      </el-form-item>
      <el-form-item label="主物料编码" prop="partMatCode">
        <el-input v-model="formData.partMatCode" placeholder="请输入主物料编码" />
      </el-form-item>
      <el-form-item label="主物料描述" prop="partMatDesc">
        <el-input v-model="formData.partMatDesc" placeholder="请输入主物料描述" />
      </el-form-item>
      <el-form-item label="预留号" prop="reservationNo">
        <el-input v-model="formData.reservationNo" placeholder="请输入预留号" />
      </el-form-item>
      <el-form-item label="预留项目" prop="reservationItem">
        <el-input v-model="formData.reservationItem" placeholder="请输入预留项目" />
      </el-form-item>
      <el-form-item label="应发数量" prop="plannedIssueQty">
        <el-input v-model="formData.plannedIssueQty" placeholder="请输入应发数量" />
      </el-form-item>
      <el-form-item label="已发数量" prop="deliveredQty">
        <el-input v-model="formData.deliveredQty" placeholder="请输入已发数量" />
      </el-form-item>
      <el-form-item label="未配送数量" prop="undeliveredQty">
        <el-input v-model="formData.undeliveredQty" placeholder="请输入未配送数量" />
      </el-form-item>
      <el-form-item label="物料号" prop="buyerMaterialNo">
        <el-input v-model="formData.buyerMaterialNo" placeholder="请输入物料号" />
      </el-form-item>
      <el-form-item label="旧物料号" prop="oldMaterialNo">
        <el-input v-model="formData.oldMaterialNo" placeholder="请输入旧物料号" />
      </el-form-item>
      <el-form-item label="物料描述" prop="buyerMaterialDesc">
        <el-input v-model="formData.buyerMaterialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="供应商编码(配送单)" prop="deliverySupplierCode">
        <el-input v-model="formData.deliverySupplierCode" placeholder="请输入供应商编码(配送单)" />
      </el-form-item>
      <el-form-item label="供应商描述(配送单)" prop="deliverySupplierName">
        <el-input v-model="formData.deliverySupplierName" placeholder="请输入供应商描述(配送单)" />
      </el-form-item>
      <el-form-item label="库存是否满足" prop="stockSufficientFlag">
        <el-input v-model="formData.stockSufficientFlag" placeholder="请输入库存是否满足" />
      </el-form-item>
      <el-form-item label="总库存" prop="totalStockQty">
        <el-input v-model="formData.totalStockQty" placeholder="请输入总库存" />
      </el-form-item>
      <el-form-item label="本次消耗库存" prop="currentStockConsumeQty">
        <el-input v-model="formData.currentStockConsumeQty" placeholder="请输入本次消耗库存" />
      </el-form-item>
      <el-form-item label="库存地点(配送)" prop="deliveryStorageLoc">
        <el-input v-model="formData.deliveryStorageLoc" placeholder="请输入库存地点(配送)" />
      </el-form-item>
      <el-form-item label="采购是否满足" prop="poSufficientFlag">
        <el-input v-model="formData.poSufficientFlag" placeholder="请输入采购是否满足" />
      </el-form-item>
      <el-form-item label="采购订单号" prop="buyerOrderNo">
        <el-input v-model="formData.buyerOrderNo" placeholder="请输入采购订单号" />
      </el-form-item>
      <el-form-item label="采购项目" prop="lineItem">
        <el-input v-model="formData.lineItem" placeholder="请输入采购项目" />
      </el-form-item>
      <el-form-item label="需求跟踪号" prop="requirementTrackingNo">
        <el-input v-model="formData.requirementTrackingNo" placeholder="请输入需求跟踪号" />
      </el-form-item>
      <el-form-item label="采购订单数量" prop="orderQty">
        <el-input v-model="formData.orderQty" placeholder="请输入采购订单数量" />
      </el-form-item>
      <el-form-item label="采购订单未收货数量" prop="openQty">
        <el-input v-model="formData.openQty" placeholder="请输入采购订单未收货数量" />
      </el-form-item>
      <el-form-item label="本次交货数量" prop="receivedQty">
        <el-input v-model="formData.receivedQty" placeholder="请输入本次交货数量" />
      </el-form-item>
      <el-form-item label="采购订单交货日期" prop="poDeliveryDate">
        <el-date-picker
          v-model="formData.poDeliveryDate"
          type="date"
          value-format="x"
          placeholder="选择采购订单交货日期"
        />
      </el-form-item>
      <el-form-item label="供应商(采购订单)" prop="poSupplierCode">
        <el-input v-model="formData.poSupplierCode" placeholder="请输入供应商(采购订单)" />
      </el-form-item>
      <el-form-item label="供应商描述(采购订单)" prop="supplierDesc">
        <el-input v-model="formData.supplierDesc" placeholder="请输入供应商描述(采购订单)" />
      </el-form-item>
      <el-form-item label="采购组" prop="buyerPurchasingGroup">
        <el-input v-model="formData.buyerPurchasingGroup" placeholder="请输入采购组" />
      </el-form-item>
      <el-form-item label="下单采购员" prop="orderingBuyer">
        <el-input v-model="formData.orderingBuyer" placeholder="请输入下单采购员" />
      </el-form-item>
      <el-form-item label="交货采购员" prop="deliveryBuyer">
        <el-input v-model="formData.deliveryBuyer" placeholder="请输入交货采购员" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DeliverApi, DeliverVO } from '@/api/buyer/deliver'

/** 配送与采购报表 表单 */
defineOptions({ name: 'DeliverForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  plant: undefined,
  deliveryOrderNo: undefined,
  deliveryDate: undefined,
  creationDate: undefined,
  creationTime: undefined,
  createdBy: undefined,
  lastUpdateDate: undefined,
  lastUpdateTime: undefined,
  lastUpdatedBy: undefined,
  partOrderNo: undefined,
  productionWorkshop: undefined,
  partMatCode: undefined,
  partMatDesc: undefined,
  reservationNo: undefined,
  reservationItem: undefined,
  plannedIssueQty: undefined,
  deliveredQty: undefined,
  undeliveredQty: undefined,
  buyerMaterialNo: undefined,
  oldMaterialNo: undefined,
  buyerMaterialDesc: undefined,
  deliverySupplierCode: undefined,
  deliverySupplierName: undefined,
  stockSufficientFlag: undefined,
  totalStockQty: undefined,
  currentStockConsumeQty: undefined,
  deliveryStorageLoc: undefined,
  poSufficientFlag: undefined,
  buyerOrderNo: undefined,
  lineItem: undefined,
  requirementTrackingNo: undefined,
  orderQty: undefined,
  openQty: undefined,
  receivedQty: undefined,
  poDeliveryDate: undefined,
  poSupplierCode: undefined,
  supplierDesc: undefined,
  buyerPurchasingGroup: undefined,
  orderingBuyer: undefined,
  deliveryBuyer: undefined,
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
      formData.value = await DeliverApi.getDeliver(id)
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
    const data = formData.value as unknown as DeliverVO
    if (formType.value === 'create') {
      await DeliverApi.createDeliver(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeliverApi.updateDeliver(data)
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
    plant: undefined,
    deliveryOrderNo: undefined,
    deliveryDate: undefined,
    creationDate: undefined,
    creationTime: undefined,
    createdBy: undefined,
    lastUpdateDate: undefined,
    lastUpdateTime: undefined,
    lastUpdatedBy: undefined,
    partOrderNo: undefined,
    productionWorkshop: undefined,
    partMatCode: undefined,
    partMatDesc: undefined,
    reservationNo: undefined,
    reservationItem: undefined,
    plannedIssueQty: undefined,
    deliveredQty: undefined,
    undeliveredQty: undefined,
    buyerMaterialNo: undefined,
    oldMaterialNo: undefined,
    buyerMaterialDesc: undefined,
    deliverySupplierCode: undefined,
    deliverySupplierName: undefined,
    stockSufficientFlag: undefined,
    totalStockQty: undefined,
    currentStockConsumeQty: undefined,
    deliveryStorageLoc: undefined,
    poSufficientFlag: undefined,
    buyerOrderNo: undefined,
    lineItem: undefined,
    requirementTrackingNo: undefined,
    orderQty: undefined,
    openQty: undefined,
    receivedQty: undefined,
    poDeliveryDate: undefined,
    poSupplierCode: undefined,
    supplierDesc: undefined,
    buyerPurchasingGroup: undefined,
    orderingBuyer: undefined,
    deliveryBuyer: undefined,
  }
  formRef.value?.resetFields()
}
</script>