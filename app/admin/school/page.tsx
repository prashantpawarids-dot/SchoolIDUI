// "use client"
// import { useState } from "react"
// import { PageHeader } from "@/components/common/page-header"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Edit2, Building2, Save, Upload } from "lucide-react"
// import { mockSchoolSection } from "@/lib/mock-data"

// export default function SchoolManagement() {
//   const [schoolData, setSchoolData] = useState(mockSchoolSection)
//   const [isEditing, setIsEditing] = useState(false)

//   const handleSave = () => {
//     setIsEditing(false)
//     // API call to save school data
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader title="School Settings" description="Manage school information and branding" />

//       <Tabs defaultValue="info" className="space-y-6">
//         <TabsList className="grid w-full max-w-md grid-cols-2">
//           <TabsTrigger value="info">School Information</TabsTrigger>
//           <TabsTrigger value="branding">Branding</TabsTrigger>
//         </TabsList>

//         {/* School Information Tab */}
//         <TabsContent value="info">
//           <Card className="shadow-lg border-0">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle className="flex items-center gap-2">
//                   <Building2 className="w-5 h-5 text-primary" />
//                   School Information
//                 </CardTitle>
//                 <CardDescription>Basic school details displayed on ID cards</CardDescription>
//               </div>
//               {!isEditing ? (
//                 <Button onClick={() => setIsEditing(true)} variant="outline">
//                   <Edit2 className="w-4 h-4 mr-2" />
//                   Edit
//                 </Button>
//               ) : (
//                 <div className="flex gap-2">
//                   <Button onClick={() => setIsEditing(false)} variant="outline">
//                     Cancel
//                   </Button>
//                   <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
//                     <Save className="w-4 h-4 mr-2" />
//                     Save
//                   </Button>
//                 </div>
//               )}
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label>School Name (Tenant Name)</Label>
//                   <Input
//                     value={schoolData.tenantName}
//                     onChange={(e) => setSchoolData({ ...schoolData, tenantName: e.target.value })}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Phone Number</Label>
//                   <Input
//                     value={schoolData.tenantPhone}
//                     onChange={(e) => setSchoolData({ ...schoolData, tenantPhone: e.target.value })}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Email Address</Label>
//                   <Input
//                     type="email"
//                     value={schoolData.tenantEmail}
//                     onChange={(e) => setSchoolData({ ...schoolData, tenantEmail: e.target.value })}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Record Status</Label>
//                   <div className="flex items-center gap-2">
//                     <Badge className={schoolData.recordStatus === "A" ? "bg-green-500" : "bg-red-500"}>
//                       {schoolData.recordStatus === "A" ? "Active" : "Inactive"}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">
//                       Created: {new Date(schoolData.createdOn).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>School Address (Tenant Address)</Label>
//                 <Textarea
//                   value={schoolData.tenantAddress}
//                   onChange={(e) => setSchoolData({ ...schoolData, tenantAddress: e.target.value })}
//                   disabled={!isEditing}
//                   rows={3}
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Branding Tab */}
//         <TabsContent value="branding">
//           <Card className="shadow-lg border-0">
//             <CardHeader>
//               <CardTitle>School Branding</CardTitle>
//               <CardDescription>Logo and visual identity for ID cards</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex flex-col md:flex-row gap-8">
//                 <div className="space-y-4">
//                   <Label>School Logo</Label>
//                   <div className="w-40 h-40 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/30 overflow-hidden">
//                     {schoolData.logoUrl ? (
//                       <img
//                         src={schoolData.logoUrl || "/placeholder.svg"}
//                         alt="School Logo"
//                         className="w-full h-full object-contain p-4"
//                       />
//                     ) : (
//                       <div className="text-center">
//                         <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
//                         <p className="text-xs text-muted-foreground">Upload Logo</p>
//                       </div>
//                     )}
//                   </div>
//                   <Input type="file" accept="image/*" className="w-40" />
//                   <p className="text-xs text-muted-foreground">Recommended: 200x200px PNG</p>
//                 </div>

//                 <div className="flex-1 space-y-4">
//                   <div>
//                     <Label className="mb-2 block">ID Card Preview</Label>
//                     <div className="bg-gradient-to-br from-primary to-primary/90 rounded-xl p-6 text-white max-w-xs">
//                       <div className="text-center border-b border-white/20 pb-4 mb-4">
//                         <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
//                           <Building2 className="w-6 h-6 text-primary" />
//                         </div>
//                         <h3 className="font-bold text-sm">{schoolData.tenantName}</h3>
//                         <p className="text-xs opacity-80">Student Identity Card</p>
//                       </div>
//                       <div className="text-center text-xs opacity-70">
//                         <p>{schoolData.tenantAddress}</p>
//                         <p className="mt-1">{schoolData.tenantPhone}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, Upload, Eye } from "lucide-react";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/School";

const BASE_URL = "/api/proxy"+"/School";

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddYear, setShowAddYear] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [viewSchool, setViewSchool] = useState<any>(null);

  const [schoolForm, setSchoolForm] = useState<any>({
    schoolName: "",
    schoolAddress: "",
    contactPerson: "",
    contactNumber: "",
    schoolLogo: "",
  });

  const [yearForm, setYearForm] = useState<any>({
    schoolId: "",
    academicYear: "",
  });

  // Load schools
  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const res = await fetch(`${BASE_URL}/list`);
      const data = await res.json();
      setSchools(data);
    } catch (error) {
      console.error("Failed to load schools:", error);
    }
  };

  // Handle logo file
  const handleLogoFile = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSchoolForm({
        ...schoolForm,
        schoolLogo: reader.result?.toString() || "",
      });
    };
    reader.readAsDataURL(file);
  };

  // Save or update school
  const saveSchool = async () => {
    if (!schoolForm.schoolName || !schoolForm.contactNumber) {
      alert("School Name and Contact Number are required.");
      return;
    }

    try {
      const url = editingSchoolId
        ? `${BASE_URL}/updateschool/${editingSchoolId}`
        : `${BASE_URL}/addschool`;

      // Only send necessary fields
      const payload = {
        schoolName: schoolForm.schoolName,
        schoolAddress: schoolForm.schoolAddress,
        contactPerson: schoolForm.contactPerson,
        contactNumber: schoolForm.contactNumber,
        schoolLogo: schoolForm.schoolLogo,
      };

      const res = await fetch(url, {
        method: editingSchoolId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to save school:\n" + JSON.stringify(err, null, 2));
        return;
      }

      const data = await res.json();
      alert(data.message || "School saved successfully");

      setShowAddSchool(false);
      setEditingSchoolId(null);
      setSchoolForm({
        schoolName: "",
        schoolAddress: "",
        contactPerson: "",
        contactNumber: "",
        schoolLogo: "",
      });
      loadSchools();
    } catch (error: any) {
      console.error("Error saving school:", error);
      alert("Failed to save school");
    }
  };

  // Edit school
  const editSchool = (school: any) => {
    setEditingSchoolId(school.schoolId);
    setSchoolForm({
      schoolName: school.schoolName || "",
      schoolAddress: school.schoolAddress || "",
      contactPerson: school.contactPerson || "",
      contactNumber: school.contactNumber || "",
      schoolLogo: school.schoolLogo || "",
    });
    setShowAddSchool(true);
    setShowAddYear(false);
  };

  // Delete school
  const deleteSchool = async (schoolId: number) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    try {
      await fetch(`${BASE_URL}/deleteschool/${schoolId}`, { method: "DELETE" });
      loadSchools();
    } catch (error) {
      console.error("Failed to delete school:", error);
    }
  };

  // View school
  const viewSchoolCard = (school: any) => {
    setViewSchool(school);
  };

  // Save academic year
  const saveYear = async () => {
    if (!yearForm.schoolId || !yearForm.academicYear) {
      alert("Please select a school and enter an academic year.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/addacademicyear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(yearForm),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Failed to add academic year:\n" + JSON.stringify(err, null, 2));
        return;
      }

      const data = await res.json();
      alert(data.message || "Academic Year added");
      setShowAddYear(false);
      setYearForm({ schoolId: "", academicYear: "" });
    } catch (error) {
      console.error("Error adding academic year:", error);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Schools Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>School Management</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowAddSchool(true);
                setShowAddYear(false);
                setEditingSchoolId(null);
                setSchoolForm({
                  schoolName: "",
                  schoolAddress: "",
                  contactPerson: "",
                  contactNumber: "",
                  schoolLogo: "",
                });
              }}>
              ➕ Add School
            </Button>
            <Button
              onClick={() => {
                setShowAddYear(true);
                setShowAddSchool(false);
              }}>
              ➕ Add Academic Year
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">SrNo</th>
                <th className="text-left p-2">School Name</th>
                <th className="text-left p-2">Address</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school, idx) => (
                <tr key={school.schoolId} className="border-b hover:bg-gray-50">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{school.schoolName}</td>
                  <td className="p-2">{school.schoolAddress}</td>
                  <td className="p-2">{school.contactNumber}</td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => viewSchoolCard(school)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editSchool(school)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSchool(school.schoolId)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add/Edit School Modal */}
      {showAddSchool && (
        <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-lg shadow-lg z-50 bg-white">
          <CardHeader>
            <CardTitle>
              {editingSchoolId ? "Edit School" : "Add New School"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>School Name</Label>
                <Input
                  value={schoolForm.schoolName}
                  onChange={(e) =>
                    setSchoolForm({ ...schoolForm, schoolName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={schoolForm.schoolAddress}
                  onChange={(e) =>
                    setSchoolForm({
                      ...schoolForm,
                      schoolAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Contact Person</Label>
                <Input
                  value={schoolForm.contactPerson}
                  onChange={(e) =>
                    setSchoolForm({
                      ...schoolForm,
                      contactPerson: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input
                  value={schoolForm.contactNumber}
                  onChange={(e) =>
                    setSchoolForm({
                      ...schoolForm,
                      contactNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <Label>School Logo</Label>
                <div className="w-32 h-32 rounded border flex items-center justify-center overflow-hidden bg-gray-100">
                  {schoolForm.schoolLogo ? (
                    <img
                      src={schoolForm.schoolLogo}
                      alt="School Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleLogoFile} />
              </div>
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <Button onClick={saveSchool}>
                {editingSchoolId ? "Update" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddSchool(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Academic Year Modal */}
      {showAddYear && (
        <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-lg shadow-lg z-50 bg-white">
          <CardHeader>
            <CardTitle>Add Academic Year</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Select School</Label>
                <Select
                  value={yearForm.schoolId}
                  onValueChange={(value) =>
                    setYearForm({ ...yearForm, schoolId: value })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem
                        key={school.schoolId}
                        value={school.schoolId.toString()}>
                        {school.schoolName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Academic Year</Label>
                <Input
                  placeholder="2024-2025"
                  value={yearForm.academicYear}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, academicYear: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              <Button onClick={saveYear}>Save</Button>
              <Button variant="outline" onClick={() => setShowAddYear(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View School Card Modal */}
      {viewSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden bg-white">
            {/* Logo */}
            <div className="flex justify-center mt-6">
              <div className="w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden">
                {viewSchool.schoolLogo ? (
                  <img
                    src={`data:image/png;base64,${viewSchool.schoolLogo}`}
                    alt="School Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 m-auto" />
                )}
              </div>
            </div>

            {/* School Info */}
            <CardContent className="p-6 space-y-4 text-gray-700">
              <h2 className="text-2xl font-bold text-center">
                {viewSchool.schoolName}
              </h2>

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Address: </span>
                  <span>{viewSchool.schoolAddress}</span>
                </div>
                <div>
                  <span className="font-semibold">Contact Person: </span>
                  <span>{viewSchool.contactPerson}</span>
                </div>
                <div>
                  <span className="font-semibold">Contact Number: </span>
                  <span>{viewSchool.contactNumber}</span>
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="p-4 flex justify-center border-t">
              <Button variant="outline" onClick={() => setViewSchool(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
