"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { imgUrl } from "@/lib/image-utils"
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
import { ArrowLeft, Upload, CheckCircle, Camera } from "lucide-react";
import Link from "next/link";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";

export default function AddStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);

  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [schoolLogo, setSchoolLogo] = useState("");
  const [schoolCardTemplate, setSchoolCardTemplate] = useState("");
  const [schoolCardTemplateBack, setSchoolCardTemplateBack] = useState("");
  const [schoolSignature, setSchoolSignature] = useState("");
  const [templateFields, setTemplateFields] = useState<{ front: any[]; back: any[] }>({ front: [], back: [] });
  
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
        setSchoolLogo(imgUrl(school.schoolLogo));
        setSchoolCardTemplate(school.cardTemplateFront || "");
        setSchoolCardTemplateBack(school.cardTemplateBack || "");
        setSchoolSignature(school.principalSignature || "");

        // Load saved designer field positions
        try {
          const tRes = await fetch(`${BASE_URL}/CardTemplate/list?schoolId=${school.schoolId}`);
          const tData = await tRes.json();
          if (tData?.length > 0 && tData[0].templateFieldsJson) {
            const parsed = JSON.parse(tData[0].templateFieldsJson);
            if (parsed?.front) setTemplateFields({ front: parsed.front, back: parsed.back || [] });
          }
        } catch {}
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
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result?.toString() ?? "");
      setShowCropper(true);
      setCrop(undefined);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const c = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 4 / 5, width, height),
      width, height
    );
    setCrop(c);
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

  const showCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth  / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width  = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, completedCrop.width, completedCrop.height
    );
    const base64 = canvas.toDataURL("image/jpeg", 0.95);
    setPhotoPreview(base64);
    setShowCropper(false);
    setSelectedFile(null);
    setImgSrc("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parentUserId = Number(localStorage.getItem("userId"));
      const schoolId     = Number(localStorage.getItem("schoolId"));

      // ✅ Step 1 — upload photo to server, get URL
      let photoPath = "";
      if (photoPreview) {
        // Convert base64 preview to File blob
        const res      = await fetch(photoPreview);
        const blob     = await res.blob();
        const file     = new File([blob], "student-photo.jpg", { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes  = await fetch(
          `${BASE_URL}/File/upload/students`,
          { method: "POST", body: formData }
        );
        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          alert("Photo upload failed: " + uploadData.message);
          setIsSubmitting(false);
          return;
        }

        photoPath = uploadData.url; // e.g. /uploads/students/abc.jpg
      }

      // ✅ Step 2 — save student with photo URL (not base64)
      const payload = {
        parentUserId,
        schoolId,
        academicYearId: Number(formData.academicYearId),
        classId:        Number(formData.classId),
        divisionId:     Number(formData.divisionId),
        firstName:      formData.firstName,
        middleName:     formData.middleName,
        lastName:       formData.lastName,
        rollNo:         formData.rollNo,
        dob:            formData.dob,
        bloodGroup:     formData.bloodGroup,
        address:        formData.address,
        photoPath,  // ← URL now, not base64
      };

      const submitRes = await fetch(`${BASE_URL}/Student/add`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!submitRes.ok) {
        const errText = await submitRes.text();
        throw new Error(errText || "Failed to submit");
      }

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                {showCropper && imgSrc && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-2xl">
                      <h3 className="text-base font-semibold mb-3 text-center">
                        ✂️ Crop Photo — drag corners to resize
                      </h3>
                      <div className="flex justify-center overflow-auto max-h-[65vh]">
                        <ReactCrop
                          crop={crop}
                          onChange={c => setCrop(c)}
                          onComplete={c => setCompletedCrop(c)}
                          aspect={4 / 5}
                          minWidth={50}
                          minHeight={50}
                        >
                          <img
                            ref={imgRef}
                            src={imgSrc}
                            onLoad={onImageLoad}
                            style={{ maxWidth: "100%", maxHeight: "60vh" }}
                            alt="crop-source"
                          />
                        </ReactCrop>
                      </div>
                      <div className="flex gap-3 mt-4 justify-center">
                        <Button type="button" onClick={showCroppedImage}
                          className="bg-green-600 hover:bg-green-700 px-6">
                          ✅ Save Crop
                        </Button>
                        <Button type="button" variant="outline"
                          onClick={() => { setShowCropper(false); setImgSrc(""); }}>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          <div className="sticky top-6 space-y-3">
            <h3 className="text-base font-semibold">ID Card Preview</h3>

            <div className="flex gap-3 justify-center">
              {/* FRONT */}
              <div className="flex-1 max-w-[48%]">
                <p className="text-xs text-center text-gray-400 mb-1 font-medium">◼ Front</p>
                <div className="relative rounded-lg overflow-hidden shadow-md" style={{ paddingTop: "158%" }}>
                  <div className="absolute inset-0">
                    {schoolCardTemplate
                      ? <img src={imgUrl(schoolCardTemplate)} className="absolute inset-0 w-full h-full object-cover" alt="front" />
                      : <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
                    }
                    {templateFields.front.filter((f: any) => f.visible).map((f: any) => {
                      const dobFmt = formData.dob
                        ? new Date(formData.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "";
                      if (f.isImage) {
                        let src = "";
                        if (f.key === "photo")      src = photoPreview || "";
                        if (f.key === "schoolLogo") src = schoolLogo;
                        if (!src) return null;
                        return <img key={f.key} src={src} style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%`, width: `${f.width}%`, height: `${f.height}%`, objectFit: "cover", zIndex: 1 }} alt="" />;
                      }
                      let val = "";
                      if (f.key === "studentName")   val = fullName;
                      if (f.key === "classDivision") val = `${selectedClassName} - ${selectedDivisionName}`;
                      if (f.key === "rollNo")        val = `Roll: ${formData.rollNo}`;
                      if (f.key === "dob")           val = `DOB: ${dobFmt}`;
                      if (f.key === "bloodGroup")    val = formData.bloodGroup;
                      if (f.key === "address")       val = formData.address;
                      if (!val) return null;
                      const jMap: any = { left: "flex-start", center: "center", right: "flex-end" };
                      return <div key={f.key} style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%`, width: `${f.width}%`, height: `${f.height}%`, zIndex: 1, fontSize: f.fontSize, color: f.fontColor || "#000", fontWeight: f.bold ? "bold" : "normal", fontStyle: f.italic ? "italic" : "normal", whiteSpace: "nowrap", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: jMap[f.align || "left"] }}>{val}</div>;
                    })}
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div className="flex-1 max-w-[48%]">
                <p className="text-xs text-center text-gray-400 mb-1 font-medium">◻ Back</p>
                <div className="relative rounded-lg overflow-hidden shadow-md" style={{ paddingTop: "158%" }}>
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
                        if (f.key === "photo")      src = photoPreview || "";
                        if (!src) return null;
                        return <img key={f.key} src={src} style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%`, width: `${f.width}%`, height: `${f.height}%`, objectFit: "cover", zIndex: 1 }} alt="" />;
                      }
                      let val = "";
                      if (f.key === "studentName")   val = fullName;
                      if (f.key === "classDivision") val = `${selectedClassName} - ${selectedDivisionName}`;
                      if (f.key === "address")       val = formData.address;
                      if (!val) return null;
                      const jMap: any = { left: "flex-start", center: "center", right: "flex-end" };
                      return <div key={f.key} style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%`, width: `${f.width}%`, height: `${f.height}%`, zIndex: 1, fontSize: f.fontSize, color: f.fontColor || "#000", fontWeight: f.bold ? "bold" : "normal", fontStyle: f.italic ? "italic" : "normal", whiteSpace: "nowrap", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: jMap[f.align || "left"] }}>{val}</div>;
                    })}
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