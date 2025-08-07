<template>
  <div class="receipts-view">
    <div class="page-header">
      <h1>Поступления</h1>
      <Button
        label="Создать поступление"
        icon="pi pi-plus"
        @click="navigateToCreate"
      />
    </div>

    <DataTable :value="receipts" stripedRows>
      <Column field="number" header="Номер" sortable></Column>
      <Column field="date" header="Дата" sortable>
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
      <Column field="resource" header="Ресурс"></Column>
      <Column field="unit" header="Единица измерения"></Column>
      <Column field="quantity" header="Количество"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReceiptsStore } from '@/stores/receipts'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
  name: 'ReceiptsView',
  components: {
    Button,
    DataTable,
    Column
  },
  setup() {
    const router = useRouter()
    const receiptsStore = useReceiptsStore()
    const receipts = ref<any[]>([])

    onMounted(async () => {
      await receiptsStore.fetchReceipts()
      receipts.value = receiptsStore.receipts
    })

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString()
    }

    const navigateToCreate = () => {
    }

    const navigateToDetail = (id: string) => {
      router.push(`/stock/receipts/${id}`)
    }

    const deleteReceipt = async (id: string) => {
      await receiptsStore.remove(id)
      receipts.value = receiptsStore.receipts
    }

    const handleCreate = async (formData: any) => {
      await receiptsStore.add(formData)
      receipts.value = receiptsStore.receipts
    }

    return {
      receipts,
      formatDate,
      navigateToCreate,
      navigateToDetail,
      deleteReceipt,
      handleCreate
    }
  }
})
</script>