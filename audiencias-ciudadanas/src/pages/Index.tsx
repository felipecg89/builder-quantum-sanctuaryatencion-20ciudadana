import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  Info,
  Package,
  Stethoscope,
  HandHeart,
  Shield,
  PenTool,
  HelpCircle,
  PartyPopper,
  ClipboardCheck,
} from "lucide-react";

export default function IndexNew() {
  const [isEspecieModalOpen, setIsEspecieModalOpen] = useState(false);
  const [isServiciosModalOpen, setIsServiciosModalOpen] = useState(false);
  const [isInvitacionesModalOpen, setIsInvitacionesModalOpen] = useState(false);
  const [isTramitesModalOpen, setIsTramitesModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.authenticated) {
        setUser(parsedUser);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 sm:mb-0">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Presidencia Municipal
                </h1>
                <p className="text-slate-600">
                  Sistema de Audiencias Ciudadanas
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {user ? (
                <>
                  <span className="text-slate-600">
                    Bienvenido, <strong>{user.name}</strong>
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <a href="/login">Iniciar Sesión</a>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <a href="/register">Registrarse</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative text-center py-16 sm:py-24 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/50 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">🏛️ Sistema en línea • Atención 24/7</span>
              </div>
            </div>

            <h2 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-8 leading-tight tracking-tight">
              {user ? (
                <>
                  ¡Hola, <span className="text-blue-600">{user.name}!</span>
                </>
              ) : (
                "Tu Voz Importa"
              )}
            </h2>

            <p className="text-xl sm:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              {user
                ? "¿Qué necesitas hacer hoy? Puedes solicitar una nueva audiencia o revisar el estado de tus solicitudes anteriores."
                : "✨ Sistema digital para solicitar audiencias ciudadanas de manera fácil, rápida y transparente. Tu voz es importante para nuestra comunidad."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            {user ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <a href="/dashboard" className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Nueva Solicitud
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3"
                >
                  <a
                    href="/audience-history"
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Mis Audiencias
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <a href="/register" className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Solicitar Audiencia
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3"
                >
                  <a href="/login" className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Iniciar Sesión
                  </a>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              ¿Cómo funciona?
            </h3>
            <p className="text-slate-600 text-lg">
              Proceso simple en 3 pasos para solicitar tu audiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Regístrate</h4>
              <p className="text-slate-600">
                {user
                  ? "Completa el formulario con los detalles de tu solicitud"
                  : "Regístrate e inicia sesión para comenzar"}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">
                {user
                  ? "¡Tu audiencia te espera!"
                  : "¡Comienza tu solicitud ahora!"}
              </h4>
              <p className="text-slate-600">
                Describe tu situación y selecciona el tipo de apoyo que
                necesitas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Seguimiento</h4>
              <p className="text-slate-600">
                Recibe actualizaciones sobre el estado de tu solicitud
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white rounded-2xl shadow-sm">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              Tipos de Audiencias
            </h3>
            <p className="text-slate-600 text-lg">
              Conoce los diferentes tipos de apoyo disponibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setIsEspecieModalOpen(true)}
            >
              <CardContent className="p-6 text-center">
                <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Ayuda en Especie</h4>
                <p className="text-sm text-slate-600">
                  Alimentos, medicamentos, ropa y más
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setIsServiciosModalOpen(true)}
            >
              <CardContent className="p-6 text-center">
                <Stethoscope className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Servicios</h4>
                <p className="text-sm text-slate-600">
                  Médicos, legales, sociales y técnicos
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setIsInvitacionesModalOpen(true)}
            >
              <CardContent className="p-6 text-center">
                <PartyPopper className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Invitaciones</h4>
                <p className="text-sm text-slate-600">
                  Eventos públicos y ceremonias
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setIsTramitesModalOpen(true)}
            >
              <CardContent className="p-6 text-center">
                <ClipboardCheck className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Trámites</h4>
                <p className="text-sm text-slate-600">
                  Licencias, permisos y certificados
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-8">
              ¿Necesitas más información?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold">Teléfono</p>
                  <p className="text-slate-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-slate-600">contacto@municipio.gob.mx</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              © 2024 Presidencia Municipal. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <Dialog open={isEspecieModalOpen} onOpenChange={setIsEspecieModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ayuda en Especie</DialogTitle>
            <DialogDescription>
              Solicita apoyo material para situaciones de necesidad básica.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tipos de ayuda en especie disponibles:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Despensas y alimentos básicos</li>
              <li>Medicamentos y material médico</li>
              <li>Ropa y calzado</li>
              <li>Material escolar y útiles</li>
              <li>Material de construcción básico</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isServiciosModalOpen}
        onOpenChange={setIsServiciosModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Servicios</DialogTitle>
            <DialogDescription>
              Accede a servicios profesionales especializados.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Servicios disponibles:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Atención médica y psicológica</li>
              <li>Asesoría legal y jurídica</li>
              <li>Servicios sociales y familiares</li>
              <li>Apoyo técnico y capacitación</li>
              <li>Servicios educativos</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isInvitacionesModalOpen}
        onOpenChange={setIsInvitacionesModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitaciones</DialogTitle>
            <DialogDescription>
              Solicita invitaciones para eventos y ceremonias oficiales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Tipos de invitaciones:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Eventos cívicos y patrióticos</li>
              <li>Ceremonias oficiales</li>
              <li>Inauguraciones y entregas</li>
              <li>Conferencias y foros</li>
              <li>Actividades culturales</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTramitesModalOpen} onOpenChange={setIsTramitesModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trámites</DialogTitle>
            <DialogDescription>
              Gestiona trámites, licencias y documentos oficiales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Trámites disponibles:</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Licencias de funcionamiento</li>
              <li>Permisos de construcción</li>
              <li>Certificados y constancias</li>
              <li>Licencias de conducir</li>
              <li>Registro civil</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
