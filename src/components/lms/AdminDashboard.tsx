import { useState } from "react";
import { ChevronDown, Users, BookOpen, GraduationCap, Building, Search, Download, Filter, MoreHorizontal, Plus, Upload, Pencil, Trash2, FileSpreadsheet, UserPlus, Check, Eye, Mail, Phone, MapPin } from "lucide-react";
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
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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

const prodiOptions = [
  { value: "all", label: "Semua Prodi" },
  { value: "d3-ak", label: "D3 Analisis Kimia" },
  { value: "d3-ti", label: "D3 Teknik Informatika" },
  { value: "d4-ak", label: "D4 Analisis Kimia" },
];

const semesterOptions = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

const courseOptions = [
  { value: "kim101", label: "Kimia Dasar (KIM101)" },
  { value: "kim201", label: "Kimia Organik (KIM201)" },
  { value: "bio201", label: "Biokimia (BIO201)" },
];

const lecturerOptions = [
  { value: "ahmad", label: "Dr. Ahmad Wijaya" },
  { value: "sari", label: "Prof. Sari Dewi" },
  { value: "budi", label: "Pak Budi Santoso" },
];

const dayOptions = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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

const coursesTableData = [
  { id: 1, name: "Kimia Dasar", code: "KIM101", prodi: "D3 Analisis Kimia", semester: "Semester 1", sks: 3 },
  { id: 2, name: "Kimia Organik", code: "KIM201", prodi: "D3 Analisis Kimia", semester: "Semester 2", sks: 3 },
  { id: 3, name: "Biokimia", code: "BIO201", prodi: "D3 Analisis Kimia", semester: "Semester 3", sks: 4 },
  { id: 4, name: "Pemrograman Dasar", code: "INF101", prodi: "D3 Teknik Informatika", semester: "Semester 1", sks: 3 },
];

const classesTableData = [
  { id: 1, courseName: "Kimia Dasar", className: "D3-AK-2A", lecturer: "Dr. Ahmad Wijaya", day: "Senin", time: "08:00", students: 32 },
  { id: 2, courseName: "Kimia Organik", className: "D3-AK-2B", lecturer: "Prof. Sari Dewi", day: "Selasa", time: "10:00", students: 28 },
  { id: 3, courseName: "Biokimia", className: "D3-AK-3A", lecturer: "Pak Budi Santoso", day: "Rabu", time: "13:00", students: 30 },
];

const stats = [
  { label: "Total User", value: "1,248", icon: Users, color: "text-primary", bg: "bg-primary/10", change: "+12%" },
  { label: "Total Prodi", value: "8", icon: Building, color: "text-success", bg: "bg-success/10", change: "0%" },
  { label: "Total Dosen", value: "86", icon: GraduationCap, color: "text-warning", bg: "bg-warning/10", change: "+3%" },
  { label: "Total Mata Kuliah", value: "124", icon: BookOpen, color: "text-accent-foreground", bg: "bg-accent", change: "+5%" },
];

const jabatanOptions = [
  { value: "asisten-ahli", label: "Asisten Ahli" },
  { value: "lektor", label: "Lektor" },
  { value: "lektor-kepala", label: "Lektor Kepala" },
  { value: "guru-besar", label: "Guru Besar" },
];

const angkatanOptions = ["2021", "2022", "2023", "2024"];

const statusOptions = [
  { value: "Aktif", label: "Aktif" },
  { value: "Cuti", label: "Cuti" },
  { value: "Non-Aktif", label: "Non-Aktif" },
];

export function AdminDashboard() {
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userTab, setUserTab] = useState("mahasiswa");
  const [dataTab, setDataTab] = useState("users");
  
  // Modal states
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [editClassOpen, setEditClassOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addUserType, setAddUserType] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [selectedClassForMember, setSelectedClassForMember] = useState<typeof classesTableData[0] | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  
  // Edit data states
  const [editingCourse, setEditingCourse] = useState<typeof coursesTableData[0] | null>(null);
  
  // User action modal states
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [deleteUserOpen, setDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof studentsData[0] | typeof lecturersData[0] | null>(null);
  
  // CSV Import for class enrollment
  const [importClassCSVOpen, setImportClassCSVOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<typeof classesTableData[0] | null>(null);

  // Available students to add to class
  const availableStudentsForClass = [
    { id: 101, name: "Andi Pratama", nim: "2024010", prodi: "D3 Analisis Kimia", angkatan: "2024" },
    { id: 102, name: "Budi Setiawan", nim: "2024011", prodi: "D3 Analisis Kimia", angkatan: "2024" },
    { id: 103, name: "Citra Dewi", nim: "2024012", prodi: "D3 Analisis Kimia", angkatan: "2024" },
    { id: 104, name: "Dian Puspita", nim: "2023020", prodi: "D3 Analisis Kimia", angkatan: "2023" },
    { id: 105, name: "Eka Fitriani", nim: "2023021", prodi: "D3 Analisis Kimia", angkatan: "2023" },
    { id: 106, name: "Fajar Hidayat", nim: "2024015", prodi: "D3 Teknik Informatika", angkatan: "2024" },
  ];

  const handleOpenAddMember = (classItem: typeof classesTableData[0]) => {
    setSelectedClassForMember(classItem);
    setSelectedStudents([]);
    setAddMemberOpen(true);
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddMembers = () => {
    alert(`${selectedStudents.length} mahasiswa berhasil ditambahkan ke kelas ${selectedClassForMember?.className}!`);
    setAddMemberOpen(false);
    setSelectedStudents([]);
    setSelectedClassForMember(null);
  };

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

  const handleEditCourse = (course: typeof coursesTableData[0]) => {
    setEditingCourse(course);
    setEditCourseOpen(true);
  };

  const handleEditClass = (classItem: typeof classesTableData[0]) => {
    setEditingClass(classItem);
    setEditClassOpen(true);
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
    alert(`User ${selectedUser?.name} berhasil dihapus!`);
    setDeleteUserOpen(false);
    setSelectedUser(null);
  };

  const handleSaveEditUser = () => {
    alert(`Data ${selectedUser?.name} berhasil diperbarui!`);
    setEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleImportClassCSV = () => {
    alert("Import CSV mahasiswa ke kelas berhasil!");
    setImportClassCSVOpen(false);
  };

  const handleAddUser = () => {
    alert(`${addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"} baru berhasil ditambahkan!`);
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
          <p className="mt-1 text-muted-foreground">Kelola pengguna dan data akademik</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Add Course Modal */}
          <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                <Plus className="h-4 w-4" />
                Tambah Mata Kuliah
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nama Mata Kuliah</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kimia Dasar"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Kode Mata Kuliah</label>
                  <input
                    type="text"
                    placeholder="Contoh: KIM101"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Program Studi</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pilih Prodi</option>
                    {prodiOptions.slice(1).map((prodi) => (
                      <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Semester</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pilih Semester</option>
                    {semesterOptions.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setAddCourseOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setAddCourseOpen(false)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Course Modal */}
          <Dialog open={editCourseOpen} onOpenChange={setEditCourseOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Mata Kuliah</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nama Mata Kuliah</label>
                  <input
                    type="text"
                    defaultValue={editingCourse?.name}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Kode Mata Kuliah</label>
                  <input
                    type="text"
                    defaultValue={editingCourse?.code}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Program Studi</label>
                  <select 
                    defaultValue={editingCourse?.prodi === "D3 Analisis Kimia" ? "d3-ak" : editingCourse?.prodi === "D3 Teknik Informatika" ? "d3-ti" : "d4-ak"}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {prodiOptions.slice(1).map((prodi) => (
                      <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Semester</label>
                  <select 
                    defaultValue={editingCourse?.semester}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {semesterOptions.map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditCourseOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setEditCourseOpen(false)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Class Modal */}
          <Dialog open={addClassOpen} onOpenChange={setAddClassOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                <Plus className="h-4 w-4" />
                Buat Kelas Baru
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Buat Kelas Baru</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Mata Kuliah</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pilih Mata Kuliah</option>
                    {courseOptions.map((course) => (
                      <option key={course.value} value={course.value}>{course.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Dosen Pengampu</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pilih Dosen</option>
                    {lecturerOptions.map((lec) => (
                      <option key={lec.value} value={lec.value}>{lec.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Hari</label>
                    <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Pilih Hari</option>
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Jam</label>
                    <input
                      type="time"
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Nama Kelas</label>
                  <input
                    type="text"
                    placeholder="Contoh: D3-AK-2A"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setAddClassOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setAddClassOpen(false)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Buat Kelas
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Class Modal */}
          <Dialog open={editClassOpen} onOpenChange={setEditClassOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Kelas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Mata Kuliah</label>
                  <select 
                    defaultValue={editingClass?.courseName === "Kimia Dasar" ? "kim101" : editingClass?.courseName === "Kimia Organik" ? "kim201" : "bio201"}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {courseOptions.map((course) => (
                      <option key={course.value} value={course.value}>{course.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Dosen Pengampu</label>
                  <select 
                    defaultValue={editingClass?.lecturer === "Dr. Ahmad Wijaya" ? "ahmad" : editingClass?.lecturer === "Prof. Sari Dewi" ? "sari" : "budi"}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {lecturerOptions.map((lec) => (
                      <option key={lec.value} value={lec.value}>{lec.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Hari</label>
                    <select 
                      defaultValue={editingClass?.day}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {dayOptions.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Jam</label>
                    <input
                      type="time"
                      defaultValue={editingClass?.time}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Nama Kelas</label>
                  <input
                    type="text"
                    defaultValue={editingClass?.className}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEditClassOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setEditClassOpen(false)}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Import CSV Modal */}
          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                <Upload className="h-4 w-4" />
                Import CSV
              </button>
            </DialogTrigger>
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
                    <option value="matkul">Data Mata Kuliah</option>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => alert("Export Data Mata Kuliah (.CSV) berhasil!")}
                className="cursor-pointer"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Export Data Mata Kuliah (.CSV)
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

      {/* Main Data Tabs */}
      <Tabs value={dataTab} onValueChange={setDataTab} className="w-full">
        <TabsList className="bg-muted h-10 p-1">
          <TabsTrigger value="users" className="text-sm data-[state=active]:bg-background px-6">
            Data User
          </TabsTrigger>
          <TabsTrigger value="courses" className="text-sm data-[state=active]:bg-background px-6">
            Data Mata Kuliah
          </TabsTrigger>
          <TabsTrigger value="classes" className="text-sm data-[state=active]:bg-background px-6">
            Manajemen Kelas
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-4">
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
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-4">
          <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Data Mata Kuliah</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nama Mata Kuliah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Kode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Prodi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Semester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      SKS
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coursesTableData.map((course, index) => (
                    <tr
                      key={course.id}
                      className="hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{course.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{course.code}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{course.prodi}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{course.semester}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{course.sks}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditCourse(course)}
                            className="rounded-lg p-2 hover:bg-muted transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </button>
                          <button 
                            className="rounded-lg p-2 hover:bg-destructive/10 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border p-4">
              <p className="text-sm text-muted-foreground">
                Total <span className="font-medium text-foreground">{coursesTableData.length}</span> mata kuliah
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="mt-4">
          <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
            <div className="border-b border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Manajemen Kelas</h2>
                <button 
                  onClick={() => setImportClassCSVOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Import CSV Mahasiswa
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mata Kuliah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nama Kelas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Dosen
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Jadwal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mahasiswa
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {classesTableData.map((classItem, index) => (
                    <tr
                      key={classItem.id}
                      className="hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{classItem.courseName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {classItem.className}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{classItem.lecturer}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {classItem.day}, {classItem.time}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{classItem.students} siswa</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenAddMember(classItem)}
                            className="rounded-lg p-2 hover:bg-primary/10 transition-colors"
                            title="Tambah Anggota"
                          >
                            <UserPlus className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </button>
                          <button 
                            onClick={() => handleEditClass(classItem)}
                            className="rounded-lg p-2 hover:bg-muted transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </button>
                          <button 
                            className="rounded-lg p-2 hover:bg-destructive/10 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border p-4">
              <p className="text-sm text-muted-foreground">
                Total <span className="font-medium text-foreground">{classesTableData.length}</span> kelas
              </p>
            </div>
          </div>

          {/* Modal Tambah Anggota Kelas */}
          <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Tambah Anggota Kelas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {selectedClassForMember && (
                  <div className="rounded-lg bg-muted/50 border border-border p-3">
                    <p className="text-sm text-muted-foreground">Kelas:</p>
                    <p className="font-semibold text-foreground">{selectedClassForMember.courseName} - {selectedClassForMember.className}</p>
                    <p className="text-xs text-muted-foreground mt-1">Dosen: {selectedClassForMember.lecturer}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground">Filter Prodi</label>
                    <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="all">Semua Prodi</option>
                      {prodiOptions.slice(1).map((prodi) => (
                        <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Filter Angkatan</label>
                    <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="all">Semua Angkatan</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Pilih Mahasiswa</label>
                  <p className="text-xs text-muted-foreground mb-2">Centang mahasiswa yang ingin ditambahkan ke kelas</p>
                  <div className="max-h-60 overflow-y-auto rounded-lg border border-border divide-y divide-border">
                    {availableStudentsForClass.map((student) => (
                      <label
                        key={student.id}
                        className={cn(
                          "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                          selectedStudents.includes(student.id) && "bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                          selectedStudents.includes(student.id) 
                            ? "bg-primary border-primary" 
                            : "border-border"
                        )}>
                          {selectedStudents.includes(student.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.nim} • {student.prodi}</p>
                        </div>
                        <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                          {student.angkatan}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedStudents.length > 0 && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <p className="text-sm text-primary font-medium">
                      {selectedStudents.length} mahasiswa dipilih
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAddMemberOpen(false);
                      setSelectedStudents([]);
                    }}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAddMembers}
                    disabled={selectedStudents.length === 0}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      selectedStudents.length > 0
                        ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <UserPlus className="mr-2 h-4 w-4 inline" />
                    Tambah ke Kelas
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

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

      {/* Modal Import CSV untuk Enrollment Kelas */}
      <Dialog open={importClassCSVOpen} onOpenChange={setImportClassCSVOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import CSV Mahasiswa ke Kelas</DialogTitle>
            <DialogDescription>
              Upload file CSV untuk memasukkan mahasiswa ke kelas secara massal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Pilih Kelas Tujuan</label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Pilih Kelas</option>
                {classesTableData.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.courseName} - {classItem.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Upload File CSV</label>
              <div className="mt-1.5 rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 text-center">
                <FileSpreadsheet className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">
                  Drag & drop file CSV di sini
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Format: .csv (max 5MB)
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-xs font-medium text-foreground mb-1">Format CSV yang didukung:</p>
              <p className="text-xs text-muted-foreground">NIM, Nama (header opsional)</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">2024001, Siti Rahayu</p>
              <p className="text-xs text-muted-foreground font-mono">2024002, Ahmad Fadli</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setImportClassCSVOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleImportClassCSV}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                <Upload className="mr-2 h-4 w-4 inline" />
                Import
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Tambah User Lengkap */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah {addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"} Baru</DialogTitle>
            <DialogDescription>
              Lengkapi data {addUserType === "mahasiswa" ? "mahasiswa" : "dosen"} baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Data Utama */}
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Data Utama
              </h4>
              <div className="h-px bg-border" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Nama Lengkap <span className="text-destructive">*</span></label>
              <input
                type="text"
                placeholder="Contoh: Ahmad Fadli"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
                <input
                  type="email"
                  placeholder={addUserType === "mahasiswa" ? "nama@mhs.aka.ac.id" : "nama@dosen.aka.ac.id"}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  {addUserType === "mahasiswa" ? "NIM" : "NIP"} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder={addUserType === "mahasiswa" ? "Contoh: 2024001" : "Contoh: 198501012010011001"}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
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

            {/* Data Detail */}
            <div className="space-y-1 pt-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Data Detail
              </h4>
              <div className="h-px bg-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Alamat Lengkap</label>
              <textarea
                rows={2}
                placeholder="Contoh: Jl. Merdeka No. 10, Kelurahan Tanah Sareal, Kota Bogor"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {addUserType === "mahasiswa" ? (
                <div>
                  <label className="text-sm font-medium text-foreground">Angkatan</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pilih Angkatan</option>
                    {angkatanOptions.map((tahun) => (
                      <option key={tahun} value={tahun}>{tahun}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-foreground">Jabatan Akademik</label>
                  <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Pilih Jabatan</option>
                    {jabatanOptions.map((jabatan) => (
                      <option key={jabatan.value} value={jabatan.value}>{jabatan.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1 pt-2">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Status
              </h4>
              <div className="h-px bg-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Status Akademik <span className="text-destructive">*</span></label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
                <Plus className="mr-2 h-4 w-4 inline" />
                Tambah {addUserType === "mahasiswa" ? "Mahasiswa" : "Dosen"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
