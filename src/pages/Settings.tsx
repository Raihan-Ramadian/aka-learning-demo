import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header } from "@/components/lms/Header";
import { Settings as SettingsIcon, Lock, Bell, Eye, EyeOff, Shield, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Settings() {
  const { toast } = useToast();

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailTugas: true,
    emailNilai: true,
    emailPengumuman: true,
    pushTugas: true,
    pushNilai: false,
    pushPengumuman: true,
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password baru dan konfirmasi tidak cocok!",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password minimal 8 karakter!",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Berhasil Diubah!",
      description: "Silakan gunakan password baru untuk login selanjutnya.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleNotificationSave = () => {
    toast({
      title: "Pengaturan Tersimpan!",
      description: "Preferensi notifikasi Anda telah diperbarui.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <div className="animate-fade-in space-y-6 max-w-4xl">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <SettingsIcon className="h-7 w-7" />
                Pengaturan ⚙️
              </h1>
              <p className="mt-1 text-muted-foreground">Kelola password dan preferensi notifikasi Anda</p>
            </div>

            {/* Change Password */}
            <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Ganti Password
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pastikan password baru Anda kuat dan mudah diingat
                </p>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Masukkan password saat ini"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Masukkan password baru (min. 8 karakter)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              newPassword.length >= level * 3
                                ? level <= 2
                                  ? "bg-destructive"
                                  : level === 3
                                  ? "bg-warning"
                                  : "bg-success"
                                : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {newPassword.length < 6
                          ? "Terlalu lemah"
                          : newPassword.length < 8
                          ? "Lemah"
                          : newPassword.length < 12
                          ? "Cukup kuat"
                          : "Sangat kuat"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-destructive mt-1">Password tidak cocok</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Password cocok
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button type="submit" className="gap-2">
                    <Shield className="h-4 w-4" />
                    Ubah Password
                  </Button>
                </div>
              </form>
            </div>

            {/* Notification Settings */}
            <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Pengaturan Notifikasi
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Atur bagaimana Anda ingin menerima pemberitahuan
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4">Notifikasi Email</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Tugas Baru</p>
                        <p className="text-sm text-muted-foreground">Terima email saat ada tugas baru</p>
                      </div>
                      <Switch
                        checked={notifications.emailTugas}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailTugas: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Nilai Keluar</p>
                        <p className="text-sm text-muted-foreground">Terima email saat nilai diumumkan</p>
                      </div>
                      <Switch
                        checked={notifications.emailNilai}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailNilai: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Pengumuman</p>
                        <p className="text-sm text-muted-foreground">Terima email untuk pengumuman penting</p>
                      </div>
                      <Switch
                        checked={notifications.emailPengumuman}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailPengumuman: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Push Notification (Browser)</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Tugas Baru</p>
                        <p className="text-sm text-muted-foreground">Notifikasi browser untuk tugas</p>
                      </div>
                      <Switch
                        checked={notifications.pushTugas}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushTugas: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Nilai Keluar</p>
                        <p className="text-sm text-muted-foreground">Notifikasi browser untuk nilai</p>
                      </div>
                      <Switch
                        checked={notifications.pushNilai}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushNilai: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Pengumuman</p>
                        <p className="text-sm text-muted-foreground">Notifikasi browser untuk pengumuman</p>
                      </div>
                      <Switch
                        checked={notifications.pushPengumuman}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushPengumuman: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleNotificationSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Simpan Pengaturan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
