import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Phone,
  Lock,
  Building2,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
} from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordPhone, setForgotPasswordPhone] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      // Store user session (in a real app, this would be handled by proper auth)
      localStorage.setItem(
        "user",
        JSON.stringify({
          phone,
          name: "María González",
          authenticated: true,
        }),
      );
      navigate("/dashboard");
    }, 1000);
  };

  const handleDirectToTurnos = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication for direct access to turnos
    setTimeout(() => {
      // Store user session
      localStorage.setItem(
        "user",
        JSON.stringify({
          phone,
          name: "María González",
          authenticated: true,
        }),
      );
      navigate("/turnos");
    }, 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordPhone.trim()) {
      alert("Por favor ingresa tu número de teléfono");
      return;
    }

    setIsRecovering(true);

    // Simulate password recovery
    setTimeout(() => {
      alert(
        `Se han enviado las instrucciones de recuperación al número ${forgotPasswordPhone}`,
      );
      setShowForgotPassword(false);
      setForgotPasswordPhone("");
      setIsRecovering(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0052CC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white text-[#0052CC] hover:bg-gray-100 font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-white"
          >
            <ArrowLeft className="w-4 h-4" />
            REGRESAR AL INICIO
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-xl shadow-xl border-4 border-[#DC2626] mb-4">
            <Building2 className="w-10 h-10 text-[#0052CC]" />
          </div>
          <h1 className="text-3xl font-black text-white">
            PRESIDENCIA MUNICIPAL
          </h1>
          <p className="text-white/90 mt-1 font-bold">SISTEMA DE AUDIENCIAS</p>
        </div>

        <Card className="bg-white rounded-xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              Solicitar Audiencia
            </CardTitle>
            <CardDescription className="text-center">
              Inicia sesión para comenzar tu solicitud de audiencia
            </CardDescription>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm text-center">
                  🎯 <strong>Solicitudes generales:</strong> Login → Dashboard →
                  Solicitar
                </p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm text-center">
                  🏛️ <strong>Audiencias con Presidente:</strong> Solo viernes
                  9:00-12:00 PM
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Número de Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ej: 55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                {/* Botón directo para Audiencias Públicas de Viernes */}
                <Button
                  type="button"
                  onClick={handleDirectToTurnos}
                  className="w-full bg-[#DC2626] hover:bg-red-700 text-white font-bold"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Accediendo..."
                    : "🏛️ IR A AUDIENCIAS PÚBLICAS DE VIERNES"}
                </Button>
              </div>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-slate-600 hover:text-blue-600 text-sm p-0 h-auto"
                onClick={() => setShowForgotPassword(true)}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>

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
                  ¿Es tu primera vez?
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
                >
                  <Link
                    to="/register"
                    className="flex items-center justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Crear Nueva Cuenta
                  </Link>
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Registro rápido con solo tus datos básicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          Sistema oficial de audiencias municipales
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Recuperar Contraseña
                  </h3>
                  <p className="text-slate-600 text-sm mt-2">
                    Ingresa tu número de teléfono y te enviaremos instrucciones
                    para restablecer tu contraseña
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgotPhone">Número de Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="forgotPhone"
                        type="tel"
                        placeholder="Ej: 55 1234 5678"
                        value={forgotPasswordPhone}
                        onChange={(e) => setForgotPasswordPhone(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordPhone("");
                      }}
                      disabled={isRecovering}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isRecovering}
                    >
                      {isRecovering ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Instrucciones"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-xs text-center">
                    📱 Recibirás un SMS con las instrucciones para crear una
                    nueva contraseña
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
