<template>
  <RefsView active-title="Ресурсы" archive-title="Архив ресурсов" :active-items="activeResources"
    :archived-items="archivedResources" edit-route-prefix="/references/resources/edit"
    add-route="/references/resources/add">
    <template #columns>
      <Column field="Name" header="Наименование"></Column>
    </template>
  </RefsView>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useResourcesStore } from '@/stores/resources'
import { Resource } from '@/types/resources'
import RefsView from '@/components/RefsView.vue'
import Column from 'primevue/column'

export default defineComponent({
  name: 'ResourcesView',
  components: {
    RefsView,
    Column
  },
  setup() {
    const resourcesStore = useResourcesStore()

    onMounted(() => {
      resourcesStore.fetchResources()
    })

    const transformResource = (resource: Resource) => ({
      ...resource,
      Id: resource.id,
      Name: resource.resourceName
    })

    const activeResources = computed(() => {
      return (resourcesStore.resources?.filter(item => item.isActive) || [])
        .map(transformResource)
    })

    const archivedResources = computed(() => {
      return (resourcesStore.resources?.filter(item => !item.isActive) || [])
        .map(transformResource)
    })

    return {
      activeResources,
      archivedResources
    }
  }
})
</script>