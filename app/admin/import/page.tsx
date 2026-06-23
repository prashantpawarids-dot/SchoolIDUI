"use client";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useSchools } from "@/lib/school-context";
import { PageHeader } from "@/components/common/page-header";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  UploadCloud, FileSpreadsheet, Download, CheckCircle,
  AlertCircle, Loader2, X, Info, ChevronRight,
} from "lucide-react";
import type { School, AcademicYear, Class } from "@/lib/types";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ExcelRow {
  DivisionName: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  RollNo: string;
  DOB: string;
  BloodGroup?: string;
  Address?: string;
  ParentFirstName: string;
  ParentLastName: string;
  ParentEmail: string;
  ParentContact: string;
}

interface RowResult {
  rowIndex: number;
  rollNo: string;
  studentName: string;
  status: "success" | "error";
  message: string;
}

const REQUIRED_COLUMNS: (keyof ExcelRow)[] = [
  "DivisionName", "FirstName", "LastName",
  "RollNo", "DOB", "ParentFirstName", "ParentLastName",
  "ParentEmail", "ParentContact",
];


 const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
/* ─────────────────────────────────────────────
   TEMPLATE DOWNLOAD
  (ClassName not needed — selected via UI)
───────────────────────────────────────────── */
function downloadTemplate() {
  const headers = [
    "DivisionName", "FirstName", "MiddleName", "LastName",
    "RollNo", "DOB", "BloodGroup", "Address",
    "ParentFirstName", "ParentLastName", "ParentEmail", "ParentContact",
  ];
  const sample = [
    "A", "Aarav", "", "Shah",
    "R001", "2015-06-15", "O+", "123 Main St",
    "Raj", "Shah", "raj.shah@email.com", "9876543210",
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, sample]);
  ws["!cols"] = headers.map(() => ({ wch: 18 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, "student_import_template.xlsx");
}

/* ─────────────────────────────────────────────
   STEP BADGE
───────────────────────────────────────────── */
function StepBadge({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2
        ${done ? "bg-green-600 text-white" : "bg-primary text-primary-foreground"}`}
    >
      {done ? <CheckCircle className="w-3.5 h-3.5" /> : n}
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ImportExcelPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { schools } = useSchools();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses]             = useState<Class[]>([]);

  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedYear,   setSelectedYear]   = useState("");
  const [selectedClass,  setSelectedClass]  = useState("");

  const [fileName,         setFileName]         = useState("");
  const [allRows,          setAllRows]          = useState<ExcelRow[]>([]);
  const [previewRows,      setPreviewRows]      = useState<ExcelRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [importing,  setImporting]  = useState(false);
  const [results,    setResults]    = useState<RowResult[]>([]);
  const [importDone, setImportDone] = useState(false);

  /* ══════════════════════════════════════════
     DATA FETCHING
  ══════════════════════════════════════════ */
  // useEffect(() => {
  //   fetch(`${API_BASE_URL}/School/list`)
  //     .then((r) => r.json())
  //     .then(setSchools)
  //     .catch(console.error);
  // }, []);

  // When school changes → load academic years
  useEffect(() => {
    if (!selectedSchool) return;
    setSelectedYear("");
    setSelectedClass("");
    setAcademicYears([]);
    setClasses([]);
    clearFile();

    fetch(`${API_BASE_URL}/School/academicyear/${selectedSchool}`)
      .then((r) => r.json())
      .then(setAcademicYears)
      .catch(console.error);
  }, [selectedSchool]);

  // When year changes → load classes
  useEffect(() => {
    if (!selectedSchool || !selectedYear) return;
    setSelectedClass("");
    setClasses([]);
    clearFile();

    fetch(`${API_BASE_URL}/ClassDivision/getclasses?schoolId=${selectedSchool}`)
      .then((r) => r.json())
      .then(setClasses)
      .catch(console.error);
  }, [selectedYear]);

  // When class changes → clear file
  useEffect(() => {
    if (selectedClass) clearFile();
  }, [selectedClass]);

  /* ══════════════════════════════════════════
     FILE HELPERS
  ══════════════════════════════════════════ */
  const clearFile = () => {
    setFileName("");
    setAllRows([]);
    setPreviewRows([]);
    setValidationErrors([]);
    setResults([]);
    setImportDone(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parseFile = (file: File) => {
    setFileName(file.name);
    setResults([]);
    setImportDone(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: ExcelRow[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const errors: string[] = [];
      if (json.length === 0) {
        errors.push("Excel file is empty.");
      } else {
        REQUIRED_COLUMNS.forEach((col) => {
          if (!(col in json[0]))
            errors.push(`Missing required column: "${col}"`);
        });
        json.forEach((row, i) => {
          if (!row.FirstName)    errors.push(`Row ${i + 2}: FirstName is required`);
          if (!row.LastName)     errors.push(`Row ${i + 2}: LastName is required`);
          if (!row.RollNo)       errors.push(`Row ${i + 2}: RollNo is required`);
          if (!row.DivisionName) errors.push(`Row ${i + 2}: DivisionName is required`);
          if (!row.ParentEmail)  errors.push(`Row ${i + 2}: ParentEmail is required`);
        });
      }

      setValidationErrors(errors);
      setAllRows(json);
      setPreviewRows(json.slice(0, 5));
    };
    reader.readAsBinaryString(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    parseFile(file);
  };

  /* ══════════════════════════════════════════
     IMPORT
  ══════════════════════════════════════════ */
  const handleImport = async () => {
    if (!canImport) return;
    setImporting(true);
    setResults([]);

    try {
      const payload = {
        schoolId:      parseInt(selectedSchool),
        academicYearId: parseInt(selectedYear),
        classId:       parseInt(selectedClass),
        students: allRows.map((row) => ({
          divisionName:    row.DivisionName,
          firstName:       row.FirstName,
          middleName:      row.MiddleName ?? "",
          lastName:        row.LastName,
          rollNo:          row.RollNo,
          dob:             row.DOB,
          bloodGroup:      row.BloodGroup ?? "",
          address:         row.Address ?? "",
          parentFirstName: row.ParentFirstName,
          parentLastName:  row.ParentLastName,
          parentEmail:     row.ParentEmail,
          parentContact:   row.ParentContact,
        })),
      };

      const res = await fetch(`${API_BASE_URL}/Student/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error((await res.text()) || "Import failed");

      const data: RowResult[] = await res.json();
      setResults(data);
      setImportDone(true);
    } catch (err: any) {
      setResults([{
        rowIndex: 0, rollNo: "-", studentName: "-",
        status: "error", message: err.message ?? "Unknown error",
      }]);
      setImportDone(true);
    } finally {
      setImporting(false);
    }
  };

  /* ══════════════════════════════════════════
     DERIVED
  ══════════════════════════════════════════ */
  const step1Done = !!selectedSchool && !!selectedYear && !!selectedClass;
  const step2Done = step1Done && allRows.length > 0 && validationErrors.length === 0;
  const canImport = step2Done && !importing && !importDone;

  const selectedSchoolName = schools.find(s => s.schoolId.toString() === selectedSchool)?.schoolName ?? "";
  const selectedYearName   = academicYears.find(y => y.academicYearId.toString() === selectedYear)?.academicYear ?? "";
  const selectedClassName  = classes.find(c => c.classId.toString() === selectedClass)?.className ?? "";

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount   = results.filter((r) => r.status === "error").length;

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="space-y-6">
      <PageHeader
        title="Import Students from Excel"
        description="Select school, year and class — then upload an Excel file to bulk-import students."
      />

      {/* ══ STEP 1 ══ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <StepBadge n={1} done={step1Done} />
            Select School, Academic Year &amp; Class
          </CardTitle>
          <CardDescription>All three must be selected before uploading.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* School */}
            <div className="space-y-1.5">
              <Label>School <span className="text-destructive">*</span></Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger><SelectValue placeholder="Choose school…" /></SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
                      {s.schoolName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <Label>Academic Year <span className="text-destructive">*</span></Label>
              <Select
                value={selectedYear}
                onValueChange={setSelectedYear}
                disabled={!selectedSchool}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedSchool ? "Choose year…" : "Select school first"} />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y.academicYearId} value={y.academicYearId.toString()}>
                      {y.academicYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class */}
            <div className="space-y-1.5">
              <Label>Class <span className="text-destructive">*</span></Label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
                disabled={!selectedYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedYear ? "Choose class…" : "Select year first"} />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.classId} value={c.classId.toString()}>
                      {c.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selection summary */}
          {step1Done && (
            <div className="inline-flex items-center gap-1.5 text-sm bg-green-50 border border-green-200 text-green-800 rounded-full px-3 py-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{selectedSchoolName}</span>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span>{selectedYearName}</span>
              <ChevronRight className="w-3 h-3 opacity-40" />
              <span className="font-semibold">{selectedClassName}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ══ STEP 2 ══ */}
      <Card className={!step1Done ? "opacity-50 pointer-events-none select-none" : ""}>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base flex items-center">
              <StepBadge n={2} done={step2Done} />
              Upload Excel File
            </CardTitle>
            <CardDescription>
              One student per row. Division must already exist under <b>{selectedClassName || "the selected class"}</b>.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="shrink-0">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Info banner */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <b>Required columns:</b> DivisionName · FirstName · LastName · RollNo · DOB (YYYY-MM-DD) ·
              ParentFirstName · ParentLastName · ParentEmail · ParentContact.
              <br />
              <b>Optional:</b> MiddleName · BloodGroup · Address.
              &nbsp;<span className="font-semibold text-blue-700">ClassName is NOT needed</span> — selected above.
            </div>
          </div>

          {/* Drop zone */}
          <div
            className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
              border-primary/40 hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {fileName ? (
              <div className="flex items-center justify-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">{fileName}</span>
                <button
                  className="text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag &amp; drop your Excel file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">.xlsx or .xls</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
                <AlertCircle className="w-4 h-4" />
                Validation Errors ({validationErrors.length})
              </div>
              <ul className="text-sm text-destructive space-y-1 list-disc list-inside">
                {validationErrors.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}
                {validationErrors.length > 10 && (
                  <li>…and {validationErrors.length - 10} more</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ══ STEP 3 — PREVIEW & IMPORT ══ */}
      {step2Done && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <StepBadge n={3} done={importDone} />
              Preview &amp; Import
            </CardTitle>
            <CardDescription>
              <b>{allRows.length}</b> student{allRows.length !== 1 ? "s" : ""} ready to import into{" "}
              <span className="font-semibold">{selectedClassName}</span>.
              Each will receive a{" "}
              <span className="text-amber-600 font-semibold">Pending</span> application automatically.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-muted/40">
                  <tr>
                    {["#", "Division", "Roll No", "Student Name", "DOB", "Blood Group", "Parent", "Contact"].map((h) => (
                      <th key={h} className="p-2 text-left font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-muted/20">
                      <td className="p-2 text-muted-foreground">{i + 1}</td>
                      <td className="p-2">{row.DivisionName}</td>
                      <td className="p-2">{row.RollNo}</td>
                      <td className="p-2 font-medium">
                        {[row.FirstName, row.MiddleName, row.LastName].filter(Boolean).join(" ")}
                      </td>
                      <td className="p-2">{row.DOB}</td>
                      <td className="p-2">{row.BloodGroup || "—"}</td>
                      <td className="p-2">{row.ParentFirstName} {row.ParentLastName}</td>
                      <td className="p-2">{row.ParentContact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allRows.length > 5 && (
              <p className="text-xs text-center text-muted-foreground">
                Showing 5 of {allRows.length} rows
              </p>
            )}

            {!importDone && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={clearFile} disabled={importing}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={!canImport} className="min-w-44">
                  {importing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing…</>
                  ) : (
                    <><UploadCloud className="w-4 h-4 mr-2" /> Import {allRows.length} Students</>
                  )}
                </Button>
              </div>
            )}

            {importing && (
              <p className="text-sm text-center text-muted-foreground animate-pulse">
                Processing {allRows.length} students, please wait…
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ══ RESULTS ══ */}
      {importDone && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-3">
              Import Results
              {successCount > 0 && (
                <span className="inline-flex items-center gap-1 text-green-700 text-sm font-normal bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                  <CheckCircle className="w-3.5 h-3.5" /> {successCount} imported
                </span>
              )}
              {errorCount > 0 && (
                <span className="inline-flex items-center gap-1 text-destructive text-sm font-normal bg-destructive/10 border border-destructive/20 rounded-full px-2.5 py-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorCount} failed
                </span>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/40">
                <tr>
                  {["Row", "Roll No", "Student", "Result", "Message"].map((h) => (
                    <th key={h} className="p-2 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className={`border-t ${r.status === "error" ? "bg-destructive/5" : ""}`}>
                    <td className="p-2 text-muted-foreground">{r.rowIndex}</td>
                    <td className="p-2">{r.rollNo}</td>
                    <td className="p-2 font-medium">{r.studentName}</td>
                    <td className="p-2">
                      {r.status === "success" ? (
                        <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-destructive font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-muted-foreground text-xs">{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFile}>
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}