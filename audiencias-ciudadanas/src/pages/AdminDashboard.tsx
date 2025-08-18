import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "../hooks/use-toast";
import {
  Building2,
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Search,
  Filter,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  TrendingUp,
  Activity,
  UserPlus,
  CalendarDays,
  Wrench,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  getUpcomingPublicAudienceDates,
  formatPublicAudienceDate,
  generateTimeSlots,
  PublicAudienceDate,
  TimeSlot,
} from "@/lib/friday-utils";

// Mock data - En producción vendría de la API compartida
const mockAdminData = {
  stats: {
    totalAudiences: 127,
    pendingAudiences: 23,
    todayAudiences: 8,
    completedThisMonth: 89,
    avgResponseTime: "2.3 días",
    satisfactionRate: "94%",
  },
  citizens: [
    {
      id: "CIT-001",
      name: "María González",
      phone: "55 1234 5678",
      email: "maria.gonzalez@email.com",
      address: "Calle Principal 123, Col. Centro",
      registrationDate: new Date("2024-01-15"),
      totalRequests: 3,
      status: "activo",
      expediente: {
        requests: [
          {
            id: "AUD-123456",
            date: new Date("2024-01-25"),
            category: "especie",
            type: "Alimentos",
            status: "completada",
            result: "Apoyó otorgado - 2 despensas familiares entregadas",
            assignedTo: "C. Rodríguez",
          },
        ],
        notes: "Familia de 5 personas. Situación económica vulnerable.",
      },
    },
    {
      id: "CIT-002",
      name: "Carlos Rodríguez",
      phone: "55 9876 5432",
      email: "carlos.rodriguez@email.com",
      address: "Av. Reforma 456, Col. Norte",
      registrationDate: new Date("2024-01-10"),
      totalRequests: 2,
      status: "activo",
      expediente: {
        requests: [
          {
            id: "AUD-789012",
            date: new Date("2024-01-23"),
            category: "servicio",
            type: "Servicios sociales",
            status: "en_proceso",
            result: "En evaluación médica",
            assignedTo: "Dr. Martínez",
          },
        ],
        notes: "Requiere apoyo médico urgente.",
      },
    },
  ],
  staff: [
    {
      id: "STAFF-001",
      name: "Dr. Martínez",
      role: "Servicios Médicos",
      department: "Salud",
      email: "dr.martinez@municipio.gob.mx",
      phone: "55 1111 2222",
      activeAssignments: 12,
      status: "activo",
    },
    {
      id: "STAFF-002",
      name: "Ing. López",
      role: "Trámites y Licencias",
      department: "Obras Públicas",
      email: "ing.lopez@municipio.gob.mx",
      phone: "55 3333 4444",
      activeAssignments: 8,
      status: "activo",
    },
    {
      id: "STAFF-003",
      name: "Lic. García",
      role: "Asuntos Sociales",
      department: "Desarrollo Social",
      email: "lic.garcia@municipio.gob.mx",
      phone: "55 5555 6666",
      activeAssignments: 15,
      status: "activo",
    },
    {
      id: "STAFF-004",
      name: "C. Rodríguez",
      role: "Ayuda en Especie",
      department: "Desarrollo Social",
      email: "c.rodriguez@municipio.gob.mx",
      phone: "55 7777 8888",
      activeAssignments: 20,
      status: "activo",
    },
  ],
  audienceTypes: [
    {
      id: "AT-001",
      category: "especie",
      name: "Alimentos",
      description: "Despensas y productos alimentarios",
      active: true,
    },
    {
      id: "AT-002",
      category: "especie",
      name: "Medicamentos",
      description: "Apoyo con medicamentos básicos",
      active: true,
    },
    {
      id: "AT-003",
      category: "servicio",
      name: "Servicios médicos",
      description: "Consultas y tratamientos médicos",
      active: true,
    },
    {
      id: "AT-004",
      category: "servicio",
      name: "Servicios sociales",
      description: "Apoyo psicológico y social",
      active: true,
    },
    {
      id: "AT-005",
      category: "tramites",
      name: "Licencias",
      description: "Permisos y licencias municipales",
      active: true,
    },
    {
      id: "AT-006",
      category: "invitacion",
      name: "Evento público",
      description: "Invitaciones a eventos oficiales",
      active: true,
    },
  ],
  recentAudiences: [
    {
      id: "AUD-123456",
      citizen: "María González",
      phone: "55 1234 5678",
      category: "especie",
      type: "Alimentos",
      description: "Solicitud de apoyo alimentario para familia de 5 personas",
      status: "pendiente",
      priority: "alta",
      requestDate: new Date("2024-01-25"),
      assignedTo: null,
      daysWaiting: 2,
    },
    {
      id: "AUD-789012",
      citizen: "Carlos Rodríguez",
      phone: "55 9876 5432",
      category: "servicio",
      type: "Servicios sociales",
      description: "Solicitud de apoyo para cirugía de emergencia",
      status: "en_proceso",
      priority: "urgente",
      requestDate: new Date("2024-01-23"),
      assignedTo: "Dr. Martínez - Servicios Médicos",
      assignedDate: new Date("2024-01-24"),
      daysWaiting: 4,
    },
    {
      id: "AUD-345678",
      citizen: "Ana Jiménez",
      phone: "55 5555 7777",
      category: "tramites",
      type: "Licencias",
      description: "Permiso para construcción de rampa de acceso",
      status: "completada",
      priority: "media",
      requestDate: new Date("2024-01-20"),
      assignedTo: "Ing. López - Obras Públicas",
      completedBy: "Ing. López - Obras Públicas",
      completedDate: new Date("2024-01-27"),
      daysWaiting: 0,
    },
    {
      id: "AUD-567890",
      citizen: "Roberto Morales",
      phone: "55 3333 9999",
      category: "invitacion",
      type: "Evento público",
      description: "Invitación para ceremonia de reconocimiento",
      status: "en_proceso",
      priority: "baja",
      requestDate: new Date("2024-01-24"),
      assignedTo: "Lic. García - Desarrollo Social",
      assignedDate: new Date("2024-01-26"),
      daysWaiting: 3,
    },
  ],
};

const CATEGORY_CONFIG = {
  especie: { name: "Ayuda en Especie", color: "bg-orange-100 text-orange-800" },
  servicio: { name: "Servicios", color: "bg-blue-100 text-blue-800" },
  invitacion: { name: "Invitaciones", color: "bg-green-100 text-green-800" },
  tramites: { name: "Trámites", color: "bg-purple-100 text-purple-800" },
};

const STATUS_CONFIG = {
  pendiente: {
    name: "Pendiente",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  en_proceso: {
    name: "En Proceso",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  completada: {
    name: "Completada",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  rechazada: {
    name: "Rechazada",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const PRIORITY_CONFIG = {
  urgente: { name: "Urgente", color: "bg-red-100 text-red-800" },
  alta: { name: "Alta", color: "bg-orange-100 text-orange-800" },
  media: { name: "Media", color: "bg-yellow-100 text-yellow-800" },
  baja: { name: "Baja", color: "bg-gray-100 text-gray-800" },
};

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [selectedAudience, setSelectedAudience] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [audiences, setAudiences] = useState(mockAdminData.recentAudiences);
  const [activeTab, setActiveTab] = useState(() => {
    // Verificar si se especifica una pestaña en la URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("tab") || "audiencias";
  });

  // Estados para gestión de datos administrativos
  const [citizens, setCitizens] = useState(mockAdminData.citizens);
  const [staff, setStaff] = useState(mockAdminData.staff);
  const [audienceTypes, setAudienceTypes] = useState(
    mockAdminData.audienceTypes,
  );

  // Estados para modales de administración
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);
  const [isExpedienteOpen, setIsExpedienteOpen] = useState(false);
  const [isEditCitizenOpen, setIsEditCitizenOpen] = useState(false);
  const [isEditStaffOpen, setIsEditStaffOpen] = useState(false);
  const [isEditTypeOpen, setIsEditTypeOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>(null);

  // Búsquedas específicas
  const [citizenSearch, setCitizenSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  // Estados para gestión de turnos de viernes
  const [publicAudienceDates, setPublicAudienceDates] = useState<
    PublicAudienceDate[]
  >([]);
  const [selectedManageDate, setSelectedManageDate] =
    useState<PublicAudienceDate | null>(null);
  const [manageDateSlots, setManageDateSlots] = useState<TimeSlot[]>([]);

  // Estados para monitor de turnos
  const [showTurnMonitor, setShowTurnMonitor] = useState(false);
  const [currentTurnActive, setCurrentTurnActive] = useState<any>(null);
  const [nextTurns, setNextTurns] = useState<any[]>([]);
  const [turnQueue, setTurnQueue] = useState<any[]>([]);
  const [monitorDate, setMonitorDate] = useState<Date>(new Date());

  // Estados para el modal de gestión
  const [actionType, setActionType] = useState("");
  const [response, setResponse] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [meetingFormat, setMeetingFormat] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación de administrador
    const adminData = localStorage.getItem("adminUser");
    if (!adminData) {
      navigate("/login");
      return;
    }

    const parsedAdmin = JSON.parse(adminData);
    if (!parsedAdmin.authenticated || parsedAdmin.role !== "admin") {
      navigate("/login");
      return;
    }

    setUser(parsedAdmin);

    // Inicializar fechas de audiencias públicas
    const upcomingDates = getUpcomingPublicAudienceDates();
    setPublicAudienceDates(upcomingDates);

    // Inicializar monitor de turnos para hoy si es viernes
    initializeTurnMonitor();
  }, [navigate]);

  const initializeTurnMonitor = () => {
    const today = new Date();
    const isTodayFriday = today.getDay() === 5; // 5 = Friday

    if (isTodayFriday) {
      // Cargar turnos del día actual
      loadTodayTurns();
    }
  };

  const loadTodayTurns = () => {
    const today = new Date();
    const dateKey = format(today, "yyyy-MM-dd");
    const savedTurnos = localStorage.getItem("publicAudienceTurnos");
    const allTurnos = savedTurnos ? JSON.parse(savedTurnos) : {};
    const todayTurnos = allTurnos[dateKey] || {};

    // Convertir a array y ordenar por hora
    const turnsArray = Object.entries(todayTurnos)
      .map(([slotId, turnData]: [string, any]) => ({
        slotId,
        time: slotId.replace("slot-", "").replace(/(\d{2})(\d{2})/, "$1:$2"),
        ...turnData,
        status: "pendiente", // pendiente, activo, completado
      }))
      .sort((a, b) => a.time.localeCompare(b.time));

    setTurnQueue(turnsArray);
    setMonitorDate(today);

    // Establecer el primer turno pendiente como siguiente
    const nextPending = turnsArray.find((turn) => turn.status === "pendiente");
    if (nextPending) {
      setNextTurns([
        nextPending,
        ...turnsArray
          .filter((t) => t !== nextPending && t.status === "pendiente")
          .slice(0, 2),
      ]);
    }
  };

  const callNextTurn = () => {
    if (nextTurns.length === 0) return;

    const nextTurn = nextTurns[0];
    setCurrentTurnActive(nextTurn);

    // Actualizar estado en la cola
    const updatedQueue = turnQueue.map((turn) =>
      turn.slotId === nextTurn.slotId ? { ...turn, status: "activo" } : turn,
    );
    setTurnQueue(updatedQueue);

    // Actualizar lista de próximos turnos
    const remainingTurns = updatedQueue.filter((t) => t.status === "pendiente");
    setNextTurns(remainingTurns.slice(0, 3));
  };

  const completeTurn = () => {
    if (!currentTurnActive) return;

    // Actualizar estado en la cola
    const updatedQueue = turnQueue.map((turn) =>
      turn.slotId === currentTurnActive.slotId
        ? { ...turn, status: "completado" }
        : turn,
    );
    setTurnQueue(updatedQueue);

    setCurrentTurnActive(null);

    // Actualizar lista de próximos turnos
    const remainingTurns = updatedQueue.filter((t) => t.status === "pendiente");
    setNextTurns(remainingTurns.slice(0, 3));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  const handleViewDetails = (audience: any) => {
    setSelectedAudience(audience);
    setIsDetailsOpen(true);
  };

  const handleManage = (audience: any) => {
    setSelectedAudience(audience);
    setIsManageOpen(true);
    // Limpiar formulario
    setActionType("");
    setResponse("");
    setAssignedTo(audience.assignedTo || "");
    setScheduledDate("");
    setScheduledTime("");
    setMeetingFormat("");
    setPriority(audience.priority);
    setNotes("");
  };

  const handleSaveAction = () => {
    if (!actionType) {
      toast({
        title: "Error",
        description: "Selecciona una acción a realizar",
        variant: "destructive",
      });
      return;
    }

    // Validaciones específicas
    if (actionType === "responder" && !response.trim()) {
      toast({
        title: "Error",
        description: "Escribe una respuesta para el ciudadano",
        variant: "destructive",
      });
      return;
    }

    if (actionType === "programar" && (!scheduledDate || !scheduledTime)) {
      toast({
        title: "Error",
        description: "Selecciona fecha y hora para la audiencia",
        variant: "destructive",
      });
      return;
    }

    // Actualizar audiencia
    const updatedAudiences = audiences.map((aud) => {
      if (aud.id === selectedAudience.id) {
        let newStatus = aud.status;

        switch (actionType) {
          case "aprobar":
            newStatus = "en_proceso";
            break;
          case "rechazar":
            newStatus = "rechazada";
            break;
          case "programar":
            newStatus = "en_proceso";
            break;
          case "completar":
            newStatus = "completada";
            break;
        }

        return {
          ...aud,
          status: newStatus,
          assignedTo: assignedTo || aud.assignedTo,
          priority: priority || aud.priority,
          scheduledDate: scheduledDate
            ? new Date(scheduledDate + " " + scheduledTime)
            : aud.scheduledDate,
          lastResponse: response || aud.lastResponse,
          notes: notes || aud.notes,
          lastUpdate: new Date(),
        };
      }
      return aud;
    });

    setAudiences(updatedAudiences);

    // Mostrar mensaje de éxito
    const actionMessages = {
      aprobar: "Audiencia aprobada exitosamente",
      rechazar: "Audiencia rechazada",
      responder: "Respuesta enviada al ciudadano",
      programar: "Audiencia programada exitosamente",
      asignar: "Responsable asignado correctamente",
      completar: "Audiencia marcada como completada",
    };

    toast({
      title: "Acción realizada",
      description:
        actionMessages[actionType as keyof typeof actionMessages] ||
        "Acción completada",
    });

    setIsManageOpen(false);
  };

  const filteredAudiences = audiences.filter((audience) => {
    const matchesSearch =
      audience.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audience.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audience.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || audience.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || audience.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Estilo Telmex */}
      <header className="bg-[#0052CC] border-b-4 border-[#DC2626] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-xl">
              <Building2 className="w-8 h-8 text-[#0052CC]" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                🏛️ PANEL ADMINISTRATIVO
              </h1>
              <p className="text-sm text-white/90 flex items-center gap-2 font-medium">
                <Settings className="w-4 h-4" />
                SISTEMA DE AUDIENCIAS MUNICIPALES • CONTROL TOTAL
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-white/90 font-medium">Bienvenido</p>
              <p className="text-lg font-bold text-white">{user.name}</p>
            </div>
            <Button
              onClick={() => navigate("/")}
              className="bg-white text-[#0052CC] hover:bg-gray-100 font-bold px-6 py-2 rounded-lg shadow-lg border-2 border-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              VOLVER AL INICIO
            </Button>
            <Button
              onClick={() => setActiveTab("configuracion")}
              className="bg-[#DC2626] text-white hover:bg-red-700 font-bold px-6 py-2 rounded-lg shadow-lg"
            >
              <Wrench className="w-4 h-4 mr-2" />
              CONFIGURACIÓN
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-white text-[#DC2626] hover:bg-gray-100 font-bold px-6 py-2 rounded-lg shadow-lg border-2 border-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              CERRAR SESIÓN
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards - Estilo Telmex */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white rounded-xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Header azul estilo Telmex */}
            <div className="bg-[#0052CC] p-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-[#0052CC]" />
              </div>
              <p className="text-white font-bold text-sm">TOTAL</p>
              <p className="text-white font-black text-2xl">
                {mockAdminData.stats.totalAudiences}
              </p>
              <p className="text-white/90 font-medium text-xs">Audiencias</p>
            </div>
            {/* Contenido blanco */}
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center text-sm text-green-600 font-bold">
                <ArrowUp className="w-4 h-4 mr-1" />
                +12% este mes
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Header azul estilo Telmex */}
            <div className="bg-[#0052CC] p-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-[#0052CC]" />
              </div>
              <p className="text-white font-bold text-sm">PENDIENTES</p>
              <p className="text-white font-black text-2xl">
                {mockAdminData.stats.pendingAudiences}
              </p>
              <p className="text-white/90 font-medium text-xs">Audiencias</p>
            </div>
            {/* Sección roja para alerta */}
            <div className="bg-[#DC2626] p-2 text-center">
              <p className="text-white font-bold text-sm flex items-center justify-center">
                <ArrowUp className="w-4 h-4 mr-1" />
                +3 desde ayer
              </p>
            </div>
          </Card>

          <Card className="bg-white rounded-xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Header azul estilo Telmex */}
            <div className="bg-[#0052CC] p-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-[#0052CC]" />
              </div>
              <p className="text-white font-bold text-sm">HOY</p>
              <p className="text-white font-black text-2xl">
                {mockAdminData.stats.todayAudiences}
              </p>
              <p className="text-white/90 font-medium text-xs">Audiencias</p>
            </div>
            {/* Contenido blanco */}
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center text-sm text-gray-600 font-bold">
                <Activity className="w-4 h-4 mr-1" />
                Programadas
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Header azul estilo Telmex */}
            <div className="bg-[#0052CC] p-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-[#0052CC]" />
              </div>
              <p className="text-white font-bold text-sm">COMPLETADAS</p>
              <p className="text-white font-black text-2xl">
                {mockAdminData.stats.completedThisMonth}
              </p>
              <p className="text-white/90 font-medium text-xs">Este mes</p>
            </div>
            {/* Contenido blanco */}
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center text-sm text-green-600 font-bold">
                <TrendingUp className="w-4 h-4 mr-1" />
                Crecimiento
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="bg-white rounded-2xl border-4 border-[#0052CC] shadow-2xl p-6 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#0052CC] mb-2">
                🏛️ PANEL DE CONTROL ADMINISTRATIVO
              </h3>
              <p className="text-gray-600 text-sm">
                Selecciona una sección para gestionar el sistema
              </p>
            </div>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 h-auto p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
            <TabsTrigger
              value="audiencias"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-[#0052CC] data-[state=active]:text-white data-[state=active]:border-[#0052CC] data-[state=active]:shadow-xl hover:bg-gray-50 hover:border-[#0052CC] hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-100 group-data-[state=active]:bg-white flex items-center justify-center transition-all duration-300 shadow-sm">
                  <MessageSquare className="w-5 h-5 text-[#0052CC] group-data-[state=active]:text-[#0052CC] transition-all" />
                </div>
                {audiences.filter((a) => a.status === "pendiente").length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                    {audiences.filter((a) => a.status === "pendiente").length}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-gray-700 text-center">
                AUDIENCIAS
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="ciudadanos"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:border-purple-300 data-[state=active]:shadow-xl hover:bg-purple-50 hover:border-purple-200 hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-purple-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <Users className="w-5 h-5 text-purple-600 group-data-[state=active]:text-white transition-all" />
                </div>
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                  {citizens.length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700 text-center">
                👥 Ciudadanos
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="expedientes"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:border-amber-300 data-[state=active]:shadow-xl hover:bg-amber-50 hover:border-amber-200 hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <FileText className="w-5 h-5 text-amber-600 group-data-[state=active]:text-white transition-all" />
                </div>
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                  {citizens.reduce((total, citizen) => total + citizen.expediente.requests.length, 0)}
                </span>
              </div>
              <span className="text-xs font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                📁 Expedientes
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="personal"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:border-indigo-300 data-[state=active]:shadow-xl hover:bg-indigo-50 hover:border-indigo-200 hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <UserPlus className="w-5 h-5 text-indigo-600 group-data-[state=active]:text-white transition-all" />
                </div>
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                  {staff.filter((s) => s.status === "activo").length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700 text-center">
                👨‍💼 Personal
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="configuracion"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:border-emerald-300 data-[state=active]:shadow-xl hover:bg-emerald-50 hover:border-emerald-200 hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <Wrench className="w-5 h-5 text-emerald-600 group-data-[state=active]:text-white transition-all" />
                </div>
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                  {audienceTypes.filter((t) => t.active).length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700 text-center">
                ⚙️ Configuración
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="turnos"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:border-green-300 data-[state=active]:shadow-xl hover:bg-green-50 hover:border-green-200 hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-green-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <Clock className="w-5 h-5 text-green-600 group-data-[state=active]:text-white transition-all" />
                </div>
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                  {publicAudienceDates.length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700 text-center">
                🕐 Turnos
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="reportes"
              className="flex flex-col items-center gap-2 min-h-[80px] px-4 py-3 rounded-xl border-2 border-gray-200 data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:border-rose-300 data-[state=active]:shadow-xl hover:bg-rose-50 hover:border-rose-200 hover:scale-105 transition-all duration-300 group bg-white shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-rose-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300 shadow-sm">
                  <BarChart3 className="w-5 h-5 text-rose-600 group-data-[state=active]:text-white transition-all" />
                </div>
                <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg border border-white">
                  ✓
                </div>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700 text-center">
                📊 Reportes
              </span>
            </TabsTrigger>
          </TabsList>
          </div>

          {/* Gestión de Audiencias */}
          <TabsContent value="audiencias">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#0052CC]">
                      📋 Gestión de Audiencias
                    </CardTitle>
                    <CardDescription>
                      Administra las solicitudes de audiencia de los ciudadanos
                    </CardDescription>
                  </div>
                  <Button className="bg-[#DC2626] hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Audiencia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Resumen de Gestión */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <h3 className="font-bold text-yellow-800">
                        {audiences.filter((a) => a.status === "pendiente").length}
                      </h3>
                      <p className="text-sm text-yellow-700">Pendientes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-bold text-blue-800">
                        {audiences.filter((a) => a.status === "en_proceso").length}
                      </h3>
                      <p className="text-sm text-blue-700">En Proceso</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-bold text-green-800">
                        {audiences.filter((a) => a.status === "completada").length}
                      </h3>
                      <p className="text-sm text-green-700">Completadas</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-4 text-center">
                      <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <h3 className="font-bold text-red-800">
                        {audiences.filter((a) => a.status === "rechazada").length}
                      </h3>
                      <p className="text-sm text-red-700">Rechazadas</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar por ciudadano, ID o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pendiente">Pendientes</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="completada">Completadas</SelectItem>
                      <SelectItem value="rechazada">Rechazadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lista de Audiencias */}
                <div className="space-y-4">
                  {filteredAudiences.slice(0, 5).map((audience) => (
                    <Card key={audience.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                          <div className="lg:col-span-6">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-[#0052CC] text-white font-bold">
                                {audience.id}
                              </Badge>
                              <Badge className={PRIORITY_CONFIG[audience.priority as keyof typeof PRIORITY_CONFIG].color}>
                                {PRIORITY_CONFIG[audience.priority as keyof typeof PRIORITY_CONFIG].name}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-lg text-slate-800">
                              {audience.citizen}
                            </h4>
                            <p className="text-sm text-slate-600">{audience.phone}</p>
                            <p className="text-sm text-slate-700 mt-2">{audience.description}</p>
                          </div>

                          <div className="lg:col-span-3">
                            <Badge className={STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].color}>
                              {STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].name}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-1">
                              {format(audience.requestDate, "dd/MM/yyyy", { locale: es })}
                            </p>
                          </div>

                          <div className="lg:col-span-3 flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewDetails(audience)}>
                              <Eye className="w-4 h-4 mr-1" />
                              Ver
                            </Button>
                            <Button size="sm" className="bg-[#0052CC] hover:bg-blue-700" onClick={() => handleManage(audience)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Gestionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredAudiences.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">
                      No se encontraron audiencias
                    </h3>
                    <p className="text-slate-500">
                      Ajusta los filtros para ver más resultados
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestión de Ciudadanos */}
          <TabsContent value="ciudadanos">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#0052CC]">
                      👥 Gestión de Ciudadanos
                    </CardTitle>
                    <CardDescription>
                      Base de datos de usuarios registrados en el sistema
                    </CardDescription>
                  </div>
                  <Button className="bg-[#DC2626] hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Ciudadano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Estadísticas de Ciudadanos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-bold text-purple-800 text-xl">{citizens.length}</h3>
                      <p className="text-sm text-purple-700">Total Ciudadanos</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <UserPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-bold text-green-800 text-xl">
                        {citizens.filter(c => c.status === "activo").length}
                      </h3>
                      <p className="text-sm text-green-700">Activos</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-bold text-blue-800 text-xl">
                        {citizens.reduce((total, citizen) => total + citizen.totalRequests, 0)}
                      </h3>
                      <p className="text-sm text-blue-700">Total Solicitudes</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Búsqueda */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre, teléfono o email..."
                      value={citizenSearch}
                      onChange={(e) => setCitizenSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Lista de Ciudadanos */}
                <div className="space-y-4">
                  {citizens
                    .filter(
                      (citizen) =>
                        citizen.name.toLowerCase().includes(citizenSearch.toLowerCase()) ||
                        citizen.phone.includes(citizenSearch) ||
                        citizen.email.toLowerCase().includes(citizenSearch.toLowerCase()),
                    )
                    .map((citizen) => (
                      <Card key={citizen.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            <div className="lg:col-span-6">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-slate-800">
                                    {citizen.name}
                                  </h4>
                                  <p className="text-sm text-slate-600">{citizen.id}</p>
                                </div>
                              </div>
                              <div className="text-sm text-slate-600 space-y-1">
                                <p>📞 {citizen.phone}</p>
                                <p>📧 {citizen.email}</p>
                                <p>📍 {citizen.address}</p>
                              </div>
                            </div>

                            <div className="lg:col-span-3">
                              <Badge className={citizen.status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {citizen.status}
                              </Badge>
                              <p className="text-xs text-slate-500 mt-1">
                                Registro: {format(citizen.registrationDate, "dd/MM/yyyy", { locale: es })}
                              </p>
                              <p className="text-xs text-slate-500">
                                Solicitudes: {citizen.totalRequests}
                              </p>
                            </div>

                            <div className="lg:col-span-3 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCitizen(citizen);
                                  setIsExpedienteOpen(true);
                                }}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Expediente
                              </Button>
                              <Button
                                size="sm"
                                className="bg-[#0052CC] hover:bg-blue-700"
                                onClick={() => {
                                  setSelectedCitizen(citizen);
                                  setIsEditCitizenOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Editar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expedientes */}
          <TabsContent value="expedientes">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#0052CC]">
                  📁 Expedientes de Ciudadanos
                </CardTitle>
                <CardDescription>
                  Historial completo de solicitudes y resultados por ciudadano
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Estadísticas de Expedientes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                      <h3 className="font-bold text-amber-800 text-xl">
                        {citizens.reduce((total, citizen) => total + citizen.expediente.requests.length, 0)}
                      </h3>
                      <p className="text-sm text-amber-700">Total Expedientes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-bold text-green-800 text-xl">
                        {citizens.reduce((total, citizen) =>
                          total + citizen.expediente.requests.filter(r => r.status === "completada").length, 0)}
                      </h3>
                      <p className="text-sm text-green-700">Completados</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-bold text-blue-800 text-xl">
                        {citizens.reduce((total, citizen) =>
                          total + citizen.expediente.requests.filter(r => r.status === "en_proceso").length, 0)}
                      </h3>
                      <p className="text-sm text-blue-700">En Proceso</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-bold text-purple-800 text-xl">{citizens.length}</h3>
                      <p className="text-sm text-purple-700">Ciudadanos con Expediente</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Lista de Expedientes por Ciudadano */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {citizens.map((citizen) => (
                    <Card
                      key={citizen.id}
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#0052CC]"
                      onClick={() => {
                        setSelectedCitizen(citizen);
                        setIsExpedienteOpen(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                              <FileText className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800">{citizen.name}</h4>
                              <p className="text-sm text-slate-600">{citizen.id}</p>
                            </div>
                          </div>
                          <Badge className="bg-amber-100 text-amber-800">
                            {citizen.expediente.requests.length} solicitudes
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-slate-600">📞 {citizen.phone}</p>
                          <p className="text-xs text-slate-500">
                            Registro: {format(citizen.registrationDate, "dd/MM/yyyy", { locale: es })}
                          </p>
                        </div>

                        {/* Últimas solicitudes */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-slate-700">Últimas solicitudes:</h5>
                          {citizen.expediente.requests.slice(0, 2).map((request, idx) => (
                            <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{request.type}</span>
                                <Badge className={STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG].color}>
                                  {STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG].name}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mt-1">
                                {format(request.date, "dd/MM/yyyy", { locale: es })}
                              </p>
                            </div>
                          ))}
                        </div>

                        <Button size="sm" className="w-full mt-3 bg-[#0052CC] hover:bg-blue-700">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Expediente Completo
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personal */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#0052CC]">
                      👨‍💼 Personal de Apoyo
                    </CardTitle>
                    <CardDescription>
                      Gestiona el personal para asignación de audiencias
                    </CardDescription>
                  </div>
                  <Button className="bg-[#DC2626] hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Personal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Estadísticas de Personal */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
                    <CardContent className="p-4 text-center">
                      <UserPlus className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                      <h3 className="font-bold text-indigo-800 text-xl">{staff.length}</h3>
                      <p className="text-sm text-indigo-700">Total Personal</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-bold text-green-800 text-xl">
                        {staff.filter(s => s.status === "activo").length}
                      </h3>
                      <p className="text-sm text-green-700">Activos</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-bold text-blue-800 text-xl">
                        {staff.reduce((total, member) => total + member.activeAssignments, 0)}
                      </h3>
                      <p className="text-sm text-blue-700">Asignaciones Activas</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <Building2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-bold text-purple-800 text-xl">
                        {new Set(staff.map(s => s.department)).size}
                      </h3>
                      <p className="text-sm text-purple-700">Departamentos</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Búsqueda */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre, rol o departamento..."
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Lista de Personal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff
                    .filter(
                      (member) =>
                        member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        member.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        member.department.toLowerCase().includes(staffSearch.toLowerCase()),
                    )
                    .map((member) => (
                      <Card key={member.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <UserPlus className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800">{member.name}</h4>
                                <p className="text-sm text-slate-600">{member.role}</p>
                                <p className="text-xs text-slate-500">{member.department}</p>
                              </div>
                            </div>
                            <Badge className={member.status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {member.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              <span>{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-4 h-4" />
                              <span>{member.phone}</span>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-slate-700">
                                Asignaciones Activas
                              </span>
                              <Badge className="bg-blue-100 text-blue-800">
                                {member.activeAssignments}
                              </Badge>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="w-full bg-[#0052CC] hover:bg-blue-700"
                            onClick={() => {
                              setSelectedStaff(member);
                              setIsEditStaffOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Personal
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración */}
          <TabsContent value="configuracion">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>
                  Administra las configuraciones y tipos de audiencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Panel de Configuración
                  </h3>
                  <p className="text-slate-500">
                    Configura tipos de audiencia, categorías y parámetros del sistema.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Turnos */}
          <TabsContent value="turnos">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Turnos - Viernes</CardTitle>
                <CardDescription>
                  Administra los turnos para audiencias públicas de los viernes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Sistema de Turnos
                  </h3>
                  <p className="text-slate-500">
                    Gestiona las citas y turnos para las audiencias públicas de los viernes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reportes */}
          <TabsContent value="reportes">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Estadísticas</CardTitle>
                <CardDescription>
                  Analiza el rendimiento y estadísticas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    Centro de Reportes
                  </h3>
                  <p className="text-slate-500">
                    Genera reportes detallados y estadísticas del sistema de audiencias.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
