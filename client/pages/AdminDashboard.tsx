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
import { toast } from "@/hooks/use-toast";
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
  TrendingUp,
  Activity,
  UserPlus,
  CalendarDays,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data - En producción vendría de la API compartida
const mockAdminData = {
  stats: {
    totalAudiences: 127,
    pendingAudiences: 23,
    todayAudiences: 8,
    completedThisMonth: 89,
    avgResponseTime: "2.3 días",
    satisfactionRate: "94%"
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
            assignedTo: "C. Rodríguez"
          }
        ],
        notes: "Familia de 5 personas. Situación económica vulnerable."
      }
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
            assignedTo: "Dr. Martínez"
          }
        ],
        notes: "Requiere apoyo médico urgente."
      }
    }
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
      status: "activo"
    },
    {
      id: "STAFF-002",
      name: "Ing. López",
      role: "Trámites y Licencias",
      department: "Obras Públicas",
      email: "ing.lopez@municipio.gob.mx",
      phone: "55 3333 4444",
      activeAssignments: 8,
      status: "activo"
    },
    {
      id: "STAFF-003",
      name: "Lic. García",
      role: "Asuntos Sociales",
      department: "Desarrollo Social",
      email: "lic.garcia@municipio.gob.mx",
      phone: "55 5555 6666",
      activeAssignments: 15,
      status: "activo"
    },
    {
      id: "STAFF-004",
      name: "C. Rodríguez",
      role: "Ayuda en Especie",
      department: "Desarrollo Social",
      email: "c.rodriguez@municipio.gob.mx",
      phone: "55 7777 8888",
      activeAssignments: 20,
      status: "activo"
    }
  ],
  audienceTypes: [
    { id: "AT-001", category: "especie", name: "Alimentos", description: "Despensas y productos alimentarios", active: true },
    { id: "AT-002", category: "especie", name: "Medicamentos", description: "Apoyo con medicamentos básicos", active: true },
    { id: "AT-003", category: "servicio", name: "Servicios médicos", description: "Consultas y tratamientos médicos", active: true },
    { id: "AT-004", category: "servicio", name: "Servicios sociales", description: "Apoyo psicológico y social", active: true },
    { id: "AT-005", category: "tramites", name: "Licencias", description: "Permisos y licencias municipales", active: true },
    { id: "AT-006", category: "invitacion", name: "Evento público", description: "Invitaciones a eventos oficiales", active: true }
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
      daysWaiting: 2
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
      assignedTo: "Dr. Martínez",
      daysWaiting: 4
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
      daysWaiting: 0
    },
    {
      id: "AUD-567890",
      citizen: "Roberto Morales",
      phone: "55 3333 9999",
      category: "invitacion",
      type: "Evento público",
      description: "Invitación para ceremonia de reconocimiento",
      status: "pendiente",
      priority: "baja",
      requestDate: new Date("2024-01-24"),
      assignedTo: null,
      daysWaiting: 3
    }
  ]
};

const CATEGORY_CONFIG = {
  especie: { name: "Ayuda en Especie", color: "bg-orange-100 text-orange-800" },
  servicio: { name: "Servicios", color: "bg-blue-100 text-blue-800" },
  invitacion: { name: "Invitaciones", color: "bg-green-100 text-green-800" },
  tramites: { name: "Trámites", color: "bg-purple-100 text-purple-800" }
};

const STATUS_CONFIG = {
  pendiente: { name: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  en_proceso: { name: "En Proceso", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  completada: { name: "Completada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rechazada: { name: "Rechazada", color: "bg-red-100 text-red-800", icon: XCircle }
};

const PRIORITY_CONFIG = {
  urgente: { name: "Urgente", color: "bg-red-100 text-red-800" },
  alta: { name: "Alta", color: "bg-orange-100 text-orange-800" },
  media: { name: "Media", color: "bg-yellow-100 text-yellow-800" },
  baja: { name: "Baja", color: "bg-gray-100 text-gray-800" }
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

  // Estados para gestión de datos administrativos
  const [citizens, setCitizens] = useState(mockAdminData.citizens);
  const [staff, setStaff] = useState(mockAdminData.staff);
  const [audienceTypes, setAudienceTypes] = useState(mockAdminData.audienceTypes);

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
  }, [navigate]);

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
        variant: "destructive"
      });
      return;
    }

    // Validaciones específicas
    if (actionType === "responder" && !response.trim()) {
      toast({
        title: "Error",
        description: "Escribe una respuesta para el ciudadano",
        variant: "destructive"
      });
      return;
    }

    if (actionType === "programar" && (!scheduledDate || !scheduledTime)) {
      toast({
        title: "Error",
        description: "Selecciona fecha y hora para la audiencia",
        variant: "destructive"
      });
      return;
    }

    // Actualizar audiencia
    const updatedAudiences = audiences.map(aud => {
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
          scheduledDate: scheduledDate ? new Date(scheduledDate + " " + scheduledTime) : aud.scheduledDate,
          lastResponse: response || aud.lastResponse,
          notes: notes || aud.notes,
          lastUpdate: new Date()
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
      completar: "Audiencia marcada como completada"
    };

    toast({
      title: "Acción realizada",
      description: actionMessages[actionType as keyof typeof actionMessages] || "Acción completada",
    });

    setIsManageOpen(false);
  };

  const filteredAudiences = audiences.filter(audience => {
    const matchesSearch = audience.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audience.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audience.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || audience.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || audience.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Panel Administrativo
              </h1>
              <p className="text-sm text-slate-600">Sistema de Audiencias Municipales</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              Bienvenido, {user.name}
            </span>
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Audiencias</p>
                  <p className="text-2xl font-bold text-slate-800">{mockAdminData.stats.totalAudiences}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                +12% este mes
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{mockAdminData.stats.pendingAudiences}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-red-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                +3 desde ayer
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Hoy</p>
                  <p className="text-2xl font-bold text-blue-600">{mockAdminData.stats.todayAudiences}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <Activity className="w-4 h-4 mr-1" />
                Programadas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completadas</p>
                  <p className="text-2xl font-bold text-green-600">{mockAdminData.stats.completedThisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                Este mes
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="audiencias" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="audiencias">Audiencias</TabsTrigger>
            <TabsTrigger value="ciudadanos">Ciudadanos</TabsTrigger>
            <TabsTrigger value="expedientes">Expedientes</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
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
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                    <Card key={audience.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                          {/* Info Principal */}
                          <div className="lg:col-span-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-slate-800">{audience.id}</h4>
                                <p className="text-sm text-slate-600">{audience.citizen}</p>
                                <p className="text-xs text-slate-500">{audience.phone}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={PRIORITY_CONFIG[audience.priority as keyof typeof PRIORITY_CONFIG].color}>
                                  {PRIORITY_CONFIG[audience.priority as keyof typeof PRIORITY_CONFIG].name}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={CATEGORY_CONFIG[audience.category as keyof typeof CATEGORY_CONFIG].color}>
                                  {CATEGORY_CONFIG[audience.category as keyof typeof CATEGORY_CONFIG].name}
                                </Badge>
                                <span className="text-sm text-slate-600">• {audience.type}</span>
                              </div>
                              <p className="text-sm text-slate-700">{audience.description}</p>
                            </div>
                          </div>

                          {/* Estado y Fechas */}
                          <div className="lg:col-span-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].color}>
                                  {STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].name}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500">
                                Solicitado: {format(audience.requestDate, "dd/MM/yyyy", { locale: es })}
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
                    <CardDescription>Administra los usuarios ciudadanos del sistema</CardDescription>
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
                      .filter(citizen =>
                        citizen.name.toLowerCase().includes(citizenSearch.toLowerCase()) ||
                        citizen.phone.includes(citizenSearch) ||
                        citizen.email.toLowerCase().includes(citizenSearch.toLowerCase())
                      )
                      .map((citizen) => (
                      <Card key={citizen.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            <div className="lg:col-span-6">
                              <h4 className="font-semibold text-slate-800">{citizen.name}</h4>
                              <p className="text-sm text-slate-600">{citizen.phone} • {citizen.email}</p>
                              <p className="text-xs text-slate-500">{citizen.address}</p>
                            </div>
                            <div className="lg:col-span-3">
                              <p className="text-sm text-slate-600">Solicitudes: {citizen.totalRequests}</p>
                              <p className="text-xs text-slate-500">
                                Registro: {format(citizen.registrationDate, "dd/MM/yyyy", { locale: es })}
                              </p>
                              <Badge className={citizen.status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
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
                <CardDescription>Historial completo de solicitudes y resultados por ciudadano</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {citizens.map((citizen) => (
                    <Card key={citizen.id} className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setSelectedCitizen(citizen);
                            setIsExpedienteOpen(true);
                          }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800">{citizen.name}</h4>
                            <p className="text-sm text-slate-600">{citizen.phone}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {citizen.totalRequests} solicitudes
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {citizen.expediente.requests.slice(0, 2).map((request, idx) => (
                            <div key={idx} className="text-xs">
                              <p className="text-slate-600">{request.type}</p>
                              <Badge className={STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG].color}>
                                {STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG].name}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <Button size="sm" className="w-full mt-3" variant="outline">
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
                    <CardDescription>Gestiona el personal para asignación de audiencias</CardDescription>
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
                      .filter(member =>
                        member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        member.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
                        member.department.toLowerCase().includes(staffSearch.toLowerCase())
                      )
                      .map((member) => (
                      <Card key={member.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-slate-800">{member.name}</h4>
                              <p className="text-sm text-slate-600">{member.role}</p>
                              <p className="text-xs text-slate-500">{member.department}</p>
                            </div>
                            <Badge className={member.status === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {member.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 mb-3">
                            <p className="text-xs text-slate-600">📧 {member.email}</p>
                            <p className="text-xs text-slate-600">📞 {member.phone}</p>
                            <p className="text-xs text-slate-600">📋 {member.activeAssignments} asignaciones activas</p>
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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Tipos de Audiencias</CardTitle>
                      <CardDescription>Configura las categorías y tipos de audiencias disponibles</CardDescription>
                    </div>
                    <Button>
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
                        .filter(type =>
                          type.name.toLowerCase().includes(typeSearch.toLowerCase()) ||
                          type.description.toLowerCase().includes(typeSearch.toLowerCase())
                        )
                        .map((type) => (
                        <Card key={type.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={CATEGORY_CONFIG[type.category as keyof typeof CATEGORY_CONFIG].color}>
                                    {CATEGORY_CONFIG[type.category as keyof typeof CATEGORY_CONFIG].name}
                                  </Badge>
                                  <h4 className="font-semibold text-slate-800">{type.name}</h4>
                                  <Badge className={type.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                    {type.active ? "Activo" : "Inactivo"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600">{type.description}</p>
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

          <TabsContent value="reportes">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Analytics</CardTitle>
                <CardDescription>Estadísticas y reportes del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">Ciudadanos Registrados</p>
                          <p className="text-2xl font-bold text-slate-800">{citizens.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">Personal Activo</p>
                          <p className="text-2xl font-bold text-slate-800">{staff.filter(s => s.status === "activo").length}</p>
                        </div>
                        <UserPlus className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">Tipos Configurados</p>
                          <p className="text-2xl font-bold text-slate-800">{audienceTypes.filter(t => t.active).length}</p>
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
                <h3 className="font-semibold text-slate-800 mb-3">Información del Ciudadano</h3>
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
                    <p className="font-medium">{format(selectedAudience.requestDate, "PPP", { locale: es })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Prioridad</p>
                    <Badge className={PRIORITY_CONFIG[selectedAudience.priority as keyof typeof PRIORITY_CONFIG].color}>
                      {PRIORITY_CONFIG[selectedAudience.priority as keyof typeof PRIORITY_CONFIG].name}
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
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
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
                    <h4 className="font-semibold text-slate-800">{selectedAudience.citizen}</h4>
                    <p className="text-sm text-slate-600">{selectedAudience.phone}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={CATEGORY_CONFIG[selectedAudience.category as keyof typeof CATEGORY_CONFIG].color}>
                        {CATEGORY_CONFIG[selectedAudience.category as keyof typeof CATEGORY_CONFIG].name}
                      </Badge>
                      <Badge className={STATUS_CONFIG[selectedAudience.status as keyof typeof STATUS_CONFIG].color}>
                        {STATUS_CONFIG[selectedAudience.status as keyof typeof STATUS_CONFIG].name}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={PRIORITY_CONFIG[selectedAudience.priority as keyof typeof PRIORITY_CONFIG].color}>
                    {PRIORITY_CONFIG[selectedAudience.priority as keyof typeof PRIORITY_CONFIG].name}
                  </Badge>
                </div>
                <p className="text-sm text-slate-700 mt-3">{selectedAudience.description}</p>
              </div>

              {/* Selección de Acción */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="action-type">Selecciona la acción a realizar</Label>
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
                      {actionType === "responder" ? "Respuesta para el ciudadano" : "Motivo del rechazo"}
                    </Label>
                    <Textarea
                      id="response"
                      placeholder={actionType === "responder"
                        ? "Escribe tu respuesta..."
                        : "Explica el motivo del rechazo..."}
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
                        min={new Date().toISOString().split('T')[0]}
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
                      <Select value={meetingFormat} onValueChange={setMeetingFormat}>
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

                {(actionType === "asignar" || actionType === "aprobar" || actionType === "programar") && (
                  <div>
                    <Label htmlFor="assigned-to">Asignar a</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Martínez">Dr. Martínez - Servicios Médicos</SelectItem>
                        <SelectItem value="Ing. López">Ing. López - Trámites y Licencias</SelectItem>
                        <SelectItem value="Lic. García">Lic. García - Asuntos Sociales</SelectItem>
                        <SelectItem value="C. Rodríguez">C. Rodríguez - Ayuda en Especie</SelectItem>
                        <SelectItem value="Coord. Eventos">Coord. Eventos - Invitaciones</SelectItem>
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
                    <p className="font-medium">{format(selectedCitizen.registrationDate, "PPP", { locale: es })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total de Solicitudes</p>
                    <p className="font-medium">{selectedCitizen.totalRequests}</p>
                  </div>
                </div>
              </div>

              {/* Notas del Expediente */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-800 mb-2">Notas del Expediente</h3>
                <Textarea
                  value={selectedCitizen.expediente.notes}
                  onChange={(e) => {
                    const updatedCitizens = citizens.map(c =>
                      c.id === selectedCitizen.id
                        ? { ...c, expediente: { ...c.expediente, notes: e.target.value } }
                        : c
                    );
                    setCitizens(updatedCitizens);
                    setSelectedCitizen({ ...selectedCitizen, expediente: { ...selectedCitizen.expediente, notes: e.target.value } });
                  }}
                  rows={3}
                  placeholder="Agregar notas sobre el ciudadano..."
                />
              </div>

              {/* Historial de Solicitudes */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-4">Historial de Solicitudes</h3>
                <div className="space-y-4">
                  {selectedCitizen.expediente.requests.map((request: any, index: number) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          <div className="lg:col-span-6">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={CATEGORY_CONFIG[request.category as keyof typeof CATEGORY_CONFIG].color}>
                                {CATEGORY_CONFIG[request.category as keyof typeof CATEGORY_CONFIG].name}
                              </Badge>
                              <span className="font-medium">{request.type}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">ID: {request.id}</p>
                            <p className="text-sm text-slate-600">
                              Fecha: {format(request.date, "PPP", { locale: es })}
                            </p>
                          </div>

                          <div className="lg:col-span-3">
                            <Badge className={STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG].color}>
                              {STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG].name}
                            </Badge>
                            {request.assignedTo && (
                              <p className="text-xs text-blue-600 mt-1">
                                Asignado a: {request.assignedTo}
                              </p>
                            )}
                          </div>

                          <div className="lg:col-span-3">
                            <div className="space-y-2">
                              <Label htmlFor={`result-${index}`}>Resultado/Observaciones</Label>
                              <Textarea
                                id={`result-${index}`}
                                value={request.result}
                                onChange={(e) => {
                                  const updatedRequests = [...selectedCitizen.expediente.requests];
                                  updatedRequests[index] = { ...updatedRequests[index], result: e.target.value };

                                  const updatedCitizen = {
                                    ...selectedCitizen,
                                    expediente: { ...selectedCitizen.expediente, requests: updatedRequests }
                                  };

                                  const updatedCitizens = citizens.map(c =>
                                    c.id === selectedCitizen.id ? updatedCitizen : c
                                  );

                                  setCitizens(updatedCitizens);
                                  setSelectedCitizen(updatedCitizen);
                                }}
                                rows={2}
                                placeholder="Resultado de la gestión..."
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    toast({
                      title: "Expediente actualizado",
                      description: "Los cambios se guardaron automáticamente"
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
                    setSelectedCitizen({ ...selectedCitizen, expediente: { ...selectedCitizen.expediente, notes: selectedCitizen.expediente.notes + "\n[" + new Date().toLocaleString() + "] Expediente revisado por " + user.name } });
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Agregar Nota de Revisión
                </Button>
                <Button variant="outline" onClick={() => setIsExpedienteOpen(false)}>
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
                    onChange={(e) => setSelectedCitizen({ ...selectedCitizen, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={selectedCitizen.phone}
                    onChange={(e) => setSelectedCitizen({ ...selectedCitizen, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedCitizen.email}
                    onChange={(e) => setSelectedCitizen({ ...selectedCitizen, email: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-address">Dirección</Label>
                  <Input
                    id="edit-address"
                    value={selectedCitizen.address}
                    onChange={(e) => setSelectedCitizen({ ...selectedCitizen, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Estado</Label>
                  <Select value={selectedCitizen.status} onValueChange={(value) => setSelectedCitizen({ ...selectedCitizen, status: value })}>
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
                    setCitizens(citizens.filter(c => c.id !== selectedCitizen.id));
                    setIsEditCitizenOpen(false);
                    toast({
                      title: "Ciudadano eliminado",
                      description: "El registro ha sido eliminado del sistema"
                    });
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditCitizenOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setCitizens(citizens.map(c => c.id === selectedCitizen.id ? selectedCitizen : c));
                      setIsEditCitizenOpen(false);
                      toast({
                        title: "Ciudadano actualizado",
                        description: "Los cambios se guardaron correctamente"
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
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="staff-role">Rol</Label>
                  <Input
                    id="staff-role"
                    value={selectedStaff.role}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, role: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="staff-department">Departamento</Label>
                  <Input
                    id="staff-department"
                    value={selectedStaff.department}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, department: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="staff-phone">Teléfono</Label>
                  <Input
                    id="staff-phone"
                    value={selectedStaff.phone}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    type="email"
                    value={selectedStaff.email}
                    onChange={(e) => setSelectedStaff({ ...selectedStaff, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="staff-status">Estado</Label>
                  <Select value={selectedStaff.status} onValueChange={(value) => setSelectedStaff({ ...selectedStaff, status: value })}>
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
                    setStaff(staff.filter(s => s.id !== selectedStaff.id));
                    setIsEditStaffOpen(false);
                    toast({
                      title: "Personal eliminado",
                      description: "El registro ha sido eliminado del sistema"
                    });
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditStaffOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setStaff(staff.map(s => s.id === selectedStaff.id ? selectedStaff : s));
                      setIsEditStaffOpen(false);
                      toast({
                        title: "Personal actualizado",
                        description: "Los cambios se guardaron correctamente"
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
                    onChange={(e) => setSelectedType({ ...selectedType, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type-category">Categoría</Label>
                  <Select value={selectedType.category} onValueChange={(value) => setSelectedType({ ...selectedType, category: value })}>
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
                    onChange={(e) => setSelectedType({ ...selectedType, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="type-active">Estado</Label>
                  <Select value={selectedType.active ? "true" : "false"} onValueChange={(value) => setSelectedType({ ...selectedType, active: value === "true" })}>
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
                    setAudienceTypes(audienceTypes.filter(t => t.id !== selectedType.id));
                    setIsEditTypeOpen(false);
                    toast({
                      title: "Tipo eliminado",
                      description: "El tipo de audiencia ha sido eliminado"
                    });
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditTypeOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      setAudienceTypes(audienceTypes.map(t => t.id === selectedType.id ? selectedType : t));
                      setIsEditTypeOpen(false);
                      toast({
                        title: "Tipo actualizado",
                        description: "Los cambios se guardaron correctamente"
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
    </div>
  );
}
