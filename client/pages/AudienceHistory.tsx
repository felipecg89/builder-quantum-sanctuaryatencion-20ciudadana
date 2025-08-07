import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  Filter,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Eye,
  Search,
  Lock,
  User,
  EyeOff,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Mock data for demonstration
const mockAudiences = [
  {
    id: "AUD-123456",
    category: "especie",
    type: "Alimentos",
    description: "Solicitud de apoyo alimentario para familia de 5 personas",
    status: "completada",
    requestDate: new Date("2024-01-15"),
    audienceDate: new Date("2024-01-20"),
    meetingFormat: "presencial",
    result: "Aprobada - Se otorgó despensa mensual por 3 meses",
    responses: [
      {
        date: new Date("2024-01-16"),
        author: "Oficina de Desarrollo Social",
        message: "Su solicitud ha sido recibida y está siendo evaluada por nuestro equipo."
      },
      {
        date: new Date("2024-01-18"),
        author: "Coordinador de Programas",
        message: "Se ha programado visita domiciliaria para verificar la situación familiar."
      },
      {
        date: new Date("2024-01-20"),
        author: "Director de Desarrollo Social",
        message: "Solicitud aprobada. Se autorizó entrega de despensa mensual por 3 meses."
      }
    ],
    followUps: [
      {
        date: new Date("2024-01-25"),
        status: "Entrega realizada",
        details: "Primera entrega de despensa realizada exitosamente."
      },
      {
        date: new Date("2024-02-25"),
        status: "Entrega realizada",
        details: "Segunda entrega de despensa realizada exitosamente."
      },
      {
        date: new Date("2024-03-25"),
        status: "Entrega pendiente",
        details: "Tercera entrega programada para la próxima semana."
      }
    ]
  },
  {
    id: "AUD-789012",
    category: "servicio",
    type: "Servicios médicos",
    description: "Solicitud de apoyo para cirugía de emergencia",
    status: "pendiente",
    requestDate: new Date("2024-01-22"),
    audienceDate: new Date("2024-01-28"),
    meetingFormat: "online",
    result: null,
    responses: [
      {
        date: new Date("2024-01-23"),
        author: "Oficina de Salud Municipal",
        message: "Su solicitud ha sido recibida. Se requiere documentación médica adicional."
      },
      {
        date: new Date("2024-01-25"),
        author: "Coordinador de Salud",
        message: "Documentación recibida. Se está evaluando con el comité médico."
      }
    ],
    followUps: [
      {
        date: new Date("2024-01-26"),
        status: "En evaluación",
        details: "Expediente enviado al comité médico municipal para evaluación."
      }
    ]
  },
  {
    id: "AUD-345678",
    category: "tramites",
    type: "Licencias",
    description: "Permiso para construcción de rampa de acceso",
    status: "en_proceso",
    requestDate: new Date("2024-01-18"),
    audienceDate: new Date("2024-01-25"),
    meetingFormat: "presencial",
    result: null
  },
  {
    id: "AUD-901234",
    category: "invitacion",
    type: "Evento público",
    description: "Invitación para ceremonia de reconocimiento a voluntarios",
    status: "completada",
    requestDate: new Date("2024-01-10"),
    audienceDate: new Date("2024-01-15"),
    meetingFormat: "presencial",
    result: "Confirmada - Ceremonia el 30 de enero"
  }
];

const CATEGORIES = {
  especie: { name: "Ayuda en Especie", color: "bg-orange-100 text-orange-800" },
  servicio: { name: "Servicio", color: "bg-blue-100 text-blue-800" },
  invitacion: { name: "Invitación", color: "bg-green-100 text-green-800" },
  tramites: { name: "Trámites", color: "bg-purple-100 text-purple-800" }
};

const STATUS_CONFIG = {
  completada: { name: "Completada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pendiente: { name: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  en_proceso: { name: "En Proceso", color: "bg-blue-100 text-blue-800", icon: AlertCircle }
};

export default function AudienceHistory() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedAudience, setSelectedAudience] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.authenticated) {
        setUser(parsedUser);
        setIsAuthenticated(true);
        setShowLogin(false);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login verification
    setTimeout(() => {
      // Simple validation
      if (loginData.phone && loginData.password) {
        const userData = {
          phone: loginData.phone,
          name: "Usuario Ejemplo", // In real app, this would come from backend
          authenticated: true
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setShowLogin(false);
      } else {
        alert("Por favor ingresa tu teléfono y contraseña");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setShowLogin(true);
    setLoginData({ phone: "", password: "" });
  };

  const handleViewDetails = (audience: any) => {
    setSelectedAudience(audience);
    setIsDetailsOpen(true);
  };

  const filteredAudiences = mockAudiences.filter(audience => {
    const matchesSearch = audience.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audience.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audience.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || audience.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || audience.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = audience.requestDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = audience.requestDate >= monthAgo;
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    const IconComponent = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.icon || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  // Reusable component for displaying audience lists
  const AudienceList = ({ audiences, title, emptyMessage }: {
    audiences: typeof mockAudiences,
    title: string,
    emptyMessage: string
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          {audiences.length} audiencia{audiences.length !== 1 ? 's' : ''} {title.toLowerCase()}
        </h3>
      </div>

      {audiences.length > 0 ? (
        <div className="grid gap-4">
          {audiences.map((audience) => (
            <Card key={audience.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Left Section - Main Info */}
                  <div className="lg:col-span-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-800 mb-1">{audience.id}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={CATEGORIES[audience.category as keyof typeof CATEGORIES].color}>
                            {CATEGORIES[audience.category as keyof typeof CATEGORIES].name}
                          </Badge>
                          <Badge variant="outline">{audience.type}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(audience.status)}
                        <Badge className={STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].color}>
                          {STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].name}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{audience.description}</p>
                  </div>

                  {/* Right Section - Dates & Actions */}
                  <div className="lg:col-span-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Solicitada: {format(audience.requestDate, "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>Audiencia: {format(audience.audienceDate, "dd/MM/yyyy", { locale: es })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        {audience.meetingFormat === "presencial" ?
                          <Building2 className="w-4 h-4" /> :
                          <Phone className="w-4 h-4" />
                        }
                        <span>{audience.meetingFormat === "presencial" ? "Presencial" : "En línea"}</span>
                      </div>
                    </div>

                    {audience.result && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">Resultado:</p>
                        <p className="text-green-700 text-sm">{audience.result}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2 flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Sin audiencias</h3>
            <p className="text-slate-600 mb-4">{emptyMessage}</p>
            <Button asChild>
              <Link to="/register">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Solicitud
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar al Inicio
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Presidencia Municipal</h1>
            <p className="text-slate-600 mt-1">Sistema de Audiencias</p>
          </div>

          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">Acceder al Historial</CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para ver tus audiencias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ej: 55 1234 5678"
                      value={loginData.phone}
                      onChange={(e) => setLoginData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verificando..." : "Acceder al Historial"}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">O</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-3">
                    ¿No tienes cuenta?
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                  >
                    <Link to="/register" className="flex items-center justify-center">
                      <User className="w-4 h-4 mr-2" />
                      Crear Nueva Cuenta
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-slate-500">
            Sistema oficial de audiencias municipales
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full">
                <Building2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-slate-800">Historial de Audiencias</h1>
                <p className="text-sm sm:text-base text-slate-600">Bienvenido, {user?.name || 'Usuario'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none"
              >
                <Link to="/register" className="flex items-center justify-center gap-1 sm:gap-2">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">Nueva Solicitud</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none"
              >
                <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="truncate">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="completed">Completadas</TabsTrigger>
              <TabsTrigger value="process">En Proceso</TabsTrigger>
            </TabsList>
          </div>

          {/* Filters Section */}
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-slate-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filtros de Búsqueda
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isFiltersOpen ? "rotate-180" : ""
                      }`}
                    />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Buscar</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="search"
                          placeholder="ID, descripción o tipo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Categoría</Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las categorías" />
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

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los estados</SelectItem>
                          <SelectItem value="completada">Completadas</SelectItem>
                          <SelectItem value="pendiente">Pendientes</SelectItem>
                          <SelectItem value="en_proceso">En Proceso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha</Label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las fechas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las fechas</SelectItem>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Results */}
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {filteredAudiences.length} audiencia{filteredAudiences.length !== 1 ? 's' : ''} encontrada{filteredAudiences.length !== 1 ? 's' : ''}
              </h3>
            </div>

            <div className="grid gap-4">
              {filteredAudiences.map((audience) => (
                <Card key={audience.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Left Section - Main Info */}
                      <div className="lg:col-span-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800 mb-1">{audience.id}</h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={CATEGORIES[audience.category as keyof typeof CATEGORIES].color}>
                                {CATEGORIES[audience.category as keyof typeof CATEGORIES].name}
                              </Badge>
                              <Badge variant="outline">{audience.type}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(audience.status)}
                            <Badge className={STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].color}>
                              {STATUS_CONFIG[audience.status as keyof typeof STATUS_CONFIG].name}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{audience.description}</p>
                      </div>

                      {/* Right Section - Dates & Actions */}
                      <div className="lg:col-span-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>Solicitada: {format(audience.requestDate, "dd/MM/yyyy", { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>Audiencia: {format(audience.audienceDate, "dd/MM/yyyy", { locale: es })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            {audience.meetingFormat === "presencial" ? 
                              <Building2 className="w-4 h-4" /> : 
                              <Phone className="w-4 h-4" />
                            }
                            <span>{audience.meetingFormat === "presencial" ? "Presencial" : "En línea"}</span>
                          </div>
                        </div>

                        {audience.result && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 text-sm font-medium">Resultado:</p>
                            <p className="text-green-700 text-sm">{audience.result}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2 flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAudiences.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No se encontraron audiencias</h3>
                  <p className="text-slate-600 mb-4">
                    No hay audiencias que coincidan con los filtros seleccionados.
                  </p>
                  <Button asChild>
                    <Link to="/register">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primera Solicitud
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending">
            <AudienceList
              audiences={filteredAudiences.filter(a => a.status === "pendiente")}
              title="Audiencias Pendientes"
              emptyMessage="No tienes audiencias pendientes en este momento."
            />
          </TabsContent>

          <TabsContent value="completed">
            <AudienceList
              audiences={filteredAudiences.filter(a => a.status === "completada")}
              title="Audiencias Completadas"
              emptyMessage="No tienes audiencias completadas aún."
            />
          </TabsContent>

          <TabsContent value="process">
            <AudienceList
              audiences={filteredAudiences.filter(a => a.status === "en_proceso")}
              title="Audiencias en Proceso"
              emptyMessage="No tienes audiencias en proceso actualmente."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
