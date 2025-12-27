import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import "./login.css"; // Import custom CSS for media queries

// Demo credentials for role-based login
{/* These are just for simulation purposes 
const demoCredentials = {
  student: { id: "2024001", password: "demo123", role: "student" },
  lecturer: { id: "198501012010011001", password: "demo123", role: "lecturer" },
  admin: { id: "admin", password: "admin123", role: "admin" },
};*/}

const demoCredentials = {
  student: { id: "1", password: "1", role: "student" },
  lecturer: { id: "2", password: "2", role: "lecturer" },
  admin: { id: "3", password: "3", role: "admin" },
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [nimNip, setNimNip] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Override viewport untuk mobile-friendly pada halaman login
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport?.getAttribute('content') || '';
    
    // Set responsive viewport untuk login page
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
    
    // Restore original viewport saat unmount
    return () => {
      if (viewport) {
        viewport.setAttribute('content', originalContent);
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Validate credentials
      if (!nimNip || !password) {
        toast({
          title: "Login Gagal",
          description: "NIM/NIP dan password harus diisi.",
          variant: "destructive",
        });
        return;
      }

      // Determine role based on NIM/NIP format
      let role = "student";
      let userName = "User";
      let roleLabel = "Mahasiswa";
      let redirectPath = "/dashboard";
      
      // Check for admin login
      if (nimNip === "3") {
        role = "admin";
        userName = "Admin";
        roleLabel = "Admin";
        redirectPath = "/admin";
      } 
      // Check for NIP format (starts with '19' - lecturer/dosen)
      else if (nimNip.startsWith("2")) {
        role = "lecturer";
        userName = "Dosen";
        roleLabel = "Dosen";
        redirectPath = "/lecturer";
      } 
      // Check for NIM format (starts with '20' - student/mahasiswa)
      else if (nimNip.startsWith("1")) {
        role = "student";
        userName = "Mahasiswa";
        roleLabel = "Mahasiswa";
        redirectPath = "/dashboard";
      }
      // Invalid format
      else {
        toast({
          title: "Login Gagal",
          description: "Format NIM/NIP tidak valid. NIM harus diawali '20', NIP diawali '19', atau gunakan 'admin'.",
          variant: "destructive",
        });
        return;
      }

      // Store role in localStorage for simulation
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userNimNip", nimNip);
      
      // Show success toast with role-specific message
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang, ${roleLabel}. Mengalihkan ke Dashboard...`,
      });
      
      // Auto redirect after 1 second
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Visual - Hidden on mobile via CSS media query */}
      <div className="login-left-side lg:w-1/2 relative overflow-hidden">
        {/* Building Background Image with slight blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/building.jpg)',
            filter: 'blur(3px)'
          }}
        />
        
        {/* Blend Mode Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 via-white-900/90 to-gray-900/70 mix-blend-multiply" />
        
        {/* Additional Color Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

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
            <img src="/icon.png" alt="AKA Logo" className="h-16 w-16 object-contain drop-shadow-xl" />
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Politeknik AKA Bogor</h1>
              <p className="text-white/80 drop-shadow-md">Learning Management System</p>
            </div>
          </div>

          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Selamat Datang di Portal Akademik
            </h2>
            <p className="text-lg text-white/70 mb-8 drop-shadow-md">
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
                <div key={i} className="bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all">
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Logo/Badge */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="text-sm text-white/70 drop-shadow-md">
              Politeknik AKA Bogor © 2025
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo - shown on mobile via CSS media query */}
          <div className="login-mobile-logo flex items-center justify-center gap-3 mb-8">
            <img src="/icon.png" alt="AKA Logo" className="h-14 w-14 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Politeknik AKA Bogor</h1>
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
              <p>Mahasiswa: NIM <strong>1</strong> | Password: <strong>1</strong></p>
              <p>Dosen: NIP <strong>2</strong> | Password: <strong>2</strong></p>
              <p>Admin: ID <strong>3</strong> | Password: <strong>3</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}