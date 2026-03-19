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

  // /* ---------------- API LOADERS ---------------- */
  // const loadSchools = async () => {
  //   const data = await fetch(`${BASE_URL}/School/list`).then((res) =>
  //     res.json()
  //   );
  //   setSchools(data || []);
  // };

  // const loadStudents = async () => {
  //   const allStudents: Student[] = await fetch(
  //     `${BASE_URL}/Student/getall`
  //   ).then((res) => res.json());

  //   const accepted: Student[] = [];

  //   for (const s of allStudents) {
  //     if (!s.studentId) continue;

  //     const apps = await fetch(
  //       `${BASE_URL}/Student/applications/student/${s.studentId}`
  //     ).then((res) => res.json());

  //     if (apps?.length && apps[0]?.status === "accept") {
  //       accepted.push(s);
  //     }
  //   }

  //   setStudents(accepted);
  //   setFilteredStudents(accepted);

  //   // derive class list
  //   const cls = Array.from(
  //     new Map(
  //       accepted.map((s) => [
  //         s.classId,
  //         { classId: s.classId, className: s.className },
  //       ])
  //     ).values()
  //   );
  //   setClasses(cls);
  // };


  const schoolId =
  typeof window !== "undefined"
    ? Number(localStorage.getItem("schoolId"))
    : null;

/* ---------------- API LOADERS ---------------- */
const loadSchools = async () => {
  const data = await fetch(`${BASE_URL}/School/list`).then((res) => res.json());
  // Only keep the logged-in school
  const filtered = data?.filter((s: any) => s.schoolId === schoolId) || [];
  setSchools(filtered);
};

const loadStudents = async () => {
  const allStudents: Student[] = await fetch(`${BASE_URL}/Student/getall`).then((res) =>
    res.json()
  );

  const accepted: Student[] = [];

  for (const s of allStudents) {
    if (!s.studentId) continue;
    // Only students from the logged-in school
    if (s.schoolId !== schoolId) continue;

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
  // const handlePrint = () => {
  //   const selected = filteredStudents.filter((s) =>
  //     selectedIds.includes(s.studentId!)
  //   );
  //   if (!selected.length) return;

  //   const win = window.open("", "_blank");
  //   if (!win) return;

  //   // Build HTML for selected students
  //   const cardsHtml = selected
  //     .map((s) => {
  //       const school = schools.find((sch) => sch.schoolId === s.schoolId);
  //       if (!school) return "";
  //       return `<div class="rounded-lg overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto mb-4">
  //               ${document.getElementById(`card-${s.studentId}`)?.innerHTML}
  //             </div>`;
  //     })
  //     .join("");

  //   // Full wrapper with same classes as preview
  //   const fullHtml = `
  //   <html>
  //     <head>
  //       <title>ID Cards</title>
  //       <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
  //       <style>
  //         body { padding: 20px; display: flex; flex-wrap: wrap; gap: 1rem; }
  //         .cards-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  //       </style>
  //     </head>
  //     <body onload="window.print()">
  //       <div class="cards-container">
  //         ${cardsHtml}
  //       </div>
  //     </body>
  //   </html>
  // `;

  //   win.document.write(fullHtml);
  //   win.document.close();
  // };
  const handlePrint = () => {
  const selected = filteredStudents.filter((s) =>
    selectedIds.includes(s.studentId!)
  );
  if (!selected.length) return;

  const win = window.open("", "_blank");
  if (!win) return;

  const buildCardHtml = (s: Student) => {
    const school = schools.find((sch) => sch.schoolId === s.schoolId);
    if (!school) return "";

    const hasFront = !!school.cardTemplateFront;
    const hasBack = !!school.cardTemplateBack;

    const dob = new Date(s.dob).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

    const frontHtml = hasFront
      ? `<div style="position:relative;overflow:hidden;min-height:200px;">
          <img src="data:image/png;base64,${school.cardTemplateFront}"
            style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px;">
            <div style="width:48px;height:56px;border-radius:4px;overflow:hidden;border:2px solid rgba(255,255,255,0.8);margin-top:30px;">
              <img src="${s.photoPath || ''}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <p style="font-weight:bold;font-size:10px;color:#fff;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:2px 0;">
              ${s.fullName}
            </p>
            <p style="font-size:8px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:1px 0;">
              ${s.className}-${s.divisionName} &nbsp;|&nbsp; Roll: ${s.rollNo}
            </p>
            <p style="font-size:8px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:1px 0;">
              DOB: ${dob} &nbsp;|&nbsp; <span style="color:#fde047;">${s.bloodGroup}</span>
            </p>
          </div>
        </div>`
      : `<div style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;padding:10px;">
          <div style="text-align:center;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:6px;margin-bottom:6px;">
            ${school.schoolLogo
              ? `<img src="data:image/png;base64,${school.schoolLogo}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;margin:0 auto 3px;" />`
              : `<div style="width:28px;height:28px;background:#fff;border-radius:50%;margin:0 auto 3px;"></div>`}
            <p style="font-weight:bold;font-size:9px;margin:1px 0;">${school.schoolName}</p>
            <p style="font-size:6px;opacity:0.8;letter-spacing:1px;">STUDENT IDENTITY CARD</p>
          </div>
          <div style="text-align:center;margin-bottom:6px;">
            <div style="width:38px;height:46px;background:#fff;border-radius:3px;overflow:hidden;margin:0 auto 3px;border:1px solid rgba(255,255,255,0.4);">
              <img src="${s.photoPath || ''}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <p style="font-weight:bold;font-size:10px;margin:2px 0;">${s.fullName}</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;">
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">Class</span>
              <span style="font-size:8px;font-weight:600;">${s.className}-${s.divisionName}</span>
            </div>
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">Roll No</span>
              <span style="font-size:8px;font-weight:600;">${s.rollNo}</span>
            </div>
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">Blood</span>
              <span style="font-size:8px;font-weight:600;color:#fde047;">${s.bloodGroup}</span>
            </div>
            <div style="background:rgba(255,255,255,0.15);border-radius:3px;padding:3px;text-align:center;">
              <span style="display:block;font-size:6px;opacity:0.75;">DOB</span>
              <span style="font-size:8px;font-weight:600;">${dob}</span>
            </div>
          </div>
        </div>`;

    const backHtml = hasBack
      ? `<div style="position:relative;overflow:hidden;min-height:120px;">
          <img src="data:image/png;base64,${school.cardTemplateBack}"
            style="width:100%;height:100%;object-fit:cover;display:block;" />
          <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:6px;">
            <p style="font-size:7px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:0 0 2px;">
              Emergency: ${s.parentName} &nbsp; ${s.emergencyContact}
            </p>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;">
              <div style="text-align:center;">
                <div style="width:38px;border-bottom:1px solid rgba(255,255,255,0.8);margin-bottom:2px;"></div>
                <span style="font-size:6px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.8);">Parent</span>
              </div>
              <div style="text-align:center;">
                ${school.principalSignature
                  ? `<img src="data:image/png;base64,${school.principalSignature}" style="height:16px;object-fit:contain;display:block;margin:0 auto 2px;" />`
                  : ""}
                <div style="width:38px;border-bottom:1px solid rgba(255,255,255,0.8);margin-bottom:2px;"></div>
                <span style="font-size:6px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.8);">Principal</span>
              </div>
            </div>
          </div>
        </div>`
      : `<div style="background:#f8fafc;padding:10px;font-size:8px;">
          <p style="font-weight:bold;font-size:8px;color:#1d4ed8;margin:0 0 2px;">${school.schoolName}</p>
          <p style="font-size:7px;color:#64748b;margin:0 0 6px;">${school.schoolAddress}</p>
          <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:4px 0;margin-bottom:6px;">
            <p style="font-size:7px;font-weight:600;color:#1d4ed8;margin:0 0 1px;">Emergency</p>
            <p style="font-size:7px;margin:0 0 1px;">${s.parentName}</p>
            <p style="font-size:7px;color:#64748b;margin:0;">${s.emergencyContact}</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <div style="text-align:center;">
              <div style="width:38px;border-bottom:1px solid #1d4ed8;margin-bottom:2px;"></div>
              <span style="font-size:6px;color:#94a3b8;">Parent</span>
            </div>
            <div style="text-align:center;">
              ${school.principalSignature
                ? `<img src="data:image/png;base64,${school.principalSignature}" style="height:16px;object-fit:contain;display:block;margin:0 auto 2px;" />`
                : ""}
              <div style="width:38px;border-bottom:1px solid #1d4ed8;margin-bottom:2px;"></div>
              <span style="font-size:6px;color:#94a3b8;">Principal</span>
            </div>
          </div>
        </div>`;

    return `
      <div style="width:160px;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);background:#fff;break-inside:avoid;">
        ${frontHtml}
        ${backHtml}
      </div>`;
  };

  const cardsHtml = selected.map(buildCardHtml).join("");

  const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>ID Cards</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { padding: 16px; background: #fff; }
      .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      @media print {
        body { padding: 8px; }
        .cards-container { gap: 8px; }
      }
    </style>
  </head>
  <body>
    <div class="cards-container">
      ${cardsHtml}
    </div>
    <script>
      window.onload = function() {
        // Wait for all images to load before printing
        const images = document.querySelectorAll('img');
        let loaded = 0;
        if (images.length === 0) { window.print(); return; }
        images.forEach(img => {
          if (img.complete) {
            loaded++;
            if (loaded === images.length) window.print();
          } else {
            img.onload = img.onerror = () => {
              loaded++;
              if (loaded === images.length) window.print();
            };
          }
        });
      };
    <\/script>
  </body>
</html>`;

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



function CompactIDCard({
  student,
  school,
}: {
  student: Student;
  school: any;
}) {
  const hasFront = !!school.cardTemplateFront;
  const hasBack = !!school.cardTemplateBack;

  return (
    <div className="overflow-hidden shadow-lg bg-white text-[10px] w-full max-w-50 mx-auto">

      {/* ── FRONT SIDE ── */}
      {hasFront ? (
        // ✅ Template mode — ONLY template image + student data, nothing else
        <div className="relative overflow-hidden" style={{ minHeight: "200px" }}>
          <img
            src={`data:image/png;base64,${school.cardTemplateFront}`}
            className="w-full h-full object-cover"
            alt="Card Front"
            style={{ display: "block" }}
          />
          {/* Student data positioned over template */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
            <div className="w-12 h-14 rounded overflow-hidden border-2 border-white mt-8">
              <img
                src={student.photoPath || "/placeholder.svg?height=56&width=48"}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-bold text-[10px] text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {student.fullName}
            </p>
            <div className="flex gap-2 text-white text-[8px]">
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {student.className}-{student.divisionName}
              </span>
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Roll: {student.rollNo}
              </span>
            </div>
            <div className="flex gap-2 text-white text-[8px]">
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                DOB: {new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
              <span className="text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {student.bloodGroup}
              </span>
            </div>
          </div>
        </div>
      ) : (
        // Fallback — original design when no template
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-2.5">
          <div className="text-center border-b border-white/20 pb-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-full mx-auto mb-1 flex items-center justify-center">
              {school.schoolLogo ? (
                <img src={`data:image/png;base64,${school.schoolLogo}`} className="w-full h-full object-cover rounded-full" alt="Logo" />
              ) : (
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              )}
            </div>
            <p className="font-bold text-[9px]">{school.schoolName}</p>
            <p className="text-[6px] opacity-80 tracking-wider">STUDENT IDENTITY CARD</p>
          </div>
          <div className="text-center mb-2">
            <div className="w-10 h-12 bg-white rounded mx-auto mb-1 overflow-hidden border border-white/30">
              <img src={student.photoPath || "/placeholder.svg?height=48&width=40"} alt={student.fullName} className="w-full h-full object-cover" />
            </div>
            <p className="font-bold text-[11px]">{student.fullName}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-white/15 rounded px-1.5 py-1 text-center">
              <span className="block text-[6px] opacity-75">Class</span>
              <span className="font-semibold text-[8px]">{student.className}-{student.divisionName}</span>
            </div>
            <div className="bg-white/15 rounded px-1.5 py-1 text-center">
              <span className="block text-[6px] opacity-75">Roll No</span>
              <span className="font-semibold text-[8px]">{student.rollNo}</span>
            </div>
            <div className="bg-white/15 rounded px-1.5 py-1 text-center">
              <span className="block text-[6px] opacity-75">Blood</span>
              <span className="font-semibold text-[8px] text-yellow-300">{student.bloodGroup}</span>
            </div>
            <div className="bg-white/15 rounded px-1.5 py-1 text-center">
              <span className="block text-[6px] opacity-75">DOB</span>
              <span className="font-semibold text-[8px]">
                {new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── BACK SIDE ── */}
      {hasBack ? (
        // ✅ Template mode — ONLY template image + emergency data, nothing else
        <div className="relative overflow-hidden" style={{ minHeight: "120px" }}>
          <img
            src={`data:image/png;base64,${school.cardTemplateBack}`}
            className="w-full h-full object-cover"
            alt="Card Back"
            style={{ display: "block" }}
          />
          {/* Only emergency + signatures over template */}
          <div className="absolute inset-0 flex flex-col justify-end p-2 gap-1">
            <div className="text-[7px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              <p className="font-semibold">Emergency: {student.parentName}</p>
              <p>{student.emergencyContact}</p>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="w-10 border-b border-white/70 mb-0.5" />
                <span className="text-[6px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Parent</span>
              </div>
              <div className="text-center">
                {school.principalSignature && (
                  <img
                    src={`data:image/png;base64,${school.principalSignature}`}
                    className="h-4 object-contain mx-auto mb-0.5"
                    alt="Signature"
                  />
                )}
                <div className="w-10 border-b border-white/70 mb-0.5" />
                <span className="text-[6px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Principal</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Fallback — original back design when no template
        <div className="bg-slate-50 p-2.5 text-[8px]">
          <p className="font-bold text-primary text-[8px] mb-1">{school.schoolName}</p>
          <p className="text-muted-foreground text-[7px] mb-2 line-clamp-2">{school.schoolAddress}</p>
          <div className="flex items-center gap-2 py-1.5 border-t border-b border-border mb-1.5">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
              <div className="w-10 border-b border-primary mb-0.5" />
              <span className="text-[6px] text-muted-foreground">Parent</span>
            </div>
            <div className="text-center">
              {school.principalSignature && (
                <img src={`data:image/png;base64,${school.principalSignature}`} className="h-4 object-contain mx-auto mb-0.5" alt="Signature" />
              )}
              <div className="w-10 border-b border-primary mb-0.5" />
              <span className="text-[6px] text-muted-foreground">Principal</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
