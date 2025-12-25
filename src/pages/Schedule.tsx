import { useState } from "react";
import { getUserRole } from "@/types/roles";
import { useAcademicData, Student, ClassSchedule, AcademicEvent } from "@/contexts/AcademicDataContext";
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
import { FileDropZone } from "@/components/ui/file-dropzone";
import { downloadPDF, generateSchedulePDFContent } from "@/lib/file-utils";

const daysOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function Schedule() {
  const currentRole = getUserRole();
  const { academicEvents, schedules, courses, managedLecturers, managedStudents, addStudentToClass, removeStudentFromClass, updateStudentInClass, updateSchedule, deleteSchedule, addSchedule, addAcademicEvent, deleteAcademicEvent, importSchedulesFromCSV } = useAcademicData();
  
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);
  const [importScheduleOpen, setImportScheduleOpen] = useState(false);
  
  // Academic Event form states
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStartDate, setNewEventStartDate] = useState("");
  const [newEventEndDate, setNewEventEndDate] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<"urgent" | "warning" | "success">("warning");
  
  // Delete Event Confirmation
  const [deleteEventOpen, setDeleteEventOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<AcademicEvent | null>(null);

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
  const [selectedManagedStudentId, setSelectedManagedStudentId] = useState<number | null>(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  
  // Dropdown filter states for granular filtering
  const [filterSemester, setFilterSemester] = useState<number | null>(null);
  const [filterAngkatan, setFilterAngkatan] = useState<string>("");

  // Delete Schedule Confirmation
  const [deleteScheduleOpen, setDeleteScheduleOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<ClassSchedule | null>(null);

  // Import file state
  const [importedScheduleFile, setImportedScheduleFile] = useState<File | null>(null);
  const [importedStudentFile, setImportedStudentFile] = useState<File | null>(null);

  // Add schedule form states - using courseCode as unique identifier
  const [newScheduleData, setNewScheduleData] = useState({
    className: "",
    courseCode: "", // Use code as unique identifier
    course: "",
    lecturer: "",
    day: "Senin",
    time: "",
    room: "",
  });

  // Edit Schedule Modal
  const [editScheduleOpen, setEditScheduleOpen] = useState(false);
  const [editScheduleData, setEditScheduleData] = useState({
    day: "",
    time: "",
    room: "",
    lecturer: "",
    course: "",
  });

  const getScheduleByDay = (day: string) => {
    return schedules.filter(s => s.day === day);
  };

  const handleDownloadPDF = () => {
    const content = generateSchedulePDFContent(schedules);
    downloadPDF("Jadwal_Kuliah", content);
    toast.success("Download Jadwal (PDF) berhasil!");
  };

  // Add Academic Event Handler
  const handleAddEvent = () => {
    if (!newEventTitle || !newEventStartDate || !newEventEndDate) {
      toast.error("Lengkapi semua data event!");
      return;
    }
    
    addAcademicEvent({
      title: newEventTitle,
      startDate: newEventStartDate,
      endDate: newEventEndDate,
      category: newEventCategory,
    });
    
    toast.success("Event akademik berhasil ditambahkan!");
    setAddEventOpen(false);
    setNewEventTitle("");
    setNewEventStartDate("");
    setNewEventEndDate("");
    setNewEventCategory("warning");
  };
  
  // Delete Event Handler
  const handleDeleteEvent = (event: AcademicEvent) => {
    setEventToDelete(event);
    setDeleteEventOpen(true);
  };
  
  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      deleteAcademicEvent(eventToDelete.id);
      toast.success("Event akademik berhasil dihapus!");
    }
    setDeleteEventOpen(false);
    setEventToDelete(null);
  };
  
  // Format date for display
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = start.toLocaleDateString('id-ID', { month: 'short' });
    const endMonth = end.toLocaleDateString('id-ID', { month: 'short' });
    
    if (startDate === endDate) {
      return `${startDay} ${startMonth}`;
    }
    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };
  
  // Get event style based on category
  const getEventCategoryStyle = (category: "urgent" | "warning" | "success") => {
    switch (category) {
      case "urgent":
        return "bg-destructive/10 border-destructive/20 text-destructive";
      case "warning":
        return "bg-warning/10 border-warning/20 text-warning";
      case "success":
        return "bg-success/10 border-success/20 text-success";
      default:
        return "bg-muted border-border text-muted-foreground";
    }
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
    if (!importedScheduleFile) {
      toast.error("Pilih file terlebih dahulu!");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row if exists
      const dataLines = lines.slice(1);
      
      const schedulesData: Omit<ClassSchedule, 'id'>[] = dataLines.map(line => {
        const [className, course, lecturer, day, time, room] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        return {
          className: className || "",
          course: course || "",
          lecturer: lecturer || "",
          day: day || "Senin",
          time: time || "",
          room: room || "",
          students: [],
          color: "bg-primary/10 border-primary/30 text-primary",
        };
      }).filter(s => s.className && s.course);
      
      if (schedulesData.length > 0) {
        importSchedulesFromCSV(schedulesData);
        toast.success(`${schedulesData.length} jadwal berhasil diimport dari ${importedScheduleFile.name}!`);
      } else {
        toast.error("Tidak ada data valid dalam file CSV!");
      }
      
      setImportScheduleOpen(false);
      setImportedScheduleFile(null);
    };
    reader.readAsText(importedScheduleFile);
  };

  // Delete schedule handler
  const handleDeleteSchedule = (schedule: ClassSchedule) => {
    setScheduleToDelete(schedule);
    setDeleteScheduleOpen(true);
  };

  const confirmDeleteSchedule = () => {
    if (scheduleToDelete) {
      deleteSchedule(scheduleToDelete.id);
      toast.success(`Jadwal ${scheduleToDelete.className} - ${scheduleToDelete.course} berhasil dihapus!`);
    }
    setDeleteScheduleOpen(false);
    setScheduleToDelete(null);
  };

  // Add schedule form states for time
  const [scheduleStartTime, setScheduleStartTime] = useState("");
  const [scheduleEndTime, setScheduleEndTime] = useState("");

  // Add schedule handler
  const handleAddSchedule = () => {
    if (!newScheduleData.className || !newScheduleData.course || !newScheduleData.lecturer || !newScheduleData.day || !scheduleStartTime || !scheduleEndTime || !newScheduleData.room) {
      toast.error("Lengkapi semua data jadwal!");
      return;
    }
    
    const timeRange = `${scheduleStartTime} - ${scheduleEndTime}`;
    
    addSchedule({
      className: newScheduleData.className,
      course: newScheduleData.course,
      lecturer: newScheduleData.lecturer,
      day: newScheduleData.day,
      time: timeRange,
      room: newScheduleData.room,
      students: [],
      color: "bg-primary/10 border-primary/30 text-primary",
    });
    
    toast.success("Jadwal baru berhasil ditambahkan!");
    setAddScheduleOpen(false);
    setNewScheduleData({
      className: "",
      courseCode: "",
      course: "",
      lecturer: "",
      day: "Senin",
      time: "",
      room: "",
    });
    setScheduleStartTime("");
    setScheduleEndTime("");
  };

  // Student Management Handlers
  const handleOpenStudentModal = (schedule: ClassSchedule) => {
    setSelectedSchedule(schedule);
    setStudentModalOpen(true);
  };

  const handleAddStudent = () => {
    if (!selectedSchedule || !selectedManagedStudentId) {
      toast.error("Mohon pilih mahasiswa dari daftar!");
      return;
    }
    
    const selectedManagedStudent = managedStudents.find(s => s.id === selectedManagedStudentId);
    if (!selectedManagedStudent) {
      toast.error("Mahasiswa tidak ditemukan!");
      return;
    }
    
    // Check for duplicate
    const isDuplicate = currentSchedule?.students.some(s => s.nim === selectedManagedStudent.nim);
    if (isDuplicate) {
      toast.error("Mahasiswa sudah terdaftar di kelas ini!");
      return;
    }
    
    const newStudent: Student = {
      id: Date.now(),
      name: selectedManagedStudent.name,
      nim: selectedManagedStudent.nim,
    };
    addStudentToClass(selectedSchedule.id, newStudent);
    toast.success(`${selectedManagedStudent.name} berhasil ditambahkan ke kelas!`);
    setSelectedManagedStudentId(null);
    setStudentSearchQuery("");
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
    if (!selectedSchedule || !importedStudentFile) {
      toast.error("Pilih file terlebih dahulu!");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row if exists
      const dataLines = lines.slice(1);
      
      let addedCount = 0;
      dataLines.forEach(line => {
        const [nim, name] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        if (nim && name) {
          const newStudent: Student = {
            id: Date.now() + addedCount,
            name,
            nim,
          };
          addStudentToClass(selectedSchedule.id, newStudent);
          addedCount++;
        }
      });
      
      if (addedCount > 0) {
        toast.success(`${addedCount} mahasiswa berhasil diimport dari CSV!`);
      } else {
        toast.error("Tidak ada data valid dalam file CSV!");
      }
      
      setImportStudentOpen(false);
      setImportedStudentFile(null);
    };
    reader.readAsText(importedStudentFile);
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
      course: schedule.course,
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
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Belum ada data jadwal. Klik "Tambah Jadwal" untuk menambahkan jadwal baru.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule, index) => (
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
                        <button 
                          onClick={() => handleDeleteSchedule(schedule)}
                          className="rounded-lg p-2 hover:bg-destructive/10 transition-colors" 
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
            <FileDropZone
              onFileSelect={(file) => setImportedScheduleFile(file)}
              accept=".csv,.xls,.xlsx"
              maxSize={10}
              placeholder="Drag & drop file CSV/Excel di sini"
              acceptedFormats="Format: CSV, XLS, XLSX (max 10MB)"
            />
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Format Kolom:</p>
              <p className="text-xs text-muted-foreground">Kelas, Matkul, Dosen, Hari, Jam, Ruangan</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setImportScheduleOpen(false); setImportedScheduleFile(null); }}>
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

      {/* Delete Schedule Confirmation */}
      <AlertDialog open={deleteScheduleOpen} onOpenChange={setDeleteScheduleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jadwal <span className="font-semibold">{scheduleToDelete?.className} - {scheduleToDelete?.course}</span>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSchedule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Add Student Modal - Smart Sorting with Checkbox Filters */}
      <Dialog open={addStudentOpen} onOpenChange={(open) => {
        setAddStudentOpen(open);
        if (!open) {
          setSelectedManagedStudentId(null);
          setStudentSearchQuery("");
          setFilterSemester(null);
          setFilterAngkatan("");
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Mahasiswa ke Kelas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Course Info */}
            {selectedSchedule && (() => {
              const selectedCourse = courses.find(c => c.name === selectedSchedule.course);
              const courseSemester = selectedCourse?.semester;
              const courseProdi = selectedCourse?.prodi;
              const courseAngkatan = courseSemester ? (new Date().getFullYear() - Math.floor((courseSemester - 1) / 2)).toString() : null;
              return (courseSemester || courseProdi) ? (
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Informasi Mata Kuliah:</p>
                  <div className="flex flex-wrap gap-2">
                    {courseSemester && (
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Semester {courseSemester}
                      </span>
                    )}
                    {courseProdi && (
                      <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        {courseProdi}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{selectedCourse?.name}</p>
                </div>
              ) : null;
            })()}
            
            {/* Dropdown Filters - Granular */}
            <div className="p-3 rounded-lg border border-border bg-background">
              <p className="text-sm font-medium text-foreground mb-3">Filter Mahasiswa (Pilih untuk menyaring):</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Semester</label>
                  <select
                    value={filterSemester || ""}
                    onChange={(e) => setFilterSemester(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Semua Semester</option>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Angkatan (Tahun)</label>
                  <input
                    type="number"
                    value={filterAngkatan}
                    onChange={(e) => setFilterAngkatan(e.target.value)}
                    placeholder="Ketik tahun (misal: 2024)"
                    min="2000"
                    max="2099"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Pilih semester dan/atau angkatan untuk menyaring daftar.</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground">Cari Mahasiswa</label>
              <input
                type="text"
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                placeholder="Ketik nama atau NIM..."
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              
              {/* Select All Matching Button */}
              {(() => {
                const selectedCourse = courses.find(c => c.name === selectedSchedule?.course);
                const courseSemester = selectedCourse?.semester;
                const courseProdi = selectedCourse?.prodi;
                const courseYear = courseSemester ? (new Date().getFullYear() - Math.floor((courseSemester - 1) / 2)) : null;
                
                const filteredStudents = managedStudents.filter(student => {
                  const query = studentSearchQuery.toLowerCase();
                  const isAlreadyInClass = currentSchedule?.students.some(s => s.nim === student.nim);
                  const matchesSemester = filterSemester ? student.semester === filterSemester : true;
                  const matchesAngkatan = filterAngkatan ? student.angkatan === filterAngkatan : true;
                  const matchesSearch = student.name.toLowerCase().includes(query) || student.nim.toLowerCase().includes(query);
                  return !isAlreadyInClass && matchesSemester && matchesAngkatan && matchesSearch;
                });
                
                const handleSelectAll = () => {
                  if (!selectedSchedule) return;
                  filteredStudents.forEach(student => {
                    const isDuplicate = currentSchedule?.students.some(s => s.nim === student.nim);
                    if (!isDuplicate) {
                      const newStudent: Student = {
                        id: Date.now() + Math.random(),
                        name: student.name,
                        nim: student.nim,
                      };
                      addStudentToClass(selectedSchedule.id, newStudent);
                    }
                  });
                  toast.success(`${filteredStudents.length} mahasiswa berhasil ditambahkan!`);
                  setAddStudentOpen(false);
                  setSelectedManagedStudentId(null);
                  setStudentSearchQuery("");
                  setFilterSemester(null);
                  setFilterAngkatan("");
                };
                
                return filteredStudents.length > 0 && (filterSemester || filterAngkatan) ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full gap-2"
                    onClick={handleSelectAll}
                  >
                    <Users className="h-4 w-4" />
                    Pilih Semua ({filteredStudents.length} mahasiswa)
                  </Button>
                ) : null;
              })()}
              
              {/* Student List - Smart Sorted */}
              <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-border bg-background">
                {(() => {
                  const selectedCourse = courses.find(c => c.name === selectedSchedule?.course);
                  const courseSemester = selectedCourse?.semester;
                  const courseProdi = selectedCourse?.prodi;
                  const courseYear = courseSemester ? (new Date().getFullYear() - Math.floor((courseSemester - 1) / 2)) : null;
                  
                  // Get all students and categorize them
                  const allStudents = managedStudents.filter(student => {
                    const query = studentSearchQuery.toLowerCase();
                    const isAlreadyInClass = currentSchedule?.students.some(s => s.nim === student.nim);
                    const matchesSearch = student.name.toLowerCase().includes(query) || student.nim.toLowerCase().includes(query);
                    
                    // Apply dropdown filters
                    const matchesSemester = filterSemester ? student.semester === filterSemester : true;
                    const matchesAngkatan = filterAngkatan ? student.angkatan === filterAngkatan : true;
                    
                    return !isAlreadyInClass && matchesSearch && matchesSemester && matchesAngkatan;
                  });
                  
                  // Sort: recommended students first (same semester AND prodi)
                  const sortedStudents = [...allStudents].sort((a, b) => {
                    const aIsRecommended = (courseSemester ? a.semester === courseSemester : false) && (courseProdi ? a.prodi === courseProdi : false);
                    const bIsRecommended = (courseSemester ? b.semester === courseSemester : false) && (courseProdi ? b.prodi === courseProdi : false);
                    if (aIsRecommended && !bIsRecommended) return -1;
                    if (!aIsRecommended && bIsRecommended) return 1;
                    return 0;
                  });
                  
                  // Group for display
                  const recommendedStudents = sortedStudents.filter(s => 
                    (courseSemester ? s.semester === courseSemester : false) && (courseProdi ? s.prodi === courseProdi : false)
                  );
                  const otherStudents = sortedStudents.filter(s => 
                    !((courseSemester ? s.semester === courseSemester : false) && (courseProdi ? s.prodi === courseProdi : false))
                  );
                  
                  if (sortedStudents.length === 0) {
                    return (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        {studentSearchQuery || filterSemester || filterAngkatan 
                          ? "Tidak ada mahasiswa yang cocok dengan kriteria" 
                          : "Semua mahasiswa sudah terdaftar"}
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      {/* Recommended Section */}
                      {recommendedStudents.length > 0 && (
                        <>
                          <div className="px-3 py-2 bg-success/10 border-b border-success/20 sticky top-0">
                            <p className="text-xs font-medium text-success">✓ Sesuai Rekomendasi (Semester & Prodi cocok)</p>
                          </div>
                          {recommendedStudents.map((student) => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => setSelectedManagedStudentId(student.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
                                selectedManagedStudentId === student.id && "bg-primary/10 border-l-2 border-primary"
                              )}
                            >
                              <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.nim} • {student.prodi} • Sem {student.semester} • {student.angkatan}</p>
                              </div>
                              {selectedManagedStudentId === student.id && (
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </button>
                          ))}
                        </>
                      )}
                      
                      {/* Other Students Section */}
                      {otherStudents.length > 0 && (
                        <>
                          {recommendedStudents.length > 0 && (
                            <div className="px-3 py-2 bg-muted/50 border-b border-border sticky top-0">
                              <p className="text-xs font-medium text-muted-foreground">Mahasiswa Lainnya</p>
                            </div>
                          )}
                          {otherStudents.map((student) => (
                            <button
                              key={student.id}
                              type="button"
                              onClick={() => setSelectedManagedStudentId(student.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
                                selectedManagedStudentId === student.id && "bg-primary/10 border-l-2 border-primary"
                              )}
                            >
                              <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.nim} • {student.prodi} • Sem {student.semester} • {student.angkatan}</p>
                              </div>
                              {selectedManagedStudentId === student.id && (
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </button>
                          ))}
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
              
              {/* Selected Student Preview */}
              {selectedManagedStudentId && (
                <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground">Mahasiswa terpilih:</p>
                  <p className="font-medium text-foreground">
                    {managedStudents.find(s => s.id === selectedManagedStudentId)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    NIM: {managedStudents.find(s => s.id === selectedManagedStudentId)?.nim}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => {
                setAddStudentOpen(false);
                setSelectedManagedStudentId(null);
                setStudentSearchQuery("");
                setFilterSemester(null);
                setFilterAngkatan("");
              }}>
                Batal
              </Button>
              <Button onClick={handleAddStudent} disabled={!selectedManagedStudentId}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah ke Kelas
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Jadwal Kelas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium text-foreground">{selectedSchedule?.className} - {selectedSchedule?.course}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedSchedule?.students.length} mahasiswa terdaftar</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Mata Kuliah</label>
              <select 
                value={editScheduleData.course || selectedSchedule?.course || ""}
                onChange={(e) => setEditScheduleData({...editScheduleData, course: e.target.value})}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Mata Kuliah</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.name}>{course.code} - {course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Dosen Pengampu</label>
              <select 
                value={editScheduleData.lecturer}
                onChange={(e) => setEditScheduleData({...editScheduleData, lecturer: e.target.value})}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Dosen</option>
                {managedLecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.name}>{lecturer.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <label className="text-sm font-medium text-foreground">Ruangan</label>
                <select 
                  value={editScheduleData.room}
                  onChange={(e) => setEditScheduleData({...editScheduleData, room: e.target.value})}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Pilih Ruangan</option>
                  <option value="Lab Kimia A">Lab Kimia A</option>
                  <option value="Lab Kimia B">Lab Kimia B</option>
                  <option value="Lab Instrumen">Lab Instrumen</option>
                  <option value="R. 201">R. 201</option>
                  <option value="R. 202">R. 202</option>
                  <option value="R. 301">R. 301</option>
                  <option value="R. 302">R. 302</option>
                  <option value="Aula">Aula</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Jam (format bebas)</label>
              <input 
                type="text"
                value={editScheduleData.time}
                onChange={(e) => setEditScheduleData({...editScheduleData, time: e.target.value})}
                placeholder="Contoh: 08:00 - 09:40"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
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

  const getEventStyle = (category: "urgent" | "warning" | "success") => {
    return getEventCategoryStyle(category);
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

          {/* Admin: Add Academic Event */}
          {currentRole === "admin" && (
            <Button variant="outline" className="gap-2" onClick={() => setAddEventOpen(true)}>
              <Plus className="h-4 w-4" />
              Tambah Event Akademik
            </Button>
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
            <div key={event.id} className={cn("p-3 rounded-lg border relative group", getEventStyle(event.category))}>
              <p className="font-medium">{formatDateRange(event.startDate, event.endDate)}</p>
              <p className="text-muted-foreground text-xs mt-1">{event.title}</p>
              {currentRole === "admin" && (
                <button 
                  onClick={() => handleDeleteEvent(event)}
                  className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                >
                  <X className="h-3.5 w-3.5 text-destructive" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Academic Event Modal */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Event Akademik</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground">Judul Event <span className="text-destructive">*</span></label>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Contoh: UAS Semester Ganjil"
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Tanggal Mulai <span className="text-destructive">*</span></label>
                <input
                  type="date"
                  value={newEventStartDate}
                  onChange={(e) => setNewEventStartDate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tanggal Selesai <span className="text-destructive">*</span></label>
                <input
                  type="date"
                  value={newEventEndDate}
                  onChange={(e) => setNewEventEndDate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Kategori/Warna</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setNewEventCategory("urgent")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                    newEventCategory === "urgent"
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-background text-muted-foreground hover:border-destructive/50"
                  )}
                >
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  Urgent
                </button>
                <button
                  type="button"
                  onClick={() => setNewEventCategory("warning")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                    newEventCategory === "warning"
                      ? "border-warning bg-warning/10 text-warning"
                      : "border-border bg-background text-muted-foreground hover:border-warning/50"
                  )}
                >
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  Warning
                </button>
                <button
                  type="button"
                  onClick={() => setNewEventCategory("success")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                    newEventCategory === "success"
                      ? "border-success bg-success/10 text-success"
                      : "border-border bg-background text-muted-foreground hover:border-success/50"
                  )}
                >
                  <div className="h-3 w-3 rounded-full bg-success" />
                  Success
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddEventOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddEvent}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation */}
      <AlertDialog open={deleteEventOpen} onOpenChange={setDeleteEventOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Event Akademik</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus event <span className="font-semibold">{eventToDelete?.title}</span>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role-based Content */}
      {currentRole === "admin" ? renderAdminView() : renderPersonalScheduleView()}

      {/* Add Schedule Modal (Admin) - With Locked Selection Logic */}
      <Dialog open={addScheduleOpen} onOpenChange={(open) => {
        setAddScheduleOpen(open);
        if (!open) {
          setNewScheduleData({
            className: "",
            courseCode: "",
            course: "",
            lecturer: "",
            day: "Senin",
            time: "",
            room: "",
          });
          setScheduleStartTime("");
          setScheduleEndTime("");
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Step 1: Pilih Mata Kuliah (Primary Selection) - Using code as unique identifier */}
            <div>
              <label className="text-sm font-medium text-foreground">Mata Kuliah <span className="text-destructive">*</span></label>
              <p className="text-xs text-muted-foreground mb-1.5">Pilih mata kuliah terlebih dahulu untuk mengaktifkan pilihan lainnya</p>
              <select 
                value={newScheduleData.courseCode}
                onChange={(e) => {
                  const selectedCode = e.target.value;
                  const selectedCourse = courses.find(c => c.code === selectedCode);
                  if (!selectedCourse) {
                    setNewScheduleData({
                      ...newScheduleData,
                      courseCode: "",
                      course: "",
                      lecturer: ""
                    });
                    return;
                  }
                  
                  // Auto-select lecturer from the selected course
                  setNewScheduleData({
                    ...newScheduleData, 
                    courseCode: selectedCode,
                    course: selectedCourse.name,
                    lecturer: selectedCourse.lecturer || ""
                  });
                }}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Mata Kuliah</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.code}>{course.code} - {course.name}</option>
                ))}
              </select>
            </div>

            {/* Course Info Display - Shows when course is selected */}
            {newScheduleData.courseCode && (() => {
              const selectedCourse = courses.find(c => c.code === newScheduleData.courseCode);
              return selectedCourse ? (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Semester {selectedCourse.semester || "-"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">
                      {selectedCourse.sks || "-"} SKS
                    </span>
                    <span className="text-muted-foreground">
                      Prodi: {selectedCourse.prodi || "-"}
                    </span>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Step 2: Pilih Dosen - Can override default from course */}
            <div>
              <label className="text-sm font-medium text-foreground">Dosen Pengampu <span className="text-destructive">*</span></label>
              <select 
                value={newScheduleData.lecturer}
                onChange={(e) => setNewScheduleData({...newScheduleData, lecturer: e.target.value})}
                disabled={!newScheduleData.courseCode}
                className={cn(
                  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                  !newScheduleData.courseCode && "opacity-50 cursor-not-allowed bg-muted"
                )}
              >
                <option value="">
                  {!newScheduleData.courseCode ? "Pilih Mata Kuliah terlebih dahulu" : "Pilih Dosen Pengampu"}
                </option>
                {/* Show all managed lecturers */}
                {managedLecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.name}>{lecturer.name}</option>
                ))}
              </select>
              {newScheduleData.courseCode && newScheduleData.lecturer && (
                <p className="text-xs text-muted-foreground mt-1">
                  Dosen: {newScheduleData.lecturer}
                </p>
              )}
            </div>

            {/* Step 3: Pilih Kelas */}
            <div>
              <label className="text-sm font-medium text-foreground">Kelas <span className="text-destructive">*</span></label>
              <select 
                value={newScheduleData.className}
                onChange={(e) => setNewScheduleData({...newScheduleData, className: e.target.value})}
                disabled={!newScheduleData.courseCode}
                className={cn(
                  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                  !newScheduleData.courseCode && "opacity-50 cursor-not-allowed bg-muted"
                )}
              >
                <option value="">
                  {!newScheduleData.courseCode ? "Pilih Mata Kuliah terlebih dahulu" : "Pilih Kelas"}
                </option>
                <option value="D3-AK-1A">D3-AK-1A</option>
                <option value="D3-AK-1B">D3-AK-1B</option>
                <option value="D3-AK-2A">D3-AK-2A</option>
                <option value="D3-AK-2B">D3-AK-2B</option>
                <option value="D3-AK-3A">D3-AK-3A</option>
                <option value="D3-PMIP-1A">D3-PMIP-1A</option>
                <option value="D3-PLI-1A">D3-PLI-1A</option>
                <option value="D4-NP-1A">D4-NP-1A</option>
                <option value="D4-NP-2A">D4-NP-2A</option>
              </select>
            </div>

            {/* Step 4: Hari dan Ruangan */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Hari <span className="text-destructive">*</span></label>
                <select 
                  value={newScheduleData.day}
                  onChange={(e) => setNewScheduleData({...newScheduleData, day: e.target.value})}
                  disabled={!newScheduleData.courseCode}
                  className={cn(
                    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    !newScheduleData.courseCode && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Ruangan <span className="text-destructive">*</span></label>
                <select 
                  value={newScheduleData.room}
                  onChange={(e) => setNewScheduleData({...newScheduleData, room: e.target.value})}
                  disabled={!newScheduleData.courseCode}
                  className={cn(
                    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    !newScheduleData.courseCode && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                >
                  <option value="">Pilih Ruangan</option>
                  <option value="Lab Kimia A">Lab Kimia A</option>
                  <option value="Lab Kimia B">Lab Kimia B</option>
                  <option value="Lab Komputer">Lab Komputer</option>
                  <option value="Lab Instrumen">Lab Instrumen</option>
                  <option value="R. 201">R. 201</option>
                  <option value="R. 202">R. 202</option>
                  <option value="R. 301">R. 301</option>
                  <option value="R. 302">R. 302</option>
                  <option value="Aula">Aula</option>
                </select>
              </div>
            </div>

            {/* Step 5: Jam */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Jam Mulai <span className="text-destructive">*</span></label>
                <input
                  type="time"
                  value={scheduleStartTime}
                  onChange={(e) => setScheduleStartTime(e.target.value)}
                  disabled={!newScheduleData.courseCode}
                  className={cn(
                    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    !newScheduleData.courseCode && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Jam Selesai <span className="text-destructive">*</span></label>
                <input
                  type="time"
                  value={scheduleEndTime}
                  onChange={(e) => setScheduleEndTime(e.target.value)}
                  disabled={!newScheduleData.courseCode}
                  className={cn(
                    "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    !newScheduleData.courseCode && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setAddScheduleOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddSchedule} disabled={!newScheduleData.courseCode}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
