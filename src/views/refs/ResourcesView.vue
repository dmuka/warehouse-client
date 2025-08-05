<template>
  <div class="resources-view">
    <div class="page-header">
      <h1>{{ showArchive ? 'Архив ресурсов' : 'Ресурсы' }}</h1>
      <div class="header-buttons">
        <Button
          v-if="!showArchive"
          label="Добавить"
          icon="pi pi-plus"
          @click="navigateToAdd"
        />
        <Button
          :label="showArchive ? 'К активным' : 'К архиву'"
          :icon="showArchive ? 'pi pi-archive' : 'pi pi-tags'"
          @click="toggleArchive"
        />
      </div>
    </div>

    <DataTable
      :value="filteredResources"
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
import { defineComponent, computed, ref, onMounted } from 'vue'
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
    const showArchive = ref(false)

    onMounted(() => {
      resourcesStore.fetchResources()
    })

    const filteredResources = computed(() => {
      return resourcesStore.resources.filter(r => r.isActive !== showArchive.value)
    })

    const navigateToEdit = (event: any) => {
      const resource = event.data
      router.push({
        path: `/references/resources/edit/${resource.id.value}`
      })
    }

    const navigateToAdd = () => {
      router.push('/references/resources/add')
    }

    const toggleArchive = () => {
      showArchive.value = !showArchive.value
    }

    return {
      filteredResources,
      showArchive,
      navigateToEdit,
      navigateToAdd,
      toggleArchive
    }
  }
})
</script>