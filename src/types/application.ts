import type { ApplicationStatus } from './application_status';

export interface Application {
  id: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  salary?: string;
  location?: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

