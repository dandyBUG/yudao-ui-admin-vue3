<template>
  <Dialog
    :title="'缺口明细 - ' + mainMaterialDesc"
    v-model="dialogVisible"
    width="1000px"
    :close-on-click-modal="false"
  >
    <el-table :data="detailList" border stripe v-loading="loading">
      <el-table-column label="组件物料编码" prop="componentMaterialNo" min-width="160px" />
      <el-table-column label="组件名称" prop="componentDesc" min-width="180px" />
      <el-table-column label="单位用量" prop="unitUsage" align="right" width="100px" />
      <el-table-column label="库存数量" prop="stockQuantity" align="right" width="110px" />
      <el-table-column label="在途数量" prop="transit" align="right" width="110px" />
      <el-table-column label="已发数量" prop="issue" align="right" width="110px" />
      <el-table-column label="缺口数量" prop="shortageQty" align="right" width="120px">
        <template #default="scope">
          <el-tag :type="scope.row.shortageQty > 0 ? 'danger' : 'success'">
            {{ scope.row.shortageQty }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { MaterialShortageApi, MaterialShortageDetailVO } from '@/api/aps/materialshortage'

const dialogVisible = ref(false)
const loading = ref(false)
const detailList = ref<MaterialShortageDetailVO[]>([])
const mainMaterialNo = ref('')
const mainMaterialDesc = ref('')

/** 打开弹窗 */
const open = async (materialNo: string, materialDesc: string) => {
  mainMaterialNo.value = materialNo
  mainMaterialDesc.value = materialDesc
  dialogVisible.value = true
  loading.value = true
  try {
    detailList.value = await MaterialShortageApi.getDetails(materialNo)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
