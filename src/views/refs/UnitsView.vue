<template>
  <div class="units-view">
    <div class="page-header">
      <h1>Единицы измерения</h1>
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
      :value="activeUnits"
      stripedRows
      selectionMode="single"
      @rowSelect="navigateToEdit"
      class="custom-table"
    >
      <Column field="unitName.value" header="Наименование"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUnitsStore } from '@/stores/units'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
  name: 'UnitsView',
  components: {
    Button,
    DataTable,
    Column
  },
  setup() {
    const router = useRouter()
    const unitsStore = useUnitsStore()

    onMounted(() => {
      unitsStore.fetchUnits()
    })

    const activeUnits = computed(() => {
      return unitsStore.units.filter(u => u.isActive)
    })

    const navigateToEdit = (event: any) => {
      router.push(`/references/units/edit/${event.data.id}`)
    }

    const navigateToAdd = () => {
      router.push('/references/units/add')
    }

    const navigateToArchive = () => {
      router.push('/references/units/archive')
    }

    return {
      activeUnits,
      navigateToEdit,
      navigateToAdd,
      navigateToArchive
    }
  }
})
</script>