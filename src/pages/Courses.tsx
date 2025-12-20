import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header, UserRole } from "@/components/lms/Header";
import { BookOpen, Search, Filter, ChevronDown, Clock, Users, GraduationCap, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allCourses = [
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

export default function Courses() {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSks, setSelectedSks] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSks = selectedSks === "all" || course.sks.toString() === selectedSks;
    const matchesSemester = selectedSemester === "all" || course.semester === selectedSemester;
    return matchesSearch && matchesSks && matchesSemester;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
        <main className="p-6">
          <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Perpustakaan Mata Kuliah 📚</h1>
                <p className="mt-1 text-muted-foreground">Kurikulum Politeknik AKA Bogor</p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex rounded-lg border border-border bg-muted p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
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
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              Menampilkan <strong>{filteredCourses.length}</strong> dari {allCourses.length} mata kuliah
            </p>

            {/* Courses Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-3 gap-5">
                {filteredCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="group rounded-xl bg-card border border-border/50 shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn("h-24 bg-gradient-to-br relative", course.color)}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-foreground/20" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-background/90 text-foreground">
                          {course.code}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {course.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {course.sks} SKS
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {course.students} Mahasiswa
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{course.lecturer}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          course.semester === "Ganjil" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                        )}>
                          {course.semester}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                          {course.prodi}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="rounded-xl bg-card border border-border/50 shadow-card p-5 hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="flex items-start gap-5">
                      <div className={cn("w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", course.color)}>
                        <BookOpen className="h-8 w-8 text-foreground/30" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-primary">{course.code}</span>
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium",
                                course.semester === "Ganjil" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                              )}>
                                {course.semester}
                              </span>
                            </div>
                            <h3 className="mt-1 font-semibold text-foreground text-lg">{course.name}</h3>
                          </div>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                            {course.sks} SKS
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
                        <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="h-4 w-4" />
                            {course.lecturer}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4" />
                            {course.students} Mahasiswa
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted">{course.prodi}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
