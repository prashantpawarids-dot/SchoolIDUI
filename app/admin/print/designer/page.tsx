"use client";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/lib/api";
import { useSchools } from "@/lib/school-context";

// ── Types ──────────────────────────────────────────────
interface FieldPosition {
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
  visible: boolean;
  isImage: boolean;
  width: number;
  height: number;
  align: "left" | "center" | "right";
  exposure?: number;   // -100 to 100, default 0
  contrast?: number;   // -100 to 100, default 0
  brightness?: number; // -100 to 100, default 0
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
  middleName?: string;
  lastName?: string;
  rollNo?: string;
  className?: string;
  divisionName?: string;
  dob?: string;
  bloodGroup?: string;
  photoPath?: string;
  address?: string;
  parentName?: string;
  emergencyContact?: string;
  parentContact?: string;
  schoolId?: number;
}

// ── All available fields pool ──────────────────────────
const FIELD_POOL: Omit<FieldPosition, "x" | "y">[] = [
  { key: "schoolLogo",    label: "School Logo",       fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 30, height: 15, align: "center" },
  { key: "photo",         label: "Student Photo",     fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 40, height: 25, align: "center" },
  { key: "studentName",   label: "Student Name",      fontSize: 11, fontColor: "#000000", bold: true,  italic: false, visible: true,  isImage: false, width: 90, height: 6,  align: "center" },
  { key: "classDivision", label: "Class/Division",    fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 60, height: 5,  align: "left"   },
  { key: "rollNo",        label: "Roll No",           fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 50, height: 5,  align: "left"   },
  { key: "dob",           label: "Date of Birth",     fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 60, height: 5,  align: "left"   },
  { key: "bloodGroup",    label: "Blood Group",       fontSize: 9,  fontColor: "#000000", bold: true,  italic: false, visible: true,  isImage: false, width: 25, height: 5,  align: "left"   },
  { key: "signature",     label: "Principal Sign",    fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 35, height: 7,  align: "center" },
  { key: "address",       label: "Address",           fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "left"   },
  { key: "parentContact", label: "Emergency Contact", fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "left"   },
  { key: "parentName",    label: "Parent Name",       fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "left"   },
];

// ── Default front fields ───────────────────────────────
const DEFAULT_FIELDS: FieldPosition[] = [
  { key: "schoolLogo",    label: "School Logo",    x: 35, y: 2,  fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 30, height: 18, align: "center" },
  { key: "photo",         label: "Student Photo",  x: 25, y: 22, fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 50, height: 28, align: "center" },
  { key: "studentName",   label: "Student Name",   x: 5,  y: 53, fontSize: 11, fontColor: "#000000", bold: true,  italic: false, visible: true,  isImage: false, width: 90, height: 6,  align: "center" },
  { key: "classDivision", label: "Class/Division", x: 5,  y: 61, fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "center" },
  { key: "rollNo",        label: "Roll No",        x: 5,  y: 68, fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 50, height: 5,  align: "left"   },
  { key: "dob",           label: "Date of Birth",  x: 5,  y: 75, fontSize: 9,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 60, height: 5,  align: "left"   },
  { key: "bloodGroup",    label: "Blood Group",    x: 65, y: 75, fontSize: 9,  fontColor: "#000000", bold: true,  italic: false, visible: true,  isImage: false, width: 25, height: 5,  align: "left"   },
  { key: "signature",     label: "Principal Sign", x: 55, y: 88, fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 35, height: 7,  align: "center" },
];

// ── Default back fields ────────────────────────────────
const DEFAULT_BACK_FIELDS: FieldPosition[] = [
  { key: "schoolLogo",    label: "School Logo",       x: 35, y: 3,  fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 30, height: 15, align: "center" },
  { key: "studentName",   label: "Student Name",      x: 5,  y: 20, fontSize: 10, fontColor: "#000000", bold: true,  italic: false, visible: true,  isImage: false, width: 90, height: 6,  align: "center" },
  { key: "classDivision", label: "Class/Division",    x: 5,  y: 28, fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "center" },
  { key: "address",       label: "Address",           x: 5,  y: 40, fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "left"   },
  { key: "parentContact", label: "Emergency Contact", x: 5,  y: 48, fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "left"   },
  { key: "parentName",    label: "Parent Name",       x: 5,  y: 56, fontSize: 8,  fontColor: "#000000", bold: false, italic: false, visible: true,  isImage: false, width: 90, height: 5,  align: "left"   },
  { key: "signature",     label: "Principal Sign",    x: 55, y: 88, fontSize: 0,  fontColor: "",        bold: false, italic: false, visible: true,  isImage: true,  width: 35, height: 7,  align: "center" },
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
    case "classDivision": return `${student.className || ""} - ${student.divisionName || ""}`;
    case "rollNo":        return `Roll: ${student.rollNo || ""}`;
    case "dob":           return `DOB: ${formatDOB(student.dob)}`;
    case "bloodGroup":    return student.bloodGroup || "";
    case "address":       return student.address || "";
    case "parentContact": return student.emergencyContact || student.parentContact || "";
    case "parentName":    return student.parentName || "";
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

function detectOrientation(url: string): Promise<"landscape" | "portrait"> {
  return new Promise(resolve => {
    if (!url) return resolve("portrait");
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > img.naturalHeight ? "landscape" : "portrait");
    img.onerror = () => resolve("portrait");
    img.src = url;
  });
}

function canvasSize(orientation: "landscape" | "portrait") {
  return orientation === "landscape" ? { w: 342, h: 216 } : { w: 216, h: 342 };
}

// ── CMYK ↔ RGB conversion ───────────────────────────────
interface CMYK { c: number; m: number; y: number; k: number; }

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = (hex || "#000000").replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rf - k) / (1 - k);
  const m = (1 - gf - k) / (1 - k);
  const y = (1 - bf - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
  const cf = c / 100, mf = m / 100, yf = y / 100, kf = k / 100;
  const r = 255 * (1 - cf) * (1 - kf);
  const g = 255 * (1 - mf) * (1 - kf);
  const b = 255 * (1 - yf) * (1 - kf);
  return { r, g, b };
}

function hexToCmyk(hex: string): CMYK {
  const { r, g, b } = hexToRgb(hex);
  return rgbToCmyk(r, g, b);
}

function cmykToHex(c: number, m: number, y: number, k: number): string {
  const { r, g, b } = cmykToRgb(c, m, y, k);
  return rgbToHex(r, g, b);
}

// ── Image enhancement → CSS filter string ──────────────
function enhancementFilter(exposure = 0, contrast = 0, brightness = 0): string {
  // Exposure approximated as additional brightness; brightness/contrast as percentages around 100%
  const exposureFactor   = 1 + exposure / 100;
  const brightnessFactor = 1 + brightness / 100;
  const contrastFactor   = 1 + contrast / 100;
  return `brightness(${(exposureFactor * brightnessFactor).toFixed(2)}) contrast(${contrastFactor.toFixed(2)})`;
}

// ── Main Component ─────────────────────────────────────
// ── CMYK Slider Group ───────────────────────────────────
function CmykSliders({ hex, onChange }: { hex: string; onChange: (hex: string) => void }) {
  const cmyk = hexToCmyk(hex);

  const update = (channel: keyof CMYK, value: number) => {
    const next = { ...cmyk, [channel]: value };
    onChange(cmykToHex(next.c, next.m, next.y, next.k));
  };

  const channels: { key: keyof CMYK; label: string; track: string }[] = [
    { key: "c", label: "C", track: "#06b6d4" },
    { key: "m", label: "M", track: "#ec4899" },
    { key: "y", label: "Y", track: "#eab308" },
    { key: "k", label: "K", track: "#1f2937" },
  ];

  return (
    <div className="space-y-2 mt-1">
      {channels.map(ch => (
        <div key={ch.key}>
          <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
            <span className="font-semibold">{ch.label}</span>
            <span className="font-mono">{cmyk[ch.key]}%</span>
          </div>
          <input
            type="range" min={0} max={100} value={cmyk[ch.key]}
            onChange={e => update(ch.key, Number(e.target.value))}
            className="w-full"
            style={{ accentColor: ch.track }}
          />
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <div className="w-6 h-6 rounded border" style={{ background: hex }} />
        <span className="text-xs font-mono text-gray-500">{hex}</span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function CardDesignerPage() {
  const { schools } = useSchools();
  const [students, setStudents]         = useState<Student[]>([]);
  const [selSchool, setSelSchool]       = useState<School | null>(null);
  const [selStudent, setSelStudent]     = useState<Student | null>(null);
  const [activeSide, setActiveSide]     = useState<"front" | "back">("front");
  const [frontFields, setFrontFields]   = useState<FieldPosition[]>(DEFAULT_FIELDS);
  const [backFields, setBackFields]     = useState<FieldPosition[]>(DEFAULT_BACK_FIELDS);
  const [selectedKey, setSelectedKey]   = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [savedMsg, setSavedMsg]         = useState("");
  const [templateId, setTemplateId]     = useState<number | null>(null);
  const [showAddField, setShowAddField] = useState(false);
const [frontOrientation, setFrontOrientation] = useState<"landscape" | "portrait">("portrait");
  const [backOrientation,  setBackOrientation]  = useState<"landscape" | "portrait">("portrait");
  const [colorMode, setColorMode] = useState<"rgb" | "cmyk">("rgb");

  const fields      = activeSide === "front" ? frontFields : backFields;
  const setFields   = activeSide === "front" ? setFrontFields : setBackFields;
  const orientation = activeSide === "front" ? frontOrientation : backOrientation;
  const { w: canvasW, h: canvasH } = canvasSize(orientation);

  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ key: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const usedKeys     = fields.map(f => f.key);
  const availablePool = FIELD_POOL.filter(f => !usedKeys.includes(f.key));

  // Detect orientation when school changes
  useEffect(() => {
    if (!selSchool) return;
    if (selSchool.cardTemplateFront)
      detectOrientation(imgSrc(selSchool.cardTemplateFront)).then(setFrontOrientation);
    if (selSchool.cardTemplateBack)
      detectOrientation(imgSrc(selSchool.cardTemplateBack)).then(setBackOrientation);
  }, [selSchool]);

  // Load students + template when school changes
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

    fetch(`${BASE_URL}/CardTemplate/list?schoolId=${selSchool.schoolId}`)
      .then(r => r.json())
      .then((data: any[]) => {
        if (data && data.length > 0) {
          const t = data[0];
          setTemplateId(t.templateId);
          if (t.templateFieldsJson) {
            try {
              const saved = JSON.parse(t.templateFieldsJson);
              if (saved && saved.front && saved.back) {
                // Migrate old saved fields — add align if missing
                setFrontFields(saved.front.map((f: any) => ({ align: "left", ...f })));
                setBackFields(saved.back.map((f: any) => ({ align: "left", ...f })));
              } else if (Array.isArray(saved) && saved.length > 0) {
                setFrontFields(saved.map((f: any) => ({ align: "left", ...f })));
                setBackFields(DEFAULT_BACK_FIELDS);
              }
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [selSchool]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedKey(key);
    if (!cardRef.current) return;
    const field = fields.find(f => f.key === key)!;
    dragRef.current = { key, startX: e.clientX, startY: e.clientY, origX: field.x, origY: field.y };
  };

 useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const dx = ((e.clientX - drag.startX) / rect.width)  * 100;
      const dy = ((e.clientY - drag.startY) / rect.height) * 100;
      const newX = Math.max(0, Math.min(90, drag.origX + dx));
      const newY = Math.max(0, Math.min(95, drag.origY + dy));
      const dragKey = drag.key;
      // Directly update front or back based on active side at drag time
      if (activeSide === "front") {
        setFrontFields(prev => prev.map(f => f.key === dragKey ? { ...f, x: newX, y: newY } : f));
      } else {
        setBackFields(prev => prev.map(f => f.key === dragKey ? { ...f, x: newX, y: newY } : f));
      }
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [activeSide]); // re-register when side switches

  // Save template
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
        orientation: frontOrientation,
        backgroundColor: "#1d4ed8",
        backgroundImage: null,
        frontElements: "[]",
        backElements: "[]",
        templateFieldsJson: JSON.stringify({ front: frontFields, back: backFields }),
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

  const selectedField = fields.find(f => f.key === selectedKey) || null;
  const updateField   = (key: string, updates: Partial<FieldPosition>) =>
    setFields(prev => prev.map(f => f.key === key ? { ...f, ...updates } : f));

  // Add field from pool
  const addField = (poolField: Omit<FieldPosition, "x" | "y">) => {
    const exists = fields.find(f => f.key === poolField.key);
    if (exists) {
      updateField(poolField.key, { visible: true });
      setShowAddField(false);
      return;
    }
    setFields(prev => [...prev, { ...poolField, x: 5, y: 10 }]);
    setShowAddField(false);
    setSelectedKey(poolField.key);
  };

  // Remove field
  const removeField = (key: string) => {
    setFields(prev => prev.filter(f => f.key !== key));
    if (selectedKey === key) setSelectedKey(null);
  };

  const templateImg      = activeSide === "front" ? selSchool?.cardTemplateFront : selSchool?.cardTemplateBack;
  const orientationLabel = orientation === "landscape" ? "CR80 — 85.6 × 54mm (Landscape)" : "CR80 — 54 × 85.6mm (Portrait)";

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r flex flex-col shrink-0 order-2 lg:order-1 max-h-[40vh] lg:max-h-none">
        <div className="p-4 border-b bg-blue-700 text-white">
          <a href="/admin/print" className="flex items-center gap-1 text-blue-200 hover:text-white text-xs mb-2 transition-colors">
            ← Back to Print
          </a>
          <h2 className="font-bold text-sm">Card Designer</h2>
          <p className="text-xs text-blue-200 mt-0.5">Drag fields to reposition</p>
        </div>

        <div className="p-3 space-y-3 flex-1 overflow-y-auto">
          {/* School */}
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
                setFrontFields(DEFAULT_FIELDS);
                setBackFields(DEFAULT_BACK_FIELDS);
                setTemplateId(null);
                setFrontOrientation("portrait");
                setBackOrientation("portrait");
                setShowAddField(false);
                setSelectedKey(null);
              }}>
              <option value="">-- Select School --</option>
              {schools.map(s => <option key={s.schoolId} value={s.schoolId}>{s.schoolName}</option>)}
            </select>
          </div>

          {/* Student */}
          {students.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Preview Student</label>
              <select
                className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selStudent?.studentId || ""}
                onChange={e => setSelStudent(students.find(st => st.studentId === Number(e.target.value)) || null)}>
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
                  onClick={() => { setActiveSide(side); setSelectedKey(null); setShowAddField(false); }}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    activeSide === side ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}>
                  {side === "front" ? "◼ Front" : "◻ Back"}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-center mt-1 text-gray-400">
              {orientation === "landscape" ? "🔲 Landscape detected" : "🔳 Portrait detected"}
            </p>
          </div>

          {/* Fields list */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fields</label>
              <button
                onClick={() => setShowAddField(v => !v)}
                className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                {showAddField ? "✕ Close" : "+ Add"}
              </button>
            </div>

            {/* Add field picker */}
            {showAddField && (
              <div className="mb-2 border rounded-lg bg-white shadow-sm overflow-hidden max-h-40 overflow-y-auto">
                {availablePool.length === 0
                  ? <p className="text-xs text-gray-400 p-2 text-center">All fields added</p>
                  : availablePool.map(f => (
                    <button key={f.key}
                      onClick={() => addField(f)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 transition-colors border-b last:border-b-0 text-gray-700 flex items-center gap-2">
                      <span className="text-gray-400 text-[10px]">{f.isImage ? "🖼" : "T"}</span>
                      {f.label}
                    </button>
                  ))
                }
              </div>
            )}

            <div className="space-y-1">
              {fields.map(f => (
                <div key={f.key}
                  onClick={() => setSelectedKey(f.key)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
                    selectedKey === f.key ? "bg-blue-50 border border-blue-300" : "hover:bg-gray-50 border border-transparent"
                  }`}>
                  <span className="font-medium text-gray-700 truncate flex-1 mr-1">{f.label}</span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      title={f.visible ? "Hide" : "Show"}
                      onClick={e => { e.stopPropagation(); updateField(f.key, { visible: !f.visible }); }}
                      className={`text-xs px-1 py-0.5 rounded ${f.visible ? "text-green-600" : "text-gray-300"}`}>
                      {f.visible ? "●" : "○"}
                    </button>
                    <button
                      title="Remove field"
                      onClick={e => { e.stopPropagation(); removeField(f.key); }}
                      className="text-xs px-1 py-0.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setFields(activeSide === "front" ? DEFAULT_FIELDS : DEFAULT_BACK_FIELDS);
              setSelectedKey(null);
              setShowAddField(false);
            }}
            className="w-full text-xs text-gray-500 border border-dashed rounded-lg py-1.5 hover:border-gray-400 hover:text-gray-700 transition-colors">
            Reset {activeSide === "front" ? "Front" : "Back"} to Default
          </button>
        </div>

        {/* Save */}
        <div className="p-3 border-t space-y-2">
          {savedMsg && <p className="text-xs text-green-600 text-center font-medium">{savedMsg}</p>}
          <button
            onClick={saveTemplate}
            disabled={saving || !selSchool}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {saving ? "Saving..." : "💾 Save Layout"}
          </button>
        </div>
      </div>

      {/* ── CENTER — Card Canvas ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 overflow-auto p-3 md:p-8 order-1 lg:order-2 min-h-0">
        <div className="space-y-3 text-center w-full">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            {orientationLabel} — {activeSide === "front" ? "FRONT SIDE" : "BACK SIDE"}
          </p>

          <div className="inline-block origin-top scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100">
           <div
              ref={cardRef}
              className="relative shadow-2xl rounded-lg overflow-hidden select-none"
              style={{ width: canvasW, height: canvasH, cursor: "default" }}
              onClick={(e) => { if (e.target === cardRef.current) setSelectedKey(null); }}>

              {/* Background */}
              {templateImg
                ? <img src={imgSrc(templateImg)} className="absolute inset-0 w-full h-full"
                    style={{ objectFit: "cover", zIndex: 0, display: "block" }} alt="template"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                : <div className="absolute inset-0 bg-white border border-gray-200" />
              }

              {/* Fields */}
              {fields.filter(f => f.visible).map(f => {
                const isSelected = selectedKey === f.key;
                const baseStyle: React.CSSProperties = {
                  position: "absolute",
                  zIndex: 1,
                  left: `${f.x}%`,
                  top: `${f.y}%`,
                  width: `${f.width}%`,
                  height: `${f.height}%`,
                  cursor: "move",
                outline: isSelected ? "2px dashed #facc15" : "1px dashed rgba(0,0,0,0.15)",
                  borderRadius: 2,
                };

               if (f.isImage) {
                  const src = selStudent && selSchool ? getImageSrc(f, selStudent, selSchool) : "";
                  const filterStr = enhancementFilter(f.exposure, f.contrast, f.brightness);
                  return (
                    <div key={f.key} style={baseStyle} onMouseDown={e => handleMouseDown(e, f.key)}>
                      {src
                        ? <img src={src} className="w-full h-full object-cover rounded" alt={f.label} style={{ filter: filterStr }} />
                       : <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center border border-dashed border-gray-300">
                            <span className="text-gray-400 text-[9px]">{f.label}</span>
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

                const rawVal = selStudent && selSchool ? getFieldValue(f, selStudent, selSchool) : "";
                const val    = rawVal || `[${f.label}]`;
                const justifyMap = { left: "flex-start", center: "center", right: "flex-end" };

                return (
                  <div key={f.key} style={{
                    ...baseStyle,
                    fontSize: f.fontSize,
                    color: f.fontColor || "#ffffff",
                    fontWeight: f.bold ? "bold" : "normal",
                    fontStyle: f.italic ? "italic" : "normal",
                    textShadow: "0 1px 2px rgba(0,0,0,0.7)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: justifyMap[f.align || "left"],
                  }}
                    onMouseDown={e => handleMouseDown(e, f.key)}>
                    {val}
                    {isSelected && (
                      <div className="absolute -top-4 left-0 bg-yellow-400 text-black text-[9px] px-1 rounded font-bold whitespace-nowrap">
                        {f.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selSchool && activeSide === "front" && !selSchool.cardTemplateFront && (
            <p className="text-xs text-amber-500">⚠ No front template — upload in School Management</p>
          )}
          {selSchool && activeSide === "back" && !selSchool.cardTemplateBack && (
            <p className="text-xs text-amber-500">⚠ No back template — upload in School Management</p>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL — Field Properties ── */}
      <div className="w-full lg:w-60 bg-white border-t lg:border-t-0 lg:border-l flex flex-col shrink-0 order-3 max-h-[35vh] lg:max-h-none">
        <div className="p-3 border-b">
          <h3 className="font-bold text-sm text-gray-700">
            {selectedField ? `✏️ ${selectedField.label}` : "Field Properties"}
          </h3>
          {!selectedField && <p className="text-xs text-gray-400 mt-0.5">Click a field to edit</p>}
        </div>

        {selectedField && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">

            {/* Position */}
            <div className="space-y-1">
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
            <div className="space-y-1">
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

            {/* Text Style */}
           {/* Image Enhancement */}
            {selectedField.isImage && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Enhance Image</p>
                {([
                  { key: "exposure",   label: "Exposure"   },
                  { key: "contrast",   label: "Contrast"   },
                  { key: "brightness", label: "Brightness" },
                ] as const).map(s => (
                  <div key={s.key}>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                      <span>{s.label}</span>
                      <span className="font-mono text-blue-600">{selectedField[s.key] ?? 0}</span>
                    </div>
                    <input
                      type="range" min={-100} max={100} value={selectedField[s.key] ?? 0}
                      onChange={e => updateField(selectedField.key, { [s.key]: Number(e.target.value) } as Partial<FieldPosition>)}
                      className="w-full" />
                  </div>
                ))}
                <button
                  onClick={() => updateField(selectedField.key, { exposure: 0, contrast: 0, brightness: 0 })}
                  className="text-[10px] text-blue-500 hover:text-blue-700 underline">
                  Reset All
                </button>
              </div>
            )}

            {/* Text Style */}
           {/* Text Style */}
            {!selectedField.isImage && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Text Style</p>

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

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-500">Font Color</label>
                    <div className="flex rounded-md border overflow-hidden">
                      {(["rgb", "cmyk"] as const).map(m => (
                        <button key={m} type="button"
                          onClick={() => setColorMode(m)}
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase transition-colors ${
                            colorMode === m ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-50"
                          }`}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {colorMode === "rgb" ? (
                    <div className="flex gap-2 items-center">
                      <input type="color" value={selectedField.fontColor || "#000000"}
                        onChange={e => updateField(selectedField.key, { fontColor: e.target.value })}
                        className="w-8 h-8 rounded border cursor-pointer p-0.5" />
                      <span className="text-xs font-mono text-gray-500">{selectedField.fontColor}</span>
                    </div>
                  ) : (
                    <CmykSliders
                      hex={selectedField.fontColor || "#000000"}
                      onChange={hex => updateField(selectedField.key, { fontColor: hex })}
                    />
                  )}
                </div>

                {/* Bold / Italic */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField(selectedField.key, { bold: !selectedField.bold })}
                    className={`flex-1 py-1.5 rounded border text-xs font-bold transition-colors ${
                      selectedField.bold ? "bg-blue-600 text-white border-blue-600" : "text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>B</button>
                  <button
                    onClick={() => updateField(selectedField.key, { italic: !selectedField.italic })}
                    className={`flex-1 py-1.5 rounded border text-xs italic transition-colors ${
                      selectedField.italic ? "bg-blue-600 text-white border-blue-600" : "text-gray-500 border-gray-200 hover:border-gray-400"
                    }`}>I</button>
                </div>

                {/* Alignment */}
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Text Align</label>
                  <div className="flex rounded-lg border overflow-hidden">
                    {([
                      { val: "left",   icon: "⬅ Left"   },
                      { val: "center", icon: "↔ Center" },
                      { val: "right",  icon: "➡ Right"  },
                    ] as const).map(a => (
                      <button key={a.val}
                        onClick={() => updateField(selectedField.key, { align: a.val })}
                        className={`flex-1 py-1.5 text-[10px] font-medium transition-colors ${
                          (selectedField.align || "left") === a.val
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}>
                        {a.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick colors */}
            {!selectedField.isImage && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Quick Colors</p>
                <div className="flex flex-wrap gap-1.5">
                  {["#ffffff", "#000000", "#ffde59", "#ff6b6b", "#51cf66", "#74c0fc", "#ffa94d", "#cc0000"].map(c => (
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

            {/* Visibility + Remove */}
            <div className="pt-2 border-t space-y-2">
              <button
                onClick={() => updateField(selectedField.key, { visible: !selectedField.visible })}
                className={`w-full py-1.5 rounded border text-xs font-medium transition-colors ${
                  selectedField.visible
                    ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                    : "border-gray-200 text-gray-400 hover:border-gray-400"
                }`}>
                {selectedField.visible ? "● Visible" : "○ Hidden"}
              </button>
              <button
                onClick={() => removeField(selectedField.key)}
                className="w-full py-1.5 rounded border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors">
                🗑 Remove Field
              </button>
            </div>
          </div>
        )}

        {!selectedField && (
          <div className="flex-1 p-4 flex flex-col items-center justify-center text-center gap-2">
            <div className="text-3xl">🖱️</div>
            <p className="text-xs text-gray-400">Click any field on the card to edit</p>
            <p className="text-xs text-gray-300">Drag fields to reposition</p>
            <p className="text-xs text-gray-300">Use <span className="text-blue-500 font-medium">+ Add</span> to add new fields</p>
            <p className="text-xs text-gray-300">Use <span className="text-red-400 font-medium">✕</span> to remove fields</p>
          </div>
        )}
      </div>
    </div>
  );
}