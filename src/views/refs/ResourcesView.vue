<template>
  <div class="resources-view">
    <div class="page-header">
      <h1>Ресурсы</h1>
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
      :value="activeResources"
      stripedRows
      selectionMode="single"
      @rowSelect="navigateToEdit"
      class="custom-table"
    >
      <Column field="resourceName.value" header="Наименование"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResourcesStore } from '@/stores/resources'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
  name: 'ResourcesView',
  components: {
    Button,
    DataTable,
    Column
  },
  setup() {
    const router = useRouter()
    const resourcesStore = useResourcesStore()

    onMounted(() => {
      resourcesStore.fetchResources()
    })

    const activeResources = computed(() => {
      return resourcesStore.resources.filter(r => r.isActive)
    })

    const navigateToEdit = (event: any) => {
      const resource = event.data
      router.push({
        path: `/references/resources/edit/${resource.id.value}`,
        query: { name: resource.resourceName.value }
      })
    }

    const navigateToAdd = () => {
      router.push('/references/resources/add')
    }

    const navigateToArchive = () => {
      router.push('/references/resources/archive')
    }

    return {
      activeResources,
      navigateToEdit,
      navigateToAdd,
      navigateToArchive
    }
  }
})
</script>