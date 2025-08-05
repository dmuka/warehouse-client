<template>
  <div class="resource-edit-view">
    <Card>
      <template #title>
        <div class="page-header">
            <h1>Ресурс</h1>
            <div class="title-actions">
                <Button
                    type="submit"
                    label="Сохранить"
                    class="p-button-sm"
                    @click="handleSubmit"
                />
                <Button
                    type="button"
                    label="Удалить"
                    severity="danger"
                    class="p-button-sm"
                    @click="archiveResource"
                />
                <Button
                    type="button"
                    label="В архив"
                    severity="secondary"
                    class="p-button-sm"
                    @click="navigateBack"
                />
            </div>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label for="name">Наименование</label>
            <InputText id="name" v-model="form.name" required />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResourcesStore } from '@/stores/resources'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Card from 'primevue/card'

export default defineComponent({
  name: 'ResourceEditView',
  components: { Button, InputText, Card },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const resourcesStore = useResourcesStore()

    const form = reactive({
      name: ''
    })

    const isEditMode = computed(() => route.name === 'EditResource')

    onMounted(() => {
      if (isEditMode.value && route.params.id) {
        const resource = resourcesStore.getResourceById(route.params.id as string)
        if (resource) {
          form.name = resource.name
        }
      }
    })

    const handleSubmit = () => {
      if (isEditMode.value && route.params.id) {
        resourcesStore.updateResource(route.params.id as string, form)
      } else {
        resourcesStore.addResource({ ...form, isActive: true })
      }
      navigateBack()
    }

    const archiveResource = () => {
      if (route.params.id) {
        resourcesStore.archiveResource(route.params.id as string)
        navigateBack()
      }
    }

    const navigateBack = () => {
      router.push('/references/resources')
    }

    return { form, isEditMode, handleSubmit, archiveResource, navigateBack }
  }
})
</script>

<style scoped>
.resource-edit-view {
  max-width: 600px;
  margin: 1rem auto;
}

.title-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.field {
  margin-top: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>