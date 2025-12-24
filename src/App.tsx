import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Schedule from "./pages/Schedule";
import Courses from "./pages/Courses";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { AdminDashboard } from "./components/lms/AdminDashboard";
import { LecturerDashboard } from "./components/lms/LecturerDashboard";
import { StudentDashboard } from "./components/lms/StudentDashboard";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { Sidebar } from "./components/lms/Sidebar";
import { Header } from "./components/lms/Header";
import { AcademicDataProvider } from "./contexts/AcademicDataContext";

const queryClient = new QueryClient();

// Layout wrapper for authenticated pages
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Sidebar />
    <div className="ml-64">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AcademicDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
            <Route path="/lecturer" element={<DashboardLayout><LecturerDashboard /></DashboardLayout>} />
            <Route path="/dashboard" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
            <Route path="/course/:courseId" element={<DashboardLayout><CourseDetailPage /></DashboardLayout>} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AcademicDataProvider>
  </QueryClientProvider>
);

export default App;
