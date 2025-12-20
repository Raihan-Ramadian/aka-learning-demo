import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header, UserRole } from "@/components/lms/Header";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Building, Briefcase, Edit3, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock user data based on role
const userData = {
  student: {
    name: "Siti Rahayu",
    nim: "2024001",
    email: "siti.rahayu@mhs.aka.ac.id",
    phone: "081234567890",
    address: "Jl. Merdeka No. 10, Kelurahan Tanah Sareal, Kecamatan Bogor Utara, Kota Bogor, Jawa Barat 16161",
    prodi: "D3 Analisis Kimia",
    angkatan: "2024",
    status: "Aktif",
    avatar: null,
    semester: "3",
    ipk: "3.75",
    dosen_wali: "Dr. Ahmad Wijaya",
  },
  lecturer: {
    name: "Dr. Ahmad Wijaya, M.Sc.",
    nip: "198501012010011001",
    email: "ahmad.wijaya@dosen.aka.ac.id",
    phone: "081234567801",
    address: "Jl. Profesor No. 1, Kelurahan Bubulak, Kecamatan Bogor Barat, Kota Bogor, Jawa Barat 16115",
    prodi: "D3 Analisis Kimia",
    jabatan: "Lektor Kepala",
    status: "Aktif",
    avatar: null,
    bidang_keahlian: "Kimia Analitik, Spektroskopi",
    pendidikan: "S3 Kimia - Universitas Indonesia",
  },
  admin: {
    name: "Admin Sistem",
    nip: "199001012015011001",
    email: "admin@aka.ac.id",
    phone: "0251-8650351",
    address: "Kampus Politeknik AKA Bogor, Jl. Pangeran Sogiri No. 283, Tanah Baru, Bogor Utara",
    jabatan: "Administrator Sistem",
    status: "Aktif",
    avatar: null,
    unit: "Biro Administrasi Akademik",
  },
};

export default function Profile() {
  const [currentRole, setCurrentRole] = useState<UserRole>("student");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const user = userData[currentRole];

  const handleSaveProfile = () => {
    toast({
      title: "Profil Berhasil Diperbarui!",
      description: "Perubahan data profil Anda telah tersimpan.",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
        <main className="p-6">
          <div className="animate-fade-in space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profil Saya 👤</h1>
                <p className="mt-1 text-muted-foreground">Lihat dan kelola informasi profil Anda</p>
              </div>
              <Button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="gap-2"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit Profil
                  </>
                )}
              </Button>
            </div>

            {/* Profile Card */}
            <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
              {/* Cover & Avatar */}
              <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-accent relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-muted border-4 border-card flex items-center justify-center shadow-lg">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary-hover transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-16 pb-6 px-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                    <p className="text-muted-foreground">
                      {currentRole === "student" ? `NIM: ${(user as typeof userData.student).nim}` : `NIP: ${(user as typeof userData.lecturer).nip}`}
                    </p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    user.status === "Aktif" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Information */}
            <div className="grid grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
                <div className="bg-muted/50 px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Informasi Kontak</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    {isEditing ? (
                      <Input defaultValue={user.email} />
                    ) : (
                      <p className="font-medium text-foreground">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Phone className="h-4 w-4" />
                      No. Telepon
                    </label>
                    {isEditing ? (
                      <Input defaultValue={user.phone} />
                    ) : (
                      <p className="font-medium text-foreground">{user.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      Alamat Lengkap
                    </label>
                    {isEditing ? (
                      <Textarea defaultValue={user.address} rows={3} />
                    ) : (
                      <p className="font-medium text-foreground">{user.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic/Work Information */}
              <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
                <div className="bg-muted/50 px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    {currentRole === "student" ? "Informasi Akademik" : "Informasi Pekerjaan"}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  {currentRole === "student" && (
                    <>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building className="h-4 w-4" />
                          Program Studi
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof userData.student).prodi}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            Angkatan
                          </label>
                          <p className="font-medium text-foreground">{(user as typeof userData.student).angkatan}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Semester</label>
                          <p className="font-medium text-foreground">Semester {(user as typeof userData.student).semester}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">IPK</label>
                          <p className="font-bold text-xl text-primary">{(user as typeof userData.student).ipk}</p>
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <GraduationCap className="h-4 w-4" />
                            Dosen Wali
                          </label>
                          <p className="font-medium text-foreground">{(user as typeof userData.student).dosen_wali}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {currentRole === "lecturer" && (
                    <>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building className="h-4 w-4" />
                          Program Studi
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof userData.lecturer).prodi}</p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Briefcase className="h-4 w-4" />
                          Jabatan Akademik
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof userData.lecturer).jabatan}</p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <GraduationCap className="h-4 w-4" />
                          Pendidikan Terakhir
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof userData.lecturer).pendidikan}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Bidang Keahlian</label>
                        <p className="font-medium text-foreground">{(user as typeof userData.lecturer).bidang_keahlian}</p>
                      </div>
                    </>
                  )}

                  {currentRole === "admin" && (
                    <>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Briefcase className="h-4 w-4" />
                          Jabatan
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof userData.admin).jabatan}</p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building className="h-4 w-4" />
                          Unit Kerja
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof userData.admin).unit}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cancel Button when Editing */}
            {isEditing && (
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
