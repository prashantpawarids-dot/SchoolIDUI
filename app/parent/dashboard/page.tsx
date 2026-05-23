"use client";
import type React from "react";
import { imgUrl } from "@/lib/image-utils"
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Plus,
  Upload,
  Eye,
  GraduationCap,
  Clock,
  CheckCircle,
  User,
  AlertCircle,
  FileText,
  Cake,
  Home,
} from "lucide-react";

interface ParentStudent {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  dob: string;
  bloodGroup: string;
  classId: number;
  className: string;
  divisionId: number;
  divisionName: string;
  rollNo: string;
  address: string;
  photo: string | null;
  status: "Approved" | "Pending" | "Rejected";
  rejectionReason?: string;
  submittedDate?: string | null;
}

export default function ParentDashboard() {
  const [students, setStudents] = useState<ParentStudent[]>([]);
  const [parentUserId, setParentUserId] = useState<number | null>(null);
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const API_BASE_URL = "/api/proxy";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const school = localStorage.getItem("schoolId");
    if (userId) setParentUserId(Number(userId));
    if (school) setSchoolId(Number(school));
  }, []);

  useEffect(() => {
    if (!schoolId) return;

    const fetchSchool = async () => {
      const res = await fetch(`${API_BASE_URL}/School/list`);
      const schools = await res.json();
      const school = schools.find(
        (s: any) => s.schoolId.toString() === schoolId.toString()
      );
      if (school) {
        setSchoolName(school.schoolName);
        // setSchoolLogo(`data:image/jpeg;base64,${school.schoolLogo}`);
        setSchoolLogo(imgUrl(school.schoolLogo));
      }
    };
    fetchSchool();
  }, [schoolId]);

  useEffect(() => {
    if (!parentUserId) return;

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/Student/getbyparent/${parentUserId}`
          
        );

        // const res = await fetch(`${API_BASE_URL}/Student/getalwithstatus?parentUserId=${parentUserId}`);
        const data = await res.json();

        // const studentsWithStatus: ParentStudent[] = await Promise.all(
        //   data.map(async (student: any) => {
        //     const appRes = await fetch(
        //       `${API_BASE_URL}/Student/applications/student/${student.studentId}`
        //     );
        //     const applications = await appRes.json();
        //     const latestApp = applications[0] || {};

        //     // Normalize backend status
        //     const normalizedStatus =
        //       latestApp.status === "accept"
        //         ? "Approved"
        //         : latestApp.status === "reject"
        //         ? "Rejected"
        //         : "Pending";

        //     return {
        //       id: student.studentId,
        //       firstName: student.firstName,
        //       middleName: student.middleName || "",
        //       lastName: student.lastName,
        //       fullName: `${student.firstName} ${student.middleName || ""} ${
        //         student.lastName
        //       }`.trim(),
        //       dob: student.dob,
        //       bloodGroup: student.bloodGroup,
        //       classId: student.classId,
        //       className: student.className,
        //       divisionId: student.divisionId,
        //       divisionName: student.divisionName,
        //       rollNo: student.rollNo || "",
        //       address: student.address,
        //       photo: student.photoPath || null,
        //       status: normalizedStatus,
        //       rejectionReason: latestApp.remarks || undefined,
        //       submittedDate: latestApp.createdOn || null,
        //     };
        //   })
        // );

        const studentsWithStatus: ParentStudent[] = data.map((student: any) => {
  const normalizedStatus =
    student.applicationStatus === "accept" ? "Approved" :
    student.applicationStatus === "reject" ? "Rejected" : "Pending";

  return {
    id:              student.studentId,
    firstName:       student.firstName,
    middleName:      student.middleName || "",
    lastName:        student.lastName,
    fullName:        `${student.firstName} ${student.middleName || ""} ${student.lastName}`.trim(),
    dob:             student.dob,
    bloodGroup:      student.bloodGroup,
    classId:         student.classId,
    className:       student.className,
    divisionId:      student.divisionId,
    divisionName:    student.divisionName,
    rollNo:          student.rollNo || "",
    address:         student.address,
    photo:           student.photoPath || null,
    status:          normalizedStatus,
    rejectionReason: student.applicationRemarks || undefined,
    submittedDate:   null,
  };
});

setStudents(studentsWithStatus);

        // setStudents(studentsWithStatus);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, [parentUserId]);

  // Recalculate counts after students are fetched
  const approvedCount = students.filter((s) => s.status === "Approved").length;
  const pendingCount = students.filter((s) => s.status === "Pending").length;
  const rejectedCount = students.filter((s) => s.status === "Rejected").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        
        <Card className="shadow-lg border-0 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-green-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-red-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Student list cards */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>My Students</CardTitle>
          <CardDescription>
            List of submitted student ID card applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                  student.status === "Approved"
                    ? "bg-green-50 hover:bg-green-100"
                    : student.status === "Pending"
                    ? "bg-amber-50 hover:bg-amber-100"
                    : "bg-red-50 hover:bg-red-100"
                }`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {student.photo ? (
                      <img
                        // src={
                        //   student.photo
                        //     ? `data:image/jpeg;base64,${student.photo}`
                        //     : undefined
                        // }
                        src={imgUrl(student.photo)}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{student.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.className} - Division {student.divisionName}
                    </p>
                    {student.status === "Rejected" &&
                      student.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1 bg-red-50/50 p-2 rounded border border-red-200">
                          <span className="font-medium">Rejection Reason:</span>{" "}
                          {student.rejectionReason}
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`px-3 py-1 rounded-full text-white font-medium ${
                      student.status === "Approved"
                        ? "bg-green-500 hover:bg-green-600"
                        : student.status === "Pending"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}>
                    {student.status}
                  </Badge>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:bg-gray-100">
                        <Eye className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl rounded-xl p-6 bg-white shadow-xl border border-gray-200">
                      <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-xl text-center font-semibold text-gray-800">
                          Student Application Details
                        </DialogTitle>
                      </DialogHeader>

                      <div className="mt-4">
                        {/* ID Card Design */}
                        <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-xl overflow-hidden">
                          {/* Decorative background pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-400 to-transparent"></div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-800 rounded-tl-full"></div>
                          </div>

                          {/* Content */}
                          <div className="relative z-10 h-full flex flex-col p-6">
                            {/* Header with logo and school name */}
                            <div className="flex items-center gap-3 mb-6">
                              {schoolLogo && (
                                <img
                                  src={schoolLogo}
                                  alt="School Logo"
                                  className="w-12 h-12 rounded-full bg-white p-1"
                                />
                              )}
                              <div className="flex-1">
                                <h2 className="text-white font-bold text-base leading-tight uppercase">
                                  {schoolName || "RISE ABOVE"}
                                </h2>
                                
                              </div>
                            </div>

                            {/* Student Photo */}
                            <div className="flex justify-center mb-4">
                              <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                                {student.photo ? (
                                  <img
                                    // src={`data:image/jpeg;base64,${student.photo}`}
                                    src={imgUrl(student.photo)}
                                    alt={student.fullName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <User className="w-12 h-12 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Student Name */}
                            <div className="text-center mb-6">
                              <h3 className="text-white font-bold text-lg">
                                {student.fullName}
                              </h3>
                              <p className="text-white text-sm">
                                Std. {student.className} | Class: {student.divisionName}
                              </p>
                            </div>

                            {/* Info with Icons */}
                            <div className="space-y-3 text-white text-sm flex-1">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-medium">{student.rollNo || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                  <Cake className="w-4 h-4" />
                                </div>
                                <span>
                                  {new Date(student.dob).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                  <Home className="w-4 h-4" />
                                </div>
                                <span className="flex-1 line-clamp-3 text-xs leading-relaxed">
                                  {student.address}
                                </span>
                              </div>
                            </div>

                            {/* Status Badge at Bottom */}
                            <div className="mt-4 flex justify-center">
                              <Badge
                                className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg ${
                                  student.status === "Approved"
                                    ? "bg-green-500"
                                    : student.status === "Pending"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}>
                                {student.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info Below Card */}
                        {student.status === "Rejected" && student.rejectionReason && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">
                              <span className="font-semibold">Rejection Reason:</span>{" "}
                              {student.rejectionReason}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 text-center text-sm text-gray-600">
                          <p>
                            <span className="font-semibold">Blood Group:</span> {student.bloodGroup}
                          </p>
                          <p className="mt-1">
                            <span className="font-semibold">Submitted:</span>{" "}
                            {student.submittedDate
                              ? new Date(student.submittedDate).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 text-right">
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.querySelector("dialog")?.close()
                          }>
                          Close
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
