import { defineStore } from 'pinia'
import { UNITS_ENDPOINT } from '../api'

export const useUnitsStore = defineStore('units', {
  state: () => ({
    units: [] as Array<{ id: number; name: string; isActive: boolean }>
  }),
  actions: {
    async fetchUnits() {
      try {
        const response = await fetch(UNITS_ENDPOINT)
        if (!response.ok) throw new Error('Failed to fetch units')
        const data = await response.json()
        this.units = data
      } catch (error) {
        console.error('Error loading units:', error)
      }
    },
    addUnit(unit: any) {
      this.units.push(unit)
    },
    archiveUnit(id: number) {
      const unit = this.units.find(u => u.id === id)
      if (unit) unit.isActive = false
    }
  }
})