import { useState } from "react";
import { ArrowLeft, Plus, FileText, Video, Download, Upload, Users, Calendar, Clock, GripVertical, ChevronLeft, Check, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CourseDetailProps {
  course: {
    id: number;
    name: string;
    code: string;
    lecturer: string;
    color: string;
  };
  userRole: "student" | "lecturer";
  onBack: () => void;
}

const materialsData = [
  {
    id: 1,
    week: "Pertemuan 1",
    title: "Pengenalan Kimia Dasar",
    materials: [
      { id: 1, name: "Slide Pengantar Kimia.pdf", type: "pdf", size: "2.4 MB" },
      { id: 2, name: "Video Penjelasan Atom.mp4", type: "video", duration: "15:30" },
    ],
  },
  {
    id: 2,
    week: "Pertemuan 2",
    title: "Struktur Atom dan Tabel Periodik",
    materials: [
      { id: 3, name: "Modul Struktur Atom.pdf", type: "pdf", size: "3.1 MB" },
      { id: 4, name: "Latihan Soal Bab 2.pdf", type: "pdf", size: "1.2 MB" },
      { id: 5, name: "Tutorial Tabel Periodik.mp4", type: "video", duration: "22:45" },
    ],
  },
  {
    id: 3,
    week: "Pertemuan 3",
    title: "Ikatan Kimia",
    materials: [
      { id: 6, name: "Slide Ikatan Kimia.pdf", type: "pdf", size: "4.0 MB" },
    ],
  },
];

const assignmentsData = [
  {
    id: 1,
    title: "Laporan Praktikum 1",
    description: "Buat laporan praktikum tentang reaksi kimia dasar",
    deadline: "20 Desember 2024",
    status: "pending",
    maxScore: 100,
  },
  {
    id: 2,
    title: "Quiz Bab 1-2",
    description: "Quiz online tentang struktur atom dan tabel periodik",
    deadline: "22 Desember 2024",
    status: "submitted",
    maxScore: 50,
    submittedAt: "18 Desember 2024",
  },
  {
    id: 3,
    title: "Tugas Kelompok: Presentasi",
    description: "Presentasi tentang aplikasi kimia dalam kehidupan sehari-hari",
    deadline: "5 Januari 2025",
    status: "pending",
    maxScore: 100,
  },
];

const membersData = [
  { id: 1, name: "Siti Rahayu", nim: "2024001", email: "siti@mhs.aka.ac.id" },
  { id: 2, name: "Ahmad Fadli", nim: "2024002", email: "ahmad@mhs.aka.ac.id" },
  { id: 3, name: "Dewi Lestari", nim: "2024003", email: "dewi@mhs.aka.ac.id" },
  { id: 4, name: "Rina Wulandari", nim: "2024005", email: "rina@mhs.aka.ac.id" },
  { id: 5, name: "Eko Prasetyo", nim: "2023008", email: "eko@mhs.aka.ac.id" },
  { id: 6, name: "Maya Putri", nim: "2024007", email: "maya@mhs.aka.ac.id" },
];

// Grading data for lecturer view
const gradingData = [
  { id: 1, name: "Siti Rahayu", nim: "2024001", status: "submitted", fileName: "laporan_siti.pdf", grade: null },
  { id: 2, name: "Ahmad Fadli", nim: "2024002", status: "submitted", fileName: "laporan_ahmad.pdf", grade: 85 },
  { id: 3, name: "Dewi Lestari", nim: "2024003", status: "pending", fileName: null, grade: null },
  { id: 4, name: "Rina Wulandari", nim: "2024005", status: "submitted", fileName: "laporan_rina.pdf", grade: 92 },
  { id: 5, name: "Eko Prasetyo", nim: "2023008", status: "pending", fileName: null, grade: null },
  { id: 6, name: "Maya Putri", nim: "2024007", status: "submitted", fileName: "laporan_maya.pdf", grade: null },
];

export function CourseDetail({ course, userRole, onBack }: CourseDetailProps) {
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<typeof assignmentsData[0] | null>(null);
  const [grades, setGrades] = useState<Record<number, number | null>>(() => {
    const initial: Record<number, number | null> = {};
    gradingData.forEach(student => {
      initial[student.id] = student.grade;
    });
    return initial;
  });

  const isLecturer = userRole === "lecturer";

  const handleGradeChange = (studentId: number, value: string) => {
    const numValue = value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
    setGrades(prev => ({ ...prev, [studentId]: numValue }));
  };

  const handleSaveGrades = () => {
    // Simulate saving grades
    alert("Nilai berhasil disimpan!");
    setSelectedAssignment(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={selectedAssignment && isLecturer ? () => setSelectedAssignment(null) : onBack}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br", course.color)} />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {selectedAssignment && isLecturer ? selectedAssignment.title : course.name}
              </h1>
              <p className="text-muted-foreground">
                {selectedAssignment && isLecturer 
                  ? `${course.name} • Deadline: ${selectedAssignment.deadline}`
                  : `${course.code} • ${course.lecturer}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grading View for Lecturer */}
      {selectedAssignment && isLecturer ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Daftar Pengumpulan Tugas</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAssignment.description}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Nilai Maks: {selectedAssignment.maxScore}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nama Mahasiswa
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      NIM
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      File
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nilai (0-100)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {gradingData.map((student, index) => (
                    <tr
                      key={student.id}
                      className="hover:bg-muted/30 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {student.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                        {student.nim}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          student.status === "submitted" 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        )}>
                          {student.status === "submitted" ? (
                            <><Check className="h-3 w-3" /> Sudah Kumpul</>
                          ) : (
                            <><X className="h-3 w-3" /> Belum Kumpul</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {student.fileName ? (
                          <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Download className="h-4 w-4" />
                            {student.fileName}
                          </button>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[student.id] ?? ""}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          placeholder="-"
                          disabled={student.status === "pending"}
                          className={cn(
                            "w-20 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                            student.status === "pending" && "opacity-50 cursor-not-allowed"
                          )}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {gradingData.filter(s => s.status === "submitted").length}
                  </span> dari <span className="font-medium text-foreground">{gradingData.length}</span> mahasiswa sudah mengumpulkan
                </p>
                <button
                  onClick={handleSaveGrades}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  Simpan Nilai
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Tabs View */
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
            <TabsTrigger value="materials" className="data-[state=active]:bg-background">
              <FileText className="mr-2 h-4 w-4" />
              Materi
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-background">
              <Calendar className="mr-2 h-4 w-4" />
              Tugas
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-background">
              <Users className="mr-2 h-4 w-4" />
              Anggota
            </TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials" className="mt-6">
            <div className="space-y-4">
              {isLecturer && (
                <div className="flex justify-end">
                  <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                        <Plus className="h-4 w-4" />
                        Tambah Materi
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tambah Materi Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Pertemuan</label>
                          <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Pertemuan 1</option>
                            <option>Pertemuan 2</option>
                            <option>Pertemuan 3</option>
                            <option>Pertemuan 4</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Judul Materi</label>
                          <input
                            type="text"
                            placeholder="Masukkan judul materi"
                            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Upload File</label>
                          <div className="mt-1.5 rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 text-center">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Drag & drop file atau <span className="text-primary cursor-pointer">browse</span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">PDF, Video (max 50MB)</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => setAddMaterialOpen(false)}
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => setAddMaterialOpen(false)}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <Accordion type="multiple" className="space-y-3">
                {materialsData.map((week, index) => (
                  <AccordionItem
                    key={week.id}
                    value={`week-${week.id}`}
                    className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline [&[data-state=open]]:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {week.id}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground">{week.week}</p>
                          <p className="text-sm text-muted-foreground">{week.title}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border bg-muted/20 px-4 py-3">
                      <div className="space-y-2">
                        {week.materials.map((material) => (
                          <div
                            key={material.id}
                            className="group flex items-center justify-between rounded-lg bg-card border border-border/50 p-3 hover:border-primary/30 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {material.type === "pdf" ? (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                                  <FileText className="h-5 w-5 text-destructive" />
                                </div>
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                  <Video className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-foreground">{material.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {material.type === "pdf" ? material.size : material.duration}
                                </p>
                              </div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="mt-6">
            <div className="space-y-4">
              {isLecturer && (
                <div className="flex justify-end">
                  <Dialog open={addAssignmentOpen} onOpenChange={setAddAssignmentOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                        <Plus className="h-4 w-4" />
                        Buat Tugas
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Buat Tugas Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Judul Tugas</label>
                          <input
                            type="text"
                            placeholder="Masukkan judul tugas"
                            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Deskripsi</label>
                          <textarea
                            rows={3}
                            placeholder="Masukkan deskripsi tugas"
                            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Deadline</label>
                            <input
                              type="date"
                              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Nilai Maksimal</label>
                            <input
                              type="number"
                              placeholder="100"
                              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => setAddAssignmentOpen(false)}
                            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => setAddAssignmentOpen(false)}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                          >
                            Buat Tugas
                          </button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <div className="space-y-4">
                {assignmentsData.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className={cn(
                      "rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-lg transition-all animate-fade-in",
                      isLecturer && "cursor-pointer hover:border-primary/50"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => isLecturer && setSelectedAssignment(assignment)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-medium",
                              assignment.status === "submitted"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            )}
                          >
                            {assignment.status === "submitted" ? "Sudah Dikumpul" : "Belum Dikumpul"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p>
                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            Deadline: {assignment.deadline}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            Nilai: {assignment.maxScore}
                          </div>
                        </div>
                        {isLecturer && (
                          <p className="mt-2 text-xs text-primary">Klik untuk melihat & menilai pengumpulan →</p>
                        )}
                      </div>
                    </div>

                    {/* Student Upload Area */}
                    {!isLecturer && assignment.status === "pending" && (
                      <div className="mt-4 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={() => setDragOver(false)}
                          className={cn(
                            "rounded-lg border-2 border-dashed p-6 text-center transition-all",
                            dragOver
                              ? "border-primary bg-primary/5"
                              : "border-border bg-muted/30"
                          )}
                        >
                          <GripVertical className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 font-medium text-foreground">
                            Drag & drop file tugas Anda di sini
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">PDF, DOC, DOCX (max 10MB)</p>
                        </div>
                        <button className="mt-3 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                          <Upload className="mr-2 inline h-4 w-4" />
                          Upload Tugas
                        </button>
                      </div>
                    )}

                    {!isLecturer && assignment.status === "submitted" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 rounded-lg bg-success/10 p-3">
                          <FileText className="h-5 w-5 text-success" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-success">Tugas telah dikumpulkan</p>
                            <p className="text-xs text-success/80">Dikumpul pada: {assignment.submittedAt}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Daftar Mahasiswa</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {membersData.length} Mahasiswa
                  </span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {membersData.map((member, index) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.nim}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
