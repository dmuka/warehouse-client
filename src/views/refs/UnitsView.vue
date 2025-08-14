<template>
  <RefsView active-title="Единицы измерения" archive-title="Архив единиц измерений" :active-items="activeUnits"
    :archived-items="archivedUnits"
    edit-route-prefix="/references/units/edit" add-route="/references/units/add">
    <template #columns>
      <Column field="unitName" header="Наименование"></Column>
    </template>
  </RefsView>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useUnitsStore } from '@/stores/units'
import RefsView from '@/components/RefsView.vue'
import Column from 'primevue/column'

export default defineComponent({
  name: 'UnitsView',
  components: {
    RefsView,
    Column
  },
  setup() {
    const unitsStore = useUnitsStore()

    onMounted(() => {
      unitsStore.fetchAll()
    })

    const activeUnits = computed(() => {
      return (unitsStore.items?.filter(item => item.isActive) || [])
    })

    const archivedUnits = computed(() => {
      return (unitsStore.items?.filter(item => !item.isActive) || [])
    })

    return {
      activeUnits,
      archivedUnits
    }
  }
})
</script>