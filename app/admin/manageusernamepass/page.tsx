"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSchools } from "@/lib/school-context";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { getAssignedSchoolIds, isSuperAdmin } from "@/lib/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Credential {
  userId: number;
  username: string;
  password: string;
  roleId: number;
  roleName: string;
  schoolId: number | null;
  schoolName: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  academicYearId: number | null;
  academicYearName: string;
}

interface School { schoolId: number; schoolName: string; }
interface AcademicYear { academicYearId: number; academicYear: string; }

export default function ManageCredentialsPage() {
  const [credentials, setCredentials]     = useState<Credential[]>([]);
  
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedYear,   setSelectedYear]   = useState("");
  const [search,         setSearch]         = useState("");

  const [editingUser,  setEditingUser]  = useState<Credential | null>(null);
  const [newUsername,  setNewUsername]  = useState("");
  const [newPassword,  setNewPassword]  = useState("");
  const [showPassMap,  setShowPassMap]  = useState<Record<number, boolean>>({});
  const [showEditPass, setShowEditPass] = useState(false);
  const [loading,      setLoading]      = useState(false);

  const [roleId,   setRoleId]   = useState(0);
  const [schoolId, setSchoolId] = useState("");
const { schools: contextSchools } = useSchools();
  // ── Step 1: Read localStorage ──
  useEffect(() => {
    const rid = parseInt(localStorage.getItem("roleId") || "0");
    const sid = localStorage.getItem("schoolId") || "";
    setRoleId(rid);
    setSchoolId(sid);
  }, []);

  // ── Step 2: Load schools for Admin/SuperAdmin ──
 useEffect(() => {
  if (roleId === 0) return;
  if (roleId === 3 || roleId === 4) {
    setSelectedSchool(schoolId);
  }
}, [roleId]);

  // ── Step 3: Auto load credentials when roleId is ready ──
useEffect(() => {
  if (roleId === 0) return;
  if (!isSuperAdmin()) {
    const ids = getAssignedSchoolIds();
    if (ids.length === 1) setSelectedSchool(ids[0].toString());
  }
  loadCredentials();
}, [roleId]);

  // ── Load academic years when school changes ──
  useEffect(() => {
    if (!selectedSchool || selectedSchool === "all") {
      setAcademicYears([]);
      setSelectedYear("");
      return;
    }
    fetch(`${API_BASE_URL}/School/academicyear/${selectedSchool}`)
      .then(r => r.json())
      .then(setAcademicYears)
      .catch(console.error);
  }, [selectedSchool]);

  // ── Load credentials ──
  const loadCredentials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const assignedIds = getAssignedSchoolIds();
const schoolParam = roleId === 3 || roleId === 4 
  ? schoolId 
  : selectedSchool !== "all" && selectedSchool 
    ? selectedSchool 
    : isSuperAdmin() ? "" : assignedIds.length === 1 ? assignedIds[0].toString() : "";
      if (schoolParam && schoolParam !== "all") params.append("schoolId", schoolParam);
      if (selectedYear && selectedYear !== "all") params.append("academicYearId", selectedYear);
      if (search) params.append("search", search);

    const res  = await fetch(`${API_BASE_URL}/Auth/credentials?${params}`);
const data = await res.json();

if (isSuperAdmin()) {
  setCredentials(data);
} else {
  const ids = getAssignedSchoolIds();
  setCredentials((data || []).filter((c: Credential) =>
  ids.includes(c.schoolId as number)
));
}
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePass = (userId: number) =>
    setShowPassMap(prev => ({ ...prev, [userId]: !prev[userId] }));

  const openEdit = (user: Credential) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setNewPassword("");
    setShowEditPass(false);
  };

  const saveCredentials = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_BASE_URL}/Auth/credentials/${editingUser.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername: newUsername,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Credentials updated successfully!");
        setEditingUser(null);
        loadCredentials();
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${API_BASE_URL}/Auth/user/${userId}`, { method: "DELETE" });
      loadCredentials();
    } catch (err) {
      console.error(err);
    }
  };

  const roleColor = (rid: number) => {
    switch (rid) {
      case 1: return "bg-purple-100 text-purple-700";
      case 2: return "bg-blue-100 text-blue-700";
      case 3: return "bg-orange-100 text-orange-700";
      case 4: return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Username &amp; Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* ── Filters ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">

            {/* School — only for SuperAdmin/Admin */}
           {(roleId === 1 || roleId === 2 || roleId === 5) && (
              <div>
                <Label>School</Label>
                <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                  <SelectTrigger><SelectValue placeholder="All Schools" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    {contextSchools.map(s => (
  <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
    {s.schoolName}
  </SelectItem>
))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Academic Year */}
            <div>
              <Label>Academic Year</Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
                disabled={!selectedSchool || selectedSchool === "all"}>
                <SelectTrigger><SelectValue placeholder="All Years" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {academicYears.map(y => (
                    <SelectItem key={y.academicYearId} value={y.academicYearId.toString()}>
                      {y.academicYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Name or mobile..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loadCredentials()}
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button onClick={loadCredentials} disabled={loading} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto rounded border">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-2 text-left">SrNo</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">School</th>
                  <th className="p-2 text-left">Academic Year</th>
                  <th className="p-2 text-left">Username</th>
                  <th className="p-2 text-left">Password</th>
                  <th className="p-2 text-left">Contact</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {credentials.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-muted-foreground">
                      {loading ? "Loading..." : "No records found."}
                    </td>
                  </tr>
                ) : (
                  credentials.map((c, idx) => (
                    <tr key={c.userId} className="border-t hover:bg-muted/20">
                      <td className="p-2 text-muted-foreground">{idx + 1}</td>
                      <td className="p-2 font-medium">{c.firstName} {c.lastName}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor(c.roleId)}`}>
                          {c.roleName}
                        </span>
                      </td>
                      <td className="p-2 text-xs">{c.schoolName}</td>
                      <td className="p-2 text-xs">{c.academicYearName}</td>
                      <td className="p-2">{c.username}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <span className="font-mono">
                            {showPassMap[c.userId] ? c.password : "••••••••"}
                          </span>
                          <button onClick={() => togglePass(c.userId)} className="text-muted-foreground hover:text-foreground">
                            {showPassMap[c.userId]
                              ? <EyeOff className="w-3.5 h-3.5" />
                              : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-2">{c.contact}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteUser(c.userId)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {credentials.length > 0 && (
            <p className="text-xs text-muted-foreground text-right">
              Total: {credentials.length} records
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Edit Modal ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md shadow-xl bg-white">
            <CardHeader>
              <CardTitle>Edit Credentials</CardTitle>
              <p className="text-sm text-muted-foreground">
                {editingUser.firstName} {editingUser.lastName} — {editingUser.roleName}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input value={newUsername} onChange={e => setNewUsername(e.target.value)} />
              </div>
              <div>
                <Label>New Password <span className="text-muted-foreground text-xs">(leave blank to keep current)</span></Label>
                <div className="relative">
                  <Input
                    type={showEditPass ? "text" : "password"}
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPass(!showEditPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showEditPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button onClick={saveCredentials}>Save</Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}