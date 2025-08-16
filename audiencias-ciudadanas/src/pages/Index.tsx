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

          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
            {user ? (
              <>
                <Button
                  asChild
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-xl border-0"
                >
                  <a href="/dashboard" className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    Nueva Solicitud
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl bg-white/70 backdrop-blur-sm"
                >
                  <a
                    href="/audience-history"
                    className="flex items-center gap-3"
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
                  className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-xl border-0 overflow-hidden group"
                >
                  <a href="/register" className="flex items-center gap-3 relative z-10">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    🚀 Solicitar Audiencia
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </a>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl bg-white/70 backdrop-blur-sm"
                >
                  <a href="/login" className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    🔐 Iniciar Sesión
                  </a>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-6">
              <span className="text-sm font-semibold text-blue-700">📋 Proceso Simple</span>
            </div>
            <h3 className="text-4xl sm:text-5xl font-black text-slate-800 mb-6">
              ¿Cómo funciona?
            </h3>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">
              Proceso simple en 3 pasos para solicitar tu audiencia ciudadana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-3xl font-black text-white">1</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/30 to-blue-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                <h4 className="text-2xl font-bold mb-3 text-slate-800">🚀 Regístrate</h4>
                <p className="text-slate-600 leading-relaxed">
                  {user
                    ? "Completa el formulario con los detalles de tu solicitud"
                    : "Regístrate e inicia sesión para comenzar el proceso"}
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-3xl font-black text-white">2</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
                <h4 className="text-2xl font-bold mb-3 text-slate-800">
                  {user
                    ? "📋 ¡Tu audiencia te espera!"
                    : "📝 ¡Comienza tu solicitud!"}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Describe tu situación y selecciona el tipo de apoyo que necesitas
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <span className="text-3xl font-black text-white">3</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
                <h4 className="text-2xl font-bold mb-3 text-slate-800">📱 Seguimiento</h4>
                <p className="text-slate-600 leading-relaxed">
                  Recibe actualizaciones en tiempo real sobre el estado de tu solicitud
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-full px-6 py-2 mb-6">
                <span className="text-sm font-semibold text-indigo-700">🏢 Servicios Municipales</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-800 mb-6">
                Tipos de Audiencias
              </h3>
              <p className="text-slate-600 text-xl max-w-3xl mx-auto">
                Conoce los diferentes tipos de apoyo y servicios disponibles para ti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300"
                onClick={() => setIsEspecieModalOpen(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-slate-800">📦 Ayuda en Especie</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Alimentos, medicamentos, ropa y apoyo material
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300"
                onClick={() => setIsServiciosModalOpen(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-slate-800">🩺 Servicios</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Médicos, legales, sociales y técnicos especializados
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300"
                onClick={() => setIsInvitacionesModalOpen(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <PartyPopper className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-slate-800">🎉 Invitaciones</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Eventos públicos, ceremonias y reconocimientos
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-300"
                onClick={() => setIsTramitesModalOpen(true)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ClipboardCheck className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-slate-800">📋 Trámites</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Licencias, permisos y certificaciones oficiales
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 text-center px-4">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <span className="text-sm font-semibold">📞 Contáctanos</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black mb-6">
                ¿Necesitas más información?
              </h3>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                Nuestro equipo está disponible para ayudarte en todo momento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-2">📞 Teléfono</h4>
                <p className="text-xl text-blue-100 font-medium">(555) 123-4567</p>
                <p className="text-blue-200 mt-2">Lunes a Viernes 8:00 AM - 6:00 PM</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-2">📧 Email</h4>
                <p className="text-xl text-blue-100 font-medium">contacto@municipio.gob.mx</p>
                <p className="text-blue-200 mt-2">Respuesta en 24 horas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Presidencia Municipal</h4>
                  <p className="text-slate-400 text-sm">Sistema de Audiencias Ciudadanas</p>
                </div>
              </div>
              <div className="border-t border-slate-700 pt-6">
                <p className="text-slate-400">
                  © 2024 Presidencia Municipal. Todos los derechos reservados.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  🏛️ Gobierno Transparente • 🤝 Atención Ciudadana • ✨ Innovación Digital
                </p>
              </div>
            </div>
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
