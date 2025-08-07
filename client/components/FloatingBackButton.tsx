import { ArrowLeft, Home, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import PulseIndicator from "./PulseIndicator";

export default function FloatingBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPressed, setIsPressed] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [destination, setDestination] = useState("");
  const [showPulse, setShowPulse] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  // Don't show on home page
  if (location.pathname === "/") {
    return null;
  }

  // Determine destination and tooltip based on current page
  useEffect(() => {
    switch (location.pathname) {
      case "/login":
        setTooltipText("Regresar al inicio");
        setDestination("home");
        break;
      case "/register":
        setTooltipText("Regresar al inicio");
        setDestination("home");
        break;
      case "/dashboard":
        setTooltipText("Salir del proceso (se perderá el progreso)");
        setDestination("home");
        break;
      default:
        setTooltipText("Página anterior");
        setDestination("back");
    }
  }, [location.pathname]);

  const getIcon = () => {
    switch (destination) {
      case "home":
        return <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />;
      case "back":
        return <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />;
      default:
        return <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />;
    }
  };

  const handleGoBack = async () => {
    setIsPressed(true);

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Check for unsaved data in Dashboard
    if (location.pathname === "/dashboard") {
      // Try to get form data from localStorage or check if there's progress
      const userData = localStorage.getItem("user");
      const hasProgress = document.querySelector('[data-progress="true"]') !== null;

      if (hasProgress) {
        const confirmed = window.confirm(
          "⚠️ ¿Estás seguro de salir?\n\nSe perderá todo el progreso de tu solicitud de audiencia.\n\n✅ Presiona OK para salir\n��� Presiona Cancelar para continuar"
        );

        if (!confirmed) {
          setIsPressed(false);
          return;
        }
      }
    }

    // Add loading delay for better UX
    setTimeout(() => {
      if (destination === "home") {
        navigate("/");
      } else if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
      setIsPressed(false);
    }, 150);
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // ESC key or Alt+Left Arrow
      if (event.key === "Escape" || (event.altKey && event.key === "ArrowLeft")) {
        event.preventDefault();
        handleGoBack();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [location.pathname]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleGoBack}
            disabled={isPressed}
            className={`
              fixed top-4 left-4 z-[100] w-14 h-14 rounded-full transition-all duration-300 group
              ${isPressed
                ? "bg-slate-200 scale-95 shadow-inner"
                : "bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl hover:scale-110"
              }
              backdrop-blur-md border-2 border-slate-200 hover:border-slate-300
              text-slate-700 hover:text-slate-900
              ${location.pathname === "/dashboard" ? "border-orange-300 hover:border-orange-400" : ""}
            `}
            size="sm"
          >
            {isPressed ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              getIcon()
            )}
            <span className="sr-only">{tooltipText}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-800 text-white border-slate-700 shadow-xl"
        >
          <div className="flex flex-col items-start space-y-1">
            <span className="font-medium">{tooltipText}</span>
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Esc</kbd>
              <span>o</span>
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Alt</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">←</kbd>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
