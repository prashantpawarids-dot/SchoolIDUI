// "use client";

// import { useState, useRef } from "react";
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
// import { mockStudents, mockClasses, mockSchoolSection } from "@/lib/mock-data";
// import type { Student } from "@/lib/types";

// export default function PrintIDCards() {
//   const [selectedClass, setSelectedClass] = useState<string>("all");
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const printRef = useRef<HTMLDivElement>(null);

//   const filteredStudents =
//     selectedClass === "all"
//       ? mockStudents
//       : mockStudents.filter(
//           (s) => s.classId === Number.parseInt(selectedClass)
//         );

//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const selectAll = () => {
//     if (selectedIds.length === filteredStudents.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(filteredStudents.map((s) => s.id));
//     }
//   };

//   const handlePrint = () => {
//     const selectedStudents = mockStudents.filter((s) =>
//       selectedIds.includes(s.id)
//     );
//     if (selectedStudents.length === 0) return;

//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     const cardsHtml = selectedStudents
//       .map(
//         (student) => `
//       <div class="id-card">
//         <div class="card-front">
//           <div class="school-header">
//             <div class="school-logo">
//               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2">
//                 <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
//               </svg>
//             </div>
//             <div class="school-name">${mockSchoolSection.tenantName}</div>
//             <div class="school-tagline">STUDENT IDENTITY CARD</div>
//           </div>
//           <div class="student-section">
//             <div class="student-photo">
//               <img src="${
//                 student.photo || "/placeholder.svg?height=70&width=56"
//               }" alt="${student.fullName}" />
//             </div>
//             <div class="student-name">${student.fullName}</div>
//           </div>
//           <div class="info-grid">
//             <div class="info-box">
//               <span class="info-label">Class</span>
//               <span class="info-value">${student.className} - ${
//           student.divisionName
//         }</span>
//             </div>
//             <div class="info-box">
//               <span class="info-label">Roll No</span>
//               <span class="info-value">${student.rollNo}</span>
//             </div>
//             <div class="info-box">
//               <span class="info-label">Blood</span>
//               <span class="info-value blood">${student.bloodGroup}</span>
//             </div>
//             <div class="info-box">
//               <span class="info-label">DOB</span>
//               <span class="info-value">${new Date(
//                 student.dob
//               ).toLocaleDateString("en-IN", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })}</span>
//             </div>
//           </div>
//         </div>
//         <div class="card-back">
//           <div class="back-header">${mockSchoolSection.tenantName}</div>
//           <div class="address-info">
//             <div class="info-row">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
//               <span>${mockSchoolSection.tenantAddress}</span>
//             </div>
//             <div class="info-row">
//               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
//               <span>${mockSchoolSection.tenantPhone}</span>
//             </div>
//           </div>
//           <div class="qr-section">
//             <div class="qr-code">
//               <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
//             </div>
//             <div class="emergency-info">
//               <div class="emergency-title">Emergency Contact</div>
//               <div class="emergency-name">${student.parentName}</div>
//               <div class="emergency-phone">${student.emergencyContact}</div>
//             </div>
//           </div>
//           <div class="signature-section">
//             <div class="signature-box"><div class="sig-line"></div><span>Parent</span></div>
//             <div class="signature-box"><div class="sig-line"></div><span>Principal</span></div>
//           </div>
//           <div class="powered-by">ID: ${
//             student.id
//           } | Powered by School ID System</div>
//         </div>
//       </div>
//     `
//       )
//       .join("");

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>ID Cards - ${mockSchoolSection.tenantName}</title>
//           <style>
//             * { margin: 0; padding: 0; box-sizing: border-box; }
//             @page { size: A4; margin: 10mm; }
//             @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
//             body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f0f0; padding: 15px; }
//             .cards-container { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; }

//             .id-card {
//               width: 240px;
//               background: white;
//               border-radius: 10px;
//               overflow: hidden;
//               box-shadow: 0 3px 15px rgba(0,0,0,0.15);
//               page-break-inside: avoid;
//               break-inside: avoid;
//               font-size: 9px;
//             }

//             .card-front {
//               background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
//               color: white;
//               padding: 10px;
//             }

//             .school-header { text-align: center; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; }
//             .school-logo {
//               width: 36px; height: 36px;
//               background: white; border-radius: 50%;
//               margin: 0 auto 4px;
//               display: flex; align-items: center; justify-content: center;
//             }
//             .school-name { font-weight: 700; font-size: 10px; letter-spacing: 0.3px; }
//             .school-tagline { font-size: 7px; opacity: 0.85; margin-top: 2px; letter-spacing: 1px; }

//             .student-section { text-align: center; margin: 8px 0; }
//             .student-photo {
//               width: 56px; height: 70px;
//               background: white; border-radius: 5px;
//               margin: 0 auto 6px; overflow: hidden;
//               border: 2px solid rgba(255,255,255,0.3);
//             }
//             .student-photo img { width: 100%; height: 100%; object-fit: cover; }
//             .student-name { font-size: 12px; font-weight: 700; }

//             .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
//             .info-box {
//               background: rgba(255,255,255,0.12);
//               border-radius: 4px; padding: 5px 6px;
//               text-align: center;
//             }
//             .info-label { display: block; font-size: 7px; opacity: 0.75; margin-bottom: 1px; }
//             .info-value { display: block; font-weight: 600; font-size: 9px; }
//             .info-value.blood { color: #FCD34D; }

//             .card-back { background: #f8fafc; padding: 10px; }
//             .back-header { font-weight: 700; color: #1E3A8A; font-size: 9px; margin-bottom: 6px; }

//             .address-info { margin-bottom: 8px; }
//             .info-row { display: flex; align-items: flex-start; gap: 5px; color: #64748b; margin-bottom: 3px; font-size: 8px; line-height: 1.3; }
//             .info-row svg { flex-shrink: 0; margin-top: 1px; }

//             .qr-section {
//               display: flex; align-items: center; gap: 8px;
//               padding: 8px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;
//               margin-bottom: 8px;
//             }
//             .qr-code {
//               width: 44px; height: 44px;
//               background: #1E3A8A; border-radius: 4px;
//               display: flex; align-items: center; justify-content: center;
//               flex-shrink: 0;
//             }
//             .emergency-info { flex: 1; }
//             .emergency-title { font-weight: 600; color: #1E3A8A; font-size: 8px; }
//             .emergency-name { color: #374151; font-size: 9px; font-weight: 500; }
//             .emergency-phone { color: #64748b; font-size: 8px; }

//             .signature-section { display: flex; justify-content: space-between; gap: 15px; margin-bottom: 8px; }
//             .signature-box { text-align: center; flex: 1; }
//             .sig-line { width: 50px; border-bottom: 1px solid #1E3A8A; margin: 0 auto 3px; }
//             .signature-box span { font-size: 7px; color: #64748b; }

//             .powered-by { text-align: center; font-size: 6px; color: #94a3b8; }
//           </style>
//         </head>
//         <body>
//           <div class="cards-container">${cardsHtml}</div>
//           <script>window.onload = function() { window.print(); }</script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   const handleExportPDF = () => {
//     handlePrint(); // Uses browser's print-to-PDF functionality
//   };

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Print ID Cards"
//         description="Select students and print compact ID cards with QR codes"
//       />

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* Selection Panel */}
//         <Card className="xl:col-span-1 shadow-lg border-0">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg flex items-center gap-2">
//               <User className="w-5 h-5 text-primary" />
//               Select Students
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Class Filter */}
//             <div className="space-y-2">
//               <Label>Filter by Class</Label>
//               <Select
//                 value={selectedClass}
//                 onValueChange={(v) => {
//                   setSelectedClass(v);
//                   setSelectedIds([]);
//                 }}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select class" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Classes</SelectItem>
//                   {mockClasses.map((cls) => (
//                     <SelectItem
//                       key={cls.classId}
//                       value={cls.classId.toString()}>
//                       {cls.className}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Select All */}
//             <div className="flex items-center justify-between py-3 px-3 bg-muted/50 rounded-lg border border-border">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <Checkbox
//                   checked={
//                     selectedIds.length === filteredStudents.length &&
//                     filteredStudents.length > 0
//                   }
//                   onCheckedChange={selectAll}
//                 />
//                 <span className="text-sm font-medium">Select All</span>
//               </label>
//               <Badge variant="secondary" className="bg-primary/10 text-primary">
//                 {selectedIds.length} selected
//               </Badge>
//             </div>

//             {/* Student List */}
//             <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
//               {filteredStudents.map((student) => (
//                 <label
//                   key={student.id}
//                   className={`flex items-center space-x-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
//                     selectedIds.includes(student.id)
//                       ? "bg-primary/10 border border-primary/30"
//                       : "hover:bg-muted border border-transparent"
//                   }`}>
//                   <Checkbox
//                     checked={selectedIds.includes(student.id)}
//                     onCheckedChange={() => toggleSelect(student.id)}
//                   />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">
//                       {student.fullName}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {student.className} - {student.divisionName} | Roll:{" "}
//                       {student.rollNo}
//                     </p>
//                   </div>
//                 </label>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="pt-4 space-y-3 border-t border-border">
//               <Button
//                 className="w-full bg-primary hover:bg-primary/90 h-11 font-medium"
//                 disabled={selectedIds.length === 0}
//                 onClick={handlePrint}>
//                 <Printer className="w-4 h-4 mr-2" />
//                 Print{" "}
//                 {selectedIds.length > 0
//                   ? `${selectedIds.length} Card${
//                       selectedIds.length > 1 ? "s" : ""
//                     }`
//                   : "Selected"}
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-full h-11 bg-transparent"
//                 disabled={selectedIds.length === 0}
//                 onClick={handleExportPDF}>
//                 <FileDown className="w-4 h-4 mr-2" />
//                 Save as PDF
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Preview Panel */}
//         <div className="xl:col-span-2">
//           <Card className="shadow-lg border-0">
//             <CardHeader className="pb-4">
//               <CardTitle className="text-lg flex items-center gap-2">
//                 <CreditCard className="w-5 h-5 text-primary" />
//                 ID Card Preview
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {selectedIds.length === 0 ? (
//                 <div className="h-80 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20">
//                   <CreditCard className="w-16 h-16 text-muted-foreground/30 mb-4" />
//                   <p className="text-muted-foreground text-lg font-medium">
//                     Select students to preview ID cards
//                   </p>
//                   <p className="text-sm text-muted-foreground/60 mt-1">
//                     Choose from the list on the left
//                   </p>
//                 </div>
//               ) : (
//                 <div
//                   ref={printRef}
//                   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {selectedIds.slice(0, 6).map((id) => {
//                     const student = mockStudents.find((s) => s.id === id);
//                     if (!student) return null;
//                     return <CompactIDCard key={id} student={student} />;
//                   })}
//                   {selectedIds.length > 6 && (
//                     <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-xl text-muted-foreground">
//                       +{selectedIds.length - 6} more cards
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// function CompactIDCard({ student }: { student: Student }) {
//   return (
//     <div className="rounded-lg overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-[200px] mx-auto">
//       {/* Front Side */}
//       <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2.5">
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
//           <p className="font-bold text-[9px]">{mockSchoolSection.tenantName}</p>
//           <p className="text-[6px] opacity-80 tracking-wider">
//             STUDENT IDENTITY CARD
//           </p>
//         </div>

//         {/* Student Photo & Name */}
//         <div className="text-center mb-2">
//           <div className="w-10 h-12 bg-white rounded mx-auto mb-1 overflow-hidden border border-white/30">
//             <img
//               src={
//                 student.photo ||
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
//           {mockSchoolSection.tenantName}
//         </p>
//         <p className="text-muted-foreground text-[7px] mb-2 line-clamp-2">
//           {mockSchoolSection.tenantAddress}
//         </p>

//         <div className="flex items-center gap-2 py-1.5 border-t border-b border-border mb-1.5">
//           <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
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

import { useEffect, useRef, useState } from "react";
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
import type {
  Student,
  School,
  AcademicYear,
  Class,
  Division,
} from "@/lib/types";

import { BASE_URL } from "@/lib/api";

/* ======================================================
   PRINT ID CARDS – REAL API + ALL FILTERS
   UI / CARD / DESIGN UNCHANGED
====================================================== */

export default function PrintIDCards() {
  const printRef = useRef<HTMLDivElement>(null);

  /* ---------------- STATE ---------------- */
  const [schools, setSchools] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);

  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const [selectedSchool, setSelectedSchool] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* ---------------- LOAD INITIAL ---------------- */
  useEffect(() => {
    loadSchools();
    loadStudents();
  }, []);

  /* ---------------- API LOADERS ---------------- */
  const loadSchools = async () => {
    const data = await fetch(`${BASE_URL}/School/list`).then((res) =>
      res.json()
    );
    setSchools(data || []);
  };

  const loadStudents = async () => {
    const allStudents: Student[] = await fetch(
      `${BASE_URL}/Student/getall`
    ).then((res) => res.json());

    const accepted: Student[] = [];

    for (const s of allStudents) {
      if (!s.studentId) continue;

      const apps = await fetch(
        `${BASE_URL}/Student/applications/student/${s.studentId}`
      ).then((res) => res.json());

      if (apps?.length && apps[0]?.status === "accept") {
        accepted.push(s);
      }
    }

    setStudents(accepted);
    setFilteredStudents(accepted);

    // derive class list
    const cls = Array.from(
      new Map(
        accepted.map((s) => [
          s.classId,
          { classId: s.classId, className: s.className },
        ])
      ).values()
    );
    setClasses(cls);
  };

  /* ---------------- FILTER DEPENDENCY ---------------- */
  useEffect(() => {
    if (selectedSchool !== "all") {
      fetch(`${BASE_URL}/School/academicyear/${selectedSchool}`)
        .then((res) => res.json())
        .then(setYears);

      fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${selectedSchool}`)
        .then((res) => res.json())
        .then(setClasses);
    } else {
      setYears([]);
      setClasses([]);
      setDivisions([]);
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedClass !== "all") {
      fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${selectedClass}`)
        .then((res) => res.json())
        .then(setDivisions);
    } else {
      setDivisions([]);
    }
  }, [selectedClass]);

  /* ---------------- APPLY FILTER ---------------- */
  useEffect(() => {
    const data = students.filter((s) => {
      if (selectedSchool !== "all" && s.schoolId?.toString() !== selectedSchool)
        return false;
      if (
        selectedYear !== "all" &&
        s.academicYearId?.toString() !== selectedYear
      )
        return false;
      if (selectedClass !== "all" && s.classId?.toString() !== selectedClass)
        return false;
      if (
        selectedDivision !== "all" &&
        s.divisionId?.toString() !== selectedDivision
      )
        return false;
      return true;
    });

    setFilteredStudents(data);
    setSelectedIds([]);
  }, [selectedSchool, selectedYear, selectedClass, selectedDivision, students]);

  /* ---------------- SELECTION ---------------- */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.studentId!));
    }
  };

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    const selected = filteredStudents.filter((s) =>
      selectedIds.includes(s.studentId!)
    );
    if (!selected.length) return;

    const win = window.open("", "_blank");
    if (!win) return;

    // Build HTML for selected students
    const cardsHtml = selected
      .map((s) => {
        const school = schools.find((sch) => sch.schoolId === s.schoolId);
        if (!school) return "";
        return `<div class="rounded-lg overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto mb-4">
                ${document.getElementById(`card-${s.studentId}`)?.innerHTML}
              </div>`;
      })
      .join("");

    // Full wrapper with same classes as preview
    const fullHtml = `
    <html>
      <head>
        <title>ID Cards</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { padding: 20px; display: flex; flex-wrap: wrap; gap: 1rem; }
          .cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        </style>
      </head>
      <body onload="window.print()">
        <div class="cards-container">
          ${cardsHtml}
        </div>
      </body>
    </html>
  `;

    win.document.write(fullHtml);
    win.document.close();
  };

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="space-y-6">
      <PageHeader
        title="Print ID Cards"
        description="Select students and print ID cards"
      />

      {/* FILTERS */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>School</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {schools.map((s) => (
                  <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
                    {s.schoolName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Academic Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {years.map((y) => (
                  <SelectItem
                    key={y.academicYearId}
                    value={y.academicYearId.toString()}>
                    {y.academicYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.classId} value={c.classId.toString()}>
                    {c.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Division</Label>
            <Select
              value={selectedDivision}
              onValueChange={setSelectedDivision}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {divisions.map((d) => (
                  <SelectItem
                    key={d.divisionId}
                    value={d.divisionId.toString()}>
                    {d.divisionName}
                  </SelectItem>
                ))}
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
            <div className="flex justify-between">
              <label className="flex gap-2">
                <Checkbox onCheckedChange={selectAll} />
                Select All
              </label>
              <Badge>{selectedIds.length}</Badge>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1">
              {filteredStudents.map((s) => (
                <label key={s.studentId} className="flex gap-2 p-2">
                  <Checkbox
                    checked={selectedIds.includes(s.studentId!)}
                    onCheckedChange={() => toggleSelect(s.studentId!)}
                  />
                  <div>
                    <p className="text-sm font-medium">{s.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.className} - {s.divisionName}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <Button
              className="w-full"
              disabled={!selectedIds.length}
              onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" /> Print
            </Button>

            <Button
              className="w-full"
              variant="outline"
              disabled={!selectedIds.length}
              onClick={handlePrint}>
              <FileDown className="w-4 h-4 mr-2" /> Save as PDF
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

            <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedIds.map((id) => {
                const student = filteredStudents.find(
                  (s) => s.studentId === id
                );
                if (!student) return null;

                const school = schools.find(
                  (sch) => sch.schoolId === student.schoolId
                );
                if (!school) return null;

                return (
                  <div id={`card-${student.studentId}`} key={id}>
                    <CompactIDCard student={student} school={school} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================
   CARD COMPONENT (UNCHANGED)
========================= */
function CompactIDCard({
  student,
  school,
}: {
  student: Student;
  school: School;
}) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto">
      {/* Front Side */}
      <div className="bg-linear-to-br from-primary to-blue-600 text-white p-2.5">
        {/* School Header */}
        <div className="text-center border-b border-white/20 pb-2 mb-2">
          <div className="w-8 h-8 bg-white rounded-full mx-auto mb-1 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <p className="font-bold text-[9px]">{school.schoolName}</p>
          <p className="text-[6px] opacity-80 tracking-wider">
            STUDENT IDENTITY CARD
          </p>
        </div>

        {/* Student Photo & Name */}
        <div className="text-center mb-2">
          <div className="w-10 h-12 bg-white rounded mx-auto mb-1 overflow-hidden border border-white/30">
            <img
              src={
                student.photoPath ||
                "/placeholder.svg?height=48&width=40&query=student"
              }
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-bold text-[11px]">{student.fullName}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-white/15 rounded px-1.5 py-1 text-center">
            <span className="block text-[6px] opacity-75">Class</span>
            <span className="font-semibold text-[8px]">
              {student.className}-{student.divisionName}
            </span>
          </div>
          <div className="bg-white/15 rounded px-1.5 py-1 text-center">
            <span className="block text-[6px] opacity-75">Roll No</span>
            <span className="font-semibold text-[8px]">{student.rollNo}</span>
          </div>
          <div className="bg-white/15 rounded px-1.5 py-1 text-center">
            <span className="block text-[6px] opacity-75">Blood</span>
            <span className="font-semibold text-[8px] text-yellow-300">
              {student.bloodGroup}
            </span>
          </div>
          <div className="bg-white/15 rounded px-1.5 py-1 text-center">
            <span className="block text-[6px] opacity-75">DOB</span>
            <span className="font-semibold text-[8px]">
              {new Date(student.dob).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div className="bg-slate-50 p-2.5 text-[8px]">
        <p className="font-bold text-primary text-[8px] mb-1">
          {school.schoolName}
        </p>
        <p className="text-muted-foreground text-[7px] mb-2 line-clamp-2">
          {school.schoolAddress}
        </p>

        <div className="flex items-center gap-2 py-1.5 border-t border-b border-border mb-1.5">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
            </svg>
          </div>
          <div className="text-[7px]">
            <p className="font-semibold text-primary">Emergency</p>
            <p className="text-foreground">{student.parentName}</p>
            <p className="text-muted-foreground">{student.emergencyContact}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-center">
            <div className="w-10 border-b border-primary mb-0.5"></div>
            <span className="text-[6px] text-muted-foreground">Parent</span>
          </div>
          <div className="text-center">
            <div className="w-10 border-b border-primary mb-0.5"></div>
            <span className="text-[6px] text-muted-foreground">Principal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
