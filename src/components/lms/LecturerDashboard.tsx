import { Plus, Users, Clock, BookOpen, FileText, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAcademicData } from "@/contexts/AcademicDataContext";

const courses = [
  { id: 1, name: "Kimia Dasar", code: "KIM101", classes: 2, students: 64, materials: 12, color: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Kimia Organik", code: "KIM301", classes: 3, students: 84, materials: 8, color: "from-emerald-500 to-teal-500" },
  { id: 3, name: "Praktikum Kimia", code: "KIM102", classes: 4, students: 64, materials: 6, color: "from-violet-500 to-purple-500" },
];

const pendingTasks = [
  { id: 1, type: "Koreksi", count: 24, course: "Kimia Dasar", courseId: 1 },
  { id: 2, type: "Tugas Baru", count: 12, course: "Kimia Organik", courseId: 4 },
];

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export function LecturerDashboard() {
  const navigate = useNavigate();
  const { academicEvents, getLecturerSchedules } = useAcademicData();
  
  // Simulated lecturer name - in real app this would come from auth
  const lecturerName = "Sari Dewi";
  const mySchedules = getLecturerSchedules(lecturerName);

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

  // Get today's schedule
  const todaySchedule = mySchedules.filter(s => s.day === "Selasa"); // Simulated as Tuesday

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Halo, Prof. Sari Dewi 👋</h1>
          <p className="mt-1 text-muted-foreground">Dosen Prodi D3 Analisis Kimia</p>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Kelas", value: String(mySchedules.length), icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Mahasiswa", value: "212", icon: Users, color: "text-success", bg: "bg-success/10" },
          { label: "Materi Uploaded", value: "26", icon: FileText, color: "text-warning", bg: "bg-warning/10" },
          { label: "Tugas Pending", value: "36", icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
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
          <h2 className="text-lg font-semibold text-foreground">Perlu Ditindak</h2>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div key={task.id} className="rounded-xl bg-warning-light border border-warning/20 p-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-warning-foreground">{task.count} {task.type}</p>
                    <p className="text-sm text-warning-foreground/70">{task.course}</p>
                  </div>
                  <button className="rounded-lg bg-warning/20 px-3 py-1.5 text-xs font-medium text-warning-foreground hover:bg-warning/30 transition-colors">Lihat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Mata Kuliah yang Diampu</h2>
          <button className="text-sm font-medium text-primary hover:underline">Lihat Semua</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <div key={course.id} onClick={() => handleCourseClick(course.id)} className="group rounded-xl bg-card border border-border/50 overflow-hidden shadow-card hover:shadow-lg transition-all animate-scale-in cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
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
                  <div className="flex items-center gap-1"><Users className="h-4 w-4" />{course.students}</div>
                  <div className="flex items-center gap-1"><FileText className="h-4 w-4" />{course.materials} Materi</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleCourseClick(course.id); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                  <Plus className="h-4 w-4" />Upload Materi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}