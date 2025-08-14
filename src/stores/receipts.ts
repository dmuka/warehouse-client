import { defineStore } from 'pinia'
import { Receipt, ReceiptFilter } from '@/types/receipts'
import { RECEIPTS_URL, RECEIPT_UPDATE_URL, RECEIPT_REMOVE_URL, RECEIPT_FILTER_URL } from '../api'
import api from '@/api/index'

export const useReceiptsStore = defineStore("receipts", {
  state: () => ({
    receipts: <Receipt[]>[],
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchReceipts() {
      try {
        const response = await api.get(RECEIPTS_URL)

        this.receipts = response.data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch receipts'
        console.error("Error loading receipts:", error)
        throw error
      }
    },
    async fetchFilteredReceipts(filter: ReceiptFilter) {
      try {
        this.isLoading = true
        this.error = null

        const response = await api.post<Receipt[]>(RECEIPT_FILTER_URL, filter)

        this.receipts = response.data

        return this.receipts
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch filtered receipts'
        console.error("Error fetching filtered receipts:", err)
        throw err
      } finally {
        this.isLoading = false
      }
    },
    async getById(id: string) {
      try {
        const response = await api.get<Receipt>(`${RECEIPTS_URL}/${id}`)

        const index = this.receipts.findIndex(r => r.id === id)
        if (index !== -1) {
          this.receipts[index] = response.data
        } else {
          this.receipts.push(response.data)
        }

        return response.data
      } catch (error) {
        console.error(`Error loading receipt with ID ${id}:`, error)
        throw error
      }
    },

    async add(receipt: Receipt) {
      try {
        const response = await api.post<Receipt>(RECEIPTS_URL, receipt)

        return response.data
      } catch (error) {
        console.error("Error adding receipt:", error)
        throw error
      }
    },

    async update(updated: Receipt) {
      try {
        const payload = {
          ...updated,
          receiptDate: new Date(updated.receiptDate).toISOString(),
          items: updated.items.map(item => ({
            resourceId: item.resourceId,
            resourceName: item.resourceName,
            unitId: item.unitId,
            unitName: item.unitName,
            quantity: item.quantity,
          }))
        }

        const response = await api.put<Receipt>(RECEIPT_UPDATE_URL, payload)
        return response.data
      } catch (error) {
        console.error("Error updating receipt:", error)
        throw error
      }
    },
    async remove(id: string) {
      try {
        await api.delete(`${RECEIPT_REMOVE_URL}/${id}`)
      } catch (error) {
        console.error("Error removing receipt:", error)
        throw error
      }
    },
  },
});