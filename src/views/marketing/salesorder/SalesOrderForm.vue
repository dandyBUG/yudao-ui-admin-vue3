<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <!-- 基本信息 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="销售组织" prop="salesOrganization">
            <el-input v-model="formData.salesOrganization" placeholder="请输入销售组织" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售部门" prop="salesDepartment">
            <el-input v-model="formData.salesDepartment" placeholder="请输入销售部门" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="售达方编码" prop="soldToParty">
            <el-input v-model="formData.soldToParty" placeholder="请输入售达方编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="售达方名称" prop="soldToPartyName">
            <el-input v-model="formData.soldToPartyName" placeholder="请输入售达方名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="销售地区" prop="salesRegion">
            <el-input v-model="formData.salesRegion" placeholder="请输入销售地区" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单日期" prop="orderDate">
            <el-date-picker v-model="formData.orderDate" type="date" value-format="x" placeholder="选择订单日期" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单类型" prop="orderType">
            <el-input v-model="formData.orderType" placeholder="请输入订单类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="审批状态" prop="approvalStatus">
            <el-input v-model="formData.approvalStatus" placeholder="请输入审批状态" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单编号" prop="orderNumber">
            <el-input v-model="formData.orderNumber" placeholder="请输入订单编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行项目" prop="orderItem">
            <el-input-number v-model="formData.orderItem" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="科目设置组" prop="accountSettingGroup">
            <el-input v-model="formData.accountSettingGroup" placeholder="请输入科目设置组" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料编码" prop="materialCode">
            <el-input v-model="formData.materialCode" placeholder="请输入物料编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料描述" prop="materialDescription">
            <el-input v-model="formData.materialDescription" placeholder="请输入物料描述" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最早交货日期" prop="earliestDeliveryDate">
            <el-date-picker v-model="formData.earliestDeliveryDate" type="date" value-format="x" placeholder="选择最早交货日期" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单数量" prop="orderQuantity">
            <el-input-number v-model="formData.orderQuantity" :precision="3" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unit">
            <el-input v-model="formData.unit" placeholder="请输入计量单位" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="送达方编码" prop="shipToParty">
            <el-input v-model="formData.shipToParty" placeholder="请输入送达方编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="送达方名称" prop="shipToPartyName">
            <el-input v-model="formData.shipToPartyName" placeholder="请输入送达方名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="卸货点" prop="unloadingPoint">
            <el-input v-model="formData.unloadingPoint" placeholder="请输入卸货点" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格清单类型" prop="priceListType">
            <el-input v-model="formData.priceListType" placeholder="请输入价格清单类型" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="定价日期" prop="pricingDate">
            <el-date-picker v-model="formData.pricingDate" type="date" value-format="x" placeholder="选择定价日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单价" prop="unitPrice">
            <el-input-number v-model="formData.unitPrice" :precision="4" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="销售净值" prop="netSalesValue">
            <el-input-number v-model="formData.netSalesValue" :precision="2" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="小计" prop="subtotal">
            <el-input-number v-model="formData.subtotal" :precision="2" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="税额" prop="taxAmount">
            <el-input-number v-model="formData.taxAmount" :precision="2" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最新销售价格" prop="latestSalesPrice">
            <el-input-number v-model="formData.latestSalesPrice" :precision="4" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="不含税价" prop="priceExclTax">
            <el-input-number v-model="formData.priceExclTax" :precision="4" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最新金额" prop="latestAmount">
            <el-input-number v-model="formData.latestAmount" :precision="2" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="净重" prop="netWeight">
            <el-input-number v-model="formData.netWeight" :precision="3" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="毛重" prop="grossWeight">
            <el-input-number v-model="formData.grossWeight" :precision="3" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="重量单位" prop="weightUnit">
            <el-input v-model="formData.weightUnit" placeholder="请输入重量单位" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工厂" prop="plant">
            <el-input v-model="formData.plant" placeholder="请输入工厂" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="装运点" prop="shippingPoint">
            <el-input v-model="formData.shippingPoint" placeholder="请输入装运点" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存地点" prop="storageLocation">
            <el-input v-model="formData.storageLocation" placeholder="请输入库存地点" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="已交货数量" prop="deliveredQuantity">
            <el-input-number v-model="formData.deliveredQuantity" :precision="3" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="已发货数量" prop="shippedQuantity">
            <el-input-number v-model="formData.shippedQuantity" :precision="3" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="已开票数量" prop="invoicedQuantity">
            <el-input-number v-model="formData.invoicedQuantity" :precision="3" :min="0" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交货状态" prop="deliveryStatus">
            <el-input v-model="formData.deliveryStatus" placeholder="请输入交货状态" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="创建者（业务）" prop="creatorName">
            <el-input v-model="formData.creatorName" placeholder="请输入创建者（业务）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建日期（业务）" prop="creationDate">
            <el-date-picker v-model="formData.creationDate" type="date" value-format="x" placeholder="选择创建日期（业务）" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="交货冻结状态" prop="deliveryBlock">
            <el-input v-model="formData.deliveryBlock" placeholder="请输入交货冻结状态" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票冻结状态" prop="invoiceBlock">
            <el-input v-model="formData.invoiceBlock" placeholder="请输入开票冻结状态" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="订单原因" prop="orderReason">
            <el-input v-model="formData.orderReason" placeholder="请输入订单原因" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="拒绝原因" prop="rejectionReason">
            <el-input v-model="formData.rejectionReason" placeholder="请输入拒绝原因" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发票类型" prop="invoiceType">
            <el-input v-model="formData.invoiceType" placeholder="请输入发票类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料组" prop="materialGroup">
            <el-input v-model="formData.materialGroup" placeholder="请输入物料组" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { SalesOrderApi, SalesOrderVO } from '@/api/marketing/salesorder'

defineOptions({ name: 'SalesOrderForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<SalesOrderVO>({
  id: undefined,
  salesOrganization: undefined,
  salesDepartment: undefined,
  soldToParty: undefined,
  soldToPartyName: undefined,
  salesRegion: undefined,
  orderDate: undefined,
  orderType: undefined,
  approvalStatus: undefined,
  orderNumber: undefined,
  orderItem: undefined,
  accountSettingGroup: undefined,
  materialCode: undefined,
  materialDescription: undefined,
  earliestDeliveryDate: undefined,
  orderQuantity: undefined,
  unit: undefined,
  shipToParty: undefined,
  shipToPartyName: undefined,
  unloadingPoint: undefined,
  priceListType: undefined,
  pricingDate: undefined,
  unitPrice: undefined,
  netSalesValue: undefined,
  subtotal: undefined,
  taxAmount: undefined,
  latestSalesPrice: undefined,
  priceExclTax: undefined,
  latestAmount: undefined,
  netWeight: undefined,
  grossWeight: undefined,
  weightUnit: undefined,
  plant: undefined,
  shippingPoint: undefined,
  storageLocation: undefined,
  deliveredQuantity: undefined,
  shippedQuantity: undefined,
  invoicedQuantity: undefined,
  deliveryStatus: undefined,
  creatorName: undefined,
  creationDate: undefined,
  deliveryBlock: undefined,
  invoiceBlock: undefined,
  orderReason: undefined,
  rejectionReason: undefined,
  invoiceType: undefined,
  materialGroup: undefined,
})
const formRules = reactive({})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      const data = await SalesOrderApi.getSalesOrder(id)
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
    const data = formData.value as unknown as SalesOrderVO
    if (formType.value === 'create') {
      await SalesOrderApi.createSalesOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await SalesOrderApi.updateSalesOrder(data)
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
    salesOrganization: undefined,
    salesDepartment: undefined,
    soldToParty: undefined,
    soldToPartyName: undefined,
    salesRegion: undefined,
    orderDate: undefined,
    orderType: undefined,
    approvalStatus: undefined,
    orderNumber: undefined,
    orderItem: undefined,
    accountSettingGroup: undefined,
    materialCode: undefined,
    materialDescription: undefined,
    earliestDeliveryDate: undefined,
    orderQuantity: undefined,
    unit: undefined,
    shipToParty: undefined,
    shipToPartyName: undefined,
    unloadingPoint: undefined,
    priceListType: undefined,
    pricingDate: undefined,
    unitPrice: undefined,
    netSalesValue: undefined,
    subtotal: undefined,
    taxAmount: undefined,
    latestSalesPrice: undefined,
    priceExclTax: undefined,
    latestAmount: undefined,
    netWeight: undefined,
    grossWeight: undefined,
    weightUnit: undefined,
    plant: undefined,
    shippingPoint: undefined,
    storageLocation: undefined,
    deliveredQuantity: undefined,
    shippedQuantity: undefined,
    invoicedQuantity: undefined,
    deliveryStatus: undefined,
    creatorName: undefined,
    creationDate: undefined,
    deliveryBlock: undefined,
    invoiceBlock: undefined,
    orderReason: undefined,
    rejectionReason: undefined,
    invoiceType: undefined,
    materialGroup: undefined,
  }
  formRef.value?.resetFields()
}
</script>
