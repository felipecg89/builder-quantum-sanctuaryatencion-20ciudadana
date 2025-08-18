import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "../hooks/use-toast";
import {
  Clock,
  Calendar,
  User,
  MapPin,
  ArrowLeft,
  CheckCircle,
  Building2,
  Info,
  Users,
  CalendarDays,
} from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import {
  getUpcomingPublicAudienceDates,
  formatPublicAudienceDate,
  generateTimeSlots,
  PublicAudienceDate,
  TimeSlot,
} from "@/lib/friday-utils";

export default function Turnos() {
  const [publicAudienceDates, setPublicAudienceDates] = useState<
    PublicAudienceDate[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<PublicAudienceDate | null>(
    null,
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    setUserData(user);

    // Cargar fechas de audiencias públicas
    const dates = getUpcomingPublicAudienceDates();
    setPublicAudienceDates(dates);
  }, [navigate]);

  const handleDateSelect = (date: PublicAudienceDate) => {
    setSelectedDate(date);
    setSelectedSlot(null);

    // Generar slots de tiempo para la fecha seleccionada
    const slots = generateTimeSlots();

    // Cargar turnos ya reservados para esta fecha
    const dateKey = format(date.date, "yyyy-MM-dd");
    const savedTurnos = localStorage.getItem("publicAudienceTurnos");
    const existingTurnos = savedTurnos ? JSON.parse(savedTurnos) : {};
    const dayTurnos = existingTurnos[dateKey] || {};

    // Marcar slots como ocupados si ya están reservados
    const updatedSlots = slots.map((slot) => ({
      ...slot,
      isAvailable: !dayTurnos[slot.id],
      citizenName: dayTurnos[slot.id]?.citizenName || null,
    }));

    setTimeSlots(updatedSlots);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleConfirmReservation = () => {
    if (!selectedDate || !selectedSlot || !userData) return;

    setIsLoading(true);

    // Simular proceso de reserva
    setTimeout(() => {
      const dateKey = format(selectedDate.date, "yyyy-MM-dd");
      const savedTurnos = localStorage.getItem("publicAudienceTurnos");
      const existingTurnos = savedTurnos ? JSON.parse(savedTurnos) : {};

      if (!existingTurnos[dateKey]) {
        existingTurnos[dateKey] = {};
      }

      existingTurnos[dateKey][selectedSlot] = {
        citizenName: userData.name,
        citizenEmail: userData.email,
        citizenPhone: userData.phone,
        reservationDate: new Date().toISOString(),
        status: "confirmed",
      };

      localStorage.setItem(
        "publicAudienceTurnos",
        JSON.stringify(existingTurnos),
      );

      toast({
        title: "¡Turno Reservado Exitosamente!",
        description: `Tu cita ha sido confirmada para el ${formatPublicAudienceDate(selectedDate.date)} a las ${timeSlots.find((s) => s.id === selectedSlot)?.time}`,
      });

      setIsLoading(false);

      // Actualizar la vista
      handleDateSelect(selectedDate);
      setSelectedSlot(null);
    }, 1500);
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-b border-blue-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                🕐 Turnos para Audiencias Públicas
              </h1>
              <p className="text-sm text-blue-100 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Reserva tu cita con el Presidente Municipal • Solo Viernes
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="border-blue-200 text-blue-100 hover:bg-blue-50 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Información importante */}
        <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-amber-800">
                  📋 Información Importante sobre las Audiencias Públicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <strong>Horario:</strong> Solo viernes de 9:00 AM a 12:00
                      PM
                    </p>
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <strong>Duración:</strong> 15 minutos máximo por persona
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <strong>Modalidad:</strong> Únicamente presencial
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <strong>Con:</strong> Presidente Municipal en persona
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fechas disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Fechas Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {publicAudienceDates.map((date, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedDate?.date.getTime() === date.date.getTime()
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "hover:border-blue-300"
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {formatPublicAudienceDate(date.date)}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {format(date.date, "EEEE, d MMMM yyyy", {
                            locale: es,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            date.available > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {date.available > 0
                            ? `${date.available} disponibles`
                            : "Sin cupos"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Horarios disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                {selectedDate ? "Horarios Disponibles" : "Selecciona una Fecha"}
              </CardTitle>
              {selectedDate && (
                <p className="text-sm text-slate-600">
                  {formatPublicAudienceDate(selectedDate.date)}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <div className="text-center py-12 text-slate-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>Selecciona una fecha para ver los horarios disponibles</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={
                          selectedSlot === slot.id
                            ? "default"
                            : slot.isAvailable
                              ? "outline"
                              : "ghost"
                        }
                        className={`h-12 ${
                          !slot.isAvailable
                            ? "opacity-50 cursor-not-allowed"
                            : selectedSlot === slot.id
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "hover:bg-blue-50 hover:border-blue-300"
                        }`}
                        onClick={() =>
                          slot.isAvailable && handleSlotSelect(slot.id)
                        }
                        disabled={!slot.isAvailable}
                      >
                        <div className="text-center">
                          <div className="flex items-center gap-2">
                            {slot.isAvailable ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <User className="w-4 h-4 text-red-500" />
                            )}
                            <span className="font-medium">{slot.time}</span>
                          </div>
                          {!slot.isAvailable && slot.citizenName && (
                            <div className="text-xs text-slate-500 mt-1">
                              Reservado
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>

                  {selectedSlot && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Confirmar Reservación
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {formatPublicAudienceDate(selectedDate.date)}
                        </p>
                        <p>
                          <strong>Hora:</strong>{" "}
                          {timeSlots.find((s) => s.id === selectedSlot)?.time}
                        </p>
                        <p>
                          <strong>Ciudadano:</strong> {userData.name}
                        </p>
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={handleConfirmReservation}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Confirmando...
                          </div>
                        ) : (
                          "Confirmar Reservación"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
