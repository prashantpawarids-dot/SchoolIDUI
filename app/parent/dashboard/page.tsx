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
import { useRouter } from "next/navigation"
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
  emergencyContact: string;
  parentName: string;
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
  const [schoolCardTemplate, setSchoolCardTemplate] = useState("");
  const [schoolCardTemplateBack, setSchoolCardTemplateBack] = useState("");
  const [schoolSignature, setSchoolSignature] = useState("");
  const [templateFields, setTemplateFields] = useState<{ front: any[]; back: any[] }>({ front: [], back: [] });
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
        setSchoolLogo(imgUrl(school.schoolLogo));
        setSchoolCardTemplate(school.cardTemplateFront || "");
        setSchoolCardTemplateBack(school.cardTemplateBack || "");
        setSchoolSignature(school.principalSignature || "");

        // Load saved designer field positions
        try {
          const tRes = await fetch(`${API_BASE_URL}/CardTemplate/list?schoolId=${school.schoolId}`);
          const tData = await tRes.json();
          if (tData?.length > 0 && tData[0].templateFieldsJson) {
            const parsed = JSON.parse(tData[0].templateFieldsJson);
            if (parsed?.front) setTemplateFields({ front: parsed.front, back: parsed.back || [] });
          }
        } catch {}
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

       

        const studentsWithStatus: ParentStudent[] = data.map((student: any) => {
  const normalizedStatus =
  ["Approved", "approved", "accept", "Accept"].includes(student.applicationStatus) ? "Approved" :
  ["Rejected", "rejected", "reject"].includes(student.applicationStatus) ? "Rejected" : "Pending";

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
    rollNo:           student.rollNo || "",
    address:          student.address,
    emergencyContact: student.emergencyContact || "",
    parentName:       student.parentName || "",
    photo:            student.photoPath || null,
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

  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">

        
        <Card className="shadow-lg border-0 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">{students.length}</p>
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
              <p className="text-xl md:text-2xl font-bold">{pendingCount}</p>
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
              <p className="text-xl md:text-2xl font-bold">{rejectedCount}</p>
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
                    <Button variant="outline" size="sm"
  onClick={() => router.push(`/parent/edit-student?id=${student.id}`)}>
  Edit
</Button>
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
                        {/* Front + Back side by side with designer field positions */}
                        <div className="flex gap-3 justify-center">

                          {/* FRONT */}
                          <div className="flex-1 max-w-[48%]">
                            <p className="text-xs text-center text-gray-400 mb-1 font-medium">◼ Front</p>
                            <div className="relative rounded-lg overflow-hidden shadow-md" style={{ paddingTop: "158%", backgroundColor: "#d1d5db" }}>
                              <div className="absolute inset-0">
                                {schoolCardTemplate
                                  ? <img src={imgUrl(schoolCardTemplate)} className="absolute inset-0 w-full h-full object-cover" alt="front" />
                                  : <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
                                }
                                {templateFields.front.filter((f: any) => f.visible).map((f: any) => {
                                  const dobFmt = student.dob ? new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";
                                  if (f.isImage) {
                                    let src = "";
                                    if (f.key === "photo")      src = imgUrl(student.photo);
                                    if (f.key === "schoolLogo") src = schoolLogo;
                                    if (!src) return null;
                                    return <img key={f.key} src={src} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%`, width:`${f.width}%`, height:`${f.height}%`, objectFit:"cover", zIndex:1 }} alt="" />;
                                  }
                                  let val = "";
                                  if (f.key === "studentName")   val = student.fullName;
                                  if (f.key === "classDivision") val = `${student.className} - ${student.divisionName}`;
                                  if (f.key === "rollNo")        val = `Roll: ${student.rollNo}`;
                                  if (f.key === "dob")           val = `DOB: ${dobFmt}`;
                                  if (f.key === "bloodGroup")    val = student.bloodGroup;
                                  if (f.key === "address")       val = student.address;
                                  if (!val) return null;
                                  const jMap: any = { left:"flex-start", center:"center", right:"flex-end" };
                                  return <div key={f.key} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%`, width:`${f.width}%`, height:`${f.height}%`, zIndex:1, fontSize:f.fontSize, color:f.fontColor||"#000", fontWeight:f.bold?"bold":"normal", fontStyle:f.italic?"italic":"normal", whiteSpace:"nowrap", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:jMap[f.align||"left"] }}>{val}</div>;
                                })}
                              </div>
                            </div>
                          </div>

                          
                          {/* BACK */}
                          <div className="flex-1 max-w-[48%]">
                            <p className="text-xs text-center text-gray-400 mb-1 font-medium">◻ Back</p>
                            <div className="relative rounded-lg overflow-hidden shadow-md" style={{ paddingTop: "158%", backgroundColor: "#d1d5db" }}>
                              <div className="absolute inset-0">
                                {schoolCardTemplateBack
                                  ? <img src={imgUrl(schoolCardTemplateBack)} className="absolute inset-0 w-full h-full object-cover" alt="back" />
                                  : <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
                                }
                               {templateFields.back.filter((f: any) => f.visible).map((f: any) => {
                                  if (f.isImage) {
                                    let src = "";
                                    if (f.key === "schoolLogo") src = schoolLogo;
                                    if (f.key === "signature")  src = imgUrl(schoolSignature);
                                    if (f.key === "photo")      src = imgUrl(student.photo);
                                    if (!src) return null;
                                    return <img key={f.key} src={src} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%`, width:`${f.width}%`, height:`${f.height}%`, objectFit:"cover", zIndex:1 }} alt="" />;
                                  }
                                  let val = "";
                                  if (f.key === "studentName")   val = student.fullName;
                                  if (f.key === "classDivision") val = `${student.className} - ${student.divisionName}`;
                                  if (f.key === "address")       val = student.address;
                                 if (f.key === "parentContact") val = student.emergencyContact || "";
                                  if (f.key === "parentName")    val = student.parentName || "";
                                  if (!val) return null;
                                  const jMap: any = { left:"flex-start", center:"center", right:"flex-end" };
                                  return <div key={f.key} style={{ position:"absolute", left:`${f.x}%`, top:`${f.y}%`, width:`${f.width}%`, height:`${f.height}%`, zIndex:1, fontSize:f.fontSize, color:f.fontColor||"#000", fontWeight:f.bold?"bold":"normal", fontStyle:f.italic?"italic":"normal", whiteSpace:"nowrap", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:jMap[f.align||"left"] }}>{val}</div>;
                                })}
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Status */}
                        <div className="mt-3 flex justify-center">
                          <Badge className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold ${student.status==="Approved"?"bg-green-500":student.status==="Pending"?"bg-amber-500":"bg-red-500"}`}>
                            {student.status}
                          </Badge>
                        </div>

                        {student.status === "Rejected" && student.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600"><span className="font-semibold">Rejection Reason:</span> {student.rejectionReason}</p>
                          </div>
                        )}

                       
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
