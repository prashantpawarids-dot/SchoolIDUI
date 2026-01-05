"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<any[]>([])
  const [academicYears, setAcademicYears] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [formData, setFormData] = useState({
    schoolId: "",
    academicYearId: "",
    roleId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    address: "",
    contact: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null) // <-- For showing credentials card
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_BASE = "/api/proxy";
  // Fetch schools
useEffect(() => {
  fetch(`${API_BASE}/School/list`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch schools");
      return res.json();
    })
    .then((data) => setSchools(data))
    .catch((err) => console.error(err.message));
}, []);

// Fetch roles
useEffect(() => {
  fetch(`${API_BASE}/Auth/roles`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch roles");
      return res.json();
    })
    .then((data) => setRoles(data))
    .catch((err) => console.error(err.message));
}, []);

// Fetch academic years when school changes
useEffect(() => {
  if (!formData.schoolId) return;

  fetch(`${API_BASE}/School/academicyear/${formData.schoolId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch academic years");
      return res.json();
    })
    .then((data) => setAcademicYears(data))
    .catch((err) => console.error(err.message));
}, [formData.schoolId]);


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolId || !formData.academicYearId || !formData.roleId) {
      setError("Please select school, academic year, and role");
      return;
    }
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: Number(formData.schoolId),
          academicYearId: Number(formData.academicYearId),
          roleId: Number(formData.roleId),
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          contact: formData.contact,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();

      // Instead of alert, set credentials state
      setCredentials({ username: data.username, password: data.password });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-6xl shadow-lg p-6">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-3xl">New Register</CardTitle>
          <CardDescription>Create your account for ID Card Portal</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Show credentials card if available */}
          {credentials && (
            <Card className="mb-6 border-green-500 border-2 p-4 bg-green-50">
              <CardHeader>
                <CardTitle className="text-xl text-green-700">Registration Successful!</CardTitle>
                <CardDescription>Use the following credentials to login:</CardDescription>
              </CardHeader>
              <CardContent>
                <p><strong>Username:</strong> {credentials.username}</p>
                <p><strong>Password:</strong> {credentials.password}</p>
                <Button className="mt-4 w-full" onClick={() => router.push("/login")}>Go to Login</Button>
              </CardContent>
            </Card>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Row: School, Academic Year, Role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
  <Label className="text-center mb-2">
    School <span className="text-red-500">*</span>
  </Label>
  <Select value={formData.schoolId} onValueChange={(v) => handleChange("schoolId", v)}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select School" />
    </SelectTrigger>
    <SelectContent className="w-full">
      {schools.map((s) => (
        <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
          {s.schoolName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


             <div className="flex flex-col items-center">
  <Label className="text-center mb-2">
    Academic Year <span className="text-red-500">*</span>
  </Label>
  <Select
    value={formData.academicYearId}
    onValueChange={(v) => handleChange("academicYearId", v)}
    disabled={!academicYears.length}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select Year" />
    </SelectTrigger>
    <SelectContent className="w-full">
      {academicYears.map((a) => (
        <SelectItem key={a.academicYearId} value={a.academicYearId.toString()}>
          {a.academicYear}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


              <div className="flex flex-col items-center">
  <Label className="text-center mb-2">
    Role <span className="text-red-500">*</span>
  </Label>
  <Select value={formData.roleId} onValueChange={(v) => handleChange("roleId", v)}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select Role" />
    </SelectTrigger>
    <SelectContent className="w-full">
      {roles.map((r) => (
        <SelectItem key={r.roleId} value={r.roleId.toString()}>
          {r.roleName}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div>
    <Label className="block w-full text-center mb-2">
      First Name <span className="text-red-500">*</span>
    </Label>
    <Input
      value={formData.firstName}
      onChange={(e) => handleChange("firstName", e.target.value)}
      required
    />
  </div>

  <div>
    <Label className="block w-full text-center mb-2">
      Middle Name <span className="text-red-500">*</span>
    </Label>
    <Input
      value={formData.middleName}
      onChange={(e) => handleChange("middleName", e.target.value)}
      required
    />
  </div>

  <div>
    <Label className="block w-full text-center mb-2">
      Last Name <span className="text-red-500">*</span>
    </Label>
    <Input
      value={formData.lastName}
      onChange={(e) => handleChange("lastName", e.target.value)}
      required
    />
  </div>
</div>



          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block w-full text-center mb-2">Email 
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="block w-full text-center mb-2">Contact 
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label className="block w-full text-center mb-2">Address

              <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg">
            {isLoading ? "Registering..." : "Register"}
          </Button>
           <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/login")}>Back to Login</Button>


          </form>
        </CardContent>
      </Card>
    </div>
  )
}
