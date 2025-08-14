<template>
  <RefsView active-title="Клиенты" archive-title="Архив клиентов" :active-items="activeClients"
    :archived-items="archivedClients" edit-route-prefix="/references/clients/edit" add-route="/references/clients/add">
    <template #columns>
      <Column field="clientName" header="Наименование"></Column>
      <Column field="clientAddress" header="Адрес"></Column>
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

    const activeClients = computed(() => {
      return (clientsStore.items?.filter(item => item.isActive) || [])
    })

    const archivedClients = computed(() => {
      return (clientsStore.items?.filter(item => !item.isActive) || [])
    })

    onMounted(() => {
      clientsStore.fetchAll()
    })

    return {
      activeClients,
      archivedClients
    }
  }
})
</script>