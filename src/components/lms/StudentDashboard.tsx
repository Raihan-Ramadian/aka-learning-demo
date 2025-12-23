import { AlertTriangle, Upload, BookOpen, Clock, FileText, ChevronRight, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAcademicData } from "@/contexts/AcademicDataContext";

const courses = [
  { id: 1, name: "Kimia Dasar", code: "KIM101", lecturer: "Dr. Ahmad Wijaya", progress: 65, color: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Biokimia", code: "BIO201", lecturer: "Prof. Sari Dewi", progress: 40, color: "from-emerald-500 to-teal-500" },
  { id: 3, name: "Kimia Analitik", code: "KIM202", lecturer: "Dr. Rudi Hartono", progress: 80, color: "from-violet-500 to-purple-500" },
  { id: 4, name: "Kimia Organik", code: "KIM301", lecturer: "Dr. Maya Putri", progress: 25, color: "from-orange-500 to-amber-500" },
];

const upcomingTasks = [
  { id: 1, courseId: 1, course: "Kimia Dasar", task: "Laporan Praktikum 3", deadline: "2 hari lagi", urgent: true },
  { id: 2, courseId: 2, course: "Biokimia", task: "Quiz Bab 5", deadline: "3 hari lagi", urgent: true },
  { id: 3, courseId: 3, course: "Kimia Analitik", task: "Tugas Kelompok", deadline: "1 minggu lagi", urgent: false },
];

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export function StudentDashboard() {
  const navigate = useNavigate();
  const { academicEvents, getStudentSchedules } = useAcademicData();
  
  // Simulated student NIM - in real app this would come from auth
  const studentNim = "2024001";
  const mySchedules = getStudentSchedules(studentNim);

  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case "uas": return "bg-destructive/10 border-destructive/20 text-destructive";
      case "libur": return "bg-warning/10 border-warning/20 text-warning";
      case "semester": return "bg-success/10 border-success/20 text-success";
      default: return "bg-muted border-border text-muted-foreground";
    }
  };

  const getScheduleByDay = (day: string) => mySchedules.filter(s => s.day === day);

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

      {/* Academic Calendar Summary */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card p-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-primary" />
          Kalender Akademik
        </h2>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {academicEvents.map((event) => (
            <div key={event.id} className={cn("p-2.5 rounded-lg border", getEventStyle(event.type))}>
              <p className="font-medium text-xs">{event.dateRange}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{event.title}</p>
            </div>
          ))}
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
      <div className="rounded-xl border border-destructive/30 bg-destructive-light p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-destructive">⚠️ 2 Tugas Deadline Dekat</h3>
            <p className="text-sm text-destructive/80">Segera selesaikan tugas Anda sebelum tenggat waktu!</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Mata Kuliah", value: "4", icon: BookOpen, color: "text-primary" },
          { label: "Tugas Pending", value: "3", icon: FileText, color: "text-warning" },
          { label: "Jam Belajar", value: "24h", icon: Clock, color: "text-success" },
          { label: "Progress", value: "52%", icon: ChevronRight, color: "text-accent-foreground" },
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Course Cards */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Mata Kuliah Saya</h2>
            <button className="text-sm font-medium text-primary hover:underline">Lihat Semua</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {courses.map((course, index) => (
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
                      <span className="font-medium text-foreground">{course.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", course.color)} style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <button onClick={(e) => e.stopPropagation()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Upload className="h-4 w-4" />Upload Tugas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Tugas Mendatang</h2>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => handleCourseClick(task.courseId)}
                className={cn("rounded-xl border p-4 transition-all hover:shadow-md animate-slide-in cursor-pointer", task.urgent ? "border-destructive/30 bg-destructive-light" : "border-border/50 bg-card")}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{task.task}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{task.course}</p>
                  </div>
                  {task.urgent && <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">Urgent</span>}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />{task.deadline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}