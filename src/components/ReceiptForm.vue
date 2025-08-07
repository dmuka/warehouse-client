<template>
  <form @submit.prevent="$emit('submit', form)">
    <div class="form-grid">
      <div class="field">
        <label for="number">Номер поступления</label>
        <InputText id="number" v-model="form.number" required />
      </div>

      <div class="field">
        <label for="date">Дата</label>
        <Calendar
          id="date"
          v-model="form.date"
          dateFormat="dd.mm.yy"
          required
        />
      </div>
    </div>

    <div class="items-header">
      <h3>Позиции</h3>
      <Button
        icon="pi pi-plus"
        label="Добавить позицию"
        @click="addItem"
      />
    </div>

    <DataTable :value="form.items" class="items-table">
      <Column field="resource.name" header="Ресурс">
        <template #body="{ data, index }">
          <Dropdown
            v-model="form.items[index].resourceId"
            :options="activeResources"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите ресурс"
          />
        </template>
      </Column>
      <Column field="quantity" header="Количество">
        <template #body="{ data, index }">
          <InputNumber
            v-model="form.items[index].quantity"
            mode="decimal"
            :min="0.01"
            :step="0.01"
          />
        </template>
      </Column>
      <Column header="Действия">
        <template #body="{ index }">
          <Button
            icon="pi pi-trash"
            class="p-button-text p-button-danger"
            @click="removeItem(index)"
          />
        </template>
      </Column>
    </DataTable>

    <div class="form-actions">
      <Button
        type="button"
        label="Отмена"
        severity="secondary"
        @click="$emit('cancel')"
      />
      <Button type="submit" label="Сохранить" />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import { useResourcesStore } from '@/stores/resources'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
  name: 'ReceiptForm',
  components: {
    InputText,
    Calendar,
    Dropdown,
    InputNumber,
    Button,
    DataTable,
    Column
  },
  setup() {
    const resourcesStore = useResourcesStore()
    const form = reactive({
      number: '',
      date: new Date(),
      items: [] as Array<{
        resourceId: string
        quantity: number
      }>
    })

    const activeResources = computed(() => {
      return resourcesStore.resources.filter(r => r.isActive)
    })

    const addItem = () => {
      form.items.push({
        resourceId: '',
        quantity: 1
      })
    }

    const removeItem = (index: number) => {
      form.items.splice(index, 1)
    }

    return {
      form,
      activeResources,
      addItem,
      removeItem
    }
  }
})
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.items-table {
  margin-bottom: 2rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>