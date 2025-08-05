import { defineStore } from 'pinia'
import { BALANCES_ENDPOINT } from '../api'

export const useBalancesStore = defineStore('balances', {
  state: () => ({
    balances: [] as Array<{ id: number; resourceName: string; unitName: string; quantity: number }>
  }),
  actions: {
    async fetchBalances() {
      try {
        const response = await fetch(BALANCES_ENDPOINT)
        if (!response.ok) throw new Error('Failed to fetch balances')
        const data = await response.json()
        this.balances = data
      } catch (error) {
        console.error('Error loading balances:', error)
      }
    }
  }
})