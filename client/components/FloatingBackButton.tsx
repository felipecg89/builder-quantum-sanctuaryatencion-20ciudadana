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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine destination and tooltip based on current page
  useEffect(() => {
    switch (location.pathname) {
      case "/login":
        setTooltipText("Regresar al inicio");
        setDestination("home");
        setShowPulse(false);
        break;
      case "/register":
        setTooltipText("Regresar al inicio");
        setDestination("home");
        setShowPulse(false);
        break;
      case "/dashboard":
        setTooltipText("Salir del proceso (se perderá el progreso)");
        setDestination("home");
        // Show pulse if user has been on dashboard for more than 30 seconds
        const pulseTimer = setTimeout(() => setShowPulse(true), 30000);
        return () => clearTimeout(pulseTimer);
      default:
        setTooltipText("Página anterior");
        setDestination("back");
        setShowPulse(false);
    }
  }, [location.pathname]);

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      // Long press detected - show quick exit option
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
      const quickExit = window.confirm("🚀 Salida rápida al inicio?\n\n⚡ Presiona OK para ir directamente al inicio");
      if (quickExit) {
        navigate("/");
      }
    }, 1000);
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

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
          "⚠️ ¿Estás seguro de salir?\n\nSe perderá todo el progreso de tu solicitud de audiencia.\n\n✅ Presiona OK para salir\n❌ Presiona Cancelar para continuar"
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

  // Check for open modals/dialogs
  useEffect(() => {
    const checkForModals = () => {
      // Check for common modal patterns
      const hasDialog = document.querySelector('[role="dialog"][data-state="open"]');
      const hasModalBackdrop = document.querySelector('.fixed.inset-0.z-50, .fixed.inset-0.z-\\[50\\]');
      const hasOpenModal = document.querySelector('[data-state="open"]');

      setIsModalOpen(!!(hasDialog || hasModalBackdrop || hasOpenModal));
    };

    // Check immediately
    checkForModals();

    // Check periodically (lightweight)
    const interval = setInterval(checkForModals, 500);

    return () => clearInterval(interval);
  }, []);

  // Don't show on home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
              onClick={handleGoBack}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              disabled={isPressed}
              className={`
                fixed top-4 left-4 z-40 w-14 h-14 rounded-full transition-all duration-300 group
                ${isPressed
                  ? "bg-slate-200 scale-95 shadow-inner"
                  : "bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl hover:scale-110"
                }
                backdrop-blur-md border-2 border-slate-200 hover:border-slate-300
                text-slate-700 hover:text-slate-900
                ${location.pathname === "/dashboard" ? "border-orange-300 hover:border-orange-400" : ""}
                ${showPulse ? "animate-pulse" : ""}
                ${isModalOpen ? "opacity-0 pointer-events-none scale-75" : "opacity-100 pointer-events-auto scale-100"}
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

            {/* Pulse indicator for urgent attention */}
            <PulseIndicator
              show={showPulse && location.pathname === "/dashboard"}
              color="orange"
              size="sm"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-slate-800 text-white border-slate-700 shadow-xl max-w-xs"
        >
          <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              {getIcon()}
              <span className="font-medium">{tooltipText}</span>
            </div>

            {/* Page context */}
            {location.pathname === "/dashboard" && (
              <div className="text-xs text-orange-200 bg-orange-900/50 px-2 py-1 rounded">
                ⚠️ Progreso se perderá al salir
              </div>
            )}

            {/* Keyboard shortcuts */}
            <div className="border-t border-slate-600 pt-2 w-full">
              <div className="text-xs text-slate-300 mb-1">Atajos de teclado:</div>
              <div className="flex items-center space-x-2 text-xs text-slate-300">
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Esc</kbd>
                <span>o</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Alt</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">←</kbd>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Mantén presionado para salida rápida
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
