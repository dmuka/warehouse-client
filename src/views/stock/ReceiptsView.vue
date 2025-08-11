<template>
  <div class="receipts-view">
    <div class="page-header">
      <h1>Поступления</h1>

      <div class="filters">
        <div class="filter-group">
          <span class="p-float-label">
            <Calendar
              id="dateFilterFrom"
              v-model="dateFrom"
              dateFormat="dd.mm.yy"
              showIcon
            />
            <label for="dateFilterFrom">От</label>
          </span>
          <span class="p-float-label">
            <Calendar
              id="dateFilterTo"
              v-model="dateTo"
              dateFormat="dd.mm.yy"
              showIcon
            />
            <label for="dateFilterTo">До</label>
          </span>
        </div>

        <div class="filter-group">
          <span class="p-float-label">
            <InputText id="numberFilter" v-model="number" />
            <label for="numberFilter">Номер поступления</label>
          </span>
        </div>

        <div class="filter-group">
          <MultiSelect
            id="resourceFilter"
            v-model="selectedResources"
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
            v-model="selectedUnits"
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
          :disabled="loading"
        />
        <Button
          label="Добавить"
          icon="pi pi-plus"
          @click="navigateToCreate"
          :disabled="loading"
        />
        <ProgressSpinner v-if="loading" style="width: 30px; height: 30px" />
      </div>
    </div>

    <DataTable
      :value="receipts"
      stripedRows
      selectionMode="single"
      @rowSelect="onRowSelect"
      dataKey="id"
      :loading="loading"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
      :totalRecords="totalRecords"
    >
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
import { ReceiptFilter } from '@/types/receipts'
import { RECEIPT_ADD, RECEIPT_EDIT } from '@/router/routes'
import { DataTableRowSelectEvent } from 'primevue/datatable'
import { FilterOption } from '@/types/filter'
import { Pagination } from '@/types/pagination'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'
import ProgressSpinner from 'primevue/progressspinner'

export default defineComponent({
  name: 'ReceiptsView',
  components: {
    Button,
    DataTable,
    Column,
    InputText,
    MultiSelect,
    Calendar,
    ProgressSpinner
  },
  setup() {
    const router = useRouter()
    const receiptsStore = useReceiptsStore()
    const loading = ref(false)
    const totalRecords = ref(0)
    const pagination = ref<Pagination>({
      page: 1,
      rows: 10
    })

    const receipts = computed(() => receiptsStore.receipts)

    const dateFrom = ref<Date>()
    const dateTo = ref<Date>()
    const number = ref<string>()
    const selectedResources = ref<string[]>([])
    const selectedUnits = ref<string[]>([])

    const resourceOptions = computed<FilterOption[]>(() => {
      const resources = new Map<string, FilterOption>()
      receiptsStore.receipts.forEach(receipt => {
        receipt.items.forEach(item => {
          if (!resources.has(item.resourceId)) {
            resources.set(item.resourceId, {
              id: item.resourceId,
              name: item.resourceName
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
          if (!units.has(item.unitId)) {
            units.set(item.unitId, {
              id: item.unitId,
              name: item.unitName
            })
          }
        })
      })
      return Array.from(units.values())
    })

    const applyFilters = async () => {
      loading.value = true
      try {
        const filter: ReceiptFilter = {
          page: pagination.value.page,
          size: pagination.value.rows
        }

        if (dateFrom.value) {
          const fromDate = new Date(dateFrom.value)
          filter.dateFrom = new Date(Date.UTC(
            fromDate.getFullYear(),
            fromDate.getMonth(),
            fromDate.getDate(),
            0, 0, 0
          ))
        }

        if (dateTo.value) {
          const toDate = new Date(dateTo.value)
          filter.dateTo = new Date(Date.UTC(
            toDate.getFullYear(),
            toDate.getMonth(),
            toDate.getDate(),
            23, 59, 59
          ))
        }

        if (number.value) {
          filter.receiptNumber = number.value
        }

        filter.resourceIds = selectedResources.value
        filter.unitIds = selectedUnits.value

        await receiptsStore.fetchFilteredReceipts(filter)
      } catch (error) {
        console.error('Ошибка при фильтрации поступлений:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await receiptsStore.fetchReceipts()
    })

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const onRowSelect = (event: DataTableRowSelectEvent) => {
      router.push(RECEIPT_EDIT.replace(':id', event.data.id))
    }

    const navigateToCreate = () => {
      router.push(RECEIPT_ADD)
    }

    return {
      receipts,
      resourceOptions,
      unitOptions,
      loading,
      totalRecords,
      dateFrom,
      dateTo,
      number,
      selectedResources,
      selectedUnits,
      formatDate,
      navigateToCreate,
      onRowSelect,
      applyFilters
    }
  }
})
</script>