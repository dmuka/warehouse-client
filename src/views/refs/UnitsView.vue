<template>
  <RefsView active-title="Единицы измерения" archive-title="Архив единиц измерений" :active-items="activeUnits"
    :archived-items="archivedUnits"
    edit-route-prefix="/references/units/edit" add-route="/references/units/add">
    <template #columns>
      <Column field="name" header="Наименование"></Column>
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
      unitsStore.fetchUnits()
    })

    const transformUnit = (unit: any) => ({
      ...unit,
      id: unit.id.value,
      name: unit.unitName.value
    })

    const activeUnits = computed(() => {
      return (unitsStore.units?.filter(item => item.isActive) || [])
        .map(transformUnit)
    })

    const archivedUnits = computed(() => {
      return (unitsStore.units?.filter(item => !item.isActive) || [])
        .map(transformUnit)
    })

    return {
      activeUnits,
      archivedUnits
    }
  }
})
</script>