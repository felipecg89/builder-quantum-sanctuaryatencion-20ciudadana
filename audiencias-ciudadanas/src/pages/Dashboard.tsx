import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  LogOut,
  Mic,
  MicOff,
  Calendar as CalendarIcon,
  Plus,
  Phone,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  X,
  ArrowLeft,
  Package,
  Clock,
  Users,
  Settings,
  FileText,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  getUpcomingPublicAudienceDates,
  formatPublicAudienceDate,
  generateTimeSlots,
  generateTurnNumber,
  PublicAudienceDate,
  TimeSlot,
} from "@/lib/friday-utils";

const CATEGORIES = {
  especie: "Ayuda en Especie",
  servicio: "Servicio",
  invitacion: "Invitación",
  tramites: "Trámites",
};

const CATEGORY_ICONS = {
  especie: Package,
  servicio: Settings,
  invitacion: Users,
  tramites: FileText,
};

const CATEGORY_TYPES = {
  especie: ["Alimentos", "Medicamentos", "Ropa", "Materiales de construcción"],
  servicio: [
    "Servicios médicos",
    "Servicios legales",
    "Servicios sociales",
    "Servicios técnicos",
  ],
  invitacion: [
    "Evento público",
    "Ceremonia oficial",
    "Reunión comunitaria",
    "Conferencia",
  ],
  tramites: ["Licencias", "Permisos", "Certificados", "Registros"],
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioDescription, setAudioDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [caseNumber, setCaseNumber] = useState("");
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [newTypeValue, setNewTypeValue] = useState("");
  const [isLoadingNewType, setIsLoadingNewType] = useState(false);
  const [newTypeError, setNewTypeError] = useState("");
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [textDescription, setTextDescription] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [redirectCountdown, setRedirectCountdown] = useState(4);

  // Estados para turnos de audiencias públicas
  const [isTurnosModalOpen, setIsTurnosModalOpen] = useState(false);
  const [selectedAudienceDate, setSelectedAudienceDate] =
    useState<PublicAudienceDate | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null,
  );
  const [turnosConsultaTema, setTurnosConsultaTema] = useState("");
  const [availableDates, setAvailableDates] = useState<PublicAudienceDate[]>(
    [],
  );
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isBookingTurno, setIsBookingTurno] = useState(false);
  const [userTurnos, setUserTurnos] = useState<any[]>([]);
  const [showUserTurnos, setShowUserTurnos] = useState(false);
  const [currentTurnTicket, setCurrentTurnTicket] = useState<any>(null);
  const [showTurnTicket, setShowTurnTicket] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    type: "",
    description: "",
    meetingFormat: "",
    selectedDate: null as Date | null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      // Use setTimeout to defer navigation to avoid setState during render
      setTimeout(() => navigate("/login"), 0);
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (!parsedUser.authenticated) {
      // Use setTimeout to defer navigation to avoid setState during render
      setTimeout(() => navigate("/login"), 0);
      return;
    }

    setUser(parsedUser);

    // Inicializar fechas disponibles para turnos
    const upcomingDates = getUpcomingPublicAudienceDates();
    setAvailableDates(upcomingDates);

    // Cargar turnos del usuario
    const savedUserTurnos =
      localStorage.getItem("userPublicAudienceTurnos") || "[]";
    const parsedUserTurnos = JSON.parse(savedUserTurnos);
    const userTurnosFiltered = parsedUserTurnos.filter(
      (turno: any) => turno.userId === parsedUser.id,
    );
    setUserTurnos(userTurnosFiltered);
  }, []); // Remove navigate from dependencies

  // Keyboard shortcuts for modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isAddingNewType) return;

      if (event.key === "Escape") {
        const hasContent = newTypeValue.trim().length > 0;
        if (hasContent) {
          const confirmClose = window.confirm(
            "¿Estás seguro de cancelar? Se perderá el texto escrito.",
          );
          if (!confirmClose) return;
        }
        setIsAddingNewType(false);
        setNewTypeValue("");
        setNewTypeError("");
      }
    },
    [isAddingNewType, newTypeValue],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Cleanup recording timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (isRecording && mediaRecorder) {
        mediaRecorder.stop();
      }
    };
  }, [recordingTimer, isRecording, mediaRecorder]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Funciones para turnos de audiencias públicas
  const handleSelectAudienceDate = (date: PublicAudienceDate) => {
    setSelectedAudienceDate(date);

    // Cargar slots con datos persistidos
    const savedTurnos = localStorage.getItem("publicAudienceTurnos");
    const existingTurnos = savedTurnos ? JSON.parse(savedTurnos) : {};
    const dateKey = format(date.date, "yyyy-MM-dd");

    const slots = generateTimeSlots();
    const slotsWithReservations = slots.map((slot) => {
      const existingReservation = existingTurnos[dateKey]?.[slot.id];
      if (existingReservation) {
        return {
          ...slot,
          available: false,
          citizenId: existingReservation.citizenId,
          citizenName: existingReservation.citizenName,
        };
      }
      return slot;
    });

    setAvailableSlots(slotsWithReservations);
    setSelectedTimeSlot(null);
  };

  const handleBookTurno = async () => {
    if (
      !selectedAudienceDate ||
      !selectedTimeSlot ||
      !turnosConsultaTema.trim()
    )
      return;

    // Validaciones adicionales
    if (turnosConsultaTema.trim().length < 10) {
      alert(
        "Por favor, describe tu consulta con más detalle (mínimo 10 caracteres)",
      );
      return;
    }

    // Obtener turnos guardados del usuario
    const savedTurnos =
      localStorage.getItem("userPublicAudienceTurnos") || "[]";
    const userTurnos = JSON.parse(savedTurnos);

    setIsBookingTurno(true);

    try {
      // Simular proceso de reserva con pasos
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verificar disponibilidad nuevamente
      const dateKey = format(selectedAudienceDate.date, "yyyy-MM-dd");
      const allTurnos = localStorage.getItem("publicAudienceTurnos");
      const existingTurnos = allTurnos ? JSON.parse(allTurnos) : {};

      if (existingTurnos[dateKey]?.[selectedTimeSlot.id]) {
        alert(
          "Este turno ya fue reservado por otro ciudadano. Por favor, selecciona otro horario.",
        );
        setIsBookingTurno(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular procesamiento

      const turnNumber = generateTurnNumber(
        selectedAudienceDate.date,
        selectedTimeSlot.id,
      );

      // Guardar reserva en localStorage
      if (!existingTurnos[dateKey]) {
        existingTurnos[dateKey] = {};
      }

      existingTurnos[dateKey][selectedTimeSlot.id] = {
        citizenId: user.id,
        citizenName: user.name,
        citizenPhone: user.phone,
        tema: turnosConsultaTema,
        turnNumber: turnNumber,
        reservedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "publicAudienceTurnos",
        JSON.stringify(existingTurnos),
      );

      // Guardar en historial del usuario
      const newUserTurno = {
        userId: user.id,
        turnNumber: turnNumber,
        date: format(selectedAudienceDate.date, "yyyy-MM-dd"),
        time: selectedTimeSlot.time,
        tema: turnosConsultaTema,
        status: "confirmado",
      };

      userTurnos.push(newUserTurno);
      localStorage.setItem(
        "userPublicAudienceTurnos",
        JSON.stringify(userTurnos),
      );

      // Actualizar estado local de turnos del usuario
      setUserTurnos([
        ...userTurnos.filter((t: any) => t.userId === user.id),
        newUserTurno,
      ]);

      // Actualizar slot como ocupado en el estado local
      const updatedSlots = availableSlots.map((slot) =>
        slot.id === selectedTimeSlot.id
          ? {
              ...slot,
              available: false,
              citizenId: user.id,
              citizenName: user.name,
            }
          : slot,
      );
      setAvailableSlots(updatedSlots);

      // Actualizar fechas disponibles
      const updatedDates = availableDates.map((date) => {
        if (date.date.getTime() === selectedAudienceDate.date.getTime()) {
          return {
            ...date,
            slotsAvailable: date.slotsAvailable - 1,
          };
        }
        return date;
      });
      setAvailableDates(updatedDates);

      // Crear datos del ticket
      const ticketData = {
        turnNumber: turnNumber,
        date: selectedAudienceDate.date,
        formattedDate: formatPublicAudienceDate(selectedAudienceDate.date),
        time: selectedTimeSlot.time,
        tema: turnosConsultaTema,
        citizenName: user.name,
        citizenPhone: user.phone,
        reservedAt: new Date(),
      };

      // Mostrar ticket visual
      setCurrentTurnTicket(ticketData);
      setShowTurnTicket(true);

      // Limpiar formulario del modal original
      setSelectedAudienceDate(null);
      setSelectedTimeSlot(null);
      setTurnosConsultaTema("");
      setIsTurnosModalOpen(false);
    } catch (error) {
      console.error("Error al reservar turno:", error);
      alert(
        "❌ Error al reservar el turno. Verifica tu conexión e intenta nuevamente.",
      );
    } finally {
      setIsBookingTurno(false);
    }
  };

  const handleScreenshot = async () => {
    try {
      // Usar html2canvas para capturar la pantalla
      const { default: html2canvas } = await import("html2canvas");

      // Obtener el elemento de la tarjeta de confirmación
      const confirmationCard = document.querySelector(
        ".confirmation-card",
      ) as HTMLElement;

      if (confirmationCard) {
        const canvas = await html2canvas(confirmationCard, {
          backgroundColor: "#ffffff",
          scale: 2, // Mejor calidad
          useCORS: true,
          allowTaint: true,
        });

        // Crear enlace de descarga
        const link = document.createElement("a");
        link.download = `folio-${caseNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        // Fallback: capturar toda la ventana
        const canvas = await html2canvas(document.body, {
          backgroundColor: "#ffffff",
          scale: 1,
          useCORS: true,
          allowTaint: true,
        });

        const link = document.createElement("a");
        link.download = `folio-${caseNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Error al capturar pantalla:", error);
      alert(
        "No se pudo capturar la pantalla. Intenta tomar una captura manual.",
      );
    }
  };

  const handleTurnTicketScreenshot = async () => {
    try {
      const { default: html2canvas } = await import("html2canvas");

      // Obtener el elemento del ticket de turno
      const turnTicketCard = document.querySelector(
        ".turn-ticket-card",
      ) as HTMLElement;

      if (turnTicketCard) {
        const canvas = await html2canvas(turnTicketCard, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        // Crear enlace de descarga
        const link = document.createElement("a");
        link.download = `turno-${currentTurnTicket?.turnNumber || "audiencia-publica"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Error al capturar ticket:", error);
      alert("No se pudo capturar el ticket. Intenta tomar una captura manual.");
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({ ...prev, category, type: "" }));
  };

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const addNewType = async () => {
    // Reset error
    setNewTypeError("");

    // Validation
    if (!newTypeValue.trim()) {
      setNewTypeError("Por favor ingresa un nombre para el tipo");
      return;
    }

    if (newTypeValue.trim().length < 3) {
      setNewTypeError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!formData.category) {
      setNewTypeError("Primero selecciona una categoría");
      return;
    }

    // Check if type already exists
    const existingTypes =
      CATEGORY_TYPES[formData.category as keyof typeof CATEGORY_TYPES];
    if (
      existingTypes.some(
        (type) => type.toLowerCase() === newTypeValue.trim().toLowerCase(),
      )
    ) {
      setNewTypeError("Este tipo ya existe en la categoría");
      return;
    }

    setIsLoadingNewType(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add the new type
      CATEGORY_TYPES[formData.category as keyof typeof CATEGORY_TYPES].push(
        newTypeValue.trim(),
      );

      // Select the new type
      setFormData((prev) => ({ ...prev, type: newTypeValue.trim() }));

      // Reset form
      setNewTypeValue("");
      setNewTypeError("");
      setIsAddingNewType(false);

      // Show success message (you could add a toast here)
      console.log("Nuevo tipo agregado exitosamente:", newTypeValue.trim());
    } catch (error) {
      setNewTypeError("Error al agregar el tipo. Intenta nuevamente.");
    } finally {
      setIsLoadingNewType(false);
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Create MediaRecorder instance
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: "audio/webm;codecs=opus",
        });
        setAudioBlob(audioBlob);

        // Create a URL for the audio
        const audioUrl = URL.createObjectURL(audioBlob);

        // Set description with playback info
        const duration = Math.floor(recordingTime);
        setAudioDescription(
          `Audio grabado (${duration}s) - Haz clic para reproducir`,
        );

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        // Clear timer
        if (recordingTimer) {
          clearInterval(recordingTimer);
          setRecordingTimer(null);
        }
        setRecordingTime(0);
      };

      recorder.onerror = (event) => {
        console.error("Recording error:", event);
        setIsRecording(false);
        alert("Error al grabar audio. Verifica los permisos del micrófono.");
      };

      // Start recording
      recorder.start(1000); // Collect data every 1 second
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingTimer(timer);

      // Auto-stop after 2 minutes (120 seconds)
      setTimeout(() => {
        if (recorder.state === "recording") {
          stopRecording();
        }
      }, 120000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      let errorMessage = "No se pudo acceder al micrófono. ";

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage +=
              "Permisos denegados. Permite el acceso al micrófono en tu navegador.";
            break;
          case "NotFoundError":
            errorMessage += "No se encontró micrófono en tu dispositivo.";
            break;
          case "NotReadableError":
            errorMessage +=
              "El micrófono está siendo usado por otra aplicación.";
            break;
          default:
            errorMessage += "Error desconocido.";
        }
      }

      alert(errorMessage);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        alert("Error al reproducir el audio");
      });
    }
  };

  const deleteAudioRecording = () => {
    if (window.confirm("¿Estás seguro de eliminar la grabaci���n de audio?")) {
      setAudioBlob(null);
      setAudioDescription("");
      setRecordingTime(0);
    }
  };

  const handleSubmit = () => {
    // Generate case number
    const caseNum = `AUD-${Date.now().toString().slice(-6)}`;
    setCaseNumber(caseNum);
    setCurrentStep(5);

    // In a real app, send data to backend and send email/SMS
    console.log("Audience request submitted:", {
      ...formData,
      caseNumber: caseNum,
      textDescription,
      audioDescription,
    });

    // No automatic redirect - user controls navigation
  };

  const resetForm = () => {
    // Stop recording if active
    if (isRecording && mediaRecorder) {
      stopRecording();
    }

    // Clear timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }

    setFormData({
      category: "",
      type: "",
      description: "",
      meetingFormat: "",
      selectedDate: null,
    });
    setCurrentStep(1);
    setCaseNumber("");
    setAudioDescription("");
    setTextDescription("");
    setIsDescriptionDialogOpen(false);
    setAudioBlob(null);
    setRecordingTime(0);
    setMediaRecorder(null);
    setRedirectCountdown(4);
  };

  if (!user) return null;

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!formData.category;
      case 2:
        return !!formData.type;
      case 3:
        return !!audioDescription || !!textDescription.trim();
      case 4:
        return (
          !!formData.meetingFormat &&
          (formData.meetingFormat === "online" || !!formData.selectedDate)
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Estilo Telmex */}
      <header className="bg-[#0052CC] border-b-4 border-[#DC2626] shadow-xl">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-lg border-2 border-[#DC2626]">
              <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-[#0052CC]" />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-black text-white">
                PRESIDENCIA MUNICIPAL
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-bold">
                SISTEMA DE AUDIENCIAS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/")}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Inicio</span>
              </Button>
            )}
            <div className="text-right">
              <p className="text-xs text-white/90 font-medium">Bienvenido</p>
              <p className="text-xs sm:text-sm font-bold text-white truncate max-w-24 sm:max-w-none">{user.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div
        className="max-w-4xl mx-auto px-1 sm:px-4 py-2 sm:py-8"
        data-progress={
          currentStep > 1 ||
          !!formData.category ||
          !!textDescription ||
          !!audioDescription
        }
      >
        {currentStep === 0 ? (
          /* Selector Principal de Servicio */
          <Card className="mx-0 sm:mx-0">
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
                <div className="flex-1"></div>
              </div>
              <CardTitle className="text-base sm:text-xl leading-tight text-center">
                ¿Qué necesitas hoy?
              </CardTitle>
              <CardDescription className="text-center">
                Selecciona el tipo de servicio que requieres
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Solicitudes Ciudadanas */}
                <Card
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-xl shadow-xl overflow-hidden"
                  onClick={() => setCurrentStep(1)}
                >
                  {/* Header azul estilo Telmex */}
                  <div className="bg-[#0052CC] p-6 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-8 h-8 text-[#0052CC]" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">
                      SOLICITUDES CIUDADANAS
                    </h3>
                    <p className="text-white/90 text-sm font-medium leading-relaxed">
                      Solicita ayuda en especie, servicios, trámites e
                      invitaciones. Modalidad virtual o presencial.
                    </p>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-2 text-xs text-slate-500">
                      <p>• Ayuda en especie (alimentos, medicamentos)</p>
                      <p>• Servicios (médicos, legales, sociales)</p>
                      <p>• Trámites y permisos</p>
                      <p>• Invitaciones a eventos</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Turnos de Audiencias Públicas */}
                <Card
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300 bg-green-50"
                  onClick={() => navigate("/turnos")}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Audiencias Públicas de Viernes
                      </h3>
                      <p className="text-sm text-green-700 leading-relaxed">
                        Reserva tu turno para consulta directa y presencial con
                        el Presidente Municipal.
                      </p>
                    </div>
                    <div className="space-y-2 text-xs text-green-600">
                      <p>• Solo viernes de 9:00 AM a 12:00 PM</p>
                      <p>• Consulta directa con el Presidente</p>
                      <p>• Modalidad únicamente presencial</p>
                      <p>• Duración: 15 minutos máximo</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : currentStep < 5 ? (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-start justify-between">
                {[
                  { number: 1, label: "Categoría" },
                  { number: 2, label: "Tipo" },
                  { number: 3, label: "Descripción" },
                  { number: 4, label: "Modalidad" },
                ].map((step, index) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center flex-1"
                  >
                    {/* Step Circle and Connector Container */}
                    <div className="flex items-center w-full justify-center relative">
                      {/* Left Connector */}
                      {index > 0 && (
                        <div
                          className={`absolute right-1/2 top-1/2 transform -translate-y-1/2 w-6 sm:w-8 md:w-12 h-0.5 transition-colors duration-200 ${
                            isStepComplete(step.number - 1)
                              ? "bg-green-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}

                      {/* Step Circle */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 relative z-10 border-2 ${
                          currentStep === step.number
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
                            : isStepComplete(step.number)
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-slate-600 border-slate-300"
                        }`}
                      >
                        {isStepComplete(step.number) ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <span className="font-bold">{step.number}</span>
                        )}
                      </div>

                      {/* Right Connector */}
                      {index < 3 && (
                        <div
                          className={`absolute left-1/2 top-1/2 transform -translate-y-1/2 w-6 sm:w-8 md:w-12 h-0.5 transition-colors duration-200 ${
                            isStepComplete(step.number)
                              ? "bg-green-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="step-label-container">
                      <span
                        className={`step-label-text transition-colors duration-200 ${
                          currentStep === step.number
                            ? "text-blue-600"
                            : isStepComplete(step.number)
                              ? "text-green-600"
                              : "text-slate-600"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="mx-0 sm:mx-0">
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
                <CardTitle className="text-base sm:text-xl leading-tight">
                  {currentStep === 1 &&
                    "Paso 1: Categoría de tu Solicitud Ciudadana"}
                  {currentStep === 2 && "Paso 2: Tipo de Solicitud"}
                  {currentStep === 3 && "Paso 3: Describe tu Solicitud"}
                  {currentStep === 4 && "Paso 4: Modalidad de Atención"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-base leading-tight">
                  {currentStep === 1 &&
                    "Selecciona la categoría que mejor describa tu necesidad"}
                  {currentStep === 2 &&
                    "Especifica el tipo de ayuda, servicio o trámite que requieres"}
                  {currentStep === 4 &&
                    "Elige si prefieres atención virtual o presencial para tu solicitud"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-6 px-3 sm:px-6 pb-3 sm:pb-6">
                {/* Step 1: Category Selection */}
                {currentStep === 1 && (
                  <div className="space-y-2 sm:space-y-4">
                    <RadioGroup
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      {Object.entries(CATEGORIES).map(([key, label]) => {
                        const IconComponent =
                          CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS];
                        return (
                          <div
                            key={key}
                            className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                          >
                            <RadioGroupItem value={key} id={key} />
                            <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full">
                                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                              </div>
                              <Label
                                htmlFor={key}
                                className="font-medium text-sm sm:text-base text-slate-700 cursor-pointer flex-1"
                              >
                                {label}
                              </Label>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                )}

                {/* Step 2: Type Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Select
                      value={formData.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo específico" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category &&
                          CATEGORY_TYPES[
                            formData.category as keyof typeof CATEGORY_TYPES
                          ]?.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={isAddingNewType}
                      onOpenChange={setIsAddingNewType}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Nuevo Tipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Tipo</DialogTitle>
                          <DialogDescription>
                            Describe el nuevo tipo de ayuda para la categoría:{" "}
                            {
                              CATEGORIES[
                                formData.category as keyof typeof CATEGORIES
                              ]
                            }
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="newType">Nombre del tipo</Label>
                            <Input
                              id="newType"
                              placeholder="Ej: Apoyo educativo, Servicios veterinarios..."
                              value={newTypeValue}
                              onChange={(e) => {
                                setNewTypeValue(e.target.value);
                                setNewTypeError(""); // Clear error when typing
                              }}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !isLoadingNewType) {
                                  addNewType();
                                }
                              }}
                              className={
                                newTypeError
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                              disabled={isLoadingNewType}
                            />
                            {newTypeError && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <span className="w-4 h-4">⚠️</span>
                                {newTypeError}
                              </p>
                            )}
                            <p className="text-xs text-slate-500">
                              Mínimo 3 caracteres. Será agregado a "
                              {
                                CATEGORIES[
                                  formData.category as keyof typeof CATEGORIES
                                ]
                              }
                              "
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="text-xs text-slate-500">
                              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">
                                Enter
                              </kbd>{" "}
                              para agregar,
                              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs ml-1">
                                Esc
                              </kbd>{" "}
                              para cancelar
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const hasContent =
                                    newTypeValue.trim().length > 0;
                                  if (hasContent) {
                                    const confirmClose = window.confirm(
                                      "¿Estás seguro de cancelar? Se perderá el texto escrito.",
                                    );
                                    if (!confirmClose) return;
                                  }
                                  setIsAddingNewType(false);
                                  setNewTypeValue("");
                                  setNewTypeError("");
                                }}
                                disabled={isLoadingNewType}
                                className="hover:bg-slate-50 transition-colors duration-200"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancelar
                              </Button>
                              <Button
                                onClick={addNewType}
                                disabled={
                                  isLoadingNewType || !newTypeValue.trim()
                                }
                                className="min-w-[120px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500"
                              >
                                {isLoadingNewType ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Agregando...
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Agregar Tipo
                                  </div>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* Step 3: Description */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-6">
                      <Button
                        onClick={() => setIsDescriptionDialogOpen(true)}
                        variant="outline"
                        className="w-full py-16 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 rounded-xl"
                      >
                        <div className="flex flex-col items-center space-y-6">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-blue-600" />
                          </div>
                          <div className="space-y-3 text-center px-4">
                            <span className="text-xl font-semibold text-slate-700 block">
                              Agregar Descripción
                            </span>
                            <span className="text-sm text-slate-500 block max-w-sm mx-auto leading-relaxed">
                              Escribe o graba tu descripción de la ayuda
                              solicitada
                            </span>
                          </div>
                        </div>
                      </Button>
                    </div>

                    {/* Show descriptions if available */}
                    <div className="space-y-3 sm:space-y-4">
                      {textDescription && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-6">
                          <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">📝</span>
                                <p className="text-blue-800 font-semibold">
                                  Descripción escrita
                                </p>
                              </div>
                              <p className="text-blue-700 leading-relaxed">
                                {textDescription}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsDescriptionDialogOpen(true)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 rounded-lg shrink-0"
                            >
                              ✏��� Editar
                            </Button>
                          </div>
                        </div>
                      )}

                      {audioDescription && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-6">
                          <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🎤</span>
                                <p className="text-green-800 font-semibold">
                                  Descripción de audio
                                </p>
                              </div>
                              <p className="text-green-700 leading-relaxed">
                                {audioDescription}
                              </p>
                              {audioBlob && (
                                <div className="flex items-center gap-3 pt-2">
                                  <Button
                                    onClick={playAudio}
                                    size="sm"
                                    variant="outline"
                                    className="text-green-700 border-green-300 hover:bg-green-100 flex items-center gap-2"
                                  >
                                    ▶️ Reproducir
                                  </Button>
                                  <Button
                                    onClick={deleteAudioRecording}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    🗑️ Eliminar
                                  </Button>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsDescriptionDialogOpen(true)}
                              className="text-green-600 hover:text-green-800 hover:bg-green-100 px-3 py-2 rounded-lg shrink-0"
                            >
                              ✏️ Editar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description Dialog */}
                    <Dialog
                      open={isDescriptionDialogOpen}
                      onOpenChange={setIsDescriptionDialogOpen}
                    >
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Describe tu Solicitud de Ayuda
                          </DialogTitle>
                          <DialogDescription>
                            Proporciona una descripción detallada de la ayuda
                            que necesitas. Puedes escribir o usar el micrófono
                            para grabar tu descripci��n.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Text Description Section */}
                          <div className="space-y-3">
                            <Label htmlFor="textDesc">
                              Descripción escrita
                            </Label>
                            <Textarea
                              id="textDesc"
                              placeholder="Describe detalladamente tu solicitud de ayuda..."
                              value={textDescription}
                              onChange={(e) =>
                                setTextDescription(e.target.value)
                              }
                              className="min-h-32 resize-none"
                              maxLength={500}
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Máximo 500 caracteres</span>
                              <span>{textDescription.length}/500</span>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-white px-2 text-slate-500">
                                O
                              </span>
                            </div>
                          </div>

                          {/* Audio Recording Section */}
                          <div className="space-y-4">
                            <Label>Descripción por audio</Label>
                            <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 rounded-lg border border-slate-200">
                              {/* Recording Timer */}
                              {isRecording && (
                                <div className="bg-red-100 border border-red-200 rounded-lg px-4 py-2 mb-2">
                                  <p className="text-red-800 font-mono text-lg">
                                    🔴 {Math.floor(recordingTime / 60)}:
                                    {(recordingTime % 60)
                                      .toString()
                                      .padStart(2, "0")}
                                  </p>
                                </div>
                              )}

                              {/* Recording Controls */}
                              <div className="flex items-center space-x-4">
                                <Button
                                  onClick={
                                    isRecording ? stopRecording : startRecording
                                  }
                                  className={`w-16 h-16 rounded-full transition-all duration-200 ${
                                    isRecording
                                      ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg"
                                      : "bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg"
                                  }`}
                                >
                                  {isRecording ? (
                                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                                  ) : (
                                    <Mic className="w-6 h-6" />
                                  )}
                                </Button>

                                {/* Play button for recorded audio */}
                                {audioBlob && !isRecording && (
                                  <Button
                                    onClick={playAudio}
                                    variant="outline"
                                    className="w-12 h-12 rounded-full hover:bg-green-50 hover:border-green-300"
                                  >
                                    ▶️
                                  </Button>
                                )}

                                {/* Delete button for recorded audio */}
                                {audioBlob && !isRecording && (
                                  <Button
                                    onClick={deleteAudioRecording}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  >
                                    🗑️
                                  </Button>
                                )}
                              </div>

                              {/* Status Text */}
                              <div className="text-center space-y-1">
                                <p className="text-sm font-medium text-slate-700">
                                  {isRecording
                                    ? `🔴 Grabando... (${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")})`
                                    : audioBlob
                                      ? "✅ Audio grabado correctamente"
                                      : "🎙���� Presiona para grabar tu descripción"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {isRecording
                                    ? "Presiona el botón rojo para detener"
                                    : audioBlob
                                      ? "Usa ▶️ para reproducir o 🗑️ para eliminar"
                                      : "Máximo 2 minutos de grabación"}
                                </p>
                              </div>

                              {/* Audio Visualization */}
                              {isRecording && (
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-1 bg-red-500 rounded-full animate-pulse"
                                      style={{
                                        height: `${Math.random() * 20 + 10}px`,
                                        animationDelay: `${i * 0.1}s`,
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Dialog Actions */}
                          <div className="flex justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsDescriptionDialogOpen(false);
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => {
                                setIsDescriptionDialogOpen(false);
                              }}
                              disabled={
                                !textDescription.trim() && !audioDescription
                              }
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Guardar Descripción
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* Step 4: Meeting Format and Date */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-slate-800">
                        Modalidad de Atención
                      </h3>
                      <RadioGroup
                        value={formData.meetingFormat}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            meetingFormat: value,
                          }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="presencial" id="presencial" />
                          <Label htmlFor="presencial" className="font-medium">
                            Presencial - Cita en oficinas municipales
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online" className="font-medium">
                            Virtual - Atención telefónica o por videollamada
                          </Label>
                        </div>
                      </RadioGroup>

                      {formData.meetingFormat === "online" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <p className="text-blue-800 text-sm">
                              Nos comunicaremos contigo al número:{" "}
                              <strong>{user.phone}</strong>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Date Selection - only show if presencial is selected */}
                    {formData.meetingFormat === "presencial" && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-slate-800">
                          Selecciona la Fecha
                        </h3>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate
                                ? format(selectedDate, "PPP", { locale: es })
                                : "Selecciona una fecha"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 bg-white shadow-lg border border-slate-200"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                setSelectedDate(date);
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedDate: date,
                                }));
                              }}
                              disabled={(date) =>
                                date < new Date() ||
                                date.getDay() === 0 ||
                                date.getDay() === 6
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <p className="text-sm text-slate-600">
                          * Las citas presenciales están disponibles de lunes a
                          viernes en horario de oficina (8:00 AM - 5:00 PM)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 sm:pt-6 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStep === 1) {
                        // Volver al selector principal
                        setCurrentStep(0);
                      } else {
                        // Otherwise, go to previous step
                        setCurrentStep(currentStep - 1);
                      }
                    }}
                    className="flex items-center gap-1 sm:gap-2 transition-all duration-200 hover:scale-105 text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    Anterior
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepComplete(currentStep)}
                      className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 disabled:shadow-none px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm"
                    >
                      Siguiente
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepComplete(currentStep)}
                      className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 disabled:shadow-none px-3 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      Enviar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Success/Confirmation Step */
          <Card className="mx-1 sm:mx-0">
            <CardContent className="confirmation-card text-center py-8 sm:py-12 px-4 sm:px-6">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                ¡Solicitud Enviada Exitosamente!
              </h2>

              <div className="bg-slate-100 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold text-slate-800 mb-2">
                  Tu número de caso es:
                </p>
                <p className="text-3xl font-bold text-blue-600">{caseNumber}</p>
              </div>

              <div className="text-sm text-slate-600 space-y-2 mb-6">
                <p>
                  Hemos enviado los detalles de tu solicitud a tu correo
                  electrónico y un mensaje SMS a tu teléfono{" "}
                  <strong>{user.phone}</strong>
                </p>
                <p>
                  Te contactaremos pronto para confirmar los detalles de tu
                  audiencia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleScreenshot}
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700 hover:text-green-800"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capturar Pantalla
                </Button>

                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Ir a Inicio Ahora
                </Button>

                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="hover:bg-slate-50"
                >
                  Nueva Solicitud
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Turnos para Audiencias Públicas */}
      <Dialog open={isTurnosModalOpen} onOpenChange={setIsTurnosModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Clock className="w-6 h-6 text-green-600" />
              Turnos para Audiencias Públicas de los Viernes
            </DialogTitle>
            <DialogDescription className="text-base">
              Reserva tu turno para consulta directa y presencial con el
              Presidente Municipal. Solo los viernes de cada mes - modalidad
              únicamente presencial.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Mis turnos reservados */}
            {userTurnos.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Mis Turnos Reservados ({userTurnos.length})
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowUserTurnos(!showUserTurnos)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    {showUserTurnos ? "Ocultar" : "Ver"}
                  </Button>
                </div>

                {showUserTurnos && (
                  <div className="space-y-2">
                    {userTurnos.map((turno, index) => (
                      <div
                        key={index}
                        className="bg-white rounded p-3 border border-blue-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-blue-900">
                              Turno #{turno.turnNumber}
                            </p>
                            <p className="text-sm text-blue-700">
                              {format(
                                new Date(turno.date),
                                "EEEE, dd 'de' MMMM",
                                { locale: es },
                              )}{" "}
                              - {turno.time}
                            </p>
                            <p className="text-xs text-blue-600">
                              Tema: {turno.tema}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {turno.status === "confirmado"
                              ? "Confirmado"
                              : turno.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Información importante */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Audiencias Públicas con el Presidente Municipal
              </h3>
              <div className="space-y-2 text-sm text-green-700">
                <p>
                  <strong>• Propósito:</strong> Encuentro directo con el
                  Presidente Municipal para consultas generales, quejas o
                  propuestas ciudadanas
                </p>
                <p>
                  <strong>• Modalidad:</strong> Solo presencial en la oficina
                  del Presidente Municipal
                </p>
                <p>
                  <strong>• Horario:</strong> Todos los viernes de 9:00 AM a
                  5:00 PM (turnos dinámicos)
                </p>
                <p>
                  <strong>• Diferencia:</strong> Para solicitudes específicas de
                  ayuda, servicios o trámites, usa "Solicitudes Ciudadanas"
                </p>
                <p>
                  <strong>• Importante:</strong> Este espacio es para diálogo
                  directo, consultas generales y seguimiento de asuntos
                  municipales
                </p>
              </div>
            </div>

            {/* Selección de fecha */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                1. Selecciona la fecha del viernes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableDates.map((dateOption, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedAudienceDate?.date.getTime() ===
                      dateOption.date.getTime()
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 hover:border-green-300"
                    }`}
                    onClick={() => handleSelectAudienceDate(dateOption)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800">
                            {formatPublicAudienceDate(dateOption.date)}
                          </p>
                          <p className="text-sm text-slate-600">
                            Viernes #{dateOption.weekNumber} del mes
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {dateOption.slotsAvailable} turnos disponibles
                          </p>
                          <p className="text-xs text-slate-500">
                            de {dateOption.totalSlots} total
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selección de horario */}
            {selectedAudienceDate && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  2. Selecciona tu horario preferido
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedTimeSlot?.id === slot.id ? "default" : "outline"
                      }
                      className={`h-12 ${
                        !slot.available
                          ? "opacity-50 cursor-not-allowed"
                          : selectedTimeSlot?.id === slot.id
                            ? "bg-green-600 hover:bg-green-700"
                            : "hover:border-green-300 hover:text-green-700"
                      }`}
                      onClick={() =>
                        slot.available && setSelectedTimeSlot(slot)
                      }
                      disabled={!slot.available}
                    >
                      <div className="text-center">
                        <p className="font-medium">{slot.time}</p>
                        <p className="text-xs">
                          {slot.available ? "Disponible" : "Ocupado"}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tema de consulta */}
            {selectedTimeSlot && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  3. Describe el tema de tu consulta
                </h3>
                <Textarea
                  placeholder="Describe brevemente el tema que quieres consultar en la audiencia pública..."
                  value={turnosConsultaTema}
                  onChange={(e) => setTurnosConsultaTema(e.target.value)}
                  rows={4}
                  maxLength={200}
                  className="resize-none"
                />
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Máximo 200 caracteres</span>
                  <span>{turnosConsultaTema.length}/200</span>
                </div>
              </div>
            )}

            {/* Instrucciones finales */}
            {selectedTimeSlot && turnosConsultaTema.trim() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Instrucciones importantes:
                </h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Llega 15 minutos antes de tu turno asignado</li>
                  <li>• Trae una identificación oficial</li>
                  <li>• La duración máxima por turno es de 15 minutos</li>
                  <li>
                    • Si no puedes asistir, cancela tu turno con anticipación
                  </li>
                  <li>
                    • Puedes reservar múltiples turnos según disponibilidad
                  </li>
                </ul>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                onClick={handleBookTurno}
                disabled={
                  !selectedAudienceDate ||
                  !selectedTimeSlot ||
                  !turnosConsultaTema.trim() ||
                  isBookingTurno
                }
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isBookingTurno ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Reservando turno...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reservar Turno
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsTurnosModalOpen(false);
                  setCurrentStep(0);
                }}
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                disabled={isBookingTurno}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsTurnosModalOpen(false)}
                className="flex-1"
                disabled={isBookingTurno}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Ticket de Turno */}
      <Dialog open={showTurnTicket} onOpenChange={setShowTurnTicket}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-green-700">
              🎫 Ticket de Turno Confirmado
            </DialogTitle>
          </DialogHeader>

          {currentTurnTicket && (
            <div className="turn-ticket-card bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 space-y-6">
              {/* Header del ticket */}
              <div className="text-center border-b border-green-200 pb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Presidencia Municipal
                    </h2>
                    <p className="text-sm text-slate-600">
                      Audiencia Pública de los Viernes
                    </p>
                  </div>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-full px-4 py-2 inline-block">
                  <p className="font-bold text-green-800">
                    ✅ TURNO CONFIRMADO
                  </p>
                </div>
              </div>

              {/* Información principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide">
                      Número de Turno
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {currentTurnTicket.turnNumber}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide">
                      Ciudadano
                    </p>
                    <p className="font-semibold text-slate-800">
                      {currentTurnTicket.citizenName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {currentTurnTicket.citizenPhone}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide">
                      Fecha y Hora
                    </p>
                    <p className="font-semibold text-slate-800">
                      {currentTurnTicket.formattedDate}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {currentTurnTicket.time}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide">
                      Tema de Consulta
                    </p>
                    <p className="text-sm text-slate-800">
                      {currentTurnTicket.tema}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instrucciones importantes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                  ⚠️ Instrucciones Importantes
                </h3>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>
                    • <strong>Llega 15 minutos antes</strong> de tu turno
                    asignado
                  </li>
                  <li>
                    • <strong>Trae identificación oficial</strong> (INE,
                    pasaporte, cédula profesional)
                  </li>
                  <li>
                    • <strong>Ubicación:</strong> Presidencia Municipal, Oficina
                    del Presidente
                  </li>
                  <li>
                    • <strong>Duración máxima:</strong> 15 minutos por consulta
                  </li>
                  <li>
                    • <strong>Si no puedes asistir,</strong> cancela con
                    anticipación
                  </li>
                </ul>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  📱 Recordatorios Automáticos
                </h3>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>✓ SMS enviado a {currentTurnTicket.citizenPhone}</p>
                  <p>✓ Recordatorio 1 día antes del turno</p>
                  <p>✓ Recordatorio 2 horas antes del turno</p>
                </div>
              </div>

              {/* Footer con fecha de emisión */}
              <div className="text-center pt-4 border-t border-green-200">
                <p className="text-xs text-slate-500">
                  Ticket generado el{" "}
                  {format(
                    currentTurnTicket.reservedAt,
                    "dd/MM/yyyy 'a las' HH:mm",
                    { locale: es },
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Conserva este ticket como comprobante de tu turno
                </p>
              </div>
            </div>
          )}

          {/* Botones de acci��n */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleTurnTicketScreenshot}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capturar Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowTurnTicket(false);
                setCurrentStep(0);
                setIsTurnosModalOpen(false);
              }}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
