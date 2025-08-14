<template>
  <div class="balance-view">
    <div class="page-header">
      <h1>Баланс</h1>
    </div>

    <div class="filters">
      <div class="filter-group">
        <MultiSelect id="resourceFilter" v-model="selectedResources" :options="resourceOptions" optionLabel="name"
          optionValue="id" display="chip" filter placeholder="Выберите ресурсы" class="w-full md:w-80" />
      </div>

      <div class="filter-group">
        <MultiSelect id="unitFilter" v-model="selectedUnits" :options="unitOptions" optionLabel="name"
          optionValue="id" placeholder="Выберите единицы" class="w-full md:w-80" filter display="chip"
          panelClass="clean-panel" />
      </div>

      <div class="filter-group">
        <Button label="Применить" @click="applyFilters" :loading="loading" class="p-button-primary" />
      </div>
    </div>

    <DataTable v-if="balances.length > 0" :value="balances" stripedRows showGridlines class="custom-table"
      :loading="loading" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]">
      <Column field="resourceName" header="Ресурс" sortable></Column>
      <Column field="unitName" header="Единица измерения" sortable></Column>
      <Column field="quantity" header="Баланс" sortable>
        <template #body="{ data }">
          {{ formatNumber(data.quantity) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useBalancesStore } from '@/stores/balances'
import { FilterOption } from '@/types/filter'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'

export default defineComponent({
  name: 'BalancesView',
  components: {
    DataTable,
    Column,
    MultiSelect,
    Button
  },
  setup() {
    const balancesStore = useBalancesStore()
    const loading = ref(false)
    const toast = useToast();

    onMounted(() => {
      balancesStore.fetchAllBalances()
    })

    const selectedResources = ref<string[]>([])
    const selectedUnits = ref<string[]>([])

    const balances = computed(() => balancesStore.balances)
    const resourceOptions = computed<FilterOption[]>(() => {
      const resources = new Map<string, FilterOption>()
      balancesStore.balances.forEach(item => {
        if (!resources.has(item.resourceId)) {
          resources.set(item.resourceId, {
            id: item.resourceId,
            name: item.resourceName
          })
        }
      })
      return Array.from(resources.values())
    })

    const unitOptions = computed<FilterOption[]>(() => {
      const units = new Map<string, FilterOption>()
      balancesStore.balances.forEach(item => {
        if (!units.has(item.unitId)) {
          units.set(item.unitId, {
            id: item.unitId,
            name: item.unitName
          })
        }
      })
      return Array.from(units.values())
    })

    const applyFilters = async () => {
      loading.value = true
      try {
        await balancesStore.fetchFilteredBalances({
          resourceNames: selectedResources.value.length ? selectedResources.value : undefined,
          unitNames: selectedUnits.value.length ? selectedUnits.value : undefined
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Filter Error',
          detail: error instanceof Error ? error.message : 'Failed to apply filters',
          life: 3000
        })
        console.error('Ошибка при фильтрации баланса:', error)
      } finally {
        loading.value = false
      }
    }

    const formatNumber = (value: number) => {
      return new Intl.NumberFormat('ru-RU').format(value)
    }

    return {
      loading,
      selectedResources,
      selectedUnits,
      resourceOptions,
      unitOptions,
      balances,
      applyFilters,
      formatNumber
    }
  }
})
</script>