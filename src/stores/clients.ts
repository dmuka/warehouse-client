import { defineStore } from 'pinia'
import { Client } from '@/types/clients'
import { CLIENTS_URL, CLIENT_UPDATE_URL, CLIENT_REMOVE_URL, CLIENT_ARCHIVE_URL, CLIENT_UNARCHIVE_URL } from '../api'

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [] as Array<Client>,
  }),
  actions: {
    async fetchClients() {
      try {
        const response = await fetch(CLIENTS_URL);
        if (!response.ok) throw new Error("Failed to fetch clients");
        const data = await response.json();
        this.clients = data;
      } catch (error) {
        console.error("Error loading clients:", error);
      }
    },
    async getById(id: string) {
      try {
        const response = await fetch(`${CLIENTS_URL}/${id}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message ||
              `Failed to fetch client: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        const index = this.clients.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.clients[index] = data;
        } else {
          this.clients.push(data);
        }

        return data;
      } catch (error) {
        console.error(`Error loading client with ID ${id}:`, error);
        throw error;
      }
    },
    async add(client: Client) {
      await fetch(`${CLIENTS_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
    },
    async update(updated: Client) {
      await fetch(`${CLIENT_UPDATE_URL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    },
    async archive(id: string) {
      await fetch(`${CLIENT_ARCHIVE_URL}/${id}`, {
        method: "PATCH",
      });
      const index = this.clients.findIndex((r) => r.id === id);
      if (index !== -1) {
        this.clients[index].isActive = false;
      }
    },
    async unarchive(id: string) {
      await fetch(`${CLIENT_UNARCHIVE_URL}/${id}`, {
        method: "PATCH",
      });
      const index = this.clients.findIndex((u) => u.id === id);
      if (index !== -1) {
        this.clients[index].isActive = true;
      }
    },
    async remove(id: string) {
      await fetch(`${CLIENT_REMOVE_URL}/${id}`, {
        method: "DELETE",
      });
    },
  },
});