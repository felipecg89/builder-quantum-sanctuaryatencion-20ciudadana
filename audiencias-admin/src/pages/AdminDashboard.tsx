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
      assignedTo: "Ing. López",
      daysWaiting: 0,
    },
    {
      id: "AUD-567890",
      citizen: "Roberto Morales",
      phone: "55 3333 9999",
      category: "invitacion",
      type: "Evento público",
      description: "Invitaci��n para ceremonia de reconocimiento",
      status: "pendiente",
      priority: "baja",
      requestDate: new Date("2024-01-24"),
      assignedTo: null,
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
      navigate("/admin/login");
      return;
    }

    const parsedAdmin = JSON.parse(adminData);
    if (!parsedAdmin.authenticated || parsedAdmin.role !== "admin") {
      navigate("/admin/login");
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
    navigate("/admin/login");
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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-b border-blue-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                🏛️ Panel Administrativo
              </h1>
              <p className="text-sm text-blue-100 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Sistema de Audiencias Municipales • Control Total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              Bienvenido, {user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("configuracion")}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    📋 Total Audiencias
                  </p>
                  <p className="text-3xl font-bold text-blue-800">
                    {mockAdminData.stats.totalAudiences}
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-green-600 font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                +12% este mes
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    ⏰ Pendientes
                  </p>
                  <p className="text-3xl font-bold text-orange-800">
                    {mockAdminData.stats.pendingAudiences}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-red-600 font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                +3 desde ayer
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">📅 Hoy</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {mockAdminData.stats.todayAudiences}
                  </p>
                </div>
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-purple-600 font-medium">
                <Activity className="w-4 h-4 mr-1" />
                Programadas
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    ✅ Completadas
                  </p>
                  <p className="text-3xl font-bold text-green-800">
                    {mockAdminData.stats.completedThisMonth}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                Este mes
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="admin-tabs-list grid w-full grid-cols-4 lg:grid-cols-7 gap-3 min-h-[120px] pt-8 pb-6 px-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-200/50 shadow-lg overflow-visible">
            <TabsTrigger
              value="audiencias"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-300 data-[state=active]:shadow-xl hover:bg-blue-50/80 hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <MessageSquare className="w-5 h-5 text-blue-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110" />
                </div>
                {audiences.filter((a) => a.status === "pendiente").length >
                  0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                    {audiences.filter((a) => a.status === "pendiente").length}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                📋 Audiencias
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="ciudadanos"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:border-purple-300 data-[state=active]:shadow-xl hover:bg-purple-50/80 hover:border-purple-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-purple-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <Users className="w-5 h-5 text-purple-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute top-0 right-0 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  {citizens.length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                👥 Ciudadanos
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="expedientes"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:border-amber-300 data-[state=active]:shadow-xl hover:bg-amber-50/80 hover:border-amber-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <FileText className="w-5 h-5 text-amber-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  {citizens.reduce(
                    (total, citizen) =>
                      total + citizen.expediente.requests.length,
                    0,
                  )}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                📁 Expedientes
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-300 data-[state=active]:shadow-xl hover:bg-indigo-50/80 hover:border-indigo-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <UserPlus className="w-5 h-5 text-indigo-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute top-0 right-0 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  {staff.filter((s) => s.status === "activo").length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                👨‍💼 Personal
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="configuracion"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:border-emerald-300 data-[state=active]:shadow-xl hover:bg-emerald-50/80 hover:border-emerald-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group bg-emerald-50/50 border-emerald-200 ring-2 ring-emerald-100"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <Wrench className="w-5 h-5 text-emerald-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110 group-hover:rotate-12" />
                </div>
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  {audienceTypes.filter((t) => t.active).length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                ⚙️ Configuraci��n
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="turnos"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:border-green-300 data-[state=active]:shadow-xl hover:bg-green-50/80 hover:border-green-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-green-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <Clock className="w-5 h-5 text-green-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110" />
                </div>
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  {publicAudienceDates.length}
                </span>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                🕐 Turnos
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="reportes"
              className="admin-tab-trigger flex flex-col items-center gap-2 h-18 px-3 py-2 mx-1 my-1 rounded-xl border-2 border-transparent data-[state=active]:bg-gradient-to-br data-[state=active]:from-rose-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:border-rose-300 data-[state=active]:shadow-xl hover:bg-rose-50/80 hover:border-rose-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-rose-100 group-data-[state=active]:bg-white/20 flex items-center justify-center transition-all duration-300">
                  <BarChart3 className="w-5 h-5 text-rose-600 group-data-[state=active]:text-white transition-transform group-hover:scale-110" />
                </div>
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  ✓
                </div>
              </div>
              <span className="text-sm font-bold tracking-wide group-data-[state=active]:text-white text-slate-700">
                📊 Reportes
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Gestión de Audiencias */}
          <TabsContent value="audiencias">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Audiencias</CardTitle>
                    <CardDescription>
                      Administra las solicitudes de audiencia de los ciudadanos
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Audiencia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
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
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      <SelectItem value="especie">Ayuda en Especie</SelectItem>
                      <SelectItem value="servicio">Servicios</SelectItem>
                      <SelectItem value="invitacion">Invitaciones</SelectItem>
                      <SelectItem value="tramites">Trámites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Lista de Audiencias */}
                <div className="space-y-4">
                  {filteredAudiences.map((audience) => (
                    <Card
                      key={audience.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                          {/* Info Principal */}
                          <div className="lg:col-span-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-slate-800">
                                  {audience.id}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {audience.citizen}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {audience.phone}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={
                                    PRIORITY_CONFIG[
                                      audience.priority as keyof typeof PRIORITY_CONFIG
                                    ].color
                                  }
                                >
                                  {
                                    PRIORITY_CONFIG[
                                      audience.priority as keyof typeof PRIORITY_CONFIG
                                    ].name
                                  }
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    CATEGORY_CONFIG[
                                      audience.category as keyof typeof CATEGORY_CONFIG
                                    ].color
                                  }
                                >
                                  {
                                    CATEGORY_CONFIG[
                                      audience.category as keyof typeof CATEGORY_CONFIG
                                    ].name
                                  }
                                </Badge>
                                <span className="text-sm text-slate-600">
                                  • {audience.type}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700">
                                {audience.description}
                              </p>
                            </div>
                          </div>

                          {/* Estado y Fechas */}
                          <div className="lg:col-span-3">
                            <div className="space-y-2">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      STATUS_CONFIG[
                                        audience.status as keyof typeof STATUS_CONFIG
                                      ].color
                                    }
                                  >
                                    {
                                      STATUS_CONFIG[
                                        audience.status as keyof typeof STATUS_CONFIG
                                      ].name
                                    }
                                  </Badge>
                                </div>

                                {/* Información del responsable */}
                                {audience.status === "en_proceso" && audience.assignedTo && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                      <UserPlus className="w-4 h-4 text-blue-600" />
                                      <div>
                                        <p className="text-sm font-medium text-blue-800">
                                          👨‍💼 Gestionado por:
                                        </p>
                                        <p className="text-xs text-blue-600">
                                          {audience.assignedTo}
                                        </p>
                                        {audience.assignedDate && (
                                          <p className="text-xs text-blue-500">
                                            Asignado: {format(audience.assignedDate, "dd/MM/yyyy", { locale: es })}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {audience.status === "completada" && audience.completedBy && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <div>
                                        <p className="text-sm font-medium text-green-800">
                                          ✅ Completado por:
                                        </p>
                                        <p className="text-xs text-green-600">
                                          {audience.completedBy}
                                        </p>
                                        {audience.completedDate && (
                                          <p className="text-xs text-green-500">
                                            Finalizado: {format(audience.completedDate, "dd/MM/yyyy", { locale: es })}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                Solicitado:{" "}
                                {format(audience.requestDate, "dd/MM/yyyy", {
                                  locale: es,
                                })}
                              </p>
                              {audience.daysWaiting > 0 && (
                                <p className="text-xs text-orange-600">
                                  {audience.daysWaiting} días esperando
                                </p>
                              )}
                              {audience.assignedTo && (
                                <p className="text-xs text-blue-600">
                                  Asignado a: {audience.assignedTo}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="lg:col-span-3 flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(audience)}
                              className="w-full"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </Button>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => handleManage(audience)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
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
                    <CardTitle>Gestión de Ciudadanos</CardTitle>
                    <CardDescription>
                      Administra los usuarios ciudadanos del sistema
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Ciudadano
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre, teléfono o email..."
                      value={citizenSearch}
                      onChange={(e) => setCitizenSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-3">
                    {citizens
                      .filter(
                        (citizen) =>
                          citizen.name
                            .toLowerCase()
                            .includes(citizenSearch.toLowerCase()) ||
                          citizen.phone.includes(citizenSearch) ||
                          citizen.email
                            .toLowerCase()
                            .includes(citizenSearch.toLowerCase()),
                      )
                      .map((citizen) => (
                        <Card
                          key={citizen.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                              <div className="lg:col-span-6">
                                <h4 className="font-semibold text-slate-800">
                                  {citizen.name}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {citizen.phone} �� {citizen.email}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {citizen.address}
                                </p>
                              </div>
                              <div className="lg:col-span-3">
                                <p className="text-sm text-slate-600">
                                  Solicitudes: {citizen.totalRequests}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Registro:{" "}
                                  {format(
                                    citizen.registrationDate,
                                    "dd/MM/yyyy",
                                    { locale: es },
                                  )}
                                </p>
                                <Badge
                                  className={
                                    citizen.status === "activo"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {citizen.status}
                                </Badge>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expedientes Ciudadanos */}
          <TabsContent value="expedientes">
            <Card>
              <CardHeader>
                <CardTitle>Expedientes de Ciudadanos</CardTitle>
                <CardDescription>
                  Historial completo de solicitudes y resultados por ciudadano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {citizens.map((citizen) => (
                    <Card
                      key={citizen.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCitizen(citizen);
                        setIsExpedienteOpen(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800">
                              {citizen.name}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {citizen.phone}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {citizen.totalRequests} solicitudes
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {citizen.expediente.requests
                            .slice(0, 2)
                            .map((request, idx) => (
                              <div key={idx} className="text-xs">
                                <p className="text-slate-600">{request.type}</p>
                                <Badge
                                  className={
                                    STATUS_CONFIG[
                                      request.status as keyof typeof STATUS_CONFIG
                                    ].color
                                  }
                                >
                                  {
                                    STATUS_CONFIG[
                                      request.status as keyof typeof STATUS_CONFIG
                                    ].name
                                  }
                                </Badge>
                              </div>
                            ))}
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          variant="outline"
                        >
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

          {/* Gestión de Personal */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal de Apoyo</CardTitle>
                    <CardDescription>
                      Gestiona el personal para asignación de audiencias
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Personal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nombre, rol o departamento..."
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff
                      .filter(
                        (member) =>
                          member.name
                            .toLowerCase()
                            .includes(staffSearch.toLowerCase()) ||
                          member.role
                            .toLowerCase()
                            .includes(staffSearch.toLowerCase()) ||
                          member.department
                            .toLowerCase()
                            .includes(staffSearch.toLowerCase()),
                      )
                      .map((member) => (
                        <Card
                          key={member.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-slate-800">
                                  {member.name}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {member.role}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {member.department}
                                </p>
                              </div>
                              <Badge
                                className={
                                  member.status === "activo"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {member.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              <p className="text-xs text-slate-600">
                                📧 {member.email}
                              </p>
                              <p className="text-xs text-slate-600">
                                📞 {member.phone}
                              </p>
                              <p className="text-xs text-slate-600">
                                📋 {member.activeAssignments} asignaciones
                                activas
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedStaff(member);
                                setIsEditStaffOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración */}
          <TabsContent value="configuracion">
            {activeTab === "configuracion" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">
                      Panel de Configuración del Sistema
                    </h3>
                    <p className="text-sm text-emerald-700">
                      Administra todos los aspectos configurables del sistema de
                      audiencias municipales
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <Card className="border-emerald-200">
                <CardHeader className="bg-emerald-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-emerald-800">
                        Tipos de Audiencias
                      </CardTitle>
                      <CardDescription>
                        Configura las categorías y tipos de audiencias
                        disponibles
                      </CardDescription>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Tipo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar tipos de audiencia..."
                        value={typeSearch}
                        onChange={(e) => setTypeSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="space-y-3">
                      {audienceTypes
                        .filter(
                          (type) =>
                            type.name
                              .toLowerCase()
                              .includes(typeSearch.toLowerCase()) ||
                            type.description
                              .toLowerCase()
                              .includes(typeSearch.toLowerCase()),
                        )
                        .map((type) => (
                          <Card
                            key={type.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge
                                      className={
                                        CATEGORY_CONFIG[
                                          type.category as keyof typeof CATEGORY_CONFIG
                                        ].color
                                      }
                                    >
                                      {
                                        CATEGORY_CONFIG[
                                          type.category as keyof typeof CATEGORY_CONFIG
                                        ].name
                                      }
                                    </Badge>
                                    <h4 className="font-semibold text-slate-800">
                                      {type.name}
                                    </h4>
                                    <Badge
                                      className={
                                        type.active
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {type.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600">
                                    {type.description}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedType(type);
                                    setIsEditTypeOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gestión de Turnos de Viernes */}
          <TabsContent value="turnos">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      Gestión de Turnos - Audiencias Públicas de Viernes
                    </CardTitle>
                    <CardDescription>
                      Administra los turnos y horarios para las audiencias
                      públicas de cada viernes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        loadTodayTurns();
                        setShowTurnMonitor(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Monitor de Turnos
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Configurar Fecha
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Información general */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Información del Sistema de Turnos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                      <div>
                        <p className="font-medium">Frecuencia:</p>
                        <p>Todos los viernes de cada mes</p>
                      </div>
                      <div>
                        <p className="font-medium">Horario:</p>
                        <p>9:00 AM - 5:00 PM</p>
                      </div>
                      <div>
                        <p className="font-medium">Sistema de turnos:</p>
                        <p>Dinámico (siguiente disponible)</p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de fechas próximas */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                      Próximas Fechas de Audiencias Públicas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {publicAudienceDates.map((dateOption, index) => (
                        <Card
                          key={index}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedManageDate?.date &&
                            dateOption.date &&
                            selectedManageDate.date.getTime() ===
                              dateOption.date.getTime()
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 hover:border-green-300"
                          }`}
                          onClick={() => {
                            setSelectedManageDate(dateOption);
                            const slots = generateTimeSlots().map(
                              (time, index) => ({
                                id: `slot-${index}`,
                                time,
                                isAvailable: true,
                                assignedTo: undefined,
                              }),
                            );
                            setManageDateSlots(slots);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {formatPublicAudienceDate(dateOption.date)}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    Viernes #{dateOption.weekNumber} del mes
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    dateOption.isAvailable
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {dateOption.isAvailable
                                    ? "Disponible"
                                    : "Completo"}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">
                                  Turnos ocupados:
                                </span>
                                <span className="font-medium text-green-600">
                                  {dateOption.totalSlots -
                                    dateOption.slotsAvailable}{" "}
                                  / {dateOption.totalSlots}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${((dateOption.totalSlots - dateOption.slotsAvailable) / dateOption.totalSlots) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Gestión de horarios de la fecha seleccionada */}
                  {selectedManageDate && (
                    <div className="space-y-4">
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Gestión de Turnos -{" "}
                          {formatPublicAudienceDate(selectedManageDate.date)}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {manageDateSlots.map((slot) => (
                            <Card
                              key={slot.id}
                              className={`${
                                slot.isAvailable
                                  ? "border-green-200 bg-green-50"
                                  : "border-orange-200 bg-orange-50"
                              }`}
                            >
                              <CardContent className="p-3">
                                <div className="text-center space-y-2">
                                  <p className="font-medium text-slate-800">
                                    {slot.time}
                                  </p>
                                  <Badge
                                    className={
                                      slot.isAvailable
                                        ? "bg-green-100 text-green-800"
                                        : "bg-orange-100 text-orange-800"
                                    }
                                  >
                                    {slot.isAvailable
                                      ? "Disponible"
                                      : "Ocupado"}
                                  </Badge>
                                  {!slot.isAvailable && slot.assignedTo && (
                                    <div className="space-y-1">
                                      <p className="text-xs text-slate-600">
                                        Ciudadano:
                                      </p>
                                      <p className="text-xs font-medium text-slate-800">
                                        {slot.assignedTo}
                                      </p>
                                    </div>
                                  )}
                                  <div className="flex gap-1">
                                    {slot.isAvailable ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full text-xs border-green-300 text-green-700 hover:bg-green-100"
                                        onClick={() => {
                                          // Simular asignación manual
                                          const citizenName = prompt(
                                            "Nombre del ciudadano:",
                                          );
                                          if (citizenName) {
                                            const updatedSlots =
                                              manageDateSlots.map((s) =>
                                                s.id === slot.id
                                                  ? {
                                                      ...s,
                                                      isAvailable: false,
                                                      assignedTo: citizenName,
                                                    }
                                                  : s,
                                              );
                                            setManageDateSlots(updatedSlots);
                                          }
                                        }}
                                      >
                                        Asignar
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full text-xs border-red-300 text-red-700 hover:bg-red-100"
                                        onClick={() => {
                                          if (confirm("¿Liberar este turno?")) {
                                            const updatedSlots =
                                              manageDateSlots.map((s) =>
                                                s.id === slot.id
                                                  ? {
                                                      ...s,
                                                      isAvailable: true,
                                                      assignedTo: undefined,
                                                    }
                                                  : s,
                                              );
                                            setManageDateSlots(updatedSlots);
                                          }
                                        }}
                                      >
                                        Liberar
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reportes">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Analytics</CardTitle>
                <CardDescription>
                  Estadísticas y reportes del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">
                            Ciudadanos Registrados
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            {citizens.length}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">
                            Personal Activo
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            {staff.filter((s) => s.status === "activo").length}
                          </p>
                        </div>
                        <UserPlus className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">
                            Tipos Configurados
                          </p>
                          <p className="text-2xl font-bold text-slate-800">
                            {audienceTypes.filter((t) => t.active).length}
                          </p>
                        </div>
                        <Settings className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Detalles */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalles de la Audiencia: {selectedAudience?.id}
            </DialogTitle>
            <DialogDescription>
              Información completa y acciones administrativas
            </DialogDescription>
          </DialogHeader>

          {selectedAudience && (
            <div className="space-y-6">
              {/* Información del Ciudadano */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Información del Ciudadano
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Nombre</p>
                    <p className="font-medium">{selectedAudience.citizen}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Teléfono</p>
                    <p className="font-medium">{selectedAudience.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fecha de Solicitud</p>
                    <p className="font-medium">
                      {format(selectedAudience.requestDate, "PPP", {
                        locale: es,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Prioridad</p>
                    <Badge
                      className={
                        PRIORITY_CONFIG[
                          selectedAudience.priority as keyof typeof PRIORITY_CONFIG
                        ].color
                      }
                    >
                      {
                        PRIORITY_CONFIG[
                          selectedAudience.priority as keyof typeof PRIORITY_CONFIG
                        ].name
                      }
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Acciones Administrativas */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    handleManage(selectedAudience);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Gestionar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Gestión Integral */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Gestionar Audiencia: {selectedAudience?.id}
            </DialogTitle>
            <DialogDescription>
              Realiza acciones administrativas sobre esta solicitud
            </DialogDescription>
          </DialogHeader>

          {selectedAudience && (
            <div className="space-y-6">
              {/* Información Resumida */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {selectedAudience.citizen}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {selectedAudience.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        className={
                          CATEGORY_CONFIG[
                            selectedAudience.category as keyof typeof CATEGORY_CONFIG
                          ].color
                        }
                      >
                        {
                          CATEGORY_CONFIG[
                            selectedAudience.category as keyof typeof CATEGORY_CONFIG
                          ].name
                        }
                      </Badge>
                      <Badge
                        className={
                          STATUS_CONFIG[
                            selectedAudience.status as keyof typeof STATUS_CONFIG
                          ].color
                        }
                      >
                        {
                          STATUS_CONFIG[
                            selectedAudience.status as keyof typeof STATUS_CONFIG
                          ].name
                        }
                      </Badge>
                    </div>
                  </div>
                  <Badge
                    className={
                      PRIORITY_CONFIG[
                        selectedAudience.priority as keyof typeof PRIORITY_CONFIG
                      ].color
                    }
                  >
                    {
                      PRIORITY_CONFIG[
                        selectedAudience.priority as keyof typeof PRIORITY_CONFIG
                      ].name
                    }
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 mt-3">
                  {selectedAudience.description}
                </p>
              </div>

              {/* Selección de Acción */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="action-type">
                    Selecciona la acción a realizar
                  </Label>
                  <Select value={actionType} onValueChange={setActionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige una acción..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprobar">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Aprobar Audiencia
                        </div>
                      </SelectItem>
                      <SelectItem value="rechazar">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          Rechazar Audiencia
                        </div>
                      </SelectItem>
                      <SelectItem value="responder">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          Enviar Respuesta
                        </div>
                      </SelectItem>
                      <SelectItem value="programar">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-purple-600" />
                          Programar Audiencia
                        </div>
                      </SelectItem>
                      <SelectItem value="asignar">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-orange-600" />
                          Asignar Responsable
                        </div>
                      </SelectItem>
                      <SelectItem value="completar">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Marcar como Completada
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Formularios Condicionales */}
                {(actionType === "responder" || actionType === "rechazar") && (
                  <div>
                    <Label htmlFor="response">
                      {actionType === "responder"
                        ? "Respuesta para el ciudadano"
                        : "Motivo del rechazo"}
                    </Label>
                    <Textarea
                      id="response"
                      placeholder={
                        actionType === "responder"
                          ? "Escribe tu respuesta..."
                          : "Explica el motivo del rechazo..."
                      }
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}

                {actionType === "programar" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="scheduled-date">Fecha</Label>
                      <Input
                        id="scheduled-date"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduled-time">Hora</Label>
                      <Input
                        id="scheduled-time"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="meeting-format">Modalidad</Label>
                      <Select
                        value={meetingFormat}
                        onValueChange={setMeetingFormat}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presencial">Presencial</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="telefonica">Telefónica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {(actionType === "asignar" ||
                  actionType === "aprobar" ||
                  actionType === "programar") && (
                  <div>
                    <Label htmlFor="assigned-to">Asignar a</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Martínez">
                          Dr. Martínez - Servicios Médicos
                        </SelectItem>
                        <SelectItem value="Ing. López">
                          Ing. López - Trámites y Licencias
                        </SelectItem>
                        <SelectItem value="Lic. García">
                          Lic. García - Asuntos Sociales
                        </SelectItem>
                        <SelectItem value="C. Rodríguez">
                          C. Rodríguez - Ayuda en Especie
                        </SelectItem>
                        <SelectItem value="Coord. Eventos">
                          Coord. Eventos - Invitaciones
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Cambiar Prioridad */}
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notas Adicionales */}
                <div>
                  <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Agrega cualquier observación o comentario interno..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={handleSaveAction}
                  className="flex-1"
                  disabled={!actionType}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Ejecutar Acción
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsManageOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Expediente Ciudadano */}
      <Dialog open={isExpedienteOpen} onOpenChange={setIsExpedienteOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Expediente: {selectedCitizen?.name}
            </DialogTitle>
            <DialogDescription>
              Historial completo de solicitudes y resultados
            </DialogDescription>
          </DialogHeader>

          {selectedCitizen && (
            <div className="space-y-6">
              {/* Información del Ciudadano */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Nombre Completo</p>
                    <p className="font-medium">{selectedCitizen.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Teléfono</p>
                    <p className="font-medium">{selectedCitizen.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium">{selectedCitizen.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Dirección</p>
                    <p className="font-medium">{selectedCitizen.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fecha de Registro</p>
                    <p className="font-medium">
                      {format(selectedCitizen.registrationDate, "PPP", {
                        locale: es,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      Total de Solicitudes
                    </p>
                    <p className="font-medium">
                      {selectedCitizen.totalRequests}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas del Expediente */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Notas del Expediente
                </h3>
                <Textarea
                  value={selectedCitizen.expediente.notes}
                  onChange={(e) => {
                    const updatedCitizens = citizens.map((c) =>
                      c.id === selectedCitizen.id
                        ? {
                            ...c,
                            expediente: {
                              ...c.expediente,
                              notes: e.target.value,
                            },
                          }
                        : c,
                    );
                    setCitizens(updatedCitizens);
                    setSelectedCitizen({
                      ...selectedCitizen,
                      expediente: {
                        ...selectedCitizen.expediente,
                        notes: e.target.value,
                      },
                    });
                  }}
                  rows={3}
                  placeholder="Agregar notas sobre el ciudadano..."
                />
              </div>

              {/* Historial de Solicitudes */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">
                  Historial de Solicitudes
                </h3>
                <div className="space-y-4">
                  {selectedCitizen.expediente.requests.map(
                    (request: any, index: number) => (
                      <Card
                        key={index}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-6">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={
                                    CATEGORY_CONFIG[
                                      request.category as keyof typeof CATEGORY_CONFIG
                                    ].color
                                  }
                                >
                                  {
                                    CATEGORY_CONFIG[
                                      request.category as keyof typeof CATEGORY_CONFIG
                                    ].name
                                  }
                                </Badge>
                                <span className="font-medium">
                                  {request.type}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">
                                ID: {request.id}
                              </p>
                              <p className="text-sm text-slate-600">
                                Fecha:{" "}
                                {format(request.date, "PPP", { locale: es })}
                              </p>
                            </div>

                            <div className="lg:col-span-3">
                              <Badge
                                className={
                                  STATUS_CONFIG[
                                    request.status as keyof typeof STATUS_CONFIG
                                  ].color
                                }
                              >
                                {
                                  STATUS_CONFIG[
                                    request.status as keyof typeof STATUS_CONFIG
                                  ].name
                                }
                              </Badge>
                              {request.assignedTo && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Asignado a: {request.assignedTo}
                                </p>
                              )}
                            </div>

                            <div className="lg:col-span-3">
                              <div className="space-y-2">
                                <Label htmlFor={`result-${index}`}>
                                  Resultado/Observaciones
                                </Label>
                                <Textarea
                                  id={`result-${index}`}
                                  value={request.result}
                                  onChange={(e) => {
                                    const updatedRequests = [
                                      ...selectedCitizen.expediente.requests,
                                    ];
                                    updatedRequests[index] = {
                                      ...updatedRequests[index],
                                      result: e.target.value,
                                    };

                                    const updatedCitizen = {
                                      ...selectedCitizen,
                                      expediente: {
                                        ...selectedCitizen.expediente,
                                        requests: updatedRequests,
                                      },
                                    };

                                    const updatedCitizens = citizens.map((c) =>
                                      c.id === selectedCitizen.id
                                        ? updatedCitizen
                                        : c,
                                    );

                                    setCitizens(updatedCitizens);
                                    setSelectedCitizen(updatedCitizen);
                                  }}
                                  rows={2}
                                  placeholder="Resultado de la gesti��n..."
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    toast({
                      title: "Expediente actualizado",
                      description: "Los cambios se guardaron automáticamente",
                    });
                  }}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCitizen({
                      ...selectedCitizen,
                      expediente: {
                        ...selectedCitizen.expediente,
                        notes:
                          selectedCitizen.expediente.notes +
                          "\n[" +
                          new Date().toLocaleString() +
                          "] Expediente revisado por " +
                          user.name,
                      },
                    });
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Agregar Nota de Revisión
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsExpedienteOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Editar Ciudadano */}
      <Dialog open={isEditCitizenOpen} onOpenChange={setIsEditCitizenOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ciudadano</DialogTitle>
            <DialogDescription>
              Modifica la información del ciudadano
            </DialogDescription>
          </DialogHeader>

          {selectedCitizen && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nombre Completo</Label>
                  <Input
                    id="edit-name"
                    value={selectedCitizen.name}
                    onChange={(e) =>
                      setSelectedCitizen({
                        ...selectedCitizen,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={selectedCitizen.phone}
                    onChange={(e) =>
                      setSelectedCitizen({
                        ...selectedCitizen,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedCitizen.email}
                    onChange={(e) =>
                      setSelectedCitizen({
                        ...selectedCitizen,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-address">Dirección</Label>
                  <Input
                    id="edit-address"
                    value={selectedCitizen.address}
                    onChange={(e) =>
                      setSelectedCitizen({
                        ...selectedCitizen,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select
                    value={selectedCitizen.status}
                    onValueChange={(value) =>
                      setSelectedCitizen({ ...selectedCitizen, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="suspendido">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setCitizens(
                      citizens.filter((c) => c.id !== selectedCitizen.id),
                    );
                    setIsEditCitizenOpen(false);
                    toast({
                      title: "Ciudadano eliminado",
                      description: "El registro ha sido eliminado del sistema",
                    });
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditCitizenOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setCitizens(
                        citizens.map((c) =>
                          c.id === selectedCitizen.id ? selectedCitizen : c,
                        ),
                      );
                      setIsEditCitizenOpen(false);
                      toast({
                        title: "Ciudadano actualizado",
                        description: "Los cambios se guardaron correctamente",
                      });
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Editar Personal */}
      <Dialog open={isEditStaffOpen} onOpenChange={setIsEditStaffOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Personal</DialogTitle>
            <DialogDescription>
              Modifica la información del personal
            </DialogDescription>
          </DialogHeader>

          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staff-name">Nombre</Label>
                  <Input
                    id="staff-name"
                    value={selectedStaff.name}
                    onChange={(e) =>
                      setSelectedStaff({
                        ...selectedStaff,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="staff-role">Rol</Label>
                  <Input
                    id="staff-role"
                    value={selectedStaff.role}
                    onChange={(e) =>
                      setSelectedStaff({
                        ...selectedStaff,
                        role: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="staff-department">Departamento</Label>
                  <Input
                    id="staff-department"
                    value={selectedStaff.department}
                    onChange={(e) =>
                      setSelectedStaff({
                        ...selectedStaff,
                        department: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="staff-phone">Teléfono</Label>
                  <Input
                    id="staff-phone"
                    value={selectedStaff.phone}
                    onChange={(e) =>
                      setSelectedStaff({
                        ...selectedStaff,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    value={selectedStaff.email}
                    onChange={(e) =>
                      setSelectedStaff({
                        ...selectedStaff,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="staff-status">Estado</Label>
                  <Select
                    value={selectedStaff.status}
                    onValueChange={(value) =>
                      setSelectedStaff({ ...selectedStaff, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="vacaciones">En Vacaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setStaff(staff.filter((s) => s.id !== selectedStaff.id));
                    setIsEditStaffOpen(false);
                    toast({
                      title: "Personal eliminado",
                      description: "El registro ha sido eliminado del sistema",
                    });
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditStaffOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setStaff(
                        staff.map((s) =>
                          s.id === selectedStaff.id ? selectedStaff : s,
                        ),
                      );
                      setIsEditStaffOpen(false);
                      toast({
                        title: "Personal actualizado",
                        description: "Los cambios se guardaron correctamente",
                      });
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Editar Tipo de Audiencia */}
      <Dialog open={isEditTypeOpen} onOpenChange={setIsEditTypeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Tipo de Audiencia</DialogTitle>
            <DialogDescription>
              Modifica la configuración del tipo de audiencia
            </DialogDescription>
          </DialogHeader>

          {selectedType && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type-name">Nombre</Label>
                  <Input
                    id="type-name"
                    value={selectedType.name}
                    onChange={(e) =>
                      setSelectedType({ ...selectedType, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="type-category">Categoría</Label>
                  <Select
                    value={selectedType.category}
                    onValueChange={(value) =>
                      setSelectedType({ ...selectedType, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="especie">Ayuda en Especie</SelectItem>
                      <SelectItem value="servicio">Servicios</SelectItem>
                      <SelectItem value="invitacion">Invitaciones</SelectItem>
                      <SelectItem value="tramites">Trámites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="type-description">Descripción</Label>
                  <Textarea
                    id="type-description"
                    value={selectedType.description}
                    onChange={(e) =>
                      setSelectedType({
                        ...selectedType,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="type-active">Estado</Label>
                  <Select
                    value={selectedType.active ? "true" : "false"}
                    onValueChange={(value) =>
                      setSelectedType({
                        ...selectedType,
                        active: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Activo</SelectItem>
                      <SelectItem value="false">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setAudienceTypes(
                      audienceTypes.filter((t) => t.id !== selectedType.id),
                    );
                    setIsEditTypeOpen(false);
                    toast({
                      title: "Tipo eliminado",
                      description: "El tipo de audiencia ha sido eliminado",
                    });
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditTypeOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setAudienceTypes(
                        audienceTypes.map((t) =>
                          t.id === selectedType.id ? selectedType : t,
                        ),
                      );
                      setIsEditTypeOpen(false);
                      toast({
                        title: "Tipo actualizado",
                        description: "Los cambios se guardaron correctamente",
                      });
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Monitor de Turnos en Tiempo Real */}
      <Dialog open={showTurnMonitor} onOpenChange={setShowTurnMonitor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Activity className="w-5 h-5 text-blue-600" />
              Monitor de Turnos - Audiencias Públicas
            </DialogTitle>
            <DialogDescription className="text-base">
              Gestión en tiempo real de los turnos de audiencias públicas -{" "}
              {format(monitorDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status General */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {turnQueue.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Turnos</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {turnQueue.filter((t) => t.status === "completado").length}
                  </div>
                  <div className="text-sm text-green-700">Completados</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {turnQueue.filter((t) => t.status === "pendiente").length}
                  </div>
                  <div className="text-sm text-yellow-700">Pendientes</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {currentTurnActive ? "1" : "0"}
                  </div>
                  <div className="text-sm text-red-700">En Atención</div>
                </CardContent>
              </Card>
            </div>

            {/* Turno Actual */}
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-300">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Turno en Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentTurnActive ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-slate-600">
                          Número de Turno
                        </p>
                        <p className="text-xl font-bold text-red-600">
                          {currentTurnActive.turnNumber}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-slate-600">Ciudadano</p>
                        <p className="font-semibold text-slate-800">
                          {currentTurnActive.citizenName}
                        </p>
                        <p className="text-sm text-slate-600">
                          {currentTurnActive.citizenPhone}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-slate-600">
                          Hora Programada
                        </p>
                        <p className="text-lg font-bold text-slate-800">
                          {currentTurnActive.time}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-slate-600">Tema de Consulta</p>
                      <p className="text-slate-800">{currentTurnActive.tema}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={completeTurn}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Finalizar Turno
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">
                      No hay turno en atención actualmente
                    </p>
                    <p className="text-sm text-slate-400">
                      Presiona "Llamar Siguiente" para iniciar
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Próximos Turnos */}
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Próximos Turnos
                  </CardTitle>
                  <Button
                    onClick={callNextTurn}
                    disabled={
                      nextTurns.length === 0 || currentTurnActive !== null
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Llamar Siguiente
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {nextTurns.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nextTurns.slice(0, 3).map((turn, index) => (
                      <Card
                        key={turn.slotId}
                        className={`${index === 0 ? "border-yellow-400 bg-yellow-50" : "border-slate-200"}`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="font-bold text-slate-800">
                                {turn.turnNumber}
                              </p>
                              <Badge
                                className={
                                  index === 0
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-slate-200 text-slate-700"
                                }
                              >
                                {index === 0 ? "Siguiente" : `En ${index + 1}`}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-slate-700">
                              {turn.citizenName}
                            </p>
                            <p className="text-xs text-slate-600">
                              {turn.time}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {turn.tema}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-slate-500">
                      No hay más turnos pendientes
                    </p>
                    <p className="text-sm text-slate-400">
                      Todos los turnos han sido atendidos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lista Completa de Turnos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Lista Completa de Turnos del Día
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {turnQueue.map((turn, index) => (
                    <div
                      key={turn.slotId}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        turn.status === "activo"
                          ? "bg-red-50 border-red-200"
                          : turn.status === "completado"
                            ? "bg-green-50 border-green-200"
                            : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-bold">{turn.time}</p>
                          <p className="text-xs text-slate-500">#{index + 1}</p>
                        </div>
                        <div>
                          <p className="font-semibold">{turn.turnNumber}</p>
                          <p className="text-sm text-slate-600">
                            {turn.citizenName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {turn.citizenPhone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            turn.status === "activo"
                              ? "bg-red-100 text-red-800"
                              : turn.status === "completado"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {turn.status === "activo"
                            ? "En Atención"
                            : turn.status === "completado"
                              ? "Completado"
                              : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {turnQueue.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">
                      No hay turnos programados para hoy
                    </p>
                    <p className="text-sm text-slate-400">
                      Los turnos aparecerán aquí cuando los ciudadanos los
                      reserven
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => loadTodayTurns()}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Actualizar Lista
            </Button>
            <Button variant="outline" onClick={() => setShowTurnMonitor(false)}>
              Cerrar Monitor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
