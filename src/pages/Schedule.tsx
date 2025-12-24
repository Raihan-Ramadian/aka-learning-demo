import { useState } from "react";
import { getUserRole } from "@/types/roles";
import { useAcademicData, Student, ClassSchedule } from "@/contexts/AcademicDataContext";
import { Calendar, Download, Upload, Clock, MapPin, User, ChevronLeft, ChevronRight, FileImage, Users, Plus, Pencil, Trash2, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function Schedule() {
  const currentRole = getUserRole();
  const { academicEvents, schedules, addStudentToClass, removeStudentFromClass, updateStudentInClass, updateSchedule } = useAcademicData();
  
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [uploadAcademicOpen, setUploadAcademicOpen] = useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);
  const [importScheduleOpen, setImportScheduleOpen] = useState(false);

  // Student Management Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [editStudentOpen, setEditStudentOpen] = useState(false);
  const [deleteStudentOpen, setDeleteStudentOpen] = useState(false);
  const [importStudentOpen, setImportStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudentNim, setNewStudentNim] = useState("");
  const [newStudentName, setNewStudentName] = useState("");

  // Edit Schedule Modal
  const [editScheduleOpen, setEditScheduleOpen] = useState(false);
  const [editScheduleData, setEditScheduleData] = useState({
    day: "",
    time: "",
    room: "",
    lecturer: "",
  });

  const getScheduleByDay = (day: string) => {
    return schedules.filter(s => s.day === day);
  };

  const handleDownloadPDF = () => {
    toast.success("Download Jadwal (PDF) berhasil!");
  };

  const handleUploadAcademic = () => {
    toast.success("Kalender Akademik berhasil diupload!");
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

  const handleImportSchedule = () => {
    toast.success("Jadwal berhasil diimport dari file CSV/Excel!");
    setImportScheduleOpen(false);
  };

  // Student Management Handlers
  const handleOpenStudentModal = (schedule: ClassSchedule) => {
    setSelectedSchedule(schedule);
    setStudentModalOpen(true);
  };

  const handleAddStudent = () => {
    if (!selectedSchedule || !newStudentNim || !newStudentName) {
      toast.error("Mohon lengkapi data mahasiswa!");
      return;
    }
    const newStudent: Student = {
      id: Date.now(),
      name: newStudentName,
      nim: newStudentNim,
    };
    addStudentToClass(selectedSchedule.id, newStudent);
    toast.success("Mahasiswa berhasil ditambahkan!");
    setNewStudentNim("");
    setNewStudentName("");
    setAddStudentOpen(false);
  };

  const handleEditStudent = () => {
    if (!selectedSchedule || !selectedStudent) return;
    updateStudentInClass(selectedSchedule.id, {
      ...selectedStudent,
      name: newStudentName || selectedStudent.name,
      nim: newStudentNim || selectedStudent.nim,
    });
    toast.success("Data mahasiswa berhasil diperbarui!");
    setEditStudentOpen(false);
    setSelectedStudent(null);
    setNewStudentNim("");
    setNewStudentName("");
  };

  const handleDeleteStudent = () => {
    if (!selectedSchedule || !selectedStudent) return;
    removeStudentFromClass(selectedSchedule.id, selectedStudent.id);
    toast.success("Mahasiswa berhasil dikeluarkan dari kelas!");
    setDeleteStudentOpen(false);
    setSelectedStudent(null);
  };

  const handleImportStudentCSV = () => {
    toast.success("Data mahasiswa berhasil diimport dari CSV!");
    setImportStudentOpen(false);
  };

  const openEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setNewStudentName(student.name);
    setNewStudentNim(student.nim);
    setEditStudentOpen(true);
  };

  const openDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setDeleteStudentOpen(true);
  };

  // Edit Schedule Handlers
  const handleOpenEditSchedule = (schedule: ClassSchedule) => {
    setSelectedSchedule(schedule);
    setEditScheduleData({
      day: schedule.day,
      time: schedule.time,
      room: schedule.room,
      lecturer: schedule.lecturer,
    });
    setEditScheduleOpen(true);
  };

  const handleSaveEditSchedule = () => {
    if (!selectedSchedule) return;
    updateSchedule(selectedSchedule.id, editScheduleData);
    toast.success("Jadwal berhasil diperbarui!");
    setEditScheduleOpen(false);
    setSelectedSchedule(null);
  };

  // Get current schedule from context
  const currentSchedule = selectedSchedule 
    ? schedules.find(s => s.id === selectedSchedule.id) 
    : null;

  // Admin View - Schedule Management
  const renderAdminView = () => (
    <>
      {/* Admin Schedule Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Daftar Jadwal Kelas</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setImportScheduleOpen(true)}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Import Jadwal
              </Button>
              <button
                onClick={() => setAddScheduleOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                <Plus className="h-4 w-4" />
                Tambah Jadwal
              </button>
            </div>
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
              {schedules.map((schedule, index) => (
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleOpenStudentModal(schedule)}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                    >
                      <Users className="h-4 w-4" />
                      {schedule.students.length} mhs
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEditSchedule(schedule)}
                        className="rounded-lg p-2 hover:bg-muted transition-colors" 
                        title="Edit"
                      >
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
            Total <span className="font-medium text-foreground">{schedules.length}</span> jadwal kelas
          </p>
        </div>
      </div>

      {/* Import Schedule Modal */}
      <Dialog open={importScheduleOpen} onOpenChange={setImportScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Data Jadwal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">
                Drag & drop file CSV/Excel di sini
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Format: CSV, XLS, XLSX (max 10MB)</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Format Kolom:</p>
              <p className="text-xs text-muted-foreground">Kelas, Matkul, Dosen, Hari, Jam, Ruangan</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setImportScheduleOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleImportSchedule}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Management Modal */}
      <Dialog open={studentModalOpen} onOpenChange={setStudentModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Daftar Mahasiswa Kelas {currentSchedule?.className}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {currentSchedule?.course} • {currentSchedule?.lecturer}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setImportStudentOpen(true)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
                <Button size="sm" onClick={() => setAddStudentOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Manual
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">No</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">NIM</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentSchedule?.students.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        Belum ada mahasiswa terdaftar di kelas ini
                      </td>
                    </tr>
                  ) : (
                    currentSchedule?.students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="px-4 py-2 text-sm font-medium text-foreground">{student.name}</td>
                        <td className="px-4 py-2 text-sm text-muted-foreground font-mono">{student.nim}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => openEditStudent(student)}
                              className="rounded-lg p-1.5 hover:bg-muted transition-colors" 
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                            </button>
                            <button 
                              onClick={() => openDeleteStudent(student)}
                              className="rounded-lg p-1.5 hover:bg-destructive/10 transition-colors" 
                              title="Hapus"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-muted-foreground">
                Total: <span className="font-medium text-foreground">{currentSchedule?.students.length || 0}</span> mahasiswa
              </p>
              <Button variant="outline" onClick={() => setStudentModalOpen(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Student Modal */}
      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Mahasiswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">NIM</label>
              <input
                type="text"
                value={newStudentNim}
                onChange={(e) => setNewStudentNim(e.target.value)}
                placeholder="Contoh: 2024001"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Contoh: Siti Rahayu"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddStudentOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddStudent}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={editStudentOpen} onOpenChange={setEditStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Mahasiswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">NIM</label>
              <input
                type="text"
                value={newStudentNim}
                onChange={(e) => setNewStudentNim(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditStudentOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditStudent}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Student Confirmation */}
      <AlertDialog open={deleteStudentOpen} onOpenChange={setDeleteStudentOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluarkan Mahasiswa dari Kelas?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengeluarkan <span className="font-medium">{selectedStudent?.name}</span> dari kelas ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Keluarkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Student CSV Modal */}
      <Dialog open={importStudentOpen} onOpenChange={setImportStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Data Mahasiswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-3 font-medium text-foreground">
                Drag & drop file CSV di sini
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Format: CSV (max 5MB)</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Format Kolom:</p>
              <p className="text-xs text-muted-foreground">NIM, Nama</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setImportStudentOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleImportStudentCSV}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Modal */}
      <Dialog open={editScheduleOpen} onOpenChange={setEditScheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Jadwal Kelas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground">{selectedSchedule?.className} - {selectedSchedule?.course}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedSchedule?.students.length} mahasiswa terdaftar</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Hari</label>
              <select 
                value={editScheduleData.day}
                onChange={(e) => setEditScheduleData({...editScheduleData, day: e.target.value})}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Jam</label>
              <input
                type="text"
                value={editScheduleData.time}
                onChange={(e) => setEditScheduleData({...editScheduleData, time: e.target.value})}
                placeholder="Contoh: 08:00 - 09:40"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Ruangan</label>
              <input
                type="text"
                value={editScheduleData.room}
                onChange={(e) => setEditScheduleData({...editScheduleData, room: e.target.value})}
                placeholder="Contoh: Lab Kimia A"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Dosen Pengampu</label>
              <select 
                value={editScheduleData.lecturer}
                onChange={(e) => setEditScheduleData({...editScheduleData, lecturer: e.target.value})}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Dr. Ahmad Wijaya">Dr. Ahmad Wijaya</option>
                <option value="Prof. Sari Dewi">Prof. Sari Dewi</option>
                <option value="Pak Budi Santoso">Pak Budi Santoso</option>
                <option value="Dr. Maya Putri">Dr. Maya Putri</option>
                <option value="Pak Eko Prasetyo">Pak Eko Prasetyo</option>
                <option value="Dr. Rina Wulandari">Dr. Rina Wulandari</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setEditScheduleOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveEditSchedule}>
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
                        <div className={cn("w-1 h-full min-h-[60px] rounded-full", schedule.color?.split(" ")[0] || "bg-primary")} />
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
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", schedule.color || "bg-primary/10 border-primary/30 text-primary")}>
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
                    className={cn("p-3 rounded-lg border text-xs", schedule.color || "bg-primary/10 border-primary/30 text-primary")}
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

  const getEventStyle = (type: string) => {
    switch (type) {
      case "uas":
        return "bg-destructive/10 border-destructive/20 text-destructive";
      case "libur":
        return "bg-warning/10 border-warning/20 text-warning";
      case "semester":
        return "bg-success/10 border-success/20 text-success";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
  };

  return (
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
                      Drag & drop file di sini
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      atau <span className="text-primary cursor-pointer hover:underline">browse file</span>
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">Format: JPG, PNG, PDF, XLS, XLSX, CSV (max 10MB)</p>
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
          {academicEvents.map((event) => (
            <div key={event.id} className={cn("p-3 rounded-lg border", getEventStyle(event.type))}>
              <p className="font-medium">{event.dateRange}</p>
              <p className="text-muted-foreground text-xs mt-1">{event.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role-based Content */}
      {currentRole === "admin" ? renderAdminView() : renderPersonalScheduleView()}

      {/* Add Schedule Modal (Admin) */}
      <Dialog open={addScheduleOpen} onOpenChange={setAddScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Kelas <span className="text-destructive">*</span></label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Pilih Kelas</option>
                <option value="D3-AK-2A">D3-AK-2A</option>
                <option value="D3-AK-2B">D3-AK-2B</option>
                <option value="D3-TI-2A">D3-TI-2A</option>
                <option value="D4-AK-4A">D4-AK-4A</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Mata Kuliah <span className="text-destructive">*</span></label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Pilih Mata Kuliah</option>
                <option value="KIM101">Kimia Dasar</option>
                <option value="KIM201">Kimia Organik</option>
                <option value="BIO201">Biokimia</option>
                <option value="MAT101">Matematika Terapan</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Dosen <span className="text-destructive">*</span></label>
              <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Pilih Dosen</option>
                <option value="Dr. Ahmad Wijaya">Dr. Ahmad Wijaya</option>
                <option value="Prof. Sari Dewi">Prof. Sari Dewi</option>
                <option value="Pak Budi Santoso">Pak Budi Santoso</option>
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
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Pilih Ruangan</option>
                  <option value="Lab Kimia A">Lab Kimia A</option>
                  <option value="Lab Kimia B">Lab Kimia B</option>
                  <option value="Lab Komputer">Lab Komputer</option>
                  <option value="R. 201">R. 201</option>
                  <option value="R. 302">R. 302</option>
                </select>
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
                  toast.success("Jadwal berhasil ditambahkan!");
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
