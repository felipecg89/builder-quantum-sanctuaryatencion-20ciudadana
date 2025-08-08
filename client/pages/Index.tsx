import { Link } from "react-router-dom";
import { useState } from "react";
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
  MapPin
} from "lucide-react";

export default function Index() {
  const [isEspecieModalOpen, setIsEspecieModalOpen] = useState(false);
  const [isServiciosModalOpen, setIsServiciosModalOpen] = useState(false);
  const [isInvitacionesModalOpen, setIsInvitacionesModalOpen] = useState(false);
  const [isTramitesModalOpen, setIsTramitesModalOpen] = useState(false);
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
              className="text-xl font-bold px-12 py-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-500 hover:border-blue-400 ring-4 ring-blue-200 hover:ring-blue-300"
            >
              <Link to="/login" className="flex items-center">
                🎙️ Solicitar Audiencia
                <ArrowRight className="ml-3 w-6 h-6 animate-bounce" />
              </Link>
            </Button>

            {/* Secondary Button - Ver Historial */}
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg font-semibold px-10 py-8 border-3 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm hover:border-blue-500 ring-2 ring-blue-100 hover:ring-blue-200"
            >
              <Link to="/history" className="flex items-center">
                📋 Ver Mis Audiencias
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
            <Card className="border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEspecieModalOpen(true)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                </Button>
                <div
                  className="w-12 h-12 bg-orange-100 rounded-lg mx-auto flex items-center justify-center mb-4 cursor-pointer"
                  onClick={() => setIsEspecieModalOpen(true)}
                >
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  Ayuda en Especie
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                  Alimentos, medicamentos, materiales y otros recursos
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEspecieModalOpen(true)}
                  className="text-xs hover:bg-orange-50 hover:border-orange-300"
                >
                  Ver detalles
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsServiciosModalOpen(true)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                </Button>
                <div
                  className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center mb-4 cursor-pointer"
                  onClick={() => setIsServiciosModalOpen(true)}
                >
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Servicios</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Servicios sociales, orientación y atención especializada
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsServiciosModalOpen(true)}
                  className="text-xs hover:bg-blue-50 hover:border-blue-300"
                >
                  Ver detalles
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
              <CardContent className="p-6 text-center relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsInvitacionesModalOpen(true)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8"
                >
                  <Info className="w-4 h-4 text-green-600" />
                </Button>
                <div
                  className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center mb-4 cursor-pointer"
                  onClick={() => setIsInvitacionesModalOpen(true)}
                >
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">
                  Invitaciones
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                  Eventos, ceremonias y reuniones comunitarias
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInvitacionesModalOpen(true)}
                  className="text-xs hover:bg-green-50 hover:border-green-300"
                >
                  Ver detalles
                </Button>
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

      {/* Ayuda en Especie Modal */}
      <Dialog open={isEspecieModalOpen} onOpenChange={setIsEspecieModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="w-6 h-6 text-orange-600" />
              Ayuda en Especie - Información Detallada
            </DialogTitle>
            <DialogDescription className="text-base">
              Conoce todo lo que puedes solicitar como ayuda en especie a través del programa municipal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">¿Qué es la Ayuda en Especie?</h3>
              <p className="text-orange-700 text-sm leading-relaxed">
                La ayuda en especie son bienes materiales que el municipio proporciona directamente a las familias
                que se encuentran en situación de vulnerabilidad o necesidad. No se entrega dinero, sino productos
                concretos que cubren necesidades básicas.
              </p>
            </div>

            {/* Categories */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Alimentos */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-800">Alimentos Básicos</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Despensas mensuales completas</li>
                  <li>• Leche en polvo para niños</li>
                  <li>• Fórmulas especiales para bebés</li>
                  <li>��� Productos para adultos mayores</li>
                  <li>• Suplementos nutricionales</li>
                  <li>• Canastas navideñas</li>
                </ul>
              </div>

              {/* Medicamentos */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-slate-800">Medicamentos y Salud</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Medicamentos de uso común</li>
                  <li>• Insulina y medicamentos crónicos</li>
                  <li>• Material de curación</li>
                  <li>• Equipo médico básico</li>
                  <li>• Sillas de ruedas y muletas</li>
                  <li>• Aparatos ortopédicos</li>
                </ul>
              </div>

              {/* Materiales de Construcción */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Hammer className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-slate-800">Materiales de Construcción</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Cemento y arena</li>
                  <li>• Varillas y alambrón</li>
                  <li>• Láminas para techos</li>
                  <li>• Tabiques y blocks</li>
                  <li>• Materiales para pisos</li>
                  <li>• Herramientas básicas</li>
                </ul>
              </div>

              {/* Ropa y Enseres */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shirt className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-slate-800">Ropa y Enseres</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Ropa para toda la familia</li>
                  <li>• Zapatos y calzado</li>
                  <li>• Cobijas y colchones</li>
                  <li>• Utensilios de cocina</li>
                  <li>• Artículos de higiene personal</li>
                  <li>• Productos de limpieza</li>
                </ul>
              </div>

              {/* Educación */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-slate-800">Material Educativo</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Útiles escolares completos</li>
                  <li>• Uniformes escolares</li>
                  <li>• Mochilas y zapatos escolares</li>
                  <li>• Libros y material didáctico</li>
                  <li>• Equipos de cómputo básicos</li>
                  <li>• Material para manualidades</li>
                </ul>
              </div>

              {/* Apoyo Especial */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Baby className="w-5 h-5 text-pink-500" />
                  <h4 className="font-semibold text-slate-800">Apoyo Especial</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Pañales para bebés y adultos</li>
                  <li>• Fórmulas especializadas</li>
                  <li>• Equipos para discapacidad</li>
                  <li>• Material para terapias</li>
                  <li>• Productos geriátricos</li>
                  <li>• Ayudas técnicas especiales</li>
                </ul>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Requisitos Generales</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-medium mb-2">Documentación:</h4>
                  <ul className="space-y-1">
                    <li>• Identificación oficial</li>
                    <li>• Comprobante de domicilio</li>
                    <li>• Estudio socioeconómico</li>
                    <li>• Recetas médicas (si aplica)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Condiciones:</h4>
                  <ul className="space-y-1">
                    <li>• Residencia en el municipio</li>
                    <li>• Situación de vulnerabilidad</li>
                    <li>• Evaluación socioeconómica</li>
                    <li>• Seguimiento del caso</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <Link to="/login" className="flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Solicitar Ayuda en Especie
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setIsEspecieModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Servicios Modal */}
      <Dialog open={isServiciosModalOpen} onOpenChange={setIsServiciosModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="w-6 h-6 text-blue-600" />
              Servicios Municipales - Información Detallada
            </DialogTitle>
            <DialogDescription className="text-base">
              Descubre todos los servicios profesionales y especializados que el municipio pone a tu disposición
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">¿Qué servicios ofrecemos?</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                El municipio cuenta con profesionales especializados en diferentes áreas para brindar servicios
                gratuitos o a bajo costo a la ciudadanía que los necesite. Estos servicios están diseñados para
                mejorar la calidad de vida y resolver problemáticas específicas de la comunidad.
              </p>
            </div>

            {/* Services Categories */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Servicios Sociales */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HandHeart className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-slate-800">Servicios Sociales</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Trabajo social familiar</li>
                  <li>• Programas para adultos mayores</li>
                  <li>• Apoyo a personas con discapacidad</li>
                  <li>• Orientación nutricional</li>
                  <li>• Talleres de capacitación laboral</li>
                  <li>• Programas de desarrollo comunitario</li>
                  <li>• Gestión de becas educativas</li>
                  <li>• Vinculación con programas federales</li>
                </ul>
              </div>

              {/* Servicios de Orientación */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-slate-800">Orientación y Gestión</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Gestión ante dependencias</li>
                  <li>• Orientación para trámites gubernamentales</li>
                  <li>• Apoyo en gestión de programas sociales</li>
                  <li>• Información sobre beneficios disponibles</li>
                  <li>• Canalización a instituciones especializadas</li>
                  <li>• Seguimiento de casos</li>
                  <li>• Atención ciudadana</li>
                  <li>• Resolución de conflictos vecinales</li>
                </ul>
              </div>

              {/* Servicios Especializados */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-slate-800">Servicios Especializados</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Atención a víctimas de violencia</li>
                  <li>• Programas de prevención de adicciones</li>
                  <li>• Servicios funerarios básicos</li>
                  <li>• Apoyo en situaciones de emergencia</li>
                  <li>• Servicios veterinarios básicos</li>
                  <li>• Programas de protección civil</li>
                  <li>• Servicios ambientales</li>
                  <li>• Atención en crisis</li>
                </ul>
              </div>
            </div>

            {/* How to Access */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">¿Cómo Acceder a los Servicios?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <PenTool className="w-4 h-4" />
                    1. Solicitud
                  </h4>
                  <p>Solicita una audiencia especificando el tipo de servicio que necesitas</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    2. Evaluación
                  </h4>
                  <p>Un especialista evaluará tu caso y determinará la mejor forma de ayudarte</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <HandHeart className="w-4 h-4" />
                    3. Atención
                  </h4>
                  <p>Recibirás el servicio directamente o te canalizaremos con el especialista adecuado</p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Notas Importantes</h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Los servicios están sujetos a disponibilidad y capacidad</li>
                <li>• Algunos servicios requieren cita previa</li>
                <li>• La mayoría de servicios son gratuitos para ciudadanos del municipio</li>
                <li>• Se dará prioridad según urgencia y vulnerabilidad del caso</li>
                <li>• Mantén actualizada tu información de contacto</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <Link to="/login" className="flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Solicitar Servicio
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setIsServiciosModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invitaciones Modal */}
      <Dialog open={isInvitacionesModalOpen} onOpenChange={setIsInvitacionesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-6 h-6 text-green-600" />
              Invitaciones y Eventos - Información Detallada
            </DialogTitle>
            <DialogDescription className="text-base">
              Descubre los eventos públicos, ceremonias y reuniones comunitarias organizadas por el municipio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">¿Qué son las Invitaciones Municipales?</h3>
              <p className="text-green-700 text-sm leading-relaxed">
                El municipio organiza diversos eventos públicos, ceremonias oficiales y reuniones comunitarias
                para mantener informada a la ciudadanía, celebrar fechas importantes y fomentar la participación
                ciudadana. Estas invitaciones permiten a los ciudadanos participar activamente en la vida municipal.
              </p>
            </div>

            {/* Event Categories */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Eventos Públicos */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PartyPopper className="w-5 h-5 text-blue-500" />
                  <h4 className="font-semibold text-slate-800">Eventos Públicos</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Festivales culturales municipales</li>
                  <li>• Ferias gastronómicas y artesanales</li>
                  <li>• Conciertos al aire libre</li>
                  <li>• Eventos deportivos comunitarios</li>
                  <li>• Celebraciones patrias</li>
                  <li>• Kermeses familiares</li>
                  <li>• Exposiciones artísticas</li>
                  <li>• Obras de teatro comunitarias</li>
                </ul>
              </div>

              {/* Ceremonias Oficiales */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-slate-800">Ceremonias Oficiales</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Toma de protesta de funcionarios</li>
                  <li>• Entrega de reconocimientos ciudadanos</li>
                  <li>��� Ceremonias de grito de independencia</li>
                  <li>• Inauguración de obras públicas</li>
                  <li>• Homenajes a personajes ilustres</li>
                  <li>• Graduaciones de programas municipales</li>
                  <li>• Ceremonias religiosas cívicas</li>
                  <li>• Actos protocolarios especiales</li>
                </ul>
              </div>

              {/* Reuniones Comunitarias */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-slate-800">Reuniones Comunitarias</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Asambleas ciudadanas informativas</li>
                  <li>• Consultas públicas sobre proyectos</li>
                  <li>• Reuniones de colonos y vecinos</li>
                  <li>• Sesiones de cabildo abierto</li>
                  <li>• Foros de participación ciudadana</li>
                  <li>• Presentación de informes municipales</li>
                  <li>• Mesas de diálogo comunitario</li>
                  <li>• Reuniones de comités ciudadanos</li>
                </ul>
              </div>

              {/* Eventos Informativos */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone className="w-5 h-5 text-red-500" />
                  <h4 className="font-semibold text-slate-800">Eventos Informativos</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Conferencias de prensa municipales</li>
                  <li>• Presentación de nuevos programas</li>
                  <li>• Talleres de capacitación ciudadana</li>
                  <li>• Seminarios de desarrollo comunitario</li>
                  <li>• Pláticas de salud pública</li>
                  <li>• Charlas de protección civil</li>
                  <li>• Cursos de emprendimiento</li>
                  <li>• Capacitaciones laborales gratuitas</li>
                </ul>
              </div>

              {/* Actividades Especiales */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <h4 className="font-semibold text-slate-800">Actividades Especiales</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Jornadas de salud comunitaria</li>
                  <li>• Campañas de donación de sangre</li>
                  <li>• Brigadas de limpieza comunitaria</li>
                  <li>• Programas de reforestación</li>
                  <li>• Actividades del adulto mayor</li>
                  <li>• Eventos para personas con discapacidad</li>
                  <li>• Actividades navideñas especiales</li>
                  <li>• Programas de intercambio cultural</li>
                </ul>
              </div>

              {/* Convocatorias Ciudadanas */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HandHeart className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-slate-800">Convocatorias Ciudadanas</h4>
                </div>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Concursos de fotografía municipal</li>
                  <li>• Certámenes de dibujo infantil</li>
                  <li>• Competencias deportivas locales</li>
                  <li>• Convocatorias de voluntariado</li>
                  <li>• Selección de reinas y embajadores</li>
                  <li>• Concursos gastronómicos</li>
                  <li>• Torneos de ajedrez comunitarios</li>
                  <li>• Festivales de talentos locales</li>
                </ul>
              </div>
            </div>

            {/* How to Participate */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">¿Cómo Participar en los Eventos?</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Megaphone className="w-4 h-4" />
                    1. Mantente Informado
                  </h4>
                  <p>Sigue nuestras publicaciones oficiales y redes sociales para conocer próximos eventos</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    2. Confirma Asistencia
                  </h4>
                  <p>Algunos eventos requieren confirmación previa. Registra tu asistencia cuando sea necesario</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    3. Asiste Puntualmente
                  </h4>
                  <p>Llega a tiempo al lugar indicado y participa activamente en las actividades programadas</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Beneficios de Participar</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <ul className="space-y-1">
                  <li>• Mantenerte informado sobre decisiones municipales</li>
                  <li>• Conocer nuevos programas y servicios disponibles</li>
                  <li>• Participar en la toma de decisiones comunitarias</li>
                  <li>• Fortalecer lazos comunitarios y vecinales</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Acceder a actividades culturales gratuitas</li>
                  <li>• Obtener información de primera mano</li>
                  <li>• Contribuir al desarrollo de tu comunidad</li>
                  <li>• Disfrutar de entretenimiento familiar</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <Link to="/login" className="flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Solicitar Invitación Especial
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setIsInvitacionesModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
