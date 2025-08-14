import { defineStore } from 'pinia'
import { BALANCES_URL, BALANCE_UPDATE_URL, BALANCE_FILTER_URL, BALANCE_AVAILABLE_URL } from '../api'
import { Balance, BalanceByResourceAndUnit, BalanceFilter } from '@/types/balances'
import api from '@/api/index'

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

        this.balances = await api.get(BALANCES_URL)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch balances'
        console.error('Error fetching balances:', err)
      } finally {
        this.isLoading = false
      }
    },

    async fetchBalanceByResourceAndUnit(ids: BalanceByResourceAndUnit) {
      try {
        this.isLoading = true
        this.error = null

        const balance = await api.post<BalanceByResourceAndUnit, number>(BALANCE_AVAILABLE_URL, ids)

        return balance
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch balance by names'
        console.error('Error fetching balance by names:', err)
      } finally {
        this.isLoading = false
      }
    },

    async fetchFilteredBalances(filter: BalanceFilter) {
      try {
        this.isLoading = true
        this.error = null
        this.balances = await api.post(BALANCE_FILTER_URL, filter)

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
        const updatedBalance = await api.put<Balance, Balance>(BALANCE_UPDATE_URL, balance)

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