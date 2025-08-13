<template>
    <div class="shipment-form-view">
        <div class="page-header">
            <h1>{{ isEditMode ? 'Редактирование отгрузки' : 'Новая отгрузка' }}</h1>
            <div class="header-buttons">
                <Button v-if="!isEditMode" label="Добавить" icon="pi pi-save" @click="saveShipment(false)" />
                <Button v-if="!isEditMode" label="Добавить и подписать" icon="pi pi-save" severity="secondary" @click="saveShipment(true)" />
                <Button v-if="isEditMode && shipment.status === 'Signed'" label="Отозвать" icon="pi pi-undo" @click="withdrawShipment" />
                <Button v-if="isEditMode && shipment.status !== 'Signed'" label="Сохранить" icon="pi pi-save"
                    @click="saveShipment(false)" />
                <Button v-if="isEditMode && shipment.status !== 'Signed'" label="Сохранить и подписать"
                    icon="pi pi-save" severity="secondary" @click="saveShipment(true)" />
                <Button v-if="isEditMode && shipment.status !== 'Signed'" label="Удалить" severity="danger" icon="pi pi-trash"
                     @click="removeShipment" />
            </div>
        </div>

        <div class="form-section">
            <div class="form-row">
                <label class="form-label">Номер</label>
                <InputText id="number" v-model="shipment.shipmentNumber" />
            </div>

            <div class="form-row">
                <label class="form-label">Клиент</label>
                <Dropdown v-model="shipment.clientId" :options="clientOptions" optionLabel="name" optionValue="id"
                    placeholder="Выберите клиента" @change="updateClientName" />
            </div>

            <div class="form-row">
                <label class="form-label">Дата</label>
                <Calendar id="date" v-model="shipment.shipmentDate as Date" dateFormat="dd.mm.yy" showIcon />
            </div>
        </div>

        <div class="items-section" v-if="shipment.items.length > 0">
            <div class="section-header">
                <h3>Позиции</h3>
            </div>

            <DataTable :value="shipment.items" stripedRows>
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
                        <Dropdown v-model="shipment.items[index].resourceId" :options="resourceOptions"
                            optionLabel="name" optionValue="id" placeholder="Выберите ресурс"
                            @change="updateAvailableQuantity(index)" />
                    </template>
                </Column>
                <Column field="unit" header="Единица измерения">
                    <template #body="{ data, index }">
                        <Dropdown v-model="shipment.items[index].unitId" :options="unitOptions" optionLabel="name"
                            optionValue="id" placeholder="Выберите единицу" @change="updateAvailableQuantity(index)" />
                    </template>
                </Column>
                <Column field="quantity" header="Количество">
                    <template #body="{ data, index }">
                        <InputNumber v-model="shipment.items[index].quantity" mode="decimal" :min="0"
                            :max="getAvailableQuantity(index)" @update:modelValue="validateQuantity(index)" />
                    </template>
                </Column>
                <Column field="available" header="Доступно">
                    <template #body="{ data, index }">
                        {{ getAvailableQuantity(index) }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useShipmentsStore } from '@/stores/shipments'
import { useResourcesStore } from '@/stores/resources'
import { useUnitsStore } from '@/stores/units'
import { useClientsStore } from '@/stores/clients'
import { useBalancesStore } from '@/stores/balances'
import { Shipment, ShipmentItem, ShipmentItemRequest, ShipmentRequest } from '@/types/shipments'
import { BalanceByResourceAndUnit } from '@/types/balances'
import { Resource } from '@/types/resources'
import { Unit } from '@/types/units'
import { Client } from '@/types/clients'
import { SHIPMENTS } from '@/router/routes'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

export default defineComponent({
    name: 'ShipmentForm',
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
        const shipmentsStore = useShipmentsStore()
        const resourcesStore = useResourcesStore()
        const unitsStore = useUnitsStore()
        const clientsStore = useClientsStore()
        const balancesStore = useBalancesStore()

        const isEditMode = computed(() => props.id !== null)

        const shipment = ref<Shipment>({
            id: '',
            shipmentNumber: '',
            clientId: '',
            clientName: '',
            shipmentDate: new Date(),
            status: 'Draft',
            items: [] as ShipmentItem[]
        })

        const availableQuantities = ref<{ [key: string]: number }>({})

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

        const transformClient = (client: Client) => ({
            id: client.id,
            name: client.clientName,
            isActive: client.isActive
        })

        const resourceOptions = computed(() => {
            return resourcesStore.resources.map(transformResource)
        })

        const unitOptions = computed(() => {
            return unitsStore.units.map(transformUnit)
        })

        const clientOptions = computed(() => {
            return clientsStore.clients.map(transformClient)
        })

        onMounted(async () => {
            try {
                await Promise.all([
                    resourcesStore.fetchResources(),
                    unitsStore.fetchUnits(),
                    clientsStore.fetchClients()
                ])

                if (isEditMode.value) {
                    const existingShipment = await shipmentsStore.getById(props.id)
                    if (existingShipment) {
                        shipment.value = {
                            ...existingShipment,
                            shipmentDate: new Date(existingShipment.shipmentDate)
                        }

                        shipment.value.items.forEach((item, index) => {
                            updateAvailableQuantity(index)
                        })
                    }
                } else {
                    addItem()
                }
            } catch (error) {
                console.error('Error loading data:', error)
            }
        })

        const updateClientName = () => {
            const selectedClient = clientOptions.value.find(c => c.id === shipment.value.clientId)
            if (selectedClient) {
                shipment.value.clientName = selectedClient.name
            }
        }

        const updateAvailableQuantity = async (index: number) => {
            const item = shipment.value.items[index];

            if (item.resourceId) {
                const selectedResource = resourceOptions.value.find(r => r.id === item.resourceId);
                if (selectedResource) item.resourceName = selectedResource.name;
            }

            if (item.unitId) {
                const selectedUnit = unitOptions.value.find(u => u.id === item.unitId);
                if (selectedUnit) item.unitName = selectedUnit.name;
            }

            if (item.resourceId && item.unitId) {
                try {
                    const ids: BalanceByResourceAndUnit = {
                        resourceId: item.resourceId,
                        unitId: item.unitId
                    };
                    const available = await balancesStore.fetchBalanceByResourceAndUnit(ids);
                    availableQuantities.value[`${index}`] = available || 0;
                } catch (error) {
                    console.error('Error fetching available quantity:', error);
                    availableQuantities.value[`${index}`] = 0;
                }
            } else {
                availableQuantities.value[`${index}`] = 0;
            }
        }

        const getAvailableQuantity = (index: number) => {
            return availableQuantities.value[`${index}`] || 0
        }

        const validateQuantity = (index: number) => {
            const maxQuantity = getAvailableQuantity(index)
            if (shipment.value.items[index].quantity > maxQuantity) {
                shipment.value.items[index].quantity = maxQuantity
            }
        }

        const addItem = () => {
            shipment.value.items.push({
                id: '',
                shipmentId: '',
                resourceId: '',
                resourceName: '',
                unitId: '',
                unitName: '',
                quantity: 0
            } as ShipmentItem)
        }

        const removeItem = (index: number) => {
            shipment.value.items.splice(index, 1)
            delete availableQuantities.value[`${index}`]
        }

        const saveShipment = async (sign: boolean) => {
            try {
                const payload: ShipmentRequest = {
                    shipmentNumber: shipment.value.shipmentNumber,
                    shipmentDate: shipment.value.shipmentDate instanceof Date
                        ? shipment.value.shipmentDate.toISOString()
                        : shipment.value.shipmentDate,
                    clientId: shipment.value.clientId,
                    clientName: shipment.value.clientName,
                    status: sign ? 'Signed' : 'Draft',
                    items: shipment.value.items
                        .map(item => ({
                            resourceId: item.resourceId,
                            resourceName: item.resourceName,
                            unitId: item.unitId,
                            unitName: item.unitName,
                            quantity: item.quantity
                        } as ShipmentItemRequest)) as ShipmentItem[]
                };

                if (isEditMode.value) {

                    const payload: Shipment = {
                        id: shipment.value.id,
                        shipmentNumber: shipment.value.shipmentNumber,
                        shipmentDate: shipment.value.shipmentDate instanceof Date
                            ? shipment.value.shipmentDate.toISOString()
                            : shipment.value.shipmentDate,
                        clientId: shipment.value.clientId,
                        clientName: shipment.value.clientName,
                        status: sign ? 'Signed' : 'Draft',
                        items: shipment.value.items
                            .map(item => ({
                                id: item.id,
                                shipmentId: shipment.value.id,
                                resourceId: item.resourceId,
                                resourceName: item.resourceName,
                                unitId: item.unitId,
                                unitName: item.unitName,
                                quantity: item.quantity
                            } as ShipmentItem)) as ShipmentItem[]
                    };

                    await shipmentsStore.update({
                        id: shipment.value.id,
                        ...payload
                    });
                } else {
                    await shipmentsStore.add(payload);
                }

                navigateBack();
            } catch (error) {
                console.error('Error saving shipment:', error);
            }
        }

        const withdrawShipment = async () => {
            try {
                const payload: Shipment = {
                    ...shipment.value,
                    status: 'Draft'
                };
                await shipmentsStore.update(payload);
                navigateBack()
            } catch (error) {
                console.error('Error withdrawing shipment:', error);
            }
        }

        const removeShipment = async () => {
            await shipmentsStore.remove(props.id)
            navigateBack()
        }

        const navigateBack = () => {
            router.push(SHIPMENTS)
        }

        return {
            isEditMode,
            shipment,
            resourceOptions,
            unitOptions,
            clientOptions,
            addItem,
            removeItem,
            saveShipment,
            withdrawShipment,
            removeShipment,
            updateClientName,
            updateAvailableQuantity,
            getAvailableQuantity,
            validateQuantity
        }
    }
})
</script>