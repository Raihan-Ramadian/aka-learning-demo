import { useParams, useNavigate } from "react-router-dom";
import { CourseDetail } from "@/components/lms/CourseDetail";
import { getUserRole } from "@/types/roles";
import { useAcademicData } from "@/contexts/AcademicDataContext";

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const currentRole = getUserRole();
  
  // Get courses from context for dynamic data
  const { courses, getMaterialsByCourse } = useAcademicData();
  
  // Find course using string comparison to handle both number and string IDs
  const course = courseId 
    ? courses.find(c => String(c.id) === String(courseId))
    : null;
  
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

  return (
    <CourseDetail
      course={course}
      userRole={currentRole === "lecturer" ? "lecturer" : "student"}
      onBack={handleBack}
    />
  );
}
