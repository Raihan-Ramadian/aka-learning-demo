import { useState } from "react";
import { AlertTriangle, Upload, BookOpen, Clock, FileText, ChevronRight, Calendar, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAcademicData } from "@/contexts/AcademicDataContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FileDropZone } from "@/components/ui/file-dropzone";

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export function StudentDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses, getStudentSchedules, submissions, tasks, submitAssignment, academicEvents } = useAcademicData();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedCourseForUpload, setSelectedCourseForUpload] = useState<typeof courses[0] | null>(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [studentNote, setStudentNote] = useState("");
  
  // Simulated student NIM - in real app this would come from auth
  const studentNim = "2024001";
  const studentName = "Siti Rahayu";
  const mySchedules = getStudentSchedules(studentNim);

  // Get student's submissions for progress calculation
  const studentSubmissions = submissions.filter(s => s.studentNim === studentNim);
  const completedTasks = studentSubmissions.filter(s => s.status === "submitted" || s.status === "graded").length;
  const totalTasks = studentSubmissions.length;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate per-course progress
  const getCourseProgress = (courseId: number) => {
    const courseTasks = tasks.filter(t => t.courseId === courseId);
    const courseSubmissions = studentSubmissions.filter(s => 
      courseTasks.some(t => t.id === s.taskId)
    );
    const completed = courseSubmissions.filter(s => s.status === "submitted" || s.status === "graded").length;
    return courseSubmissions.length > 0 ? Math.round((completed / courseSubmissions.length) * 100) : 0;
  };

  // Get upcoming tasks from context
  const upcomingTasks = tasks.slice(0, 3).map(task => {
    const submission = studentSubmissions.find(s => s.taskId === task.id);
    const course = courses.find(c => c.id === task.courseId);
    const isUrgent = task.deadline.includes("20") || task.deadline.includes("22");
    return {
      id: task.id,
      courseId: task.courseId,
      course: course?.name || "Unknown",
      task: task.title,
      deadline: task.deadline,
      urgent: isUrgent && (!submission || submission.status === "pending"),
      status: submission?.status || "pending"
    };
  });

  const pendingTasksCount = upcomingTasks.filter(t => t.status === "pending").length;

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const handleUploadClick = (e: React.MouseEvent, course: typeof courses[0]) => {
    e.stopPropagation();
    setSelectedCourseForUpload(course);
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = () => {
    if (!uploadedFile) {
      toast({ title: "Pilih file terlebih dahulu!", variant: "destructive" });
      return;
    }
    
    // Find the task for the selected course
    const courseTask = tasks.find(t => t.courseId === selectedCourseForUpload?.id);
    if (courseTask && selectedCourseForUpload) {
      submitAssignment(courseTask.id, selectedCourseForUpload.id, studentNim, studentName, uploadedFile.name);
    }
    
    toast({
      title: "Tugas berhasil diupload!",
      description: `Tugas untuk ${selectedCourseForUpload?.name} telah dikirim.`,
    });
    
    // Reset form
    setUploadModalOpen(false);
    setSelectedCourseForUpload(null);
    setUploadedFile(null);
    setStudentNote("");
    setSelectedTask("");
  };

  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  const handleTaskClick = (taskId: number, courseId: number) => {
    navigate(`/course/${courseId}?tab=assignments&task=${taskId}`);
  };

  const getScheduleByDay = (day: string) => mySchedules.filter(s => s.day === day);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString('id-ID', { month: 'short' });
    const endMonth = end.toLocaleDateString('id-ID', { month: 'short' });
    if (startDate === endDate) return `${startDay} ${startMonth}`;
    if (startMonth === endMonth) return `${startDay} - ${endDay} ${startMonth}`;
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const getEventCategoryStyle = (category: "urgent" | "warning" | "success") => {
    switch (category) {
      case "urgent": return "bg-destructive/10 border-destructive/20 text-destructive";
      case "warning": return "bg-warning/10 border-warning/20 text-warning";
      case "success": return "bg-success/10 border-success/20 text-success";
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Halo, Siti 👋</h1>
          <p className="mt-1 text-muted-foreground">D3 Analisis Kimia • Semester 4</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Rabu, 18 Desember 2024</p>
          <p className="text-xs text-muted-foreground">Semester Ganjil 2024/2025</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Jadwal Minggu Ini
          </h2>
          <span className="text-xs text-muted-foreground">{mySchedules.length} mata kuliah</span>
        </div>
        <div className="grid grid-cols-5 border-b border-border">
          {daysOfWeek.map((day) => (
            <div key={day} className="px-3 py-2 text-center border-r border-border last:border-r-0 bg-muted/50">
              <span className="text-xs font-medium text-foreground">{day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 min-h-[120px]">
          {daysOfWeek.map((day) => (
            <div key={day} className="border-r border-border last:border-r-0 p-2 space-y-1.5">
              {getScheduleByDay(day).map((schedule) => (
                <div key={schedule.id} className={cn("p-2 rounded-lg border text-xs", schedule.color || "bg-primary/10 border-primary/30 text-primary")}>
                  <p className="font-medium truncate">{schedule.course}</p>
                  <p className="opacity-80 text-[10px]">{schedule.time}</p>
                  <p className="opacity-70 text-[10px] flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{schedule.room}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Alert Widget */}
      {pendingTasksCount > 0 && (
        <div className="rounded-xl border border-destructive/30 bg-destructive-light p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">⚠️ {pendingTasksCount} Tugas Deadline Dekat</h3>
              <p className="text-sm text-destructive/80">Segera selesaikan tugas Anda sebelum tenggat waktu!</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview - Dynamic */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Mata Kuliah", value: String(courses.length), icon: BookOpen, color: "text-primary" },
          { label: "Tugas Pending", value: String(pendingTasksCount), icon: FileText, color: "text-warning" },
          { label: "Jam Belajar", value: `${mySchedules.length * 2}h`, icon: Clock, color: "text-success" },
          { label: "Progress", value: `${overallProgress}%`, icon: ChevronRight, color: "text-accent-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-card p-4 shadow-card border border-border/50">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Academic Events */}
      {academicEvents.length > 0 && (
        <div className="rounded-xl bg-card border border-border/50 shadow-card p-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            Kalender Akademik
          </h2>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {academicEvents.slice(0, 3).map((event) => (
              <div key={event.id} className={cn("p-3 rounded-lg border", getEventCategoryStyle(event.category))}>
                <p className="font-medium">{formatDateRange(event.startDate, event.endDate)}</p>
                <p className="text-muted-foreground text-xs mt-1">{event.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Course Cards */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Mata Kuliah Saya</h2>
            <button 
              onClick={handleViewAllCourses}
              className="text-sm font-medium text-primary hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {courses.map((course, index) => {
              const progress = getCourseProgress(course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course.id)}
                  className="group rounded-xl bg-card border border-border/50 overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={cn("h-24 bg-gradient-to-br p-4 relative", course.color)}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative">
                      <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">{course.code}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{course.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{course.lecturer}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{progress}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", course.color)} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleUploadClick(e, course)} 
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Upload className="h-4 w-4" />Upload Tugas
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Tugas Mendatang</h2>
            <button 
              onClick={() => navigate("/courses?tab=tasks")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task.id, task.courseId)}
                className={cn("rounded-xl border p-4 transition-all hover:shadow-md animate-slide-in cursor-pointer", task.urgent ? "border-destructive/30 bg-destructive-light" : "border-border/50 bg-card")}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{task.task}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{task.course}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {task.urgent && <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">Urgent</span>}
                    {task.status !== "pending" && (
                      <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">Selesai</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />{task.deadline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Task Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Tugas - {selectedCourseForUpload?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Pilih Tugas</label>
              <select 
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih tugas...</option>
                <option value="laporan1">Laporan Praktikum 1</option>
                <option value="quiz">Quiz Bab 1-2</option>
                <option value="kelompok">Tugas Kelompok: Presentasi</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Upload File</label>
              <FileDropZone
                onFileSelect={(file) => setUploadedFile(file)}
                accept=".pdf,.doc,.docx"
                maxSize={25}
                className="mt-1.5"
                placeholder="Drag & drop file atau"
                acceptedFormats="PDF, DOC, DOCX (max 25MB)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Catatan (Opsional)</label>
              <textarea
                rows={3}
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="Tulis catatan untuk dosen..."
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setUploadedFile(null);
                  setStudentNote("");
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={!uploadedFile}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  uploadedFile 
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Upload Tugas
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}