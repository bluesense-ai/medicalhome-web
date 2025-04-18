export interface Patient {
  id: number;  // Changed from string to number
  firstName: string;
  lastName: string;
  lookingFor: string;
  preferredClinic: string;
  joinedWaitlist: string;  // Added this field
  // Remove sex and joinedDate if they're not actually present in your data
}

export const mockPatients: Patient[] = [
  {
    id: 1,
    lastName: "Williams",
    firstName: "Lance",
    lookingFor: "Family physician",
    preferredClinic: "Walmart clinic",
    joinedWaitlist: "5 Sept 2024",
  },
  {
    id: 2,
    lastName: "Mantei",
    firstName: "Sarah",
    lookingFor: "Family physician",
    preferredClinic: "Hope Health Center",
    joinedWaitlist: "5 Sept 2024",
  },
  {
    id: 3,
    lastName: "Rodriguez",
    firstName: "Roberto",
    lookingFor: "Family physician",
    preferredClinic: "Hope Health Center",
    joinedWaitlist: "5 Sept 2024",
  },
  {
    id: 4,
    lastName: "Patel",
    firstName: "Sanjay",
    lookingFor: "Family physician",
    preferredClinic: "Hope Health Center",
    joinedWaitlist: "5 Sept 2024",
  },
  {
    id: 5,
    lastName: "Singh",
    firstName: "Amrita",
    lookingFor: "Family physician",
    preferredClinic: "Walmart clinic",
    joinedWaitlist: "5 Sept 2024",
  },
  {
    id: 6,
    lastName: "Coleman",
    firstName: "Sasha",
    lookingFor: "Family physician",
    preferredClinic: "Hope Health Center",
    joinedWaitlist: "5 Sept 2024",
  },
];

export const getPatientById = (id: number): Patient | undefined => {
  return mockPatients.find((patient) => patient.id === id);
};

export const updatePatient = (updatedPatient: Patient): Patient => {
  const index = mockPatients.findIndex((p) => p.id === updatedPatient.id);
  if (index !== -1) {
    mockPatients[index] = updatedPatient;
  }
  return updatedPatient;
};
