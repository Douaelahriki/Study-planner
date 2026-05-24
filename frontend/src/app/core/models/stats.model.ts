export interface StatsSummary {
  totalSessions: number;
  completedSessions: number;
  missedSessions: number;
  totalHours: number;
  completionRate: number;
}

export interface SubjectStat {
  subjectId: string;
  name: string;
  color: string;
  totalHours: number;
  goalHours: number;
  progress: number;
  sessionsCount: number;
}

export interface DayStat {
  date: string;
  day: string;
  planned: number;
  completed: number;
  hours: number;
}

export interface ComparisonStat {
  name: string;
  color: string;
  plannedSessions: number;
  completedSessions: number;
  plannedHours: number;
  actualHours: number;
}