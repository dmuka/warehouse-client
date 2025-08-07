<template>
  <div class="shipments-view">
    <div class="page-header">
      <h1>Отгрузки</h1>
      <Button
        label="Создать отгрузку"
        icon="pi pi-plus"
        @click="navigateToCreate"
      />
    </div>

    <DataTable :value="shipments" stripedRows>
      <Column field="number" header="Номер" sortable></Column>
      <Column field="date" header="Дата" sortable>
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
      </Column>
      <Column field="client" header="Клиент"></Column>
      <Column field="status" header="Статус"></Column>
      <Column field="resource" header="Ресурс"></Column>
      <Column field="unit" header="Единица измерения"></Column>
      <Column field="quantity" header="Количество"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShipmentsStore } from '@/stores/shipments'
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
    const shipmentsStore = useShipmentsStore()
    const shipments = ref<any[]>([])

    onMounted(async () => {
      await shipmentsStore.fetchShipments()
      shipments.value = shipmentsStore.shipments
    })

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString()
    }

    const navigateToCreate = () => {
    }

    const navigateToDetail = (id: string) => {
      router.push(`/stock/receipts/${id}`)
    }

    const deleteShipment = async (id: string) => {
      await shipmentsStore.remove(id)
      shipments.value = shipmentsStore.shipments
    }

    const handleCreate = async (formData: any) => {
      await shipmentsStore.add(formData)
      shipments.value = shipmentsStore.shipments
    }

    return {
      shipments,
      formatDate,
      navigateToCreate,
      navigateToDetail,
      deleteShipment,
      handleCreate
    }
  }
})
</script>