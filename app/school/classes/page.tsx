"use client";
import { useState, useEffect } from "react";
import axios from "axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit2, Trash2, BookOpen, Layers } from "lucide-react";
import type { Class, Division, School, AcademicYear } from "@/lib/types";

export default function ManageClasses() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [schools, setSchools] = useState<School[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);

  const [selectedSchool, setSelectedSchool] = useState<number | "">("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | "">(
    ""
  );
  const [selectedClassForDivision, setSelectedClassForDivision] = useState<
    number | ""
  >("");

  const [newClassName, setNewClassName] = useState("");
  const [newDivisionName, setNewDivisionName] = useState("");

  const [editClass, setEditClass] = useState<Class | null>(null);
  const [editDivision, setEditDivision] = useState<Division | null>(null);
  const [deleteClassId, setDeleteClassId] = useState<number | null>(null);
  const [deleteDivisionId, setDeleteDivisionId] = useState<number | null>(null);

  const [editClassName, setEditClassName] = useState("");
  const [editDivisionName, setEditDivisionName] = useState("");

  // ----------------- FETCH FUNCTIONS -----------------
const fetchSchools = async () => {
  try {
    const res = await axios.get<School[]>(`${API_BASE}/School/list`);

    // Get logged-in schoolId from localStorage
    const schoolId = Number(localStorage.getItem("schoolId"));
    if (!schoolId) {
      console.warn("No logged-in schoolId found");
      setSchools([]);
      return;
    }

    // Filter only the logged-in school
    const filteredSchool = res.data.filter((s) => s.schoolId === schoolId);
    setSchools(filteredSchool);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch schools.");
  }
};


  const fetchAcademicYears = async (schoolId: number) => {
    try {
      const res = await axios.get<AcademicYear[]>(
        `${API_BASE}/School/academicyear/${schoolId}`
      );
      setAcademicYears(res.data);
    } catch (err) {
      console.error(err);
      setAcademicYears([]);
      alert("Failed to fetch academic years.");
    }
  };

 const fetchClasses = async () => {
  try {
    const res = await axios.get<Class[]>(`${API_BASE}/ClassDivision/getclasses`);

    // Filter classes for logged-in school
    const schoolId = Number(localStorage.getItem("schoolId"));
    if (!schoolId) {
      console.warn("No logged-in schoolId found");
      setClasses([]);
      setDivisions([]); // clear divisions if no school
      return;
    }

    const filteredClasses = res.data.filter((c) => c.schoolId === schoolId);
    setClasses(filteredClasses);

    // Automatically fetch divisions for these classes
    const classIds = filteredClasses.map((c) => c.classId);
    fetchDivisions(classIds);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch classes.");
  }
};

// Update fetchDivisions to accept multiple class IDs
const fetchDivisions = async (classIds: number[] = []) => {
  try {
    const res = await axios.get<Division[]>(`${API_BASE}/ClassDivision/getdivisions`);

    // Filter divisions for the given class IDs
    const filteredDivisions = classIds.length
      ? res.data.filter((d) => classIds.includes(d.classId))
      : [];

    setDivisions(filteredDivisions);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch divisions.");
  }
};

// useEffect
useEffect(() => {
  fetchSchools();
  fetchClasses(); // divisions will automatically be fetched after classes
}, []);


  useEffect(() => {
    if (selectedSchool !== "") {
      fetchAcademicYears(Number(selectedSchool));
    } else {
      setAcademicYears([]);
      setSelectedAcademicYear("");
    }
  }, [selectedSchool]);

  // ----------------- ADD FUNCTIONS -----------------
  const handleAddClass = async () => {
    if (!newClassName || selectedSchool === "" || selectedAcademicYear === "") {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post<Class>(
        `${API_BASE}/ClassDivision/addclass`,
        {
          schoolId: Number(selectedSchool),
          academicYearId: Number(selectedAcademicYear),
          className: newClassName,
        }
      );
      setClasses([...classes, res.data]);
      setNewClassName("");
      setSelectedSchool("");
      setSelectedAcademicYear("");
      alert("Class added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add class");
    }
  };

  const handleAddDivision = async () => {
    if (!newDivisionName || selectedClassForDivision === "") {
      alert("Please select a class and enter a division name.");
      return;
    }
    try {
      const res = await axios.post<Division>(
        `${API_BASE}/ClassDivision/adddivision`,
        {
          classId: Number(selectedClassForDivision),
          divisionName: newDivisionName,
        }
      );
      setDivisions([...divisions, res.data]);
      setNewDivisionName("");
      setSelectedClassForDivision("");
      alert("Division added successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add division. Please try again.");
    }
  };

  // ----------------- EDIT FUNCTIONS -----------------
  const handleEditClass = async () => {
    if (!editClass || !editClassName) {
      alert("Class name cannot be empty.");
      return;
    }
    try {
      const payload = {
        classId: editClass.classId,
        schoolId: editClass.schoolId,
        academicYearId: editClass.academicYearId,
        className: editClassName,
      };
      await axios.put(
        `${API_BASE}/ClassDivision/editclass/${editClass.classId}`,
        payload
      );
      setClasses(
        classes.map((c) =>
          c.classId === editClass.classId
            ? { ...c, className: editClassName }
            : c
        )
      );
      setEditClass(null);
      alert("Class updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update class.");
    }
  };

  const handleEditDivision = async () => {
    if (!editDivision || !editDivisionName) {
      alert("Division name cannot be empty.");
      return;
    }
    try {
      const payload = {
        divisionId: editDivision.divisionId,
        classId: editDivision.classId,
        divisionName: editDivisionName,
      };
      await axios.put(
        `${API_BASE}/ClassDivision/editdivision/${editDivision.divisionId}`,
        payload
      );
      setDivisions(
        divisions.map((d) =>
          d.divisionId === editDivision.divisionId
            ? { ...d, divisionName: editDivisionName }
            : d
        )
      );
      setEditDivision(null);
      alert("Division updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update division.");
    }
  };

  // ----------------- DELETE FUNCTIONS -----------------
  const handleDeleteClass = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/ClassDivision/deleteclass/${id}`);
      setClasses(classes.filter((c) => c.classId !== id));
      alert("Class deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete class.");
    }
  };

  const handleDeleteDivision = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/ClassDivision/deletedivision/${id}`);
      setDivisions(divisions.filter((d) => d.divisionId !== id));
      alert("Division deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete division.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Classes & Divisions"
        description="Configure school classes and their divisions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ----------------- CLASSES SECTION ----------------- */}
        <Card className="shadow-lg border-0">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Classes
              </CardTitle>
              <CardDescription>{classes.length} active classes</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select School</Label>
                    <Select
                      value={
                        selectedSchool === "" ? "" : selectedSchool.toString()
                      }
                      onValueChange={(val) => setSelectedSchool(Number(val))}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((s) => (
                          <SelectItem
                            key={s.schoolId}
                            value={s.schoolId.toString()}>
                            {s.schoolName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Academic Year</Label>
                    <Select
                      value={
                        selectedAcademicYear === ""
                          ? ""
                          : selectedAcademicYear.toString()
                      }
                      onValueChange={(val) =>
                        setSelectedAcademicYear(Number(val))
                      }>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((y) => (
                          <SelectItem
                            key={y.academicYearId}
                            value={y.academicYearId.toString()}>
                            {y.academicYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class Name</Label>
                    <Input
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="e.g., Class 11"
                    />
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleAddClass}>
                    Add Class
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SrNo</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls, idx) => {
                  const schoolName =
                    schools.find((s) => s.schoolId === cls.schoolId)
                      ?.schoolName || "";
                  return (
                    <TableRow key={cls.classId}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{cls.className}</TableCell>
                      <TableCell>{schoolName}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog
                          open={editClass?.classId === cls.classId}
                          onOpenChange={(open) => !open && setEditClass(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditClass(cls);
                                setEditClassName(cls.className);
                              }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Class</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label>Class Name</Label>
                              <Input
                                value={editClassName}
                                onChange={(e) =>
                                  setEditClassName(e.target.value)
                                }
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditClass(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditClass}>Save</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={deleteClassId === cls.classId}
                          onOpenChange={(open) =>
                            !open && setDeleteClassId(null)
                          }>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteClassId(cls.classId)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Class</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this class? All
                              associated divisions will also be affected.
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2">
                              <AlertDialogCancel
                                onClick={() => setDeleteClassId(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteClassId &&
                                  handleDeleteClass(deleteClassId)
                                }
                                className="bg-destructive">
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ----------------- DIVISIONS SECTION ----------------- */}
        <Card className="shadow-lg border-0">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent" /> Divisions
              </CardTitle>
              <CardDescription>
                {divisions.length} active divisions
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Division</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Class</Label>
                    <Select
                      value={
                        selectedClassForDivision === ""
                          ? ""
                          : selectedClassForDivision.toString()
                      }
                      onValueChange={(val) =>
                        setSelectedClassForDivision(Number(val))
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem
                            key={c.classId}
                            value={c.classId.toString()}>
                            {c.className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Division Name</Label>
                    <Input
                      value={newDivisionName}
                      onChange={(e) => setNewDivisionName(e.target.value)}
                      placeholder="e.g., A, B, C"
                    />
                  </div>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90"
                    onClick={handleAddDivision}>
                    Add Division
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SrNo</TableHead>
                  <TableHead>Division Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {divisions.map((div, idx) => {
                  const clsName =
                    classes.find((c) => c.classId === div.classId)?.className ||
                    "";
                  return (
                    <TableRow key={div.divisionId}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{div.divisionName}</TableCell>
                      <TableCell>{clsName}</TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog
                          open={editDivision?.divisionId === div.divisionId}
                          onOpenChange={(open) =>
                            !open && setEditDivision(null)
                          }>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditDivision(div);
                                setEditDivisionName(div.divisionName);
                              }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Division</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Label>Division Name</Label>
                              <Input
                                value={editDivisionName}
                                onChange={(e) =>
                                  setEditDivisionName(e.target.value)
                                }
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditDivision(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditDivision}>
                                  Save
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={deleteDivisionId === div.divisionId}
                          onOpenChange={(open) =>
                            !open && setDeleteDivisionId(null)
                          }>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setDeleteDivisionId(div.divisionId)
                              }>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Division</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this division?
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2">
                              <AlertDialogCancel
                                onClick={() => setDeleteDivisionId(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteDivisionId &&
                                  handleDeleteDivision(deleteDivisionId)
                                }
                                className="bg-destructive">
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
