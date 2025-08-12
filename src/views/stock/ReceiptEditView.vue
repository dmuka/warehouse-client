<template>
    <div class="receipt-form-view">
        <div class="page-header">
            <h1>{{ isEditMode ? 'Редактирование поступления' : 'Новое поступление' }}</h1>
            <div class="header-buttons">
                <Button label="Сохранить" icon="pi pi-save" @click="saveReceipt" />
                <Button v-if="isEditMode" label="Удалить" icon="pi pi-times" class="p-button-secondary ml-2"
                    @click="removeReceipt" />
            </div>
        </div>

        <div class="form-section">
            <div class="form-row">
                <label class="form-label">Номер</label>
                <InputText id="number" v-model="receipt.receiptNumber" />
            </div>

            <div class="form-row">
                <label class="form-label">Дата</label>
                <Calendar id="date" v-model="receipt.receiptDate as Date" dateFormat="dd.mm.yy" showIcon />
            </div>
        </div>

        <div class="items-section" v-if="receipt.items.length > 0">
            <div class="section-header">
                <h3>Позиции</h3>
            </div>

            <DataTable :value="receipt.items" stripedRows>
                <Column header="">
                    <template #header>
                        <Button icon="pi pi-plus" @click="addItem" class="p-button-sm" />
                    </template>
                    <template #body="{ index }">
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm"
                            @click="removeItem(index)" />
                    </template>
                </Column>
                <Column field="resource" header="Ресурс">
                    <template #body="{ data, index }">
                        <Dropdown v-model="receipt.items[index].resourceId" :options="resourceOptions"
                            optionLabel="name" optionValue="id" placeholder="Выберите ресурс" />
                    </template>
                </Column>
                <Column field="unit" header="Единица измерения">
                    <template #body="{ data, index }">
                        <Dropdown v-model="receipt.items[index].unitId" :options="unitOptions" optionLabel="name"
                            optionValue="id" placeholder="Выберите единицу" />
                    </template>
                </Column>
                <Column field="quantity" header="Количество">
                    <template #body="{ data, index }">
                        <InputNumber v-model="receipt.items[index].quantity" mode="decimal" :min="0" :max="999999" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useReceiptsStore } from '@/stores/receipts'
import { useResourcesStore } from '@/stores/resources'
import { useUnitsStore } from '@/stores/units'
import { Receipt, ReceiptItem } from '@/types/receipts'
import { Resource } from '@/types/resources'
import { Unit } from '@/types/units'
import { RECEIPTS, Receipts } from '@/router/routes'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

export default defineComponent({
    name: 'ReceiptForm',
    components: {
        Button,
        InputText,
        Calendar,
        DataTable,
        Column,
        Dropdown,
        InputNumber
    },
    props: {
        id: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const router = useRouter()
        const receiptsStore = useReceiptsStore()
        const resourcesStore = useResourcesStore()
        const unitsStore = useUnitsStore()

        const isEditMode = computed(() => props.id !== null)

        const receipt = ref<Receipt>({
            id: '',
            receiptNumber: '',
            receiptDate: new Date(),
            items: [] as ReceiptItem[]
        })

        const transformResource = (resource: Resource) => ({
            id: resource.id,
            name: resource.resourceName,
            isActive: resource.isActive
        })

        const transformUnit = (unit: Unit) => ({
            id: unit.id,
            name: unit.unitName,
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

                if (isEditMode.value) {
                    const existingReceipt = await receiptsStore.getById(props.id)
                    if (existingReceipt) {
                        receipt.value = {
                            ...existingReceipt,
                            receiptDate: new Date(existingReceipt.receiptDate)
                        }
                    }
                } else {
                    addItem()
                }
            } catch (error) {
                console.error('Error loading data:', error)
            }
        })

        const addItem = () => {
            receipt.value.items.push({
                id: '',
                resourceId: '',
                resourceName: '',
                unitId: '',
                unitName: '',
                quantity: 0
            } as ReceiptItem)
        }

        const removeItem = (index: number) => {
            receipt.value.items.splice(index, 1)
        }

        const saveReceipt = async () => {
            try {
                const payload: Receipt = {
                    id: isEditMode.value ? receipt.value.id : undefined,
                    receiptNumber: receipt.value.receiptNumber,
                    receiptDate: receipt.value.receiptDate,
                    items: receipt.value.items.map(item => ({
                        id: item.id,
                        resourceId: item.resourceId,
                        unitId: item.unitId,
                        quantity: item.quantity,
                        resourceName: resourceOptions.value.find(r => r.id === item.resourceId)?.name || '',
                        unitName: unitOptions.value.find(u => u.id === item.unitId)?.name || ''
                    }))
                };

                if (isEditMode.value) {
                    await receiptsStore.update(payload);
                } else {
                    await receiptsStore.add(payload);
                }
                navigateBack()
            } catch (error) {
                console.error('Error saving receipt:', error);
            }
        }

        const removeReceipt = async () => {
            await receiptsStore.remove(props.id)
            navigateBack()
        }

        const navigateBack = () => {
            router.push(RECEIPTS)
        }

        return {
            isEditMode,
            receipt,
            resourceOptions,
            unitOptions,
            addItem,
            removeItem,
            saveReceipt,
            removeReceipt,
            navigateBack
        }
    }
})
</script>