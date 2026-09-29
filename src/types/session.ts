import { Activity, AudienceType, EnergyLevel, GoalType } from "./index";

export type SessionRhythmStage =
  | "ICEBREAKER"
  | "ENERGY"
  | "TEAMWORK"
  | "LEARNING"
  | "DISCUSSION"
  | "VALUES"
  | "REFLECTION"
  | "CLOSING";

export interface SessionStage {
  id: string;
  order: number;
  stageType: SessionRhythmStage;
  titleAr: string;
  subtitleAr?: string;
  timeRange: string; // e.g. "00:00–05:00"
  durationMinutes: number; // e.g. 5
  activity: Activity;
  facilitatorTipAr: string;
  nowInstructionAr: string; // "NOW" facilitation step
  nextInstructionAr: string; // "NEXT" facilitation step
  closingPromptAr?: string;
  isCompressed?: boolean;
  originalDurationMinutes?: number;
}

export interface SparkSession {
  id: string;
  titleAr: string;
  descriptionAr?: string;
  audience: AudienceType;
  participantCount: number;
  totalDuration: number; // in minutes (e.g. 30)
  goal: GoalType | string;
  energy: EnergyLevel;
  requiresPhone: boolean;
  requiresScreen: boolean;
  stages: SessionStage[];
  templateId?: string;
  isTemplate?: boolean;
  createdAt: number;
  facilitatorNotes?: string;
  currentStageIndex?: number;
}

export type ParticipationLevel = "low" | "medium" | "high";

export interface SessionPulseEntry {
  timestamp: number;
  level: EnergyLevel;
  stageIndex: number;
  stageTitleAr: string;
}

export interface SessionReport {
  id: string;
  sessionId: string;
  sessionTitleAr: string;
  createdAt: number;
  plannedDurationMinutes: number;
  actualDurationMinutes: number;
  participantCount: number;
  completedStagesCount: number;
  totalStagesCount: number;
  completionRatePercent: number;
  participationSignal: ParticipationLevel;
  mostEngagingActivityTitleAr: string;
  pulseHistory: SessionPulseEntry[];
  facilitatorNotes?: string;
  completedActivities: {
    titleAr: string;
    stageType: SessionRhythmStage;
    durationMinutes: number;
  }[];
}

export type DiscussionLevel = "light" | "medium" | "deep";

export interface DiscussionEngineItem {
  id: string;
  level: DiscussionLevel;
  category: "team" | "values" | "work" | "reflection" | "youth" | "general";
  titleAr: string;
  questionAr: string;
  followUpPromptAr: string; // "ناقشوا..."
  conclusionPromptAr: string; // "اختموا بـ..."
}

export interface RescueIntervention {
  id: string;
  titleAr: string;
  taglineAr: string;
  reasonAr: string;
  durationMinutes: number;
  activity: Activity;
  facilitatorTipAr: string;
}

// Future Organization & Monetization Architecture interfaces
export type SubscriptionTier = "FREE" | "PRO" | "ORGANIZATION";

export interface OrganizationWorkspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  brandColor?: string;
  tier: SubscriptionTier;
  facilitatorIds: string[];
  privateActivityIds: string[];
  savedTemplateIds: string[];
  createdAt: number;
}
