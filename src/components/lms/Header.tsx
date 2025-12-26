import { useState, useEffect } from "react";
import { Bell, Search, User, LogOut, X, BookOpen, FileText, Calendar, Users, Video, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useAcademicData } from "@/contexts/AcademicDataContext";
import { getUserRole } from "@/types/roles";
import { cn } from "@/lib/utils";

// Interface for search result materials
interface SearchMaterial {
  id: number;
  name: string;
  type: string;
  courseId: number;
  courseName: string;
  weekTitle: string;
}

// Interface for search result tasks
interface SearchTask {
  id: number;
  title: string;
  deadline: string;
  courseId: number;
  courseName: string;
}

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courses, schedules, managedStudents, managedLecturers, tasks, materialWeeks } = useAcademicData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const currentRole = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userNimNip");
    navigate("/");
  };

  // Get current user identifiers for filtering
  const studentNim = localStorage.getItem("userNimNip") || "";
  const lecturerName = localStorage.getItem("userName") || "";
  
  // Get filtered schedules for current user
  const getUserSchedules = () => {
    if (currentRole === "admin") {
      return schedules;
    } else if (currentRole === "student") {
      return schedules.filter(schedule => 
        schedule.students.some(student => student.nim === studentNim)
      );
    } else if (currentRole === "lecturer") {
      return schedules.filter(schedule => 
        schedule.lecturer === lecturerName
      );
    }
    return [];
  };
  
  const userSchedules = getUserSchedules();
  
  // Get course IDs from user's schedules for filtering courses and tasks
  const userCourseNames = userSchedules.map(s => s.course);
  
  // Get user's course IDs for materials and tasks
  const getUserCourseIds = (): number[] => {
    const courseIds: number[] = [];
    userCourseNames.forEach(courseName => {
      const course = courses.find(c => c.name === courseName);
      if (course) courseIds.push(course.id);
    });
    return courseIds;
  };
  
  const userCourseIds = getUserCourseIds();

  // Global search across all data - results vary by role
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { courses: [], schedules: [], students: [], lecturers: [], tasks: [], materials: [] };
    
    const query = searchQuery.toLowerCase();
    
    // Filter courses based on role
    const filteredCourses = currentRole === "admin" 
      ? courses 
      : courses.filter(c => userCourseNames.includes(c.name));
    
    // Filter tasks based on role - ADMIN TIDAK BOLEH MELIHAT TUGAS
    let filteredTasks: SearchTask[] = [];
    if (currentRole !== "admin") {
      filteredTasks = tasks
        .filter(t => userCourseIds.includes(t.courseId))
        .map(t => {
          const course = courses.find(c => c.id === t.courseId);
          return {
            id: t.id,
            title: t.title,
            deadline: t.deadline,
            courseId: t.courseId,
            courseName: course?.name || "Unknown"
          };
        });
    }
    
    // Filter materials based on role - only for Student and Lecturer
    let filteredMaterials: SearchMaterial[] = [];
    if (currentRole !== "admin") {
      materialWeeks
        .filter(w => userCourseIds.includes(w.courseId))
        .forEach(week => {
          const course = courses.find(c => c.id === week.courseId);
          week.materials.forEach(material => {
            filteredMaterials.push({
              id: material.id,
              name: material.name,
              type: material.type,
              courseId: week.courseId,
              courseName: course?.name || "Unknown",
              weekTitle: week.title
            });
          });
        });
    }
    
    return {
      courses: filteredCourses.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.code.toLowerCase().includes(query) ||
        c.lecturer.toLowerCase().includes(query)
      ).slice(0, 3),
      schedules: userSchedules.filter(s => 
        s.course.toLowerCase().includes(query) || 
        s.className.toLowerCase().includes(query) ||
        s.lecturer.toLowerCase().includes(query) ||
        s.room.toLowerCase().includes(query)
      ).slice(0, 3),
      students: currentRole === "admin" ? managedStudents.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.nim.toLowerCase().includes(query) ||
        s.prodi.toLowerCase().includes(query)
      ).slice(0, 3) : [],
      lecturers: currentRole === "admin" ? managedLecturers.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.nip.toLowerCase().includes(query) ||
        l.prodi.toLowerCase().includes(query)
      ).slice(0, 3) : [],
      tasks: filteredTasks.filter(t => 
        t.title.toLowerCase().includes(query)
      ).slice(0, 3),
      materials: filteredMaterials.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.weekTitle.toLowerCase().includes(query)
      ).slice(0, 3),
    };
  };

  const results = getSearchResults();
  const hasResults = Object.values(results).some(arr => arr.length > 0);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    if (showResults) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showResults]);

  // Close on route change
  useEffect(() => {
    setShowResults(false);
    setSearchQuery("");
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Cari matkul, jadwal, mahasiswa..."
            className="h-10 w-80 rounded-lg border border-input bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); setShowResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Search Results Dropdown */}
          {showResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-popover shadow-lg max-h-96 overflow-y-auto z-50">
              {!hasResults ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada hasil untuk "{searchQuery}"
                </div>
              ) : (
                <div className="py-2">
                  {/* Courses - Role-based navigation */}
                  {results.courses.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Mata Kuliah</p>
                      {results.courses.map(course => (
                        <button
                          key={course.id}
                          onClick={() => { 
                            // Navigate based on role
                            if (currentRole === "admin") {
                              navigate("/courses");
                            } else if (currentRole === "lecturer") {
                              navigate(`/course/${course.id}`);
                            } else {
                              // Student
                              navigate(`/course/${course.id}`);
                            }
                            setShowResults(false); 
                            setSearchQuery(""); 
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{course.name}</p>
                            <p className="text-xs text-muted-foreground">{course.code} • {course.lecturer}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Schedules - Navigate to schedule page */}
                  {results.schedules.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Jadwal</p>
                      {results.schedules.map(schedule => (
                        <button
                          key={schedule.id}
                          onClick={() => { 
                            navigate("/schedule"); 
                            setShowResults(false); 
                            setSearchQuery(""); 
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          <Calendar className="h-4 w-4 text-success" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{schedule.className} - {schedule.course}</p>
                            <p className="text-xs text-muted-foreground">{schedule.day} {schedule.time} • {schedule.room} • {schedule.lecturer}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Students - Admin only */}
                  {results.students.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Mahasiswa</p>
                      {results.students.map(student => (
                        <button
                          key={student.id}
                          onClick={() => { navigate("/admin?tab=users"); setShowResults(false); setSearchQuery(""); }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          <Users className="h-4 w-4 text-warning" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.nim} • {student.prodi}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Lecturers - Admin only */}
                  {results.lecturers.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Dosen</p>
                      {results.lecturers.map(lecturer => (
                        <button
                          key={lecturer.id}
                          onClick={() => { navigate("/admin?tab=users"); setShowResults(false); setSearchQuery(""); }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          <User className="h-4 w-4 text-accent-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{lecturer.name}</p>
                            <p className="text-xs text-muted-foreground">{lecturer.nip} • {lecturer.prodi}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Tasks - Only for Student and Lecturer (Admin excluded) */}
                  {results.tasks.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Tugas</p>
                      {results.tasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => { 
                            // Navigate based on role - Lecturer uses lecturer route
                            if (currentRole === "lecturer") {
                              navigate(`/course/${task.courseId}?tab=assignments`);
                            } else {
                              // Student
                              navigate(`/course/${task.courseId}?tab=assignments`);
                            }
                            setShowResults(false); 
                            setSearchQuery(""); 
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          <FileText className="h-4 w-4 text-destructive" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.courseName} • Deadline: {task.deadline}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Materials - Only for Student and Lecturer (Admin excluded) */}
                  {results.materials.length > 0 && (
                    <div>
                      <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Materi</p>
                      {results.materials.map(material => (
                        <button
                          key={`material-${material.id}`}
                          onClick={() => { 
                            // Navigate based on role
                            if (currentRole === "lecturer") {
                              navigate(`/course/${material.courseId}?tab=materials`);
                            } else {
                              // Student
                              navigate(`/course/${material.courseId}?tab=materials`);
                            }
                            setShowResults(false); 
                            setSearchQuery(""); 
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left"
                        >
                          {material.type === "video" ? (
                            <Video className="h-4 w-4 text-primary" />
                          ) : (
                            <File className="h-4 w-4 text-warning" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">{material.name}</p>
                            <p className="text-xs text-muted-foreground">{material.courseName} • {material.weekTitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-popover border border-border shadow-lg">
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Lihat Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
