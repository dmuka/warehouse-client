<template>
  <div class="receipt-create-view">
    <div class="page-header">
      <h1>Поступление</h1>
      <Button
        label="Сохранить"
        icon="pi pi-save"
        @click="saveReceipt"
      />
    </div>

    <div class="form-section">
      <div class="form-row">
        Номер
          <InputText id="number" v-model="receipt.receiptNumber" />
      </div>

      <div class="form-row">
        Дата
          <Calendar
            id="date"
            v-model="receipt.receiptDate"
            dateFormat="dd.mm.yy"
            showIcon
          />
      </div>
    </div>

    <div class="items-section">
      <div class="section-header">
        <h3>Позиции</h3>
      </div>

      <DataTable :value="receipt.items" stripedRows>
        <Column header="">
          <template #header>
            <Button
              icon="pi pi-plus"
              @click="addItem"
              class="p-button-sm"
            />
          </template>
          <template #body="{ index }">
            <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-text p-button-sm"
              @click="removeItem(index)"
            />
          </template>
        </Column>
        <Column field="resource" header="Ресурс">
          <template #body="{ data, index }">
            <Dropdown
              v-model="receipt.items[index].resourceId"
              :options="resourceOptions"
              optionLabel="name"
              optionValue="id"
              placeholder="Выберите ресурс"
            />
          </template>
        </Column>
        <Column field="unit" header="Единица измерения">
          <template #body="{ data, index }">
            <Dropdown
              v-model="receipt.items[index].unitId"
              :options="unitOptions"
              optionLabel="name"
              optionValue="id"
              placeholder="Выберите единицу"
            />
          </template>
        </Column>
        <Column field="quantity" header="Количество">
          <template #body="{ data, index }">
            <InputNumber
              v-model="receipt.items[index].quantity"
              mode="decimal"
              :min="0"
              :max="999999"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReceiptsStore } from '@/stores/receipts'
import { useResourcesStore } from '@/stores/resources'
import { useUnitsStore } from '@/stores/units'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import { Receipt } from '@/types/receipts'

interface ReceiptItem {
  resourceId: string
  unitId: string
  quantity: number
}

export default defineComponent({
  name: 'ReceiptCreateView',
  components: {
    Button,
    InputText,
    Calendar,
    DataTable,
    Column,
    Dropdown,
    InputNumber
  },
  setup() {
    const router = useRouter()
    const receiptsStore = useReceiptsStore()
    const resourcesStore = useResourcesStore()
    const unitsStore = useUnitsStore()

    const receipt = ref({
      receiptNumber: '',
      receiptDate: new Date(),
      items: [] as ReceiptItem[]
    })

    const transformResource = (resource: any) => ({
  id: resource.id?.value || resource.id,
  name: resource.resourceName?.value || resource.name,
  isActive: resource.isActive
})

const transformUnit = (unit: any) => ({
  id: unit.id?.value || unit.id,
  name: unit.unitName?.value || unit.name,
  isActive: unit.isActive
})

    const resourceOptions = computed(() => {
      return resourcesStore.resources.map(transformResource)
    })

    const unitOptions = computed(() => {
      return unitsStore.units.map(transformUnit)
    })

    onMounted(async () => {
      try {
        await Promise.all([
          resourcesStore.fetchResources(),
          unitsStore.fetchUnits()
        ])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    })

    const addItem = () => {
      receipt.value.items.push({
        resourceId: '',
        unitId: '',
        quantity: 0
      })
    }

    const removeItem = (index: number) => {
      receipt.value.items.splice(index, 1)
    }

    const saveReceipt = async () => {
      try {
        const receiptToSave: Receipt = {
          receiptNumber: receipt.value.receiptNumber,
          receiptDate: receipt.value.receiptDate,
          items: receipt.value.items.map(item => ({
            resourceId: item.resourceId,
            unitId: item.unitId,
            quantity: item.quantity,
            resourceName: resourceOptions.value.find(r => r.id === item.resourceId)?.name,
            unitName: unitOptions.value.find(u => u.id === item.unitId)?.name
          }))
        }

        await receiptsStore.add(receiptToSave)
        router.push('/stock/receipts')
      } catch (error) {
        console.error('Error saving receipt:', error)
      }
    }

    return {
      receipt,
      resourceOptions,
      unitOptions,
      addItem,
      removeItem,
      saveReceipt
    }
  }
})
</script>