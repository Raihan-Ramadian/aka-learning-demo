import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header, UserRole } from "@/components/lms/Header";
import { Calendar, Download, Upload, Clock, MapPin, User, ChevronLeft, ChevronRight, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const scheduleData = [
  { id: 1, day: "Senin", time: "08:00 - 09:40", course: "Kimia Dasar", room: "Lab Kimia A", lecturer: "Dr. Ahmad Wijaya", color: "bg-primary/10 border-primary/30 text-primary" },
  { id: 2, day: "Senin", time: "10:00 - 11:40", course: "Matematika Terapan", room: "R. 201", lecturer: "Prof. Sari Dewi", color: "bg-success/10 border-success/30 text-success" },
  { id: 3, day: "Selasa", time: "08:00 - 09:40", course: "Kimia Organik", room: "Lab Kimia B", lecturer: "Prof. Sari Dewi", color: "bg-warning/10 border-warning/30 text-warning" },
  { id: 4, day: "Selasa", time: "13:00 - 14:40", course: "Biokimia", room: "R. 302", lecturer: "Pak Budi Santoso", color: "bg-accent border-accent text-accent-foreground" },
  { id: 5, day: "Rabu", time: "10:00 - 11:40", course: "Fisika Dasar", room: "R. 105", lecturer: "Dr. Maya Putri", color: "bg-destructive/10 border-destructive/30 text-destructive" },
  { id: 6, day: "Kamis", time: "08:00 - 09:40", course: "Praktikum Kimia", room: "Lab Kimia A", lecturer: "Dr. Ahmad Wijaya", color: "bg-primary/10 border-primary/30 text-primary" },
  { id: 7, day: "Kamis", time: "13:00 - 15:30", course: "Analisis Instrumen", room: "Lab Instrumen", lecturer: "Prof. Sari Dewi", color: "bg-success/10 border-success/30 text-success" },
  { id: 8, day: "Jumat", time: "08:00 - 09:40", course: "Bahasa Inggris", room: "R. 201", lecturer: "Ms. Linda", color: "bg-warning/10 border-warning/30 text-warning" },
];

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function Schedule() {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [uploadAcademicOpen, setUploadAcademicOpen] = useState(false);

  const getScheduleByDay = (day: string) => {
    return scheduleData.filter(s => s.day === day);
  };

  const handleDownloadPDF = () => {
    alert("Download Jadwal (PDF) berhasil! File akan tersimpan di folder Downloads.");
  };

  const handleUploadAcademic = () => {
    alert("Kalender Akademik berhasil diupload!");
    setUploadAcademicOpen(false);
  };

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
                <h1 className="text-2xl font-bold text-foreground">Jadwal Kuliah 📅</h1>
                <p className="mt-1 text-muted-foreground">Semester Ganjil 2024/2025</p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex rounded-lg border border-border bg-muted p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                      viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className={cn(
                      "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                      viewMode === "calendar" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                    )}
                  >
                    Calendar View
                  </button>
                </div>

                {/* Admin: Upload Academic Calendar */}
                {currentRole === "admin" && (
                  <Dialog open={uploadAcademicOpen} onOpenChange={setUploadAcademicOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Kalender Akademik
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Kalender Akademik</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                          <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="mt-3 font-medium text-foreground">
                            Drag & drop gambar atau PDF di sini
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
                          </p>
                          <p className="mt-3 text-xs text-muted-foreground">Format: JPG, PNG, PDF (max 10MB)</p>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setUploadAcademicOpen(false)}>
                            Batal
                          </Button>
                          <Button onClick={handleUploadAcademic}>
                            Upload
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <Button onClick={handleDownloadPDF} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Jadwal (PDF)
                </Button>
              </div>
            </div>

            {/* Academic Calendar Preview */}
            <div className="rounded-xl bg-card border border-border/50 shadow-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Kalender Akademik
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <span className="text-sm font-medium text-foreground px-3">Desember 2024</span>
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="font-medium text-destructive">16 - 27 Des</p>
                  <p className="text-muted-foreground text-xs mt-1">UAS Semester Ganjil</p>
                </div>
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="font-medium text-warning">28 Des - 5 Jan</p>
                  <p className="text-muted-foreground text-xs mt-1">Libur Akhir Tahun</p>
                </div>
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <p className="font-medium text-success">6 Jan 2025</p>
                  <p className="text-muted-foreground text-xs mt-1">Mulai Semester Genap</p>
                </div>
              </div>
            </div>

            {/* Schedule Content */}
            {viewMode === "list" ? (
              <div className="space-y-4">
                {daysOfWeek.map((day) => {
                  const daySchedule = getScheduleByDay(day);
                  if (daySchedule.length === 0) return null;

                  return (
                    <div key={day} className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
                      <div className="bg-muted/50 px-5 py-3 border-b border-border">
                        <h3 className="font-semibold text-foreground">{day}</h3>
                      </div>
                      <div className="divide-y divide-border">
                        {daySchedule.map((schedule) => (
                          <div key={schedule.id} className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className={cn("w-1 h-full min-h-[60px] rounded-full", schedule.color.split(" ")[0])} />
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{schedule.course}</h4>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {schedule.time}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {schedule.room}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <User className="h-4 w-4" />
                                    {schedule.lecturer}
                                  </span>
                                </div>
                              </div>
                              <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", schedule.color)}>
                                {schedule.time.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Calendar View */
              <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
                <div className="grid grid-cols-6 border-b border-border">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="px-4 py-3 text-center border-r border-border last:border-r-0 bg-muted/50">
                      <span className="font-semibold text-foreground">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-6 min-h-[400px]">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="border-r border-border last:border-r-0 p-2 space-y-2">
                      {getScheduleByDay(day).map((schedule) => (
                        <div
                          key={schedule.id}
                          className={cn("p-3 rounded-lg border text-xs", schedule.color)}
                        >
                          <p className="font-semibold">{schedule.course}</p>
                          <p className="mt-1 opacity-80">{schedule.time}</p>
                          <p className="mt-0.5 opacity-70">{schedule.room}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
