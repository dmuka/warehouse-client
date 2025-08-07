import { defineStore } from 'pinia'
import { BALANCES_URL, BALANCE_UPDATE_URL, BALANCE_FILTER_URL } from '../api'

interface Balance {
  id: string
  resourceName: string
  unitName: string
  quantity: number
}

interface BalanceFilter {
  resourceNames?: string[]
  unitNames?: string[]
}

export const useBalancesStore = defineStore('balances', {
  state: () => ({
    balances: [] as Balance[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getBalanceById: (state) => (id: string) => {
      return state.balances.find(balance => balance.id === id)
    }
  },

  actions: {
    async fetchAllBalances() {
      try {
        this.isLoading = true
        this.error = null
        const response = await fetch(BALANCES_URL)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        this.balances = await response.json()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch balances'
        console.error('Error fetching balances:', err)
      } finally {
        this.isLoading = false
      }
    },

    async fetchFilteredBalances(filter: BalanceFilter) {
      try {
        this.isLoading = true
        this.error = null

        const response = await fetch(BALANCE_FILTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(filter)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        this.balances = await response.json()
        return this.balances
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch filtered balances'
        console.error('Error fetching filtered balances:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateBalance(balance: Balance) {
      try {
        this.isLoading = true
        this.error = null

        const response = await fetch(BALANCE_UPDATE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(balance)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const updatedBalance = await response.json()

        const index = this.balances.findIndex(b => b.id === updatedBalance.id)
        if (index !== -1) {
          this.balances[index] = updatedBalance
        } else {
          this.balances.push(updatedBalance)
        }

        return updatedBalance
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to update balance'
        console.error('Error updating balance:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})