import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  LogOut,
  Mic,
  MicOff,
  Calendar as CalendarIcon,
  Plus,
  Phone,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORIES = {
  especie: "Ayuda en Especie",
  servicio: "Servicio",
  invitacion: "Invitación",
  tramites: "Trámites",
};

const CATEGORY_TYPES = {
  especie: ["Alimentos", "Medicamentos", "Ropa", "Materiales de construcción"],
  servicio: [
    "Servicios médicos",
    "Servicios legales",
    "Servicios sociales",
    "Servicios técnicos",
  ],
  invitacion: [
    "Evento público",
    "Ceremonia oficial",
    "Reunión comunitaria",
    "Conferencia",
  ],
  tramites: ["Licencias", "Permisos", "Certificados", "Registros"],
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [audioDescription, setAudioDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [caseNumber, setCaseNumber] = useState("");
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [newTypeValue, setNewTypeValue] = useState("");
  const [isLoadingNewType, setIsLoadingNewType] = useState(false);
  const [newTypeError, setNewTypeError] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    type: "",
    description: "",
    meetingFormat: "",
    selectedDate: null as Date | null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (!parsedUser.authenticated) {
      navigate("/login");
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({ ...prev, category, type: "" }));
  };

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const addNewType = async () => {
    // Reset error
    setNewTypeError("");

    // Validation
    if (!newTypeValue.trim()) {
      setNewTypeError("Por favor ingresa un nombre para el tipo");
      return;
    }

    if (newTypeValue.trim().length < 3) {
      setNewTypeError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!formData.category) {
      setNewTypeError("Primero selecciona una categoría");
      return;
    }

    // Check if type already exists
    const existingTypes = CATEGORY_TYPES[formData.category as keyof typeof CATEGORY_TYPES];
    if (existingTypes.some(type => type.toLowerCase() === newTypeValue.trim().toLowerCase())) {
      setNewTypeError("Este tipo ya existe en la categoría");
      return;
    }

    setIsLoadingNewType(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the new type
      CATEGORY_TYPES[formData.category as keyof typeof CATEGORY_TYPES].push(
        newTypeValue.trim(),
      );

      // Select the new type
      setFormData((prev) => ({ ...prev, type: newTypeValue.trim() }));

      // Reset form
      setNewTypeValue("");
      setNewTypeError("");
      setIsAddingNewType(false);

      // Show success message (you could add a toast here)
      console.log("Nuevo tipo agregado exitosamente:", newTypeValue.trim());

    } catch (error) {
      setNewTypeError("Error al agregar el tipo. Intenta nuevamente.");
    } finally {
      setIsLoadingNewType(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, implement actual audio recording
    setTimeout(() => {
      setIsRecording(false);
      setAudioDescription("Descripción de audio grabada correctamente");
    }, 3000);
  };

  const handleSubmit = () => {
    // Generate case number
    const caseNum = `AUD-${Date.now().toString().slice(-6)}`;
    setCaseNumber(caseNum);
    setCurrentStep(6);

    // In a real app, send data to backend and send email/SMS
    console.log("Audience request submitted:", {
      ...formData,
      caseNumber: caseNum,
    });
  };

  const resetForm = () => {
    setFormData({
      category: "",
      type: "",
      description: "",
      meetingFormat: "",
      selectedDate: null,
    });
    setCurrentStep(1);
    setCaseNumber("");
    setAudioDescription("");
  };

  if (!user) return null;

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!formData.category;
      case 2:
        return !!formData.type;
      case 3:
        return !!audioDescription;
      case 4:
        return !!formData.meetingFormat;
      case 5:
        return formData.meetingFormat === "online" || !!formData.selectedDate;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                Presidencia Municipal
              </h1>
              <p className="text-sm text-slate-600">Sistema de Audiencias</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              Bienvenido, {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep < 6 ? (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep === step
                          ? "bg-blue-600 text-white"
                          : isStepComplete(step)
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isStepComplete(step) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 5 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          isStepComplete(step) ? "bg-green-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-600">
                <span>Categoría</span>
                <span>Tipo</span>
                <span>Descripción</span>
                <span>Formato</span>
                <span>Fecha</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 &&
                    "Paso 1: Selecciona la Categoría de Ayuda"}
                  {currentStep === 2 && "Paso 2: Selecciona el Tipo de Ayuda"}
                  {currentStep === 3 && "Paso 3: Describe tu Solicitud"}
                  {currentStep === 4 && "Paso 4: Formato de la Audiencia"}
                  {currentStep === 5 && "Paso 5: Selecciona la Fecha"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 &&
                    "Elige la categoría que mejor describa tu solicitud"}
                  {currentStep === 2 &&
                    "Especifica el tipo de ayuda que necesitas"}
                  {currentStep === 3 &&
                    "Usa el micrófono para grabar una descripción detallada"}
                  {currentStep === 4 &&
                    "¿Prefieres una audiencia presencial o en línea?"}
                  {currentStep === 5 &&
                    "Selecciona una fecha disponible para tu audiencia"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Category Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <RadioGroup
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      {Object.entries(CATEGORIES).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="font-medium">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Step 2: Type Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Select
                      value={formData.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo específico" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category &&
                          CATEGORY_TYPES[
                            formData.category as keyof typeof CATEGORY_TYPES
                          ]?.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={isAddingNewType}
                      onOpenChange={setIsAddingNewType}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Nuevo Tipo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Tipo</DialogTitle>
                          <DialogDescription>
                            Describe el nuevo tipo de ayuda para la categoría:{" "}
                            {
                              CATEGORIES[
                                formData.category as keyof typeof CATEGORIES
                              ]
                            }
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="newType">Nombre del tipo</Label>
                            <Input
                              id="newType"
                              placeholder="Ej: Apoyo educativo, Servicios veterinarios..."
                              value={newTypeValue}
                              onChange={(e) => {
                                setNewTypeValue(e.target.value);
                                setNewTypeError(""); // Clear error when typing
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !isLoadingNewType) {
                                  addNewType();
                                }
                              }}
                              className={newTypeError ? "border-red-500 focus-visible:ring-red-500" : ""}
                              disabled={isLoadingNewType}
                            />
                            {newTypeError && (
                              <p className="text-sm text-red-600 flex items-center gap-1">
                                <span className="w-4 h-4">⚠️</span>
                                {newTypeError}
                              </p>
                            )}
                            <p className="text-xs text-slate-500">
                              Mínimo 3 caracteres. Será agregado a "{CATEGORIES[formData.category as keyof typeof CATEGORIES]}"
                            </p>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsAddingNewType(false);
                                setNewTypeValue("");
                                setNewTypeError("");
                              }}
                              disabled={isLoadingNewType}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={addNewType}
                              disabled={isLoadingNewType || !newTypeValue.trim()}
                              className="min-w-[100px]"
                            >
                              {isLoadingNewType ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Agregando...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Plus className="w-4 h-4" />
                                  Agregar
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* Step 3: Audio Description */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Button
                        onClick={startRecording}
                        disabled={isRecording}
                        className={`w-32 h-32 rounded-full ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-12 h-12" />
                        ) : (
                          <Mic className="w-12 h-12" />
                        )}
                      </Button>
                      <p className="mt-4 text-sm text-slate-600">
                        {isRecording
                          ? "Grabando... Habla claramente"
                          : "Presiona para grabar tu descripción"}
                      </p>
                    </div>

                    {audioDescription && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-sm font-medium">
                          ✓ {audioDescription}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Meeting Format */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <RadioGroup
                      value={formData.meetingFormat}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          meetingFormat: value,
                        }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="presencial" id="presencial" />
                        <Label htmlFor="presencial" className="font-medium">
                          Presencial - En las oficinas municipales
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="font-medium">
                          En Línea - Lo contactaremos vía telefónica
                        </Label>
                      </div>
                    </RadioGroup>

                    {formData.meetingFormat === "online" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <p className="text-blue-800 text-sm">
                            Nos comunicaremos contigo al número:{" "}
                            <strong>{user.phone}</strong>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Date Selection */}
                {currentStep === 5 &&
                  formData.meetingFormat === "presencial" && (
                    <div className="space-y-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "PPP", { locale: es })
                              : "Selecciona una fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              setSelectedDate(date);
                              setFormData((prev) => ({
                                ...prev,
                                selectedDate: date,
                              }));
                            }}
                            disabled={(date) =>
                              date < new Date() ||
                              date.getDay() === 0 ||
                              date.getDay() === 6
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <p className="text-sm text-slate-600">
                        * Las audiencias están disponibles de lunes a viernes en
                        horario de oficina
                      </p>
                    </div>
                  )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepComplete(currentStep)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 disabled:shadow-none px-6 py-2.5"
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepComplete(currentStep)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:hover:scale-100 disabled:shadow-none px-6 py-2.5"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Solicitud
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Success/Confirmation Step */
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                ¡Solicitud Enviada Exitosamente!
              </h2>

              <div className="bg-slate-100 rounded-lg p-6 mb-6">
                <p className="text-lg font-semibold text-slate-800 mb-2">
                  Tu número de caso es:
                </p>
                <p className="text-3xl font-bold text-blue-600">{caseNumber}</p>
              </div>

              <div className="text-sm text-slate-600 space-y-2 mb-8">
                <p>
                  Hemos enviado los detalles de tu solicitud a tu correo
                  electrónico y un mensaje SMS a tu teléfono{" "}
                  <strong>{user.phone}</strong>
                </p>
                <p>
                  Te contactaremos pronto para confirmar los detalles de tu
                  audiencia.
                </p>
              </div>

              <Button onClick={resetForm} className="mr-4">
                Nueva Solicitud
              </Button>

              <Button variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
