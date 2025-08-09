import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  isFriday,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";

export interface PublicAudienceDate {
  date: Date;
  weekNumber: number;
  isAvailable: boolean;
  slotsAvailable: number;
  totalSlots: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  citizenId?: string;
  citizenName?: string;
}

// Horarios disponibles para audiencias públicas (9:00 AM a 5:00 PM, turnos dinámicos)
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  let hour = 9;
  let minute = 0;

  while (hour < 17) {
    const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    slots.push({
      id: `slot-${timeString.replace(":", "")}`,
      time: timeString,
      available: true,
    });

    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
};

// Obtener todos los viernes de un mes específico
export const getFridaysInMonth = (year: number, month: number): Date[] => {
  const fridays: Date[] = [];
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));

  let currentDate = start;

  while (currentDate <= end) {
    if (isFriday(currentDate)) {
      fridays.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  return fridays;
};

// Obtener los próximos 3 meses de viernes para audiencias públicas
export const getUpcomingPublicAudienceDates = (): PublicAudienceDate[] => {
  const dates: PublicAudienceDate[] = [];
  const today = new Date();

  // Obtener viernes de los próximos 3 meses
  for (let i = 0; i < 3; i++) {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + i);
    const fridays = getFridaysInMonth(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
    );

    fridays.forEach((friday, index) => {
      // Solo incluir viernes futuros
      if (friday >= today) {
        dates.push({
          date: friday,
          weekNumber: index + 1,
          isAvailable: true,
          slotsAvailable: 12, // 3 horas * 4 slots por hora = 12 slots
          totalSlots: 12,
        });
      }
    });
  }

  return dates.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Formatear fecha para mostrar
export const formatPublicAudienceDate = (date: Date): string => {
  return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: es });
};

// Verificar si una fecha es viernes de audiencia pública
export const isPublicAudienceFriday = (date: Date): boolean => {
  return isFriday(date);
};

// Generar número de turno
export const generateTurnNumber = (date: Date, slotId: string): string => {
  const dateStr = format(date, "yyyyMMdd");
  const slotNumber = slotId.replace("slot-", "");
  return `AP-${dateStr}-${slotNumber}`;
};
