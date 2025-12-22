import { useState } from "react";
import { Sidebar } from "@/components/lms/Sidebar";
import { Header, UserRole } from "@/components/lms/Header";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Building, Briefcase, Edit3, Camera, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock user data based on role
const initialUserData = {
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
  
  // Editable form state for contact info
  const [formData, setFormData] = useState({
    student: {
      phone: initialUserData.student.phone,
      address: initialUserData.student.address,
    },
    lecturer: {
      phone: initialUserData.lecturer.phone,
      address: initialUserData.lecturer.address,
    },
    admin: {
      phone: initialUserData.admin.phone,
      address: initialUserData.admin.address,
    },
  });

  const user = initialUserData[currentRole];
  const currentFormData = formData[currentRole];

  const handleInputChange = (field: 'phone' | 'address', value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        [field]: value,
      }
    }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profil Berhasil Diperbarui!",
      description: "Perubahan data kontak Anda telah tersimpan.",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset form data to original
    setFormData({
      student: {
        phone: initialUserData.student.phone,
        address: initialUserData.student.address,
      },
      lecturer: {
        phone: initialUserData.lecturer.phone,
        address: initialUserData.lecturer.address,
      },
      admin: {
        phone: initialUserData.admin.phone,
        address: initialUserData.admin.address,
      },
    });
    setIsEditing(false);
  };

  // Check if current role can edit (student & lecturer only)
  const canEdit = currentRole === "student" || currentRole === "lecturer";

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
                <p className="mt-1 text-muted-foreground">
                  {canEdit ? "Lihat dan kelola informasi profil Anda" : "Lihat informasi profil Anda"}
                </p>
              </div>
              {canEdit && (
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                        <X className="h-4 w-4" />
                        Batal
                      </Button>
                      <Button onClick={handleSaveProfile} className="gap-2">
                        <Save className="h-4 w-4" />
                        Simpan Perubahan
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      Edit Profil
                    </Button>
                  )}
                </div>
              )}
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
                    {isEditing && canEdit && (
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
                      {currentRole === "student" ? `NIM: ${(user as typeof initialUserData.student).nim}` : `NIP: ${(user as typeof initialUserData.lecturer).nip}`}
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
              {/* Contact Information - Editable for Student/Lecturer */}
              <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
                <div className="bg-muted/50 px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Informasi Kontak
                    {isEditing && canEdit && (
                      <span className="ml-2 text-xs text-primary font-normal">(Dapat diedit)</span>
                    )}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <p className="font-medium text-foreground">{user.email}</p>
                    {isEditing && <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah</p>}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Phone className="h-4 w-4" />
                      No. Telepon
                    </label>
                    {isEditing && canEdit ? (
                      <Input 
                        value={currentFormData.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Masukkan nomor telepon"
                      />
                    ) : (
                      <p className="font-medium text-foreground">{currentFormData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      Alamat Lengkap
                    </label>
                    {isEditing && canEdit ? (
                      <Textarea 
                        value={currentFormData.address} 
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3} 
                        placeholder="Masukkan alamat lengkap"
                      />
                    ) : (
                      <p className="font-medium text-foreground">{currentFormData.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic/Work Information - Read Only */}
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
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.student).prodi}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            Angkatan
                          </label>
                          <p className="font-medium text-foreground">{(user as typeof initialUserData.student).angkatan}</p>
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Semester</label>
                          <p className="font-medium text-foreground">Semester {(user as typeof initialUserData.student).semester}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">IPK</label>
                          <p className="font-bold text-xl text-primary">{(user as typeof initialUserData.student).ipk}</p>
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <GraduationCap className="h-4 w-4" />
                            Dosen Wali
                          </label>
                          <p className="font-medium text-foreground">{(user as typeof initialUserData.student).dosen_wali}</p>
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
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.lecturer).prodi}</p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Briefcase className="h-4 w-4" />
                          Jabatan Akademik
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.lecturer).jabatan}</p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <GraduationCap className="h-4 w-4" />
                          Pendidikan Terakhir
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.lecturer).pendidikan}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Bidang Keahlian</label>
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.lecturer).bidang_keahlian}</p>
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
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.admin).jabatan}</p>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building className="h-4 w-4" />
                          Unit Kerja
                        </label>
                        <p className="font-medium text-foreground">{(user as typeof initialUserData.admin).unit}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}