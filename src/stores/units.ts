import { createBaseStore } from '@/stores/baseStore';
import { Unit } from "@/types/units";
import {
  UNITS_URL,
  UNIT_UPDATE_URL,
  UNIT_REMOVE_URL,
  UNIT_ARCHIVE_URL,
  UNIT_UNARCHIVE_URL,
} from "../api";

export const useUnitsStore = createBaseStore<Unit>("units", {
  getAll: UNITS_URL,
  getById: UNITS_URL,
  create: UNITS_URL,
  update: UNIT_UPDATE_URL,
  delete: UNIT_REMOVE_URL,
  archive: UNIT_ARCHIVE_URL,
  unarchive: UNIT_UNARCHIVE_URL
  })