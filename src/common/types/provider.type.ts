import { Patient } from "./patient.type";
export interface Provider {
  id: string;
  picture: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  user_name: string;
  mnc_number: string;
  phone_number: string;
  email_address: string;
  roles: string[];
  provider_status: string;
  patient_count: number;
  medical_group?: string;
  clinics: string[];
  accepting_patients: boolean
  sex: string
  patients: Patient[];
}

