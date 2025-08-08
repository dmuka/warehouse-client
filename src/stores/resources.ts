import { defineStore } from 'pinia'
import { RESOURCES_URL, RESOURCE_UPDATE_URL, RESOURCE_REMOVE_URL, RESOURCE_ARCHIVE_URL, RESOURCE_UNARCHIVE_URL } from '../api'

export const useResourcesStore = defineStore("resources", {
  state: () => ({
    resources: [] as Array<{ id: string; name: string; isActive: boolean }>,
  }),
  actions: {
    async fetchResources() {
      try {
        const response = await fetch(RESOURCES_URL);
        if (!response.ok) throw new Error("Failed to fetch resources");
        const data = await response.json();
        this.resources = data;
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    },
    async getById(id: string) {
      try {
        const response = await fetch(`${RESOURCES_URL}/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to fetch resource: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        const index = this.resources.findIndex((r) => r.id === Number(id));
        if (index !== -1) {
          this.resources[index] = data;
        } else {
          this.resources.push(data);
        }

        return data;
      } catch (error) {
        console.error(`Error loading resource with ID ${id}:`, error);
        throw error;
      }
    },
    async add(resource: any) {
      await fetch(`${RESOURCES_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resource),
      });
    },
    async update(updated: any) {
      await fetch(`${RESOURCE_UPDATE_URL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    },
    async archive(id: string) {
      await fetch(`${RESOURCE_ARCHIVE_URL}/${id}`, {
        method: "PATCH",
      });
      const index = this.resources.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.resources[index].isActive = false;
      }
    },
    async unarchive(id: string) {
      await fetch(`${RESOURCE_UNARCHIVE_URL}/${id}`, {
        method: "PATCH",
      });
      const index = this.resources.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.resources[index].isActive = true;
      }
    },
    async remove(id: string) {
      await fetch(`${RESOURCE_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});