import { Link } from "react-router-dom";
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
  Calendar,
  Users,
  FileText,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  Info,
  Package,
  Heart,
  Home,
  GraduationCap,
  Baby,
  Pill,
  Hammer,
  Shirt,
  Stethoscope,
  Scale,
  HandHeart,
  Wrench,
  MessageSquare,
  Shield,
  PenTool,
  HelpCircle,
  PartyPopper,
  Award,
  Megaphone,
  MapPin,
  CreditCard,
  Car,
  Store,
  ClipboardCheck,
  Stamp,
  FileCheck,
  ArrowDown,
  CheckCircle2
} from "lucide-react";

export default function IndexNew() {
  const [isEspecieModalOpen, setIsEspecieModalOpen] = useState(false);
  const [isServiciosModalOpen, setIsServiciosModalOpen] = useState(false);
  const [isInvitacionesModalOpen, setIsInvitacionesModalOpen] = useState(false);
  const [isTramitesModalOpen, setIsTramitesModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Verificar si el usuario está logueado
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Presidencia Municipal
                </h1>
                <p className="text-sm text-slate-600">
                  Sistema de Audiencias Ciudadanas
                </p>
              </div>
            </div>
            
            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">
                    Bienvenido, {user.name}
                  </p>
                  <p className="text-xs text-slate-600">{user.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            {user ? (
              <>¡Hola, <span className="text-blue-600">{user.name}!</span></>
            ) : (
              <>
                Solicita tu Audiencia con el{" "}
                <span className="text-blue-600">Presidente Municipal</span>
              </>
            )}
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            {user ? (
              "¿Qué necesitas hacer hoy? Puedes solicitar una nueva audiencia o revisar el estado de tus solicitudes anteriores."
            ) : (
              "Sistema digital para solicitar audiencias ciudadanas de manera fácil, rápida y transparente. Tu voz es importante para nuestra comunidad."
            )}
          </p>
          
          {user ? (
            // Usuario Logueado - Mostrar opciones
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                asChild
                className="text-xl font-bold px-12 py-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-500 hover:border-blue-400 ring-4 ring-blue-200 hover:ring-blue-300"
              >
                <Link to="/dashboard" className="flex items-center">
                  🎯 Solicitar Audiencia
                  <ArrowRight className="ml-3 w-6 h-6 animate-bounce" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-xl font-bold px-12 py-8 border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ring-2 ring-blue-100 hover:ring-blue-200"
              >
                <Link to="/history" className="flex items-center">
                  📋 Ver Mis Audiencias
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </div>
          ) : (
            // Usuario No Logueado - Mostrar login
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                asChild
                className="text-xl font-bold px-12 py-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-500 hover:border-blue-400 ring-4 ring-blue-200 hover:ring-blue-300"
              >
                <Link to="/login" className="flex items-center">
                  🔐 Iniciar Sesión
                  <ArrowRight className="ml-3 w-6 h-6 animate-bounce" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-xl font-bold px-12 py-8 border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ring-2 ring-green-100 hover:ring-green-200"
              >
                <Link to="/register" className="flex items-center">
                  📝 Registrarse
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </Button>
            </div>
          )}

          {/* Additional visual emphasis */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600 font-medium animate-bounce">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              <span className="text-sm">
                {user ? "¡Tu audiencia te espera!" : "¡Comienza tu solicitud ahora!"}
              </span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo funciona nuestro sistema? */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            ¿Cómo funciona nuestro sistema?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-10 h-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                1. Registra tu solicitud
              </h4>
              <p className="text-slate-600">
                {user ? "Completa el formulario con los detalles de tu solicitud" : "Regístrate e inicia sesión para comenzar"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                2. Revisión y programación
              </h4>
              <p className="text-slate-600">
                Nuestro equipo revisa tu solicitud y programa tu audiencia
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HandHeart className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                3. Recibe atención personalizada
              </h4>
              <p className="text-slate-600">
                Obtén la ayuda que necesitas de manera rápida y efectiva
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Información Detallada */}
      {!user && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
              Tipos de Solicitudes Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Ayuda en Especie */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsEspecieModalOpen(true)}>
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                  <h4 className="text-lg font-semibold mb-2">Ayuda en Especie</h4>
                  <p className="text-sm text-slate-600">Alimentos, medicamentos, ropa y más</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    Más información
                  </Button>
                </CardContent>
              </Card>

              {/* Servicios */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsServiciosModalOpen(true)}>
                <CardContent className="p-6 text-center">
                  <Stethoscope className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="text-lg font-semibold mb-2">Servicios</h4>
                  <p className="text-sm text-slate-600">Médicos, legales, sociales y técnicos</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    Más información
                  </Button>
                </CardContent>
              </Card>

              {/* Invitaciones */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsInvitacionesModalOpen(true)}>
                <CardContent className="p-6 text-center">
                  <PartyPopper className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h4 className="text-lg font-semibold mb-2">Invitaciones</h4>
                  <p className="text-sm text-slate-600">Eventos públicos y ceremonias</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    Más información
                  </Button>
                </CardContent>
              </Card>

              {/* Trámites */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsTramitesModalOpen(true)}>
                <CardContent className="p-6 text-center">
                  <ClipboardCheck className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h4 className="text-lg font-semibold mb-2">Trámites</h4>
                  <p className="text-sm text-slate-600">Licencias, permisos y certificados</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    <Info className="w-4 h-4 mr-2" />
                    Más información
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Contact Information */}
      <section className="py-16 px-4 bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">¿Necesitas más información?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-semibold">Teléfono</p>
                <p className="text-slate-300">(55) 1234-5678</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-slate-300">audiencias@municipio.gob.mx</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-semibold">Horarios</p>
                <p className="text-slate-300">Lun - Vie: 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold">Presidencia Municipal</span>
          </div>
          <p className="text-slate-400 mb-6">
            Sistema oficial de audiencias ciudadanas
          </p>

          {/* Admin Access */}
          <div className="border-t border-slate-700 pt-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-400 hover:text-white hover:border-slate-500"
              >
                <Link to="/admin/login" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Acceso Administrativo
                </Link>
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Paneles exclusivos para funcionarios municipales
            </p>
          </div>

          <p className="text-slate-500 text-sm">
            © 2024 Presidencia Municipal. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modales informativos - mantener los existentes */}
      {/* Resto de modales... */}
    </div>
  );
}
