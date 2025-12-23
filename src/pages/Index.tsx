import { Sidebar } from "@/components/lms/Sidebar";
import { Header } from "@/components/lms/Header";
import { StudentDashboard } from "@/components/lms/StudentDashboard";
import { LecturerDashboard } from "@/components/lms/LecturerDashboard";
import { AdminDashboard } from "@/components/lms/AdminDashboard";
import { getUserRole } from "@/types/roles";

const Index = () => {
  const currentRole = getUserRole();

  const renderContent = () => {
    switch (currentRole) {
      case "student":
        return <StudentDashboard />;
      case "lecturer":
        return <LecturerDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
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
