"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Printer, FileDown, User, CreditCard,
  Settings2, Sun, Contrast, Move,
  CheckCircle2, XCircle, Loader2,
  History, X,
} from "lucide-react";
import type { Student } from "@/lib/types";
import { BASE_URL } from "@/lib/api";
import { buildDesignerPrintHtml } from "./lib/card-renderer";

const DEFAULT_CONFIG = {
  copies: 1,
  printSide: "Both",
  orientation: "Portrait",
  quality: "High",
  brightness: 0,
  contrast: 0,
  offsetX: 0,
  offsetY: 0,
};

function CompactIDCard({ student, school, side = "front" }: {
  student: Student; school: any; side?: "front" | "back"
}) {
  const hasFront = !!school.cardTemplateFront;
  const hasBack  = !!school.cardTemplateBack;

  if (side === "front") return (
    <div className="overflow-hidden shadow-md rounded-lg bg-white w-full">
      {hasFront ? (
        <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
          <img src={`data:image/png;base64,${school.cardTemplateFront}`}
            className="w-full h-full object-cover" style={{ display: "block" }} alt="Front" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
            <div className="w-12 h-14 rounded overflow-hidden border-2 border-white mt-8">
              <img src={student.photoPath || "/placeholder.svg"} alt={student.fullName}
                className="w-full h-full object-cover" />
            </div>
            <p className="font-bold text-[10px] text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {student.fullName}</p>
            <p className="text-white text-[8px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {student.className}-{student.divisionName} | Roll: {student.rollNo}</p>
            <p className="text-white text-[8px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              DOB: {new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              &nbsp;<span className="text-yellow-300">{student.bloodGroup}</span></p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white p-2.5">
          <div className="text-center border-b border-white/20 pb-2 mb-2">
            <div className="w-8 h-8 bg-white rounded-full mx-auto mb-1 flex items-center justify-center">
              {school.schoolLogo
                ? <img src={`data:image/png;base64,${school.schoolLogo}`}
                    className="w-full h-full object-cover rounded-full" alt="Logo" />
                : <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>}
            </div>
            <p className="font-bold text-[9px]">{school.schoolName}</p>
            <p className="text-[6px] opacity-80 tracking-wider">STUDENT IDENTITY CARD</p>
          </div>
          <div className="text-center mb-2">
            <div className="w-10 h-12 bg-white rounded mx-auto mb-1 overflow-hidden border border-white/30">
              <img src={student.photoPath || "/placeholder.svg"} alt={student.fullName}
                className="w-full h-full object-cover" />
            </div>
            <p className="font-bold text-[11px]">{student.fullName}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {[
              ["Class", `${student.className}-${student.divisionName}`, "#fff"],
              ["Roll No", String(student.rollNo || ""), "#fff"],
              ["Blood", student.bloodGroup || "", "#fde047"],
              ["DOB", new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), "#fff"],
            ].map(([lbl, val, clr]) => (
              <div key={String(lbl)} className="bg-white/15 rounded px-1.5 py-1 text-center">
                <span className="block text-[6px] opacity-75">{lbl}</span>
                <span className="font-semibold text-[8px]" style={{ color: String(clr) }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="overflow-hidden shadow-md rounded-lg bg-white w-full">
      {hasBack ? (
        <div className="relative overflow-hidden" style={{ minHeight: 120 }}>
          <img src={`data:image/png;base64,${school.cardTemplateBack}`}
            className="w-full h-full object-cover" style={{ display: "block" }} alt="Back" />
          <div className="absolute inset-0 flex flex-col justify-end p-2 gap-1">
            <p className="text-[7px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-semibold">
              Emergency: {student.parentName}</p>
            <p className="text-[6px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {student.emergencyContact}</p>
            <div className="flex justify-between items-end mt-1">
              <div className="text-center">
                <div className="w-10 border-b border-white/70 mb-0.5" />
                <span className="text-[6px] text-white">Parent</span>
              </div>
              <div className="text-center">
                {school.principalSignature &&
                  <img src={`data:image/png;base64,${school.principalSignature}`}
                    className="h-4 object-contain mx-auto mb-0.5" alt="Sig" />}
                <div className="w-10 border-b border-white/70 mb-0.5" />
                <span className="text-[6px] text-white">Principal</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-2.5 text-[8px]">
          <p className="font-bold text-blue-700 text-[8px] mb-1">{school.schoolName}</p>
          <p className="text-slate-500 text-[7px] mb-2 line-clamp-2">{school.schoolAddress}</p>
          <div className="flex items-center gap-2 py-1.5 border-t border-b border-slate-200 mb-1.5">
            <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="3" height="3" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-700 text-[7px]">Emergency</p>
              <p className="text-[7px]">{student.parentName}</p>
              <p className="text-slate-500 text-[7px]">{student.emergencyContact}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="w-10 border-b border-blue-700 mb-0.5" />
              <span className="text-[6px] text-slate-400">Parent</span>
            </div>
            <div className="text-center">
              {school.principalSignature &&
                <img src={`data:image/png;base64,${school.principalSignature}`}
                  className="h-4 object-contain mx-auto mb-0.5" alt="Sig" />}
              <div className="w-10 border-b border-blue-700 mb-0.5" />
              <span className="text-[6px] text-slate-400">Principal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Slider({ label, value, min, max, unit = "", icon, onChange }: {
  label: string; value: number; min: number; max: number;
  unit?: string; icon?: React.ReactNode; onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
          {icon}{label}
        </span>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
          {value > 0 ? `+${value}` : value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-sm"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{min}{unit}</span><span>0</span><span>+{max}{unit}</span>
      </div>
    </div>
  );
}

function ToggleGroup({ options, value, onChange }: {
  options: { label: string; value: string; icon?: React.ReactNode }[];
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden">
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 text-xs font-medium flex items-center justify-center gap-1
            transition-all border-r last:border-r-0 border-slate-200
            ${value === opt.value
              ? "bg-blue-600 text-white shadow-inner"
              : "bg-white text-slate-600 hover:bg-slate-50"}`}>
          {opt.icon}{opt.label}
        </button>
      ))}
    </div>
  );
}

export default function PrintIDCards() {
  /* ── Data state ── */
  const [schools, setSchools]     = useState<any[]>([]);
  const [years, setYears]         = useState<any[]>([]);
  const [classes, setClasses]     = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [students, setStudents]   = useState<Student[]>([]);
  const [filtered, setFiltered]   = useState<Student[]>([]);

  /* ── Filter state ── */
  const [selSchool, setSelSchool] = useState("all");
  const [selYear, setSelYear]     = useState("all");
  const [selClass, setSelClass]   = useState("all");
  const [selDiv, setSelDiv]       = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* ── Print panel state ── */
  const [showPanel, setShowPanel]         = useState(false);
  const [printConfig, setPrintConfig]     = useState({ ...DEFAULT_CONFIG });
  const [printerStatus, setPrinterStatus] = useState<any>(null);

  /* ── Job tracking state ── */
  const [currentJob, setCurrentJob]       = useState<any>(null);
  const [showProgress, setShowProgress]   = useState(false);
  const [jobHistory, setJobHistory]       = useState<any[]>([]);
  const [showHistory, setShowHistory]     = useState(false);
  const [isSending, setIsSending]         = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  /* ── Designer template state ── */
  const [designerTemplates, setDesignerTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate]   = useState<any>(null);

  /* ── Load data ── */
  useEffect(() => {
    loadSchools();
    loadStudents();
    loadHistory();
    loadDesignerTemplates();
  }, []);

  const loadSchools = async () => {
    const data = await fetch(`${BASE_URL}/School/list`).then(r => r.json());
    setSchools(data || []);
  };

  // const loadStudents = async () => {
  //   const all: Student[] = await fetch(`${BASE_URL}/Student/getall`).then(r => r.json());
  //   const accepted: Student[] = [];
  //   for (const s of all) {
  //     if (!s.studentId) continue;
  //     const apps = await fetch(`${BASE_URL}/Student/applications/student/${s.studentId}`).then(r => r.json());
  //     if (apps?.length && apps[0]?.status === "accept") accepted.push(s);
  //   }
  //   setStudents(accepted);
  //   setFiltered(accepted);
  //   setClasses(Array.from(new Map(accepted.map(s =>
  //     [s.classId, { classId: s.classId, className: s.className }]
  //   )).values()));
  // };

  const loadStudents = async () => {
  const data = await fetch(`${BASE_URL}/Student/getalwithstatus`)
    .then(r => r.json());
  const accepted = (data || []).filter((s: any) => s.applicationStatus === "accept");
  setStudents(accepted);
  setFiltered(accepted);
  setClasses(Array.from(new Map(accepted.map((s: any) =>
    [s.classId, { classId: s.classId, className: s.className }]
  )).values()));
};

  const loadHistory = async () => {
    try {
      const data = await fetch(`${BASE_URL}/Print/jobs`).then(r => r.json());
      setJobHistory(data || []);
    } catch { /* ignore */ }
  };

  /* ── Load designer templates ── */
  const loadDesignerTemplates = async () => {
    try {
      const schoolId = Number(localStorage.getItem("schoolId")) || 0;
      const param = schoolId ? `?schoolId=${schoolId}` : "";
      const data = await fetch(`${BASE_URL}/CardTemplate/list${param}`)
        .then(r => r.json());
      setDesignerTemplates(data || []);
    } catch { /* ignore */ }
  };

  /* ── Printer status ── */
  const fetchPrinterStatus = useCallback(async () => {
    try {
      const data = await fetch(`${BASE_URL}/Print/printerstatus`).then(r => r.json());
      setPrinterStatus(data);
    } catch {
      setPrinterStatus({ isOnline: false, status: "Offline", printerName: "Unknown" });
    }
  }, []);

  useEffect(() => {
    if (showPanel) { fetchPrinterStatus(); }
  }, [showPanel, fetchPrinterStatus]);

  /* ── Filter cascades ── */
  useEffect(() => {
    if (selSchool !== "all") {
      fetch(`${BASE_URL}/School/academicyear/${selSchool}`).then(r => r.json()).then(setYears);
      fetch(`${BASE_URL}/ClassDivision/getclasses?schoolId=${selSchool}`).then(r => r.json()).then(setClasses);
    } else { setYears([]); setClasses([]); setDivisions([]); }
  }, [selSchool]);

  useEffect(() => {
    if (selClass !== "all") {
      fetch(`${BASE_URL}/ClassDivision/getdivisions?classId=${selClass}`).then(r => r.json()).then(setDivisions);
    } else { setDivisions([]); }
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

  /* ── Selection ── */
  const toggle = (id: number) =>
    setSelectedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(s => s.studentId!));

  /* ── Job progress polling ── */
  const startPolling = (jobId: number) => {
    pollRef.current = setInterval(async () => {
      try {
        const data = await fetch(`${BASE_URL}/Print/jobstatus/${jobId}`).then(r => r.json());
        setCurrentJob(data);
        if (data.status === "Completed" || data.status === "Failed") {
          clearInterval(pollRef.current!);
          loadHistory();
        }
      } catch { clearInterval(pollRef.current!); }
    }, 2000);
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  /* ── Open browser print ── */
  const openBrowserPrint = (side: string) => {
    const selected = filtered.filter(s => selectedIds.includes(s.studentId!));
    if (!selected.length) return;

    const win = window.open("", "_blank");
    if (!win) return;

    /* ── ✅ Designer template mode ── */
    if (selectedTemplate) {
      try {
        const frontElements = JSON.parse(selectedTemplate.frontElements || "[]");
        const backElements  = JSON.parse(selectedTemplate.backElements  || "[]");
        const school = schools.find(sc => sc.schoolId === selected[0].schoolId) || schools[0] || {};

        const html = buildDesignerPrintHtml(
          selected, school,
          frontElements, backElements,
          Number(selectedTemplate.cardWidth),
          Number(selectedTemplate.cardHeight),
          selectedTemplate.backgroundColor || "#1d4ed8",
          selectedTemplate.backgroundImage || undefined,
          selectedTemplate.orientation || "portrait",
          side,
          printConfig.brightness,
          printConfig.contrast,
          printConfig.copies,
        );

        win.document.write(html);
        win.document.close();
        return;
      } catch (e) {
        console.error("Template render error:", e);
        // fallback to default below
      }
    }

    /* ── Default print ── */
    const isLandscape = printConfig.orientation === "Landscape";
    const cardW = isLandscape ? "85.6mm" : "54mm";
    const cardH = isLandscape ? "54mm"   : "85.6mm";
    const brightnessVal = `brightness(${1 + printConfig.brightness / 100})`;
    const contrastVal   = `contrast(${1 + printConfig.contrast / 100})`;

    const cardsHtml = selected.map(s => {
      const school = schools.find(sc => sc.schoolId === s.schoolId);
      if (!school) return "";
      const hasFront = !!school.cardTemplateFront;
      const hasBack  = !!school.cardTemplateBack;
      const dob = s.dob
        ? new Date(s.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : "";
      const showFront = side === "Front" || side === "Both";
      const showBack  = side === "Back"  || side === "Both";

      const frontHtml = showFront ? (hasFront
        ? `<div style="position:relative;width:${cardW};height:${cardH};overflow:hidden;">
            <img src="data:image/png;base64,${school.cardTemplateFront}"
              style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;" />
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;
              align-items:center;justify-content:center;gap:3px;padding:6px;">
              <div style="width:${isLandscape ? "36px" : "42px"};height:${isLandscape ? "42px" : "52px"};
                border-radius:3px;overflow:hidden;border:1.5px solid rgba(255,255,255,0.85);
                margin-top:${isLandscape ? "0" : "24px"};">
                <img src="${s.photoPath || ''}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <p style="font-weight:bold;font-size:${isLandscape ? "8px" : "9px"};color:#fff;
                text-align:center;text-shadow:0 1px 3px rgba(0,0,0,0.95);margin:1px 0 0;">${s.fullName}</p>
              <p style="font-size:7px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:0;">
                ${s.className}-${s.divisionName} | Roll: ${s.rollNo}</p>
              <p style="font-size:7px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9);margin:0;">
                DOB: ${dob} | <span style="color:#fde047;">${s.bloodGroup}</span></p>
            </div>
          </div>`
        : `<div style="width:${cardW};height:${cardH};
            background:linear-gradient(135deg,#1d4ed8,#3b82f6);color:#fff;
            display:flex;flex-direction:column;overflow:hidden;
            padding:6px;box-sizing:border-box;">
            <div style="text-align:center;border-bottom:1px solid rgba(255,255,255,0.3);
              padding-bottom:4px;margin-bottom:4px;">
              ${school.schoolLogo
                ? `<img src="data:image/png;base64,${school.schoolLogo}"
                    style="width:20px;height:20px;border-radius:50%;object-fit:cover;
                    margin:0 auto 2px;display:block;" />`
                : ""}
              <p style="font-weight:bold;font-size:7px;margin:0;">${school.schoolName}</p>
              <p style="font-size:5px;opacity:0.8;letter-spacing:1px;margin:0;">STUDENT IDENTITY CARD</p>
            </div>
            <div style="text-align:center;margin-bottom:4px;">
              <div style="width:28px;height:34px;background:#fff;border-radius:2px;overflow:hidden;
                margin:0 auto 2px;border:1px solid rgba(255,255,255,0.4);">
                <img src="${s.photoPath || ''}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <p style="font-weight:bold;font-size:7.5px;margin:0;">${s.fullName}</p>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">
              <div style="background:rgba(255,255,255,0.15);border-radius:2px;padding:2px;text-align:center;">
                <span style="display:block;font-size:5px;opacity:0.75;">Class</span>
                <span style="font-size:6.5px;font-weight:600;">${s.className}-${s.divisionName}</span>
              </div>
              <div style="background:rgba(255,255,255,0.15);border-radius:2px;padding:2px;text-align:center;">
                <span style="display:block;font-size:5px;opacity:0.75;">Roll No</span>
                <span style="font-size:6.5px;font-weight:600;">${s.rollNo}</span>
              </div>
              <div style="background:rgba(255,255,255,0.15);border-radius:2px;padding:2px;text-align:center;">
                <span style="display:block;font-size:5px;opacity:0.75;">Blood</span>
                <span style="font-size:6.5px;font-weight:600;color:#fde047;">${s.bloodGroup}</span>
              </div>
              <div style="background:rgba(255,255,255,0.15);border-radius:2px;padding:2px;text-align:center;">
                <span style="display:block;font-size:5px;opacity:0.75;">DOB</span>
                <span style="font-size:6.5px;font-weight:600;">${dob}</span>
              </div>
            </div>
          </div>`) : "";

      const backHtml = showBack ? (hasBack
        ? `<div style="position:relative;width:${cardW};height:${cardH};overflow:hidden;">
            <img src="data:image/png;base64,${school.cardTemplateBack}"
              style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;" />
            <div style="position:absolute;inset:0;display:flex;flex-direction:column;
              justify-content:flex-end;padding:5px;">
              <p style="font-size:6px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.95);margin:0 0 2px;">
                Emergency: ${s.parentName || ""} ${s.emergencyContact || ""}</p>
              <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                <div style="text-align:center;">
                  <div style="width:28px;border-bottom:1px solid rgba(255,255,255,0.8);margin-bottom:1px;"></div>
                  <span style="font-size:5px;color:#fff;">Parent</span>
                </div>
                <div style="text-align:center;">
                  ${school.principalSignature
                    ? `<img src="data:image/png;base64,${school.principalSignature}"
                        style="height:12px;object-fit:contain;display:block;margin:0 auto 1px;" />`
                    : ""}
                  <div style="width:28px;border-bottom:1px solid rgba(255,255,255,0.8);margin-bottom:1px;"></div>
                  <span style="font-size:5px;color:#fff;">Principal</span>
                </div>
              </div>
            </div>
          </div>`
        : `<div style="width:${cardW};height:${cardH};background:#f8fafc;
            padding:6px;box-sizing:border-box;display:flex;flex-direction:column;">
            <p style="font-weight:bold;font-size:7px;color:#1d4ed8;margin:0 0 1px;">${school.schoolName}</p>
            <p style="font-size:6px;color:#64748b;margin:0 0 4px;">${school.schoolAddress || ""}</p>
            <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;
              padding:3px 0;margin-bottom:4px;">
              <p style="font-size:6px;font-weight:600;color:#1d4ed8;margin:0 0 1px;">Emergency Contact</p>
              <p style="font-size:6px;margin:0 0 1px;">${s.parentName || ""}</p>
              <p style="font-size:6px;color:#64748b;margin:0;">${s.emergencyContact || ""}</p>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto;">
              <div style="text-align:center;">
                <div style="width:22px;border-bottom:1px solid #1d4ed8;margin-bottom:1px;"></div>
                <span style="font-size:5px;color:#94a3b8;">Parent</span>
              </div>
              <div style="text-align:center;">
                ${school.principalSignature
                  ? `<img src="data:image/png;base64,${school.principalSignature}"
                      style="height:12px;object-fit:contain;display:block;margin:0 auto 1px;" />`
                  : ""}
                <div style="width:22px;border-bottom:1px solid #1d4ed8;margin-bottom:1px;"></div>
                <span style="font-size:5px;color:#94a3b8;">Principal</span>
              </div>
            </div>
          </div>`) : "";

      return `${frontHtml}${backHtml}`;
    }).join("");

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>ID Cards</title>
  <style>
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    html,body{margin:0;padding:0;background:#fff;
      -webkit-print-color-adjust:exact;print-color-adjust:exact;}
    @page{size:${cardW} ${cardH};margin:0;}
    body{filter:${brightnessVal} ${contrastVal};}
    @media print{*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}}
  </style>
</head>
<body>
  ${cardsHtml}
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
</body>
</html>`);
    win.document.close();
  };

  /* ── Send to backend printer ── */
  const sendToPrinter = async () => {
    const selected = filtered.filter(s => selectedIds.includes(s.studentId!));
    if (!selected.length) return;
    setIsSending(true);
    try {
      const userId   = Number(localStorage.getItem("userId"))   || 0;
      const schoolId = Number(localStorage.getItem("schoolId")) || 0;
      const res = await fetch(`${BASE_URL}/Print/createjob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId:        schoolId || null,
          createdByUserId: userId   || null,
          studentIds:      selected.map(s => s.studentId),
          copies:          printConfig.copies,
          orientation:     printConfig.orientation,
          printQuality:    printConfig.quality,
          printSide:       printConfig.printSide,
          brightness:      printConfig.brightness,
          contrast:        printConfig.contrast,
          offsetX:         printConfig.offsetX,
          offsetY:         printConfig.offsetY,
          cardImagesBase64: [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentJob({ ...data, status: "Pending", printedCards: 0 });
        setShowPanel(false);
        setShowProgress(true);
        startPolling(data.jobId);
      } else {
        alert(data.message || "Failed to create print job");
      }
    } catch {
      alert("Failed to connect to print server");
    } finally {
      setIsSending(false);
    }
  };

  const totalCards = selectedIds.length * printConfig.copies;

  const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { color: string; dot: string }> = {
      Pending:    { color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
      Processing: { color: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-500 animate-pulse" },
      Completed:  { color: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
      Failed:     { color: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-500" },
    };
    const s = map[status] || map.Pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Print ID Cards" description="Professional card printing with Evolis-style configuration" />

      {/* ── FILTERS ── */}
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

        {/* ── Designer Template Selector ── */}
        {designerTemplates.length > 0 && (
          <CardContent className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label className="text-sm font-semibold">🎨 Use Designer Template</Label>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a saved template to use instead of default card design
                </p>
              </div>
              {selectedTemplate && (
                <button onClick={() => setSelectedTemplate(null)}
                  className="text-xs text-red-500 hover:underline">
                  ✕ Use Default Design
                </button>
              )}
            </div>
            <div className="flex gap-3 flex-wrap">
              {designerTemplates.map((t: any) => (
                <div key={t.templateId}
                  onClick={() => setSelectedTemplate(
                    selectedTemplate?.templateId === t.templateId ? null : t
                  )}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer
                    transition-all hover:shadow-sm
                    ${selectedTemplate?.templateId === t.templateId
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 hover:border-blue-300"}`}>
                  <div className="w-6 h-9 rounded border border-slate-200 shrink-0 overflow-hidden"
                    style={{ background: t.backgroundColor || "#1d4ed8" }}>
                    {t.backgroundImage && (
                      <img src={`data:image/png;base64,${t.backgroundImage}`}
                        className="w-full h-full object-cover" alt="" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{t.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {Number(t.cardWidth)}×{Number(t.cardHeight)}mm
                    </p>
                  </div>
                  {selectedTemplate?.templateId === t.templateId && (
                    <span className="text-blue-600 text-xs ml-1">✓</span>
                  )}
                </div>
              ))}
            </div>
            {selectedTemplate && (
              <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium">
                  ✅ Using: <strong>{selectedTemplate.name}</strong> — cards will use designer layout
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex gap-2 items-center text-base">
                <User className="w-4 h-4" /> Students
              </span>
              <Badge variant="secondary">{selectedIds.length}/{filtered.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex gap-2 items-center cursor-pointer text-sm font-medium
              hover:bg-slate-50 p-2 rounded-md">
              <Checkbox
                checked={selectedIds.length === filtered.length && filtered.length > 0}
                onCheckedChange={toggleAll}
              />
              Select All
            </label>

            <div className="max-h-72 overflow-y-auto space-y-0.5 border rounded-lg">
              {filtered.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">No accepted students found</p>
              )}
              {filtered.map(s => (
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
              ))}
            </div>

            <Button className="w-full" disabled={!selectedIds.length}
              onClick={() => { setPrintConfig({ ...DEFAULT_CONFIG }); setShowPanel(true); }}>
              <Settings2 className="w-4 h-4 mr-2" /> Configure & Print
            </Button>

            <Button className="w-full" variant="outline" disabled={!selectedIds.length}
              onClick={() => openBrowserPrint("Both")}>
              <FileDown className="w-4 h-4 mr-2" /> Quick Save as PDF
            </Button>

            <Button className="w-full" variant="ghost" size="sm"
              onClick={() => setShowHistory(h => !h)}>
              <History className="w-3.5 h-3.5 mr-1.5" />
              {showHistory ? "Hide" : "Show"} Print History
            </Button>
          </CardContent>
        </Card>

        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex gap-2 items-center text-base">
                <CreditCard className="w-4 h-4" /> Preview
                {selectedIds.length > 0 &&
                  <Badge className="ml-auto">{selectedIds.length} card{selectedIds.length !== 1 ? "s" : ""}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIds.length === 0
                ? <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                    <CreditCard className="w-16 h-16 mb-3" />
                    <p className="text-sm">Select students to preview ID cards</p>
                  </div>
                : <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {selectedIds.map(id => {
                      const student = filtered.find(s => s.studentId === id);
                      const school  = schools.find(sc => sc.schoolId === student?.schoolId);
                      if (!student || !school) return null;
                      return (
                        <div key={id} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                          <div className="flex items-center gap-2 px-1">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center
                              text-xs font-bold text-blue-700 shrink-0">
                              {student.fullName?.[0]}
                            </div>
                            <p className="text-sm font-semibold text-slate-700">{student.fullName}</p>
                            <span className="text-xs text-slate-400 ml-auto">
                              {student.className}-{student.divisionName}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-[10px] font-medium text-slate-400 text-center uppercase tracking-wider">
                                ◼ Front
                              </p>
                              <CompactIDCard student={student} school={school} side="front" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-medium text-slate-400 text-center uppercase tracking-wider">
                                ◻ Back
                              </p>
                              <CompactIDCard student={student} school={school} side="back" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              }
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── PRINT HISTORY ── */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4" /> Print Job History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobHistory.length === 0
              ? <p className="text-sm text-slate-400 text-center py-4">No print jobs yet</p>
              : <div className="space-y-2">
                  {jobHistory.map((job: any) => (
                    <div key={job.jobId}
                      className="flex items-center justify-between p-3 rounded-lg border
                        bg-slate-50 hover:bg-white transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <Printer className="w-4 h-4 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{job.jobCode}</p>
                          <p className="text-xs text-slate-400">
                            {job.totalCards} cards · {job.printSide} · {job.printQuality} quality ·{" "}
                            {new Date(job.createdOn).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={job.status} />
                        <span className="text-xs text-slate-400">{job.progressPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════
          PRINT CONFIGURATION PANEL
      ══════════════════════════════════════════ */}
      {showPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPanel(false)} />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">

            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-5 flex-shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Printer className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Print Configuration</h2>
                  </div>
                  <p className="text-blue-200 text-xs">Evolis Premium Suite</p>
                </div>
                <button onClick={() => setShowPanel(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between bg-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    printerStatus?.isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                  <div>
                    <p className="text-sm font-semibold">
                      {printerStatus?.printerName || "Detecting printer..."}
                    </p>
                    <p className="text-xs text-blue-200">{printerStatus?.status || "Checking..."}</p>
                  </div>
                </div>
                {printerStatus?.cardsLeft !== undefined && (
                  <div className="text-right">
                    <p className="text-lg font-bold">{printerStatus.cardsLeft}</p>
                    <p className="text-xs text-blue-200">cards left</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Job Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm mb-2 block">Number of Copies</Label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPrintConfig(p => ({ ...p, copies: Math.max(1, p.copies - 1) }))}
                        className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center
                          text-lg font-bold hover:border-blue-400 hover:text-blue-600 transition-colors">
                        −
                      </button>
                      <span className="w-12 text-center text-xl font-bold text-blue-700">
                        {printConfig.copies}
                      </span>
                      <button
                        onClick={() => setPrintConfig(p => ({ ...p, copies: Math.min(10, p.copies + 1) }))}
                        className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center
                          text-lg font-bold hover:border-blue-400 hover:text-blue-600 transition-colors">
                        +
                      </button>
                      <span className="text-xs text-slate-400 ml-2">
                        = {totalCards} total card{totalCards !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Print Side</Label>
                    <ToggleGroup
                      value={printConfig.printSide}
                      onChange={v => setPrintConfig(p => ({ ...p, printSide: v }))}
                      options={[
                        { label: "Front Only", value: "Front" },
                        { label: "Both Sides", value: "Both"  },
                        { label: "Back Only",  value: "Back"  },
                      ]}
                    />
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Card Orientation</Label>
                    <ToggleGroup
                      value={printConfig.orientation}
                      onChange={v => setPrintConfig(p => ({ ...p, orientation: v }))}
                      options={[
                        { label: "Portrait",  value: "Portrait"  },
                        { label: "Landscape", value: "Landscape" },
                      ]}
                    />
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Print Quality</Label>
                    <ToggleGroup
                      value={printConfig.quality}
                      onChange={v => setPrintConfig(p => ({ ...p, quality: v }))}
                      options={[
                        { label: "Draft",  value: "Draft"  },
                        { label: "Normal", value: "Normal" },
                        { label: "High",   value: "High"   },
                      ]}
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      {printConfig.quality === "High"
                        ? "Best quality — recommended for card printing"
                        : printConfig.quality === "Normal"
                          ? "Balanced quality and speed"
                          : "Fast print — lower quality"}
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-t border-slate-100" />

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color Adjustment</h3>
                  <button onClick={() => setPrintConfig(p => ({ ...p, brightness: 0, contrast: 0 }))}
                    className="text-xs text-blue-600 hover:underline">Reset</button>
                </div>
                <div className="space-y-5">
                  <Slider label="Brightness" value={printConfig.brightness} min={-100} max={100}
                    icon={<Sun className="w-3.5 h-3.5 text-yellow-500" />}
                    onChange={v => setPrintConfig(p => ({ ...p, brightness: v }))} />
                  <Slider label="Contrast" value={printConfig.contrast} min={-100} max={100}
                    icon={<Contrast className="w-3.5 h-3.5 text-slate-500" />}
                    onChange={v => setPrintConfig(p => ({ ...p, contrast: v }))} />
                </div>
              </section>

              <div className="border-t border-slate-100" />

              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Positioning</h3>
                  <button onClick={() => setPrintConfig(p => ({ ...p, offsetX: 0, offsetY: 0 }))}
                    className="text-xs text-blue-600 hover:underline">Reset</button>
                </div>
                <div className="space-y-5">
                  <Slider label="Horizontal Offset (X)" value={printConfig.offsetX} min={-20} max={20} unit="mm"
                    icon={<Move className="w-3.5 h-3.5 text-slate-400" />}
                    onChange={v => setPrintConfig(p => ({ ...p, offsetX: v }))} />
                  <Slider label="Vertical Offset (Y)" value={printConfig.offsetY} min={-20} max={20} unit="mm"
                    icon={<Move className="w-3.5 h-3.5 text-slate-400 rotate-90" />}
                    onChange={v => setPrintConfig(p => ({ ...p, offsetY: v }))} />
                </div>
              </section>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Summary</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ["Cards Selected", selectedIds.length],
                    ["Copies",         printConfig.copies],
                    ["Total Cards",    totalCards],
                    ["Print Side",     printConfig.printSide],
                    ["Orientation",    printConfig.orientation],
                    ["Quality",        printConfig.quality],
                  ].map(([k, v]) => (
                    <div key={String(k)}>
                      <span className="text-xs text-slate-400">{k}</span>
                      <p className="font-semibold text-slate-800">{v}</p>
                    </div>
                  ))}
                </div>
                {selectedTemplate && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <span className="text-xs text-slate-400">Designer Template</span>
                    <p className="font-semibold text-blue-700 text-sm">{selectedTemplate.name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50 space-y-2">
              <Button variant="outline" className="w-full"
                onClick={() => { setShowPanel(false); openBrowserPrint(printConfig.printSide); }}>
                <FileDown className="w-4 h-4 mr-2" />
                Preview & Print / Save PDF
              </Button>
              <Button className="w-full h-11 text-base bg-blue-700 hover:bg-blue-800"
                disabled={isSending || !printerStatus?.isOnline}
                onClick={sendToPrinter}>
                {isSending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  : <><Printer className="w-4 h-4 mr-2" /> Send to Printer</>}
              </Button>
              {!printerStatus?.isOnline && (
                <p className="text-xs text-red-500 text-center">
                  ⚠ Printer is offline — use Preview & Print instead
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          PRINT PROGRESS MODAL
      ══════════════════════════════════════════ */}
      {showProgress && currentJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className={`p-6 text-white ${
              currentJob.status === "Completed" ? "bg-green-600"
              : currentJob.status === "Failed"  ? "bg-red-600"
              : "bg-blue-700"}`}>
              <div className="flex items-center gap-3 mb-2">
                {currentJob.status === "Completed"
                  ? <CheckCircle2 className="w-7 h-7" />
                  : currentJob.status === "Failed"
                    ? <XCircle className="w-7 h-7" />
                    : <Loader2 className="w-7 h-7 animate-spin" />}
                <div>
                  <h3 className="text-lg font-bold">
                    {currentJob.status === "Completed" ? "Print Complete!"
                      : currentJob.status === "Failed"  ? "Print Failed"
                      : "Printing..."}
                  </h3>
                  <p className="text-sm opacity-80">{currentJob.jobCode}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-600">Progress</span>
                  <span className="font-bold text-blue-700">{currentJob.progressPercent || 0}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentJob.status === "Completed" ? "bg-green-500"
                      : currentJob.status === "Failed"  ? "bg-red-500"
                      : "bg-blue-600"}`}
                    style={{ width: `${currentJob.progressPercent || 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Printed",   value: currentJob.printedCards || 0,                                        color: "text-green-600" },
                  { label: "Total",     value: currentJob.totalCards   || 0,                                        color: "text-blue-600"  },
                  { label: "Remaining", value: (currentJob.totalCards || 0) - (currentJob.printedCards || 0),       color: "text-slate-600" },
                ].map(s => (
                  <div key={s.label}
                    className="text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Status</span>
                <StatusBadge status={currentJob.status} />
              </div>

              {currentJob.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{currentJob.errorMessage}</p>
                </div>
              )}

              <div className="flex gap-2">
                {currentJob.status === "Processing" || currentJob.status === "Pending"
                  ? <Button variant="outline" className="flex-1" onClick={async () => {
                      await fetch(`${BASE_URL}/Print/canceljob/${currentJob.jobId}`, { method: "DELETE" });
                      clearInterval(pollRef.current!);
                      setShowProgress(false);
                      loadHistory();
                    }}>Cancel Job</Button>
                  : <Button className="flex-1" onClick={() => {
                      setShowProgress(false); setCurrentJob(null); loadHistory();
                    }}>
                      {currentJob.status === "Completed" ? "✓ Done" : "Close"}
                    </Button>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}