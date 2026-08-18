<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="产品线" prop="productLine">
        <el-input v-model="formData.productLine" placeholder="请输入产品线" />
      </el-form-item>
      <el-form-item label="产品机型" prop="productModel">
        <el-input v-model="formData.productModel" placeholder="请输入产品机型" />
      </el-form-item>
      <el-form-item label="车型代码" prop="vehicleCode">
        <el-input v-model="formData.vehicleCode" placeholder="请输入车型代码" />
      </el-form-item>
      <el-form-item label="2025年度顺序号/车号" prop="seqNo2025">
        <el-input v-model="formData.seqNo2025" placeholder="请输入2025年度顺序号/车号" />
      </el-form-item>
      <el-form-item label="2026年度顺序号/车号" prop="seqNo2026">
        <el-input v-model="formData.seqNo2026" placeholder="请输入2026年度顺序号/车号" />
      </el-form-item>
      <el-form-item label="VIN" prop="vin">
        <el-input v-model="formData.vin" placeholder="请输入VIN" />
      </el-form-item>
      <el-form-item label="裸机订单号" prop="bareMachineOrderNo">
        <el-input v-model="formData.bareMachineOrderNo" placeholder="请输入裸机订单号" />
      </el-form-item>
      <el-form-item label="行驶单元订单号" prop="drivingUnitOrderNo">
        <el-input v-model="formData.drivingUnitOrderNo" placeholder="请输入行驶单元订单号" />
      </el-form-item>
      <el-form-item label="内外贸（内贸/外贸）" prop="tradeType">
        <el-select v-model="formData.tradeType" placeholder="请选择内外贸（内贸/外贸）">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="台份数量" prop="unitQuantity">
        <el-input v-model="formData.unitQuantity" placeholder="请输入台份数量" />
      </el-form-item>
      <el-form-item label="下料完工计划" prop="blankingFinishPlanDate">
              <el-date-picker
                v-model="formData.blankingFinishPlanDate"
                type="date"
                value-format="x"
                placeholder="选择下料完工计划"
              />
            </el-form-item>
            <el-form-item label="吊臂板/中吨位支腿完工计划" prop="outriggerFinishPlanDate">
              <el-date-picker
                v-model="formData.outriggerFinishPlanDate"
                type="date"
                value-format="x"
                placeholder="选择吊臂板/中吨位支腿完工计划"
              />
            </el-form-item>
            <el-form-item label="吊臂或主臂顶底完工计划" prop="boomFinishPlanDate">
              <el-date-picker
                v-model="formData.boomFinishPlanDate"
                type="date"
                value-format="x"
                placeholder="选择吊臂或主臂顶底完工计划"
              />
            </el-form-item>
            <el-form-item label="转台结构件完工计划" prop="turntableFinishPlanDate">
              <el-date-picker
                v-model="formData.turntableFinishPlanDate"
                type="date"
                value-format="x"
                placeholder="选择转台结构件完工计划"
              />
            </el-form-item>
            <el-form-item label="车架结构件完工计划" prop="frameFinishPlanDate">
              <el-date-picker
                v-model="formData.frameFinishPlanDate"
                type="date"
                value-format="x"
                placeholder="选择车架结构件完工计划"
              />
            </el-form-item>
      <el-form-item label="底盘上线计划日期" prop="chassisOnlinePlanDate">
        <el-date-picker
          v-model="formData.chassisOnlinePlanDate"
          type="date"
          value-format="x"
          placeholder="选择底盘上线计划日期"
        />
      </el-form-item>
      <el-form-item label="成台完工计划日期" prop="finishedProductPlanDate">
        <el-date-picker
          v-model="formData.finishedProductPlanDate"
          type="date"
          value-format="x"
          placeholder="选择成台完工计划日期"
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
import { VehiclePlanApi, VehiclePlanVO } from '@/api/buyer/vehicleplan'

/** 买家车辆营销计划表（主机厂计划） 表单 */
defineOptions({ name: 'VehiclePlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  displaySeq: undefined,
  productLine: undefined,
  productModel: undefined,
  vehicleCode: undefined,
  seqNo2025: undefined,
  seqNo2026: undefined,
  vin: undefined,
  bareMachineOrderNo: undefined,
  drivingUnitOrderNo: undefined,
  tradeType: undefined,
  unitQuantity: undefined,
  blankingFinishPlanDate: undefined,   // 新增
  outriggerFinishPlanDate: undefined,  // 新增
  boomFinishPlanDate: undefined,       // 新增
  turntableFinishPlanDate: undefined,  // 新增
  frameFinishPlanDate: undefined,      // 新增
  chassisOnlinePlanDate: undefined,
  finishedProductPlanDate: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await VehiclePlanApi.getVehiclePlan(id)
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
    const data = formData.value as unknown as VehiclePlanVO
    if (formType.value === 'create') {
      await VehiclePlanApi.createVehiclePlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await VehiclePlanApi.updateVehiclePlan(data)
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
    displaySeq: undefined,
    productLine: undefined,
    productModel: undefined,
    vehicleCode: undefined,
    seqNo2025: undefined,
    seqNo2026: undefined,
    bareMachineOrderNo: undefined,
    drivingUnitOrderNo: undefined,
    tradeType: undefined,
    unitQuantity: undefined,
    chassisOnlinePlanDate: undefined,
    finishedProductPlanDate: undefined,
  }
  formRef.value?.resetFields()
}
</script>
