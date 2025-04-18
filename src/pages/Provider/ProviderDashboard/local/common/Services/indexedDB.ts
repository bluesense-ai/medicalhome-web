import Dexie, { Table } from 'dexie';

interface Service {
  id: string;
  ms_id: string;
  name: string;
  description?: string;
  price?: number;
  defaultDuration?: number;
}

interface Staff {
  id: string;
  ms_id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Question {
  id: string;
  ms_id: string;
  displayName: string;
  required?: boolean;
}

interface Booking {
  id: string;
  title: string;
  start: Date;
  end: Date;
  serviceId: string;
  localServiceId?: string;
  customerNotes?: string;
  customerEmailAddress?: string;
  customerPhone?: string;
  staffMemberIds?: string[];
  optOutOfCustomerEmail?: boolean;
  isCustomerAllowedToManageBooking?: boolean;
  healthCardNumber?: string;
}

class BookingsDB extends Dexie {
  services!: Table<Service>;
  staff!: Table<Staff>;
  questions!: Table<Question>;
  bookings!: Table<Booking>;


  constructor() {
    super("BookingsDB");
    this.version(1).stores({
      services: `
      id,
      ms_id,
      name,
      description,
      price,
      defaultDuration
    `,

      staff: `
      id,
      ms_id,
      name,
      email,
      phone
    `,

      questions: `
      id,
      ms_id,
      displayName,
      required
    `,

      bookings: `
      id,
      title,
      start,
      end,
      serviceId,
      localServiceId,
      customerNotes,
      customerEmailAddress,
      customerPhone,
      staffMemberIds,
      optOutOfCustomerEmail,
      isCustomerAllowedToManageBooking,
      healthCardNumber
    `,
    });
  }
}


window.deleteDatabase = async () => {
  try {
    await db.delete();
   
  } catch (error) {
    console.error("Error deleting database:", error);
  }
};

const db = new BookingsDB();
export default db;

