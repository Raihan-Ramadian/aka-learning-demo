import { useState } from "react";
import { ChevronDown, Users, GraduationCap, Building, Search, Download, Filter, MoreHorizontal, Plus, Upload, Pencil, Trash2, Eye, Mail, Phone, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAcademicData } from "@/contexts/AcademicDataContext";
import { useToast } from "@/hooks/use-toast";

const prodiOptions = [
  { value: "all", label: "Semua Prodi" },
  { value: "d3-ak", label: "D3 Analisis Kimia" },
  { value: "d3-ti", label: "D3 Teknik Informatika" },
  { value: "d4-ak", label: "D4 Analisis Kimia" },
];

const studentsData = [
  { id: 1, name: "Siti Rahayu", nim: "2024001", prodi: "D3 Analisis Kimia", email: "siti@mhs.aka.ac.id", status: "Aktif", phone: "081234567890", address: "Jl. Merdeka No. 10, Bogor", angkatan: "2024" },
  { id: 2, name: "Ahmad Fadli", nim: "2024002", prodi: "D3 Analisis Kimia", email: "ahmad@mhs.aka.ac.id", status: "Aktif", phone: "081234567891", address: "Jl. Sudirman No. 5, Bogor", angkatan: "2024" },
  { id: 3, name: "Dewi Lestari", nim: "2024003", prodi: "D3 Teknik Informatika", email: "dewi@mhs.aka.ac.id", status: "Aktif", phone: "081234567892", address: "Jl. Ahmad Yani No. 15, Bogor", angkatan: "2024" },
  { id: 4, name: "Budi Santoso", nim: "2023015", prodi: "D4 Analisis Kimia", email: "budi@mhs.aka.ac.id", status: "Cuti", phone: "081234567893", address: "Jl. Pahlawan No. 20, Bogor", angkatan: "2023" },
  { id: 5, name: "Rina Wulandari", nim: "2024005", prodi: "D3 Analisis Kimia", email: "rina@mhs.aka.ac.id", status: "Aktif", phone: "081234567894", address: "Jl. Diponegoro No. 8, Bogor", angkatan: "2024" },
  { id: 6, name: "Eko Prasetyo", nim: "2023008", prodi: "D3 Teknik Informatika", email: "eko@mhs.aka.ac.id", status: "Aktif", phone: "081234567895", address: "Jl. Gatot Subroto No. 12, Bogor", angkatan: "2023" },
];

const lecturersData = [
  { id: 1, name: "Dr. Ahmad Wijaya", nip: "198501012010011001", prodi: "D3 Analisis Kimia", email: "ahmad@dosen.aka.ac.id", status: "Aktif", phone: "081234567801", address: "Jl. Profesor No. 1, Bogor", jabatan: "Lektor Kepala" },
  { id: 2, name: "Prof. Sari Dewi", nip: "197805152005012001", prodi: "D3 Analisis Kimia", email: "sari@dosen.aka.ac.id", status: "Aktif", phone: "081234567802", address: "Jl. Akademik No. 5, Bogor", jabatan: "Guru Besar" },
  { id: 3, name: "Pak Budi Santoso", nip: "198203202008011003", prodi: "D3 Teknik Informatika", email: "budi@dosen.aka.ac.id", status: "Aktif", phone: "081234567803", address: "Jl. Pendidikan No. 10, Bogor", jabatan: "Lektor" },
  { id: 4, name: "Dr. Maya Putri", nip: "198906302015012001", prodi: "D4 Analisis Kimia", email: "maya@dosen.aka.ac.id", status: "Cuti", phone: "081234567804", address: "Jl. Ilmu No. 3, Bogor", jabatan: "Asisten Ahli" },
];

export function AdminDashboard() {
  const { toast } = useToast();
  const { courses, schedules } = useAcademicData();
  
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userTab, setUserTab] = useState("mahasiswa");
  
  // Modal states
  const [importOpen, setImportOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserType, setAddUserType] = useState<"mahasiswa" | "dosen">("mahasiswa");
  
  // User action modal states
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof studentsData[0] | typeof lecturersData[0] | null>(null);

  // Dynamic statistics
  const totalMahasiswa = studentsData.length;
  const totalDosen = lecturersData.length;
  const totalUsers = totalMahasiswa + totalDosen;
  const uniqueProdi = new Set([...studentsData.map(s => s.prodi), ...lecturersData.map(l => l.prodi)]);
  const totalProdi = uniqueProdi.size;

  const stats = [
    { label: "Total User", value: String(totalUsers), icon: Users, color: "text-primary", bg: "bg-primary/10", change: "+12%" },
    { label: "Total Prodi", value: String(totalProdi), icon: Building, color: "text-success", bg: "bg-success/10", change: "0%" },
    { label: "Total Mahasiswa", value: String(totalMahasiswa), icon: Users, color: "text-warning", bg: "bg-warning/10", change: "+8%" },
    { label: "Total Dosen", value: String(totalDosen), icon: GraduationCap, color: "text-accent-foreground", bg: "bg-accent", change: "+3%" },
  ];

  const currentData = userTab === "mahasiswa" ? studentsData : lecturersData;

  const filteredUsers = currentData.filter((user) => {
    const matchesProdi =
      selectedProdi === "all" ||
      user.prodi.toLowerCase().includes(selectedProdi.replace("-", " "));
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userTab === "mahasiswa" ? (user as typeof studentsData[0]).nim : (user as typeof lecturersData[0]).nip).includes(searchQuery);
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

  // User action handlers
  const handleViewUser = (user: typeof studentsData[0] | typeof lecturersData[0]) => {
    setSelectedUser(user);
    setViewUserOpen(true);
  };

  const handleEditUser = (user: typeof studentsData[0] | typeof lecturersData[0]) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleDeleteUser = (user: typeof studentsData[0] | typeof lecturersData[0]) => {
    setSelectedUser(user);
    setDeleteUserOpen(true);
  };

  const confirmDeleteUser = () => {
    toast({
      title: "User Berhasil Dihapus",
      description: `Data ${selectedUser?.name} telah dihapus dari sistem.`,
    });
    setDeleteUserOpen(false);
    setSelectedUser(null);
  };

  const handleSaveEditUser = () => {
    toast({
      title: "Data Berhasil Diperbarui",
      description: `Data ${selectedUser?.name} telah diperbarui.`,
    });
    setEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    toast({
      title: `${addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"} Berhasil Ditambahkan`,
      description: `Data ${addUserType === "mahasiswa" ? "mahasiswa" : "dosen"} baru telah disimpan.`,
    });
    setAddUserOpen(false);
  };

  const openAddUserModal = (type: "mahasiswa" | "dosen") => {
    setAddUserType(type);
    setAddUserOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Admin 🛡️
          </h1>
          <p className="mt-1 text-muted-foreground">Kelola pengguna dan statistik akademik</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Import CSV Modal */}
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <button 
              onClick={() => setImportOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Data dari CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Tipe Data</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="mahasiswa">Data Mahasiswa</option>
                    <option value="dosen">Data Dosen</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Upload File CSV</label>
                  <div className="mt-1.5 rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-3 font-medium text-foreground">
                      Drag & drop file CSV di sini
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">Format: .csv (max 5MB)</p>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setImportOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setImportOpen(false)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Import
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary-hover transition-colors">
                <Download className="h-4 w-4" />
                Export Data
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => alert("Export Data Mahasiswa (.CSV) berhasil!")}
                className="cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                Export Data Mahasiswa (.CSV)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => alert("Export Data Dosen (.CSV) berhasil!")}
                className="cursor-pointer"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Export Data Dosen (.CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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

      {/* User Data Management */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-foreground">Data User</h2>
              <Tabs value={userTab} onValueChange={setUserTab} className="w-auto">
                <TabsList className="bg-muted h-9">
                  <TabsTrigger value="mahasiswa" className="text-sm data-[state=active]:bg-background">
                    Mahasiswa
                  </TabsTrigger>
                  <TabsTrigger value="dosen" className="text-sm data-[state=active]:bg-background">
                    Dosen
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={userTab === "mahasiswa" ? "Cari nama atau NIM..." : "Cari nama atau NIP..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button
                onClick={() => openAddUserModal(userTab === "mahasiswa" ? "mahasiswa" : "dosen")}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                <Plus className="h-4 w-4" />
                Tambah {userTab === "mahasiswa" ? "Mahasiswa" : "Dosen"}
              </button>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {userTab === "mahasiswa" ? "NIM" : "NIP"}
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
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {userTab === "mahasiswa" ? (user as typeof studentsData[0]).nim : (user as typeof lecturersData[0]).nip}
                  </td>
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
                      <DropdownMenuContent align="end" className="w-36 bg-popover border border-border shadow-lg">
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{filteredUsers.length}</span> dari{" "}
              <span className="font-medium text-foreground">{currentData.length}</span> {userTab}
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

      {/* Modal Tambah User - Simplified */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah {addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"} Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nama Lengkap <span className="text-destructive">*</span></label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{addUserType === "mahasiswa" ? "NIM" : "NIP"} <span className="text-destructive">*</span></label>
              <input
                type="text"
                placeholder={addUserType === "mahasiswa" ? "Masukkan NIM" : "Masukkan NIP"}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
              <input
                type="email"
                placeholder="Masukkan email"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Program Studi <span className="text-destructive">*</span></label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Pilih Program Studi</option>
                {prodiOptions.slice(1).map((prodi) => (
                  <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddUserOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddUser}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Tambah {addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Lihat Detail User */}
      <Dialog open={viewUserOpen} onOpenChange={setViewUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail {userTab === "mahasiswa" ? "Mahasiswa" : "Dosen"}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 pt-4">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {userTab === "mahasiswa" ? (selectedUser as typeof studentsData[0]).nim : (selectedUser as typeof lecturersData[0]).nip}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", getStatusStyle(selectedUser.status))}>
                  {selectedUser.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Program Studi</p>
                    <p className="text-sm font-medium text-foreground">{selectedUser.prodi}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Telepon</p>
                    <p className="text-sm font-medium text-foreground">{(selectedUser as any).phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Alamat</p>
                    <p className="text-sm font-medium text-foreground">{(selectedUser as any).address}</p>
                  </div>
                </div>
                {userTab === "mahasiswa" && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Angkatan</p>
                      <p className="text-sm font-medium text-foreground">{(selectedUser as typeof studentsData[0]).angkatan}</p>
                    </div>
                  </div>
                )}
                {userTab === "dosen" && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jabatan Fungsional</p>
                      <p className="text-sm font-medium text-foreground">{(selectedUser as typeof lecturersData[0]).jabatan}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setViewUserOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Edit User */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {userTab === "mahasiswa" ? "Mahasiswa" : "Dosen"}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
                <input
                  type="text"
                  defaultValue={selectedUser.name}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  {userTab === "mahasiswa" ? "NIM" : "NIP"}
                </label>
                <input
                  type="text"
                  defaultValue={userTab === "mahasiswa" ? (selectedUser as typeof studentsData[0]).nim : (selectedUser as typeof lecturersData[0]).nip}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Program Studi</label>
                <select 
                  defaultValue={selectedUser.prodi === "D3 Analisis Kimia" ? "d3-ak" : selectedUser.prodi === "D3 Teknik Informatika" ? "d3-ti" : "d4-ak"}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {prodiOptions.slice(1).map((prodi) => (
                    <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <select 
                  defaultValue={selectedUser.status}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditUserOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEditUser}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Hapus User */}
      <AlertDialog open={deleteUserOpen} onOpenChange={setDeleteUserOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <span className="font-semibold text-foreground">{selectedUser?.name}</span>? 
              Tindakan ini tidak dapat dibatalkan dan semua data terkait user ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}