import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Demo credentials for role-based login
const demoCredentials = {
  student: { id: "2024001", password: "demo123", role: "student" },
  lecturer: { id: "198501012010011001", password: "demo123", role: "lecturer" },
  admin: { id: "admin", password: "admin123", role: "admin" },
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login with role detection
    setTimeout(() => {
      setIsLoading(false);
      
      // Check credentials and determine role
      let role = "student";
      let userName = "User";
      
      if (nimNip === demoCredentials.admin.id && password === demoCredentials.admin.password) {
        role = "admin";
        userName = "Admin";
      } else if (nimNip === demoCredentials.lecturer.id && password === demoCredentials.lecturer.password) {
        role = "lecturer";
        userName = "Dr. Ahmad Wijaya";
      } else if (nimNip === demoCredentials.student.id && password === demoCredentials.student.password) {
        role = "student";
        userName = "Siti Rahayu";
      } else if (nimNip && password) {
        // Default to student for any other credentials
        role = "student";
        userName = "Mahasiswa";
      } else {
        toast({
          title: "Login Gagal",
          description: "NIM/NIP atau password salah.",
          variant: "destructive",
        });
        return;
      }

      // Store role in localStorage for simulation
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", userName);
      
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang, ${userName}. Mengalihkan ke Dashboard...`,
      });
      
      // Auto redirect after toast - navigate to dashboard based on role
      setTimeout(() => {
        navigate("/");
      }, 500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-sidebar-background via-sidebar-accent to-primary overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-sidebar-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Chemistry Lab Illustration Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <pattern id="labPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <path d="M20 30 L40 30 L50 60 L60 30 L80 30" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="75" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#labPattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sidebar-primary shadow-lg">
              <GraduationCap className="h-10 w-10 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-sidebar-foreground">AKA Learning</h1>
              <p className="text-sidebar-foreground/70">Learning Management System</p>
            </div>
          </div>

          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold text-sidebar-foreground mb-4">
              Selamat Datang di Portal Akademik
            </h2>
            <p className="text-lg text-sidebar-foreground/80 mb-8">
              Akses materi kuliah, kelola tugas, dan pantau perkembangan akademik Anda dengan mudah.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { title: "Akses Materi", desc: "Kapan saja, di mana saja" },
                { title: "Kelola Tugas", desc: "Submit & tracking nilai" },
                { title: "Jadwal Kuliah", desc: "Kalender terintegrasi" },
                { title: "Komunikasi", desc: "Dosen & mahasiswa" },
              ].map((feature, i) => (
                <div key={i} className="bg-sidebar-accent/50 rounded-xl p-4 backdrop-blur-sm">
                  <h3 className="font-semibold text-sidebar-foreground">{feature.title}</h3>
                  <p className="text-sm text-sidebar-foreground/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Logo/Badge */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="text-sm text-sidebar-foreground/60">
              Politeknik AKA Bogor © 2024
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AKA Learning</h1>
              <p className="text-xs text-muted-foreground">Learning Management System</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Masuk ke Akun Anda</h2>
            <p className="mt-2 text-muted-foreground">
              Silakan masukkan NIM/NIP dan password Anda
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                NIM / NIP
              </label>
              <Input
                type="text"
                placeholder="Masukkan NIM atau NIP"
                value={nimNip}
                onChange={(e) => setNimNip(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-input" />
                <span className="text-muted-foreground">Ingat saya</span>
              </label>
              <a href="#" className="text-primary hover:underline font-medium">
                Lupa password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Memproses...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Masuk
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Butuh bantuan? Hubungi</p>
            <a href="mailto:support@aka.ac.id" className="text-primary hover:underline font-medium">
              support@aka.ac.id
            </a>
          </div>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-muted rounded-xl">
            <p className="text-sm font-medium text-foreground mb-2">Demo Account:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Mahasiswa: NIM <strong>2024001</strong> | Password: <strong>demo123</strong></p>
              <p>Dosen: NIP <strong>198501012010011001</strong> | Password: <strong>demo123</strong></p>
              <p>Admin: ID <strong>admin</strong> | Password: <strong>admin123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}