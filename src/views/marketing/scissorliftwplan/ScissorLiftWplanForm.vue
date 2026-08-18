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
      <el-form-item label="精准车型" prop="preciseModel">
        <el-input v-model="formData.preciseModel" placeholder="请输入精准车型" />
      </el-form-item>
      <el-form-item label="产品型号" prop="productModel">
        <el-input v-model="formData.productModel" placeholder="请输入产品型号" />
      </el-form-item>
      <el-form-item label="精准BOM" prop="preciseBom">
        <el-input v-model="formData.preciseBom" placeholder="请输入精准BOM" />
      </el-form-item>
      <el-form-item label="生产日期" prop="planDate">
        <el-date-picker
          v-model="formData.planDate"
          type="date"
          value-format="x"
          placeholder="选择生产日期"
        />
      </el-form-item>
      <el-form-item label="周次" prop="weekNo">
        <el-input v-model="formData.weekNo" placeholder="请输入周次" />
      </el-form-item>
      <el-form-item label="周起始日期" prop="weekStartDate">
        <el-date-picker
          v-model="formData.weekStartDate"
          type="date"
          value-format="x"
          placeholder="选择周起始日期"
        />
      </el-form-item>
      <el-form-item label="周结束日期" prop="weekEndDate">
        <el-date-picker
          v-model="formData.weekEndDate"
          type="date"
          value-format="x"
          placeholder="选择周结束日期"
        />
      </el-form-item>
      <el-form-item label="当日数量" prop="dailyQuantity">
        <el-input v-model="formData.dailyQuantity" placeholder="请输入当日数量" />
      </el-form-item>
      <el-form-item label="车号范围" prop="carNumberRange">
        <el-input v-model="formData.carNumberRange" placeholder="请输入车号范围" />
      </el-form-item>
      <el-form-item label="生产线条类型" prop="productionLineType">
        <el-select v-model="formData.productionLineType" placeholder="请选择生产线条类型">
          <el-option label="请选择字典生成" value="" />
        </el-select>
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
import { ScissorLiftWplanApi, ScissorLiftWplanVO } from '@/api/marketing/scissorliftwplan'

/** 高机剪叉周计划 表单 */
defineOptions({ name: 'ScissorLiftWplanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  productLine: undefined,
  preciseModel: undefined,
  productModel: undefined,
  preciseBom: undefined,
  planDate: undefined,
  weekNo: undefined,
  weekStartDate: undefined,
  weekEndDate: undefined,
  dailyQuantity: undefined,
  carNumberRange: undefined,
  productionLineType: undefined,
  plate: undefined,
  importTime: undefined,
})
const formRules = reactive({
  planDate: [{ required: true, message: '生产日期不能为空', trigger: 'blur' }],
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
      formData.value = await ScissorLiftWplanApi.getScissorLiftWplan(id)
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
    const data = formData.value as unknown as ScissorLiftWplanVO
    if (formType.value === 'create') {
      await ScissorLiftWplanApi.createScissorLiftWplan(data)
      message.success(t('common.createSuccess'))
    } else {
      await ScissorLiftWplanApi.updateScissorLiftWplan(data)
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
    productLine: undefined,
    preciseModel: undefined,
    productModel: undefined,
    preciseBom: undefined,
    planDate: undefined,
    weekNo: undefined,
    weekStartDate: undefined,
    weekEndDate: undefined,
    dailyQuantity: undefined,
    carNumberRange: undefined,
    productionLineType: undefined,
    plate: undefined,
    importTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>