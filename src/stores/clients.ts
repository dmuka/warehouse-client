import { defineStore } from 'pinia'
import { CLIENTS_ENDPOINT } from '../api'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [] as Array<{ id: number; name: string; address: string; isActive: boolean }>
  }),
  actions: {
    async fetchClients() {
      try {
        const response = await fetch(CLIENTS_ENDPOINT)
        if (!response.ok) throw new Error('Failed to fetch clients')
        const data = await response.json()
        this.clients = data
      } catch (error) {
        console.error('Error loading clients:', error)
      }
    },
    addUnit(client: any) {
      this.clients.push(client)
    },
    archiveUnit(id: number) {
      const client = this.clients.find(c => c.id === id)
      if (client) client.isActive = false
    }
  }
})