import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Search
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
    result: "Aprobada - Se otorgó despensa mensual por 3 meses"
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
    result: null
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
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Historial de Audiencias</h1>
                <p className="text-slate-600">Gestiona y consulta tus solicitudes</p>
              </div>
            </div>
            
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Link to="/register" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nueva Solicitud
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
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
          </Card>

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
