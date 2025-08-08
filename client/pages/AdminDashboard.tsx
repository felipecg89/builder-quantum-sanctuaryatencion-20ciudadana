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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="audiencias">Gestión de Audiencias</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
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
                            <Button size="sm" className="w-full">
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

          {/* Otras pestañas */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Funcionalidad en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reportes">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Analytics</CardTitle>
                <CardDescription>Estadísticas y reportes del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Funcionalidad en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracion">
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Sistema</CardTitle>
                <CardDescription>Ajustes generales y configuración</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Funcionalidad en desarrollo...</p>
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
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprobar
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Responder
                </Button>
                <Button variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Programar
                </Button>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
