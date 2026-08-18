<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="计划编号" prop="planNo">
        <el-input v-model="formData.planNo" placeholder="请输入计划编号" />
      </el-form-item>
      <el-form-item label="序号" prop="seqNo">
        <el-input v-model="formData.seqNo" placeholder="请输入序号" />
      </el-form-item>
      <el-form-item label="米段" prop="meter">
        <el-input v-model="formData.meter" placeholder="请输入米段" />
      </el-form-item>
      <el-form-item label="型号" prop="modelName">
        <el-input v-model="formData.modelName" placeholder="请输入型号" />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="formData.materialName" placeholder="请输入物料名称" />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="formData.materialCode" placeholder="请输入物料编码" />
      </el-form-item>
      <el-form-item label="生产编号" prop="prodNo">
        <el-input v-model="formData.prodNo" placeholder="请输入生产编号" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="结构件编号/环保编码" prop="structSerialNo">
        <el-input v-model="formData.structSerialNo" placeholder="请输入结构件编号/环保编码" />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="formData.orderNo" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="出料批次" prop="batchNo">
        <el-input v-model="formData.batchNo" placeholder="请输入出料批次" />
      </el-form-item>
      <el-form-item label="组单情况" prop="groupStatus">
        <el-radio-group v-model="formData.groupStatus">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支腿类型" prop="legType">
        <el-select v-model="formData.legType" placeholder="请选择支腿类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="国家（国内/海外）" prop="countryType">
        <el-select v-model="formData.countryType" placeholder="请选择国家（国内/海外）">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="计划下达时间" prop="planIssueTime">
        <el-date-picker
          v-model="formData.planIssueTime"
          type="date"
          value-format="x"
          placeholder="选择计划下达时间"
        />
      </el-form-item>
      <el-form-item label="装配上线时间" prop="assemblyStartTime">
        <el-date-picker
          v-model="formData.assemblyStartTime"
          type="date"
          value-format="x"
          placeholder="选择装配上线时间"
        />
      </el-form-item>
      <el-form-item label="装配下线时间" prop="assemblyEndTime">
        <el-date-picker
          v-model="formData.assemblyEndTime"
          type="date"
          value-format="x"
          placeholder="选择装配下线时间"
        />
      </el-form-item>
      <el-form-item label="调试下线时间" prop="debugTime">
        <el-date-picker
          v-model="formData.debugTime"
          type="date"
          value-format="x"
          placeholder="选择调试下线时间"
        />
      </el-form-item>
      <el-form-item label="涂装下线时间" prop="paintingTime">
        <el-date-picker
          v-model="formData.paintingTime"
          type="date"
          value-format="x"
          placeholder="选择涂装下线时间"
        />
      </el-form-item>
      <el-form-item label="入库时间" prop="warehouseTime">
        <el-date-picker
          v-model="formData.warehouseTime"
          type="date"
          value-format="x"
          placeholder="选择入库时间"
        />
      </el-form-item>
      <el-form-item label="营运要求产出月份" prop="outputMonth">
        <el-input v-model="formData.outputMonth" placeholder="请输入营运要求产出月份" />
      </el-form-item>
      <el-form-item label="特殊要求" prop="specialReq">
        <el-input v-model="formData.specialReq" placeholder="请输入特殊要求" />
      </el-form-item>
      <el-form-item label="涂装要求" prop="paintingReq">
        <el-input v-model="formData.paintingReq" placeholder="请输入涂装要求" />
      </el-form-item>
      <el-form-item label="异常说明" prop="exceptionNote">
        <el-input v-model="formData.exceptionNote" placeholder="请输入异常说明" />
      </el-form-item>
      <el-form-item label="排产时间" prop="scheduleTime">
        <el-date-picker
          v-model="formData.scheduleTime"
          type="date"
          value-format="x"
          placeholder="选择排产时间"
        />
      </el-form-item>
      <el-form-item label="发货要求" prop="deliveryReq">
        <el-input v-model="formData.deliveryReq" placeholder="请输入发货要求" />
      </el-form-item>
      <el-form-item label="工厂" prop="factory">
        <el-input v-model="formData.factory" placeholder="请输入工厂" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="formData.customer" placeholder="请输入客户" />
      </el-form-item>
      <el-form-item label="修改后车号" prop="modifiedCarNo">
        <el-input v-model="formData.modifiedCarNo" placeholder="请输入修改后车号" />
      </el-form-item>
      <el-form-item label="板块" prop="plate">
        <el-input v-model="formData.plate" placeholder="请输入板块" />
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
import { ConcretePlanApi, ConcretePlanVO } from '@/api/marketing/concreteplan'

/** 混凝土计划需求 表单 */
defineOptions({ name: 'ConcretePlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  planNo: undefined,
  seqNo: undefined,
  meter: undefined,
  modelName: undefined,
  materialName: undefined,
  materialCode: undefined,
  prodNo: undefined,
  quantity: undefined,
  structSerialNo: undefined,
  orderNo: undefined,
  batchNo: undefined,
  groupStatus: undefined,
  legType: undefined,
  countryType: undefined,
  planIssueTime: undefined,
  assemblyStartTime: undefined,
  assemblyEndTime: undefined,
  debugTime: undefined,
  paintingTime: undefined,
  warehouseTime: undefined,
  outputMonth: undefined,
  specialReq: undefined,
  paintingReq: undefined,
  exceptionNote: undefined,
  scheduleTime: undefined,
  deliveryReq: undefined,
  factory: undefined,
  status: undefined,
  customer: undefined,
  modifiedCarNo: undefined,
  plate: undefined,
  importTime: undefined,
})
const formRules = reactive({
  planNo: [{ required: true, message: '计划编号不能为空', trigger: 'blur' }],
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
      formData.value = await ConcretePlanApi.getConcretePlan(id)
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
    const data = formData.value as unknown as ConcretePlanVO
    if (formType.value === 'create') {
      await ConcretePlanApi.createConcretePlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await ConcretePlanApi.updateConcretePlan(data)
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
    planNo: undefined,
    seqNo: undefined,
    meter: undefined,
    modelName: undefined,
    materialName: undefined,
    materialCode: undefined,
    prodNo: undefined,
    quantity: undefined,
    structSerialNo: undefined,
    orderNo: undefined,
    batchNo: undefined,
    groupStatus: undefined,
    legType: undefined,
    countryType: undefined,
    planIssueTime: undefined,
    assemblyStartTime: undefined,
    assemblyEndTime: undefined,
    debugTime: undefined,
    paintingTime: undefined,
    warehouseTime: undefined,
    outputMonth: undefined,
    specialReq: undefined,
    paintingReq: undefined,
    exceptionNote: undefined,
    scheduleTime: undefined,
    deliveryReq: undefined,
    factory: undefined,
    status: undefined,
    customer: undefined,
    modifiedCarNo: undefined,
    plate: undefined,
    importTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>