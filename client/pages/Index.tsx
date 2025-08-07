import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

export default function Index() {
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
            <div className="flex space-x-3">
              <Button asChild variant="outline">
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Solicita tu Audiencia con el{" "}
            <span className="text-blue-600">Presidente Municipal</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Sistema digital para solicitar audiencias ciudadanas de manera
            fácil, rápida y transparente. Tu voz es importante para nuestra
            comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Primary CTA Button - Solicitar Audiencia */}
            <Button
              size="lg"
              asChild
              className="text-xl font-bold px-12 py-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-500 hover:border-blue-400 ring-4 ring-blue-200 hover:ring-blue-300 animate-pulse hover:animate-none"
            >
              <Link to="/register" className="flex items-center">
                🎙️ Solicitar Audiencia
                <ArrowRight className="ml-3 w-6 h-6 animate-bounce" />
              </Link>
            </Button>

            {/* Secondary Button - Ya tengo cuenta */}
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg font-semibold px-10 py-8 border-3 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-500 ring-2 ring-blue-100 hover:ring-blue-200"
            >
              <Link to="/login" className="flex items-center">
                👤 Ya tengo cuenta
              </Link>
            </Button>
          </div>

          {/* Additional visual emphasis */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600 font-medium animate-bounce">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
              <span className="text-sm">¡Comienza tu solicitud ahora!</span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            ¿Cómo funciona nuestro sistema?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Registro Simple</CardTitle>
                <CardDescription>
                  Regístrate con tus datos básicos y crea tu cuenta en minutos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Solicita tu Audiencia</CardTitle>
                <CardDescription>
                  Completa el formulario y describe tu solicitud con audio
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Agenda tu Cita</CardTitle>
                <CardDescription>
                  Recibe tu número de caso y confirma la fecha de tu audiencia
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Tipos de Audiencias Disponibles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  Ayuda en Especie
                </h4>
                <p className="text-sm text-slate-600">
                  Alimentos, medicamentos, materiales y otros recursos
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Servicios</h4>
                <p className="text-sm text-slate-600">
                  Servicios médicos, legales, sociales y técnicos
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  Invitaciones
                </h4>
                <p className="text-sm text-slate-600">
                  Eventos, ceremonias y reuniones comunitarias
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Trámites</h4>
                <p className="text-sm text-slate-600">
                  Licencias, permisos, certificados y registros
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 bg-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-slate-800 mb-2">
                Horarios de Atención
              </h4>
              <p className="text-slate-600">
                Lunes a Viernes
                <br />
                9:00 AM - 5:00 PM
              </p>
            </div>

            <div>
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-slate-800 mb-2">Contacto</h4>
              <p className="text-slate-600">
                (55) 1234-5678
                <br />
                Ext. 100
              </p>
            </div>

            <div>
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-slate-800 mb-2">
                Correo Electrónico
              </h4>
              <p className="text-slate-600">audiencias@municipio.gob.mx</p>
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
          <p className="text-slate-400 mb-4">
            Sistema oficial de audiencias ciudadanas
          </p>
          <p className="text-slate-500 text-sm">
            © 2024 Presidencia Municipal. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
