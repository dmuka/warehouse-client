<template>
    <div class="refs-view">
        <div class="page-header">
            <h1>{{ showArchive ? archiveTitle : activeTitle }}</h1>
            <div class="header-buttons">
                <Button v-if="!showArchive && showAddButton" label="Добавить" icon="pi pi-plus"
                    @click="navigateToAdd" />
                <Button :label="showArchive ? 'К активным' : 'К архиву'"
                    :icon="showArchive ? 'pi pi-archive' : 'pi pi-tags'" @click="toggleArchive" />
            </div>
        </div>

        <DataTable :value="showArchive ? archivedItems : activeItems" stripedRows selectionMode="single"
            @rowSelect="navigateToEdit" class="custom-table">
            <slot name="columns"></slot>
        </DataTable>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'

export default defineComponent({
    name: 'RefsView',
    components: {
        Button,
        DataTable
    },
    props: {
        activeTitle: {
            type: String,
            required: true
        },
        archiveTitle: {
            type: String,
            required: true
        },
        activeItems: {
            type: Array,
            required: true
        },
        archivedItems: {
            type: Array,
            required: true
        },
        showAddButton: {
            type: Boolean,
            default: true
        },
        editRoutePrefix: {
            type: String,
            required: true
        },
        addRoute: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const showArchive = ref(false)

        const navigateToEdit = async (event: any) => {
            try {
                const item = event.data
                await router.push({
                    path: `${props.editRoutePrefix}/${item.id}`
                })
            } catch (error) {
                console.error('Navigation error:', error)
            }
        }

        const navigateToAdd = () => {
            router.push(props.addRoute)
        }

        const toggleArchive = () => {
            showArchive.value = !showArchive.value
        }

        return {
            showArchive,
            navigateToEdit,
            navigateToAdd,
            toggleArchive
        }
    }
})
</script>