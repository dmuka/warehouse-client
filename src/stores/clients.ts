import { defineStore } from "pinia";
import { Client } from "@/types/clients";
import {
  CLIENTS_URL,
  CLIENT_UPDATE_URL,
  CLIENT_REMOVE_URL,
  CLIENT_ARCHIVE_URL,
  CLIENT_UNARCHIVE_URL,
} from "../api";
import { apiFetch } from "@/services/api-client";

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [] as Array<Client>,
    loading: false,
  }),

  actions: {
    async fetchClients() {
      this.loading = true;
      try {
        const data = await apiFetch<Client[]>(CLIENTS_URL, {
          showToast: true,
        });

        if (data) this.clients = data;
      } finally {
        this.loading = false;
      }
    },

    async getById(id: string) {
      this.loading = true;
      try {
        const client = await apiFetch<Client>(`${CLIENTS_URL}/${id}`, {
          showToast: true,
        });

        if (client) {
          const index = this.clients.findIndex((c) => c.id === id);

          if (index !== -1) {
            this.clients[index] = client;
          } else {
            this.clients.push(client);
          }
        }

        return client;
      } finally {
        this.loading = false;
      }
    },

    async add(client: Omit<Client, "id">) {
      this.loading = true;
      try {
        const newClient = await apiFetch<Client>(CLIENTS_URL, {
          method: "POST",
          body: JSON.stringify(client),
          showToast: true,
        });

        if (newClient) this.clients.push(newClient);

        return newClient;
      } finally {
        this.loading = false;
      }
    },

    async update(updated: Client) {
      this.loading = true;
      try {
        const client = await apiFetch<Client>(CLIENT_UPDATE_URL, {
          method: "PUT",
          body: JSON.stringify(updated),
          showToast: true,
        });

        if (client) {
          const index = this.clients.findIndex((c) => c.id === client.id);
          if (index !== -1) {
            this.clients[index] = client;
          }
        }
        return client;
      } finally {
        this.loading = false;
      }
    },

    async archive(id: string): Promise<void> {
      try {
        await apiFetch(`${CLIENT_ARCHIVE_URL}/${id}`, {
          method: "PATCH",
          allowEmptyResponse: true,
          showToast: true,
        });

      } catch (error) {
        console.error("Archive failed:", error)
        throw error
      }
    },

    async unarchive(id: string): Promise<void> {
      this.loading = true;
      try {
        await apiFetch<void>(`${CLIENT_UNARCHIVE_URL}/${id}`, {
          method: "PATCH",
          showToast: true,
          allowEmptyResponse: true,
        });

        const index = this.clients.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.clients[index].isActive = true;
        }
      } finally {
        this.loading = false;
      }
    },

    async remove(id: string): Promise<void> {
      this.loading = true;
      try {
        await apiFetch<void>(`${CLIENT_REMOVE_URL}/${id}`, {
          method: "DELETE",
          showToast: true,
          allowEmptyResponse: true,
        });

        this.clients = this.clients.filter((c) => c.id !== id);
      } finally {
        this.loading = false;
      }
    },
  },
})