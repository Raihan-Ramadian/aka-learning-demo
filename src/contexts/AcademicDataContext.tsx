import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Student {
  id: number;
  name: string;
  nim: string;
}

// User types for Admin management
export interface ManagedStudent {
  id: number;
  name: string;
  nim: string;
  prodi: string;
  email: string;
  status: "Aktif" | "Cuti" | "Alumni";
  phone: string;
  address: string;
  angkatan: string;
}

export interface ManagedLecturer {
  id: number;
  name: string;
  nip: string;
  prodi: string;
  email: string;
  status: "Aktif" | "Cuti";
  phone: string;
  address: string;
  jabatan: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  lecturer: string;
  color: string;
  classes?: number;
}

export interface Material {
  id: number;
  weekId: number;
  courseId: number;
  name: string;
  type: "pdf" | "video";
  size?: string;
  duration?: string;
}

export interface MaterialWeek {
  id: number;
  courseId: number;
  week: string;
  title: string;
  materials: Material[];
}

export interface ClassSchedule {
  id: number;
  className: string;
  course: string;
  lecturer: string;
  day: string;
  time: string;
  room: string;
  students: Student[];
  color?: string;
}

export interface AcademicEvent {
  id: number;
  title: string;
  dateRange: string;
  type: "uas" | "libur" | "semester";
  description: string;
}

export interface TaskSubmission {
  id: number;
  taskId: number;
  courseId: number;
  studentNim: string;
  studentName: string;
  status: "pending" | "submitted" | "graded";
  fileName: string | null;
  grade: number | null;
  lecturerNote: string | null;
  submittedAt: string | null;
}

export interface Task {
  id: number;
  courseId: number;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  hasAttachment: boolean;
  attachmentName?: string;
  attachmentType?: string;
  externalLink?: string;
  additionalNotes?: string;
  taskType: "regular" | "praktikum"; // New field for task type
}

// Practicum grade structure with 6 criteria
export interface PracticumGrade {
  id: number;
  submissionId: number;
  laporanAwal: number | null; // Laporan Awal
  apd: number | null; // APD
  k3: number | null; // K3
  skill: number | null; // Skill
  kuis: number | null; // Kuis
  laporanAkhir: number | null; // Laporan Akhir
  average: number | null; // Auto-calculated average
}

// Initial Data - Managed Users
const initialManagedStudents: ManagedStudent[] = [
  { id: 1, name: "Siti Rahayu", nim: "2024001", prodi: "D3 Analisis Kimia", email: "siti@mhs.aka.ac.id", status: "Aktif", phone: "081234567890", address: "Jl. Merdeka No. 10, Bogor", angkatan: "2024" },
  { id: 2, name: "Ahmad Fadli", nim: "2024002", prodi: "D3 Analisis Kimia", email: "ahmad@mhs.aka.ac.id", status: "Aktif", phone: "081234567891", address: "Jl. Sudirman No. 5, Bogor", angkatan: "2024" },
  { id: 3, name: "Dewi Lestari", nim: "2024003", prodi: "D3 Teknik Informatika", email: "dewi@mhs.aka.ac.id", status: "Aktif", phone: "081234567892", address: "Jl. Ahmad Yani No. 15, Bogor", angkatan: "2024" },
  { id: 4, name: "Budi Santoso", nim: "2023015", prodi: "D4 Analisis Kimia", email: "budi@mhs.aka.ac.id", status: "Cuti", phone: "081234567893", address: "Jl. Pahlawan No. 20, Bogor", angkatan: "2023" },
  { id: 5, name: "Rina Wulandari", nim: "2024005", prodi: "D3 Analisis Kimia", email: "rina@mhs.aka.ac.id", status: "Aktif", phone: "081234567894", address: "Jl. Diponegoro No. 8, Bogor", angkatan: "2024" },
  { id: 6, name: "Eko Prasetyo", nim: "2023008", prodi: "D3 Teknik Informatika", email: "eko@mhs.aka.ac.id", status: "Aktif", phone: "081234567895", address: "Jl. Gatot Subroto No. 12, Bogor", angkatan: "2023" },
];

const initialManagedLecturers: ManagedLecturer[] = [
  { id: 1, name: "Dr. Ahmad Wijaya", nip: "198501012010011001", prodi: "D3 Analisis Kimia", email: "ahmad@dosen.aka.ac.id", status: "Aktif", phone: "081234567801", address: "Jl. Profesor No. 1, Bogor", jabatan: "Lektor Kepala" },
  { id: 2, name: "Prof. Sari Dewi", nip: "197805152005012001", prodi: "D3 Analisis Kimia", email: "sari@dosen.aka.ac.id", status: "Aktif", phone: "081234567802", address: "Jl. Akademik No. 5, Bogor", jabatan: "Guru Besar" },
  { id: 3, name: "Pak Budi Santoso", nip: "198203202008011003", prodi: "D3 Teknik Informatika", email: "budi@dosen.aka.ac.id", status: "Aktif", phone: "081234567803", address: "Jl. Pendidikan No. 10, Bogor", jabatan: "Lektor" },
  { id: 4, name: "Dr. Maya Putri", nip: "198906302015012001", prodi: "D4 Analisis Kimia", email: "maya@dosen.aka.ac.id", status: "Cuti", phone: "081234567804", address: "Jl. Ilmu No. 3, Bogor", jabatan: "Asisten Ahli" },
];

const initialCourses: Course[] = [
  { id: 1, name: "Kimia Dasar", code: "KIM101", lecturer: "Dr. Ahmad Wijaya", color: "from-blue-500 to-cyan-500", classes: 2 },
  { id: 2, name: "Biokimia", code: "BIO201", lecturer: "Prof. Sari Dewi", color: "from-emerald-500 to-teal-500", classes: 2 },
  { id: 3, name: "Kimia Analitik", code: "KIM202", lecturer: "Dr. Rudi Hartono", color: "from-violet-500 to-purple-500", classes: 1 },
  { id: 4, name: "Kimia Organik", code: "KIM301", lecturer: "Dr. Maya Putri", color: "from-orange-500 to-amber-500", classes: 3 },
  { id: 5, name: "Praktikum Kimia", code: "KIM102", lecturer: "Dr. Ahmad Wijaya", color: "from-violet-500 to-purple-500", classes: 4 },
];

const initialMaterialWeeks: MaterialWeek[] = [
  {
    id: 1, courseId: 1, week: "Pertemuan 1", title: "Pengenalan Kimia Dasar",
    materials: [
      { id: 1, weekId: 1, courseId: 1, name: "Slide Pengantar Kimia.pdf", type: "pdf", size: "2.4 MB" },
      { id: 2, weekId: 1, courseId: 1, name: "Video Penjelasan Atom.mp4", type: "video", duration: "15:30" },
    ],
  },
  {
    id: 2, courseId: 1, week: "Pertemuan 2", title: "Struktur Atom dan Tabel Periodik",
    materials: [
      { id: 3, weekId: 2, courseId: 1, name: "Modul Struktur Atom.pdf", type: "pdf", size: "3.1 MB" },
      { id: 4, weekId: 2, courseId: 1, name: "Latihan Soal Bab 2.pdf", type: "pdf", size: "1.2 MB" },
      { id: 5, weekId: 2, courseId: 1, name: "Tutorial Tabel Periodik.mp4", type: "video", duration: "22:45" },
    ],
  },
  {
    id: 3, courseId: 1, week: "Pertemuan 3", title: "Ikatan Kimia",
    materials: [
      { id: 6, weekId: 3, courseId: 1, name: "Slide Ikatan Kimia.pdf", type: "pdf", size: "4.0 MB" },
    ],
  },
];

const initialAcademicEvents: AcademicEvent[] = [
  { id: 1, title: "UAS Semester Ganjil", dateRange: "16 - 27 Des", type: "uas", description: "Ujian Akhir Semester Ganjil 2024/2025" },
  { id: 2, title: "Libur Akhir Tahun", dateRange: "28 Des - 5 Jan", type: "libur", description: "Libur Natal dan Tahun Baru" },
  { id: 3, title: "Mulai Semester Genap", dateRange: "6 Jan 2025", type: "semester", description: "Awal perkuliahan Semester Genap" },
];

const initialSchedules: ClassSchedule[] = [
  { 
    id: 1, className: "D3-AK-2A", course: "Kimia Dasar", lecturer: "Dr. Ahmad Wijaya", 
    day: "Senin", time: "08:00 - 09:40", room: "Lab Kimia A", 
    students: [
      { id: 1, name: "Siti Rahayu", nim: "2024001" },
      { id: 2, name: "Ahmad Fadli", nim: "2024002" },
      { id: 3, name: "Rina Wulandari", nim: "2024005" },
    ],
    color: "bg-primary/10 border-primary/30 text-primary"
  },
  { 
    id: 2, className: "D3-AK-2B", course: "Kimia Dasar", lecturer: "Dr. Ahmad Wijaya", 
    day: "Rabu", time: "08:00 - 09:40", room: "Lab Kimia A", 
    students: [
      { id: 4, name: "Budi Santoso", nim: "2024010" },
      { id: 5, name: "Dewi Lestari", nim: "2024011" },
    ],
    color: "bg-success/10 border-success/30 text-success"
  },
  { 
    id: 3, className: "D3-AK-2A", course: "Kimia Organik", lecturer: "Prof. Sari Dewi", 
    day: "Selasa", time: "08:00 - 09:40", room: "Lab Kimia B", 
    students: [
      { id: 1, name: "Siti Rahayu", nim: "2024001" },
      { id: 2, name: "Ahmad Fadli", nim: "2024002" },
      { id: 3, name: "Rina Wulandari", nim: "2024005" },
    ],
    color: "bg-warning/10 border-warning/30 text-warning"
  },
  { 
    id: 4, className: "D3-AK-3A", course: "Biokimia", lecturer: "Pak Budi Santoso", 
    day: "Selasa", time: "13:00 - 14:40", room: "R. 302", 
    students: [{ id: 6, name: "Eko Prasetyo", nim: "2023008" }],
    color: "bg-accent border-accent text-accent-foreground"
  },
  { 
    id: 5, className: "D4-AK-4A", course: "Analisis Instrumen", lecturer: "Prof. Sari Dewi", 
    day: "Kamis", time: "13:00 - 15:30", room: "Lab Instrumen", 
    students: [],
    color: "bg-destructive/10 border-destructive/30 text-destructive"
  },
  { 
    id: 6, className: "D3-TI-2A", course: "Pemrograman Dasar", lecturer: "Pak Eko Prasetyo", 
    day: "Senin", time: "10:00 - 11:40", room: "Lab Komputer", 
    students: [],
    color: "bg-primary/10 border-primary/30 text-primary"
  },
  { 
    id: 7, className: "D3-TI-2A", course: "Basis Data", lecturer: "Dr. Rina Wulandari", 
    day: "Rabu", time: "13:00 - 14:40", room: "Lab Komputer", 
    students: [],
    color: "bg-success/10 border-success/30 text-success"
  },
  { 
    id: 8, className: "D3-AK-2A", course: "Matematika Terapan", lecturer: "Prof. Sari Dewi", 
    day: "Senin", time: "10:00 - 11:40", room: "R. 201", 
    students: [
      { id: 1, name: "Siti Rahayu", nim: "2024001" },
      { id: 2, name: "Ahmad Fadli", nim: "2024002" },
    ],
    color: "bg-success/10 border-success/30 text-success"
  },
];

const initialTasks: Task[] = [
  { id: 1, courseId: 1, title: "Laporan Praktikum 1", description: "Buat laporan praktikum tentang reaksi kimia dasar", deadline: "20 Desember 2024", maxScore: 100, hasAttachment: true, attachmentName: "Instruksi_Laporan_Praktikum.pdf", attachmentType: "file", additionalNotes: "Pastikan menggunakan format laporan standar. Sertakan grafik hasil pengamatan dan analisis data. Deadline tidak bisa diperpanjang.", taskType: "praktikum" },
  { id: 2, courseId: 1, title: "Quiz Bab 1-2", description: "Quiz online tentang struktur atom dan tabel periodik", deadline: "22 Desember 2024", maxScore: 50, hasAttachment: false, externalLink: "https://forms.google.com/quiz123", additionalNotes: "Quiz bersifat open book. Waktu pengerjaan 30 menit setelah link dibuka.", taskType: "regular" },
  { id: 3, courseId: 1, title: "Tugas Kelompok: Presentasi", description: "Presentasi tentang aplikasi kimia dalam kehidupan sehari-hari", deadline: "5 Januari 2025", maxScore: 100, hasAttachment: true, attachmentName: "Template_Presentasi.pptx", attachmentType: "file", taskType: "regular" },
  { id: 4, courseId: 2, title: "Laporan Biokimia", description: "Laporan tentang metabolisme karbohidrat", deadline: "23 Desember 2024", maxScore: 100, hasAttachment: true, attachmentName: "Template_Laporan.docx", attachmentType: "file", additionalNotes: "Gunakan referensi jurnal internasional minimal 3 sumber.", taskType: "regular" },
  { id: 5, courseId: 3, title: "Tugas Kelompok Analitik", description: "Analisis sampel air dengan metode titrasi", deadline: "28 Desember 2024", maxScore: 100, hasAttachment: false, taskType: "regular" },
  { id: 6, courseId: 5, title: "Praktikum Kimia Dasar", description: "Praktikum reaksi asam-basa dengan indikator", deadline: "30 Desember 2024", maxScore: 100, hasAttachment: true, attachmentName: "Modul_Praktikum.pdf", attachmentType: "file", additionalNotes: "Wajib hadir tepat waktu. Bawa perlengkapan K3 lengkap.", taskType: "praktikum" },
];

const initialSubmissions: TaskSubmission[] = [
  { id: 1, taskId: 1, courseId: 1, studentNim: "2024001", studentName: "Siti Rahayu", status: "submitted", fileName: "laporan_siti.pdf", grade: null, lecturerNote: null, submittedAt: "18 Desember 2024" },
  { id: 2, taskId: 1, courseId: 1, studentNim: "2024002", studentName: "Ahmad Fadli", status: "graded", fileName: "laporan_ahmad.pdf", grade: 85, lecturerNote: "Bagus, tapi perlu diperbaiki di bagian kesimpulan.", submittedAt: "17 Desember 2024" },
  { id: 3, taskId: 1, courseId: 1, studentNim: "2024003", studentName: "Dewi Lestari", status: "pending", fileName: null, grade: null, lecturerNote: null, submittedAt: null },
  { id: 4, taskId: 1, courseId: 1, studentNim: "2024005", studentName: "Rina Wulandari", status: "graded", fileName: "laporan_rina.pdf", grade: 92, lecturerNote: "Sangat baik! Analisis yang mendalam.", submittedAt: "16 Desember 2024" },
  { id: 5, taskId: 1, courseId: 1, studentNim: "2023008", studentName: "Eko Prasetyo", status: "pending", fileName: null, grade: null, lecturerNote: null, submittedAt: null },
  { id: 6, taskId: 1, courseId: 1, studentNim: "2024007", studentName: "Maya Putri", status: "submitted", fileName: "laporan_maya.pdf", grade: null, lecturerNote: null, submittedAt: "18 Desember 2024" },
  { id: 7, taskId: 2, courseId: 1, studentNim: "2024001", studentName: "Siti Rahayu", status: "graded", fileName: null, grade: 45, lecturerNote: "Jawaban quiz sudah benar sebagian besar.", submittedAt: "19 Desember 2024" },
  { id: 8, taskId: 3, courseId: 1, studentNim: "2024001", studentName: "Siti Rahayu", status: "pending", fileName: null, grade: null, lecturerNote: null, submittedAt: null },
];

// Practicum grades storage
const initialPracticumGrades: PracticumGrade[] = [
  { id: 1, submissionId: 1, laporanAwal: 85, apd: 90, k3: 88, skill: 85, kuis: 80, laporanAkhir: 87, average: 85.8 },
  { id: 2, submissionId: 2, laporanAwal: 90, apd: 85, k3: 92, skill: 88, kuis: 85, laporanAkhir: 90, average: 88.3 },
];

interface AcademicDataContextType {
  // User management
  managedStudents: ManagedStudent[];
  managedLecturers: ManagedLecturer[];
  addManagedStudent: (student: Omit<ManagedStudent, 'id'>) => void;
  updateManagedStudent: (id: number, updates: Partial<ManagedStudent>) => void;
  deleteManagedStudent: (id: number) => void;
  addManagedLecturer: (lecturer: Omit<ManagedLecturer, 'id'>) => void;
  updateManagedLecturer: (id: number, updates: Partial<ManagedLecturer>) => void;
  deleteManagedLecturer: (id: number) => void;
  importStudentsFromCSV: (students: Omit<ManagedStudent, 'id'>[]) => void;
  importLecturersFromCSV: (lecturers: Omit<ManagedLecturer, 'id'>[]) => void;
  
  // Existing
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  materialWeeks: MaterialWeek[];
  setMaterialWeeks: React.Dispatch<React.SetStateAction<MaterialWeek[]>>;
  academicEvents: AcademicEvent[];
  setAcademicEvents: React.Dispatch<React.SetStateAction<AcademicEvent[]>>;
  schedules: ClassSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  submissions: TaskSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<TaskSubmission[]>>;
  practicumGrades: PracticumGrade[];
  setPracticumGrades: React.Dispatch<React.SetStateAction<PracticumGrade[]>>;
  addStudentToClass: (scheduleId: number, student: Student) => void;
  removeStudentFromClass: (scheduleId: number, studentId: number) => void;
  updateStudentInClass: (scheduleId: number, student: Student) => void;
  updateSchedule: (scheduleId: number, updates: Partial<ClassSchedule>) => void;
  getStudentSchedules: (studentNim: string) => ClassSchedule[];
  getLecturerSchedules: (lecturerName: string) => ClassSchedule[];
  getStudentSubmission: (taskId: number, studentNim: string) => TaskSubmission | undefined;
  updateSubmissionGrade: (submissionId: number, grade: number | null, lecturerNote: string | null) => void;
  updatePracticumGrade: (submissionId: number, grades: Omit<PracticumGrade, 'id' | 'submissionId' | 'average'>) => void;
  getPracticumGrade: (submissionId: number) => PracticumGrade | undefined;
  getTasksByCourse: (courseId: number) => Task[];
  getSubmissionsByTask: (taskId: number) => TaskSubmission[];
  getMaterialsByCourse: (courseId: number) => MaterialWeek[];
  deleteTask: (taskId: number) => void;
  deleteMaterial: (materialId: number) => void;
  deleteSchedule: (scheduleId: number) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  addMaterial: (weekId: number, courseId: number, material: Omit<Material, 'id' | 'weekId' | 'courseId'>) => void;
  addMaterialWeek: (courseId: number, week: string, title: string) => number;
  addSchedule: (schedule: Omit<ClassSchedule, 'id'>) => void;
  submitAssignment: (taskId: number, courseId: number, studentNim: string, studentName: string, fileName: string) => void;
  addAcademicEvent: (event: Omit<AcademicEvent, 'id'>) => void;
  deleteAcademicEvent: (id: number) => void;
  importAcademicEventsFromCSV: (events: Omit<AcademicEvent, 'id'>[]) => void;
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

export function AcademicDataProvider({ children }: { children: ReactNode }) {
  // User management state
  const [managedStudents, setManagedStudents] = useState<ManagedStudent[]>(initialManagedStudents);
  const [managedLecturers, setManagedLecturers] = useState<ManagedLecturer[]>(initialManagedLecturers);
  
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [materialWeeks, setMaterialWeeks] = useState<MaterialWeek[]>(initialMaterialWeeks);
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(initialAcademicEvents);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(initialSchedules);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(initialSubmissions);
  const [practicumGrades, setPracticumGrades] = useState<PracticumGrade[]>(initialPracticumGrades);

  // User management functions
  const addManagedStudent = (student: Omit<ManagedStudent, 'id'>) => {
    const newStudent: ManagedStudent = { ...student, id: Date.now() };
    setManagedStudents(prev => [...prev, newStudent]);
  };

  const updateManagedStudent = (id: number, updates: Partial<ManagedStudent>) => {
    setManagedStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteManagedStudent = (id: number) => {
    setManagedStudents(prev => prev.filter(s => s.id !== id));
  };

  const addManagedLecturer = (lecturer: Omit<ManagedLecturer, 'id'>) => {
    const newLecturer: ManagedLecturer = { ...lecturer, id: Date.now() };
    setManagedLecturers(prev => [...prev, newLecturer]);
  };

  const updateManagedLecturer = (id: number, updates: Partial<ManagedLecturer>) => {
    setManagedLecturers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteManagedLecturer = (id: number) => {
    setManagedLecturers(prev => prev.filter(l => l.id !== id));
  };

  const importStudentsFromCSV = (students: Omit<ManagedStudent, 'id'>[]) => {
    const newStudents = students.map((s, i) => ({ ...s, id: Date.now() + i }));
    setManagedStudents(prev => [...prev, ...newStudents]);
  };

  const importLecturersFromCSV = (lecturers: Omit<ManagedLecturer, 'id'>[]) => {
    const newLecturers = lecturers.map((l, i) => ({ ...l, id: Date.now() + i }));
    setManagedLecturers(prev => [...prev, ...newLecturers]);
  };

  const addStudentToClass = (scheduleId: number, student: Student) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId 
        ? { ...s, students: [...s.students, student] }
        : s
    ));
  };

  const removeStudentFromClass = (scheduleId: number, studentId: number) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId 
        ? { ...s, students: s.students.filter(st => st.id !== studentId) }
        : s
    ));
  };

  const updateStudentInClass = (scheduleId: number, student: Student) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId 
        ? { ...s, students: s.students.map(st => st.id === student.id ? student : st) }
        : s
    ));
  };

  const updateSchedule = (scheduleId: number, updates: Partial<ClassSchedule>) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, ...updates } : s
    ));
  };

  const getStudentSchedules = (studentNim: string): ClassSchedule[] => {
    return schedules.filter(s => s.students.some(st => st.nim === studentNim));
  };

  const getLecturerSchedules = (lecturerName: string): ClassSchedule[] => {
    return schedules.filter(s => s.lecturer.toLowerCase().includes(lecturerName.toLowerCase()));
  };

  const getStudentSubmission = (taskId: number, studentNim: string): TaskSubmission | undefined => {
    return submissions.find(s => s.taskId === taskId && s.studentNim === studentNim);
  };

  const updateSubmissionGrade = (submissionId: number, grade: number | null, lecturerNote: string | null) => {
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? { ...s, grade, lecturerNote, status: grade !== null ? "graded" as const : s.status }
        : s
    ));
  };

  const getTasksByCourse = (courseId: number): Task[] => {
    return tasks.filter(t => t.courseId === courseId);
  };

  const getSubmissionsByTask = (taskId: number): TaskSubmission[] => {
    return submissions.filter(s => s.taskId === taskId);
  };

  const getMaterialsByCourse = (courseId: number): MaterialWeek[] => {
    return materialWeeks.filter(w => w.courseId === courseId);
  };

  const deleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSubmissions(prev => prev.filter(s => s.taskId !== taskId));
  };

  const deleteMaterial = (materialId: number) => {
    setMaterialWeeks(prev => prev.map(week => ({
      ...week,
      materials: week.materials.filter(m => m.id !== materialId)
    })));
  };

  const deleteSchedule = (scheduleId: number) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const addMaterial = (weekId: number, courseId: number, material: Omit<Material, 'id' | 'weekId' | 'courseId'>) => {
    const newMaterial: Material = {
      ...material,
      id: Date.now(),
      weekId,
      courseId,
    };
    setMaterialWeeks(prev => prev.map(week => 
      week.id === weekId 
        ? { ...week, materials: [...week.materials, newMaterial] }
        : week
    ));
  };

  const addMaterialWeek = (courseId: number, week: string, title: string): number => {
    const newWeekId = Date.now();
    const newWeek: MaterialWeek = {
      id: newWeekId,
      courseId,
      week,
      title,
      materials: [],
    };
    setMaterialWeeks(prev => [...prev, newWeek]);
    return newWeekId;
  };

  const addSchedule = (schedule: Omit<ClassSchedule, 'id'>) => {
    const newSchedule: ClassSchedule = {
      ...schedule,
      id: Date.now(),
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const submitAssignment = (taskId: number, courseId: number, studentNim: string, studentName: string, fileName: string) => {
    const existingSubmission = submissions.find(s => s.taskId === taskId && s.studentNim === studentNim);
    if (existingSubmission) {
      setSubmissions(prev => prev.map(s => 
        s.taskId === taskId && s.studentNim === studentNim
          ? { ...s, status: "submitted" as const, fileName, submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
          : s
      ));
    } else {
      const newSubmission: TaskSubmission = {
        id: Date.now(),
        taskId,
        courseId,
        studentNim,
        studentName,
        status: "submitted",
        fileName,
        grade: null,
        lecturerNote: null,
        submittedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      };
      setSubmissions(prev => [...prev, newSubmission]);
    }
  };

  // Practicum grade functions
  const updatePracticumGrade = (submissionId: number, grades: Omit<PracticumGrade, 'id' | 'submissionId' | 'average'>) => {
    const { laporanAwal, apd, k3, skill, kuis, laporanAkhir } = grades;
    const validGrades = [laporanAwal, apd, k3, skill, kuis, laporanAkhir].filter(g => g !== null) as number[];
    const average = validGrades.length > 0 ? Math.round((validGrades.reduce((a, b) => a + b, 0) / validGrades.length) * 10) / 10 : null;
    
    const existingGrade = practicumGrades.find(pg => pg.submissionId === submissionId);
    if (existingGrade) {
      setPracticumGrades(prev => prev.map(pg => 
        pg.submissionId === submissionId 
          ? { ...pg, ...grades, average }
          : pg
      ));
    } else {
      setPracticumGrades(prev => [...prev, {
        id: Date.now(),
        submissionId,
        ...grades,
        average
      }]);
    }
    
    // Also update the submission's overall grade with the average
    if (average !== null) {
      updateSubmissionGrade(submissionId, Math.round(average), null);
    }
  };

  const getPracticumGrade = (submissionId: number): PracticumGrade | undefined => {
    return practicumGrades.find(pg => pg.submissionId === submissionId);
  };

  // Academic event functions
  const addAcademicEvent = (event: Omit<AcademicEvent, 'id'>) => {
    const newEvent: AcademicEvent = { ...event, id: Date.now() };
    setAcademicEvents(prev => [...prev, newEvent]);
  };

  const deleteAcademicEvent = (id: number) => {
    setAcademicEvents(prev => prev.filter(e => e.id !== id));
  };

  const importAcademicEventsFromCSV = (events: Omit<AcademicEvent, 'id'>[]) => {
    const newEvents = events.map((e, i) => ({ ...e, id: Date.now() + i }));
    setAcademicEvents(prev => [...prev, ...newEvents]);
  };

  return (
    <AcademicDataContext.Provider value={{
      // User management
      managedStudents,
      managedLecturers,
      addManagedStudent,
      updateManagedStudent,
      deleteManagedStudent,
      addManagedLecturer,
      updateManagedLecturer,
      deleteManagedLecturer,
      importStudentsFromCSV,
      importLecturersFromCSV,
      
      // Existing
      courses,
      setCourses,
      materialWeeks,
      setMaterialWeeks,
      academicEvents,
      setAcademicEvents,
      schedules,
      setSchedules,
      tasks,
      setTasks,
      submissions,
      setSubmissions,
      practicumGrades,
      setPracticumGrades,
      addStudentToClass,
      removeStudentFromClass,
      updateStudentInClass,
      updateSchedule,
      getStudentSchedules,
      getLecturerSchedules,
      getStudentSubmission,
      updateSubmissionGrade,
      updatePracticumGrade,
      getPracticumGrade,
      getTasksByCourse,
      getSubmissionsByTask,
      getMaterialsByCourse,
      deleteTask,
      deleteMaterial,
      deleteSchedule,
      addTask,
      addMaterial,
      addMaterialWeek,
      addSchedule,
      submitAssignment,
      addAcademicEvent,
      deleteAcademicEvent,
      importAcademicEventsFromCSV,
    }}>
      {children}
    </AcademicDataContext.Provider>
  );
}

export function useAcademicData() {
  const context = useContext(AcademicDataContext);
  if (!context) {
    throw new Error("useAcademicData must be used within an AcademicDataProvider");
  }
  return context;
}
