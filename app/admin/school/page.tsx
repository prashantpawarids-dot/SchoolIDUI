"use client";
import { imgUrl } from "@/lib/image-utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSchools } from "@/lib/school-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, Upload, Eye } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/School";

export default function AdminSchoolsPage() {
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddYear, setShowAddYear] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [viewSchool, setViewSchool] = useState<any>(null);
  const { schools, reloadSchools } = useSchools();

  // ✅ CHANGED: added cardTemplateFront, cardTemplateBack, principalSignature
  const [schoolForm, setSchoolForm] = useState<any>({
    schoolName: "",
    schoolAddress: "",
    contactPerson: "",
    contactNumber: "",
    schoolLogo: "",
    cardTemplateFront: "",
    cardTemplateBack: "",
    principalSignature: "",
  });

  const [yearForm, setYearForm] = useState<any>({
    schoolId: "",
    academicYear: "",
  });

  const [cardOrientation, setCardOrientation] = useState<"portrait" | "landscape">("portrait");

 

const handleFileToBase64 = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview instantly — no waiting
    const localPreview = URL.createObjectURL(file);
    setSchoolForm((prev: any) => ({ ...prev, [field]: localPreview }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/File/upload/schools`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.success) {
        // Silently replace blob URL with server URL — preview stays visible
        setSchoolForm((prev: any) => ({
          ...prev,
          [field]: data.url + `?t=${Date.now()}`,
        }));
      } else {
        // Keep local preview, just warn
        console.warn("Upload failed:", data.message);
      }
    } catch {
      // Keep local preview on network error
      console.warn("Upload failed, keeping local preview");
    }
  };

  const saveSchool = async () => {
    if (!schoolForm.schoolName || !schoolForm.contactNumber) {
      alert("School Name and Contact Number are required.");
      return;
    }

    try {
      const url = editingSchoolId
        ? `${BASE_URL}/updateschool/${editingSchoolId}`
        : `${BASE_URL}/addschool`;

      // ✅ CHANGED: added cardTemplateFront, cardTemplateBack, principalSignature to payload
      const payload = {
        schoolName: schoolForm.schoolName,
        schoolAddress: schoolForm.schoolAddress,
        contactPerson: schoolForm.contactPerson,
        contactNumber: schoolForm.contactNumber,
        schoolLogo: schoolForm.schoolLogo,
        cardTemplateFront: schoolForm.cardTemplateFront,
        cardTemplateBack: schoolForm.cardTemplateBack,
        principalSignature: schoolForm.principalSignature,
      };

      // const res = await fetch(url, {
      //   method: editingSchoolId ? "PUT" : "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });

      const userId = localStorage.getItem("userId");

      const res = await fetch(url, {
        method: editingSchoolId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          userId: userId || "",
        },
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
      // ✅ CHANGED: reset includes new fields
      setSchoolForm({
        schoolName: "",
        schoolAddress: "",
        contactPerson: "",
        contactNumber: "",
        schoolLogo: "",
        cardTemplateFront: "",
        cardTemplateBack: "",
        principalSignature: "",
      });
      reloadSchools();
    } catch (error: any) {
      console.error("Error saving school:", error);
      alert("Failed to save school");
    }
  };
  const formatImage = (img: string) => {
    if (!img) return "";
    return img.startsWith("data:image") ? img : `data:image/png;base64,${img}`;
  };

  const editSchool = (school: any) => {
    setEditingSchoolId(school.schoolId);
    setSchoolForm({
      schoolName: school.schoolName || "",
      schoolAddress: school.schoolAddress || "",
      contactPerson: school.contactPerson || "",
      contactNumber: school.contactNumber || "",
      //   schoolLogo: formatImage(school.schoolLogo),
      //  cardTemplateFront: formatImage(school.cardTemplateFront),
      //  cardTemplateBack: formatImage(school.cardTemplateBack),
      //  principalSignature: formatImage(school.principalSignature),
      schoolLogo: school.schoolLogo || "",
      cardTemplateFront: school.cardTemplateFront || "",
      cardTemplateBack: school.cardTemplateBack || "",
      principalSignature: school.principalSignature || "",
    });
    setShowAddSchool(true);
    setShowAddYear(false);
  };

  const deleteSchool = async (schoolId: number) => {
    if (!confirm("Are you sure you want to delete this school?")) return;
    try {
      await fetch(`${BASE_URL}/deleteschool/${schoolId}`, { method: "DELETE" });
      reloadSchools();
    } catch (error) {
      console.error("Failed to delete school:", error);
    }
  };

  const viewSchoolCard = (school: any) => {
    setViewSchool(school);
  };

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
                // ✅ CHANGED: reset includes new fields
                setSchoolForm({
                  schoolName: "",
                  schoolAddress: "",
                  contactPerson: "",
                  contactNumber: "",
                  schoolLogo: "",
                  cardTemplateFront: "",
                  cardTemplateBack: "",
                  principalSignature: "",
                });
              }}
            >
              ➕ Add School
            </Button>
            <Button
              onClick={() => {
                setShowAddYear(true);
                setShowAddSchool(false);
              }}
            >
              ➕ Add Academic Year
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">SrNo</th>
                  <th className="text-left p-2">School Name</th>
                  <th className="text-left p-2">Address</th>
                  <th className="text-left p-2">Contact</th>
                  {/* ✅ CHANGED: added Template column */}
                  <th className="text-left p-2">Template</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, idx) => (
                  <tr
                    key={school.schoolId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{school.schoolName}</td>
                    <td className="p-2">{school.schoolAddress}</td>
                    <td className="p-2">{school.contactNumber}</td>
                    {/* ✅ CHANGED: show template upload status */}
                    <td className="p-2">
                      {school.cardTemplateFront ? (
                        <span className="text-green-600 text-xs font-medium">
                          ✅ Uploaded
                        </span>
                      ) : (
                        <span className="text-amber-500 text-xs">
                          ⚠ No Template
                        </span>
                      )}
                    </td>
                    <td className="p-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewSchoolCard(school)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editSchool(school)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSchool(school.schoolId)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit School Modal */}
      {showAddSchool && (
        <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl shadow-lg z-50 bg-white">
          <CardHeader>
            <CardTitle>
              {editingSchoolId ? "Edit School" : "Add New School"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* ✅ CHANGED: replaced single logo upload with 4 upload boxes */}
             {/* Orientation toggle — display only, helps user choose template shape */}
              <div className="md:col-span-2">
                <Label>Card Orientation</Label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="cardOrientation"
                      checked={cardOrientation === "portrait"}
                      onChange={() => setCardOrientation("portrait")}
                    />
                    Portrait
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name="cardOrientation"
                      checked={cardOrientation === "landscape"}
                      onChange={() => setCardOrientation("landscape")}
                    />
                    Landscape
                  </label>
                </div>
              </div>

              {/* Upload boxes — click box to upload, light grey bg so white templates stay visible */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "School Logo", field: "schoolLogo" },
                  {
                    label: "ID Card Front Template",
                    field: "cardTemplateFront",
                  },
                  { label: "ID Card Back Template", field: "cardTemplateBack" },
                  { label: "Principal Signature", field: "principalSignature" },
                ].map(({ label, field }) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label>{label}</Label>
                    <label
                      htmlFor={`upload-${field}`}
                      className="w-full h-28 rounded border flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: "#d1d5db" }}
                    >
                      {schoolForm[field] ? (
                        <img
                          src={
                            schoolForm[field]?.startsWith("blob:") ||
                            schoolForm[field]?.startsWith("data:")
                              ? schoolForm[field]
                              : imgUrl(schoolForm[field])
                          }
                          alt={label}
                          className="w-full h-full object-contain"
                          key={schoolForm[field]}
                        />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-500" />
                      )}
                    </label>
                    <input
                      id={`upload-${field}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileToBase64(e, field)}
                    />
                  </div>
                ))}
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

      {/* Add Academic Year Modal — unchanged */}
      {showAddYear && (
        <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-lg shadow-lg z-50 bg-white">
          <CardHeader>
            <CardTitle>Add Academic Year</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Select School</Label>
                <Select
                  value={yearForm.schoolId}
                  onValueChange={(value) =>
                    setYearForm({ ...yearForm, schoolId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem
                        key={school.schoolId}
                        value={school.schoolId.toString()}
                      >
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
          <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-center mt-6">
              <div className="w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden">
                {viewSchool.schoolLogo ? (
                  <img
                    // src={
                    //   viewSchool.schoolLogo?.startsWith("data:image")
                    //     ? viewSchool.schoolLogo
                    //     : `data:image/png;base64,${viewSchool.schoolLogo}`
                    // }
                    src={imgUrl(viewSchool.schoolLogo)}
                    alt="School Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 m-auto" />
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-4 text-gray-700">
              <h2 className="text-2xl font-bold text-center">
                {viewSchool.schoolName}
              </h2>

              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Address: </span>
                  {viewSchool.schoolAddress}
                </div>
                <div>
                  <span className="font-semibold">Contact Person: </span>
                  {viewSchool.contactPerson}
                </div>
                <div>
                  <span className="font-semibold">Contact Number: </span>
                  {viewSchool.contactNumber}
                </div>
              </div>

              {/* Templates */}
              {(viewSchool.cardTemplateFront ||
                viewSchool.cardTemplateBack) && (
                <div className="space-y-3 pt-2 border-t">
                  <p className="font-semibold text-sm">ID Card Templates</p>

                  <div className="grid grid-cols-2 gap-3">
                    {viewSchool.cardTemplateFront && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Front</p>
                        <img
                          // src={
                          //   viewSchool.cardTemplateFront?.startsWith("data:image")
                          //     ? viewSchool.cardTemplateFront
                          //     : `data:image/png;base64,${viewSchool.cardTemplateFront}`
                          // }
                          src={imgUrl(viewSchool.cardTemplateFront)}
                          className="w-full rounded border"
                          alt="Front Template"
                        />
                      </div>
                    )}

                    {viewSchool.cardTemplateBack && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Back</p>
                        <img
                          // src={
                          //   viewSchool.cardTemplateBack?.startsWith("data:image")
                          //     ? viewSchool.cardTemplateBack
                          //     : `data:image/png;base64,${viewSchool.cardTemplateBack}`
                          // }
                          src={imgUrl(viewSchool.cardTemplateBack)}
                          className="w-full rounded border"
                          alt="Back Template"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Principal Signature */}
              {viewSchool.principalSignature && (
                <div className="pt-2 border-t">
                  <p className="font-semibold text-sm mb-2">
                    Principal Signature
                  </p>
                  <img
                    // src={
                    //   viewSchool.principalSignature?.startsWith("data:image")
                    //     ? viewSchool.principalSignature
                    //     : `data:image/png;base64,${viewSchool.principalSignature}`
                    // }
                    src={imgUrl(viewSchool.principalSignature)}
                    className="h-16 object-contain"
                    alt="Principal Signature"
                  />
                </div>
              )}
            </CardContent>

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
