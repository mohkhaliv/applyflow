export const STATUSES = [
  'Wishlist',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
] as const;
export type ApplicationStatus = (typeof STATUSES)[number];
export type StatusHistoryEntry = {
  status: ApplicationStatus;
  enteredAt: string;
};
export type JobApplication = {
  id: string;
  company: string;
  role: string;
  location: string;
  employmentType: string;
  jobUrl?: string;
  dateApplied?: string;
  status: ApplicationStatus;
  order: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
};
export type ApplicationInput = Pick<
  JobApplication,
  | 'company'
  | 'role'
  | 'location'
  | 'employmentType'
  | 'jobUrl'
  | 'dateApplied'
  | 'status'
  | 'notes'
>;
export type Filters = {
  search: string;
  status: string;
  sort: 'newest' | 'oldest' | 'company';
};
