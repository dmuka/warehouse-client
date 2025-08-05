import { defineStore } from 'pinia'
import { RESOURCES_ENDPOINT } from '../api'

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    resources: [] as Array<{ id: number; name: string; isActive: boolean }>
  }),
  actions: {
    async fetchResources() {
      try {
        const response = await fetch(RESOURCES_ENDPOINT)
        if (!response.ok) throw new Error('Failed to fetch resources')
        const data = await response.json()
        this.resources = data
      } catch (error) {
        console.error('Error loading resources:', error)
      }
    },
    addResource(resource: any) {
      this.resources.push(resource)
    },
    archiveResource(id: number) {
      const resource = this.resources.find(r => r.id === id)
      if (resource) resource.isActive = false
    }
  }
})