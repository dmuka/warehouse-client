<template>
  <div class="receipts-view">
    <div class="page-header">
      <h1>Поступления</h1>

      <div class="filters">

      <div class="filter-group">
        <span class="p-float-label">
          <Calendar
            id="dateFilterFrom"
            v-model="filters.date"
            dateFormat="dd.mm.yy"
            showIcon
          />
          <label for="dateFilterFrom">От</label>
        </span>
        <span class="p-float-label">
          <Calendar
            id="dateFilterTo"
            v-model="filters.date"
            dateFormat="dd.mm.yy"
            showIcon
          />
          <label for="dateFilterTo">До</label>
        </span>
      </div>

      <div class="filter-group">
        <span class="p-float-label">
          <InputText id="numberFilter" v-model="filters.number" />
          <label for="numberFilter">Номер</label>
        </span>
      </div>

      <div class="filter-group">
        <MultiSelect
          id="resourceFilter"
          v-model="filters.resources"
          :options="resourceOptions"
          optionLabel="name"
          optionValue="id"
          display="chip"
          filter
          placeholder="Ресурс"
          class="w-full md:w-80"
        />
      </div>

      <div class="filter-group">
        <MultiSelect
          id="unitFilter"
          v-model="filters.units"
          :options="unitOptions"
          optionLabel="name"
          optionValue="id"
          placeholder="Единица измерения"
          class="w-full md:w-80"
          filter
          display="chip"
        />
      </div>
    </div>
    <div class="header-buttons">
      <Button
        label="Применить"
        icon="pi pi-filter"
        @click="applyFilters"
      />
      <Button
        label="Добавить"
        icon="pi pi-plus"
        @click="navigateToCreate"
      />
    </div>
  </div>

    <DataTable :value="filteredReceipts" stripedRows>
      <Column field="receiptNumber" header="Номер" sortable></Column>
      <Column field="receiptDate" header="Дата" sortable>
        <template #body="{ data }">
          {{ formatDate(data.receiptDate) }}
        </template>
      </Column>
      <Column header="Ресурс">
        <template #body="{ data }">
          <div v-for="item in data.items" :key="item.resourceId">
            {{ item.resourceName }}
          </div>
        </template>
      </Column>
      <Column header="Единица измерения">
        <template #body="{ data }">
          <div v-for="item in data.items" :key="item.unitId">
            {{ item.unitName }}
          </div>
        </template>
      </Column>
      <Column header="Количество">
        <template #body="{ data }">
          <div v-for="item in data.items" :key="item.quantity">
            {{ item.quantity }}
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReceiptsStore } from '@/stores/receipts'
import { Receipt } from '@/types/receipts'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'

interface FilterOption {
  id: string
  name: string
}

export default defineComponent({
  name: 'ReceiptsView',
  components: {
    Button,
    DataTable,
    Column,
    InputText,
    MultiSelect,
    Calendar
  },
  setup() {
    const router = useRouter()
    const receiptsStore = useReceiptsStore()
    const receipts = ref<Receipt[]>([])

    const filters = ref({
      number: '',
      date: null as Date | null,
      resources: [] as string[],
      units: [] as string[]
    })

    const resourceOptions = computed<FilterOption[]>(() => {
      const resources = new Map<string, FilterOption>()
      receiptsStore.receipts.forEach(receipt => {
        receipt.items.forEach(item => {
          if (item.resourceId && !resources.has(item.resourceId)) {
            resources.set(item.resourceId, {
              id: item.resourceId,
              name: item.resourceName || item.resourceId
            })
          }
        })
      })
      return Array.from(resources.values())
    })

    const unitOptions = computed<FilterOption[]>(() => {
      const units = new Map<string, FilterOption>()
      receiptsStore.receipts.forEach(receipt => {
        receipt.items.forEach(item => {
          if (item.unitId && !units.has(item.unitId)) {
            units.set(item.unitId, {
              id: item.unitId,
              name: item.unitName || item.unitId
            })
          }
        })
      })
      return Array.from(units.values())
    })

    const filteredReceipts = computed(() => {
      return receiptsStore.receipts.filter(receipt => {
        const matchesNumber = !filters.value.number ||
          receipt.receiptNumber.toLowerCase().includes(filters.value.number.toLowerCase())

        const matchesDate = !filters.value.date ||
          new Date(receipt.receiptDate).toDateString() === new Date(filters.value.date).toDateString()

        const matchesResources = filters.value.resources.length === 0 ||
          receipt.items.some(item => filters.value.resources.includes(item.resourceId))

        const matchesUnits = filters.value.units.length === 0 ||
          receipt.items.some(item => filters.value.units.includes(item.unitId))

        return matchesNumber && matchesDate && matchesResources && matchesUnits
      })
    })

    const applyFilters = () => {
      // Filters are applied automatically through computed property
    }

    onMounted(async () => {
      await receiptsStore.fetchReceipts()
      receipts.value = receiptsStore.receipts
    })

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString()
    }

    const navigateToCreate = () => {
      router.push('/stock/receipts/add')
    }

    return {
      receipts,
      filteredReceipts,
      filters,
      resourceOptions,
      unitOptions,
      formatDate,
      navigateToCreate,
      applyFilters
    }
  }
})
</script>