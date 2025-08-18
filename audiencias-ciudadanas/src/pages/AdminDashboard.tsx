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
              <p className="text-white font-black text-2xl">{mockAdminData.stats.totalAudiences}</p>
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
              <p className="text-white font-black text-2xl">{mockAdminData.stats.pendingAudiences}</p>
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
              <p className="text-white font-black text-2xl">{mockAdminData.stats.todayAudiences}</p>
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
              <p className="text-white font-black text-2xl">{mockAdminData.stats.completedThisMonth}</p>
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

        {/* Panel principal simplificado para la demo */}
        <Card className="bg-white rounded-xl shadow-xl border-0">
          <CardHeader className="bg-[#0052CC] text-white">
            <CardTitle className="text-xl font-bold">
              🏛️ Panel Administrativo Municipal
            </CardTitle>
            <CardDescription className="text-white/90">
              Sistema de gestión y control de audiencias ciudadanas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#0052CC] rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Panel Administrativo Funcionando
              </h3>
              <p className="text-gray-600 mb-6">
                El sistema de administración está operativo y listo para gestionar las audiencias municipales.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <MessageSquare className="w-8 h-8 text-[#0052CC] mx-auto mb-2" />
                  <h4 className="font-semibold">Audiencias</h4>
                  <p className="text-sm text-gray-600">Gestión completa</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Users className="w-8 h-8 text-[#0052CC] mx-auto mb-2" />
                  <h4 className="font-semibold">Ciudadanos</h4>
                  <p className="text-sm text-gray-600">Control de usuarios</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-[#0052CC] mx-auto mb-2" />
                  <h4 className="font-semibold">Reportes</h4>
                  <p className="text-sm text-gray-600">Estadísticas detalladas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
