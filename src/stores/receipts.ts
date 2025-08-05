import { defineStore } from 'pinia'
import { RECEIPTS_ENDPOINT } from '../api'

export interface ReceiptItem {
  receiptId: { value: string }
  resourceId: { value: string }
  unitId: { value: string }
  quantity: number
}

export interface Receipt {
  id: { value: string }
  number: string
  date: string
  items: ReceiptItem[]
}

export const useReceiptsStore = defineStore('receipts', {
  state: () => ({
    receipts: [] as Receipt[]
  }),
  actions: {
    async fetchReceipts() {
      try {
        const response = await fetch(RECEIPTS_ENDPOINT)
        if (!response.ok) throw new Error('Failed to fetch receipts')
        const data = await response.json()
        this.receipts = data
      } catch (error) {
        console.error('Error loading receipts:', error)
      }
    }
  }
})