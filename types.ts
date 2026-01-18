
export interface RegistrationData {
  visitorName: string;
  idNumber: string;
  phoneNumber: string;
  soldierName: string;
  soldierUnit: string;
  relationship: string;
  visitDate: string;
  visitTime: string;
}

export interface Feedback {
  id: string;
  author: string;
  content: string;
  date: string;
  response?: string;
}
