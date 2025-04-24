import { formatDistance } from "date-fns";

interface Appointment {
  id: number;
  type: string; // 'video', 'test', etc.
  title: string;
  subtitle: string;
  date: Date;
  icon: string;
  iconBg: string;
  iconColor: string;
}

interface AppointmentCardProps {
  appointments: Appointment[];
}

const AppointmentCard = ({ appointments }: AppointmentCardProps) => {
  const formatAppointmentDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold">Upcoming Appointments</h3>
        <button className="text-primary text-sm">View All</button>
      </div>
      
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-start p-3 border border-gray-200 rounded-lg">
              <div className={`${appointment.iconBg} rounded-full p-2 mr-3`}>
                <i className={`${appointment.icon} ${appointment.iconColor}`}></i>
              </div>
              <div className="flex-1">
                <p className="font-medium">{appointment.title}</p>
                <p className="text-sm text-gray-500">{appointment.subtitle}</p>
                <div className="flex items-center mt-1 text-sm">
                  <i className="ri-calendar-line mr-1 text-gray-500"></i>
                  <span>{formatAppointmentDate(appointment.date)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No upcoming appointments</p>
            <button className="mt-2 text-primary">Schedule Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
