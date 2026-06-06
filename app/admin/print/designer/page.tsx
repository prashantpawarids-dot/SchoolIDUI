"use client";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/lib/api";
import { useSchools } from "@/lib/school-context";
import { filterStudentsByRole } from "@/lib/auth";

// ── Types ──────────────────────────────────────────────
interface FieldPosition {
  key: string;
  label: string;
  x: number;    // percentage
  y: number;    // percentage
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
  visible: boolean;
  isImage: boolean;
  width: number;   // percentage
  height: number;  // percentage
}

interface School {
  schoolId: number;
  schoolName: string;
  schoolLogo?: string;
  cardTemplateFront?: string;
  cardTemplateBack?: string;
  principalSignature?: string;
}

interface Student {
  studentId: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  rollNo?: string;
  className?: string;
  divisionName?: string;
  dob?: string;
  bloodGroup?: string;
  photoPath?: string;
  currentAddress?: string;
  fatherContact1?: string;
  schoolId?: number;
}

// ── Default fields ─────────────────────────────────────
const DEFAULT_FIELDS: FieldPosition[] = [
  { key: "schoolLogo",    label: "School Logo",     x: 35, y: 2,  fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true, isImage: true,  width: 30, height: 18 },
  { key: "photo",         label: "Student Photo",   x: 25, y: 30, fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true, isImage: true,  width: 50, height: 28 },
  { key: "studentName",   label: "Student Name",    x: 5,  y: 60, fontSize: 11, fontColor: "#000000", bold: true,  italic: false, visible: true, isImage: false, width: 90, height: 6  },
  { key: "classDivision", label: "Class/Division",  x: 5,  y: 68, fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true, isImage: false, width: 60, height: 5  },
  { key: "rollNo",        label: "Roll No",          x: 5,  y: 74, fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true, isImage: false, width: 50, height: 5  },
  { key: "dob",           label: "Date of Birth",    x: 5,  y: 80, fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true, isImage: false, width: 60, height: 5  },
  { key: "bloodGroup",    label: "Blood Group",      x: 65, y: 80, fontSize: 9,  fontColor: "#cc0000", bold: true,  italic: false, visible: true, isImage: false, width: 25, height: 5  },
  { key: "signature",     label: "Principal Sign",   x: 55, y: 90, fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true, isImage: true,  width: 35, height: 7  },
  { key: "address",       label: "Address",         x: 5, y: 86, fontSize: 7,  fontColor: "#000000", bold: false, italic: false, visible: false, isImage: false, width: 90, height: 5 },
{ key: "parentContact", label: "Parent Contact",   x: 5, y: 91, fontSize: 7,  fontColor: "#000000", bold: false, italic: false, visible: false, isImage: false, width: 90, height: 5 },
];

// ── Helpers ────────────────────────────────────────────
const SERVER_BASE = BASE_URL ? BASE_URL.replace(/\/api\/?$/, "") : "";

function imgSrc(val?: string | null): string {
  if (!val) return "";
  if (val.startsWith("http") || val.startsWith("data:")) return val;
  if (val.startsWith("/")) return `${SERVER_BASE}${val}`;
  return `${SERVER_BASE}/${val}`;
}

function formatDOB(dob?: string): string {
  if (!dob) return "";
  try { return new Date(dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return dob; }
}

function getFieldValue(field: FieldPosition, student: Student, school: School): string {
  switch (field.key) {
    case "studentName":   return student.fullName || "";
    case "classDivision": return `${student.className || ""}-${student.divisionName || ""}`;
    case "rollNo":        return `Roll: ${student.rollNo || ""}`;
    case "dob":           return `DOB: ${formatDOB(student.dob)}`;
    case "bloodGroup":    return student.bloodGroup || "";
    case "address":       return student.currentAddress || "";
case "parentContact": return student.fatherContact1 || "";
    default: return "";
  }
}

function getImageSrc(field: FieldPosition, student: Student, school: School): string {
  switch (field.key) {
    case "photo":      return imgSrc(student.photoPath) || "/placeholder.svg";
    case "schoolLogo": return imgSrc(school.schoolLogo) || "";
    case "signature":  return imgSrc(school.principalSignature) || "";
    default: return "";
  }
}

// ── Main Component ─────────────────────────────────────
export default function CardDesignerPage() {
const { schools } = useSchools();
  const [students, setStudents]         = useState<Student[]>([]);
  const [selSchool, setSelSchool]       = useState<School | null>(null);
  const [selStudent, setSelStudent]     = useState<Student | null>(null);
  const [activeSide, setActiveSide]     = useState<"front" | "back">("front");
  const [fields, setFields]             = useState<FieldPosition[]>(DEFAULT_FIELDS);
  const [selectedKey, setSelectedKey]   = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [savedMsg, setSavedMsg]         = useState("");
  const [templateId, setTemplateId]     = useState<number | null>(null);

  const cardRef   = useRef<HTMLDivElement>(null);
  const dragRef   = useRef<{ key: string; startX: number; startY: number; origX: number; origY: number } | null>(null);



  // ── Load students when school changes ──
  useEffect(() => {
    if (!selSchool) return;
    fetch(`${BASE_URL}/Student/getalwithstatus?schoolId=${selSchool.schoolId}`)
      .then(r => r.json())
      .then(d => {
        const approved = (d || []).filter((s: any) =>
          ["Approved", "approved", "accept", "Accept"].includes(s.applicationStatus)
        );
        setStudents(approved);
        if (approved.length > 0) setSelStudent(approved[0]);
      })
      .catch(() => {});

    // Load saved template for this school
    fetch(`${BASE_URL}/CardTemplate/list?schoolId=${selSchool.schoolId}`)
      .then(r => r.json())
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const t = data[0];
          setTemplateId(t.templateId);
          if (t.templateFieldsJson) {
            try {
              const saved = JSON.parse(t.templateFieldsJson);
              if (Array.isArray(saved) && saved.length > 0) setFields(saved);
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [selSchool]);

  // ── Drag logic ──
  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedKey(key);
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const field = fields.find(f => f.key === key)!;
    dragRef.current = {
      key,
      startX: e.clientX,
      startY: e.clientY,
      origX: field.x,
      origY: field.y,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragRef.current.startX) / rect.width)  * 100;
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;
      const newX = Math.max(0, Math.min(90, dragRef.current.origX + dx));
      const newY = Math.max(0, Math.min(95, dragRef.current.origY + dy));
      setFields(prev => prev.map(f =>
        f.key === dragRef.current!.key ? { ...f, x: newX, y: newY } : f
      ));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  // ── Save template ──
  const saveTemplate = async () => {
    if (!selSchool) return;
    setSaving(true);
    try {
      const body = {
        templateId: templateId || null,
        name: `${selSchool.schoolName} Template`,
        schoolId: selSchool.schoolId,
        cardWidth: 85.6,
        cardHeight: 54,
        orientation: "landscape",
        backgroundColor: "#1d4ed8",
        backgroundImage: null,
        frontElements: "[]",
        backElements: "[]",
        templateFieldsJson: JSON.stringify(fields),
      };
      const res  = await fetch(`${BASE_URL}/CardTemplate/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setTemplateId(data.templateId);
        setSavedMsg("✅ Saved!");
        setTimeout(() => setSavedMsg(""), 3000);
      }
    } catch {}
    finally { setSaving(false); }
  };

  // ── Print card ──
  const printCard = () => {
    if (!selStudent || !selSchool) return;
    const win = window.open("", "_blank");
    if (!win) return;

    const cardW = "85.6mm";
    const cardH = "54mm";

    const frontBg = selSchool.cardTemplateFront
      ? `<img src="${imgSrc(selSchool.cardTemplateFront)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />`
      : `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1d4ed8,#3b82f6);"></div>`;

    const fieldsHtml = fields
      .filter(f => f.visible)
      .map(f => {
        const style = `position:absolute;left:${f.x}%;top:${f.y}%;width:${f.width}%;`;
        if (f.isImage) {
          const src = getImageSrc(f, selStudent, selSchool);
          if (!src) return "";
          return `<img src="${src}" style="${style}height:${f.height}%;object-fit:cover;border-radius:3px;" />`;
        }
        const val = getFieldValue(f, selStudent, selSchool);
        if (!val) return "";
        return `<div style="${style}font-size:${f.fontSize}px;color:${f.fontColor};
          font-weight:${f.bold ? "bold" : "normal"};font-style:${f.italic ? "italic" : "normal"};
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
          text-shadow:0 1px 3px rgba(0,0,0,0.8);">${val}</div>`;
      }).join("");

    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  @page{size:${cardW} ${cardH};margin:0;}
</style>
</head><body>
<div style="position:relative;width:${cardW};height:${cardH};overflow:hidden;">
  ${frontBg}
  ${fieldsHtml}
</div>
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
  };

  const selectedField = fields.find(f => f.key === selectedKey) || null;

  const updateField = (key: string, updates: Partial<FieldPosition>) =>
    setFields(prev => prev.map(f => f.key === key ? { ...f, ...updates } : f));

  // ── Template image ──
  const templateImg = activeSide === "front"
    ? selSchool?.cardTemplateFront
    : selSchool?.cardTemplateBack;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* ── LEFT PANEL — School/Student selector ── */}
      <div className="w-64 bg-white border-r flex flex-col shrink-0">
       <div className="p-4 border-b bg-blue-700 text-white">
          <a href="/admin/print" className="flex items-center gap-1 text-blue-200 hover:text-white text-xs mb-2 transition-colors">
            ← Back to Print
          </a>
          <h2 className="font-bold text-sm">Card Designer</h2>
          <p className="text-xs text-blue-200 mt-0.5">Drag fields to reposition</p>
        </div>

        <div className="p-3 space-y-3 flex-1 overflow-y-auto">
          {/* School selector */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">School</label>
            <select
              className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selSchool?.schoolId || ""}
              onChange={e => {
                const s = schools.find(sc => sc.schoolId === Number(e.target.value));
                setSelSchool(s || null);
                setSelStudent(null);
                setStudents([]);
                setFields(DEFAULT_FIELDS);
                setTemplateId(null);
              }}>
              <option value="">-- Select School --</option>
              {schools.map(s => <option key={s.schoolId} value={s.schoolId}>{s.schoolName}</option>)}
            </select>
          </div>

          {/* Student selector */}
          {students.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                Preview Student
              </label>
              <select
                className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selStudent?.studentId || ""}
                onChange={e => {
                  const s = students.find(st => st.studentId === Number(e.target.value));
                  setSelStudent(s || null);
                }}>
                {students.map(s => <option key={s.studentId} value={s.studentId}>{s.fullName}</option>)}
              </select>
            </div>
          )}

          {/* Front/Back toggle */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Side</label>
            <div className="flex rounded-lg border overflow-hidden">
              {(["front", "back"] as const).map(side => (
                <button key={side}
                  onClick={() => setActiveSide(side)}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    activeSide === side ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}>
                  {side === "front" ? "◼ Front" : "◻ Back"}
                </button>
              ))}
            </div>
          </div>

          {/* Fields list */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Fields</label>
            <div className="space-y-1">
              {fields.map(f => (
                <div key={f.key}
                  onClick={() => setSelectedKey(f.key)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
                    selectedKey === f.key ? "bg-blue-50 border border-blue-300" : "hover:bg-gray-50 border border-transparent"
                  }`}>
                  <span className="font-medium text-gray-700">{f.label}</span>
                  <button
                    onClick={e => { e.stopPropagation(); updateField(f.key, { visible: !f.visible }); }}
                    className={`text-xs px-1.5 py-0.5 rounded ${f.visible ? "text-green-600" : "text-gray-300"}`}>
                    {f.visible ? "●" : "○"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={() => setFields(DEFAULT_FIELDS)}
            className="w-full text-xs text-gray-500 border border-dashed rounded-lg py-1.5 hover:border-gray-400 hover:text-gray-700 transition-colors">
            Reset to Default
          </button>
        </div>

        {/* Save button */}
        <div className="p-3 border-t space-y-2">
          {savedMsg && <p className="text-xs text-green-600 text-center font-medium">{savedMsg}</p>}
          <button
            onClick={saveTemplate}
            disabled={saving || !selSchool}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {saving ? "Saving..." : "💾 Save Layout"}
          </button>
          <button
            onClick={printCard}
            disabled={!selStudent || !selSchool}
            className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            🖨️ Print Card
          </button>
        </div>
      </div>

      {/* ── CENTER — Card Canvas ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 overflow-auto p-8">
        <div className="space-y-3 text-center">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
           CR80 — 54 × 85.6mm (Portrait)
          </p>

          {/* Card */}
          <div
            ref={cardRef}
            className="relative shadow-2xl rounded-lg overflow-hidden select-none"
            style={{ width: 216, height: 342, cursor: "default" }}
            onClick={() => setSelectedKey(null)}>

            {/* Background */}
            {templateImg
  ? <img
      src={imgSrc(templateImg)}
      className="absolute inset-0 w-full h-full"
      style={{ objectFit: "cover", zIndex: 0, display: "block" }}
      alt="template"
      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  : <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-500" />
}

            {/* Fields overlay */}
            {fields.filter(f => f.visible).map(f => {
              const isSelected = selectedKey === f.key;
              const style: React.CSSProperties = {
                position: "absolute",
                zIndex: 1,
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.width}%`,
                height: `${f.height}%`,
                cursor: "move",
                outline: isSelected ? "2px dashed #facc15" : "1px dashed rgba(255,255,255,0.2)",
                borderRadius: 2,
              };

              if (f.isImage) {
                const src = selStudent && selSchool ? getImageSrc(f, selStudent, selSchool) : "";
                return (
                  <div key={f.key} style={style}
                    onMouseDown={e => handleMouseDown(e, f.key)}>
                    {src
                      ? <img src={src} className="w-full h-full object-cover rounded" alt={f.label} />
                      :  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center border border-dashed border-gray-400">
                          <span className="text-white text-[9px] opacity-60">{f.label}</span>
                        </div>
                    }
                    {isSelected && (
                      <div className="absolute -top-4 left-0 bg-yellow-400 text-black text-[9px] px-1 rounded font-bold whitespace-nowrap">
                        {f.label}
                      </div>
                    )}
                  </div>
                );
              }

              const val = selStudent && selSchool ? getFieldValue(f, selStudent, selSchool) : f.label;
              return (
                <div key={f.key} style={{
                  ...style,
                  fontSize: f.fontSize,
                  color: f.fontColor || "#ffffff",
                  fontWeight: f.bold ? "bold" : "normal",
                  fontStyle: f.italic ? "italic" : "normal",
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                }}
                  onMouseDown={e => handleMouseDown(e, f.key)}>
                  {val || f.label}
                  {isSelected && (
                    <div className="absolute -top-4 left-0 bg-yellow-400 text-black text-[9px] px-1 rounded font-bold whitespace-nowrap">
                      {f.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selSchool && !selSchool.cardTemplateFront && (
            <p className="text-xs text-amber-500">
              ⚠ No template uploaded — go to School Management to upload Front/Back template
            </p>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL — Field Properties ── */}
      <div className="w-60 bg-white border-l flex flex-col shrink-0">
        <div className="p-3 border-b">
          <h3 className="font-bold text-sm text-gray-700">
            {selectedField ? `✏️ ${selectedField.label}` : "Field Properties"}
          </h3>
          {!selectedField && <p className="text-xs text-gray-400 mt-0.5">Click a field to edit</p>}
        </div>

        {selectedField && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">

            {/* Position */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Position</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">X %</label>
                  <input type="number" min={0} max={95} value={Math.round(selectedField.x)}
                    onChange={e => updateField(selectedField.key, { x: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">Y %</label>
                  <input type="number" min={0} max={95} value={Math.round(selectedField.y)}
                    onChange={e => updateField(selectedField.key, { y: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Size</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">Width %</label>
                  <input type="number" min={5} max={100} value={Math.round(selectedField.width)}
                    onChange={e => updateField(selectedField.key, { width: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">Height %</label>
                  <input type="number" min={2} max={100} value={Math.round(selectedField.height)}
                    onChange={e => updateField(selectedField.key, { height: Number(e.target.value) })}
                    className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* Text properties — only for text fields */}
            {!selectedField.isImage && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Text Style</p>

                {/* Font size */}
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">Font Size (px)</label>
                  <input type="range" min={6} max={24} value={selectedField.fontSize}
                    onChange={e => updateField(selectedField.key, { fontSize: Number(e.target.value) })}
                    className="w-full" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>6px</span>
                    <span className="font-bold text-blue-600">{selectedField.fontSize}px</span>
                    <span>24px</span>
                  </div>
                </div>

                {/* Font color */}
                <div>
                  <label className="text-xs text-gray-500 block mb-0.5">Font Color</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={selectedField.fontColor}
                      onChange={e => updateField(selectedField.key, { fontColor: e.target.value })}
                      className="w-8 h-8 rounded border cursor-pointer p-0.5" />
                    <span className="text-xs font-mono text-gray-500">{selectedField.fontColor}</span>
                  </div>
                </div>

                {/* Bold / Italic */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField(selectedField.key, { bold: !selectedField.bold })}
                    className={`flex-1 py-1.5 rounded border text-xs font-bold transition-colors ${
                      selectedField.bold ? "bg-blue-600 text-white border-blue-600" : "text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>
                    B
                  </button>
                  <button
                    onClick={() => updateField(selectedField.key, { italic: !selectedField.italic })}
                    className={`flex-1 py-1.5 rounded border text-xs italic transition-colors ${
                      selectedField.italic ? "bg-blue-600 text-white border-blue-600" : "text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>
                    I
                  </button>
                </div>
              </div>
            )}

            {/* Quick colors for text */}
            {!selectedField.isImage && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Quick Colors</p>
                <div className="flex flex-wrap gap-1.5">
                  {["#ffffff", "#000000", "#ffde59", "#ff6b6b", "#51cf66", "#74c0fc", "#ffa94d"].map(c => (
                    <button key={c}
                      onClick={() => updateField(selectedField.key, { fontColor: c })}
                      style={{ background: c }}
                      className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                        selectedField.fontColor === c ? "border-blue-500 scale-110" : "border-gray-200"
                      }`} />
                  ))}
                </div>
              </div>
            )}

            {/* Visibility toggle */}
            <div className="pt-2 border-t">
              <button
                onClick={() => updateField(selectedField.key, { visible: !selectedField.visible })}
                className={`w-full py-1.5 rounded border text-xs font-medium transition-colors ${
                  selectedField.visible
                    ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                    : "border-gray-200 text-gray-400 hover:border-gray-400"
                }`}>
                {selectedField.visible ? "● Visible" : "○ Hidden"}
              </button>
            </div>
          </div>
        )}

        {/* Help text */}
        {!selectedField && (
          <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl mb-2">🖱️</div>
            <p className="text-xs text-gray-400">Click any field on the card to edit its properties</p>
            <p className="text-xs text-gray-300 mt-2">Drag fields directly on the card to reposition</p>
          </div>
        )}
      </div>
    </div>
  );
}