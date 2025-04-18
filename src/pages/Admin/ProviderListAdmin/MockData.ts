// ProviderListAdmin/mockData.ts

export interface Provider {
  MINC: string;
  avatarUrl: string;
  lastName: string;
  name: string;
  patients: number;
  jobTitle: string;
  status: string;
}

export const mockProviders = [
  {
    MINC: "300558123",
    avatarUrl: "/Icons/AvatarIcon.svg",
    lastName: "Egbeyemi",
    name: "Doctor",
    patients: 258,
    jobTitle: "Family physician",
    status: "Vacation",
  },
  {
    MINC: "852647321",
    avatarUrl: "/Icons/AvatarIcon1.svg",
    lastName: "Garcia Meireser",
    name: "Maria Isabel",
    patients: 350,
    jobTitle: "Chiropractor",
    status: "Out of office",
  },
  {
    MINC: "502317958",
    avatarUrl: "/Icons/AvatarIcon2.svg",
    lastName: "Maya",
    name: "Doctor",
    patients: 250,
    jobTitle: "Family physician",
    status: "On call",
  },
  {
    MINC: "625749832",
    avatarUrl: "/Icons/AvatarIcon3.svg",
    lastName: "Smith",
    name: "Jamie",
    patients: 52,
    jobTitle: "Physical therapist",
    status: "Available",
  },
  {
    MINC: "526879312",
    avatarUrl: "/Icons/AvatarIcon4.svg",
    lastName: "Patel",
    name: "Christian",
    patients: 23,
    jobTitle: "Family physician",
    status: "Available",
  },
  {
    MINC: "126859347",
    avatarUrl: "/Icons/AvatarIcon5.svg",
    lastName: "Coleman",
    name: "Tanya",
    patients: 24,
    jobTitle: "Family physician",
    status: "Available",
  },
];


export const getProviderByMINC = (MINC: string): Provider | undefined => {
  return mockProviders.find(provider => provider.MINC === MINC);
};

export const updateProvider = (updatedProvider: Provider): Provider => {
  const index = mockProviders.findIndex(p => p.MINC === updatedProvider.MINC);
  if (index !== -1) {
    mockProviders[index] = updatedProvider;
  }
  return updatedProvider;
};