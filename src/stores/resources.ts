import { defineStore } from 'pinia'
import { RESOURCES_ENDPOINT, RESOURCE_UPDATE_ENDPOINT } from '../api'

export const useResourcesStore = defineStore("resources", {
  state: () => ({
    resources: [] as Array<{ id: number; name: string; isActive: boolean }>,
  }),
  actions: {
    async fetchResources() {
      try {
        const response = await fetch(RESOURCES_ENDPOINT);
        if (!response.ok) throw new Error("Failed to fetch resources");
        const data = await response.json();
        this.resources = data;
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    },
    async getResourceById(id: string) {
      try {
        const response = await fetch(`${RESOURCES_ENDPOINT}/${id}`);

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
    async addResource(resource: any) {
      await fetch(`${RESOURCES_ENDPOINT}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(resource)
       })
    },
    async updateResource(updated: any) {
      await fetch(`${RESOURCE_UPDATE_ENDPOINT}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updated)
       })
    },
    archiveResource(id: number) {
      const resource = this.resources.find((r) => r.id === id);
      if (resource) resource.isActive = false;
    }
  },
});