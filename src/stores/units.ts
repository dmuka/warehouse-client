import { defineStore } from 'pinia'
import { UNITS_URL, UNIT_UPDATE_URL, UNIT_REMOVE_URL, UNIT_ARCHIVE_URL, UNIT_UNARCHIVE_URL } from '../api'

export const useUnitsStore = defineStore("units", {
  state: () => ({
    units: [] as Array<{ id: number; name: string; isActive: boolean }>,
  }),
  actions: {
    async fetchUnits() {
      try {
        const response = await fetch(UNITS_URL);
        if (!response.ok) throw new Error("Failed to fetch units");
        const data = await response.json();
        this.units = data;
      } catch (error) {
        console.error("Error loading units:", error);
      }
    },
    async getById(id: string) {
      try {
        const response = await fetch(`${UNITS_URL}/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to fetch unit: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        const index = this.units.findIndex((u) => u.id === Number(id));
        if (index !== -1) {
          this.units[index] = data;
        } else {
          this.units.push(data);
        }

        return data;
      } catch (error) {
        console.error(`Error loading unit with ID ${id}:`, error);
        throw error;
      }
    },
    async add(unit: any) {
      await fetch(`${UNITS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unit),
      });
    },
    async update(updated: any) {
      await fetch(`${UNIT_UPDATE_URL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    },
    async archive(id: string) {
      await fetch(`${UNIT_ARCHIVE_URL}/${id}`, {
        method: "PATCH",
      });
      const index = this.units.findIndex((u) => u.id === Number(id));
      if (index !== -1) {
        this.units[index].isActive = false;
      }
    },
    async unarchive(id: string) {
      await fetch(`${UNIT_UNARCHIVE_URL}/${id}`, {
        method: "PATCH",
      });
      const index = this.units.findIndex((u) => u.id === Number(id));
      if (index !== -1) {
        this.units[index].isActive = true;
      }
    },
    async remove(id: string) {
      await fetch(`${UNIT_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});