import { useParams, useNavigate } from "react-router-dom";
import { CourseDetail } from "@/components/lms/CourseDetail";
import { getUserRole } from "@/types/roles";
import { useAcademicData } from "@/contexts/AcademicDataContext";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const currentRole = getUserRole();
  
  // Get courses from context for dynamic data
  const { courses, getMaterialsByCourse, schedules, getLecturerByNip } = useAcademicData();
  
  // Find course using string comparison to handle both number and string IDs
  const course = courseId 
    ? courses.find(c => String(c.id) === String(courseId))
    : null;
    
  // LIVE LOOKUP: Get the latest lecturer name from schedules that reference this course
  const getCourseLecturerName = () => {
    if (!course) return "";
    
    // First try to find from schedule with lecturerNip
    const courseSchedule = schedules.find(s => s.course === course.name);
    if (courseSchedule?.lecturerNip) {
      const lecturer = getLecturerByNip(courseSchedule.lecturerNip);
      if (lecturer) return lecturer.name;
    }
    
    // Fallback to course.lecturer (static)
    return course.lecturer;
  };
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground">Mata Kuliah Tidak Ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Mata kuliah yang Anda cari tidak tersedia.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Kembali
        </button>
      </div>
    );
  }

  const handleBack = () => {
    // Navigate back to the appropriate dashboard based on role
    if (currentRole === "lecturer") {
      navigate("/lecturer");
    } else if (currentRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };
  
  // Create course object with live-looked-up lecturer name
  const courseWithLiveLecturer = {
    ...course,
    lecturer: getCourseLecturerName(),
  };

  return (
    <CourseDetail
      course={courseWithLiveLecturer}
      userRole={currentRole === "lecturer" ? "lecturer" : "student"}
      onBack={handleBack}
    />
  );
}
