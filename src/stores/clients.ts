import { defineStore } from "pinia";
import { Client } from "@/types/clients";
import {
  CLIENTS_URL,
  CLIENT_UPDATE_URL,
  CLIENT_REMOVE_URL,
  CLIENT_ARCHIVE_URL,
  CLIENT_UNARCHIVE_URL,
} from "../api";
import api from "@/api/index";

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [] as Array<Client>,
    loading: false,
  }),

  actions: {
    async fetchClients() {
      this.loading = true;
      try {
        const { data } = await api.get<Client[]>(CLIENTS_URL);
        this.clients = data;
      } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getById(id: string) {
      this.loading = true;
      try {
        const { data: client } = await api.get<Client>(`${CLIENTS_URL}/${id}`);

        if (client) {
          const index = this.clients.findIndex((c) => c.id === id);
          if (index !== -1) {
            this.clients[index] = client;
          } else {
            this.clients.push(client);
          }
        }

        return client;
      } catch (error) {
        console.error("Error fetching client:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async add(client: Omit<Client, "id">) {
      this.loading = true;
      try {
        const { data: newClient } = await api.post<Client>(CLIENTS_URL, client);

        if (newClient) {
          this.clients.push(newClient);
        }

        return newClient;
      } catch (error) {
        console.error("Error adding client:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async update(updated: Client) {
      this.loading = true;
      try {
        const { data: client } = await api.put<Client>(CLIENT_UPDATE_URL, updated);

        if (client) {
          const index = this.clients.findIndex((c) => c.id === client.id);
          if (index !== -1) {
            this.clients[index] = client;
          }
        }
        return client;
      } catch (error) {
        console.error("Error updating client:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async archive(id: string): Promise<void> {
      try {
        await api.patch(`${CLIENT_ARCHIVE_URL}/${id}`);
      } catch (error) {
        console.error("Archive failed:", error);
        throw error;
      }
    },

    async unarchive(id: string): Promise<void> {
      this.loading = true;
      try {
        await api.patch(`${CLIENT_UNARCHIVE_URL}/${id}`);

        const index = this.clients.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.clients[index].isActive = true;
        }
      } catch (error) {
        console.error("Unarchive failed:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async remove(id: string): Promise<void> {
      this.loading = true;
      try {
        await api.delete(`${CLIENT_REMOVE_URL}/${id}`);
        this.clients = this.clients.filter((c) => c.id !== id);
      } catch (error) {
        console.error("Remove failed:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
})