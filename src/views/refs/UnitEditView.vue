<template>
  <RefEditView
    title="Единица измерения"
    :list-route="'/references/units'"
    :fetch-fn="unitsStore.fetchUnits"
    :get-fn="unitsStore.getById"
    :update-fn="unitsStore.update"
    :add-fn="unitsStore.add"
    :archive-fn="unitsStore.archive"
    :unarchive-fn="unitsStore.unarchive"
    :remove-fn="unitsStore.remove"
    form-field-name="unitName"
  >
    <template #default="{ form }">
      <div class="form-section">
        <div class="form-row">
          <label class="form-label">Наименование</label>
          <InputText id="Name" v-model="form.unitName.value" required />
        </div>
      </div>
    </template>
  </RefEditView>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUnitsStore } from '@/stores/units'
import RefEditView from '@/components/RefEditView.vue'
import InputText from 'primevue/inputtext'

export default defineComponent({
  name: 'ClientEditView',
  components: { RefEditView, InputText },
  setup() {
    const unitsStore = useUnitsStore()
    return { unitsStore }
  }
})
</script>