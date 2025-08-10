import { defineStore } from 'pinia'
import { Receipt, ReceptFilter } from '@/types/receipts'
import { RECEIPTS_URL, RECEIPT_UPDATE_URL, RECEIPT_REMOVE_URL, RECEIPT_FILTER_URL } from '../api'

export const useReceiptsStore = defineStore("receipts", {
  state: () => ({
    receipts: [] as Receipt[],
    isLoading: false,
    error: null as string | null
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
    async fetchFilteredReceipts(filter: ReceptFilter) {
      try {
        this.isLoading = true;
        this.error = null;

        const response = await fetch(RECEIPT_FILTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filter),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.receipts = await response.json();
        return this.receipts;
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Failed to fetch filtered receipts";
        console.error("Error fetching filtered receipts:", err);
        throw err;
      } finally {
        this.isLoading = false;
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

    async add(receipt: Receipt) {
      const response = await fetch(RECEIPTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receipt),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to add receipt");
      }

      return await response.json();
    },

    async update(updated: Receipt) {
      if (updated.id === "") {
        const { id, ...rest } = updated;
        updated = { id, ...rest };
      }

      const payload = {
        dto: {
          ...updated,
          receiptDate: new Date(updated.receiptDate).toISOString(),
          items: updated.items.map((item) => ({
            resourceId: item.resourceId,
            unitId: item.unitId,
            quantity: item.quantity,
          })),
        },
      };

      const response = await fetch(
        `${RECEIPT_UPDATE_URL}/${updated.id || ""}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to update receipt");
      }

      return await response.json();
    },
    async remove(id: string) {
      await fetch(`${RECEIPT_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});