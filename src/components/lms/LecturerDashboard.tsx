import { Plus, Users, Clock, BookOpen, FileText, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LecturerDashboardProps {
  onCourseClick?: (course: { id: number; name: string; code: string; lecturer: string; color: string }) => void;
}

const todaySchedule = [
  { id: 1, time: "08:00 - 09:40", course: "Kimia Dasar", class: "D3-AK-2A", room: "Lab Kimia 1", students: 32 },
  { id: 2, time: "10:00 - 11:40", course: "Kimia Organik", class: "D3-AK-3B", room: "R.201", students: 28 },
  { id: 3, time: "13:00 - 14:40", course: "Praktikum Kimia", class: "D3-AK-2A", room: "Lab Kimia 2", students: 16 },
];

const courses = [
  {
    id: 1,
    name: "Kimia Dasar",
    code: "KIM101",
    lecturer: "Pak Budi",
    classes: 2,
    students: 64,
    materials: 12,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Kimia Organik",
    code: "KIM301",
    lecturer: "Pak Budi",
    classes: 3,
    students: 84,
    materials: 8,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    name: "Praktikum Kimia",
    code: "KIM102",
    lecturer: "Pak Budi",
    classes: 4,
    students: 64,
    materials: 6,
    color: "from-violet-500 to-purple-500",
  },
];

const pendingTasks = [
  { id: 1, type: "Koreksi", count: 24, course: "Kimia Dasar" },
  { id: 2, type: "Tugas Baru", count: 12, course: "Kimia Organik" },
];

export function LecturerDashboard({ onCourseClick }: LecturerDashboardProps) {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Halo, Pak Budi 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Dosen Prodi D3 Analisis Kimia</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Kelas", value: "9", icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Mahasiswa", value: "212", icon: Users, color: "text-success", bg: "bg-success/10" },
          { label: "Materi Uploaded", value: "26", icon: FileText, color: "text-warning", bg: "bg-warning/10" },
          { label: "Tugas Pending", value: "36", icon: Clock, color: "text-destructive", bg: "bg-destructive/10" },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-xl bg-card p-4 shadow-card border border-border/50 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
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
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {todaySchedule.length} Kelas
            </span>
          </div>
          
          <div className="space-y-3">
            {todaySchedule.map((schedule, index) => (
              <div
                key={schedule.id}
                className="group flex items-center gap-4 rounded-xl bg-card border border-border/50 p-4 shadow-card hover:shadow-lg hover:border-primary/30 transition-all animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Time */}
                <div className="flex-shrink-0 rounded-lg bg-primary/10 px-4 py-3 text-center">
                  <p className="text-sm font-bold text-primary">{schedule.time.split(" - ")[0]}</p>
                  <p className="text-xs text-muted-foreground">{schedule.time.split(" - ")[1]}</p>
                </div>

                {/* Course Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {schedule.course}
                  </h3>
                  <p className="text-sm text-muted-foreground">Kelas {schedule.class}</p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {schedule.room}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {schedule.students} mhs
                  </div>
                </div>

                {/* Status Badge */}
                <span className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  index === 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                )}>
                  {index === 0 ? "Sedang Berlangsung" : "Akan Datang"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Pending Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Perlu Ditindak</h2>
          <div className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div
                key={task.id}
                className="rounded-xl bg-warning-light border border-warning/20 p-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-warning-foreground">{task.count} {task.type}</p>
                    <p className="text-sm text-warning-foreground/70">{task.course}</p>
                  </div>
                  <button className="rounded-lg bg-warning/20 px-3 py-1.5 text-xs font-medium text-warning-foreground hover:bg-warning/30 transition-colors">
                    Lihat
                  </button>
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
            <div
              key={course.id}
              onClick={() => onCourseClick?.(course)}
              className="group rounded-xl bg-card border border-border/50 overflow-hidden shadow-card hover:shadow-lg transition-all animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Course Header */}
              <div className={cn("h-20 bg-gradient-to-br p-4 relative", course.color)}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative flex items-center justify-between">
                  <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {course.code}
                  </span>
                  <span className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {course.classes} Kelas
                  </span>
                </div>
              </div>

              {/* Course Body */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {course.name}
                </h3>
                
                {/* Stats */}
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {course.materials} Materi
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onCourseClick?.(course);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Upload Materi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
