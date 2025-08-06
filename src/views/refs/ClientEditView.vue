<template>
  <RefEditView
    title="Клиент"
    :list-route="'/references/clients'"
    :fetch-fn="clientsStore.fetchClients"
    :get-fn="clientsStore.getById"
    :update-fn="clientsStore.update"
    :add-fn="clientsStore.add"
    :archive-fn="clientsStore.archive"
    :unarchive-fn="clientsStore.unarchive"
    :remove-fn="clientsStore.remove"
    form-field-name="clientName"
    form-field-address="clientAddress"
  >
    <template #default="{ form }">
      <div class="field">
        <label for="name">Наименование</label>
        <InputText id="name" v-model="form.clientName" required />
      </div>
      <div class="field">
        <label for="address">Адрес</label>
        <InputText id="address" v-model="form.clientAddress" required />
      </div>
    </template>
  </RefEditView>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useClientsStore } from '@/stores/clients'
import RefEditView from '@/components/RefEditView.vue'
import InputText from 'primevue/inputtext'

export default defineComponent({
  name: 'ClientEditView',
  components: { RefEditView, InputText },
  setup() {
    const clientsStore = useClientsStore()
    return { clientsStore }
  }
})
</script>