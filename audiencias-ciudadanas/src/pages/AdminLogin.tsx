import { useState } from "react";
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
  Building2,
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowLeft,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@municipio.gob.mx");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto-login para desarrollo
  const handleDevLogin = () => {
    const adminData = {
      id: "admin_001",
      name: "Administrador Municipal",
      email: "admin@municipio.gob.mx",
      role: "admin",
      authenticated: true,
      permissions: ["read", "write", "delete", "manage_users"],
    };

    localStorage.setItem("adminUser", JSON.stringify(adminData));
    navigate("/AdminDashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate admin authentication
    setTimeout(() => {
      // Simple validation - En producción sería contra una API
      if (email && password) {
        // Mock admin data
        const adminData = {
          id: "admin_001",
          name: "Administrador Municipal",
          email: email,
          role: "admin",
          authenticated: true,
          permissions: ["read", "write", "delete", "manage_users"],
        };

        localStorage.setItem("adminUser", JSON.stringify(adminData));
        navigate("/AdminDashboard");
      } else {
        alert("Por favor ingresa email y contraseña válidos");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0052CC] via-blue-800 to-[#DC2626] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Regresar al Sitio Ciudadano
          </Button>
        </div>

        {/* Header - Estilo Telmex */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-xl shadow-xl mb-6 border-4 border-[#DC2626]">
            <Building2 className="w-10 h-10 text-[#0052CC]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            🏛️ PANEL ADMINISTRATIVO
          </h1>
          <p className="text-white/90 text-lg font-medium">
            SISTEMA DE AUDIENCIAS MUNICIPALES
          </p>
        </div>

        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-1 bg-[#0052CC] text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center font-bold">
              <Shield className="w-6 h-6 inline mr-2" />
              Acceso de Administrador
            </CardTitle>
            <CardDescription className="text-center text-white/90">
              Ingresa tus credenciales administrativas para acceder al panel de control
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0052CC] font-semibold">
                  Email Administrativo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@municipio.gob.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-[#0052CC] focus:ring-[#0052CC]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#0052CC] font-semibold">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña administrativa"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-2 border-gray-200 focus:border-[#0052CC] focus:ring-[#0052CC]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-[#0052CC] hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-3 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando credenciales...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Acceder al Panel Administrativo
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Credentials - Estilo Telmex */}
            <div className="mt-6 p-4 bg-[#0052CC]/10 rounded-lg border-2 border-[#0052CC]/20">
              <h4 className="text-[#0052CC] font-bold mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Credenciales de Demostración
              </h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Email:</strong> admin@municipio.gob.mx
                </p>
                <p>
                  <strong>Contraseña:</strong> admin123
                </p>
                <p className="text-xs text-[#0052CC] mt-2">
                  * En producción se usaría autenticación segura con 2FA
                </p>
              </div>

              {/* Botón de acceso rápido para desarrollo */}
              <Button
                type="button"
                onClick={handleDevLogin}
                className="w-full mt-4 bg-[#DC2626] hover:bg-red-700 text-white font-bold py-2 shadow-lg"
              >
                🚀 Acceso Rápido - Desarrollo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-white/90 text-sm font-medium">
            🔒 Sistema seguro protegido con encriptación SSL
          </p>
          <p className="text-white/70 text-xs mt-2">
            Versión 2024.1 - Panel Administrativo Municipal
          </p>
        </div>
      </div>
    </div>
  );
}
