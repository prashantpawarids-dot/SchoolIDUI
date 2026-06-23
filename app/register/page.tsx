"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// Admin can create these 3 roles only
const ADMIN_ROLES = [
  { roleId: 1, roleName: "Admin" },
  { roleId: 2, roleName: "Parent" },
  { roleId: 3, roleName: "Partner" },
  { roleId: 4, roleName: "School" },
]

export default function RegisterPage() {
  const router = useRouter()

  // ✅ Read logged-in user info from localStorage
  const [loggedInRoleId, setLoggedInRoleId]     = useState(0);
const [loggedInSchoolId, setLoggedInSchoolId] = useState(0);
const [isAdmin, setIsAdmin]   = useState(false);
const [isSchool, setIsSchool] = useState(false);
const [mounted, setMounted]   = useState(false);

useEffect(() => {
  const rid = Number(localStorage.getItem("roleId"));
  const sid = Number(localStorage.getItem("schoolId"));
  setLoggedInRoleId(rid);
  setLoggedInSchoolId(sid);
  setIsAdmin(rid === 5 || rid === 1);
setIsSchool(rid === 4);
  setMounted(true);
}, []);

// Redirect only after mounted
useEffect(() => {
  if (!mounted) return;
  if (!isAdmin && !isSchool) {
    router.replace("/login");
  }
}, [mounted, isAdmin, isSchool]);

  const [schools, setSchools] = useState<any[]>([])
  const [academicYears, setAcademicYears] = useState<any[]>([])

  const [formData, setFormData] = useState({
    schoolId: isSchool ? loggedInSchoolId.toString() : "",
    academicYearId: "",
    roleId: isSchool ? "2" : "", // school always creates Parent
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    address: "",
    contact: "",
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null)

  // ── Admin logo upload + crop (Admin role only) ──
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [imgSrc, setImgSrc] = useState("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onSelectLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImgSrc(reader.result?.toString() ?? "")
      setShowCropper(true)
      setCrop(undefined)
    }
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    const c = centerCrop(
      makeAspectCrop({ unit: "%", width: 80 }, 1, width, height),
      width, height
    )
    setCrop(c)
  }

  const saveCroppedLogo = async () => {
    if (!completedCrop || !imgRef.current) return
    const canvas = document.createElement("canvas")
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, completedCrop.width, completedCrop.height
    )
    setLogoPreview(canvas.toDataURL("image/jpeg", 0.95))
    setShowCropper(false)
    setImgSrc("")
  }

  const selectedRole = Number(formData.roleId)
  // School dropdown needed: admin creating Parent or School
const needsSchool = isAdmin && (selectedRole === 2 || selectedRole === 3 || selectedRole === 4)
  // Academic Year needed: creating Parent only
  const needsYear = selectedRole === 2

  // Load schools list (admin only)
useEffect(() => {
  if (!isAdmin) return
  fetch(`${API_BASE}/School/list`)
    .then(r => r.json())
    .then(setSchools)
    .catch(console.error)
}, [isAdmin])

  // Load academic years when schoolId changes (admin selecting school)
  useEffect(() => {
    if (!formData.schoolId || !needsYear) return
    fetch(`${API_BASE}/School/academicyear/${formData.schoolId}`)
      .then(r => r.json())
      .then(setAcademicYears)
      .catch(console.error)
  }, [formData.schoolId])

  // Load academic years immediately for school user
useEffect(() => {
  if (!isSchool || !loggedInSchoolId) return
  fetch(`${API_BASE}/School/academicyear/${loggedInSchoolId}`)
    .then(r => r.json())
    .then(setAcademicYears)
    .catch(console.error)
}, [isSchool, loggedInSchoolId])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.roleId) { setError("Please select a role"); return }
    if (needsSchool && !formData.schoolId) { setError("Please select a school"); return }
    if (needsYear && !formData.academicYearId) { setError("Please select an academic year"); return }
    if (!formData.firstName || !formData.lastName) { setError("First and Last name are required"); return }

    setIsLoading(true)
setError("")
try {
      const schoolId = isSchool
    ? loggedInSchoolId
    : needsSchool ? Number(formData.schoolId)
    : null                                       // admin creating admin — no school

      // Upload admin logo first, if one was cropped (Admin role only)
      let adminLogoUrl = ""
      if (selectedRole === 1 && logoPreview) {
        const blob = await (await fetch(logoPreview)).blob()
        const file = new File([blob], "admin-logo.jpg", { type: "image/jpeg" })
        const fd = new FormData()
        fd.append("file", file)
        const uploadRes = await fetch(`${API_BASE}/File/upload/adminlogo`, { method: "POST", body: fd })
        const uploadData = await uploadRes.json()
        if (uploadData?.success) adminLogoUrl = uploadData.url
      }

      const res = await fetch(`${API_BASE}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId,
          academicYearId: needsYear ? Number(formData.academicYearId) : null,
          roleId: Number(formData.roleId),
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          contact: formData.contact,
          createdByRoleId: loggedInRoleId,    // ✅ send who is creating
          createdBySchoolId: loggedInSchoolId, // ✅ send their schoolId
          adminLogo: adminLogoUrl || null,
        }),
      })

      const data = await res.json()

     if (data.success === false) {
  setError(data.message);
  setIsLoading(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
  return;
}

      setCredentials({ username: data.username, password: data.password })

      // Reset form
      // Reset form
      setFormData({
        schoolId: isSchool ? loggedInSchoolId.toString() : "",
        academicYearId: "",
        roleId: isSchool ? "2" : "",
        firstName: "", middleName: "", lastName: "",
        email: "", address: "", contact: "",
      })
      setLogoPreview(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null;

return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-4xl shadow-lg p-6">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">
            {isSchool ? "Add New Parent" : "Add New User"}
          </CardTitle>
          <CardDescription>
            {isSchool
              ? "Create a parent account for your school"
              : "Create Admin, School or Parent accounts"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
  <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
    <span className="text-red-600 font-semibold text-sm">⚠ {error}</span>
  </div>
)}

          {/* ✅ Show credentials after success */}
          {credentials && (
            <Card className="mb-6 border-green-500 border-2 bg-green-50">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">User Created Successfully!</CardTitle>
                <CardDescription>Share these credentials with the user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Username:</strong> {credentials.username}</p>
                <p><strong>Password:</strong> {credentials.password}</p>
                <Button className="mt-3 w-full" variant="outline"
                  onClick={() => setCredentials(null)}>
                  Add Another
                </Button>
              </CardContent>
            </Card>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Role — admin sees dropdown, school sees fixed "Parent" */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>Role <span className="text-red-500">*</span></Label>
                {isAdmin ? (
                  <Select value={formData.roleId} onValueChange={v =>
                    setFormData(prev => ({ ...prev, roleId: v, schoolId: "", academicYearId: "" }))
                  }>
                    <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                    <SelectContent>
                      {ADMIN_ROLES.map(r => (
                        <SelectItem key={r.roleId} value={r.roleId.toString()}>{r.roleName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
  <Select value={formData.roleId} disabled>
    <SelectTrigger className="bg-gray-100">
      <SelectValue placeholder="Parent" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="2">Parent</SelectItem>
    </SelectContent>
  </Select>
)}
              </div>

              {/* School dropdown — admin only, when creating Parent or School */}
              {/* Admin Logo upload — only when creating an Admin */}
              {isAdmin && selectedRole === 1 && (
                <div>
                  <Label>Admin Logo</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                      {logoPreview
                        ? <img src={logoPreview} className="w-full h-full object-cover" alt="logo preview" />
                        : <span className="text-gray-300 text-xl">🖼</span>}
                    </div>
                    <Input type="file" accept="image/*" onChange={onSelectLogo} className="text-sm" />
                  </div>
                </div>
              )}

              {/* School dropdown — admin only, when creating Parent or School */}
              {isAdmin && needsSchool && (
                <div>
                  <Label>School <span className="text-red-500">*</span></Label>
                  <Select value={formData.schoolId} onValueChange={v => handleChange("schoolId", v)}>
                    <SelectTrigger><SelectValue placeholder="Select School" /></SelectTrigger>
                    <SelectContent>
                      {schools.map(s => (
                        <SelectItem key={s.schoolId} value={s.schoolId.toString()}>{s.schoolName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Academic Year — Parent role only */}
              {needsYear && (
                <div>
                  <Label>Academic Year <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.academicYearId}
                    onValueChange={v => handleChange("academicYearId", v)}
                    disabled={!academicYears.length}>
                    <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                    <SelectContent>
                      {academicYears.map(a => (
                        <SelectItem key={a.academicYearId} value={a.academicYearId.toString()}>
                          {a.academicYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label>First Name <span className="text-red-500">*</span></Label>
                <Input value={formData.firstName}
                  onChange={e => handleChange("firstName", e.target.value)} required />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input value={formData.middleName}
                  onChange={e => handleChange("middleName", e.target.value)} />
              </div>
              <div>
                <Label>Last Name <span className="text-red-500">*</span></Label>
                <Input value={formData.lastName}
                  onChange={e => handleChange("lastName", e.target.value)} required />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input type="email" value={formData.email}
                  onChange={e => handleChange("email", e.target.value)} required />
              </div>
              <div>
                <Label>Contact <span className="text-red-500">*</span></Label>
                <Input value={formData.contact}
                  onChange={e => handleChange("contact", e.target.value)} required />
              </div>
            </div>

            <div>
              <Label>Address <span className="text-red-500">*</span></Label>
              <Input value={formData.address}
                onChange={e => handleChange("address", e.target.value)} required />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1 h-11 text-base">
                {isLoading ? "Creating..." : "Create User"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </form>

          {/* Crop Modal — admin logo */}
          {showCropper && imgSrc && (
            <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg">
                <h3 className="text-base font-semibold mb-3 text-center">✂️ Crop Logo</h3>
                <div className="flex justify-center overflow-auto max-h-[60vh]">
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={c => setCompletedCrop(c)}
                    aspect={1}
                    minWidth={50}
                    minHeight={50}
                  >
                    <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} style={{ maxWidth: "100%", maxHeight: "55vh" }} alt="crop-source" />
                  </ReactCrop>
                </div>
                <div className="flex gap-3 mt-4 justify-center">
                  <Button type="button" onClick={saveCroppedLogo} className="bg-green-600 hover:bg-green-700 px-6">✅ Save Crop</Button>
                  <Button type="button" variant="outline" onClick={() => { setShowCropper(false); setImgSrc("") }}>Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}