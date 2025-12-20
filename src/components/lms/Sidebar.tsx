import { LayoutDashboard, BookOpen, Calendar, Settings, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Courses", path: "/courses" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
          <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-accent-foreground">AKA Learning</h1>
          <p className="text-xs text-sidebar-foreground/60">Learning Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
        <div className="rounded-lg bg-sidebar-accent/50 p-4">
          <p className="text-xs font-medium text-sidebar-foreground/80">Need Help?</p>
          <p className="mt-1 text-xs text-sidebar-foreground/60">
            Contact support@aka.ac.id
          </p>
        </div>
      </div>
    </aside>
  );
}
