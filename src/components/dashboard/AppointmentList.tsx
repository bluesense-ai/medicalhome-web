import { useState } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  endTime: string;
  title: string;
  type: 'standard' | 'urgent' | 'walk-in';
}

interface AppointmentListProps {
  selectedDate: Date;
}

// Sample data for appointments
const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'Joseph Mondesire',
    patientId: '123456789',
    time: '10:00',
    endTime: '10:10',
    title: 'Stomach Hurts',
    type: 'standard'
  },
  {
    id: '2',
    patientName: 'John Smith',
    patientId: '122554787',
    time: '10:10',
    endTime: '10:20',
    title: 'Short visit',
    type: 'standard'
  },
  {
    id: '3',
    patientName: 'Jose Gustavo Carvajal Pena',
    patientId: '125455782',
    time: '10:20',
    endTime: '10:30',
    title: 'Short visit',
    type: 'standard'
  },
  {
    id: '4',
    patientName: 'Dami Egbeyemi',
    patientId: '223426899',
    time: '11:00',
    endTime: '11:15',
    title: 'Nausea, migraines and indigestion',
    type: 'standard'
  },
  {
    id: '5',
    patientName: 'Ron Swanson',
    patientId: '123456789',
    time: '11:00',
    endTime: '11:15',
    title: 'Walk-in',
    type: 'walk-in'
  },
  {
    id: '6',
    patientName: 'Mandy Rogers',
    patientId: '132555789',
    time: '11:15',
    endTime: '11:30',
    title: 'Tingling sensation in my arms when working on my laptop for long periods of time',
    type: 'urgent'
  }
];

const AppointmentList = ({ selectedDate }: AppointmentListProps) => {
  const [appointments] = useState<Appointment[]>(SAMPLE_APPOINTMENTS);
  
  // Group appointments by time
  const appointmentsByTime: { [key: string]: Appointment[] } = {};
  appointments.forEach(appointment => {
    if (!appointmentsByTime[appointment.time]) {
      appointmentsByTime[appointment.time] = [];
    }
    appointmentsByTime[appointment.time].push(appointment);
  });
  
  // Get unique times and sort them
  const times = Object.keys(appointmentsByTime).sort();
  
  return (
    <div className="mt-6">
      {times.map(time => (
        <div key={time} className="mb-6">
          <div className="text-lg font-medium text-gray-700 mb-2">
            {time} {time >= '12:00' ? 'PM' : 'AM'}
          </div>
          
          <div className="space-y-3">
            {appointmentsByTime[time].map(appointment => (
              <div 
                key={appointment.id} 
                className={`bg-white rounded-md shadow p-4 border-l-4 
                  ${appointment.type === 'urgent' ? 'border-red-500' : 
                    appointment.type === 'walk-in' ? 'border-secondary-green-dark' : 
                    'border-primary-blue'}`}
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-8">
                    <h3 className="font-medium text-gray-800">{appointment.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-600">{appointment.patientName}</div>
                      <div className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-1">
                        {appointment.patientId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-4 text-right">
                    <div className="text-sm font-medium text-gray-600">
                      {appointment.time} - {appointment.endTime}
                    </div>
                    
                    {appointment.type === 'walk-in' && (
                      <div className="inline-block bg-green-100 text-secondary-green-dark text-xs rounded-full px-2 py-1 mt-2">
                        Walk-in
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList; 