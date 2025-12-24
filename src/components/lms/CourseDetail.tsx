import { useState, useRef } from "react";
import { ArrowLeft, Plus, FileText, Video, Download, Upload, Users, Calendar, Clock, Check, X, Link, Paperclip, MessageSquare, Trash2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useAcademicData } from "@/contexts/AcademicDataContext";
import { useToast } from "@/hooks/use-toast";
import { downloadCSV, generateGradeReportCSV } from "@/lib/file-utils";

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

export function CourseDetail({ course, userRole, onBack }: CourseDetailProps) {
  const { toast } = useToast();
  const { 
    tasks, 
    getTasksByCourse, 
    getSubmissionsByTask, 
    updateSubmissionGrade, 
    getStudentSubmission, 
    deleteTask, 
    deleteMaterial,
    addTask,
    addMaterial,
    addMaterialWeek,
    getMaterialsByCourse,
    submitAssignment
  } = useAcademicData();
  
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<typeof courseTasks[0] | null>(null);
  const [materialType, setMaterialType] = useState<"document" | "video">("document");
  const [grades, setGrades] = useState<Record<number, number | null>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  
  // Delete confirmation states
  const [deleteTaskOpen, setDeleteTaskOpen] = useState(false);
  const [deleteMaterialOpen, setDeleteMaterialOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);

  // Form states for new material
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [newMaterialWeek, setNewMaterialWeek] = useState("Pertemuan 1");
  const [newMaterialFile, setNewMaterialFile] = useState<File | null>(null);
  const [newMaterialVideoUrl, setNewMaterialVideoUrl] = useState("");
  const materialFileRef = useRef<HTMLInputElement>(null);

  // Form states for new task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskMaxScore, setNewTaskMaxScore] = useState("100");
  const [newTaskFile, setNewTaskFile] = useState<File | null>(null);
  const [newTaskLink, setNewTaskLink] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const taskFileRef = useRef<HTMLInputElement>(null);

  // Student submission state
  const [studentSubmissionFile, setStudentSubmissionFile] = useState<File | null>(null);
  const studentFileRef = useRef<HTMLInputElement>(null);

  const isLecturer = userRole === "lecturer";
  const studentNim = "2024001"; // Simulated student
  const studentName = "Siti Rahayu";
  
  const courseTasks = getTasksByCourse(course.id);
  const courseMaterials = getMaterialsByCourse(course.id);
  const assignmentsData = courseTasks.map(task => {
    const submission = getStudentSubmission(task.id, studentNim);
    return {
      ...task,
      status: submission?.status || "pending",
      submittedAt: submission?.submittedAt,
      grade: submission?.grade,
      lecturerNote: submission?.lecturerNote,
    };
  });

  const handleGradeChange = (submissionId: number, value: string) => {
    const numValue = value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
    setGrades(prev => ({ ...prev, [submissionId]: numValue }));
  };

  const handleNoteChange = (submissionId: number, value: string) => {
    setNotes(prev => ({ ...prev, [submissionId]: value }));
  };

  const handleSaveGrades = () => {
    const taskSubmissions = selectedAssignment ? getSubmissionsByTask(selectedAssignment.id) : [];
    taskSubmissions.forEach(sub => {
      const grade = grades[sub.id] ?? sub.grade;
      const note = notes[sub.id] ?? sub.lecturerNote;
      if (grade !== sub.grade || note !== sub.lecturerNote) {
        updateSubmissionGrade(sub.id, grade, note || null);
      }
    });
    toast({
      title: "Nilai berhasil disimpan!",
      description: "Nilai dan catatan telah diperbarui untuk mahasiswa.",
    });
    setSelectedAssignment(null);
  };

  const handleDeleteTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(taskId);
    setDeleteTaskOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      toast({
        title: "Tugas berhasil dihapus!",
        description: "Tugas dan semua pengumpulan terkait telah dihapus.",
      });
    }
    setDeleteTaskOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteMaterial = (materialId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMaterialToDelete(materialId);
    setDeleteMaterialOpen(true);
  };

  const confirmDeleteMaterial = () => {
    if (materialToDelete) {
      deleteMaterial(materialToDelete);
      toast({
        title: "Materi berhasil dihapus!",
        description: "Materi telah dihapus dari pertemuan.",
      });
    }
    setDeleteMaterialOpen(false);
    setMaterialToDelete(null);
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
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Mahasiswa</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">NIM</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">File</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nilai</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Catatan Dosen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {getSubmissionsByTask(selectedAssignment.id).map((student, index) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {student.studentName.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{student.studentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{student.studentNim}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          student.status !== "pending" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                        )}>
                          {student.status !== "pending" ? <><Check className="h-3 w-3" /> Sudah Kumpul</> : <><X className="h-3 w-3" /> Belum Kumpul</>}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {student.fileName ? (
                          <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Download className="h-4 w-4" />{student.fileName}
                          </button>
                        ) : <span className="text-sm text-muted-foreground">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={grades[student.id] ?? student.grade ?? ""}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          placeholder="-"
                          disabled={student.status === "pending"}
                          className={cn(
                            "w-20 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                            student.status === "pending" && "opacity-50 cursor-not-allowed"
                          )}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea
                          rows={2}
                          value={notes[student.id] ?? student.lecturerNote ?? ""}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          placeholder="Catatan untuk mahasiswa..."
                          disabled={student.status === "pending"}
                          className={cn(
                            "w-48 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none",
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
                  <span className="font-medium text-foreground">{getSubmissionsByTask(selectedAssignment.id).filter(s => s.status !== "pending").length}</span> dari <span className="font-medium text-foreground">{getSubmissionsByTask(selectedAssignment.id).length}</span> mahasiswa sudah mengumpulkan
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => toast({ title: "Export berhasil!", description: "Rekap nilai diekspor ke Excel." })} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                    <Download className="h-4 w-4" />Export Rekap
                  </button>
                  <button onClick={handleSaveGrades} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                    Simpan Nilai
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Tabs View */
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted">
            <TabsTrigger value="materials" className="data-[state=active]:bg-background"><FileText className="mr-2 h-4 w-4" />Materi</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-background"><Calendar className="mr-2 h-4 w-4" />Tugas</TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-background"><Users className="mr-2 h-4 w-4" />Anggota</TabsTrigger>
          </TabsList>

          {/* Materials Tab */}
          <TabsContent value="materials" className="mt-6">
            <div className="space-y-4">
              {isLecturer && (
                <div className="flex justify-end">
                  <Dialog open={addMaterialOpen} onOpenChange={setAddMaterialOpen}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                        <Plus className="h-4 w-4" />Tambah Materi
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader><DialogTitle>Tambah Materi Baru</DialogTitle></DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Pertemuan</label>
                          <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                            <option>Pertemuan 1</option><option>Pertemuan 2</option><option>Pertemuan 3</option><option>Pertemuan 4</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Judul Materi</label>
                          <input type="text" placeholder="Masukkan judul materi" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Jenis Materi</label>
                          <div className="mt-2 grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setMaterialType("document")} className={cn("flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all", materialType === "document" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted")}><FileText className="h-5 w-5" />Upload Dokumen</button>
                            <button type="button" onClick={() => setMaterialType("video")} className={cn("flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all", materialType === "video" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted")}><Link className="h-5 w-5" />Link Video</button>
                          </div>
                        </div>
                        {materialType === "document" ? (
                          <div className="animate-fade-in">
                            <label className="text-sm font-medium text-foreground">Upload Dokumen</label>
                            <div className="mt-1.5 rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 text-center hover:border-primary/50 transition-colors">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">Drag & drop file atau <span className="text-primary cursor-pointer hover:underline">browse</span></p>
                              <p className="mt-1 text-xs text-muted-foreground">PDF, PPT, PPTX, DOC, DOCX (max 50MB)</p>
                            </div>
                          </div>
                        ) : (
                          <div className="animate-fade-in">
                            <label className="text-sm font-medium text-foreground">Link Video</label>
                            <div className="mt-1.5 relative">
                              <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <input type="url" placeholder="Tempel link Youtube atau Google Drive di sini" className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end gap-3 pt-2">
                          <button onClick={() => { setAddMaterialOpen(false); setMaterialType("document"); }} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                          <button onClick={() => { setAddMaterialOpen(false); setMaterialType("document"); toast({ title: "Materi berhasil ditambahkan!" }); }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">Simpan</button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <Accordion type="multiple" className="space-y-3">
                {courseMaterials.map((week, index) => (
                  <AccordionItem key={week.id} value={`week-${week.id}`} className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline [&[data-state=open]]:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{index + 1}</div>
                        <div className="text-left"><p className="font-semibold text-foreground">{week.week}</p><p className="text-sm text-muted-foreground">{week.title}</p></div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border bg-muted/20 px-4 py-3">
                      <div className="space-y-2">
                        {week.materials.map((material) => (
                          <div key={material.id} className="group flex items-center justify-between rounded-lg bg-card border border-border/50 p-3 hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              {material.type === "pdf" ? (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10"><FileText className="h-5 w-5 text-destructive" /></div>
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Video className="h-5 w-5 text-primary" /></div>
                              )}
                              <div><p className="font-medium text-foreground">{material.name}</p><p className="text-xs text-muted-foreground">{material.type === "pdf" ? material.size : material.duration}</p></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Download className="h-4 w-4" />Download</button>
                              {isLecturer && (
                                <button 
                                  onClick={(e) => handleDeleteMaterial(material.id, e)}
                                  className="flex items-center justify-center h-8 w-8 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {week.materials.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">Belum ada materi untuk pertemuan ini</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                {courseMaterials.length === 0 && (
                  <div className="rounded-xl border border-border bg-card p-8 text-center">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Belum ada materi untuk mata kuliah ini</p>
                  </div>
                )}
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
                      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"><Plus className="h-4 w-4" />Buat Tugas</button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                      <DialogHeader><DialogTitle>Buat Tugas Baru</DialogTitle></DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div><label className="text-sm font-medium text-foreground">Judul Tugas</label><input type="text" placeholder="Masukkan judul tugas" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
                        <div><label className="text-sm font-medium text-foreground">Deskripsi</label><textarea rows={3} placeholder="Masukkan deskripsi tugas" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-sm font-medium text-foreground">Deadline</label><input type="date" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
                          <div><label className="text-sm font-medium text-foreground">Nilai Maksimal</label><input type="number" placeholder="100" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
                        </div>
                        
                        {/* File Upload Area */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Upload Soal/Lampiran (Opsional)</label>
                          <div className="mt-1.5 rounded-lg border-2 border-dashed border-border bg-muted/50 p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Drag & drop file atau <span className="text-primary cursor-pointer hover:underline">browse</span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX (max 25MB)</p>
                          </div>
                        </div>

                        {/* External Link Input */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Link Eksternal (Opsional)</label>
                          <div className="mt-1.5 relative">
                            <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input 
                              type="url" 
                              placeholder="Tempel link YouTube, Google Drive, atau link lainnya" 
                              className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" 
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Contoh: https://youtube.com/watch?v=... atau https://drive.google.com/...
                          </p>
                        </div>

                        {/* Catatan Tambahan */}
                        <div>
                          <label className="text-sm font-medium text-foreground">Catatan Tambahan (Opsional)</label>
                          <textarea 
                            rows={3} 
                            placeholder="Tulis instruksi khusus atau catatan penting untuk mahasiswa..." 
                            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
                          />
                          <p className="mt-1 text-xs text-muted-foreground">Catatan ini akan ditampilkan kepada mahasiswa saat membuka detail tugas.</p>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button onClick={() => setAddAssignmentOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">Batal</button>
                          <button onClick={() => { setAddAssignmentOpen(false); toast({ title: "Tugas berhasil dibuat!" }); }} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">Buat Tugas</button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <div className="space-y-4">
                {assignmentsData.map((assignment, index) => (
                  <div key={assignment.id} className={cn("rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-lg transition-all animate-fade-in", isLecturer && "cursor-pointer hover:border-primary/50")} style={{ animationDelay: `${index * 100}ms` }} onClick={() => isLecturer && setSelectedAssignment(assignment)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", assignment.status !== "pending" ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                            {assignment.status !== "pending" ? "Sudah Dikumpul" : "Belum Dikumpul"}
                          </span>
                          {assignment.grade !== null && assignment.grade !== undefined && (
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Nilai: {assignment.grade}</span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p>
                        
                        {/* Student: Show Catatan Tambahan from Task Creation */}
                        {!isLecturer && assignment.additionalNotes && (
                          <div className="mt-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                            <div className="flex items-center gap-2 text-sm font-medium text-warning mb-1">
                              <Paperclip className="h-4 w-4" />
                              Catatan Tambahan dari Dosen
                            </div>
                            <p className="text-sm text-foreground">{assignment.additionalNotes}</p>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" />Deadline: {assignment.deadline}</div>
                          <div className="flex items-center gap-1.5"><FileText className="h-4 w-4" />Nilai Maks: {assignment.maxScore}</div>
                        </div>
                        {isLecturer && <p className="mt-2 text-xs text-primary">Klik untuk melihat & menilai pengumpulan →</p>}
                        
                        {/* Student: Show Lecturer Note if graded (Feedback after grading) */}
                        {!isLecturer && assignment.lecturerNote && (
                          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-1">
                              <MessageSquare className="h-4 w-4" />
                              Catatan Penilaian dari Dosen
                            </div>
                            <p className="text-sm text-foreground">{assignment.lecturerNote}</p>
                          </div>
                        )}
                      </div>
                      {/* Delete button for lecturer */}
                      {isLecturer && (
                        <button 
                          onClick={(e) => handleDeleteTask(assignment.id, e)}
                          className="flex items-center justify-center h-9 w-9 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors ml-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Student Upload Area */}
                    {!isLecturer && assignment.status === "pending" && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4" onClick={(e) => e.stopPropagation()}>
                        {assignment.hasAttachment && (
                          <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
                              <div><p className="text-sm font-medium text-foreground">Instruksi/Soal dari Dosen</p><p className="text-xs text-muted-foreground">{assignment.attachmentName}</p></div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"><Download className="h-4 w-4" />Download</button>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-foreground">Upload File Tugas</label>
                          <input 
                            ref={studentFileRef}
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setStudentSubmissionFile(file);
                            }}
                          />
                          <div 
                            onClick={() => studentFileRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} 
                            onDragLeave={() => setDragOver(false)} 
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              const file = e.dataTransfer.files[0];
                              if (file) setStudentSubmissionFile(file);
                            }} 
                            className={cn("mt-1.5 rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer", 
                              dragOver ? "border-primary bg-primary/5" : 
                              studentSubmissionFile ? "border-success bg-success/5" : "border-border bg-muted/30 hover:border-primary/50"
                            )}
                          >
                            {studentSubmissionFile ? (
                              <div className="flex items-center justify-center gap-3">
                                <Check className="h-5 w-5 text-success" />
                                <span className="font-medium text-success">{studentSubmissionFile.name}</span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setStudentSubmissionFile(null); }}
                                  className="p-1 rounded hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                <p className="mt-2 font-medium text-foreground">Drag & drop file tugas Anda di sini</p>
                                <p className="mt-1 text-sm text-muted-foreground">atau <span className="text-primary cursor-pointer hover:underline">browse file</span></p>
                              </>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            if (studentSubmissionFile) {
                              submitAssignment(assignment.id, course.id, studentNim, studentName, studentSubmissionFile.name);
                              toast({ title: "Tugas berhasil diupload!", description: `File ${studentSubmissionFile.name} telah dikumpulkan.` });
                              setStudentSubmissionFile(null);
                            } else {
                              toast({ title: "Pilih file terlebih dahulu", variant: "destructive" });
                            }
                          }} 
                          disabled={!studentSubmissionFile}
                          className={cn(
                            "w-full rounded-lg py-2.5 text-sm font-medium transition-colors",
                            studentSubmissionFile 
                              ? "bg-primary text-primary-foreground hover:bg-primary-hover" 
                              : "bg-muted text-muted-foreground cursor-not-allowed"
                          )}
                        >
                          <Upload className="mr-2 inline h-4 w-4" />Upload Tugas
                        </button>
                      </div>
                    )}

                    {!isLecturer && assignment.status !== "pending" && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 rounded-lg bg-success/10 p-3">
                          <FileText className="h-5 w-5 text-success" />
                          <div className="flex-1"><p className="text-sm font-medium text-success">Tugas telah dikumpulkan</p><p className="text-xs text-success/80">Dikumpul pada: {assignment.submittedAt}</p></div>
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
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">6 Mahasiswa</span>
                </div>
              </div>
              <div className="divide-y divide-border">
                {[
                  { id: 1, name: "Siti Rahayu", nim: "2024001", email: "siti@mhs.aka.ac.id" },
                  { id: 2, name: "Ahmad Fadli", nim: "2024002", email: "ahmad@mhs.aka.ac.id" },
                  { id: 3, name: "Dewi Lestari", nim: "2024003", email: "dewi@mhs.aka.ac.id" },
                  { id: 4, name: "Rina Wulandari", nim: "2024005", email: "rina@mhs.aka.ac.id" },
                  { id: 5, name: "Eko Prasetyo", nim: "2023008", email: "eko@mhs.aka.ac.id" },
                  { id: 6, name: "Maya Putri", nim: "2024007", email: "maya@mhs.aka.ac.id" },
                ].map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{member.name.charAt(0)}</div>
                    <div className="flex-1"><p className="font-medium text-foreground">{member.name}</p><p className="text-sm text-muted-foreground">{member.nim}</p></div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete Task AlertDialog */}
      <AlertDialog open={deleteTaskOpen} onOpenChange={setDeleteTaskOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tugas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan dan semua pengumpulan mahasiswa terkait akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Material AlertDialog */}
      <AlertDialog open={deleteMaterialOpen} onOpenChange={setDeleteMaterialOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Materi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus materi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMaterial} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}