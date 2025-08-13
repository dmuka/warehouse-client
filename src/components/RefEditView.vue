<template>
    <div class="ref-edit-view">
        <Card>
            <template #title>
                <div class="page-header">
                    <h1>{{ title }}</h1>
                    <div class="header-buttons">
                        <Button label="Сохранить" icon="pi pi-save" @click="handleSubmit" />
                        <Button v-if="showDeleteButton" label="Удалить" icon="pi pi-trash" severity="danger"
                            @click="remove" />
                        <Button v-if="showArchiveButton" :label="isArchived ? 'В работу' : 'В архив'"
                            severity="secondary" icon="pi pi-tags" @click="isArchived ? unarchive() : archive()" />
                    </div>
                </div>
            </template>
            <template #content>
                <form @submit.prevent="handleSubmit">
                    <slot :form="form"></slot>
                </form>
            </template>
        </Card>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Card from 'primevue/card'

export default defineComponent({
    name: 'RefEditView',
    components: { Button, Card },
    props: {
        title: {
            type: String,
            required: true
        },
        listRoute: {
            type: String,
            required: true
        },
        fetchFn: {
            type: Function,
            required: true
        },
        getFn: {
            type: Function,
            required: true
        },
        updateFn: {
            type: Function,
            required: true
        },
        addFn: {
            type: Function,
            required: true
        },
        archiveFn: {
            type: Function,
            required: true
        },
        unarchiveFn: {
            type: Function,
            required: false
        },
        removeFn: {
            type: Function,
            required: true
        },
        formFieldName: {
            type: String,
            default: 'name'
        },
        formFieldAddress: {
            type: String,
            default: 'address'
        }
    },
    setup(props) {
        const route = useRoute()
        const router = useRouter()
        const toast = useToast()

        const form = reactive({
            [props.formFieldName]: '',
            isActive: true
        })

        const isEditMode = computed(() => route.name?.toString().includes('Edit'))
        const isAddMode = computed(() => !isEditMode.value)
        const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
        const isArchived = ref(false)

        onMounted(async () => {
            if (isEditMode.value && id) {
                const entity = await props.getFn(id)
                if (entity) {
                    form[props.formFieldName] = entity[props.formFieldName] || ''
                    form[props.formFieldAddress] = entity[props.formFieldAddress] || ''
                    form.isActive = entity.isActive
                    isArchived.value = !entity.isActive
                } else if (route.query[props.formFieldName]) {
                    form[props.formFieldName] = route.query[props.formFieldName] as string
                    form[props.formFieldAddress] = route.query[props.formFieldAddress] as string
                    form.isActive = true
                }
            }
        })

        const showDeleteButton = computed(() => isEditMode.value)
        const showArchiveButton = computed(() => isEditMode.value)

        const handleSubmit = async () => {
            try {
                if (isEditMode.value && id) {
                    try {
                        await props.updateFn({
                            id: id,
                            [props.formFieldName]: form[props.formFieldName],
                            [props.formFieldAddress]: form[props.formFieldAddress],
                            isActive: form.isActive
                        })
                        showSuccessToast('Updated')
                    }
                    catch (error) {
                    }
                } else {
                    try {
                        await props.addFn({
                            [props.formFieldName]: form[props.formFieldName],
                            [props.formFieldAddress]: form[props.formFieldAddress],
                            isActive: true
                        })
                        showSuccessToast('Added')
                    }
                    catch (error) {
                    }
                }
                navigateBack()
            } catch (error) {

            }
        }

        const archive = async () => {
            if (id) {
                await props.archiveFn(id)
                form.isActive = false
                isArchived.value = true
                showSuccessToast('Archived')
                navigateBack()
            }
        }

        const unarchive = async () => {
            if (id && props.unarchiveFn) {
                await props.unarchiveFn(id)
                form.isActive = true
                isArchived.value = false
                showSuccessToast('Unarchived')
                navigateBack()
            }
        }

        const remove = async () => {
            if (id) {
                await props.removeFn(id)
                showSuccessToast('Removed')
                navigateBack()
            }
        }

        const navigateBack = () => {
            props.fetchFn()
            router.push(props.listRoute)
        }

        const showSuccessToast = (detail: string) => {
            toast.add({
                severity: 'success',
                summary: 'Успешно',
                detail,
                life: 3000
            })
        }

        return {
            form,
            isEditMode,
            isAddMode,
            isArchived,
            showDeleteButton,
            showArchiveButton,
            handleSubmit,
            archive,
            unarchive,
            remove,
            showSuccessToast,
            navigateBack
        }
    }
})
</script>