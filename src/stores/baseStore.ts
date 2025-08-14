// stores/baseStore.ts
import { defineStore } from 'pinia'
import axios, { type AxiosError } from 'axios'
import api from '@/api/index'
import { ref, type Ref } from 'vue'

interface StoreError {
  message: string
  code?: string
  status?: number
}

interface BaseStoreEndpoints {
  getAll: string
  getById: string
  create: string
  update: string
  delete: string
  archive?: string
  unarchive?: string
}

export function createBaseStore<T extends { id: string }, CreateT = Omit<T, 'id'>>(
  entityName: string,
  endpoints: BaseStoreEndpoints
) {
  return defineStore(entityName, {
    state: () => ({
      items: ref<T[]>([]) as Ref<T[]>,
      isLoading: false,
      error: null as StoreError | null,
    }),

    getters: {
      getItemById: (state) => (id: string) => state.items.find(item => item.id === id),
      activeItems: (state) => state.items.filter(item => (item as any).isActive !== false),
    },

    actions: {
      _handleError(error: unknown): StoreError {
        if (axios.isAxiosError(error)) {
          return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            code: error.code,
          };
        }
        if (error instanceof Error) {
          return { message: error.message };
        }
        return { message: 'An unknown error occurred' };
      },

      async fetchAll() {
        try {
          this.isLoading = true;
          this.error = null;
          const { data } = await api.get<T[]>(endpoints.getAll);
          this.items = data;
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error loading ${entityName}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },

      async getById(id: string) {
        try {
          this.isLoading = true;
          this.error = null;
          const { data } = await api.get<T>(`${endpoints.getById}/${id}`);

          const index = this.items.findIndex(item => item.id === id);
          if (index !== -1) {
            this.items[index] = data;
          } else {
            this.items.push(data);
          }

          return data;
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error loading ${entityName} with ID ${id}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },

      async create(item: CreateT) {
        try {
          this.isLoading = true;
          this.error = null;
          const { data } = await api.post<T>(endpoints.create, item);
          this.items.push(data);
          return data;
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error creating ${entityName}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },

      async update(updatedItem: T) {
        try {
          this.isLoading = true;
          this.error = null;
          const { data } = await api.put<T>(endpoints.update, updatedItem);

          const index = this.items.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            this.items[index] = data;
          }

          return data;
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error updating ${entityName}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },

      async delete(id: string) {
        try {
          this.isLoading = true;
          this.error = null;
          await api.delete(`${endpoints.delete}/${id}`);
          this.items = this.items.filter(item => item.id !== id);
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error deleting ${entityName}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },

      async archive(id: string) {
        if (!endpoints.archive) {
          throw new Error('Archive endpoint not defined');
        }

        try {
          this.isLoading = true;
          this.error = null;
          await api.patch(`${endpoints.archive}/${id}`);

          const index = this.items.findIndex(item => item.id === id);
          if (index !== -1) {
            (this.items[index] as any).isActive = false;
          }
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error archiving ${entityName}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },

      async unarchive(id: string) {
        if (!endpoints.unarchive) {
          throw new Error('Unarchive endpoint not defined');
        }

        try {
          this.isLoading = true;
          this.error = null;
          await api.patch(`${endpoints.unarchive}/${id}`);

          const index = this.items.findIndex(item => item.id === id);
          if (index !== -1) {
            (this.items[index] as any).isActive = true;
          }
        } catch (error) {
          this.error = this._handleError(error);
          console.error(`Error unarchiving ${entityName}:`, error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      },
    },
  });
}