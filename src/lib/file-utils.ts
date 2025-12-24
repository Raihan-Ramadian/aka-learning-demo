// Utility functions for file handling (simulated for frontend demo)

export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? "");
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function downloadPDF(title: string, content: string) {
  // Simulated PDF download - creates a text file as placeholder
  // In production, you'd use a library like jsPDF or call a backend API
  const pdfContent = `
===========================================
${title}
===========================================
Generated: ${new Date().toLocaleString('id-ID')}

${content}

-------------------------------------------
Dokumen ini di-generate oleh AKA Learning
===========================================
  `.trim();

  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function simulateImportCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        resolve([]);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      resolve(data);
    };
    reader.readAsText(file);
  });
}

export function generateSchedulePDFContent(schedules: Array<{
  className: string;
  course: string;
  lecturer: string;
  day: string;
  time: string;
  room: string;
}>) {
  let content = "JADWAL KULIAH SEMESTER GANJIL 2024/2025\n\n";
  
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  
  days.forEach(day => {
    const daySchedules = schedules.filter(s => s.day === day);
    if (daySchedules.length > 0) {
      content += `\n${day.toUpperCase()}\n${'─'.repeat(50)}\n`;
      daySchedules.forEach(s => {
        content += `${s.time} | ${s.course} (${s.className})\n`;
        content += `         Ruang: ${s.room} | Dosen: ${s.lecturer}\n\n`;
      });
    }
  });

  return content;
}

export function generateGradeReportCSV(submissions: Array<{
  studentName: string;
  studentNim: string;
  status: string;
  grade: number | null;
  submittedAt: string | null;
}>) {
  return submissions.map(s => ({
    NIM: s.studentNim,
    Nama: s.studentName,
    Status: s.status === 'graded' ? 'Sudah Dinilai' : s.status === 'submitted' ? 'Sudah Dikumpul' : 'Belum Dikumpul',
    Nilai: s.grade ?? '-',
    'Tanggal Pengumpulan': s.submittedAt ?? '-'
  }));
}

// Generate practicum grade report with 6 criteria
export function generatePracticumGradeReportCSV(submissions: Array<{
  studentName: string;
  studentNim: string;
  status: string;
  laporanAwal: number | null;
  apd: number | null;
  k3: number | null;
  skill: number | null;
  kuis: number | null;
  laporanAkhir: number | null;
  average: number | null;
  submittedAt: string | null;
}>) {
  return submissions.map(s => ({
    NIM: s.studentNim,
    Nama: s.studentName,
    Status: s.average !== null ? 'Sudah Dinilai' : s.status === 'submitted' ? 'Sudah Dikumpul' : 'Belum Dikumpul',
    'Laporan Awal': s.laporanAwal ?? '-',
    'APD': s.apd ?? '-',
    'K3': s.k3 ?? '-',
    'Skill': s.skill ?? '-',
    'Kuis': s.kuis ?? '-',
    'Laporan Akhir': s.laporanAkhir ?? '-',
    'Rata-rata': s.average ?? '-',
    'Tanggal Pengumpulan': s.submittedAt ?? '-'
  }));
}
