import { useState } from "react";
import { Plus, Users, Clock, BookOpen, FileText, Calendar, MapPin, Upload, Link, Video } from "lucide-react";
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

export function LecturerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { courses, getLecturerSchedules, submissions, tasks, materialWeeks, addMaterial, addMaterialWeek, academicEvents, managedLecturers } = useAcademicData();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedCourseForUpload, setSelectedCourseForUpload] = useState<typeof courses[0] | null>(null);
  const [materialType, setMaterialType] = useState<"document" | "video">("document");
  
  // Form states
  const [selectedWeek, setSelectedWeek] = useState("Pertemuan 1");
  const [materialTitle, setMaterialTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  
  // Get lecturer data from context (synced with Admin Kelola User)
  const lecturerNip = "197805152005012001";
  const currentLecturer = managedLecturers.find(l => l.nip === lecturerNip);
  const lecturerName = currentLecturer?.name?.replace(/^(Dr\.|Prof\.|Pak|Bu)\s*/gi, '').trim() || "Dosen";
  const lecturerFullName = currentLecturer?.name || "Dosen";
  const lecturerProdi = currentLecturer?.prodi || "Program Studi";
  const mySchedules = getLecturerSchedules(lecturerName);
  
  // Get unique courses from lecturer's schedules dynamically
  const lecturerCourseNames = [...new Set(mySchedules.map(s => s.course))];
  const lecturerCourses = lecturerCourseNames.map((courseName, index) => {
    const existingCourse = courses.find(c => c.name === courseName);
    const schedulesForCourse = mySchedules.filter(s => s.course === courseName);
    if (existingCourse) {
      return {
        ...existingCourse,
        classes: schedulesForCourse.length,
      };
    }
    // Create a fallback course object for courses not in master data with stable ID
    return {
      id: -1 * (index + 1), // Use negative index for temp IDs to avoid conflicts
      name: courseName,
      code: "N/A",
      lecturer: lecturerName,
      color: "from-primary to-primary/50",
      classes: schedulesForCourse.length,
    };
  });

  // Get unique course IDs from lecturer's schedules
  const lecturerCourseIds = lecturerCourses.map(c => c.id).filter(id => id > 0);
  
  // Calculate dynamic stats - only from lecturer's schedules
  const totalStudents = mySchedules.reduce((sum, s) => sum + s.students.length, 0);
  
  // Filter submissions and tasks only for lecturer's courses
  const lecturerTasks = tasks.filter(t => lecturerCourseIds.includes(t.courseId));
  const lecturerSubmissions = submissions.filter(s => lecturerCourseIds.includes(s.courseId));
  const pendingSubmissions = lecturerSubmissions.filter(s => s.status === "submitted").length;
  
  // Materials only for lecturer's courses
  const lecturerMaterials = materialWeeks.filter(w => lecturerCourseIds.includes(w.courseId));
  const totalMaterials = lecturerMaterials.reduce((sum, w) => sum + w.materials.length, 0);

  // Dynamic pending tasks - only from lecturer's active courses
  const pendingTasks = lecturerCourses
    .filter(course => course.id > 0) // Only valid courses
    .map(course => {
      const courseSubmissions = submissions.filter(s => s.courseId === course.id && s.status === "submitted");
      const courseTasks = tasks.filter(t => t.courseId === course.id);
      return {
        id: course.id,
        type: courseSubmissions.length > 0 ? "Koreksi" : "Tugas",
        count: courseSubmissions.length > 0 ? courseSubmissions.length : courseTasks.length,
        course: course.name,
        courseId: course.id
      };
    })
    .filter(task => task.count > 0); // Only show if there's something to do

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const handleUploadClick = (e: React.MouseEvent, course: typeof courses[0]) => {
    e.stopPropagation();
    setSelectedCourseForUpload(course);
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = () => {
    if (!selectedCourseForUpload || !materialTitle) {
      toast({ title: "Lengkapi data materi!", variant: "destructive" });
      return;
    }
    
    // Find or create week
    const existingWeeks = materialWeeks.filter(w => w.courseId === selectedCourseForUpload.id);
    let weekId = existingWeeks.find(w => w.week === selectedWeek)?.id;
    
    if (!weekId) {
      weekId = addMaterialWeek(selectedCourseForUpload.id, selectedWeek, materialTitle);
    }
    
    // Add material
    if (materialType === "document" && uploadedFile) {
      addMaterial(weekId, selectedCourseForUpload.id, {
        name: uploadedFile.name,
        type: "pdf",
        size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    } else if (materialType === "video" && videoUrl) {
      addMaterial(weekId, selectedCourseForUpload.id, {
        name: materialTitle,
        type: "video",
        duration: "Video Link",
      });
    }
    
    toast({
      title: "Materi berhasil diupload!",
      description: `Materi untuk ${selectedCourseForUpload?.name} telah ditambahkan.`,
    });
    
    // Reset form
    setUploadModalOpen(false);
    setSelectedCourseForUpload(null);
    setMaterialType("document");
    setMaterialTitle("");
    setUploadedFile(null);
    setVideoUrl("");
  };

  const handlePendingTaskClick = (courseId: number) => {
    navigate(`/course/${courseId}?tab=assignments`);
  };

  const handleViewAllCourses = () => {
    navigate("/courses");
  };

  const getScheduleByDay = (day: string) => mySchedules.filter(s => s.day === day);

  // Format date range for display
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

  // Get today's schedule
  const todaySchedule = mySchedules.filter(s => s.day === "Selasa"); // Simulated as Tuesday

  // Calculate students per course from schedules
  const getCourseStudents = (courseId: number) => {
    const courseSchedules = mySchedules.filter(s => 
      lecturerCourses.find(c => c.id === courseId)?.name === s.course
    );
    const uniqueStudents = new Set<string>();
    courseSchedules.forEach(s => s.students.forEach(st => uniqueStudents.add(st.nim)));
    return uniqueStudents.size;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Halo, {lecturerFullName} 👋</h1>
          <p className="mt-1 text-muted-foreground">Dosen Prodi {lecturerProdi}</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Jadwal Mengajar Minggu Ini
          </h2>
          <span className="text-xs text-muted-foreground">{mySchedules.length} kelas</span>
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
                  <p className="opacity-80 text-[10px]">{schedule.className}</p>
                  <p className="opacity-70 text-[10px] flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{schedule.room}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Overview - Dynamic */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Kelas", value: String(mySchedules.length), icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Mahasiswa", value: String(totalStudents), icon: Users, color: "text-success", bg: "bg-success/10" },
          { label: "Materi Uploaded", value: String(totalMaterials), icon: FileText, color: "text-warning", bg: "bg-warning/10" },
          { label: "Perlu Dinilai", value: String(pendingSubmissions), icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
        ].map((stat, index) => (
          <div key={stat.label} className="rounded-xl bg-card p-4 shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Jadwal Mengajar Hari Ini</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{todaySchedule.length} Kelas</span>
          </div>
          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <div className="rounded-xl bg-card border border-border/50 p-8 text-center">
                <p className="text-muted-foreground">Tidak ada jadwal mengajar hari ini</p>
              </div>
            ) : (
              todaySchedule.map((schedule, index) => (
                <div key={schedule.id} className="group flex items-center gap-4 rounded-xl bg-card border border-border/50 p-4 shadow-card hover:shadow-lg hover:border-primary/30 transition-all animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex-shrink-0 rounded-lg bg-primary/10 px-4 py-3 text-center">
                    <p className="text-sm font-bold text-primary">{schedule.time.split(" - ")[0]}</p>
                    <p className="text-xs text-muted-foreground">{schedule.time.split(" - ")[1]}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{schedule.course}</h3>
                    <p className="text-sm text-muted-foreground">Kelas {schedule.className}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{schedule.room}</div>
                    <div className="flex items-center gap-1.5"><Users className="h-4 w-4" />{schedule.students.length} mhs</div>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-medium", index === 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                    {index === 0 ? "Sedang Berlangsung" : "Akan Datang"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Pending Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Perlu Ditindak</h2>
            <button 
              onClick={() => navigate("/courses?tab=grading")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="rounded-xl bg-success/5 border border-success/20 p-6 text-center">
                <FileText className="h-8 w-8 mx-auto text-success mb-2" />
                <p className="text-sm text-muted-foreground">Tidak ada tugas yang perlu ditindak</p>
              </div>
            ) : (
              pendingTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  onClick={() => handlePendingTaskClick(task.courseId)}
                  className="rounded-xl bg-warning-light border border-warning/20 p-4 animate-fade-in cursor-pointer hover:shadow-md transition-all" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-warning-foreground">{task.count} {task.type}</p>
                      <p className="text-sm text-warning-foreground/70">{task.course}</p>
                    </div>
                    <button className="rounded-lg bg-warning/20 px-3 py-1.5 text-xs font-medium text-warning-foreground hover:bg-warning/30 transition-colors">Lihat</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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

      {/* Course Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Mata Kuliah yang Diampu</h2>
          <button 
            onClick={handleViewAllCourses}
            className="text-sm font-medium text-primary hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        {lecturerCourses.length === 0 ? (
          <div className="rounded-xl bg-card border border-border/50 p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Belum ada mata kuliah yang diampu</p>
            <p className="text-sm text-muted-foreground mt-1">Hubungi Admin untuk penugasan jadwal mengajar</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
          {lecturerCourses.map((course, index) => {
            const students = getCourseStudents(course.id);
            // Dynamic materials count from context
            const courseMaterials = materialWeeks.filter(w => w.courseId === course.id);
            const materials = courseMaterials.reduce((sum, w) => sum + w.materials.length, 0);
            return (
              <div 
                key={course.id} 
                onClick={() => handleCourseClick(course.id)} 
                className="group rounded-xl bg-card border border-border/50 overflow-hidden shadow-card hover:shadow-lg transition-all animate-scale-in cursor-pointer" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("h-20 bg-gradient-to-br p-4 relative", course.color)}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex items-center justify-between">
                    <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">{course.code}</span>
                    <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">{course.classes} Kelas</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{course.name}</h3>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1"><Users className="h-4 w-4" />{students}</div>
                    <div className="flex items-center gap-1"><FileText className="h-4 w-4" />{materials} Materi</div>
                  </div>
                  <button 
                    onClick={(e) => handleUploadClick(e, course)} 
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    <Plus className="h-4 w-4" />Upload Materi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Upload Material Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Materi - {selectedCourseForUpload?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Pertemuan</label>
              <select 
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
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
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="Masukkan judul materi"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Material Type Selector */}
            <div>
              <label className="text-sm font-medium text-foreground">Jenis Materi</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMaterialType("document")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                    materialType === "document"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  Upload Dokumen
                </button>
                <button
                  type="button"
                  onClick={() => setMaterialType("video")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                    materialType === "video"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  <Link className="h-5 w-5" />
                  Link Video
                </button>
              </div>
            </div>

            {/* Conditional Content Based on Material Type */}
            {materialType === "document" ? (
              <div className="animate-fade-in">
                <label className="text-sm font-medium text-foreground">Upload Dokumen</label>
                <FileDropZone
                  onFileSelect={(file) => setUploadedFile(file)}
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  maxSize={50}
                  className="mt-1.5"
                  placeholder="Drag & drop file atau"
                  acceptedFormats="PDF, PPT, PPTX, DOC, DOCX (max 50MB)"
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <label className="text-sm font-medium text-foreground">Link Video</label>
                <div className="mt-1.5 relative">
                  <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Tempel link Youtube atau Google Drive di sini"
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Contoh: https://youtube.com/watch?v=... atau https://drive.google.com/...
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setMaterialType("document");
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUploadSubmit}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}