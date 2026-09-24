import { Activity } from "@/types";
import {
  ACTIVITIES,
  getAllActivities,
  getActivityBySlug,
  getActivitiesByAudience,
  getIslamicActivities,
  getArabicActivities,
  getActivitiesByCategory
} from "../activities";

export const ALL_ACTIVITIES_V2: Activity[] = ACTIVITIES;

export {
  ACTIVITIES,
  getAllActivities,
  getActivityBySlug,
  getActivitiesByAudience,
  getIslamicActivities,
  getArabicActivities,
  getActivitiesByCategory
};
