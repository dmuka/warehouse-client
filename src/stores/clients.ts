import { createBaseStore } from '@/stores/baseStore';
import { Client } from "@/types/clients";
import {
  CLIENTS_URL,
  CLIENT_UPDATE_URL,
  CLIENT_REMOVE_URL,
  CLIENT_ARCHIVE_URL,
  CLIENT_UNARCHIVE_URL,
} from "../api";

export const useClientsStore = createBaseStore<Client>("clients", {
  getAll: CLIENTS_URL,
  getById: CLIENTS_URL,
  create: CLIENTS_URL,
  update: CLIENT_UPDATE_URL,
  delete: CLIENT_REMOVE_URL,
  archive: CLIENT_ARCHIVE_URL,
  unarchive: CLIENT_UNARCHIVE_URL
  })