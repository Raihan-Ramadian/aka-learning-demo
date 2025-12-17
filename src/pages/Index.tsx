import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header, UserRole } from "@/components/lms/Header";
import { StudentDashboard } from "@/components/lms/StudentDashboard";
import { LecturerDashboard } from "@/components/lms/LecturerDashboard";
import { AdminDashboard } from "@/components/lms/AdminDashboard";

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");

  const renderDashboard = () => {
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
        <Header currentRole={currentRole} onRoleChange={setCurrentRole} />

        {/* Dashboard Content */}
        <main className="p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default Index;
