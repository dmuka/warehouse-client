import { createBaseStore } from '@/stores/baseStore';
import { Resource } from "@/types/resources";
import {
  RESOURCES_URL,
  RESOURCE_UPDATE_URL,
  RESOURCE_REMOVE_URL,
  RESOURCE_ARCHIVE_URL,
  RESOURCE_UNARCHIVE_URL,
} from "../api";

export const useResourcesStore = createBaseStore<Resource>("resources", {
  getAll: RESOURCES_URL,
  getById: RESOURCES_URL,
  create: RESOURCES_URL,
  update: RESOURCE_UPDATE_URL,
  delete: RESOURCE_REMOVE_URL,
  archive: RESOURCE_ARCHIVE_URL,
  unarchive: RESOURCE_UNARCHIVE_URL
  })