export type ActivityCategory =
  | "ICEBREAKER"
  | "QUIZ"
  | "SOCIAL"
  | "TEAM"
  | "ENERGY"
  | "CREATIVE"
  | "MEMORY"
  | "DISCUSSION"
  | "MOVEMENT"
  | "GUESSING"
  | "KIDS"
  | "ISLAMIC"
  | "ARABIC"
  | "GENERAL_KNOWLEDGE"
  | "VALUES"
  | "TRIVIA"
  | "REFLECTION";

export type ActivityType =
  | "QUICK_QUIZ"
  | "THIS_OR_THAT"
  | "WOULD_YOU_RATHER"
  | "TWO_TRUTHS_AND_A_LIE"
  | "WORD_CLOUD"
  | "RAPID_FIRE"
  | "GUESS_IT"
  | "MEMORY_CHALLENGE"
  | "EMOJI_CHALLENGE"
  | "RANK_IT"
  | "TEAM_CHALLENGE"
  | "SIXTY_SEC_CHALLENGE"
  | "CHARADES"
  | "FIND_SOMEONE_WHO"
  | "DISCUSSION_STARTER"
  | "KIDS_MOVEMENT"
  | "RANDOM_SPARK";

export type AudienceType = "adults" | "kids" | "teens" | "mixed";
export type KidsAgeGroup = "4-6" | "7-9" | "10-12" | "all";
export type EnergyLevel = "calm" | "medium" | "high";
export type GoalType =
  | "icebreaker"
  | "laughter"
  | "competition"
  | "cooperation"
  | "silence_breaker"
  | "energizer"
  | "discussion"
  | "creativity"
  | "faith"
  | "learning";

export interface ActivityRound {
  id: string;
  roundNumber: number;
  promptAr: string;
  promptEn?: string;
  subtitleAr?: string;
  optionsAr?: string[];
  optionsEn?: string[];
  correctAnswer?: string | number; // index or value
  timeLimit?: number; // seconds
  media?: {
    type: "emoji" | "image" | "sound" | "icon";
    content: string; // emoji character, svg, image url
  };
  statements?: { textAr: string; isLie: boolean }[];
  memoryItems?: string[];
  secretWordAr?: string;
  hintsAr?: string[];
  actionPromptAr?: string; // for physical movement or non-phone tasks
}

export interface Activity {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  descriptionAr: string;
  descriptionEn?: string;
  category: ActivityCategory;
  audience: AudienceType;
  kidsAgeGroup?: KidsAgeGroup;
  minAge: number;
  maxAge: number;
  minPlayers: number;
  maxPlayers: number;
  duration: number; // minutes
  energy: EnergyLevel;
  goal: GoalType;
  type: ActivityType;
  requiresPhone: boolean;
  requiresScreen: boolean;
  requiresMovement: boolean;
  requiresMaterials: boolean;
  competitive: boolean;
  cooperative: boolean;
  isPlayable: boolean; // has multi-round automated mechanics
  iconName: string;
  accentColor: string; // hex or tailwind color
  instructions: {
    overviewAr: string;
    hostAr: string[];
    participantAr: string[];
    facilitatorSteps?: string[]; // for non-phone facilitation
  };
  rounds?: ActivityRound[];
  whyRecommended?: string;
  faithContent?: boolean;
  languageContent?: boolean;
  educationContent?: boolean;
  tags?: string[];
}

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  joinedAt: number;
  score: number;
  isHost?: boolean;
  isSimulated?: boolean;
  teamId?: string;
  streak?: number;
  lastAnswerAt?: number;
}

export interface PlayerAnswer {
  playerId: string;
  playerNickname: string;
  roundId: string;
  answer: string | number;
  answeredAt: number;
  isCorrect?: boolean;
  pointsAwarded?: number;
}

export interface Team {
  id: string;
  nameAr: string;
  color: string;
  memberIds: string[];
  score: number;
}

export type RoomStatus =
  | "LOBBY"
  | "COUNTDOWN"
  | "PLAYING_ROUND"
  | "ROUND_RESULTS"
  | "LEADERBOARD"
  | "FINAL_CELEBRATION";

export interface RoomState {
  code: string;
  activityId: string;
  activitySlug: string;
  status: RoomStatus;
  currentRoundIndex: number;
  roundTimer: number; // remaining seconds
  roundStartTime?: number;
  players: Player[];
  answers: PlayerAnswer[];
  teams: Team[];
  isTeamMode: boolean;
  isDemo: boolean;
  createdAt: number;
  soundEnabled: boolean;
  version?: number;
  lastUpdatedAt?: number;
}

export interface WizardAnswers {
  playerCount: "2-5" | "6-10" | "11-20" | "21-40" | "40+";
  audience: AudienceType;
  ageRange?: "4-6" | "7-9" | "10-12" | "13+" | "18+" | "mixed";
  durationMinutes: "2" | "5" | "10" | "20" | "30+";
  energy: EnergyLevel;
  goal: GoalType;
  hasPhones: "yes" | "no" | "partial";
  hasScreen?: "yes" | "no";
}

export interface RecommendationResult {
  topActivity: Activity;
  alternatives: Activity[];
  reasonAr: string;
  matchScore: number;
}
