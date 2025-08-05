import { defineStore } from 'pinia'
import { SHIPMENTS_ENDPOINT } from '../api'

export interface ShipmentItem {
  receiptId: { value: string }
  resourceId: { value: string }
  unitId: { value: string }
  quantity: number
}

export interface Shipment {
  id: { value: string }
  number: string
  date: string
  items: ShipmentItem[]
}

export const useShipmentsStore = defineStore('shipments', {
  state: () => ({
    shipments: [] as Shipment[]
  }),
  actions: {
    async fetchShipments() {
      try {
        const response = await fetch(SHIPMENTS_ENDPOINT)
        if (!response.ok) throw new Error('Failed to fetch shipments')
        const data = await response.json()
        this.shipments = data
      } catch (error) {
        console.error('Error loading shipments:', error)
      }
    }
  }
})