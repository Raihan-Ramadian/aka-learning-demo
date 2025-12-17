import { ChevronDown, Bell, Search, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type UserRole = "student" | "lecturer" | "admin";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleLabels: Record<UserRole, string> = {
  student: "Student View",
  lecturer: "Lecturer View",
  admin: "Admin View",
};

const roleColors: Record<UserRole, string> = {
  student: "bg-primary",
  lecturer: "bg-success",
  admin: "bg-warning",
};

export function Header({ currentRole, onRoleChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses, materials..."
            className="h-10 w-80 rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
              <span className={cn("h-2 w-2 rounded-full", roleColors[currentRole])} />
              <span>Simulate Role</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg">
            {(Object.keys(roleLabels) as UserRole[]).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleChange(role)}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  currentRole === role && "bg-accent"
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", roleColors[role])} />
                {roleLabels[role]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Profile */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
