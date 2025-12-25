import { useState } from "react";
import { getUserRole } from "@/types/roles";
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Building, Briefcase, Edit3, Camera, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAcademicData } from "@/contexts/AcademicDataContext";

export default function Profile() {
  const currentRole = getUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { managedStudents, managedLecturers } = useAcademicData();
  
  // Get current student from AcademicDataContext - simulated by NIM
  // In a real app, this would come from authentication
  const studentNim = "2024001";
  const lecturerNip = "198501012010011001";
  
  // Get student/lecturer data from context
  const currentStudent = managedStudents.find(s => s.nim === studentNim);
  const currentLecturer = managedLecturers.find(l => l.nip === lecturerNip);
  
  // Fallback data for admin (not in managedStudents/managedLecturers)
  const adminData = {
    name: "Admin Sistem",
    nip: "199001012015011001",
    email: "admin@aka.ac.id",
    phone: "0251-8650351",
    address: "Kampus Politeknik AKA Bogor, Jl. Pangeran Sogiri No. 283, Tanah Baru, Bogor Utara",
    jabatan: "Administrator Sistem",
    status: "Aktif",
    unit: "Biro Administrasi Akademik",
  };
  
  // Get user data based on role
  const getUserData = () => {
    if (currentRole === "student" && currentStudent) {
      return {
        name: currentStudent.name,
        nim: currentStudent.nim,
        email: currentStudent.email,
        phone: currentStudent.phone,
        address: currentStudent.address,
        prodi: currentStudent.prodi,
        angkatan: currentStudent.angkatan,
        semester: String(currentStudent.semester),
        status: currentStudent.status,
      };
    } else if (currentRole === "lecturer" && currentLecturer) {
      return {
        name: currentLecturer.name,
        nip: currentLecturer.nip,
        email: currentLecturer.email,
        phone: currentLecturer.phone,
        address: currentLecturer.address,
        prodi: currentLecturer.prodi,
        jabatan: currentLecturer.jabatan,
        status: currentLecturer.status,
        bidang_keahlian: "Kimia Analitik, Spektroskopi",
        pendidikan: "S3 Kimia - Universitas Indonesia",
      };
    } else {
      return adminData;
    }
  };
  
  const userData = getUserData();

  // Editable form state for contact info
  const [formData, setFormData] = useState({
    phone: userData.phone || "",
    address: userData.address || "",
    jabatan: (currentRole === "lecturer" && currentLecturer) ? currentLecturer.jabatan : adminData.jabatan,
    bidang_keahlian: "Kimia Analitik, Spektroskopi",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profil Berhasil Diperbarui!",
      description: "Perubahan data Anda telah tersimpan.",
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      phone: userData.phone || "",
      address: userData.address || "",
      jabatan: (currentRole === "lecturer" && currentLecturer) ? currentLecturer.jabatan : adminData.jabatan,
      bidang_keahlian: "Kimia Analitik, Spektroskopi",
    });
    setIsEditing(false);
  };

  const canEdit = true;

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profil Saya 👤</h1>
          <p className="mt-1 text-muted-foreground">
            Lihat dan kelola informasi profil Anda
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
              <h2 className="text-xl font-bold text-foreground">{userData.name}</h2>
              <p className="text-muted-foreground">
                {currentRole === "student" 
                  ? `NIM: ${(userData as any).nim}` 
                  : `NIP: ${(userData as any).nip}`}
              </p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              userData.status === "Aktif" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            )}>
              {userData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Detail Information */}
      <div className="grid grid-cols-2 gap-6">
        {/* Contact Information - Editable */}
        <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Informasi Kontak
              {isEditing && (
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
              <p className="font-medium text-foreground">{userData.email}</p>
              {isEditing && <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Phone className="h-4 w-4" />
                No. Telepon
              </label>
              {isEditing ? (
                <Input 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Masukkan nomor telepon"
                />
              ) : (
                <p className="font-medium text-foreground">{formData.phone}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                Alamat Lengkap
              </label>
              {isEditing ? (
                <Textarea 
                  value={formData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3} 
                  placeholder="Masukkan alamat lengkap"
                />
              ) : (
                <p className="font-medium text-foreground">{formData.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Academic/Work Information */}
        <div className="rounded-xl bg-card border border-border/50 shadow-card overflow-hidden">
          <div className="bg-muted/50 px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              {currentRole === "student" ? "Informasi Akademik" : "Informasi Pekerjaan"}
              {isEditing && currentRole !== "student" && (
                <span className="ml-2 text-xs text-primary font-normal">(Dapat diedit)</span>
              )}
              {isEditing && currentRole === "student" && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">(Tidak dapat diubah)</span>
              )}
            </h3>
          </div>
          <div className="p-6 space-y-5">
            {currentRole === "student" && currentStudent && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Building className="h-4 w-4" />
                    Program Studi
                  </label>
                  <p className="font-medium text-foreground">{currentStudent.prodi}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      Angkatan
                    </label>
                    <p className="font-medium text-foreground">{currentStudent.angkatan}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Semester</label>
                    <p className="font-medium text-foreground">Semester {currentStudent.semester}</p>
                  </div>
                </div>
              </>
            )}

            {currentRole === "lecturer" && currentLecturer && (
              <>
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Building className="h-4 w-4" />
                    Program Studi
                  </label>
                  <p className="font-medium text-foreground">{currentLecturer.prodi}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Briefcase className="h-4 w-4" />
                    Jabatan Akademik
                  </label>
                  {isEditing ? (
                    <select 
                      value={formData.jabatan}
                      onChange={(e) => handleInputChange('jabatan', e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Asisten Ahli">Asisten Ahli</option>
                      <option value="Lektor">Lektor</option>
                      <option value="Lektor Kepala">Lektor Kepala</option>
                      <option value="Guru Besar">Guru Besar</option>
                    </select>
                  ) : (
                    <p className="font-medium text-foreground">{currentLecturer.jabatan}</p>
                  )}
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
                  {isEditing ? (
                    <Input 
                      value={formData.jabatan}
                      onChange={(e) => handleInputChange('jabatan', e.target.value)}
                      placeholder="Masukkan jabatan"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{adminData.jabatan}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Building className="h-4 w-4" />
                    Unit Kerja
                  </label>
                  <p className="font-medium text-foreground">{adminData.unit}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}