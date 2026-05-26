import type { SeverityLevel, ThreatCategory } from '@/lib/constants';

export interface Threat {
  id: string;
  title: string;
  severity: SeverityLevel;
  category: ThreatCategory;
  date: string; // ISO string format
  description: string;
  source: string;
  detailsForSummary: string; // Full details for AI summary
  tags?: string[];
  status?: 'New' | 'Investigating' | 'Resolved';
  mitigation?: string;
  affectedSystems?: string[];
}

export interface AlertSetting {
  id: string;
  name: string;
  riskLevels: SeverityLevel[];
  categories: ThreatCategory[];
  keywords: string[];
  isEnabled: boolean;
  lastTriggered?: string; // ISO string format
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: {
    darkMode?: boolean; // though app is dark only by default
    notifications?: {
      email?: boolean;
      inApp?: boolean;
    }
  }
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  status: 'Active' | 'Pending' | 'Inactive';
  joinedDate: string;
  avatarUrl?: string;
}

export type ChartData = {
  name: string;
  value: number;
  fill?: string; // For custom colors in charts
};

export type TimeSeriesData = {
  date: string; // e.g., "YYYY-MM-DD"
  count: number;
};
