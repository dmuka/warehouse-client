<template>
  <RefsView active-title="Клиенты" archive-title="Архив клиентов" :active-items="activeClients"
    :archived-items="archivedClients"
    edit-route-prefix="/references/clients/edit" add-route="/references/clients/add">
    <template #columns>
      <Column field="name" header="Наименование"></Column>
      <Column field="address" header="Адрес"></Column>
    </template>
  </RefsView>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useClientsStore } from '@/stores/clients'
import RefsView from '@/components/RefsView.vue'
import Column from 'primevue/column'

export default defineComponent({
  name: 'ClientsView',
  components: {
    RefsView,
    Column
  },
  setup() {
    const clientsStore = useClientsStore()

    onMounted(() => {
      clientsStore.fetchClients()
    })

    const transformClient = (client: any) => ({
      ...client,
      id: client.id.value,
      name: client.clientName.value,
      address: client.clientAddress.value
    })

    const activeClients = computed(() => {
      return (clientsStore.clients?.filter(item => item.isActive) || [])
        .map(transformClient)
    })

    const archivedClients = computed(() => {
      return (clientsStore.clients?.filter(item => !item.isActive) || [])
        .map(transformClient)
    })

    return {
      activeClients,
      archivedClients
    }
  }
})
</script>