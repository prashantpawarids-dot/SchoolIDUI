"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Printer, FileDown, User, CreditCard } from "lucide-react";
import type { Student } from "@/lib/types";
import { BASE_URL } from "@/lib/api";
import { useSchools } from "@/lib/school-context";
import { filterStudentsByRole } from "@/lib/auth";

const SERVER_BASE = BASE_URL ? BASE_URL.replace(/\/api\/?$/, "") : "";

function imgSrc(val?: string | null): string {
  if (!val) return "";
  if (val.startsWith("http") || val.startsWith("data:")) return val;
  if (val.startsWith("/")) return `${SERVER_BASE}${val}`;
  return `${SERVER_BASE}/${val}`;
}

// ── Detect orientation from an image URL ──────────────
function detectOrientation(url: string): Promise<"landscape" | "portrait"> {
  return new Promise(resolve => {
    if (!url) return resolve("portrait");
    const img = new Image();
    img.onload  = () => resolve(img.naturalWidth > img.naturalHeight ? "landscape" : "portrait");
    img.onerror = () => resolve("portrait");
    img.src = url;
  });
}

// ── Print card dimensions based on orientation ────────
function printSize(orientation: "landscape" | "portrait") {
  return orientation === "landscape"
    ? { cardW: "85.6mm", cardH: "54mm" }
    : { cardW: "54mm",   cardH: "85.6mm" };
}

// ── Parse saved templateFieldsJson safely ─────────────
// Handles new {front, back} format AND legacy flat array
function parseTemplateJson(json: string): { front: any[]; back: any[] } {
  try {
    const parsed = JSON.parse(json);
    if (parsed && Array.isArray(parsed.front)) {
      return { front: parsed.front, back: parsed.back || [] };
    }
    if (Array.isArray(parsed)) {
      return { front: parsed, back: [] }; // legacy
    }
  } catch {}
  return { front: [], back: [] };
}

export default function PrintIDCards() {
  const { schools } = useSchools();
  const [years, setYears]             = useState<any[]>([]);
  const [classes, setClasses]         = useState<any[]>([]);
  const [divisions, setDivisions]     = useState<any[]>([]);
  const [students, setStudents]       = useState<Student[]>([]);
  const [filtered, setFiltered]       = useState<Student[]>([]);
  const [selSchool, setSelSchool]     = useState("all");
  const [selYear, setSelYear]         = useState("all");
  const [selClass, setSelClass]       = useState("all");
  const [selDiv, setSelDiv]           = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
 const [printing, setPrinting]       = useState(false);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  // templateMap stores { front: FieldPosition[], back: FieldPosition[] } per schoolId
 const [templateMap, setTemplateMap] = useState<Record<number, { front: any[]; back: any[] }>>({});
  const [ownSchoolData, setOwnSchoolData] = useState<any>(null);

  // ── Load data ──
  useEffect(() => {
    const loadAll = async () => {
      const map: Record<number, { front: any[]; back: any[] }> = {};
      const schoolId = Number(localStorage.getItem("schoolId"));
      const list = (schools || []).length > 0 ? schools : schoolId ? [{ schoolId }] : [];
      for (const s of list) {
        try {
          const data = await fetch(`${BASE_URL}/CardTemplate/list?schoolId=${s.schoolId}`).then(r => r.json());
          if (data?.length > 0 && data[0].templateFieldsJson) {
            map[s.schoolId] = parseTemplateJson(data[0].templateFieldsJson);
          }
        } catch {}
      }
      setTemplateMap(map);
    };

   // Fetch own school data directly for school role
    const schoolIdStr = localStorage.getItem("schoolId");
    if (schoolIdStr) {
      fetch(`${BASE_URL}/School/list`)
        .then(r => r.json())
        .then(data => {
          const own = (data || []).find((s: any) => s.schoolId === Number(schoolIdStr));
          if (own) setOwnSchoolData(own);
        })
        .catch(() => {});
    }

    loadAll();

    // Reload when user returns from designer
    window.addEventListener("focus", loadAll);

    // Load students
    // Load students — school sees only own school
    const schoolId = localStorage.getItem("schoolId");
    fetch(`${BASE_URL}/Student/getalwithstatus${schoolId ? `?schoolId=${schoolId}` : ""}`).then(r => r.json()).then(d => {
      const approved = (d || []).filter((s: any) =>
        ["Approved", "approved", "accept", "Accept"].includes(s.applicationStatus)
      );
      setStudents(approved);
      setFiltered(approved);
    });

    return () => window.removeEventListener("focus", loadAll);
  }, [schools]);

  // ── Filter cascades ──
  // ── Filter cascades — school loads own data on mount ──
  useEffect(() => {
    const schoolId = localStorage.getItem("schoolId");
    if (schoolId) {
      fetch(`${BASE_URL}/School/academicyear/${schoolId}`).then(r => r.json()).then(setYears);
      fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${schoolId}`).then(r => r.json()).then(setClasses);
    }
  }, []);

  useEffect(() => {
    if (selClass !== "all") {
      fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${selClass}`).then(r => r.json()).then(setDivisions);
    } else setDivisions([]);
  }, [selClass]);

  useEffect(() => {
    setFiltered(students.filter(s => {
      if (selSchool !== "all" && s.schoolId?.toString()       !== selSchool) return false;
      if (selYear   !== "all" && s.academicYearId?.toString() !== selYear)   return false;
      if (selClass  !== "all" && s.classId?.toString()        !== selClass)  return false;
      if (selDiv    !== "all" && s.divisionId?.toString()     !== selDiv)    return false;
      return true;
    }));
    setSelectedIds([]);
  }, [selSchool, selYear, selClass, selDiv, students]);

  // ── Selection ──
  const toggle = (id: number) =>
    setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(s => s.studentId!));

  // ── Print — front + back pages per student ──
const printCards = async () => {
    const selected = filtered.filter(s => selectedIds.includes(s.studentId!));
    if (!selected.length) return;
    setPrinting(true);
const win = window.open("", "_blank");
    if (!win) { setPrinting(false); return; }

    // ── CR80 card pixel dimensions at 96dpi ──
    // 1mm = 3.7795275591px
    // Portrait:  54mm × 85.6mm = 204px × 323px
    // Landscape: 85.6mm × 54mm = 323px × 204px
    const SHORT = 204; // 54mm
    const LONG  = 323; // 85.6mm

    function cardPx(ori: string) {
      return ori === "landscape"
        ? { w: LONG,  h: SHORT }
        : { w: SHORT, h: LONG  };
    }

    // ── Reload templates fresh ──
    const schoolIds = [...new Set(selected.map(s => s.schoolId).filter(Boolean))] as number[];
    const freshTemplateMap: Record<number, { front: any[]; back: any[] }> = {};
    for (const sid of schoolIds) {
      try {
        const data = await fetch(`${BASE_URL}/CardTemplate/list?schoolId=${sid}`).then(r => r.json());
        if (data?.length > 0 && data[0].templateFieldsJson)
          freshTemplateMap[sid] = parseTemplateJson(data[0].templateFieldsJson);
      } catch {}
    }

    // ── Detect orientation per school ──
    // ── Detect orientation per school ──
    // For school role, schools context may be empty — fetch directly
    let schoolsList = schools || [];
    if (schoolsList.length === 0) {
      const schoolId = localStorage.getItem("schoolId");
      const data = await fetch(`${BASE_URL}/School/list`).then(r => r.json());
      schoolsList = schoolId ? (data || []).filter((s: any) => s.schoolId === Number(schoolId)) : (data || []);
    }
    const orientationMap: Record<number, { front: "landscape" | "portrait"; back: "landscape" | "portrait" }> = {};
    for (const sc of schoolsList) {
      const frontOri = sc.cardTemplateFront ? await detectOrientation(imgSrc(sc.cardTemplateFront)) : "portrait";
      const backOri  = sc.cardTemplateBack  ? await detectOrientation(imgSrc(sc.cardTemplateBack))  : frontOri;
      orientationMap[sc.schoolId] = { front: frontOri, back: backOri };
    }

    // ── Build card HTML per student ──
    // ── Build card HTML per student ──
    const cardsHtml = selected.map(s => {
      const school = schoolsList.find((sc: any) => sc.schoolId === s.schoolId);
      if (!school) return "";

      const photoSrc = imgSrc(s.photoPath);
      const frontSrc = imgSrc(school.cardTemplateFront);
      const backSrc  = imgSrc(school.cardTemplateBack);
      const logoSrc  = imgSrc(school.schoolLogo);
      const sigSrc   = imgSrc(school.principalSignature);
      const dobRaw   = (s as any).dob || (s as any).DOB || "";
      const dob      = dobRaw
        ? new Date(dobRaw).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : "";

      const ori  = orientationMap[school.schoolId] || { front: "portrait", back: "portrait" };
      const front = cardPx(ori.front);
      const back  = cardPx(ori.back);

      const bgFront = frontSrc
        ? `<img src="${frontSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" />`
        : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1d4ed8,#3b82f6);z-index:0;"></div>`;

      const bgBack = backSrc
        ? `<img src="${backSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;" />`
        : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#374151,#6b7280);z-index:0;"></div>`;

      // ── Render fields to HTML ──
     // Normalize student fields — API may return PascalCase or camelCase
      const sAny = s as any;
      const studentFullName   = sAny.fullName   || sAny.FullName   || "";
      const studentClassName  = sAny.className  || sAny.ClassName  || "";
      const studentDivName    = sAny.divisionName || sAny.DivisionName || "";
      const studentRollNo     = sAny.rollNo     || sAny.RollNo     || "";
      const studentBloodGroup = sAny.bloodGroup || sAny.BloodGroup || "";
      const studentAddress    = sAny.address    || sAny.Address    || "";
      const studentEmergency  = sAny.emergencyContact || sAny.EmergencyContact || sAny.parentContact || sAny.ParentContact || "";
      const studentParentName = sAny.parentName || sAny.ParentName || "";
      const studentDOB        = sAny.dob || sAny.DOB
        ? new Date(sAny.dob || sAny.DOB).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : "";

      const renderFieldSet = (fieldSet: any[]) =>
        (fieldSet || []).filter((f: any) => f.visible).map((f: any) => {
          const justifyMap: Record<string, string> = { left: "flex-start", center: "center", right: "flex-end" };
          const justify = justifyMap[f.align || "left"];
          const st = `position:absolute;left:${f.x}%;top:${f.y}%;width:${f.width}%;height:${f.height}%;z-index:1;`;
          if (f.isImage) {
            let src = "";
            if (f.key === "photo")      src = photoSrc;
            if (f.key === "schoolLogo") src = logoSrc;
            if (f.key === "signature")  src = sigSrc;
            if (!src) return "";
            return `<img src="${src}" style="${st}object-fit:cover;border-radius:2px;" />`;
          }
          let val = "";
          if (f.key === "studentName")   val = studentFullName;
          if (f.key === "classDivision") val = `${studentClassName} - ${studentDivName}`;
          if (f.key === "rollNo")        val = `Roll: ${studentRollNo}`;
          if (f.key === "dob")           val = studentDOB ? `DOB: ${studentDOB}` : "";
          if (f.key === "bloodGroup")    val = studentBloodGroup;
          if (f.key === "address")       val = studentAddress;
          if (f.key === "parentContact") val = studentEmergency;
          if (f.key === "parentName")    val = studentParentName;
          if (!val) return "";
          return `<div style="${st}font-size:${f.fontSize}px;color:${f.fontColor || "#000"};font-weight:${f.bold ? "bold" : "normal"};font-style:${f.italic ? "italic" : "normal"};white-space:nowrap;overflow:hidden;display:flex;align-items:center;justify-content:${justify};">${val}</div>`;
        }).join("");

      const savedTemplate = s.schoolId ? freshTemplateMap[s.schoolId] : null;

      // ── FRONT PAGE ──
      const frontContent = (savedTemplate && savedTemplate.front.length > 0)
        ? renderFieldSet(savedTemplate.front)
        : `<div style="position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;padding:6px;">
            ${logoSrc  ? `<img src="${logoSrc}"  style="width:32px;height:32px;object-fit:contain;margin-bottom:3px;" />` : ""}
            ${photoSrc ? `<img src="${photoSrc}" style="width:44px;height:54px;object-fit:cover;border-radius:3px;margin-bottom:3px;" />` : ""}
            <p style="font-weight:bold;font-size:9px;color:#000;text-align:center;margin:2px 0;">${s.fullName}</p>
           <p style="font-size:7px;color:#333;margin:1px 0;">${studentClassName}-${studentDivName} | Roll: ${studentRollNo}</p>
            <p style="font-size:7px;color:#333;margin:1px 0;">DOB: ${dob}</p>
            <p style="font-size:7px;color:red;font-weight:bold;margin:1px 0;">${studentBloodGroup}</p>
            ${sigSrc ? `<img src="${sigSrc}" style="height:16px;object-fit:contain;margin-top:auto;" />` : ""}
           </div>`;

      // ── BACK PAGE ──
      const backContent = (savedTemplate && savedTemplate.back && savedTemplate.back.length > 0)
        ? renderFieldSet(savedTemplate.back)
        : `<div style="position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;gap:4px;">
            ${logoSrc ? `<img src="${logoSrc}" style="width:36px;height:36px;object-fit:contain;opacity:0.6;" />` : ""}
            <p style="font-size:7px;color:#fff;text-align:center;opacity:0.9;">If found, please return to school</p>
           </div>`;

      return `
<div class="card-page" style="width:${front.w}px;height:${front.h}px;">
  ${bgFront}${frontContent}
</div>
<div class="card-page back" style="width:${back.w}px;height:${back.h}px;">
  ${bgBack}${backContent}
</div>`;
    }).join("");

    // ── Use first selected student's school for @page size ──
    // ── Use first selected student's school for @page size ──
    const firstSchool = schoolsList.find((sc: any) => sc.schoolId === selected[0]?.schoolId);
    const firstOri    = firstSchool ? (orientationMap[firstSchool.schoolId] || { front: "portrait", back: "portrait" }) : { front: "portrait", back: "portrait" };
    const pageF = cardPx(firstOri.front);
    const pageB = cardPx(firstOri.back);

    // Convert px back to mm for reliable @page sizing
    // 204px = 54mm, 323px = 85.6mm
    const fMmW = pageF.w === 204 ? "54mm" : "85.6mm";
    const fMmH = pageF.h === 323 ? "85.6mm" : "54mm";
    const bMmW = pageB.w === 204 ? "54mm" : "85.6mm";
    const bMmH = pageB.h === 323 ? "85.6mm" : "54mm";

    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=204, initial-scale=1.0"/><meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
 html, body {
    margin:0 !important;
    padding:0 !important;
    width:${pageF.w}px !important;
    min-height:${pageF.h}px !important;
    max-width:${pageF.w}px !important;
    background:#fff;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
    overflow:hidden;
  }
  @page {
    size: ${fMmW} ${fMmH};
    margin: 0mm;
  }
  @page back-page {
    size: ${bMmW} ${bMmH};
    margin: 0mm;
  }
  .card-page {
    position: relative;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
    margin: 0;
    padding: 0;
  }
  .card-page.back {
    page: back-page;
  }
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: ${pageF.w}px !important;
      max-width: ${pageF.w}px !important;
    }
    .card-page {
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
    }
  }
</style>
</head>
<body>
${cardsHtml}
<script>
  window.onload = function () {
    var imgs = document.querySelectorAll('img');
    var total = imgs.length;
    var done = 0;
    function tryPrint() {
      done++;
      if (done >= total) setTimeout(function () { window.print(); }, 250);
    }
    if (!total) { setTimeout(function () { window.print(); }, 250); return; }
    imgs.forEach(function (img) {
      if (img.complete && img.naturalHeight !== 0) { tryPrint(); }
      else { img.onload = img.onerror = tryPrint; }
    });
  };
<\/script>
</body>
</html>`);
    win.document.close();
    setPrinting(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Print ID Cards" description="Select students and print their ID cards" />

      <div className="flex justify-end">
        <a href="/school/print/designer"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
          🎨 Card Designer
        </a>
      </div>

      {/* ── Filters ── */}
     <Card suppressHydrationWarning>
        <CardContent suppressHydrationWarning className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[
            { label: "Academic Year", val: selYear,   set: setSelYear,   items: years,     key: "academicYearId", name: "academicYear" },
            { label: "Class",         val: selClass,  set: setSelClass,  items: classes,   key: "classId",        name: "className"    },
            { label: "Division",      val: selDiv,    set: setSelDiv,    items: divisions, key: "divisionId",     name: "divisionName" },
          ].map(f => (
            <div key={f.label}>
              <Label className="mb-1.5 block">{f.label}</Label>
              <Select value={f.val} onValueChange={f.set}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {f.items.map((i: any) => (
                    <SelectItem key={i[f.key]} value={i[f.key].toString()}>{i[f.name]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Students list */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-base">
              <span className="flex gap-2 items-center"><User className="w-4 h-4" /> Students</span>
              <Badge variant="secondary">{selectedIds.length}/{filtered.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex gap-2 items-center cursor-pointer text-sm font-medium hover:bg-slate-50 p-2 rounded-md">
              <Checkbox
                checked={selectedIds.length === filtered.length && filtered.length > 0}
                onCheckedChange={toggleAll}
              />
              Select All
            </label>

            <div className="max-h-80 overflow-y-auto border rounded-lg">
              {filtered.length === 0
                ? <p className="text-sm text-slate-400 text-center py-6">No approved students found</p>
                : filtered.map(s => (
                  <label key={s.studentId}
                    className={`flex gap-2.5 p-2.5 cursor-pointer transition-colors border-b last:border-b-0
                      ${selectedIds.includes(s.studentId!) ? "bg-blue-50" : "hover:bg-slate-50"}`}>
                    <Checkbox
                      checked={selectedIds.includes(s.studentId!)}
                      onCheckedChange={() => toggle(s.studentId!)}
                    />
                    <div>
                      <p className="text-sm font-medium">{s.fullName}</p>
                      <p className="text-xs text-slate-400">{s.className} – {s.divisionName}</p>
                    </div>
                  </label>
                ))
              }
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!selectedIds.length || printing}
              onClick={printCards}>
              <Printer className="w-4 h-4 mr-2" />
              {printing ? "Preparing..." : `Print ${selectedIds.length || ""} Card${selectedIds.length !== 1 ? "s" : ""} (Front + Back)`}
            </Button>

            <Button className="w-full" variant="outline" disabled={!selectedIds.length || printing} onClick={printCards}>
              <FileDown className="w-4 h-4 mr-2" /> Save as PDF
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="xl:col-span-2">
          <Card className="h-full">
           <CardHeader>
              <CardTitle className="flex gap-2 items-center text-base flex-wrap gap-y-2">
                <CreditCard className="w-4 h-4" />
                <span>Preview</span>
                {/* Front / Back toggle */}
                <div className="flex rounded-lg border overflow-hidden ml-2">
                  {(["front", "back"] as const).map(side => (
                    <button key={side}
                      onClick={() => setPreviewSide(side)}
                      className={`px-3 py-1 text-xs font-medium transition-colors ${
                        previewSide === side ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
                      }`}>
                      {side === "front" ? "◼ Front" : "◻ Back"}
                    </button>
                  ))}
                </div>
                {selectedIds.length > 0 && <Badge className="ml-auto">{selectedIds.length} card{selectedIds.length !== 1 ? "s" : ""}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIds.length === 0
                ? <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                    <CreditCard className="w-16 h-16 mb-3" />
                    <p className="text-sm">Select students to preview</p>
                  </div>
                : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-1">
                    {selectedIds.map(id => {
                    const student = filtered.find(s => s.studentId === id);
                      const school  = schools.find(sc => sc.schoolId === student?.schoolId)
                        || ownSchoolData;
                      if (!student || !school) return null;

                      // Use front fields from templateMap for preview
                     // Pick front or back fields based on toggle
                      const previewFields = previewSide === "front"
                        ? (templateMap[student.schoolId!]?.front || [])
                        : (templateMap[student.schoolId!]?.back  || []);

                      // Pick correct template image
                      const previewTemplateSrc = previewSide === "front"
                        ? school.cardTemplateFront
                        : school.cardTemplateBack;

                    const previewBg = previewSide === "front"
                        ? "from-blue-700 to-blue-500"
                        : "from-slate-600 to-slate-500";

                      // Debug: check if back fields exist
                      const hasBackFields = (templateMap[student.schoolId!]?.back || []).length > 0;
                      const dobFormatted = student.dob
                        ? new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "";

                      return (
                        <div key={id} className="space-y-1">
                          <p className="text-[10px] text-slate-500 font-medium truncate">{student.fullName}</p>
                          {/* Card preview thumbnail */}
                        <div className="relative rounded overflow-hidden" style={{
                            paddingTop: previewTemplateSrc
                              ? undefined
                              : "158%",
                            aspectRatio: previewTemplateSrc ? "auto" : undefined
                          }}>
                            {previewTemplateSrc
                              ? <img
                                  src={imgSrc(previewTemplateSrc)}
                                  className="w-full h-auto rounded"
                                  alt={previewSide}
                                />
                              : <div className="absolute inset-0" style={{
                                  background: previewSide === "back"
                                    ? "linear-gradient(135deg,#475569,#64748b)"
                                    : "linear-gradient(135deg,#1d4ed8,#3b82f6)"
                                }}>
                                  <div className="flex flex-col items-center justify-center h-full gap-1 p-2">
                                    <span className="text-white text-[8px] opacity-70 text-center">
                                      {previewSide === "back" ? "No back template" : "No front template"}
                                    </span>
                                    <span className="text-white text-[7px] opacity-50 text-center">Upload in School Management</span>
                                  </div>
                                </div>
                            }
                          </div>
                          <p className="text-[9px] text-slate-400 text-center">{(student as any).className}-{(student as any).divisionName}</p>
                        </div>
                      );
                    })}
                  </div>
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}