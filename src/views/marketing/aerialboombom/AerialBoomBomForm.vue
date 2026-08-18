<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="物料编码" prop="materialCode">
        <el-input v-model="formData.materialCode" placeholder="请输入物料编码" />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input v-model="formData.materialDesc" placeholder="请输入物料描述" />
      </el-form-item>
      <el-form-item label="供应商" prop="supplier">
        <el-input v-model="formData.supplier" placeholder="请输入供应商" />
      </el-form-item>
      <el-form-item label="JIT标识（1表示JIT物料）" prop="jitFlag">
        <el-input v-model="formData.jitFlag" placeholder="请输入JIT标识（1表示JIT物料）" />
      </el-form-item>
      <el-form-item label="是否颜色管理（X表示是）" prop="colorManagement">
        <el-input v-model="formData.colorManagement" placeholder="请输入是否颜色管理（X表示是）" />
      </el-form-item>
      <el-form-item label="是否按需供货（X表示是）" prop="supplyOnDemand">
        <el-input v-model="formData.supplyOnDemand" placeholder="请输入是否按需供货（X表示是）" />
      </el-form-item>
      <el-form-item label="适配机型（多机型逗号分隔）" prop="applicableModel">
        <el-input v-model="formData.applicableModel" placeholder="请输入适配机型（多机型逗号分隔）" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="产品型号（如ZA10RJE）" prop="productModel">
        <el-input v-model="formData.productModel" placeholder="请输入产品型号（如ZA10RJE）" />
      </el-form-item>
      <el-form-item label="精准BOM（如ZA10RJE-001）" prop="preciseBom">
        <el-input v-model="formData.preciseBom" placeholder="请输入精准BOM（如ZA10RJE-001）" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="物料来源分类（臂式专用物料/剪叉专用物料/剪叉和臂式共用物料/走车物资及选配件）" prop="sourceCategory">
        <el-input v-model="formData.sourceCategory" placeholder="请输入物料来源分类（臂式专用物料/剪叉专用物料/剪叉和臂式共用物料/走车物资及选配件）" />
      </el-form-item>
      <el-form-item label="板块（默认高机）" prop="plate">
        <el-input v-model="formData.plate" placeholder="请输入板块（默认高机）" />
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
import { AerialBoomBomApi, AerialBoomBomVO } from '@/api/marketing/aerialboombom'

/** 高机臂式/剪叉BOM物料清单 表单 */
defineOptions({ name: 'AerialBoomBomForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  materialCode: undefined,
  materialDesc: undefined,
  supplier: undefined,
  jitFlag: undefined,
  colorManagement: undefined,
  supplyOnDemand: undefined,
  applicableModel: undefined,
  remark: undefined,
  productModel: undefined,
  preciseBom: undefined,
  quantity: undefined,
  sourceCategory: undefined,
  plate: undefined,
  importTime: undefined,
})
const formRules = reactive({
  materialCode: [{ required: true, message: '物料编码不能为空', trigger: 'blur' }],
  productModel: [{ required: true, message: '产品型号（如ZA10RJE）不能为空', trigger: 'blur' }],
  preciseBom: [{ required: true, message: '精准BOM（如ZA10RJE-001）不能为空', trigger: 'blur' }],
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
      formData.value = await AerialBoomBomApi.getAerialBoomBom(id)
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
    const data = formData.value as unknown as AerialBoomBomVO
    if (formType.value === 'create') {
      await AerialBoomBomApi.createAerialBoomBom(data)
      message.success(t('common.createSuccess'))
    } else {
      await AerialBoomBomApi.updateAerialBoomBom(data)
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
    materialCode: undefined,
    materialDesc: undefined,
    supplier: undefined,
    jitFlag: undefined,
    colorManagement: undefined,
    supplyOnDemand: undefined,
    applicableModel: undefined,
    remark: undefined,
    productModel: undefined,
    preciseBom: undefined,
    quantity: undefined,
    sourceCategory: undefined,
    plate: undefined,
    importTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>