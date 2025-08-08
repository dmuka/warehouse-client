import { defineStore } from 'pinia'
import { Receipt } from '@/types/receipts'
import { RECEIPTS_URL, RECEIPT_UPDATE_URL, RECEIPT_REMOVE_URL } from '../api'

export const useReceiptsStore = defineStore("receipts", {
  state: () => ({
    receipts: [] as Receipt[],
  }),
  actions: {
    async fetchReceipts() {
      try {
        const response = await fetch(RECEIPTS_URL);
        if (!response.ok) throw new Error("Failed to fetch receipts");
        const data = await response.json();
        this.receipts = data;
      } catch (error) {
        console.error("Error loading receipts:", error);
      }
    },
    async getById(id: string) {
      try {
        const response = await fetch(`${RECEIPTS_URL}/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to fetch receipt: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        const index = this.receipts.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.receipts[index] = data;
        } else {
          this.receipts.push(data);
        }

        return data;
      } catch (error) {
        console.error(`Error loading receipt with ID ${id}:`, error);
        throw error;
      }
    },
    async add(receipt: any) {
      await fetch(`${RECEIPTS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receipt),
      });
    },
    async update(updated: any) {
      await fetch(`${RECEIPT_UPDATE_URL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    },
    async remove(id: string) {
      await fetch(`${RECEIPT_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});