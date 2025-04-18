export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    age: string;
    sex: string;
    clinic: string;
    nextAppointment: string;
  }
  
  export const mockPatients: Patient[] = [
    {
      id: 1,
      lastName: "Williams",
      firstName: "Lenny",
      age: "43 years old",
      sex: "Male",
      clinic: "Walmart clinic",
      nextAppointment: "5 Sept 2024",
    },
    {
      id: 2,
      lastName: "Mendel",
      firstName: "Sarah",
      age: "50 years old",
      sex: "Female",
      clinic: "Hope Health Center",
      nextAppointment: "5 Sept 2024",
    },
    {
      id: 3,
      lastName: "Rodriguez",
      firstName: "Roberto",
      age: "35 years old",
      sex: "Male",
      clinic: "Hope Health Center",
      nextAppointment: "5 Sept 2024",
    },
    {
      id: 4,
      lastName: "Patel",
      firstName: "Ravi",
      age: "100 years old",
      sex: "Male",
      clinic: "Hope Health Center",
      nextAppointment: "5 Sept 2024",
    },
    {
      id: 5,
      lastName: "Singh",
      firstName: "Anika",
      age: "30 years old",
      sex: "Female",
      clinic: "Walmart clinic",
      nextAppointment: "5 Sept 2024",
    },
    {
      id: 6,
      lastName: "Coleman",
      firstName: "Sasha",
      age: "23 years old",
      sex: "Other",
      clinic: "Hope Health Center",
      nextAppointment: "5 Sept 2024",
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
  
  export const deletePatient = (id: number): void => {
    const index = mockPatients.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockPatients.splice(index, 1);
    }
  };