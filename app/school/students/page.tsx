"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, User, CheckCircle, XCircle, Search } from "lucide-react";

interface School {
  schoolId: number;
  schoolName: string;
}
interface AcademicYear {
  academicYearId: number;
  academicYear: string;
}
interface Class {
  classId: number;
  className: string;
}
interface Division {
  divisionId: number;
  divisionName: string;
  classId: number;
}
interface Student {
  studentId: number;
  fullName: string;
  rollNo: string;
  className: string;
  divisionName: string;
  schoolName: string;
  academicYear: string;
  status: "Pending" | "Approved" | "Rejected";
  photoPath: string;
}

export default function ManageStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);

  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");


  // // Fetch schools
  // useEffect(() => {
  //   fetch("https://localhost:7135/api/School/list")
  //     .then((res) => res.json())
  //     .then(setSchools);
  // }, []);

  // // Fetch academic years when school changes
  // useEffect(() => {
  //   if (selectedSchool !== "all") {
  //     fetch(`https://localhost:7135/api/School/academicyear/${selectedSchool}`)
  //       .then((res) => res.json())
  //       .then((data: AcademicYear[]) => {
  //         setAcademicYears(data);
  //         setSelectedYear("all");
  //       });
  //   } else {
  //     setAcademicYears([]);
  //     setSelectedYear("all");
  //   }
  // }, [selectedSchool]);

  // // Fetch classes when school changes
  // useEffect(() => {
  //   if (selectedSchool !== "all") {
  //     fetch(
  //       `https://localhost:7135/api/ClassDivision/getclasses?schoolId=${selectedSchool}`
  //     )
  //       .then((res) => res.json())
  //       .then((data: Class[]) => {
  //         setClasses(data);
  //         setSelectedClass("all");
  //         setDivisions([]);
  //         setSelectedDivision("all");
  //       });
  //   } else {
  //     setClasses([]);
  //     setSelectedClass("all");
  //     setDivisions([]);
  //     setSelectedDivision("all");
  //   }
  // }, [selectedSchool]);

  // // Fetch divisions when class changes
  // useEffect(() => {
  //   if (selectedClass !== "all") {
  //     fetch(
  //       `https://localhost:7135/api/ClassDivision/getdivisions?classId=${selectedClass}`
  //     )
  //       .then((res) => res.json())
  //       .then((data: Division[]) => {
  //         setDivisions(data);
  //         setSelectedDivision("all");
  //       });
  //   } else {
  //     setDivisions([]);
  //     setSelectedDivision("all");
  //   }
  // }, [selectedClass]);

  // // Fetch students with application status
  // useEffect(() => {
  //   fetch("https://localhost:7135/api/Student/getall")
  //     .then((res) => res.json())
  //     .then(async (data: any) => {
  //       const transformed: Student[] = await Promise.all(
  //         data.map(async (s: any) => {
  //           const appRes = await fetch(
  //             `https://localhost:7135/api/Student/applications/student/${s.studentId}`
  //           );
  //           const appData = await appRes.json();
  //           const status =
  //             appData.length > 0
  //               ? appData[0].status === "accept"
  //                 ? "Approved"
  //                 : appData[0].status === "reject"
  //                 ? "Rejected"
  //                 : "Pending"
  //               : "Pending";
  //           return {
  //             studentId: s.studentId,
  //             fullName: s.fullName,
  //             rollNo: s.rollNo,
  //             className: s.className,
  //             divisionName: s.divisionName,
  //             schoolName: s.schoolName,
  //             academicYear: s.academicYear,
  //             status,
  //             photoPath: s.photoPath,
  //           };
  //         })
  //       );
  //       setStudents(transformed);
  //     });
  // }, []);



  const BASE_URL = "https://localhost:7135/api";

const schoolId =
  typeof window !== "undefined"
    ? Number(localStorage.getItem("schoolId"))
    : null;

// ============================
// FETCH SCHOOL (ONLY LOGGED-IN)
useEffect(() => {
  if (!schoolId) return;

  fetch(`${BASE_URL}/School/list`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data: any[]) => {
      // Filter the school that matches schoolId
      const filteredSchool = data.filter(s => s.schoolId === schoolId);
      setSchools(filteredSchool); // Set only the matched school
      setSelectedSchool(schoolId.toString());
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setSchools([]); // Optional: clear schools on error
    });
}, [schoolId]);

// ============================
// FETCH ACADEMIC YEARS
// ============================
useEffect(() => {
  if (!selectedSchool || selectedSchool === "all") return;

  fetch(`${BASE_URL}/School/academicyear/${selectedSchool}`)
    .then((res) => res.json())
    .then((data: AcademicYear[]) => {
      setAcademicYears(data);
      setSelectedYear("all");
    });
}, [selectedSchool]);

// ============================
// FETCH CLASSES
// ============================
useEffect(() => {
  if (!selectedSchool || selectedSchool === "all") return;

  fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${selectedSchool}`)
    .then((res) => res.json())
    .then((data: Class[]) => {
      setClasses(data);
      setSelectedClass("all");
      setDivisions([]);
      setSelectedDivision("all");
    });
}, [selectedSchool]);

// ============================
// FETCH DIVISIONS
// ============================
useEffect(() => {
  if (selectedClass === "all") return;

  fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${selectedClass}`)
    .then((res) => res.json())
    .then((data: Division[]) => {
      setDivisions(data);
      setSelectedDivision("all");
    });
}, [selectedClass]);

// ============================
// FETCH STUDENTS (FILTERED)
// ============================
useEffect(() => {
  if (!schoolId) return;

  fetch(`${BASE_URL}/Student/getall`)
    .then((res) => res.json())
    .then(async (data: any[]) => {
      // ✅ ONLY THIS SCHOOL'S STUDENTS
      const schoolStudents = data.filter(
        (s) => s.schoolId === schoolId
      );

      const transformed: Student[] = await Promise.all(
        schoolStudents.map(async (s: any) => {
          const appRes = await fetch(
            `${BASE_URL}/Student/applications/student/${s.studentId}`
          );
          const appData = await appRes.json();

          const status =
            appData.length > 0
              ? appData[0].status === "accept"
                ? "Approved"
                : appData[0].status === "reject"
                ? "Rejected"
                : "Pending"
              : "Pending";

          return {
            studentId: s.studentId,
            fullName: s.fullName,
            rollNo: s.rollNo,
            className: s.className,
            divisionName: s.divisionName,
            schoolName: s.schoolName,
            academicYear: s.academicYear,
            status,
            photoPath: s.photoPath,
          };
        })
      );

      setStudents(transformed);
    });
}, [schoolId]);


  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSchool =
      selectedSchool === "all" ||
      s.schoolName ===
        schools.find((sc) => sc.schoolId.toString() === selectedSchool)
          ?.schoolName;
    const matchesYear =
      selectedYear === "all" ||
      s.academicYear ===
        academicYears.find((y) => y.academicYearId.toString() === selectedYear)
          ?.academicYear;
    const matchesClass =
      selectedClass === "all" ||
      s.className ===
        classes.find((c) => c.classId.toString() === selectedClass)?.className;
    const matchesDivision =
      selectedDivision === "all" ||
      s.divisionName ===
        divisions.find((d) => d.divisionId.toString() === selectedDivision)
          ?.divisionName;
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm);
    return (
      matchesSchool &&
      matchesYear &&
      matchesClass &&
      matchesDivision &&
      matchesSearch
    );
  });

  // Approve/Reject student
  const handleApproveReject = (
    student: Student,
    status: "accept" | "reject"
  ) => {
    const encodedRemarks = encodeURIComponent(rejectionReason);

    // Construct the full URL
    const url = `https://localhost:7135/api/Student/applications/update/${student.studentId}?status=${status}&remarks=${encodedRemarks}`;

    fetch(url, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to update: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setStudents((prev) =>
          prev.map((s) =>
            s.studentId === student.studentId
              ? { ...s, status: status === "accept" ? "Approved" : "Rejected" }
              : s
          )
        );
        setSelectedStudent(null);
        setRejectionReason("");
      })
      .catch((err) => {
        console.error("Error updating student application:", err);
      });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Students"
        description="Review, approve, or reject student ID card applications"
      />

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4 flex flex-wrap gap-4">
          {/* School */}
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select School" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools.map((s) => (
                <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
                  {s.schoolName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Academic Year */}
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
            disabled={selectedSchool === "all"}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Academic Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {academicYears.map((y) => (
                <SelectItem
                  key={y.academicYearId}
                  value={y.academicYearId.toString()}>
                  {y.academicYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Class */}
          <Select
            value={selectedClass}
            onValueChange={setSelectedClass}
            disabled={selectedSchool === "all"}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.classId} value={c.classId.toString()}>
                  {c.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Division */}
          <Select
            value={selectedDivision}
            onValueChange={setSelectedDivision}
            disabled={selectedClass === "all"}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {divisions.map((d) => (
                <SelectItem key={d.divisionId} value={d.divisionId.toString()}>
                  {d.divisionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll no"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold">Student</th>
                  <th className="text-left p-4 font-semibold">Roll No</th>
                  <th className="text-left p-4 font-semibold">Class</th>
                  <th className="text-left p-4 font-semibold">School / Year</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.studentId}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{student.rollNo}</td>
                    <td className="p-4">
                      {student.className} - {student.divisionName}
                    </td>
                    <td className="p-4">
                      {student.schoolName} / {student.academicYear}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          student.status === "Approved"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          student.status === "Approved"
                            ? "bg-green-500 hover:bg-green-600"
                            : student.status === "Pending"
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-red-500 hover:bg-red-600"
                        }>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-4 flex gap-1">
                      {student.status === "Pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500"
                          onClick={() => setSelectedStudent(student)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval/Reject Dialog */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review & Approve/Reject Application</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg flex gap-4 items-center">
                <img
                  src={`data:image/jpeg;base64,${selectedStudent.photoPath}`}
                  alt={selectedStudent.fullName}
                  className="w-24 h-24 object-cover rounded-lg border border-border"
                />

                <div className="space-y-1">
                  <p className="font-semibold text-lg">
                    {selectedStudent.fullName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.className} - {selectedStudent.divisionName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.schoolName} /{" "}
                    {selectedStudent.academicYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Roll No: {selectedStudent.rollNo}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Rejection Reason (if rejecting)</Label>
                <Textarea
                  id="reason"
                  placeholder="Provide reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="h-24"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleApproveReject(selectedStudent, "accept")}
                  className="flex-1 bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button
                  onClick={() => handleApproveReject(selectedStudent, "reject")}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
