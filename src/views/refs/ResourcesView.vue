<template>
  <RefsView active-title="Ресурсы" archive-title="Архив ресурсов" :active-items="activeResources"
    :archived-items="archivedResources" edit-route-prefix="/references/resources/edit"
    add-route="/references/resources/add">
    <template #columns>
      <Column field="resourceName" header="Наименование"></Column>
    </template>
  </RefsView>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useResourcesStore } from '@/stores/resources'
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

    const activeResources = computed(() => {
      return (resourcesStore.items?.filter(item => item.isActive) || [])
    })

    const archivedResources = computed(() => {
      return (resourcesStore.items?.filter(item => !item.isActive) || [])
    })

    onMounted(() => {
      resourcesStore.fetchAll()
    })

    return {
      activeResources,
      archivedResources
    }
  }
})
</script>