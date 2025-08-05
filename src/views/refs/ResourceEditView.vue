<template>
  <div class="resource-edit-view">
    <Card>
      <template #title>
        <div class="page-header">
          <h1>Ресурс</h1>
          <div class="header-buttons">
            <Button type="submit" label="Сохранить" class="p-button-sm" @click="handleSubmit" />
            <Button type="button" label="Удалить" severity="danger" class="p-button-sm" @click="archiveResource" />
            <Button type="button" label="В архив" severity="secondary" class="p-button-sm" @click="navigateBack" />
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
    const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string

    onMounted(async () => {
      if (isEditMode.value && id) {
        const resource = await resourcesStore.getResourceById(id)
        if (resource) {
          form.name = resource.resourceName?.value || ''
        } else if (route.query.name) {
          form.name = route.query.name as string
        }
      }
    })

    const handleSubmit = async () => {
      if (isEditMode.value && id) {
        await resourcesStore.updateResource({
          id: id,
          resourceName: form.name,
          isActive: true
        })
      } else {
        await resourcesStore.addResource({
          resourceName: form.name,
          isActive: true
        })
      }
      navigateBack()
    }

    const archiveResource = () => {
      if (route.params.id) {
        resourcesStore.archiveResource(Number(id))
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