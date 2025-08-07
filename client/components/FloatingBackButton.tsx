import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home page
  if (location.pathname === "/") {
    return null;
  }

  const handleGoBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Button
      onClick={handleGoBack}
      className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-slate-200 shadow-xl hover:shadow-2xl text-slate-700 hover:text-slate-900 hover:bg-white transition-all duration-300 hover:scale-110 group"
      size="sm"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
      <span className="sr-only">Regresar</span>
    </Button>
  );
}
