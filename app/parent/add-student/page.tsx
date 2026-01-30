// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { PageHeader } from "@/components/common/page-header";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ArrowLeft, Upload, CheckCircle, Camera } from "lucide-react";
// import Link from "next/link";
// import Cropper from "react-easy-crop";
// import getCroppedImg from "@/utils/cropImage";

// export default function AddStudentPage() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [showCropper, setShowCropper] = useState(false);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

//   const [academicYears, setAcademicYears] = useState<any[]>([]);
//   const [classes, setClasses] = useState<any[]>([]);
//   const [divisions, setDivisions] = useState<any[]>([]);
//   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
// // const BASE_URL = "/api/proxy";
//   const [formData, setFormData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     dob: "",
//     bloodGroup: "",
//     rollNo: "",
//     academicYearId: "",
//     classId: "",
//     divisionId: "",
//     address: "",
//   });

//   const fullName =
//     `${formData.firstName} ${formData.middleName} ${formData.lastName}`
//       .trim()
//       .replace(/\s+/g, " ");



// useEffect(() => {
//   const schoolId = localStorage.getItem("schoolId");
//   if (!schoolId) {
//     console.error("schoolId not found in localStorage");
//     return;
//   }

//   const fetchAcademicYears = async () => {
//     const res = await fetch(`${BASE_URL}/School/academicyear/${schoolId}`);
//     const data = await res.json();
//     setAcademicYears(data);
//   };

//   const fetchClasses = async () => {
//     const res = await fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${schoolId}`);
//     const data = await res.json();
//     setClasses(data);
//   };

//   fetchAcademicYears();
//   fetchClasses();
// }, []);

// useEffect(() => {
//   const fetchDivisions = async () => {
//     const res = await fetch(`${BASE_URL}/ClassDivision/getdivisions`);
//     const data = await res.json();
//     setDivisions(data); // store all divisions
//   };

//   fetchDivisions();
// }, []);

// const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (file) {
//     setSelectedFile(file);
//     setShowCropper(true);
//   }
// };

//   const onCapture = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     const video = document.createElement("video");
//     video.srcObject = stream;
//     video.play();

//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     await new Promise((resolve) => setTimeout(resolve, 500)); // wait video

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataUrl = canvas.toDataURL("image/jpeg");
//     setPhotoPreview(dataUrl);
//     stream.getTracks().forEach((track) => track.stop());
//     setSelectedFile(null);
//   };

//   const onCropComplete = useCallback(
//     (croppedArea: any, croppedAreaPixels: any) => {
//       setCroppedAreaPixels(croppedAreaPixels);
//     },
//     []
//   );

//   const showCroppedImage = useCallback(async () => {
//     if (!selectedFile && !photoPreview) return;

//     const imageSrc = selectedFile
//       ? URL.createObjectURL(selectedFile)
//       : photoPreview;
//     const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels);
//     setPhotoPreview(croppedImage);
//     setShowCropper(false);
//     setSelectedFile(null);
//   }, [selectedFile, croppedAreaPixels, photoPreview]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const parentUserId = Number(localStorage.getItem("userId"));
//     const schoolId = Number(localStorage.getItem("schoolId"));

//     const base64Photo = photoPreview ? photoPreview.split(",")[1] : "";

//     const payload = {
//       parentUserId,
//       schoolId,
//       academicYearId: Number(formData.academicYearId),
//       classId: Number(formData.classId),
//       divisionId: Number(formData.divisionId),
//       firstName: formData.firstName,
//       middleName: formData.middleName,
//       lastName: formData.lastName,
//       rollNo: formData.rollNo,
//       dob: formData.dob, // send as string in ISO format
//       bloodGroup: formData.bloodGroup,
//       address: formData.address,
//       photoPath: base64Photo, // <-- just the base64, no data:image prefix
//     };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/Student/add`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to submit");
//       setIsSuccess(true);
//       setTimeout(() => router.push("/parent/dashboard"), 2000);
//     } catch (err: any) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isSuccess) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <Card className="w-full max-w-md shadow-lg border-0 text-center p-8">
//           <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
//           <p className="text-muted-foreground mb-4">
//             Your student ID card application has been submitted successfully and
//             is pending approval.
//           </p>
//           <p className="text-sm text-muted-foreground">
//             Redirecting to dashboard...
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Add Student ID Card"
//         description="Fill in the details to apply for a new student ID card"
//         action={
//           <Link href="/parent/dashboard">
//             <Button variant="outline">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Dashboard
//             </Button>
//           </Link>
//         }
//       />

//       <Card className="shadow-lg border-0 max-w-3xl">
//         <CardHeader>
//           <CardTitle>Student Information</CardTitle>
//           <CardDescription>
//             Please provide accurate information for the ID card
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Photo Upload & Capture */}
//             <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-border">
//               <div className="flex-shrink-0">
//                 <Label className="flex items-center gap-1">
//                   Student Photo <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="w-32 h-40 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
//                   {photoPreview ? (
//                     <img
//                       src={photoPreview}
//                       alt="Preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="text-center p-2">
//                       <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-1" />
//                       <p className="text-xs text-muted-foreground">
//                         Upload Photo
//                       </p>
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex gap-2 mt-2">
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={onSelectFile}
//                     className="w-50 text-xs"
//                   />
//                   <Button
//                     type="button"
//                     onClick={onCapture}
//                     className="flex-1 h-8 flex items-center justify-center gap-1 text-xs">
//                     <Camera className="w-4 h-4" /> Capture
//                   </Button>
//                 </div>
//               </div>

//               {/* Student Names */}
//               <div className="flex-1 space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="space-y-2">
//                     <Label>
//                       First Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       value={formData.firstName}
//                       onChange={(e) =>
//                         setFormData({ ...formData, firstName: e.target.value })
//                       }
//                       required
//                       className="h-11"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>
//                       Middle Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       value={formData.middleName}
//                       onChange={(e) =>
//                         setFormData({ ...formData, middleName: e.target.value })
//                       }
//                       required
//                       className="h-11"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label>
//                       Last Name <span className="text-red-500">*</span>
//                     </Label>
//                     <Input
//                       value={formData.lastName}
//                       onChange={(e) =>
//                         setFormData({ ...formData, lastName: e.target.value })
//                       }
//                       required
//                       className="h-11"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Full Name</Label>
//                   <Input
//                     value={fullName || "—"}
//                     disabled
//                     className="bg-muted h-11"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Cropper Modal */}
//             {showCropper && (
//               <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
//                 <div className="relative w-full max-w-lg h-96 bg-white rounded-lg overflow-hidden">
//                   <Cropper
//                     image={
//                       selectedFile
//                         ? URL.createObjectURL(selectedFile)
//                         : photoPreview!
//                     }
//                     crop={crop}
//                     zoom={zoom}
//                     aspect={4 / 5}
//                     onCropChange={setCrop}
//                     onZoomChange={setZoom}
//                     onCropComplete={onCropComplete}
//                   />
//                   <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
//                     <Button onClick={showCroppedImage}>Save Crop</Button>
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowCropper(false)}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {/* Personal Details */}
//             <CardHeader>
//               <CardTitle>Personal Details</CardTitle>
//             </CardHeader>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label className="flex items-center gap-1 justify-start">
//                   Date of Birth <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   type="date"
//                   value={formData.dob}
//                   onChange={(e) =>
//                     setFormData({ ...formData, dob: e.target.value })
//                   }
//                   required
//                   className="h-11"
//                 />
//               </div>
//               <div className="space-y-2 w-full">
//                 <Label className="flex items-center gap-1 justify-start">
//                   Blood Group <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.bloodGroup}
//                   onValueChange={(val) =>
//                     setFormData({ ...formData, bloodGroup: val })
//                   }
//                   required>
//                   {/* Force the height with inline style and width full */}
//                   <SelectTrigger
//                     style={{ height: "2.75rem" }}
//                     className="w-full">
//                     <SelectValue placeholder="Select blood group" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
//                       (bg) => (
//                         <SelectItem key={bg} value={bg}>
//                           {bg}
//                         </SelectItem>
//                       )
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label className="flex items-center gap-1 justify-start">
//                   Roll No <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   placeholder="Enter roll number"
//                   value={formData.rollNo}
//                   onChange={(e) =>
//                     setFormData({ ...formData, rollNo: e.target.value })
//                   }
//                   required
//                   className="h-11"
//                 />
//               </div>
//             </div>

//             {/* Educational Details */}
//             <CardHeader>
//               <CardTitle>Educational Details</CardTitle>
//             </CardHeader>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Academic Year */}
//               <div className="space-y-2 w-full">
//                 <Label className="flex items-center gap-1 justify-start">
//                   Academic Year <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.academicYearId}
//                   onValueChange={(val) =>
//                     setFormData({ ...formData, academicYearId: val })
//                   }
//                   required>
//                   <SelectTrigger
//                     style={{ height: "2.75rem" }}
//                     className="w-full">
//                     <SelectValue placeholder="Select year" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {academicYears.map((year: any) => (
//                       <SelectItem
//                         key={year.academicYearId}
//                         value={year.academicYearId.toString()}>
//                         {year.academicYear}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Class */}
//               <div className="space-y-2 w-full">
//                 <Label className="flex items-center gap-1 justify-start">
//                   Class <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.classId}
//                   onValueChange={(val) =>
//                     setFormData({ ...formData, classId: val, divisionId: "" })
//                   }
//                   required>
//                   <SelectTrigger
//                     style={{ height: "2.75rem" }}
//                     className="w-full">
//                     <SelectValue placeholder="Select class" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {classes
//                       .filter(
//                         (cls: any) =>
//                           cls.schoolId ===
//                           Number(localStorage.getItem("schoolId"))
//                       )
//                       .map((cls: any) => (
//                         <SelectItem
//                           key={cls.classId}
//                           value={cls.classId.toString()}>
//                           {cls.className}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Division */}
//               <div className="space-y-2 w-full">
//                 <Label className="flex items-center gap-1 justify-start">
//                   Division <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.divisionId}
//                   onValueChange={(val) =>
//                     setFormData({ ...formData, divisionId: val })
//                   }
//                   disabled={!formData.classId}
//                   required>
//                   <SelectTrigger
//                     style={{ height: "2.75rem" }}
//                     className="w-full">
//                     <SelectValue
//                       placeholder={
//                         formData.classId
//                           ? "Select division"
//                           : "Select class first"
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {divisions
//                       .filter((div) => div.classId === Number(formData.classId)) // <-- FILTER HERE
//                       .map((div) => (
//                         <SelectItem
//                           key={div.divisionId}
//                           value={div.divisionId.toString()}>
//                           {div.divisionName}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Address */}
//             <div className="space-y-2">
//               <Label className="flex items-center gap-1 justify-start">
//                 Address <span className="text-red-500">*</span>
//               </Label>
//               <Textarea
//                 placeholder="Enter complete residential address"
//                 value={formData.address}
//                 onChange={(e) =>
//                   setFormData({ ...formData, address: e.target.value })
//                 }
//                 rows={3}
//                 className="h-24"
//                 required
//               />
//             </div>

//             {/* Submit */}
//             <div className="flex gap-4 pt-4">
//               <Button
//                 type="submit"
//                 className="flex-1 h-11"
//                 disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting..." : "Submit Application"}
//               </Button>
//               <Link href="/parent/dashboard">
//                 <Button type="button" variant="outline" className="h-11">
//                   Cancel
//                 </Button>
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


//new code for card preview

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, CheckCircle, Camera, FileText, Cake, Home } from "lucide-react";
import Link from "next/link";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";

export default function AddStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  // const BASE_URL = "/api/proxy";
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    bloodGroup: "",
    rollNo: "",
    academicYearId: "",
    classId: "",
    divisionId: "",
    address: "",
  });

  const fullName =
    `${formData.firstName} ${formData.middleName} ${formData.lastName}`
      .trim()
      .replace(/\s+/g, " ");

  // Get selected class and division names for display
  const selectedClassName = classes.find(
    (cls) => cls.classId.toString() === formData.classId
  )?.className || "";
  
  const selectedDivisionName = divisions.find(
    (div) => div.divisionId.toString() === formData.divisionId
  )?.divisionName || "";

  useEffect(() => {
    const schoolId = localStorage.getItem("schoolId");
    if (!schoolId) {
      console.error("schoolId not found in localStorage");
      return;
    }

    const fetchSchool = async () => {
      const res = await fetch(`${BASE_URL}/School/list`);
      const schools = await res.json();
      const school = schools.find(
        (s: any) => s.schoolId.toString() === schoolId
      );
      if (school) {
        setSchoolName(school.schoolName);
        setSchoolLogo(`data:image/jpeg;base64,${school.schoolLogo}`);
      }
    };

    const fetchAcademicYears = async () => {
      const res = await fetch(`${BASE_URL}/School/academicyear/${schoolId}`);
      const data = await res.json();
      setAcademicYears(data);
    };

    const fetchClasses = async () => {
      const res = await fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${schoolId}`);
      const data = await res.json();
      setClasses(data);
    };

    fetchSchool();
    fetchAcademicYears();
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchDivisions = async () => {
      const res = await fetch(`${BASE_URL}/ClassDivision/getdivisions`);
      const data = await res.json();
      setDivisions(data);
    };

    fetchDivisions();
  }, []);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowCropper(true);
    }
  };

  const onCapture = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhotoPreview(dataUrl);
    stream.getTracks().forEach((track) => track.stop());
    setSelectedFile(null);
  };

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    if (!selectedFile && !photoPreview) return;

    const imageSrc = selectedFile
      ? URL.createObjectURL(selectedFile)
      : photoPreview;
    const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels);
    setPhotoPreview(croppedImage);
    setShowCropper(false);
    setSelectedFile(null);
  }, [selectedFile, croppedAreaPixels, photoPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parentUserId = Number(localStorage.getItem("userId"));
    const schoolId = Number(localStorage.getItem("schoolId"));

    const base64Photo = photoPreview ? photoPreview.split(",")[1] : "";

    const payload = {
      parentUserId,
      schoolId,
      academicYearId: Number(formData.academicYearId),
      classId: Number(formData.classId),
      divisionId: Number(formData.divisionId),
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      rollNo: formData.rollNo,
      dob: formData.dob,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      photoPath: base64Photo,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Student/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to submit");
      setIsSuccess(true);
      setTimeout(() => router.push("/parent/dashboard"), 2000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg border-0 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your student ID card application has been submitted successfully and
            is pending approval.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Student ID Card"
        description="Fill in the details to apply for a new student ID card"
        action={
          <Link href="/parent/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>
                Please provide accurate information for the ID card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload & Capture */}
                <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-border">
                  <div className="flex-shrink-0">
                    <Label className="flex items-center gap-1">
                      Student Photo <span className="text-red-500">*</span>
                    </Label>
                    <div className="w-32 h-40 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-1" />
                          <p className="text-xs text-muted-foreground">
                            Upload Photo
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                        className="w-50 text-xs"
                      />
                      <Button
                        type="button"
                        onClick={onCapture}
                        className="flex-1 h-8 flex items-center justify-center gap-1 text-xs">
                        <Camera className="w-4 h-4" /> Capture
                      </Button>
                    </div>
                  </div>

                  {/* Student Names */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Middle Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={formData.middleName}
                          onChange={(e) =>
                            setFormData({ ...formData, middleName: e.target.value })
                          }
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={fullName || "—"}
                        disabled
                        className="bg-muted h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Cropper Modal */}
                {showCropper && (
                  <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-lg h-96 bg-white rounded-lg overflow-hidden">
                      <Cropper
                        image={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : photoPreview!
                        }
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 5}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                        <Button onClick={showCroppedImage}>Save Crop</Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCropper(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Personal Details */}
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 justify-start">
                      Date of Birth <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2 w-full">
                    <Label className="flex items-center gap-1 justify-start">
                      Blood Group <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(val) =>
                        setFormData({ ...formData, bloodGroup: val })
                      }
                      required>
                      <SelectTrigger
                        style={{ height: "2.75rem" }}
                        className="w-full">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 justify-start">
                      Roll No <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter roll number"
                      value={formData.rollNo}
                      onChange={(e) =>
                        setFormData({ ...formData, rollNo: e.target.value })
                      }
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Educational Details */}
                <CardHeader>
                  <CardTitle>Educational Details</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Academic Year */}
                  <div className="space-y-2 w-full">
                    <Label className="flex items-center gap-1 justify-start">
                      Academic Year <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.academicYearId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, academicYearId: val })
                      }
                      required>
                      <SelectTrigger
                        style={{ height: "2.75rem" }}
                        className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((year: any) => (
                          <SelectItem
                            key={year.academicYearId}
                            value={year.academicYearId.toString()}>
                            {year.academicYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Class */}
                  <div className="space-y-2 w-full">
                    <Label className="flex items-center gap-1 justify-start">
                      Class <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.classId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, classId: val, divisionId: "" })
                      }
                      required>
                      <SelectTrigger
                        style={{ height: "2.75rem" }}
                        className="w-full">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes
                          .filter(
                            (cls: any) =>
                              cls.schoolId ===
                              Number(localStorage.getItem("schoolId"))
                          )
                          .map((cls: any) => (
                            <SelectItem
                              key={cls.classId}
                              value={cls.classId.toString()}>
                              {cls.className}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Division */}
                  <div className="space-y-2 w-full">
                    <Label className="flex items-center gap-1 justify-start">
                      Division <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.divisionId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, divisionId: val })
                      }
                      disabled={!formData.classId}
                      required>
                      <SelectTrigger
                        style={{ height: "2.75rem" }}
                        className="w-full">
                        <SelectValue
                          placeholder={
                            formData.classId
                              ? "Select division"
                              : "Select class first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions
                          .filter((div) => div.classId === Number(formData.classId))
                          .map((div) => (
                            <SelectItem
                              key={div.divisionId}
                              value={div.divisionId.toString()}>
                              {div.divisionName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1 justify-start">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    placeholder="Enter complete residential address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="h-24"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 h-11"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Link href="/parent/dashboard">
                    <Button type="button" variant="outline" className="h-11">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ID Card Preview Section - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <h3 className="text-lg font-semibold">ID Card Preview</h3>
            
            {/* Front Side */}
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-xl overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-400 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-800 rounded-tl-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col p-4">
                {/* Header with logo and school name */}
                <div className="flex items-center gap-2 mb-4">
                  {schoolLogo && (
                    <img
                      src={schoolLogo}
                      alt="School Logo"
                      className="w-10 h-10 rounded-full bg-white p-1"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-sm leading-tight uppercase">
                      {schoolName || "SCHOOL NAME"}
                    </h2>
                  </div>
                </div>

                {/* Student Photo */}
                <div className="flex justify-center mb-3">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Name */}
                <div className="text-center mb-4">
                  <h3 className="text-white font-bold text-base">
                    {fullName || "Student Name"}
                  </h3>
                  <p className="text-white text-xs">
                    {selectedClassName && selectedDivisionName
                      ? `Std. ${selectedClassName} | Class: ${selectedDivisionName}`
                      : "Class & Division"}
                  </p>
                </div>

                {/* Info Icons */}
                <div className="space-y-2 text-white text-xs flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3 h-3" />
                    </div>
                    <span>{formData.rollNo || "2269"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Cake className="w-3 h-3" />
                    </div>
                    <span>
                      {formData.dob
                        ? new Date(formData.dob).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "10th July 2005"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Home className="w-3 h-3" />
                    </div>
                    <span className="flex-1 line-clamp-2">
                      {formData.address || "Shreeram Aprt.,1105, SV Road, Ashoknagar"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-xl overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-400 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-green-800 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                {/* School Logo and Name */}
                <div className="text-center mb-8">
                  {schoolLogo && (
                    <img
                      src={schoolLogo}
                      alt="School Logo"
                      className="w-16 h-16 mx-auto rounded-full bg-white p-2 mb-3"
                    />
                  )}
                  <h2 className="text-white font-bold text-lg uppercase">
                    {schoolName || "RISE ABOVE"}
                  </h2>
                  <p className="text-white text-xs">INTERNATIONAL SCHOOL</p>
                </div>

                {/* Icon buttons */}
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Cake className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}