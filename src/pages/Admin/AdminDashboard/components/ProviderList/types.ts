export interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  picture: string;
  roles: string[];
  provider_status: 'Vacation' | 'Out of Office' | 'On call' | 'Available' | 'Unknown status';
  patient_count: number;
}

export type SortKey = keyof Omit<Provider, 'id' | 'picture'> | 'name';
export type SortDirection = 'asc' | 'desc';

export interface Column {
  label: string;
  key: SortKey | 'picture';
}