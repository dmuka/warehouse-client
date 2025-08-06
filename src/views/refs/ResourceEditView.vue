<template>
  <RefEditView
    title="Ресурс"
    :list-route="'/references/resources'"
    :fetch-fn="resourcesStore.fetchResources"
    :get-fn="resourcesStore.getById"
    :update-fn="resourcesStore.update"
    :add-fn="resourcesStore.add"
    :archive-fn="resourcesStore.archive"
    :unarchive-fn="resourcesStore.unarchive"
    :remove-fn="resourcesStore.remove"
    form-field-name="resourceName"
  >
    <template #default="{ form }">
      <div class="field">
        <label for="name">Наименование</label>
        <InputText id="name" v-model="form.resourceName" required />
      </div>
    </template>
  </RefEditView>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useResourcesStore } from '@/stores/resources'
import RefEditView from '@/components/RefEditView.vue'
import InputText from 'primevue/inputtext'

export default defineComponent({
  name: 'ResourceEditView',
  components: { RefEditView, InputText },
  setup() {
    const resourcesStore = useResourcesStore()
    return { resourcesStore }
  }
})
</script>