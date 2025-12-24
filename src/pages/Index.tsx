import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "@/types/roles";

const Index = () => {
  const navigate = useNavigate();
  const currentRole = getUserRole();

  useEffect(() => {
    // Redirect based on user role
    switch (currentRole) {
      case "admin":
        navigate("/admin", { replace: true });
        break;
      case "lecturer":
        navigate("/lecturer", { replace: true });
        break;
      case "student":
      default:
        navigate("/dashboard", { replace: true });
        break;
    }
  }, [currentRole, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Mengarahkan ke dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
