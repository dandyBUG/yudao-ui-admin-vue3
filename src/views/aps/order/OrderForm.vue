<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="物料号" prop="assemblyMaterialNo">
        <el-input v-model="formData.assemblyMaterialNo" placeholder="请输入物料号" />
      </el-form-item>
      <el-form-item label="物料描述" prop="mainMaterialDesc">
        <el-input v-model="formData.mainMaterialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="订单类型(如ZY02)" prop="componentOrderType">
        <el-select v-model="formData.componentOrderType" placeholder="请选择订单类型(如ZY02)">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="订单数量" prop="scheduledQuantity">
        <el-input v-model="formData.scheduledQuantity" placeholder="请输入订单数量" />
      </el-form-item>
      <el-form-item label="已交货数量(已入库数量)" prop="deliveredQuantity">
        <el-input v-model="formData.deliveredQuantity" placeholder="请输入已交货数量(已入库数量)" />
      </el-form-item>
      <el-form-item label="创建日期" prop="creationDate">
        <el-date-picker
          v-model="formData.creationDate"
          type="date"
          value-format="x"
          placeholder="选择创建日期"
        />
      </el-form-item>
      <el-form-item label="创建者/输入者" prop="createdBy">
        <el-input v-model="formData.createdBy" placeholder="请输入创建者/输入者" />
      </el-form-item>
      <el-form-item label="系统状态(如REL PCNF等)" prop="systemStatus">
        <el-radio-group v-model="formData.systemStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计划开始日期" prop="scheduledDate">
        <el-date-picker
          v-model="formData.scheduledDate"
          type="date"
          value-format="x"
          placeholder="选择计划开始日期"
        />
      </el-form-item>
      <el-form-item label="实际开始时间(日期+时间)" prop="actualStartTime">
        <el-date-picker
          v-model="formData.actualStartTime"
          type="date"
          value-format="x"
          placeholder="选择实际开始时间(日期+时间)"
        />
      </el-form-item>
      <el-form-item label="计划完成日期" prop="basicEndDate">
        <el-date-picker
          v-model="formData.basicEndDate"
          type="date"
          value-format="x"
          placeholder="选择计划完成日期"
        />
      </el-form-item>
      <el-form-item label="工厂代码" prop="plant">
        <el-input v-model="formData.plant" placeholder="请输入工厂代码" />
      </el-form-item>
      <el-form-item label="MRP控制员代码" prop="mrpController">
        <el-input v-model="formData.mrpController" placeholder="请输入MRP控制员代码" />
      </el-form-item>
      <el-form-item label="生产主管" prop="productionWorkshop">
        <el-input v-model="formData.productionWorkshop" placeholder="请输入生产主管" />
      </el-form-item>
      <el-form-item label="计量单位(如PC)" prop="unitOfMeasure">
        <el-input v-model="formData.unitOfMeasure" placeholder="请输入计量单位(如PC)" />
      </el-form-item>
      <el-form-item label="生产版本(如0001)" prop="productionVersion">
        <el-input v-model="formData.productionVersion" placeholder="请输入生产版本(如0001)" />
      </el-form-item>
      <el-form-item label="实际完成日期 (Actual End Date)" prop="actualEndDate">
        <el-date-picker
          v-model="formData.actualEndDate"
          type="date"
          value-format="x"
          placeholder="选择实际完成日期 (Actual End Date)"
        />
      </el-form-item>
      <el-form-item label="处理开始日期 (Process Start Date)" prop="processStartDate">
        <el-date-picker
          v-model="formData.processStartDate"
          type="date"
          value-format="x"
          placeholder="选择处理开始日期 (Process Start Date)"
        />
      </el-form-item>
      <el-form-item label="提交日期 (Submit Date)" prop="submitDate">
        <el-date-picker
          v-model="formData.submitDate"
          type="date"
          value-format="x"
          placeholder="选择提交日期 (Submit Date)"
        />
      </el-form-item>
      <el-form-item label="处理下达 (Process Released)" prop="processReleased">
        <el-input v-model="formData.processReleased" placeholder="请输入处理下达 (Process Released)" />
      </el-form-item>
      <el-form-item label="集中订单处理 (Central Processing)" prop="centralProc">
        <el-input v-model="formData.centralProc" placeholder="请输入集中订单处理 (Central Processing)" />
      </el-form-item>
      <el-form-item label="更改日期 (Change Date)" prop="changeDate">
        <el-date-picker
          v-model="formData.changeDate"
          type="date"
          value-format="x"
          placeholder="选择更改日期 (Change Date)"
        />
      </el-form-item>
      <el-form-item label="最后更改人 (Last Changed By)" prop="lastChangedBy">
        <el-input v-model="formData.lastChangedBy" placeholder="请输入最后更改人 (Last Changed By)" />
      </el-form-item>
      <el-form-item label="订单类别 (Order Category)" prop="orderCategory">
        <el-input v-model="formData.orderCategory" placeholder="请输入订单类别 (Order Category)" />
      </el-form-item>
      <el-form-item label="销售订单 (Sales Order)" prop="salesOrder">
        <el-input v-model="formData.salesOrder" placeholder="请输入销售订单 (Sales Order)" />
      </el-form-item>
      <el-form-item label="描述 (Description)" prop="description">
        <Editor v-model="formData.description" height="150px" />
      </el-form-item>
      <el-form-item label="确认产量" prop="confirmedQuantity">
        <el-input v-model="formData.confirmedQuantity" placeholder="请输入确认产量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { OrderApi, OrderVO } from '@/api/aps/order'

/** 订单表 - SAP订单信息 表单 */
defineOptions({ name: 'OrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  productionOrderNo: undefined,
  assemblyMaterialNo: undefined,
  mainMaterialDesc: undefined,
  componentOrderType: undefined,
  scheduledQuantity: undefined,
  deliveredQuantity: undefined,
  creationDate: undefined,
  createdBy: undefined,
  systemStatus: undefined,
  scheduledDate: undefined,
  actualStartTime: undefined,
  basicEndDate: undefined,
  plant: undefined,
  mrpController: undefined,
  productionWorkshop: undefined,
  unitOfMeasure: undefined,
  productionVersion: undefined,
  actualEndDate: undefined,
  processStartDate: undefined,
  submitDate: undefined,
  processReleased: undefined,
  centralProc: undefined,
  changeDate: undefined,
  lastChangedBy: undefined,
  orderCategory: undefined,
  salesOrder: undefined,
  description: undefined,
  confirmedQuantity: undefined,
})
const formRules = reactive({
  assemblyMaterialNo: [{ required: true, message: '物料号不能为空', trigger: 'blur' }],
  scheduledQuantity: [{ required: true, message: '订单数量不能为空', trigger: 'blur' }],
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
      formData.value = await OrderApi.getOrder(id)
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
    const data = formData.value as unknown as OrderVO
    if (formType.value === 'create') {
      await OrderApi.createOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await OrderApi.updateOrder(data)
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
    productionOrderNo: undefined,
    assemblyMaterialNo: undefined,
    mainMaterialDesc: undefined,
    componentOrderType: undefined,
    scheduledQuantity: undefined,
    deliveredQuantity: undefined,
    creationDate: undefined,
    createdBy: undefined,
    systemStatus: undefined,
    scheduledDate: undefined,
    actualStartTime: undefined,
    basicEndDate: undefined,
    plant: undefined,
    mrpController: undefined,
    productionWorkshop: undefined,
    unitOfMeasure: undefined,
    productionVersion: undefined,
    actualEndDate: undefined,
    processStartDate: undefined,
    submitDate: undefined,
    processReleased: undefined,
    centralProc: undefined,
    changeDate: undefined,
    lastChangedBy: undefined,
    orderCategory: undefined,
    salesOrder: undefined,
    description: undefined,
    confirmedQuantity: undefined,
  }
  formRef.value?.resetFields()
}
</script>