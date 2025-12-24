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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAcademicData, ManagedStudent, ManagedLecturer, Course } from "@/contexts/AcademicDataContext";
import { useToast } from "@/hooks/use-toast";
import { FileDropZone } from "@/components/ui/file-dropzone";
import { downloadCSV } from "@/lib/file-utils";

const colorOptions = [
  { value: "from-blue-500 to-cyan-500", label: "Biru" },
  { value: "from-emerald-500 to-teal-500", label: "Hijau" },
  { value: "from-violet-500 to-purple-500", label: "Ungu" },
  { value: "from-orange-500 to-amber-500", label: "Oranye" },
  { value: "from-pink-500 to-rose-500", label: "Pink" },
];

const prodiOptions = [
  { value: "all", label: "Semua Prodi" },
  { value: "d3-ak", label: "D3 Analisis Kimia" },
  { value: "d3-ti", label: "D3 Teknik Informatika" },
  { value: "d4-ak", label: "D4 Analisis Kimia" },
];

const prodiMap: Record<string, string> = {
  "d3-ak": "D3 Analisis Kimia",
  "d3-ti": "D3 Teknik Informatika",
  "d4-ak": "D4 Analisis Kimia",
};

export function AdminDashboard() {
  const { toast } = useToast();
  const { 
    managedStudents, 
    managedLecturers, 
    courses,
    addManagedStudent, 
    updateManagedStudent, 
    deleteManagedStudent,
    addManagedLecturer,
    updateManagedLecturer,
    deleteManagedLecturer,
    importStudentsFromCSV,
    importLecturersFromCSV,
    addCourse,
    updateCourse,
    deleteCourse,
    importCoursesFromCSV,
    schedules 
  } = useAcademicData();
  
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userTab, setUserTab] = useState("mahasiswa");
  const [mainTab, setMainTab] = useState<"users" | "courses">("users");
  
  // Modal states
  const [importOpen, setImportOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserType, setAddUserType] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importDataType, setImportDataType] = useState<"mahasiswa" | "dosen" | "matkul">("mahasiswa");
  
  // Course modal states
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [deleteCourseOpen, setDeleteCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    code: "",
    lecturer: "",
    prodi: "",
    semester: "1",
    sks: "3",
    color: "from-blue-500 to-cyan-500",
  });

  // User action modal states
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedStudent | ManagedLecturer | null>(null);

  // Form states for add/edit
  const [formData, setFormData] = useState({
    name: "",
    nimNip: "",
    email: "",
    prodi: "",
    status: "Aktif" as "Aktif" | "Cuti" | "Alumni",
    phone: "",
    address: "",
    angkatan: "",
    jabatan: "",
  });

  // Dynamic statistics from context
  const totalMahasiswa = managedStudents.length;
  const totalDosen = managedLecturers.length;
  const totalUsers = totalMahasiswa + totalDosen;
  const uniqueProdi = new Set([...managedStudents.map(s => s.prodi), ...managedLecturers.map(l => l.prodi)]);
  const totalProdi = uniqueProdi.size;

  const totalMatkul = courses.length;

  const stats = [
    { label: "Total User", value: String(totalUsers), icon: Users, color: "text-primary", bg: "bg-primary/10", change: "+12%" },
    { label: "Total Mata Kuliah", value: String(totalMatkul), icon: GraduationCap, color: "text-success", bg: "bg-success/10", change: "+5%" },
    { label: "Total Mahasiswa", value: String(totalMahasiswa), icon: Users, color: "text-warning", bg: "bg-warning/10", change: "+8%" },
    { label: "Total Dosen", value: String(totalDosen), icon: Building, color: "text-accent-foreground", bg: "bg-accent", change: "+3%" },
  ];

  const currentData = userTab === "mahasiswa" ? managedStudents : managedLecturers;

  const filteredUsers = currentData.filter((user) => {
    const matchesProdi =
      selectedProdi === "all" ||
      user.prodi.toLowerCase().includes(selectedProdi.replace("-", " "));
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (userTab === "mahasiswa" ? (user as ManagedStudent).nim : (user as ManagedLecturer).nip).includes(searchQuery);
    return matchesProdi && matchesSearch;
  });

  // Filtered courses
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      nimNip: "",
      email: "",
      prodi: "",
      status: "Aktif",
      phone: "",
      address: "",
      angkatan: "",
      jabatan: "",
    });
  };

  // User action handlers
  const handleViewUser = (user: ManagedStudent | ManagedLecturer) => {
    setSelectedUser(user);
    setViewUserOpen(true);
  };

  const handleEditUser = (user: ManagedStudent | ManagedLecturer) => {
    setSelectedUser(user);
    if (userTab === "mahasiswa") {
      const student = user as ManagedStudent;
      setFormData({
        name: student.name,
        nimNip: student.nim,
        email: student.email,
        prodi: student.prodi,
        status: student.status,
        phone: student.phone,
        address: student.address,
        angkatan: student.angkatan,
        jabatan: "",
      });
    } else {
      const lecturer = user as ManagedLecturer;
      setFormData({
        name: lecturer.name,
        nimNip: lecturer.nip,
        email: lecturer.email,
        prodi: lecturer.prodi,
        status: lecturer.status as "Aktif" | "Cuti" | "Alumni",
        phone: lecturer.phone,
        address: lecturer.address,
        angkatan: "",
        jabatan: lecturer.jabatan,
      });
    }
    setEditUserOpen(true);
  };

  const handleDeleteUser = (user: ManagedStudent | ManagedLecturer) => {
    setSelectedUser(user);
    setDeleteUserOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    
    if (userTab === "mahasiswa") {
      deleteManagedStudent(selectedUser.id);
    } else {
      deleteManagedLecturer(selectedUser.id);
    }
    
    toast({
      title: "User Berhasil Dihapus",
      description: `Data ${selectedUser.name} telah dihapus dari sistem.`,
    });
    setDeleteUserOpen(false);
    setSelectedUser(null);
  };

  const handleSaveEditUser = () => {
    if (!selectedUser) return;
    
    if (userTab === "mahasiswa") {
      updateManagedStudent(selectedUser.id, {
        name: formData.name,
        nim: formData.nimNip,
        email: formData.email,
        prodi: formData.prodi,
        status: formData.status as "Aktif" | "Cuti" | "Alumni",
        phone: formData.phone,
        address: formData.address,
        angkatan: formData.angkatan,
      });
    } else {
      updateManagedLecturer(selectedUser.id, {
        name: formData.name,
        nip: formData.nimNip,
        email: formData.email,
        prodi: formData.prodi,
        status: formData.status as "Aktif" | "Cuti",
        phone: formData.phone,
        address: formData.address,
        jabatan: formData.jabatan,
      });
    }
    
    toast({
      title: "Data Berhasil Diperbarui",
      description: `Data ${formData.name} telah diperbarui.`,
    });
    setEditUserOpen(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.nimNip || !formData.email || !formData.prodi) {
      toast({ title: "Lengkapi semua data yang wajib!", variant: "destructive" });
      return;
    }
    
    if (addUserType === "mahasiswa") {
      addManagedStudent({
        name: formData.name,
        nim: formData.nimNip,
        email: formData.email,
        prodi: prodiMap[formData.prodi] || formData.prodi,
        status: formData.status as "Aktif" | "Cuti" | "Alumni",
        phone: formData.phone || "-",
        address: formData.address || "-",
        angkatan: formData.angkatan || new Date().getFullYear().toString(),
      });
    } else {
      addManagedLecturer({
        name: formData.name,
        nip: formData.nimNip,
        email: formData.email,
        prodi: prodiMap[formData.prodi] || formData.prodi,
        status: formData.status as "Aktif" | "Cuti",
        phone: formData.phone || "-",
        address: formData.address || "-",
        jabatan: formData.jabatan || "Dosen",
      });
    }
    
    toast({
      title: `${addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"} Berhasil Ditambahkan`,
      description: `Data ${formData.name} telah disimpan.`,
    });
    setAddUserOpen(false);
    resetForm();
  };

  const openAddUserModal = (type: "mahasiswa" | "dosen") => {
    setAddUserType(type);
    resetForm();
    setAddUserOpen(true);
  };

  const handleImportCSV = () => {
    if (!importedFile) {
      toast({ title: "Pilih file terlebih dahulu!", variant: "destructive" });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      if (importDataType === "mahasiswa") {
        const studentsData: Omit<ManagedStudent, 'id'>[] = dataLines.map(line => {
          const [nim, name, prodi, email, status, phone, address, angkatan] = line.split(',').map(s => s.trim().replace(/"/g, ''));
          return {
            name: name || "",
            nim: nim || "",
            prodi: prodi || "D3 Analisis Kimia",
            email: email || `${nim}@mhs.aka.ac.id`,
            status: (status === "Aktif" || status === "Cuti" || status === "Alumni" ? status : "Aktif") as "Aktif" | "Cuti" | "Alumni",
            phone: phone || "-",
            address: address || "-",
            angkatan: angkatan || new Date().getFullYear().toString(),
          };
        }).filter(s => s.nim && s.name);
        
        if (studentsData.length > 0) {
          importStudentsFromCSV(studentsData);
          toast({ title: `${studentsData.length} mahasiswa berhasil di-import!`, description: `Data dari ${importedFile.name} telah ditambahkan.` });
        } else {
          toast({ title: "Tidak ada data valid dalam file CSV!", variant: "destructive" });
        }
      } else if (importDataType === "dosen") {
        const lecturersData: Omit<ManagedLecturer, 'id'>[] = dataLines.map(line => {
          const [nip, name, prodi, email, status, phone, address, jabatan] = line.split(',').map(s => s.trim().replace(/"/g, ''));
          return {
            name: name || "",
            nip: nip || "",
            prodi: prodi || "D3 Analisis Kimia",
            email: email || `${nip}@dosen.aka.ac.id`,
            status: (status === "Aktif" || status === "Cuti" ? status : "Aktif") as "Aktif" | "Cuti",
            phone: phone || "-",
            address: address || "-",
            jabatan: jabatan || "Dosen",
          };
        }).filter(l => l.nip && l.name);
        
        if (lecturersData.length > 0) {
          importLecturersFromCSV(lecturersData);
          toast({ title: `${lecturersData.length} dosen berhasil di-import!`, description: `Data dari ${importedFile.name} telah ditambahkan.` });
        } else {
          toast({ title: "Tidak ada data valid dalam file CSV!", variant: "destructive" });
        }
      } else if (importDataType === "matkul") {
        const coursesData: Omit<Course, 'id'>[] = dataLines.map(line => {
          const [code, name, lecturer, prodi, semester, sks] = line.split(',').map(s => s.trim().replace(/"/g, ''));
          return {
            name: name || "",
            code: code || "",
            lecturer: lecturer || "",
            prodi: prodi || "D3 Analisis Kimia",
            semester: parseInt(semester) || 1,
            sks: parseInt(sks) || 3,
            color: "from-blue-500 to-cyan-500",
            classes: 1,
          };
        }).filter(c => c.code && c.name);
        
        if (coursesData.length > 0) {
          importCoursesFromCSV(coursesData);
          toast({ title: `${coursesData.length} mata kuliah berhasil di-import!`, description: `Data dari ${importedFile.name} telah ditambahkan.` });
        } else {
          toast({ title: "Tidak ada data valid dalam file CSV!", variant: "destructive" });
        }
      }
      
      setImportOpen(false);
      setImportedFile(null);
    };
    reader.readAsText(importedFile);
  };

  // Course handlers
  const resetCourseForm = () => {
    setCourseFormData({
      name: "",
      code: "",
      lecturer: "",
      prodi: "",
      semester: "1",
      sks: "3",
      color: "from-blue-500 to-cyan-500",
    });
  };

  const handleAddCourse = () => {
    if (!courseFormData.name || !courseFormData.code || !courseFormData.lecturer) {
      toast({ title: "Lengkapi semua data yang wajib!", variant: "destructive" });
      return;
    }
    
    addCourse({
      name: courseFormData.name,
      code: courseFormData.code,
      lecturer: courseFormData.lecturer,
      color: courseFormData.color,
      prodi: prodiMap[courseFormData.prodi] || courseFormData.prodi,
      semester: parseInt(courseFormData.semester),
      sks: parseInt(courseFormData.sks),
      classes: 1,
    });
    
    toast({
      title: "Mata Kuliah Berhasil Ditambahkan",
      description: `${courseFormData.name} telah disimpan ke sistem.`,
    });
    setAddCourseOpen(false);
    resetCourseForm();
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseFormData({
      name: course.name,
      code: course.code,
      lecturer: course.lecturer,
      prodi: course.prodi || "",
      semester: String(course.semester || 1),
      sks: String(course.sks || 3),
      color: course.color,
    });
    setEditCourseOpen(true);
  };

  const handleSaveEditCourse = () => {
    if (!selectedCourse) return;
    
    updateCourse(selectedCourse.id, {
      name: courseFormData.name,
      code: courseFormData.code,
      lecturer: courseFormData.lecturer,
      prodi: prodiMap[courseFormData.prodi] || courseFormData.prodi,
      semester: parseInt(courseFormData.semester),
      sks: parseInt(courseFormData.sks),
      color: courseFormData.color,
    });
    
    toast({
      title: "Mata Kuliah Berhasil Diperbarui",
      description: `Data ${courseFormData.name} telah diperbarui.`,
    });
    setEditCourseOpen(false);
    setSelectedCourse(null);
    resetCourseForm();
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setDeleteCourseOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (!selectedCourse) return;
    deleteCourse(selectedCourse.id);
    toast({
      title: "Mata Kuliah Berhasil Dihapus",
      description: `${selectedCourse.name} telah dihapus dari sistem.`,
    });
    setDeleteCourseOpen(false);
    setSelectedCourse(null);
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
                  <select 
                    value={importDataType}
                    onChange={(e) => setImportDataType(e.target.value as "mahasiswa" | "dosen")}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="mahasiswa">Data Mahasiswa</option>
                    <option value="dosen">Data Dosen</option>
                    <option value="matkul">Data Mata Kuliah</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Upload File CSV</label>
                  <FileDropZone
                    onFileSelect={(file) => setImportedFile(file)}
                    accept=".csv"
                    maxSize={5}
                    className="mt-1.5"
                    placeholder="Drag & drop file CSV di sini"
                    acceptedFormats="Format: .csv (max 5MB)"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setImportOpen(false);
                      setImportedFile(null);
                    }}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleImportCSV}
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
                onClick={() => {
                  const data = managedStudents.map(s => ({
                    NIM: s.nim,
                    Nama: s.name,
                    Prodi: s.prodi,
                    Email: s.email,
                    Status: s.status,
                  }));
                  downloadCSV(data, "data_mahasiswa");
                  toast({ title: "Export berhasil!", description: "Data Mahasiswa berhasil di-export." });
                }}
                className="cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                Export Data Mahasiswa (.CSV)
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  const data = managedLecturers.map(l => ({
                    NIP: l.nip,
                    Nama: l.name,
                    Prodi: l.prodi,
                    Email: l.email,
                    Jabatan: l.jabatan,
                    Status: l.status,
                  }));
                  downloadCSV(data, "data_dosen");
                  toast({ title: "Export berhasil!", description: "Data Dosen berhasil di-export." });
                }}
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
                    Mahasiswa ({managedStudents.length})
                  </TabsTrigger>
                  <TabsTrigger value="dosen" className="text-sm data-[state=active]:bg-background">
                    Dosen ({managedLecturers.length})
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
                    {userTab === "mahasiswa" ? (user as ManagedStudent).nim : (user as ManagedLecturer).nip}
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

      {/* Modal Tambah User */}
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama lengkap"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{addUserType === "mahasiswa" ? "NIM" : "NIP"} <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={formData.nimNip}
                onChange={(e) => setFormData(prev => ({ ...prev, nimNip: e.target.value }))}
                placeholder={addUserType === "mahasiswa" ? "Masukkan NIM" : "Masukkan NIP"}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Masukkan email"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Program Studi <span className="text-destructive">*</span></label>
              <select 
                value={formData.prodi}
                onChange={(e) => setFormData(prev => ({ ...prev, prodi: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Program Studi</option>
                {prodiOptions.slice(1).map((prodi) => (
                  <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                ))}
              </select>
            </div>
            {addUserType === "dosen" && (
              <div>
                <label className="text-sm font-medium text-foreground">Jabatan</label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                  placeholder="Masukkan jabatan"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setAddUserOpen(false); resetForm(); }}
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
                    {userTab === "mahasiswa" ? (selectedUser as ManagedStudent).nim : (selectedUser as ManagedLecturer).nip}
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
                    <p className="text-sm font-medium text-foreground">{selectedUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Alamat</p>
                    <p className="text-sm font-medium text-foreground">{selectedUser.address}</p>
                  </div>
                </div>
                {userTab === "mahasiswa" && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Angkatan</p>
                      <p className="text-sm font-medium text-foreground">{(selectedUser as ManagedStudent).angkatan}</p>
                    </div>
                  </div>
                )}
                {userTab === "dosen" && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jabatan Fungsional</p>
                      <p className="text-sm font-medium text-foreground">{(selectedUser as ManagedLecturer).jabatan}</p>
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
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  {userTab === "mahasiswa" ? "NIM" : "NIP"}
                </label>
                <input
                  type="text"
                  value={formData.nimNip}
                  onChange={(e) => setFormData(prev => ({ ...prev, nimNip: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Program Studi</label>
                <select 
                  value={formData.prodi === "D3 Analisis Kimia" ? "d3-ak" : formData.prodi === "D3 Teknik Informatika" ? "d3-ti" : "d4-ak"}
                  onChange={(e) => setFormData(prev => ({ ...prev, prodi: prodiMap[e.target.value] || e.target.value }))}
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
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "Aktif" | "Cuti" | "Alumni" }))}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti</option>
                  {userTab === "mahasiswa" && <option value="Alumni">Alumni</option>}
                </select>
              </div>
              {userTab === "dosen" && (
                <div>
                  <label className="text-sm font-medium text-foreground">Jabatan</label>
                  <input
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => { setEditUserOpen(false); resetForm(); }}
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