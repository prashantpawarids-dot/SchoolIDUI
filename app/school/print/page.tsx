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
