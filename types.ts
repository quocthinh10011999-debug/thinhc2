
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
