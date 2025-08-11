import { defineStore } from 'pinia'
import { Shipment, ShipmentFilter } from '@/types/shipments'
import { SHIPMENTS_URL, SHIPMENT_UPDATE_URL, SHIPMENT_REMOVE_URL, SHIPMENT_FILTER_URL } from '../api'

export const useShipmentsStore = defineStore("shipments", {
  state: () => ({
    shipments: [] as Shipment[],
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchShipments() {
      try {
        const response = await fetch(SHIPMENTS_URL);
        if (!response.ok) throw new Error("Failed to fetch shipments");
        const data = await response.json();
        this.shipments = data;
      } catch (error) {
        console.error("Error loading shipments:", error);
      }
    },
    async fetchFilteredShipments(filter: ShipmentFilter) {
      try {
        this.isLoading = true;
        this.error = null;

        const response = await fetch(SHIPMENT_FILTER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filter),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.shipments = await response.json();
        return this.shipments;
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Failed to fetch filtered shipments";
        console.error("Error fetching filtered shipments:", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async getById(id: string) {
      try {
        const response = await fetch(`${SHIPMENTS_URL}/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to fetch shipment: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        const index = this.shipments.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.shipments[index] = data;
        } else {
          this.shipments.push(data);
        }

        return data;
      } catch (error) {
        console.error(`Error loading shipment with ID ${id}:`, error);
        throw error;
      }
    },

    async add(shipment: Shipment) {
      const response = await fetch(SHIPMENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipment),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to add shipment");
      }

      return await response.json();
    },

    async update(updated: Shipment) {
      if (updated.id === "") {
        const { id, ...rest } = updated;
        updated = { id, ...rest };
      }

      const payload = {
        dto: {
          ...updated,
          shipmentDate: new Date(updated.shipmentDate).toISOString(),
          items: updated.items.map((item) => ({
            resourceId: item.resourceId,
            unitId: item.unitId,
            quantity: item.quantity,
          })),
        },
      };

      const response = await fetch(
        `${SHIPMENT_UPDATE_URL}/${updated.id || ""}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.title || "Failed to update shipment");
      }

      return await response.json();
    },
    async remove(id: string) {
      await fetch(`${SHIPMENT_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});