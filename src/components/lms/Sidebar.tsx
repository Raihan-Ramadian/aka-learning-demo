import { LayoutDashboard, BookOpen, Calendar, Settings, GraduationCap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";

// Get dashboard path based on user role
const getDashboardPath = () => {
  const role = localStorage.getItem("userRole");
  switch (role) {
    case "admin":
      return "/admin";
    case "lecturer":
      return "/lecturer";
    default:
      return "/dashboard";
  }
};

export function Sidebar() {
  const location = useLocation();
  const dashboardPath = getDashboardPath();
  const { isOpen, toggleSidebar } = useSidebar();
  
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: dashboardPath },
    { icon: BookOpen, label: "Mata Kuliah", path: "/courses" },
    { icon: Calendar, label: "Jadwal", path: "/schedule" },
    { icon: Settings, label: "Pengaturan", path: "/settings" },
  ];

  const isActivePath = (path: string) => {
    // Check if current path matches, or if we're on a role-specific dashboard
    if (path === dashboardPath) {
      return location.pathname === "/admin" || location.pathname === "/lecturer" || location.pathname === "/dashboard";
    }
    // Check if we're on courses or course detail page
    if (path === "/courses") {
      return location.pathname === "/courses" || location.pathname.startsWith("/course/");
    }
    return location.pathname === path;
  };

  return (
    <>
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-2">
          <div className="flex h-12 w-12 items-center justify-center flex-shrink-0">
            <img src="/icon.png" alt="Politeknik AKA Bogor" className="h-10 w-10 object-contain" />
          </div>
          <div className={cn(
            "flex-1 ml-3 overflow-hidden transition-all duration-300",
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            <h1 className="text-m font-bold text-sidebar-accent-foreground whitespace-nowrap">Politeknik AKA Bogor</h1>
            <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Learning Management System</p>
          </div>
        </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    !isOpen && "justify-center px-0"
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - hanya tampil saat expanded */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-4">
            <p className="text-xs font-medium text-sidebar-foreground/80">Butuh Bantuan?</p>
            <p className="mt-1 text-xs text-sidebar-foreground/60">
              Hubungi support@aka.ac.id
            </p>
          </div>
        </div>
      )}
      </aside>
    </>
  );
}
