import { addDays, format, setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";

export function getUpcomingPublicAudienceDates(count: number = 10): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date();

  while (dates.length < count) {
    // Solo viernes (día 5)
    if (currentDate.getDay() === 5) {
      dates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

export function formatPublicAudienceDate(date: Date): string {
  return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];

  // Generar slots de 9:00 AM a 5:00 PM cada 30 minutos
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = setMinutes(setHours(new Date(), hour), minute);
      slots.push(format(time, "HH:mm"));
    }
  }

  return slots;
}

export function isDateInFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export function formatTimeSlot(timeSlot: string): string {
  const [hour, minute] = timeSlot.split(":").map(Number);
  const date = setMinutes(setHours(new Date(), hour), minute);
  return format(date, "HH:mm");
}
