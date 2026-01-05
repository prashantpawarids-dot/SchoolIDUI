"use client";

import type React from "react";
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
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL = "/api/proxy";

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const school = localStorage.getItem("schoolId");
    if (userId) setParentUserId(Number(userId));
    if (school) setSchoolId(Number(school));
  }, []);

  useEffect(() => {
    if (!parentUserId) return;

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/Student/getbyparent/${parentUserId}`
        );
        const data = await res.json();

        const studentsWithStatus: ParentStudent[] = await Promise.all(
          data.map(async (student: any) => {
            const appRes = await fetch(
              `${API_BASE_URL}/Student/applications/student/${student.studentId}`
            );
            const applications = await appRes.json();
            const latestApp = applications[0] || {};

            // Normalize backend status
            const normalizedStatus =
              latestApp.status === "accept"
                ? "Approved"
                : latestApp.status === "reject"
                ? "Rejected"
                : "Pending";

            return {
              id: student.studentId,
              firstName: student.firstName,
              middleName: student.middleName || "",
              lastName: student.lastName,
              fullName: `${student.firstName} ${student.middleName || ""} ${
                student.lastName
              }`.trim(),
              dob: student.dob,
              bloodGroup: student.bloodGroup,
              classId: student.classId,
              className: student.className,
              divisionId: student.divisionId,
              divisionName: student.divisionName,
              address: student.address,
              photo: student.photoPath || null,
              status: normalizedStatus,
              rejectionReason: latestApp.remarks || undefined,
              submittedDate: latestApp.createdOn || null,
            };
          })
        );

        setStudents(studentsWithStatus);
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
                        src={
                          student.photo
                            ? `data:image/jpeg;base64,${student.photo}`
                            : undefined
                        }
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
                    <DialogContent className="max-w-lg rounded-xl p-6 bg-white shadow-xl border border-gray-200">
                      <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-xl text-center font-semibold text-gray-800">
                          Student Application Details
                        </DialogTitle>
                      </DialogHeader>

                      <Card className="mt-4 shadow-none border-0">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                              {student.photo ? (
                                <img
                                  src={
                                    student.photo
                                      ? `data:image/jpeg;base64,${student.photo}`
                                      : undefined
                                  }
                                  alt={student.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-12 h-12 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Full Name:
                                </span>{" "}
                                {student.fullName}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  First Name:
                                </span>{" "}
                                {student.firstName}
                              </p>
                              {student.middleName && (
                                <p>
                                  <span className="font-semibold text-gray-700">
                                    Middle Name:
                                  </span>{" "}
                                  {student.middleName}
                                </p>
                              )}
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Last Name:
                                </span>{" "}
                                {student.lastName}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Date of Birth:
                                </span>{" "}
                                {new Date(student.dob).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Blood Group:
                                </span>{" "}
                                {student.bloodGroup}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Class:
                                </span>{" "}
                                {student.className}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Division:
                                </span>{" "}
                                {student.divisionName}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Address:
                                </span>{" "}
                                {student.address}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Submitted Date:
                                </span>{" "}
                                {student.submittedDate
                                  ? new Date(
                                      student.submittedDate
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-700">
                                  Status:
                                </span>
                                <Badge
                                  className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${
                                    student.status === "Approved"
                                      ? "bg-green-500"
                                      : student.status === "Pending"
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  }`}>
                                  {student.status}
                                </Badge>
                              </p>
                              {student.status === "Rejected" &&
                                student.rejectionReason && (
                                  <p className="text-sm text-red-600 mt-1">
                                    <span className="font-medium">
                                      Rejection Reason:
                                    </span>{" "}
                                    {student.rejectionReason}
                                  </p>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

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
