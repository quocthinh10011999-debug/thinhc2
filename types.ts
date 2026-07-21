
export interface RegistrationData {
  visitorName: string;
  idNumber: string;
  phoneNumber: string;
  soldierName: string;
  soldierUnit: string;
  relationship: string;
  visitDate: string;
  visitTime: string;
  status?: 'pending' | 'approved' | 'rejected';
  id?: string;
}

export interface Feedback {
  id: string;
  author: string;
  content: string;
  date: string;
  response?: string;
  status?: string;
}

export interface IdeologyLog {
  id: string;
  soldierName: string;
  soldierUnit: string;
  status: 'stable' | 'concern' | 'urgent';
  description: string;
  familyContext: string;
  officerNote: string;
  lastUpdated: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  timeMinutes: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  setId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
}

export interface QuizScore {
  id: string;
  userName: string;
  unit: string;
  score: number;
  total: number;
  setId: string;
  setTitle?: string;
  completedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl?: string;
  sourceUrl?: string;
  createdAt: string;
}

