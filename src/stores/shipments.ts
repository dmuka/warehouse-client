import { defineStore } from 'pinia'
import { SHIPMENTS_URL, SHIPMENT_UPDATE_URL, SHIPMENT_REMOVE_URL } from '../api'

export interface ShipmentItem {
  shipmentId: string
  clientId: string
  status: string
  resourceId: string
  unitId: string
  quantity: number
}

export interface Shipment {
  id: string
  number: string
  date: string
  items: ShipmentItem[]
}

export const useShipmentsStore = defineStore("shipments", {
  state: () => ({
    shipments: [] as Shipment[],
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
    async add(shipment: any) {
      await fetch(`${SHIPMENTS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipment),
      });
    },
    async update(updated: any) {
      await fetch(`${SHIPMENT_UPDATE_URL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    },
    async remove(id: string) {
      await fetch(`${SHIPMENT_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});