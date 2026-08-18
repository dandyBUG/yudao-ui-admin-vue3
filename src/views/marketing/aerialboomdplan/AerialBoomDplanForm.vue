<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="线别" prop="lineType">
        <el-select v-model="formData.lineType" placeholder="请选择线别">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="精准车型" prop="preciseModel">
        <el-input v-model="formData.preciseModel" placeholder="请输入精准车型" />
      </el-form-item>
      <el-form-item label="产品型号" prop="productModel">
        <el-input v-model="formData.productModel" placeholder="请输入产品型号" />
      </el-form-item>
      <el-form-item label="ZPS型号" prop="zpsModel">
        <el-input v-model="formData.zpsModel" placeholder="请输入ZPS型号" />
      </el-form-item>
      <el-form-item label="精准BOM" prop="preciseBom">
        <el-input v-model="formData.preciseBom" placeholder="请输入精准BOM" />
      </el-form-item>
      <el-form-item label="车号" prop="carNo">
        <el-input v-model="formData.carNo" placeholder="请输入车号" />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="formData.orderNo" placeholder="请输入订单号" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="内外贸版本" prop="tradeVersion">
        <el-input v-model="formData.tradeVersion" placeholder="请输入内外贸版本" />
      </el-form-item>
      <el-form-item label="台份" prop="unitCount">
        <el-input v-model="formData.unitCount" placeholder="请输入台份" />
      </el-form-item>
      <el-form-item label="上线计划" prop="onlinePlan">
        <el-date-picker
          v-model="formData.onlinePlan"
          type="date"
          value-format="x"
          placeholder="选择上线计划"
        />
      </el-form-item>
      <el-form-item label="成台计划" prop="completePlan">
        <el-date-picker
          v-model="formData.completePlan"
          type="date"
          value-format="x"
          placeholder="选择成台计划"
        />
      </el-form-item>
      <el-form-item label="报缴日期" prop="reportDate">
        <el-date-picker
          v-model="formData.reportDate"
          type="date"
          value-format="x"
          placeholder="选择报缴日期"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input v-model="formData.country" placeholder="请输入国家" />
      </el-form-item>
      <el-form-item label="合同号" prop="contractNo">
        <el-input v-model="formData.contractNo" placeholder="请输入合同号" />
      </el-form-item>
      <el-form-item label="营销通知时间" prop="marketingNoticeTime">
        <el-date-picker
          v-model="formData.marketingNoticeTime"
          type="date"
          value-format="x"
          placeholder="选择营销通知时间"
        />
      </el-form-item>
      <el-form-item label="订单开立时间" prop="orderCreateTime">
        <el-date-picker
          v-model="formData.orderCreateTime"
          type="date"
          value-format="x"
          placeholder="选择订单开立时间"
        />
      </el-form-item>
      <el-form-item label="板块" prop="plate">
        <el-input v-model="formData.plate" placeholder="请输入板块" />
      </el-form-item>
      <el-form-item label="导入批次时间" prop="importTime">
        <el-date-picker
          v-model="formData.importTime"
          type="date"
          value-format="x"
          placeholder="选择导入批次时间"
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
import { AerialBoomDplanApi, AerialBoomDplanVO } from '@/api/marketing/aerialboomdplan'

/** 高机臂式日计划 表单 */
defineOptions({ name: 'AerialBoomDplanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  lineType: undefined,
  preciseModel: undefined,
  productModel: undefined,
  zpsModel: undefined,
  preciseBom: undefined,
  carNo: undefined,
  orderNo: undefined,
  remark: undefined,
  tradeVersion: undefined,
  unitCount: undefined,
  onlinePlan: undefined,
  completePlan: undefined,
  reportDate: undefined,
  country: undefined,
  contractNo: undefined,
  marketingNoticeTime: undefined,
  orderCreateTime: undefined,
  plate: undefined,
  importTime: undefined,
})
const formRules = reactive({
  importTime: [{ required: true, message: '导入批次时间不能为空', trigger: 'blur' }],
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
      formData.value = await AerialBoomDplanApi.getAerialBoomDplan(id)
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
    const data = formData.value as unknown as AerialBoomDplanVO
    if (formType.value === 'create') {
      await AerialBoomDplanApi.createAerialBoomDplan(data)
      message.success(t('common.createSuccess'))
    } else {
      await AerialBoomDplanApi.updateAerialBoomDplan(data)
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
    lineType: undefined,
    preciseModel: undefined,
    productModel: undefined,
    zpsModel: undefined,
    preciseBom: undefined,
    carNo: undefined,
    orderNo: undefined,
    remark: undefined,
    tradeVersion: undefined,
    unitCount: undefined,
    onlinePlan: undefined,
    completePlan: undefined,
    reportDate: undefined,
    country: undefined,
    contractNo: undefined,
    marketingNoticeTime: undefined,
    orderCreateTime: undefined,
    plate: undefined,
    importTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>