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
  const [templateMap, setTemplateMap] = useState<Record<number, any[]>>({});

  // ── Load data ──
useEffect(() => {
  // Load schools + templates
  const loadAll = async () => {
    const map: Record<number, any[]> = {};
for (const s of schools || []) {
      try {
        const data = await fetch(`${BASE_URL}/CardTemplate/list?schoolId=${s.schoolId}`).then(r => r.json());
        if (data?.length > 0 && data[0].templateFieldsJson)
          map[s.schoolId] = JSON.parse(data[0].templateFieldsJson);
      } catch {}
    }
    setTemplateMap(map);
  };

  loadAll();

  // Reload when user comes back from designer
  window.addEventListener("focus", loadAll);

  // Load students
  fetch(`${BASE_URL}/Student/getalwithstatus`).then(r => r.json()).then(d => {
    const approved = (d || []).filter((s: any) =>
      ["Approved", "approved", "accept", "Accept"].includes(s.applicationStatus)
    );
    const roleFiltered = filterStudentsByRole(approved);
setStudents(roleFiltered);
setFiltered(roleFiltered);
  });

  return () => window.removeEventListener("focus", loadAll);
}, []);

  // ── Filter cascades ──
  useEffect(() => {
    if (selSchool !== "all") {
      fetch(`${BASE_URL}/School/academicyear/${selSchool}`).then(r => r.json()).then(setYears);
      fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${selSchool}`).then(r => r.json()).then(setClasses);
    } else { setYears([]); setClasses([]); setDivisions([]); }
  }, [selSchool]);

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

  // ── Print ──
  const printCards = async () => {
    const selected = filtered.filter(s => selectedIds.includes(s.studentId!));
    if (!selected.length) return;
    setPrinting(true);

    const win = window.open("", "_blank");
    if (!win) { setPrinting(false); return; }

    const cardW = "54mm";
    const cardH = "85.6mm";

    // Load saved templates per school
    const schoolIds = [...new Set(selected.map(s => s.schoolId).filter(Boolean))] as number[];
    const templateMap: Record<number, any[]> = {};
    for (const sid of schoolIds) {
      try {
        const data = await fetch(`${BASE_URL}/CardTemplate/list?schoolId=${sid}`).then(r => r.json());
        if (data?.length > 0 && data[0].templateFieldsJson)
          templateMap[sid] = JSON.parse(data[0].templateFieldsJson);
      } catch {}
    }

    const cardsHtml = selected.map(s => {
      const school = schools.find(sc => sc.schoolId === s.schoolId);
      if (!school) return "";

      const photoSrc = imgSrc(s.photoPath);
      const frontSrc = imgSrc(school.cardTemplateFront);
      const logoSrc  = imgSrc(school.schoolLogo);
      const sigSrc   = imgSrc(school.principalSignature);
      const dob = s.dob
        ? new Date(s.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : "";

      const bg = frontSrc
        ? `<img src="${frontSrc}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />`
        : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1d4ed8,#3b82f6);"></div>`;

      const savedFields = s.schoolId ? templateMap[s.schoolId] : null;

      // ── Use saved designer layout ──
      if (savedFields && Array.isArray(savedFields)) {
        const fieldsHtml = savedFields.filter((f: any) => f.visible).map((f: any) => {
          const style = `position:absolute;left:${f.x}%;top:${f.y}%;width:${f.width}%;height:${f.height}%;z-index:1;`;
          if (f.isImage) {
            let src = "";
            if (f.key === "photo")      src = photoSrc;
            if (f.key === "schoolLogo") src = logoSrc;
            if (f.key === "signature")  src = sigSrc;
            if (!src) return "";
            return `<img src="${src}" style="${style}object-fit:cover;border-radius:2px;" />`;
          }
          let val = "";
          if (f.key === "studentName")   val = s.fullName || "";
          if (f.key === "classDivision") val = `${s.className || ""}-${s.divisionName || ""}`;
          if (f.key === "rollNo")        val = `Roll: ${s.rollNo || ""}`;
          if (f.key === "dob")           val = `DOB: ${dob}`;
          if (f.key === "bloodGroup")    val = s.bloodGroup || "";
          if (f.key === "address")       val = (s as any).currentAddress || "";
if (f.key === "parentContact") val = (s as any).fatherContact1 || "";
          if (!val) return "";
          return `<div style="${style}font-size:${f.fontSize}px;color:${f.fontColor};
            font-weight:${f.bold?"bold":"normal"};font-style:${f.italic?"italic":"normal"};
            white-space:nowrap;overflow:hidden;display:flex;align-items:center;">${val}</div>`;
        }).join("");
        return `<div style="position:relative;width:${cardW};height:${cardH};overflow:hidden;page-break-after:always;">
          ${bg}${fieldsHtml}
        </div>`;
      }

      // ── Default layout ──
      return `<div style="position:relative;width:${cardW};height:${cardH};overflow:hidden;page-break-after:always;">
        ${bg}
        <div style="position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;padding:8px;">
          ${logoSrc ? `<img src="${logoSrc}" style="width:36px;height:36px;object-fit:contain;margin-bottom:4px;" />` : ""}
          ${photoSrc ? `<img src="${photoSrc}" style="width:48px;height:58px;object-fit:cover;border-radius:3px;margin-bottom:4px;" />` : ""}
          <p style="font-weight:bold;font-size:10px;color:#000;text-align:center;margin:2px 0;">${s.fullName}</p>
          <p style="font-size:8px;color:#333;margin:1px 0;">${s.className}-${s.divisionName} | Roll: ${s.rollNo}</p>
          <p style="font-size:8px;color:#333;margin:1px 0;">DOB: ${dob}</p>
          <p style="font-size:8px;color:red;font-weight:bold;margin:1px 0;">${s.bloodGroup || ""}</p>
          ${sigSrc ? `<img src="${sigSrc}" style="height:18px;object-fit:contain;margin-top:auto;" />` : ""}
        </div>
      </div>`;
    }).join("");

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  @page{size:${cardW} ${cardH};margin:0;}
  @media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}
</style>
</head><body>${cardsHtml}
<script>
  window.onload=function(){
    var imgs=document.querySelectorAll('img');var loaded=0;
    if(!imgs.length){window.print();return;}
    imgs.forEach(function(img){
      if(img.complete){loaded++;if(loaded===imgs.length)window.print();}
      else{img.onload=img.onerror=function(){loaded++;if(loaded===imgs.length)window.print();};}
    });
  };
<\/script>
</body></html>`);
    win.document.close();
    setPrinting(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Print ID Cards" description="Select students and print their ID cards" />

      <div className="flex justify-end">
        <a href="/admin/print/designer"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
          🎨 Card Designer
        </a>
      </div>

      {/* ── Filters ── */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          {[
            { label: "School",        val: selSchool, set: setSelSchool, items: schools,   key: "schoolId",       name: "schoolName"   },
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

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
              {printing ? "Preparing..." : `Print ${selectedIds.length || ""} Card${selectedIds.length !== 1 ? "s" : ""}`}
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
              <CardTitle className="flex gap-2 items-center text-base">
                <CreditCard className="w-4 h-4" /> Preview
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
                      const school  = schools.find(sc => sc.schoolId === student?.schoolId);
                      if (!student || !school) return null;
                      return (
                        <div key={id} className="space-y-1">
                          <p className="text-[10px] text-slate-500 font-medium truncate">{student.fullName}</p>
                          {/* Card preview — portrait ratio */}
                          <div className="relative rounded overflow-hidden" style={{ paddingTop: "158%" }}>
                            <div className="absolute inset-0">
                              {school.cardTemplateFront
  ? <img src={imgSrc(school.cardTemplateFront)} className="absolute inset-0 w-full h-full object-cover" alt="front" />
  : <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500" />
}
{/* Overlay saved fields */}
{(templateMap[student.schoolId!] || []).filter((f: any) => f.visible).map((f: any) => {
  if (f.isImage) {
    let src = "";
    if (f.key === "photo")      src = imgSrc(student.photoPath);
    if (f.key === "schoolLogo") src = imgSrc(school.schoolLogo);
    if (f.key === "signature")  src = imgSrc(school.principalSignature);
    if (!src) return null;
    return <img key={f.key} src={src} style={{
      position:"absolute", left:`${f.x}%`, top:`${f.y}%`,
      width:`${f.width}%`, height:`${f.height}%`, objectFit:"cover", zIndex:1
    }} />;
  }
  const dob = student.dob ? new Date(student.dob).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "";
  let val = "";
  if (f.key === "studentName")   val = student.fullName || "";
  if (f.key === "classDivision") val = `${student.className||""}-${student.divisionName||""}`;
  if (f.key === "rollNo")        val = `Roll: ${student.rollNo||""}`;
  if (f.key === "dob")           val = `DOB: ${dob}`;
  if (f.key === "bloodGroup")    val = student.bloodGroup || "";
  if (!val) return null;
  return <div key={f.key} style={{
    position:"absolute", left:`${f.x}%`, top:`${f.y}%`,
    width:`${f.width}%`, height:`${f.height}%`, zIndex:1,
    fontSize:f.fontSize, color:f.fontColor,
    fontWeight:f.bold?"bold":"normal", fontStyle:f.italic?"italic":"normal",
    whiteSpace:"nowrap", overflow:"hidden", display:"flex", alignItems:"center"
  }}>{val}</div>;
})}
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-400 text-center">{student.className}-{student.divisionName}</p>
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