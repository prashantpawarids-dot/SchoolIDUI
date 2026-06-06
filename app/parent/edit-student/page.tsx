"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import { imgUrl } from "@/lib/image-utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function EditStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper]   = useState(false);
  const [crop, setCrop]                 = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                 = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [classes, setClasses]           = useState<any[]>([]);
  const [divisions, setDivisions]       = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "",
    dob: "", bloodGroup: "", rollNo: "",
    academicYearId: "", classId: "", divisionId: "",
    address: "", schoolId: 0, parentUserId: 0,
  });

  // Load student data
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    fetch(`${BASE_URL}/Student/get/${id}`)
      .then(r => r.json())
      .then(s => {
        const rawDob = s.dOB ?? s.dob ?? s.DOB ?? "";
        setFormData({
          firstName:      s.firstName      ?? "",
          middleName:     s.middleName     ?? "",
          lastName:       s.lastName       ?? "",
          dob:            rawDob ? rawDob.split("T")[0] : "",
          bloodGroup:     s.bloodGroup     ?? "",
          rollNo:         s.rollNo         ?? "",
          academicYearId: s.academicYearId?.toString() ?? "",
          classId:        s.classId?.toString()        ?? "",
          divisionId:     s.divisionId?.toString()     ?? "",
          address:        s.address        ?? "",
          schoolId:       s.schoolId       ?? 0,
          parentUserId:   s.parentUserId   ?? 0,
        });
        if (s.photoPath) setPhotoPreview(imgUrl(s.photoPath));
      });
  }, [searchParams]);

  // Load dropdowns
  useEffect(() => {
  const schoolId = localStorage.getItem("schoolId");
  if (!schoolId) return;
  fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${schoolId}`).then(r => r.json()).then(setClasses);
  fetch(`${BASE_URL}/School/academicyear/${schoolId}`).then(r => r.json()).then(setAcademicYears);
}, []);

useEffect(() => {
  if (!formData.classId) return;
  fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${formData.classId}`)
    .then(r => r.json()).then(setDivisions);
}, [formData.classId]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setShowCropper(true); }
  };

  const onCropComplete = useCallback((_: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    const src = selectedFile ? URL.createObjectURL(selectedFile) : photoPreview!;
    const cropped = await getCroppedImg(src, croppedAreaPixels);
    setPhotoPreview(cropped);
    setShowCropper(false);
    setSelectedFile(null);
  }, [selectedFile, croppedAreaPixels, photoPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const id = searchParams.get("id");
    try {
      let photoPath = "";
      if (photoPreview && photoPreview.startsWith("data:")) {
        const res    = await fetch(photoPreview);
        const blob   = await res.blob();
        const file   = new File([blob], "student-photo.jpg", { type: "image/jpeg" });
        const fd     = new FormData();
        fd.append("file", file);
        const upRes  = await fetch(`${BASE_URL}/File/upload/students`, { method: "POST", body: fd });
        const upData = await upRes.json();
        if (!upData.success) { alert("Photo upload failed"); setIsSubmitting(false); return; }
        photoPath = upData.url;
      }

      const payload: any = {
        schoolId:       formData.schoolId,
        parentUserId:   formData.parentUserId,
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
      };
      if (photoPath) payload.photoPath = photoPath;

      const res = await fetch(`${BASE_URL}/Student/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      setIsSuccess(true);
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center p-8">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Student Updated!</h2>
        <p className="text-muted-foreground mt-2">Redirecting...</p>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Photo */}
            <div className="flex gap-6 pb-4 border-b">
              <div>
                <Label>Photo</Label>
                <div className="w-28 h-36 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/30 mt-1">
                  {photoPreview
                    ? <img src={photoPreview} className="w-full h-full object-cover" />
                    : <Upload className="w-8 h-8 text-muted-foreground" />}
                </div>
                <Input type="file" accept="image/*" onChange={onSelectFile} className="mt-2 text-xs" />
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3 content-start">
                {["firstName", "middleName", "lastName"].map(f => (
                  <div key={f}>
                    <Label className="capitalize">{f.replace(/([A-Z])/g, " $1")}</Label>
                    <Input value={(formData as any)[f]}
                      onChange={e => setFormData(p => ({ ...p, [f]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cropper */}
            {showCropper && (
              <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-lg h-96 bg-white rounded-lg overflow-hidden">
                  <Cropper
                    image={selectedFile ? URL.createObjectURL(selectedFile) : photoPreview!}
                    crop={crop} zoom={zoom} aspect={4 / 5}
                    onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                  <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                    <Button type="button" onClick={showCroppedImage}>Save Crop</Button>
<Button type="button" variant="outline" onClick={() => setShowCropper(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Personal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={formData.dob}
                  onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))} />
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={v => setFormData(p => ({ ...p, bloodGroup: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(b =>
                      <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Roll No</Label>
                <Input value={formData.rollNo}
                  onChange={e => setFormData(p => ({ ...p, rollNo: e.target.value }))} />
              </div>
            </div>

            {/* Academic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Academic Year</Label>
                <Select value={formData.academicYearId} onValueChange={v => setFormData(p => ({ ...p, academicYearId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {academicYears.map(a =>
                      <SelectItem key={a.academicYearId} value={a.academicYearId.toString()}>{a.academicYear}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Class</Label>
                <Select value={formData.classId} onValueChange={v => setFormData(p => ({ ...p, classId: v, divisionId: "" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c =>
                      <SelectItem key={c.classId} value={c.classId.toString()}>{c.className}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Division</Label>
                <Select value={formData.divisionId} onValueChange={v => setFormData(p => ({ ...p, divisionId: v }))} disabled={!formData.classId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {divisions.filter(d => d.classId === Number(formData.classId)).map(d =>
                      <SelectItem key={d.divisionId} value={d.divisionId.toString()}>{d.divisionName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Textarea rows={3} value={formData.address}
                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1 h-11">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <EditStudentPage />
    </Suspense>
  );
}