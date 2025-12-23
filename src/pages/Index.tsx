import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header } from "@/components/lms/Header";
import { StudentDashboard } from "@/components/lms/StudentDashboard";
import { LecturerDashboard } from "@/components/lms/LecturerDashboard";
import { AdminDashboard } from "@/components/lms/AdminDashboard";
import { CourseDetail } from "@/components/lms/CourseDetail";
import { getUserRole, UserRole } from "@/types/roles";

interface SelectedCourse {
  id: number;
  name: string;
  code: string;
  lecturer: string;
  color: string;
}

const Index = () => {
  const currentRole = getUserRole();
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null);

  const handleCourseClick = (course: SelectedCourse) => {
    setSelectedCourse(course);
  };

  const handleBackToDashboard = () => {
    setSelectedCourse(null);
  };

  const renderContent = () => {
    // If a course is selected (for student or lecturer), show course detail
    if (selectedCourse && (currentRole === "student" || currentRole === "lecturer")) {
      return (
        <CourseDetail
          course={selectedCourse}
          userRole={currentRole}
          onBack={handleBackToDashboard}
        />
      );
    }

    // Otherwise, show the appropriate dashboard
    switch (currentRole) {
      case "student":
        return <StudentDashboard onCourseClick={handleCourseClick} />;
      case "lecturer":
        return <LecturerDashboard onCourseClick={handleCourseClick} />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard onCourseClick={handleCourseClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
