"use client";
import { useEffect, useState, useCallback } from "react";
import { BASE_URL, SYSTEM_PARENT_USER_ID } from "@/lib/api";
import { useSchools } from "@/lib/school-context";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";

export default function AddCardPage() {
  const { schools } = useSchools();
  const [form, setForm] = useState({
    schoolId: "", academicYearId: "", classId: "", divisionId: "",
    firstName: "", middleName: "", lastName: "", rollNo: "",
    dob: "", bloodGroup: "", address: "", parentName: "", emergencyContact: "",
  });
  const [years, setYears]         = useState<any[]>([]);
  const [classes, setClasses]     = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [photoBase64, setPhotoBase64]   = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropper, setShowCropper]   = useState(false);
  const [crop, setCrop]   = useState({ x: 0, y: 0 });
  const [zoom, setZoom]   = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!form.schoolId) { setYears([]); setClasses([]); return; }
    fetch(`${BASE_URL}/School/academicyear/${form.schoolId}`).then(r => r.json()).then(setYears);
    fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${form.schoolId}`).then(r => r.json()).then(setClasses);
  }, [form.schoolId]);

  useEffect(() => {
    if (!form.classId) { setDivisions([]); return; }
    fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${form.classId}`).then(r => r.json()).then(setDivisions);
  }, [form.classId]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setShowCropper(true);
  };

  const onCropComplete = useCallback((_croppedArea: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!selectedFile) return;
    const imageSrc = URL.createObjectURL(selectedFile);
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setPhotoBase64(croppedImage);
    setPhotoPreview(croppedImage);
    setShowCropper(false);
    setSelectedFile(null);
  }, [selectedFile, croppedAreaPixels]);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const resetForm = () => {
    setForm({
      schoolId: "", academicYearId: "", classId: "", divisionId: "",
      firstName: "", middleName: "", lastName: "", rollNo: "",
      dob: "", bloodGroup: "", address: "", parentName: "", emergencyContact: "",
    });
    setPhotoBase64("");
    setPhotoPreview("");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!form.schoolId || !form.academicYearId || !form.classId || !form.divisionId) {
      setError("School, Academic Year, Class, and Division are required.");
      return;
    }
    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!photoBase64) {
      setError("Photo is required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        SchoolId: Number(form.schoolId),
        AcademicYearId: Number(form.academicYearId),
        ClassId: Number(form.classId),
        DivisionId: Number(form.divisionId),
      ParentUserId: SYSTEM_PARENT_USER_ID,
        CreatedByUserId: Number(localStorage.getItem("userId")) || null,
        FirstName: form.firstName.trim(),
        MiddleName: form.middleName.trim(),
        LastName: form.lastName.trim(),
        RollNo: form.rollNo.trim(),
        DOB: form.dob || null,
        BloodGroup: form.bloodGroup.trim(),
        Address: form.address.trim(),
        PhotoPath: photoBase64,
        ParentName: form.parentName.trim(),
        EmergencyContact: form.emergencyContact.trim(),
      };

      const res = await fetch(`${BASE_URL}/Student/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to add card");
      }

      const data = await res.json();
      const newStudentId = data.studentId;

      // Auto-approve so it appears in the print list immediately
      if (newStudentId) {
        await fetch(`${BASE_URL}/Student/applications/update/${newStudentId}?status=Approved`, {
          method: "PUT",
        }).catch(() => {});
      }

      setSuccess("✅ Card added! It will now appear in the Print Cards list.");
      resetForm();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <a href="/admin/print" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mb-4 transition-colors">
          ← Back to Print
        </a>

       <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-5 border-b">
            <h1 className="font-bold text-xl text-gray-800">➕ Add Card</h1>
            <p className="text-sm text-gray-400 mt-0.5">Add a single cardholder manually — it will use the organization's saved card template</p>
          </div>

          <div className="p-5 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">{success}</div>
            )}
{/* Organization / Year / Group / Sub-group */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Organization *</label>
                <select className="w-full border rounded-lg px-2 py-2 text-sm" value={form.schoolId}
                  onChange={e => { update("schoolId", e.target.value); update("academicYearId", ""); update("classId", ""); update("divisionId", ""); }}>
                  <option value="">-- Select --</option>
                  {schools.map((s: any) => <option key={s.schoolId} value={s.schoolId}>{s.schoolName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Year / Batch *</label>
                <select className="w-full border rounded-lg px-2 py-2 text-sm" value={form.academicYearId}
                  onChange={e => update("academicYearId", e.target.value)} disabled={!form.schoolId}>
                  <option value="">-- Select --</option>
                  {years.map((y: any) => <option key={y.academicYearId} value={y.academicYearId}>{y.academicYear}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Department / Group *</label>
                <select className="w-full border rounded-lg px-2 py-2 text-sm" value={form.classId}
                  onChange={e => { update("classId", e.target.value); update("divisionId", ""); }} disabled={!form.schoolId}>
                  <option value="">-- Select --</option>
                  {classes.map((c: any) => <option key={c.classId} value={c.classId}>{c.className}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Sub-group / Shift *</label>
                <select className="w-full border rounded-lg px-2 py-2 text-sm" value={form.divisionId}
                  onChange={e => update("divisionId", e.target.value)} disabled={!form.classId}>
                  <option value="">-- Select --</option>
                  {divisions.map((d: any) => <option key={d.divisionId} value={d.divisionId}>{d.divisionName}</option>)}
                </select>
              </div>
            </div>
            <hr />

           {/* Photo */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                {photoPreview
                  ? <img src={photoPreview} className="w-full h-full object-cover" alt="preview" />
                  : <span className="text-gray-300 text-2xl">👤</span>}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Photo *</label>
                <input type="file" accept="image/*" onChange={handlePhoto} className="text-sm" />
              </div>
            </div>

            {/* Crop Modal */}
            {showCropper && selectedFile && (
              <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-lg h-96 bg-white rounded-lg overflow-hidden">
                  <Cropper
                    image={URL.createObjectURL(selectedFile)}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 5}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                  <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                    <button onClick={showCroppedImage}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg">
                      Save Crop
                    </button>
                    <button onClick={() => { setShowCropper(false); setSelectedFile(null); }}
                      className="px-4 py-2 bg-white border text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Name */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">First Name *</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" value={form.firstName}
                  onChange={e => update("firstName", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Middle Name</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" value={form.middleName}
                  onChange={e => update("middleName", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Last Name</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" value={form.lastName}
                  onChange={e => update("lastName", e.target.value)} />
              </div>
            </div>

            {/* Roll No / DOB / Blood Group */}
            {/* ID No / DOB / Blood Group */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">ID / Roll No</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" value={form.rollNo}
                  onChange={e => update("rollNo", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Date of Birth</label>
                <input type="date" className="w-full border rounded-lg px-2 py-2 text-sm" value={form.dob}
                  onChange={e => update("dob", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Blood Group</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" placeholder="O+" value={form.bloodGroup}
                  onChange={e => update("bloodGroup", e.target.value)} />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Address</label>
              <textarea className="w-full border rounded-lg px-2 py-2 text-sm" rows={2} value={form.address}
                onChange={e => update("address", e.target.value)} />
            </div>

            {/* Guardian/Contact Name / Emergency Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Guardian / Reference Name</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" value={form.parentName}
                  onChange={e => update("parentName", e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Emergency Contact</label>
                <input className="w-full border rounded-lg px-2 py-2 text-sm" value={form.emergencyContact}
                  onChange={e => update("emergencyContact", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-3">
            <a href="/admin/print" className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</a>
            <button onClick={handleSubmit} disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
              {submitting ? "Saving..." : "💾 Add Card"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}