import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Student {
  id: number;
  name: string;
  nim: string;
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

// Initial Data
const initialAcademicEvents: AcademicEvent[] = [
  { id: 1, title: "UAS Semester Ganjil", dateRange: "16 - 27 Des", type: "uas", description: "Ujian Akhir Semester Ganjil 2024/2025" },
  { id: 2, title: "Libur Akhir Tahun", dateRange: "28 Des - 5 Jan", type: "libur", description: "Libur Natal dan Tahun Baru" },
  { id: 3, title: "Mulai Semester Genap", dateRange: "6 Jan 2025", type: "semester", description: "Awal perkuliahan Semester Genap" },
];

const initialSchedules: ClassSchedule[] = [
  { 
    id: 1, 
    className: "D3-AK-2A", 
    course: "Kimia Dasar", 
    lecturer: "Dr. Ahmad Wijaya", 
    day: "Senin", 
    time: "08:00 - 09:40", 
    room: "Lab Kimia A", 
    students: [
      { id: 1, name: "Siti Rahayu", nim: "2024001" },
      { id: 2, name: "Ahmad Fadli", nim: "2024002" },
      { id: 3, name: "Rina Wulandari", nim: "2024005" },
    ],
    color: "bg-primary/10 border-primary/30 text-primary"
  },
  { 
    id: 2, 
    className: "D3-AK-2B", 
    course: "Kimia Dasar", 
    lecturer: "Dr. Ahmad Wijaya", 
    day: "Rabu", 
    time: "08:00 - 09:40", 
    room: "Lab Kimia A", 
    students: [
      { id: 4, name: "Budi Santoso", nim: "2024010" },
      { id: 5, name: "Dewi Lestari", nim: "2024011" },
    ],
    color: "bg-success/10 border-success/30 text-success"
  },
  { 
    id: 3, 
    className: "D3-AK-2A", 
    course: "Kimia Organik", 
    lecturer: "Prof. Sari Dewi", 
    day: "Selasa", 
    time: "08:00 - 09:40", 
    room: "Lab Kimia B", 
    students: [
      { id: 1, name: "Siti Rahayu", nim: "2024001" },
      { id: 2, name: "Ahmad Fadli", nim: "2024002" },
      { id: 3, name: "Rina Wulandari", nim: "2024005" },
    ],
    color: "bg-warning/10 border-warning/30 text-warning"
  },
  { 
    id: 4, 
    className: "D3-AK-3A", 
    course: "Biokimia", 
    lecturer: "Pak Budi Santoso", 
    day: "Selasa", 
    time: "13:00 - 14:40", 
    room: "R. 302", 
    students: [
      { id: 6, name: "Eko Prasetyo", nim: "2023008" },
    ],
    color: "bg-accent border-accent text-accent-foreground"
  },
  { 
    id: 5, 
    className: "D4-AK-4A", 
    course: "Analisis Instrumen", 
    lecturer: "Prof. Sari Dewi", 
    day: "Kamis", 
    time: "13:00 - 15:30", 
    room: "Lab Instrumen", 
    students: [],
    color: "bg-destructive/10 border-destructive/30 text-destructive"
  },
  { 
    id: 6, 
    className: "D3-TI-2A", 
    course: "Pemrograman Dasar", 
    lecturer: "Pak Eko Prasetyo", 
    day: "Senin", 
    time: "10:00 - 11:40", 
    room: "Lab Komputer", 
    students: [],
    color: "bg-primary/10 border-primary/30 text-primary"
  },
  { 
    id: 7, 
    className: "D3-TI-2A", 
    course: "Basis Data", 
    lecturer: "Dr. Rina Wulandari", 
    day: "Rabu", 
    time: "13:00 - 14:40", 
    room: "Lab Komputer", 
    students: [],
    color: "bg-success/10 border-success/30 text-success"
  },
  { 
    id: 8, 
    className: "D3-AK-2A", 
    course: "Matematika Terapan", 
    lecturer: "Prof. Sari Dewi", 
    day: "Senin", 
    time: "10:00 - 11:40", 
    room: "R. 201", 
    students: [
      { id: 1, name: "Siti Rahayu", nim: "2024001" },
      { id: 2, name: "Ahmad Fadli", nim: "2024002" },
    ],
    color: "bg-success/10 border-success/30 text-success"
  },
];

interface AcademicDataContextType {
  academicEvents: AcademicEvent[];
  setAcademicEvents: React.Dispatch<React.SetStateAction<AcademicEvent[]>>;
  schedules: ClassSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
  addStudentToClass: (scheduleId: number, student: Student) => void;
  removeStudentFromClass: (scheduleId: number, studentId: number) => void;
  updateStudentInClass: (scheduleId: number, student: Student) => void;
  updateSchedule: (scheduleId: number, updates: Partial<ClassSchedule>) => void;
  getStudentSchedules: (studentNim: string) => ClassSchedule[];
  getLecturerSchedules: (lecturerName: string) => ClassSchedule[];
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

export function AcademicDataProvider({ children }: { children: ReactNode }) {
  const [academicEvents, setAcademicEvents] = useState<AcademicEvent[]>(initialAcademicEvents);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(initialSchedules);

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

  return (
    <AcademicDataContext.Provider value={{
      academicEvents,
      setAcademicEvents,
      schedules,
      setSchedules,
      addStudentToClass,
      removeStudentFromClass,
      updateStudentInClass,
      updateSchedule,
      getStudentSchedules,
      getLecturerSchedules,
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
