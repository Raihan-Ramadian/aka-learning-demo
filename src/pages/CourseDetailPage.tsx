import { useParams, useNavigate } from "react-router-dom";
import { CourseDetail } from "@/components/lms/CourseDetail";
import { getUserRole } from "@/types/roles";

// Mock course data (same as in dashboards)
const coursesData: Record<string, { id: number; name: string; code: string; lecturer: string; color: string }> = {
  "1": { id: 1, name: "Kimia Dasar", code: "KIM101", lecturer: "Dr. Ahmad Wijaya", color: "from-blue-500 to-cyan-500" },
  "2": { id: 2, name: "Biokimia", code: "BIO201", lecturer: "Prof. Sari Dewi", color: "from-emerald-500 to-teal-500" },
  "3": { id: 3, name: "Kimia Analitik", code: "KIM202", lecturer: "Dr. Rudi Hartono", color: "from-violet-500 to-purple-500" },
  "4": { id: 4, name: "Kimia Organik", code: "KIM301", lecturer: "Dr. Maya Putri", color: "from-orange-500 to-amber-500" },
  "5": { id: 5, name: "Praktikum Kimia", code: "KIM102", lecturer: "Pak Budi", color: "from-violet-500 to-purple-500" },
};

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const currentRole = getUserRole();
  
  const course = courseId ? coursesData[courseId] : null;
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground">Mata Kuliah Tidak Ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Mata kuliah yang Anda cari tidak tersedia.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
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
