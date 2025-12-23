import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header } from "@/components/lms/Header";
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
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Master data for all courses (Admin view)
const initialCourses = [
  { id: 1, code: "KIM101", name: "Kimia Dasar", sks: 3, semester: "Ganjil", prodi: "D3 Analisis Kimia", description: "Mempelajari dasar-dasar ilmu kimia termasuk struktur atom, ikatan kimia, dan reaksi kimia dasar.", students: 120, lecturer: "Dr. Ahmad Wijaya", color: "from-primary/20 to-primary/5" },
  { id: 2, code: "KIM201", name: "Kimia Organik", sks: 4, semester: "Genap", prodi: "D3 Analisis Kimia", description: "Kajian mendalam tentang senyawa organik, reaksi, dan mekanisme dalam kimia organik.", students: 85, lecturer: "Prof. Sari Dewi", color: "from-success/20 to-success/5" },
  { id: 3, code: "BIO201", name: "Biokimia", sks: 4, semester: "Ganjil", prodi: "D3 Analisis Kimia", description: "Studi tentang proses kimia dalam organisme hidup, termasuk metabolisme dan enzimologi.", students: 92, lecturer: "Pak Budi Santoso", color: "from-warning/20 to-warning/5" },
  { id: 4, code: "KIM301", name: "Kimia Analitik", sks: 3, semester: "Ganjil", prodi: "D3 Analisis Kimia", description: "Teknik analisis kualitatif dan kuantitatif dalam kimia laboratorium.", students: 78, lecturer: "Dr. Maya Putri", color: "from-accent to-accent/50" },
  { id: 5, code: "INF101", name: "Pemrograman Dasar", sks: 3, semester: "Ganjil", prodi: "D3 Teknik Informatika", description: "Pengenalan konsep pemrograman menggunakan bahasa Python dan logika algoritma.", students: 150, lecturer: "Pak Eko Prasetyo", color: "from-destructive/20 to-destructive/5" },
  { id: 6, code: "INF201", name: "Basis Data", sks: 3, semester: "Genap", prodi: "D3 Teknik Informatika", description: "Desain dan implementasi sistem basis data relasional menggunakan SQL.", students: 130, lecturer: "Dr. Rina Wulandari", color: "from-primary/20 to-primary/5" },
  { id: 7, code: "MAT101", name: "Matematika Terapan", sks: 3, semester: "Ganjil", prodi: "D3 Analisis Kimia", description: "Aplikasi matematika dalam ilmu kimia dan teknik.", students: 140, lecturer: "Prof. Sari Dewi", color: "from-success/20 to-success/5" },
  { id: 8, code: "FIS101", name: "Fisika Dasar", sks: 3, semester: "Ganjil", prodi: "D3 Analisis Kimia", description: "Prinsip-prinsip dasar fisika klasik dan modern.", students: 135, lecturer: "Dr. Maya Putri", color: "from-warning/20 to-warning/5" },
  { id: 9, code: "KIM401", name: "Analisis Instrumen", sks: 4, semester: "Genap", prodi: "D4 Analisis Kimia", description: "Penggunaan instrumen analitik modern untuk analisis kimia.", students: 65, lecturer: "Dr. Ahmad Wijaya", color: "from-accent to-accent/50" },
  { id: 10, code: "ENG101", name: "Bahasa Inggris Akademik", sks: 2, semester: "Ganjil", prodi: "D3 Analisis Kimia", description: "Pengembangan kemampuan bahasa Inggris untuk keperluan akademik.", students: 180, lecturer: "Ms. Linda", color: "from-primary/20 to-primary/5" },
];

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
  { value: "Ganjil", label: "Semester Ganjil" },
  { value: "Genap", label: "Semester Genap" },
];

const prodiOptions = [
  { value: "all", label: "Semua Prodi" },
  { value: "D3 Analisis Kimia", label: "D3 Analisis Kimia" },
  { value: "D3 Teknik Informatika", label: "D3 Teknik Informatika" },
  { value: "D4 Analisis Kimia", label: "D4 Analisis Kimia" },
];

export default function Courses() {
  const currentRole = getUserRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSks, setSelectedSks] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [editCourseOpen, setEditCourseOpen] = useState(false);
  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const [allCourses, setAllCourses] = useState(initialCourses);
  const [editingCourse, setEditingCourse] = useState<typeof initialCourses[0] | null>(null);
  const { toast } = useToast();

  // Form state for add/edit
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    sks: "",
    semester: "",
    prodi: "",
  });

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSks = selectedSks === "all" || course.sks.toString() === selectedSks;
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester;
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

  const handleAddCourse = () => {
    toast({
      title: "Mata Kuliah Ditambahkan!",
      description: "Mata kuliah baru berhasil ditambahkan ke kurikulum.",
    });
    setAddCourseOpen(false);
    setFormData({ code: "", name: "", sks: "", semester: "", prodi: "" });
  };

  const handleEditCourse = (course: typeof initialCourses[0]) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      sks: course.sks.toString(),
      semester: course.semester,
      prodi: course.prodi,
    });
    setEditCourseOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingCourse) {
      setAllCourses(prev => prev.map(c => 
        c.id === editingCourse.id 
          ? { ...c, code: formData.code, name: formData.name, sks: parseInt(formData.sks), semester: formData.semester, prodi: formData.prodi }
          : c
      ));
      toast({
        title: "Mata Kuliah Diperbarui!",
        description: `${formData.name} berhasil diperbarui.`,
      });
      setEditCourseOpen(false);
      setEditingCourse(null);
      setFormData({ code: "", name: "", sks: "", semester: "", prodi: "" });
    }
  };

  const handleImportCsv = () => {
    toast({
      title: "Import CSV Berhasil!",
      description: "Data mata kuliah berhasil diimport dari file CSV.",
    });
    setImportCsvOpen(false);
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
        Menampilkan <strong>{filteredCourses.length}</strong> dari {allCourses.length} mata kuliah
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
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
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
        </main>
      </div>
    </div>
  );
}