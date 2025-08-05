<template>
  <div class="clients-view">
    <div class="page-header">
      <h1>Клиенты</h1>
      <div class="header-buttons">
        <Button
          label="Добавить"
          icon="pi pi-plus"
          @click="navigateToAdd"
        />
        <Button
          label="К архиву"
          icon="pi pi-archive"
          @click="navigateToArchive"
        />
      </div>
    </div>

    <DataTable
      :value="activeClients"
      stripedRows
      selectionMode="single"
      @rowSelect="navigateToEdit"
      class="custom-table"
    >
      <Column field="clientName.value" header="Наименование"></Column>
      <Column field="clientAddress.value" header="Адрес"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '@/stores/clients'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
  name: 'ClientsView',
  components: {
    Button,
    DataTable,
    Column
  },
  setup() {
    const router = useRouter()
    const clientsStore = useClientsStore()

    onMounted(() => {
      clientsStore.fetchClients()
    })

    const activeClients = computed(() => {
      return clientsStore.clients.filter(c => c.isActive)
    })

    const navigateToEdit = (event: any) => {
      router.push(`/references/clients/edit/${event.data.id}`)
    }

    const navigateToAdd = () => {
      router.push('/references/clients/add')
    }

    const navigateToArchive = () => {
      router.push('/references/clients/archive')
    }

    return {
      activeClients,
      navigateToEdit,
      navigateToAdd,
      navigateToArchive
    }
  }
})
</script>