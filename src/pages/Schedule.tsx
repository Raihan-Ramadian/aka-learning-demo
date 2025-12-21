import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header, UserRole } from "@/components/lms/Header";
import { Calendar, Download, Upload, Clock, MapPin, User, ChevronLeft, ChevronRight, FileImage, Users, BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Student/Lecturer schedule
const personalScheduleData = [
  { id: 1, day: "Senin", time: "08:00 - 09:40", course: "Kimia Dasar", room: "Lab Kimia A", lecturer: "Dr. Ahmad Wijaya", className: "D3-AK-2A", color: "bg-primary/10 border-primary/30 text-primary" },
  { id: 2, day: "Senin", time: "10:00 - 11:40", course: "Matematika Terapan", room: "R. 201", lecturer: "Prof. Sari Dewi", className: "D3-AK-2A", color: "bg-success/10 border-success/30 text-success" },
  { id: 3, day: "Selasa", time: "08:00 - 09:40", course: "Kimia Organik", room: "Lab Kimia B", lecturer: "Prof. Sari Dewi", className: "D3-AK-2A", color: "bg-warning/10 border-warning/30 text-warning" },
  { id: 4, day: "Selasa", time: "13:00 - 14:40", course: "Biokimia", room: "R. 302", lecturer: "Pak Budi Santoso", className: "D3-AK-2A", color: "bg-accent border-accent text-accent-foreground" },
  { id: 5, day: "Rabu", time: "10:00 - 11:40", course: "Fisika Dasar", room: "R. 105", lecturer: "Dr. Maya Putri", className: "D3-AK-2A", color: "bg-destructive/10 border-destructive/30 text-destructive" },
  { id: 6, day: "Kamis", time: "08:00 - 09:40", course: "Praktikum Kimia", room: "Lab Kimia A", lecturer: "Dr. Ahmad Wijaya", className: "D3-AK-2A", color: "bg-primary/10 border-primary/30 text-primary" },
  { id: 7, day: "Kamis", time: "13:00 - 15:30", course: "Analisis Instrumen", room: "Lab Instrumen", lecturer: "Prof. Sari Dewi", className: "D4-AK-4A", color: "bg-success/10 border-success/30 text-success" },
  { id: 8, day: "Jumat", time: "08:00 - 09:40", course: "Bahasa Inggris", room: "R. 201", lecturer: "Ms. Linda", className: "D3-AK-2A", color: "bg-warning/10 border-warning/30 text-warning" },
];

// Admin: All classes schedule
const allClassesSchedule = [
  { id: 1, className: "D3-AK-2A", course: "Kimia Dasar", lecturer: "Dr. Ahmad Wijaya", day: "Senin", time: "08:00 - 09:40", room: "Lab Kimia A", students: 32 },
  { id: 2, className: "D3-AK-2B", course: "Kimia Dasar", lecturer: "Dr. Ahmad Wijaya", day: "Rabu", time: "08:00 - 09:40", room: "Lab Kimia A", students: 28 },
  { id: 3, className: "D3-AK-2A", course: "Kimia Organik", lecturer: "Prof. Sari Dewi", day: "Selasa", time: "08:00 - 09:40", room: "Lab Kimia B", students: 32 },
  { id: 4, className: "D3-AK-3A", course: "Biokimia", lecturer: "Pak Budi Santoso", day: "Selasa", time: "13:00 - 14:40", room: "R. 302", students: 30 },
  { id: 5, className: "D4-AK-4A", course: "Analisis Instrumen", lecturer: "Prof. Sari Dewi", day: "Kamis", time: "13:00 - 15:30", room: "Lab Instrumen", students: 25 },
  { id: 6, className: "D3-TI-2A", course: "Pemrograman Dasar", lecturer: "Pak Eko Prasetyo", day: "Senin", time: "10:00 - 11:40", room: "Lab Komputer", students: 35 },
  { id: 7, className: "D3-TI-2A", course: "Basis Data", lecturer: "Dr. Rina Wulandari", day: "Rabu", time: "13:00 - 14:40", room: "Lab Komputer", students: 35 },
];

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function Schedule() {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [uploadAcademicOpen, setUploadAcademicOpen] = useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);

  const getScheduleByDay = (day: string) => {
    return personalScheduleData.filter(s => s.day === day);
  };

  const handleDownloadPDF = () => {
    alert("Download Jadwal (PDF) berhasil! File akan tersimpan di folder Downloads.");
  };

  const handleUploadAcademic = () => {
    alert("Kalender Akademik berhasil diupload!");
    setUploadAcademicOpen(false);
  };

  const getPageTitle = () => {
    switch (currentRole) {
      case "admin":
        return "Manajemen Jadwal Kuliah 📅";
      case "lecturer":
        return "Jadwal Mengajar Saya 👨‍🏫";
      case "student":
        return "Jadwal Kuliah Saya 📅";
    }
  };

  const getPageDescription = () => {
    switch (currentRole) {
      case "admin":
        return "Kelola jadwal seluruh kelas di Politeknik AKA Bogor";
      case "lecturer":
        return "Daftar jadwal mengajar semester ini";
      case "student":
        return "Semester Ganjil 2024/2025";
    }
  };

  // Admin View - Schedule Management
  const renderAdminView = () => (
    <>
      {/* Admin Schedule Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Daftar Jadwal Kelas</h2>
            <button
              onClick={() => setAddScheduleOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Jadwal
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kelas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mata Kuliah</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dosen</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hari</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Jam</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ruangan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mahasiswa</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allClassesSchedule.map((schedule, index) => (
                <tr
                  key={schedule.id}
                  className="hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {schedule.className}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{schedule.course}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{schedule.lecturer}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{schedule.day}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{schedule.time}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{schedule.room}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{schedule.students}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 hover:bg-muted transition-colors" title="Edit">
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
            Total <span className="font-medium text-foreground">{allClassesSchedule.length}</span> jadwal kelas
          </p>
        </div>
      </div>
    </>
  );

  // Student/Lecturer View - Personal Schedule
  const renderPersonalScheduleView = () => (
    <>
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
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">{schedule.course}</h4>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {schedule.className}
                            </span>
                          </div>
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
    </>
  );

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
                <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
                <p className="mt-1 text-muted-foreground">{getPageDescription()}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle for non-admin */}
                {currentRole !== "admin" && (
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
                )}

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

            {/* Role-based Content */}
            {currentRole === "admin" ? renderAdminView() : renderPersonalScheduleView()}
          </div>
        </main>
      </div>

      {/* Add Schedule Modal (Admin) */}
      <Dialog open={addScheduleOpen} onOpenChange={setAddScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Kelas</label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Kelas</option>
                  <option value="d3-ak-2a">D3-AK-2A</option>
                  <option value="d3-ak-2b">D3-AK-2B</option>
                  <option value="d3-ti-2a">D3-TI-2A</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Mata Kuliah</label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Matkul</option>
                  <option value="kim101">Kimia Dasar</option>
                  <option value="kim201">Kimia Organik</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Dosen Pengampu</label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Pilih Dosen</option>
                <option value="ahmad">Dr. Ahmad Wijaya</option>
                <option value="sari">Prof. Sari Dewi</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Hari</label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Hari</option>
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Ruangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Lab Kimia A"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Jam Mulai</label>
                <input
                  type="time"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Jam Selesai</label>
                <input
                  type="time"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAddScheduleOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert("Jadwal berhasil ditambahkan!");
                  setAddScheduleOpen(false);
                }}
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