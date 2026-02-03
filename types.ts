
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
  rank: string;
  position: string;
  hometown: string; // Quê quán
  squad: string;
  platoon: string;
  soldierUnit: string; // Đại đội
  status: 'tốt' | 'khá' | 'trung bình' | 'stable' | 'concern' | 'urgent';
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
