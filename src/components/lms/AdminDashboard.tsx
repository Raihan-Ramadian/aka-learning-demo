import { useState } from "react";
import { ChevronDown, Users, BookOpen, GraduationCap, Building, Search, Download, Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const prodiOptions = [
  { value: "all", label: "Semua Prodi" },
  { value: "d3-ak", label: "D3 Analisis Kimia" },
  { value: "d3-ti", label: "D3 Teknik Informatika" },
  { value: "d4-ak", label: "D4 Analisis Kimia" },
];

const usersData = [
  { id: 1, name: "Siti Rahayu", nim: "2024001", prodi: "D3 Analisis Kimia", email: "siti@mhs.aka.ac.id", status: "Aktif" },
  { id: 2, name: "Ahmad Fadli", nim: "2024002", prodi: "D3 Analisis Kimia", email: "ahmad@mhs.aka.ac.id", status: "Aktif" },
  { id: 3, name: "Dewi Lestari", nim: "2024003", prodi: "D3 Teknik Informatika", email: "dewi@mhs.aka.ac.id", status: "Aktif" },
  { id: 4, name: "Budi Santoso", nim: "2023015", prodi: "D4 Analisis Kimia", email: "budi@mhs.aka.ac.id", status: "Cuti" },
  { id: 5, name: "Rina Wulandari", nim: "2024005", prodi: "D3 Analisis Kimia", email: "rina@mhs.aka.ac.id", status: "Aktif" },
  { id: 6, name: "Eko Prasetyo", nim: "2023008", prodi: "D3 Teknik Informatika", email: "eko@mhs.aka.ac.id", status: "Aktif" },
  { id: 7, name: "Maya Putri", nim: "2024007", prodi: "D4 Analisis Kimia", email: "maya@mhs.aka.ac.id", status: "Aktif" },
  { id: 8, name: "Rizky Aditya", nim: "2022010", prodi: "D3 Analisis Kimia", email: "rizky@mhs.aka.ac.id", status: "Alumni" },
];

const stats = [
  { label: "Total User", value: "1,248", icon: Users, color: "text-primary", bg: "bg-primary/10", change: "+12%" },
  { label: "Total Prodi", value: "8", icon: Building, color: "text-success", bg: "bg-success/10", change: "0%" },
  { label: "Total Dosen", value: "86", icon: GraduationCap, color: "text-warning", bg: "bg-warning/10", change: "+3%" },
  { label: "Total Mata Kuliah", value: "124", icon: BookOpen, color: "text-accent-foreground", bg: "bg-accent", change: "+5%" },
];

export function AdminDashboard() {
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = usersData.filter((user) => {
    const matchesProdi =
      selectedProdi === "all" ||
      user.prodi.toLowerCase().includes(selectedProdi.replace("-", " "));
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nim.includes(searchQuery);
    return matchesProdi && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-success/10 text-success";
      case "Cuti":
        return "bg-warning/10 text-warning";
      case "Alumni":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Admin 🛡️
          </h1>
          <p className="mt-1 text-muted-foreground">Kelola pengguna dan data akademik</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary-hover transition-colors">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card p-5 shadow-card border border-border/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                stat.change.startsWith("+") ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              )}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Table Section */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Data User</h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama atau NIM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Prodi Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span>{prodiOptions.find((p) => p.value === selectedProdi)?.label}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg">
                  {prodiOptions.map((prodi) => (
                    <DropdownMenuItem
                      key={prodi.value}
                      onClick={() => setSelectedProdi(prodi.value)}
                      className={cn(
                        "cursor-pointer",
                        selectedProdi === prodi.value && "bg-accent"
                      )}
                    >
                      {prodi.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  NIM
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Prodi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{user.nim}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.prodi}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", getStatusStyle(user.status))}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32 bg-popover border border-border shadow-lg">
                        <DropdownMenuItem className="cursor-pointer">Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-destructive">Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{filteredUsers.length}</span> dari{" "}
              <span className="font-medium text-foreground">{usersData.length}</span> user
            </p>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50" disabled>
                Sebelumnya
              </button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
