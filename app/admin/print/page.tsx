// "use client";

// import { useEffect, useRef, useState } from "react";
// import { PageHeader } from "@/components/common/page-header";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Printer, FileDown, User, CreditCard } from "lucide-react";
// import type {
//   Student,
//   School,
//   AcademicYear,
//   Class,
//   Division,
// } from "@/lib/types";

// import { BASE_URL } from "@/lib/api";

// /* ======================================================
//    PRINT ID CARDS – REAL API + ALL FILTERS
//    UI / CARD / DESIGN UNCHANGED
// ====================================================== */

// export default function PrintIDCards() {
//   const printRef = useRef<HTMLDivElement>(null);

//   /* ---------------- STATE ---------------- */
//   const [schools, setSchools] = useState<any[]>([]);
//   const [years, setYears] = useState<any[]>([]);
//   const [classes, setClasses] = useState<any[]>([]);
//   const [divisions, setDivisions] = useState<any[]>([]);

//   const [students, setStudents] = useState<Student[]>([]);
//   const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

//   const [selectedSchool, setSelectedSchool] = useState("all");
//   const [selectedYear, setSelectedYear] = useState("all");
//   const [selectedClass, setSelectedClass] = useState("all");
//   const [selectedDivision, setSelectedDivision] = useState("all");

//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   /* ---------------- LOAD INITIAL ---------------- */
//   useEffect(() => {
//     loadSchools();
//     loadStudents();
//   }, []);

//   /* ---------------- API LOADERS ---------------- */
//   const loadSchools = async () => {
//     const data = await fetch(`${BASE_URL}/School/list`).then((res) =>
//       res.json()
//     );
//     setSchools(data || []);
//   };

//   const loadStudents = async () => {
//     const allStudents: Student[] = await fetch(
//       `${BASE_URL}/Student/getall`
//     ).then((res) => res.json());

//     const accepted: Student[] = [];

//     for (const s of allStudents) {
//       if (!s.studentId) continue;

//       const apps = await fetch(
//         `${BASE_URL}/Student/applications/student/${s.studentId}`
//       ).then((res) => res.json());

//       if (apps?.length && apps[0]?.status === "accept") {
//         accepted.push(s);
//       }
//     }

//     setStudents(accepted);
//     setFilteredStudents(accepted);

//     // derive class list
//     const cls = Array.from(
//       new Map(
//         accepted.map((s) => [
//           s.classId,
//           { classId: s.classId, className: s.className },
//         ])
//       ).values()
//     );
//     setClasses(cls);
//   };

//   /* ---------------- FILTER DEPENDENCY ---------------- */
//   useEffect(() => {
//     if (selectedSchool !== "all") {
//       fetch(`${BASE_URL}/School/academicyear/${selectedSchool}`)
//         .then((res) => res.json())
//         .then(setYears);

//       fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${selectedSchool}`)
//         .then((res) => res.json())
//         .then(setClasses);
//     } else {
//       setYears([]);
//       setClasses([]);
//       setDivisions([]);
//     }
//   }, [selectedSchool]);

//   useEffect(() => {
//     if (selectedClass !== "all") {
//       fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${selectedClass}`)
//         .then((res) => res.json())
//         .then(setDivisions);
//     } else {
//       setDivisions([]);
//     }
//   }, [selectedClass]);

//   /* ---------------- APPLY FILTER ---------------- */
//   useEffect(() => {
//     const data = students.filter((s) => {
//       if (selectedSchool !== "all" && s.schoolId?.toString() !== selectedSchool)
//         return false;
//       if (
//         selectedYear !== "all" &&
//         s.academicYearId?.toString() !== selectedYear
//       )
//         return false;
//       if (selectedClass !== "all" && s.classId?.toString() !== selectedClass)
//         return false;
//       if (
//         selectedDivision !== "all" &&
//         s.divisionId?.toString() !== selectedDivision
//       )
//         return false;
//       return true;
//     });

//     setFilteredStudents(data);
//     setSelectedIds([]);
//   }, [selectedSchool, selectedYear, selectedClass, selectedDivision, students]);

//   /* ---------------- SELECTION ---------------- */
//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const selectAll = () => {
//     if (selectedIds.length === filteredStudents.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(filteredStudents.map((s) => s.studentId!));
//     }
//   };

//   /* ---------------- PRINT ---------------- */
//   const handlePrint = () => {
//     const selected = filteredStudents.filter((s) =>
//       selectedIds.includes(s.studentId!)
//     );
//     if (!selected.length) return;

//     const win = window.open("", "_blank");
//     if (!win) return;

//     // Build HTML for selected students
//     const cardsHtml = selected
//       .map((s) => {
//         const school = schools.find((sch) => sch.schoolId === s.schoolId);
//         if (!school) return "";
//         return `<div class="rounded-lg overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto mb-4">
//                 ${document.getElementById(`card-${s.studentId}`)?.innerHTML}
//               </div>`;
//       })
//       .join("");

//     // Full wrapper with same classes as preview
//     const fullHtml = `
//     <html>
//       <head>
//         <title>ID Cards</title>
//         <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
//         <style>
//           body { padding: 20px; display: flex; flex-wrap: wrap; gap: 1rem; }
//           .cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
//         </style>
//       </head>
//       <body onload="window.print()">
//         <div class="cards-container">
//           ${cardsHtml}
//         </div>
//       </body>
//     </html>
//   `;

//     win.document.write(fullHtml);
//     win.document.close();
//   };

//   /* ---------------- UI (UNCHANGED) ---------------- */
//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Print ID Cards"
//         description="Select students and print ID cards"
//       />

//       {/* FILTERS */}
//       <Card>
//         <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <Label>School</Label>
//             <Select value={selectedSchool} onValueChange={setSelectedSchool}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 {schools.map((s) => (
//                   <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
//                     {s.schoolName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Academic Year</Label>
//             <Select value={selectedYear} onValueChange={setSelectedYear}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 {years.map((y) => (
//                   <SelectItem
//                     key={y.academicYearId}
//                     value={y.academicYearId.toString()}>
//                     {y.academicYear}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Class</Label>
//             <Select value={selectedClass} onValueChange={setSelectedClass}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 {classes.map((c) => (
//                   <SelectItem key={c.classId} value={c.classId.toString()}>
//                     {c.className}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Division</Label>
//             <Select
//               value={selectedDivision}
//               onValueChange={setSelectedDivision}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All</SelectItem>
//                 {divisions.map((d) => (
//                   <SelectItem
//                     key={d.divisionId}
//                     value={d.divisionId.toString()}>
//                     {d.divisionName}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* SELECTION + PREVIEW */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <Card className="xl:col-span-1">
//           <CardHeader>
//             <CardTitle className="flex gap-2 items-center">
//               <User className="w-5 h-5" /> Select Students
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="space-y-3">
//             <div className="flex justify-between">
//               <label className="flex gap-2">
//                 <Checkbox onCheckedChange={selectAll} />
//                 Select All
//               </label>
//               <Badge>{selectedIds.length}</Badge>
//             </div>

//             <div className="max-h-72 overflow-y-auto space-y-1">
//               {filteredStudents.map((s) => (
//                 <label key={s.studentId} className="flex gap-2 p-2">
//                   <Checkbox
//                     checked={selectedIds.includes(s.studentId!)}
//                     onCheckedChange={() => toggleSelect(s.studentId!)}
//                   />
//                   <div>
//                     <p className="text-sm font-medium">{s.fullName}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {s.className} - {s.divisionName}
//                     </p>
//                   </div>
//                 </label>
//               ))}
//             </div>

//             <Button
//               className="w-full"
//               disabled={!selectedIds.length}
//               onClick={handlePrint}>
//               <Printer className="w-4 h-4 mr-2" /> Print
//             </Button>

//             <Button
//               className="w-full"
//               variant="outline"
//               disabled={!selectedIds.length}
//               onClick={handlePrint}>
//               <FileDown className="w-4 h-4 mr-2" /> Save as PDF
//             </Button>
//           </CardContent>
//         </Card>

//         <div className="xl:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex gap-2 items-center">
//                 <CreditCard className="w-5 h-5" /> Preview
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//               {selectedIds.map((id) => {
//                 const student = filteredStudents.find(
//                   (s) => s.studentId === id
//                 );
//                 if (!student) return null;

//                 const school = schools.find(
//                   (sch) => sch.schoolId === student.schoolId
//                 );
//                 if (!school) return null;

//                 return (
//                   <div id={`card-${student.studentId}`} key={id}>
//                     <CompactIDCard student={student} school={school} />
//                   </div>
//                 );
//               })}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================
//    CARD COMPONENT (UNCHANGED)
// ========================= */
// function CompactIDCard({
//   student,
//   school,
// }: {
//   student: Student;
//   school: School;
// }) {
//   return (
//     <div className="rounded-lg overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto">
//       {/* Front Side */}
//       <div className="bg-linear-to-br from-primary to-blue-600 text-white p-2.5">
//         {/* School Header */}
//         <div className="text-center border-b border-white/20 pb-2 mb-2">
//           <div className="w-8 h-8 bg-white rounded-full mx-auto mb-1 flex items-center justify-center">
//             <svg
//               className="w-5 h-5 text-primary"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2">
//               <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//               <path d="M6 12v5c3 3 9 3 12 0v-5" />
//             </svg>
//           </div>
//           <p className="font-bold text-[9px]">{school.schoolName}</p>
//           <p className="text-[6px] opacity-80 tracking-wider">
//             STUDENT IDENTITY CARD
//           </p>
//         </div>

//         {/* Student Photo & Name */}
//         <div className="text-center mb-2">
//           <div className="w-10 h-12 bg-white rounded mx-auto mb-1 overflow-hidden border border-white/30">
//             <img
//               src={
//                 student.photoPath ||
//                 "/placeholder.svg?height=48&width=40&query=student"
//               }
//               alt={student.fullName}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <p className="font-bold text-[11px]">{student.fullName}</p>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-2 gap-1">
//           <div className="bg-white/15 rounded px-1.5 py-1 text-center">
//             <span className="block text-[6px] opacity-75">Class</span>
//             <span className="font-semibold text-[8px]">
//               {student.className}-{student.divisionName}
//             </span>
//           </div>
//           <div className="bg-white/15 rounded px-1.5 py-1 text-center">
//             <span className="block text-[6px] opacity-75">Roll No</span>
//             <span className="font-semibold text-[8px]">{student.rollNo}</span>
//           </div>
//           <div className="bg-white/15 rounded px-1.5 py-1 text-center">
//             <span className="block text-[6px] opacity-75">Blood</span>
//             <span className="font-semibold text-[8px] text-yellow-300">
//               {student.bloodGroup}
//             </span>
//           </div>
//           <div className="bg-white/15 rounded px-1.5 py-1 text-center">
//             <span className="block text-[6px] opacity-75">DOB</span>
//             <span className="font-semibold text-[8px]">
//               {new Date(student.dob).toLocaleDateString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//               })}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Back Side */}
//       <div className="bg-slate-50 p-2.5 text-[8px]">
//         <p className="font-bold text-primary text-[8px] mb-1">
//           {school.schoolName}
//         </p>
//         <p className="text-muted-foreground text-[7px] mb-2 line-clamp-2">
//           {school.schoolAddress}
//         </p>

//         <div className="flex items-center gap-2 py-1.5 border-t border-b border-border mb-1.5">
//           <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0">
//             <svg
//               className="w-5 h-5 text-white"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5">
//               <rect x="3" y="3" width="7" height="7" />
//               <rect x="14" y="3" width="7" height="7" />
//               <rect x="3" y="14" width="7" height="7" />
//               <rect x="14" y="14" width="3" height="3" />
//             </svg>
//           </div>
//           <div className="text-[7px]">
//             <p className="font-semibold text-primary">Emergency</p>
//             <p className="text-foreground">{student.parentName}</p>
//             <p className="text-muted-foreground">{student.emergencyContact}</p>
//           </div>
//         </div>

//         <div className="flex justify-between">
//           <div className="text-center">
//             <div className="w-10 border-b border-primary mb-0.5"></div>
//             <span className="text-[6px] text-muted-foreground">Parent</span>
//           </div>
//           <div className="text-center">
//             <div className="w-10 border-b border-primary mb-0.5"></div>
//             <span className="text-[6px] text-muted-foreground">Principal</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Printer, FileDown, User, CreditCard } from "lucide-react";
import type { Student, School } from "@/lib/types";
import { BASE_URL } from "@/lib/api";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const toBase64 = (url: string): Promise<string> => {
  if (!url) return Promise.resolve("");

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth  || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(""); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch {
        /* canvas tainted (CORS) – fall back to original URL */
        resolve(url);
      }
    };

    img.onerror = () => {
      /* crossOrigin anonymous failed – retry without it (uses src directly) */
      const img2 = new Image();
      img2.onload  = () => resolve(url);
      img2.onerror = () => resolve("");
      img2.src = url + (url.includes("?") ? "&" : "?") + "_nc=" + Date.now();
    };

    img.src = url + (url.includes("?") ? "&" : "?") + "_cb=" + Date.now();
  });
};

const fmtDob = (dob: string) =>
  dob
    ? new Date(dob).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "";

/* ─────────────────────────────────────────────
   Card HTML builder
   Uses ONLY inline styles + solid colours so
   backgrounds always render in print / PDF.
   Each side = 85.6 × 54 mm (CR80 ID-card size)
───────────────────────────────────────────── */
function infoCell(label: string, value: string, valColor = "#ffffff") {
  return `
    <div style="
      background:rgba(255,255,255,0.20);
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      border-radius:1.2mm;padding:1.2mm 2mm;text-align:center;
    ">
      <div style="font-size:5pt;color:rgba(255,255,255,0.78);margin-bottom:0.5mm;">${label}</div>
      <div style="font-size:7.5pt;font-weight:700;color:${valColor};">${value}</div>
    </div>`;
}

function buildCardHtml(s: Student, sch: School, photo: string) {
  const DARK  = "#1e3a8a";   /* dark blue header */
  const MID   = "#1d4ed8";   /* mid blue body    */
  const W = "85.6mm";
  const H = "54mm";

  const cardBox = (content: string, bg: string) => `
    <div style="
      width:${W};min-width:${W};max-width:${W};
      height:${H};min-height:${H};max-height:${H};
      border-radius:3.5mm;overflow:hidden;
      background:${bg};
      -webkit-print-color-adjust:exact;print-color-adjust:exact;color-adjust:exact;
      font-family:Arial,Helvetica,sans-serif;
      box-sizing:border-box;
      display:flex;flex-direction:column;
      page-break-inside:avoid;break-inside:avoid;
    ">${content}</div>`;

  /* ── FRONT ── */
  const front = cardBox(`
    <!-- HEADER -->
    <div style="
      background:${DARK};
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      padding:2.5mm 3mm 2mm;
      display:flex;align-items:center;justify-content:center;gap:2.5mm;
      border-bottom:0.5mm solid rgba(255,255,255,0.22);
    ">
      <div style="
        width:9mm;height:9mm;border-radius:50%;
        background:#ffffff;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
        display:flex;align-items:center;justify-content:center;flex-shrink:0;
      ">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
             stroke="${DARK}" stroke-width="2.2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <div>
        <div style="font-size:7.5pt;font-weight:700;color:#fff;line-height:1.3;">
          ${sch.schoolName}
        </div>
        <div style="font-size:5pt;color:rgba(255,255,255,0.80);letter-spacing:0.7px;">
          STUDENT IDENTITY CARD
        </div>
      </div>
    </div>

    <!-- BODY -->
    <div style="
      background:${MID};
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      flex:1;display:flex;align-items:center;gap:3mm;padding:2.5mm 3mm;
    ">
      <!-- photo -->
      <div style="
        width:15mm;height:19mm;flex-shrink:0;
        border-radius:1.5mm;overflow:hidden;
        background:#ffffff;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
        border:0.6mm solid rgba(255,255,255,0.55);
      ">
        ${photo
          ? `<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
               <svg width="22" height="22" viewBox="0 0 24 24" fill="${DARK}">
                 <circle cx="12" cy="8" r="4"/>
                 <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
               </svg>
             </div>`
        }
      </div>

      <!-- info -->
      <div style="flex:1;">
        <div style="font-size:9.5pt;font-weight:700;color:#fff;margin-bottom:2.5mm;line-height:1.2;">
          ${s.fullName || ""}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5mm;">
          ${infoCell("Class",  `${s.className || ""}&#8209;${s.divisionName || ""}`)}
          ${infoCell("Roll No", String(s.rollNo || ""))}
          ${infoCell("Blood",  s.bloodGroup || "", "#fde047")}
          ${infoCell("DOB",    fmtDob(s.dob))}
        </div>
      </div>
    </div>
  `, MID);

  /* ── BACK ── */
  const back = cardBox(`
    <div style="
      padding:3mm;height:100%;
      background:#f1f5f9;
      -webkit-print-color-adjust:exact;print-color-adjust:exact;
      display:flex;flex-direction:column;
    ">
      <div style="font-size:8.5pt;font-weight:700;color:${DARK};margin-bottom:1mm;">
        ${sch.schoolName}
      </div>
      <div style="
        font-size:6pt;color:#64748b;margin-bottom:2mm;
        overflow:hidden;display:-webkit-box;
        -webkit-line-clamp:2;-webkit-box-orient:vertical;
      ">${sch.schoolAddress || ""}</div>

      <!-- emergency -->
      <div style="
        display:flex;align-items:center;gap:2.5mm;
        padding:2mm 0;
        border-top:0.4mm solid #cbd5e1;
        border-bottom:0.4mm solid #cbd5e1;
        margin-bottom:3mm;
      ">
        <div style="
          width:10mm;height:10mm;flex-shrink:0;border-radius:1.5mm;
          background:${DARK};
          -webkit-print-color-adjust:exact;print-color-adjust:exact;
          display:flex;align-items:center;justify-content:center;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24"
               fill="none" stroke="#fff" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="3" height="3"/>
          </svg>
        </div>
        <div>
          <div style="font-size:6.5pt;font-weight:700;color:${DARK};">Emergency Contact</div>
          <div style="font-size:6pt;color:#1e293b;">${s.parentName || ""}</div>
          <div style="font-size:6pt;color:#64748b;">${s.emergencyContact || ""}</div>
        </div>
      </div>

      <!-- signatures -->
      <div style="display:flex;justify-content:space-between;padding:0 4mm;margin-top:auto;">
        <div style="text-align:center;">
          <div style="width:22mm;border-bottom:0.5mm solid ${DARK};margin-bottom:1.2mm;"></div>
          <div style="font-size:5.5pt;color:#64748b;">Parent Signature</div>
        </div>
        <div style="text-align:center;">
          <div style="width:22mm;border-bottom:0.5mm solid ${DARK};margin-bottom:1.2mm;"></div>
          <div style="font-size:5.5pt;color:#64748b;">Principal Signature</div>
        </div>
      </div>
    </div>
  `, "#f1f5f9");

  return { front, back };
}

/* ─────────────────────────────────────────────
   Print HTML wrapper
───────────────────────────────────────────── */
function buildPrintHtml(cardsHtml: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Student ID Cards</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body{
      background:#fff;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
      color-adjust:exact;
    }
    body{padding:6mm;}
    .grid{display:flex;flex-wrap:wrap;gap:4mm;}
    .pair{display:flex;gap:3mm;page-break-inside:avoid;break-inside:avoid;}
    @page{size:A4 landscape;margin:6mm;}
    @media print{
      body{padding:0;}
      *{
        -webkit-print-color-adjust:exact!important;
        print-color-adjust:exact!important;
        color-adjust:exact!important;
      }
    }
  </style>
</head>
<body onload="setTimeout(()=>window.print(),800)">
  <div class="grid">${cardsHtml}</div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────
   Preview Card – JSX matching the print output
───────────────────────────────────────────── */
function PreviewIDCard({ student, school }: { student: Student; school: School }) {
  const DARK = "#1e3a8a";
  const MID  = "#1d4ed8";

  return (
    <div style={{ fontFamily: "Arial,Helvetica,sans-serif", width: "100%" }}>
      {/* ── Front ── */}
      <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.22)", marginBottom: 8 }}>
        {/* header */}
        <div style={{
          background: DARK, display: "flex", alignItems: "center",
          justifyContent: "center", gap: 8, padding: "8px 10px 7px",
          borderBottom: "1px solid rgba(255,255,255,0.22)",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{school.schoolName}</div>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.80)", letterSpacing: 0.7 }}>STUDENT IDENTITY CARD</div>
          </div>
        </div>

        {/* body */}
        <div style={{
          background: MID, display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
        }}>
          {/* photo */}
          <div style={{
            width: 44, height: 55, flexShrink: 0, borderRadius: 4,
            overflow: "hidden", background: "#fff", border: "2px solid rgba(255,255,255,0.55)",
          }}>
            {student.photoPath
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={student.photoPath} alt={student.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={DARK}>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
            }
          </div>

          {/* info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 6, lineHeight: 1.2 }}>
              {student.fullName}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
              {([
                ["Class",  `${student.className}-${student.divisionName}`, "#fff"],
                ["Roll No", String(student.rollNo || ""), "#fff"],
                ["Blood",  student.bloodGroup || "", "#fde047"],
                ["DOB",    fmtDob(student.dob), "#fff"],
              ] as [string, string, string][]).map(([lbl, val, clr]) => (
                <div key={lbl} style={{
                  background: "rgba(255,255,255,0.20)", borderRadius: 3,
                  padding: "3px 6px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 7, color: "rgba(255,255,255,0.78)", marginBottom: 1 }}>{lbl}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: clr }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Back ── */}
      <div style={{
        borderRadius: 8, overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        background: "#f1f5f9", padding: "8px 10px",
      }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: DARK, marginBottom: 2 }}>{school.schoolName}</div>
        <div style={{
          fontSize: 7, color: "#64748b", marginBottom: 7,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
        }}>{school.schoolAddress}</div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "5px 0", borderTop: "1px solid #cbd5e1", borderBottom: "1px solid #cbd5e1", marginBottom: 8,
        }}>
          <div style={{
            width: 28, height: 28, flexShrink: 0, borderRadius: 4,
            background: DARK, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 7.5, fontWeight: 700, color: DARK }}>Emergency Contact</div>
            <div style={{ fontSize: 7, color: "#1e293b" }}>{student.parentName}</div>
            <div style={{ fontSize: 7, color: "#64748b" }}>{student.emergencyContact}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
          {["Parent Signature", "Principal Signature"].map((lbl) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ width: 62, borderBottom: `1px solid ${DARK}`, marginBottom: 2 }} />
              <div style={{ fontSize: 7, color: "#64748b" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function PrintIDCards() {
  const [schools, setSchools]           = useState<any[]>([]);
  const [years, setYears]               = useState<any[]>([]);
  const [classes, setClasses]           = useState<any[]>([]);
  const [divisions, setDivisions]       = useState<any[]>([]);
  const [students, setStudents]         = useState<Student[]>([]);
  const [filteredStudents, setFiltered] = useState<Student[]>([]);
  const [selectedSchool, setSelSchool]  = useState("all");
  const [selectedYear, setSelYear]      = useState("all");
  const [selectedClass, setSelClass]    = useState("all");
  const [selectedDiv, setSelDiv]        = useState("all");
  const [selectedIds, setSelectedIds]   = useState<number[]>([]);
  const [isPrinting, setIsPrinting]     = useState(false);

  useEffect(() => { loadSchools(); loadStudents(); }, []);

  const loadSchools = async () => {
    const data = await fetch(`${BASE_URL}/School/list`).then((r) => r.json());
    setSchools(data || []);
  };

  const loadStudents = async () => {
    const all: Student[] = await fetch(`${BASE_URL}/Student/getall`).then((r) => r.json());
    const accepted: Student[] = [];
    for (const s of all) {
      if (!s.studentId) continue;
      const apps = await fetch(`${BASE_URL}/Student/applications/student/${s.studentId}`).then((r) => r.json());
      if (apps?.length && apps[0]?.status === "accept") accepted.push(s);
    }
    setStudents(accepted);
    setFiltered(accepted);
    const cls = Array.from(
      new Map(accepted.map((s) => [s.classId, { classId: s.classId, className: s.className }])).values()
    );
    setClasses(cls);
  };

  useEffect(() => {
    if (selectedSchool !== "all") {
      fetch(`${BASE_URL}/School/academicyear/${selectedSchool}`).then((r) => r.json()).then(setYears);
      fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${selectedSchool}`).then((r) => r.json()).then(setClasses);
    } else { setYears([]); setClasses([]); setDivisions([]); }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedClass !== "all") {
      fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${selectedClass}`).then((r) => r.json()).then(setDivisions);
    } else { setDivisions([]); }
  }, [selectedClass]);

  useEffect(() => {
    const data = students.filter((s) => {
      if (selectedSchool !== "all" && s.schoolId?.toString()       !== selectedSchool) return false;
      if (selectedYear   !== "all" && s.academicYearId?.toString() !== selectedYear)   return false;
      if (selectedClass  !== "all" && s.classId?.toString()        !== selectedClass)  return false;
      if (selectedDiv    !== "all" && s.divisionId?.toString()     !== selectedDiv)    return false;
      return true;
    });
    setFiltered(data);
    setSelectedIds([]);
  }, [selectedSchool, selectedYear, selectedClass, selectedDiv, students]);

  const toggle = (id: number) =>
    setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filteredStudents.length ? [] : filteredStudents.map((s) => s.studentId!));

  const handlePrint = async () => {
    const selected = filteredStudents.filter((s) => selectedIds.includes(s.studentId!));
    if (!selected.length) return;
    setIsPrinting(true);
    try {
      const photoMap: Record<number, string> = {};
      await Promise.all(
        selected.map(async (s) => {
          if (s.photoPath) photoMap[s.studentId!] = await toBase64(s.photoPath);
        })
      );
      const cardsHtml = selected.map((s) => {
        const sch = schools.find((sc) => sc.schoolId === s.schoolId);
        if (!sch) return "";
        const { front, back } = buildCardHtml(s, sch, photoMap[s.studentId!] || "");
        return `<div class="pair">${front}${back}</div>`;
      }).join("\n");

      const win = window.open("", "_blank");
      if (!win) { alert("Allow popups for this site to print."); return; }
      win.document.write(buildPrintHtml(cardsHtml));
      win.document.close();
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Print ID Cards" description="Select students and print ID cards" />

      {/* FILTERS */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div>
            <Label>School</Label>
            <Select value={selectedSchool} onValueChange={setSelSchool}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {schools.map((s) => <SelectItem key={s.schoolId} value={s.schoolId.toString()}>{s.schoolName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Academic Year</Label>
            <Select value={selectedYear} onValueChange={setSelYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {years.map((y) => <SelectItem key={y.academicYearId} value={y.academicYearId.toString()}>{y.academicYear}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Class</Label>
            <Select value={selectedClass} onValueChange={setSelClass}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {classes.map((c) => <SelectItem key={c.classId} value={c.classId.toString()}>{c.className}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Division</Label>
            <Select value={selectedDiv} onValueChange={setSelDiv}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {divisions.map((d) => <SelectItem key={d.divisionId} value={d.divisionId.toString()}>{d.divisionName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SELECTION + PREVIEW */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <User className="w-5 h-5" /> Select Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="flex gap-2 items-center cursor-pointer">
                <Checkbox
                  checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                  onCheckedChange={toggleAll}
                />
                Select All
              </label>
              <Badge>{selectedIds.length} selected</Badge>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1">
              {filteredStudents.map((s) => (
                <label key={s.studentId} className="flex gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                  <Checkbox
                    checked={selectedIds.includes(s.studentId!)}
                    onCheckedChange={() => toggle(s.studentId!)}
                  />
                  <div>
                    <p className="text-sm font-medium">{s.fullName}</p>
                    <p className="text-xs text-muted-foreground">{s.className} – {s.divisionName}</p>
                  </div>
                </label>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No students found</p>
              )}
            </div>

            <Button className="w-full" disabled={!selectedIds.length || isPrinting} onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />{isPrinting ? "Preparing…" : "Print"}
            </Button>
            <Button className="w-full" variant="outline" disabled={!selectedIds.length || isPrinting} onClick={handlePrint}>
              <FileDown className="w-4 h-4 mr-2" />{isPrinting ? "Preparing…" : "Save as PDF"}
            </Button>
          </CardContent>
        </Card>

        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <CreditCard className="w-5 h-5" /> Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIds.length === 0
                ? <p className="text-sm text-muted-foreground text-center py-10">Select students to preview their ID cards.</p>
                : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedIds.map((id) => {
                      const student = filteredStudents.find((s) => s.studentId === id);
                      const school  = schools.find((sc) => sc.schoolId === student?.schoolId);
                      if (!student || !school) return null;
                      return <PreviewIDCard key={id} student={student} school={school} />;
                    })}
                  </div>
                )
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}