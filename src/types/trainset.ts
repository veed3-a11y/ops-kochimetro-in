export interface Trainset {
  id: string;
  number: string;
  status: "ready" | "warning" | "critical" | "inactive" | "maintenance";
  fitnessExpiry: string;
  fitnessStatus: "valid" | "expiring" | "expired";
  jobCards: {
    open: number;
    critical: number;
  };
  mileage: number;
  branding: {
    type: string;
    expiryDays: number;
  } | null;
  cleaning: {
    status: "completed" | "in-progress" | "pending";
    bay: string;
  };
  lastService: string;
  recommendationRank?: number;
  recommendationScore?: number;
  location?: string;
}

export interface RecommendationReason {
  trainsetId: string;
  included: boolean;
  reasons: string[];
  score: number;
  constraints: {
    fitness: boolean;
    jobCards: boolean;
    cleaning: boolean;
    branding: boolean;
    mileage: boolean;
  };
}
