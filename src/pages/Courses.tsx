import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "@/types/roles";
import { BookOpen, Search, Filter, ChevronDown, Clock, Users, GraduationCap, Plus, Pencil, Trash2, Calendar, Upload, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAcademicData, Course } from "@/contexts/AcademicDataContext";
import { FileDropZone } from "@/components/ui/file-dropzone";

// Active classes for student/lecturer view
const myActiveClasses = {
  student: [
    { id: 1, code: "KIM101", name: "Kimia Dasar", className: "D3-AK-2A", sks: 3, lecturer: "Dr. Ahmad Wijaya", schedule: "Senin, 08:00 - 09:40", room: "Lab Kimia A", progress: 75, color: "from-primary/20 to-primary/5" },
    { id: 2, code: "KIM201", name: "Kimia Organik", className: "D3-AK-2A", sks: 4, lecturer: "Prof. Sari Dewi", schedule: "Selasa, 08:00 - 09:40", room: "Lab Kimia B", progress: 60, color: "from-success/20 to-success/5" },
    { id: 3, code: "BIO201", name: "Biokimia", className: "D3-AK-2A", sks: 4, lecturer: "Pak Budi Santoso", schedule: "Selasa, 13:00 - 14:40", room: "R. 302", progress: 45, color: "from-warning/20 to-warning/5" },
    { id: 4, code: "MAT101", name: "Matematika Terapan", className: "D3-AK-2A", sks: 3, lecturer: "Prof. Sari Dewi", schedule: "Senin, 10:00 - 11:40", room: "R. 201", progress: 80, color: "from-accent to-accent/50" },
  ],
  lecturer: [
    { id: 1, code: "KIM101", name: "Kimia Dasar", className: "D3-AK-2A", sks: 3, students: 32, schedule: "Senin, 08:00 - 09:40", room: "Lab Kimia A", progress: 75, color: "from-primary/20 to-primary/5" },
    { id: 2, code: "KIM101", name: "Kimia Dasar", className: "D3-AK-2B", sks: 3, students: 28, schedule: "Rabu, 08:00 - 09:40", room: "Lab Kimia A", progress: 70, color: "from-primary/20 to-primary/5" },
    { id: 3, code: "KIM401", name: "Analisis Instrumen", className: "D4-AK-4A", sks: 4, students: 25, schedule: "Kamis, 13:00 - 15:30", room: "Lab Instrumen", progress: 55, color: "from-success/20 to-success/5" },
    { id: 4, code: "KIM301", name: "Praktikum Kimia", className: "D3-AK-3A", sks: 2, students: 30, schedule: "Kamis, 08:00 - 09:40", room: "Lab Kimia A", progress: 65, color: "from-warning/20 to-warning/5" },
  ],
};

const sksOptions = [
  { value: "all", label: "Semua SKS" },
  { value: "2", label: "2 SKS" },
  { value: "3", label: "3 SKS" },
  { value: "4", label: "4 SKS" },
];

const semesterOptions = [
  { value: "all", label: "Semua Semester" },
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
  { value: "3", label: "Semester 3" },
  { value: "4", label: "Semester 4" },
];

const prodiOptions = [
  { value: "all", label: "Semua Prodi" },
  { value: "D3 Analisis Kimia", label: "D3 Analisis Kimia" },
  { value: "D3 Teknik Informatika", label: "D3 Teknik Informatika" },
  { value: "D4 Analisis Kimia", label: "D4 Analisis Kimia" },
];

const colorOptions = [
  { value: "from-blue-500 to-cyan-500", label: "Biru" },
  { value: "from-emerald-500 to-teal-500", label: "Hijau" },
  { value: "from-violet-500 to-purple-500", label: "Ungu" },
  { value: "from-orange-500 to-amber-500", label: "Oranye" },
  { value: "from-pink-500 to-rose-500", label: "Pink" },
];

export default function Courses() {
  const navigate = useNavigate();
  const currentRole = getUserRole();
  const { toast } = useToast();
  
  // Get data from context for Admin
  const { courses, addCourse, updateCourse, deleteCourse, importCoursesFromCSV } = useAcademicData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSks, setSelectedSks] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  
  // Modal states
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [deleteCourseOpen, setDeleteCourseOpen] = useState(false);
  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [importedFile, setImportedFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    lecturer: "",
    sks: "3",
    semester: "1",
    prodi: "",
    color: "from-blue-500 to-cyan-500",
  });

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  // Filter courses from context
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSks = selectedSks === "all" || (course.sks?.toString() === selectedSks);
    const matchesSemester = selectedSemester === "all" || (course.semester?.toString() === selectedSemester);
    const matchesProdi = selectedProdi === "all" || course.prodi === selectedProdi;
    return matchesSearch && matchesSks && matchesSemester && matchesProdi;
  });

  const getPageTitle = () => {
    switch (currentRole) {
      case "admin":
        return "Master Data Mata Kuliah 📚";
      case "lecturer":
        return "Kelas Saya 👨‍🏫";
      case "student":
        return "Kelas Aktif Saya 📖";
    }
  };

  const getPageDescription = () => {
    switch (currentRole) {
      case "admin":
        return "Kelola seluruh mata kuliah kurikulum Politeknik AKA Bogor";
      case "lecturer":
        return "Daftar kelas yang Anda ampu semester ini";
      case "student":
        return "Kelas yang Anda ikuti semester ini";
    }
  };

  const resetForm = () => {
    setFormData({ code: "", name: "", lecturer: "", sks: "3", semester: "1", prodi: "", color: "from-blue-500 to-cyan-500" });
  };

  const handleAddCourse = () => {
    if (!formData.code || !formData.name || !formData.lecturer) {
      toast({ title: "Lengkapi data yang wajib!", variant: "destructive" });
      return;
    }
    addCourse({
      code: formData.code,
      name: formData.name,
      lecturer: formData.lecturer,
      sks: parseInt(formData.sks),
      semester: parseInt(formData.semester),
      prodi: formData.prodi,
      color: formData.color,
      classes: 1,
    });
    toast({ title: "Mata Kuliah Ditambahkan!", description: `${formData.name} berhasil ditambahkan.` });
    setAddCourseOpen(false);
    resetForm();
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      lecturer: course.lecturer,
      sks: String(course.sks || 3),
      semester: String(course.semester || 1),
      prodi: course.prodi || "",
      color: course.color,
    });
    setEditCourseOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedCourse) return;
    updateCourse(selectedCourse.id, {
      code: formData.code,
      name: formData.name,
      lecturer: formData.lecturer,
      sks: parseInt(formData.sks),
      semester: parseInt(formData.semester),
      prodi: formData.prodi,
      color: formData.color,
    });
    toast({ title: "Mata Kuliah Diperbarui!", description: `${formData.name} berhasil diperbarui.` });
    setEditCourseOpen(false);
    setSelectedCourse(null);
    resetForm();
  };

  const handleDeleteCourse = (course: Course) => {
    setSelectedCourse(course);
    setDeleteCourseOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (!selectedCourse) return;
    deleteCourse(selectedCourse.id);
    toast({ title: "Mata Kuliah Dihapus!", description: `${selectedCourse.name} berhasil dihapus.` });
    setDeleteCourseOpen(false);
    setSelectedCourse(null);
  };

  const handleImportCsv = () => {
    if (!importedFile) {
      toast({ title: "Pilih file terlebih dahulu!", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const dataLines = lines.slice(1);
      const coursesData: Omit<Course, 'id'>[] = dataLines.map(line => {
        const [code, name, lecturer, prodi, semester, sks] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        return { name: name || "", code: code || "", lecturer: lecturer || "", prodi: prodi || "", semester: parseInt(semester) || 1, sks: parseInt(sks) || 3, color: "from-blue-500 to-cyan-500", classes: 1 };
      }).filter(c => c.code && c.name);
      if (coursesData.length > 0) {
        importCoursesFromCSV(coursesData);
        toast({ title: `${coursesData.length} mata kuliah berhasil di-import!` });
      }
      setImportCsvOpen(false);
      setImportedFile(null);
    };
    reader.readAsText(importedFile);
  };

  // Admin View - Master Data Management
  const renderAdminView = () => (
    <>
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari mata kuliah atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {prodiOptions.find(p => p.value === selectedProdi)?.label}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {prodiOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSelectedProdi(option.value)}
                className={cn("cursor-pointer", selectedProdi === option.value && "bg-accent")}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
              {semesterOptions.find(s => s.value === selectedSemester)?.label}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {semesterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSelectedSemester(option.value)}
                className={cn("cursor-pointer", selectedSemester === option.value && "bg-accent")}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {sksOptions.find(s => s.value === selectedSks)?.label}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {sksOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSelectedSks(option.value)}
                className={cn("cursor-pointer", selectedSks === option.value && "bg-accent")}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline"
          onClick={() => setImportCsvOpen(true)}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Import CSV
        </Button>

        <Button 
          onClick={() => setAddCourseOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Mata Kuliah
        </Button>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Menampilkan <strong>{filteredCourses.length}</strong> dari {courses.length} mata kuliah
      </p>

      {/* Admin Table View */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kode</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Mata Kuliah</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prodi</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semester</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dosen</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.map((course, index) => (
                <tr
                  key={course.id}
                  className="hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-4 py-3 font-mono text-sm text-primary font-medium">{course.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{course.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{course.prodi}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      course.semester === "Ganjil" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                    )}>
                      {course.semester}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{course.sks}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{course.lecturer}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="rounded-lg p-2 hover:bg-muted transition-colors" 
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                      <button className="rounded-lg p-2 hover:bg-destructive/10 transition-colors" title="Hapus">
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
            Total <span className="font-medium text-foreground">{filteredCourses.length}</span> mata kuliah
          </p>
        </div>
      </div>

      {/* Import CSV Modal */}
      <Dialog open={importCsvOpen} onOpenChange={setImportCsvOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Data Mata Kuliah</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">
                Drag & drop file CSV/Excel di sini
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Format: CSV, XLS, XLSX (max 10MB)</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Format Kolom CSV:</p>
              <p className="text-xs text-muted-foreground">Kode, Nama Matkul, Prodi, Semester, SKS, Dosen</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setImportCsvOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleImportCsv}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog open={editCourseOpen} onOpenChange={setEditCourseOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Mata Kuliah</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Kode Mata Kuliah <span className="text-destructive">*</span></label>
                <Input
                  type="text"
                  placeholder="Contoh: KIM101"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">SKS <span className="text-destructive">*</span></label>
                <select 
                  value={formData.sks}
                  onChange={(e) => setFormData(prev => ({ ...prev, sks: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Pilih SKS</option>
                  <option value="2">2 SKS</option>
                  <option value="3">3 SKS</option>
                  <option value="4">4 SKS</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nama Mata Kuliah <span className="text-destructive">*</span></label>
              <Input
                type="text"
                placeholder="Contoh: Kimia Dasar"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Program Studi <span className="text-destructive">*</span></label>
                <select 
                  value={formData.prodi}
                  onChange={(e) => setFormData(prev => ({ ...prev, prodi: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Pilih Prodi</option>
                  {prodiOptions.slice(1).map((prodi) => (
                    <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Semester <span className="text-destructive">*</span></label>
                <select 
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Pilih Semester</option>
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditCourseOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveEdit}>
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Course Modal */}
      <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Kode Mata Kuliah <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  placeholder="Contoh: KIM101"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">SKS <span className="text-destructive">*</span></label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih SKS</option>
                  <option value="2">2 SKS</option>
                  <option value="3">3 SKS</option>
                  <option value="4">4 SKS</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nama Mata Kuliah <span className="text-destructive">*</span></label>
              <input
                type="text"
                placeholder="Contoh: Kimia Dasar"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Program Studi <span className="text-destructive">*</span></label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Prodi</option>
                  {prodiOptions.slice(1).map((prodi) => (
                    <option key={prodi.value} value={prodi.value}>{prodi.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Semester <span className="text-destructive">*</span></label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Semester</option>
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Deskripsi</label>
              <textarea
                placeholder="Deskripsi mata kuliah..."
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddCourseOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddCourse}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Tambah Mata Kuliah
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // Student View - My Active Classes
  const renderStudentView = () => (
    <>
      <div className="grid grid-cols-2 gap-5">
        {myActiveClasses.student.map((classItem, index) => (
          <div
            key={classItem.id}
            onClick={() => handleCourseClick(classItem.id)}
            className="group rounded-xl bg-card border border-border/50 shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn("h-20 bg-gradient-to-br relative", classItem.color)}>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-foreground/20" />
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-background/90 text-foreground">
                  {classItem.code}
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  {classItem.className}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {classItem.name}
              </h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{classItem.lecturer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{classItem.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{classItem.sks} SKS • {classItem.room}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span className="font-medium text-foreground">{classItem.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${classItem.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Lecturer View - My Classes to Teach
  const renderLecturerView = () => (
    <>
      <div className="grid grid-cols-2 gap-5">
        {myActiveClasses.lecturer.map((classItem, index) => (
          <div
            key={classItem.id}
            onClick={() => handleCourseClick(classItem.id)}
            className="group rounded-xl bg-card border border-border/50 shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn("h-20 bg-gradient-to-br relative", classItem.color)}>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-foreground/20" />
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-background/90 text-foreground">
                  {classItem.code}
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  {classItem.className}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {classItem.name}
              </h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{classItem.students} Mahasiswa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{classItem.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{classItem.sks} SKS • {classItem.room}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress Materi</span>
                  <span className="font-medium text-foreground">{classItem.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${classItem.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
        <p className="mt-1 text-muted-foreground">{getPageDescription()}</p>
      </div>

      {/* Content based on role */}
      {currentRole === "admin" && renderAdminView()}
      {currentRole === "student" && renderStudentView()}
      {currentRole === "lecturer" && renderLecturerView()}
    </div>
  );
}