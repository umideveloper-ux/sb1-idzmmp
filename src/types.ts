export interface School {
  id: string;
  name: string;
  email: string;
  candidates: {
    B: number;
    A1: number;
    A2: number;
    C: number;
    D: number;
  };
}

export interface Message {
  id: string;
  schoolId: string;
  schoolName: string;
  content: string;
  timestamp: Date;
}

export type LicenseClass = 'B' | 'A1' | 'A2' | 'C' | 'D';