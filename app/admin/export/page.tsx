"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  FileSpreadsheet,
  ImageIcon,
  Archive,
  Download,
  CheckCircle,
  Loader2,
} from "lucide-react";
import JSZip from "jszip";

import type {
  Student,
  School,
  AcademicYear,
  Class,
  Division,
} from "@/lib/types";

type ExportType = "excel" | "photos" | "all";

/* =======================
   EXPORT OPTIONS
======================= */
const exportOptions = [
  {
    type: "excel" as ExportType,
    title: "Export to Excel",
    description: "Download student data as CSV/Excel spreadsheet",
    icon: FileSpreadsheet,
    color: "bg-green-600 hover:bg-green-700",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    type: "photos" as ExportType,
    title: "Export Photos",
    description: "Download all student photos as ZIP archive",
    icon: ImageIcon,
    color: "bg-amber-500 hover:bg-amber-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    type: "all" as ExportType,
    title: "Export All Data",
    description: "Download Excel with photo URLs",
    icon: Archive,
    color: "bg-primary hover:bg-primary/90",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export default function ExportData() {
  /* =======================
     STATE
  ======================= */
  const [schools, setSchools] = useState<School[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentStatuses, setStudentStatuses] = useState<Record<number, string>>({});

  const [selectedSchool, setSelectedSchool] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | string>("all");

  const [exportingType, setExportingType] = useState<ExportType | null>(null);
  const [exportSuccess, setExportSuccess] = useState<ExportType | null>(null);
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_BASE_URL = "/api/proxy";

  /* =======================
     INITIAL LOAD
  ======================= */
  useEffect(() => {
    // Fetch schools
    fetch(`${API_BASE_URL}/School/list`)
      .then((res) => res.json())
      .then(setSchools)
      .catch((err) => console.error("Error fetching schools:", err));

    // Fetch all students
    fetch(`${API_BASE_URL}/Student/getall`)
      .then((res) => res.json())
      .then(async (studentsData: Student[]) => {
        setStudents(studentsData);

        // Fetch statuses for all students
        const statusMap: Record<number, string> = {};

        await Promise.all(
          studentsData.map(async (s: Student) => {
            if (!s.studentId) {
              console.warn("Skipping student with missing studentId:", s);
              return;
            }

            try {
              const res = await fetch(
                `${API_BASE_URL}/Student/applications/student/${s.studentId}`
              );
              if (!res.ok) {
                console.warn("Failed to fetch status for studentId", s.studentId);
                statusMap[s.studentId] = "";
                return;
              }

              const data = await res.json();
              statusMap[s.studentId] = data[0]?.status ?? "";
            } catch (err) {
              console.error("Error fetching status for studentId", s.studentId, err);
              statusMap[s.studentId] = "";
            }
          })
        );

        setStudentStatuses(statusMap);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  /* =======================
     DEPENDENT DROPDOWNS
  ======================= */
  useEffect(() => {
    if (selectedSchool !== "all") {
      fetch(`${API_BASE_URL}/School/academicyear/${selectedSchool}`)
        .then((res) => res.json())
        .then(setAcademicYears);

      fetch(`${API_BASE_URL}/ClassDivision/getclasses?schoolId=${selectedSchool}`)
        .then((res) => res.json())
        .then(setClasses);
    } else {
      setAcademicYears([]);
      setClasses([]);
      setDivisions([]);
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedClass !== "all") {
      fetch(`${API_BASE_URL}/ClassDivision/getdivisions?classId=${selectedClass}`)
        .then((res) => res.json())
        .then(setDivisions);
    } else {
      setDivisions([]);
    }
  }, [selectedClass]);

  const filteredStudents = students.filter((s) => {
    if (selectedSchool !== "all" && s.schoolId?.toString() !== selectedSchool) return false;
    if (selectedYear !== "all" && s.academicYearId?.toString() !== selectedYear) return false;
    if (selectedClass !== "all" && s.classId?.toString() !== selectedClass) return false;
    if (selectedDivision !== "all" && s.divisionId?.toString() !== selectedDivision) return false;

    if (selectedStatus !== "all") {
      const status = studentStatuses[s.studentId]?.toLowerCase() ?? "";
      if (status !== selectedStatus) return false;
    }

    return true;
  });

  /* =======================
     EXPORT HANDLER
  ======================= */
  const handleExport = async (type: ExportType) => {
    setExportingType(type);
    setExportSuccess(null);

    if (type === "excel" || type === "all") {
      const headers = ["Roll No", "Full Name", "Class", "Division", "DOB", "Blood Group", "Address", "Status"];
      const rows = filteredStudents.map((s) => [
        s.rollNo,
        s.fullName,
        s.className,
        s.divisionName,
        s.dob,
        s.bloodGroup,
        `"${s.address}"`,
        studentStatuses[s.studentId] ?? "",
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `students_export_${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    if (type === "photos") {
      const zip = new JSZip();
      filteredStudents.forEach((s) => {
        if (!s.photoPath) return;
        const base64Data = s.photoPath.split(",")[1]; // Remove data:image/...;base64,
        zip.file(`${s.rollNo}_${s.fullName}.jpg`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `student_photos_${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    }

    setExportSuccess(type);
    setTimeout(() => setExportSuccess(null), 3000);
    setExportingType(null);
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6">
      <PageHeader title="Export Student Data" description="Export students using filters and preview before download" />

      {/* FILTERS */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* School */}
          <div>
            <Label>School</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger><SelectValue placeholder="Select School" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {schools.map((s) => (
                  <SelectItem key={s.schoolId} value={s.schoolId.toString()}>{s.schoolName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div>
            <Label>Academic Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {academicYears.map((y) => (
                  <SelectItem key={y.academicYearId} value={y.academicYearId.toString()}>{y.academicYear}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class */}
          <div>
            <Label>Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.classId} value={c.classId.toString()}>{c.className}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Division */}
          <div>
            <Label>Division</Label>
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger><SelectValue placeholder="Select Division" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.divisionId} value={d.divisionId.toString()}>{d.divisionName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
              <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="accept">Accepted</SelectItem>
                <SelectItem value="reject">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* EXPORT OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          const isExporting = exportingType === option.type;
          const isSuccess = exportSuccess === option.type;

          return (
            <Card key={option.type} className="shadow-lg border-0">
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl ${option.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-7 h-7 ${option.iconColor}`} />
                </div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="text-xs mb-3">
                  Exporting <b>{filteredStudents.length}</b> students
                </div>

                <Button
                  onClick={() => handleExport(option.type)}
                  disabled={filteredStudents.length === 0 || isExporting}
                  className={`w-full ${option.color}`}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PREVIEW */}
      <Card>
        <CardHeader>
          <CardTitle>Student Preview</CardTitle>
          <CardDescription>Filtered students</CardDescription>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-2 text-left font-bold">Roll No</th>
                <th className="p-2 text-left font-bold">Student Name</th>
                <th className="p-2 text-left font-bold">Class</th>
                <th className="p-2 text-left font-bold">Division</th>
                <th className="p-2 text-left font-bold">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.slice(0, 10).map((s) => (
                <tr key={s.studentId} className="border-b">
                  <td className="p-2">{s.rollNo}</td>
                  <td className="p-2 font-medium">{s.fullName}</td>
                  <td className="p-2">{s.className}</td>
                  <td className="p-2">{s.divisionName}</td>
                  <td className="p-2 capitalize">{studentStatuses[s.studentId] ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length > 10 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Showing 10 of {filteredStudents.length} students
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
