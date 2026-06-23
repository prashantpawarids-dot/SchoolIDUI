"use client";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop";
// import "react-image-crop/dist/ReactCrop.css";
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
  const [crop, setCrop]           = useState<Crop>();
const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
const [imgSrc, setImgSrc]       = useState("");
const imgRef                    = useRef<HTMLImageElement>(null);
  const [classes, setClasses]           = useState<any[]>([]);
  const [divisions, setDivisions]       = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "",
    dob: "", bloodGroup: "", rollNo: "",
    academicYearId: "", classId: "", divisionId: "",
    address: "", schoolId: 0, parentUserId: 0,
  });

  const [loadingStudent, setLoadingStudent] = useState(true);

  // Load EVERYTHING for this student in one coordinated sequence —
  // avoids the race condition where dropdown-data fetches (triggered by
  // formData state changes) can lag behind on slow connections, leaving
  // Class/Division/Year looking "empty" even though the underlying
  // formData value is already correct.
  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;

    let cancelled = false;

    const loadAll = async () => {
      setLoadingStudent(true);
      try {
        // 1) Student record
        const s = await fetch(`${BASE_URL}/Student/get/${id}`).then(r => r.json());
        if (cancelled) return;

        const rawDob = s.dOB ?? s.dob ?? s.DOB ?? "";
        const schoolId = s.schoolId ?? Number(localStorage.getItem("schoolId")) ?? 0;
        const classIdStr = s.classId?.toString() ?? "";

        // 2) Classes + Academic Years for this school, fetched together
        const [classesData, yearsData] = await Promise.all([
          fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${schoolId}`).then(r => r.json()).catch(() => []),
          fetch(`${BASE_URL}/School/academicyear/${schoolId}`).then(r => r.json()).catch(() => []),
        ]);
        if (cancelled) return;

        // 3) Divisions depend on classId — fetch only once we know it
        const divisionsData = classIdStr
          ? await fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${classIdStr}`).then(r => r.json()).catch(() => [])
          : [];
        if (cancelled) return;

        // Set everything together — no partial/intermediate render with stale dropdown options
        setClasses(classesData || []);
        setAcademicYears(yearsData || []);
        setDivisions(divisionsData || []);
        setFormData({
          firstName:      s.firstName      ?? "",
          middleName:     s.middleName     ?? "",
          lastName:       s.lastName       ?? "",
          dob:            rawDob ? rawDob.split("T")[0] : "",
          bloodGroup:     s.bloodGroup     ?? "",
          rollNo:         s.rollNo         ?? "",
          academicYearId: s.academicYearId?.toString() ?? "",
          classId:        classIdStr,
          divisionId:     s.divisionId?.toString()     ?? "",
          address:        s.address        ?? "",
          schoolId:       schoolId,
          parentUserId:   s.parentUserId   ?? 0,
        });
        if (s.photoPath) setPhotoPreview(imgUrl(s.photoPath));
      } finally {
        if (!cancelled) setLoadingStudent(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, [searchParams]);

  // Re-fetch divisions if the user manually changes the Class dropdown
  // (separate from the initial load above, which already fetches the
  // correct divisions for the student's existing classId).
  useEffect(() => {
    if (!formData.classId || loadingStudent) return;
    fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${formData.classId}`)
      .then(r => r.json())
      .then(setDivisions)
      .catch(() => {});
  }, [formData.classId]);
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

 const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true); // show confirmation first
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirm(false);
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

      // Parent confirmed data — submit for approval
      await fetch(`${BASE_URL}/Student/applications/update/${id}?status=accept&remarks=Parent+verified`, {
        method: "PUT",
      });

     setIsSuccess(true);
      setTimeout(() => router.back(), 1500);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClass  = classes.find(c => c.classId?.toString()    === formData.classId);
  const selectedDiv    = divisions.find(d => d.divisionId?.toString() === formData.divisionId);
  const selectedYear   = academicYears.find(a => a.academicYearId?.toString() === formData.academicYearId);

  if (showConfirm) return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Please verify student details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-4 items-start">
            {photoPreview && (
              <img src={photoPreview} className="w-20 h-24 object-cover rounded-lg border" alt="photo" />
            )}
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold text-gray-500">Name:</span> {formData.firstName} {formData.middleName} {formData.lastName}</p>
              <p><span className="font-semibold text-gray-500">DOB:</span> {formData.dob}</p>
              <p><span className="font-semibold text-gray-500">Blood Group:</span> {formData.bloodGroup}</p>
              <p><span className="font-semibold text-gray-500">Roll No:</span> {formData.rollNo}</p>
              <p><span className="font-semibold text-gray-500">Class:</span> {selectedClass?.className} - {selectedDiv?.divisionName}</p>
              <p><span className="font-semibold text-gray-500">Year:</span> {selectedYear?.academicYear}</p>
              <p><span className="font-semibold text-gray-500">Address:</span> {formData.address}</p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            ⚠️ By confirming, your student data will be saved and submitted for ID card approval.
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleConfirmedSubmit}
              disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "✅ Confirm & Submit"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowConfirm(false)}>
              ✏️ Edit Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loadingStudent) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground">Loading student details...</p>
    </div>
  );

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
    <div className="space-y-6 p-3 md:p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Edit Student</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Photo + Name */}
            <div className="flex flex-col sm:flex-row gap-6 pb-4 border-b">
              <div className="flex flex-col items-center sm:items-start">
                <Label>Photo</Label>
                <div className="w-28 h-36 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/30 mt-1">
                  {photoPreview
                    ? <img src={photoPreview} className="w-full h-full object-cover" />
                    : <Upload className="w-8 h-8 text-muted-foreground" />}
                </div>
                <Input type="file" accept="image/*" onChange={onSelectFile} className="mt-2 text-xs w-full" />
              </div>
              <div className="w-full grid grid-cols-1 gap-3 content-start">
                {["firstName", "middleName", "lastName"].map(f => (
                  <div key={f}>
                    <Label className="capitalize">{f.replace(/([A-Z])/g, " $1")}</Label>
                    <Input
                      className="w-full"
                      value={(formData as any)[f]}
                      onChange={e => setFormData(p => ({ ...p, [f]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cropper */}
          {/* Cropper */}
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
        <Button type="button" variant="outline" onClick={() => { setShowCropper(false); setImgSrc(""); }}>
          Cancel
        </Button>
      </div>
    </div>
  </div>
)}

            {/* Personal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Date of Birth</Label>
                <Input className="w-full" type="date" value={formData.dob}
                  onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))} />
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={v => setFormData(p => ({ ...p, bloodGroup: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(b =>
                      <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Roll No</Label>
                <Input className="w-full" value={formData.rollNo}
                  onChange={e => setFormData(p => ({ ...p, rollNo: e.target.value }))} />
              </div>
            </div>

            {/* Academic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Academic Year</Label>
                <Select value={formData.academicYearId} onValueChange={v => setFormData(p => ({ ...p, academicYearId: v }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {academicYears.map(a =>
                      <SelectItem key={a.academicYearId} value={a.academicYearId.toString()}>{a.academicYear}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Class</Label>
                <Select value={formData.classId} onValueChange={v => setFormData(p => ({ ...p, classId: v, divisionId: "" }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c =>
                      <SelectItem key={c.classId} value={c.classId.toString()}>{c.className}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Division</Label>
                <Select value={formData.divisionId} onValueChange={v => setFormData(p => ({ ...p, divisionId: v }))} disabled={!formData.classId}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select division" /></SelectTrigger>
                  <SelectContent>
                   {divisions.map(d =>
                      <SelectItem key={d.divisionId} value={d.divisionId.toString()}>{d.divisionName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Textarea className="w-full" rows={3} value={formData.address}
                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1 h-11">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={() => router.back()}>
                Cancel
              </Button>
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