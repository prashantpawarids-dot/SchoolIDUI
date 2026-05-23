"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Save, Undo, Redo, ZoomIn, ZoomOut, ArrowLeft,
  Monitor, ChevronLeft, ChevronRight, Printer,
  FolderOpen, FileSpreadsheet, Database, Sun, Moon,
  X, Crop, Layers, Settings2, Image as ImageIcon,
  QrCode, BarChart3, Play, Download
} from "lucide-react"
import ToolPanel from "./components/ToolPanel"
import DesignerCanvas from "./components/DesignerCanvas"
import PropertyPanel from "./components/PropertyPanel"
import LayerPanel from "./components/LayerPanel"
import type { CardElement, CardTemplate } from "../lib/card-types"
import { CARD_SIZES } from "../lib/card-types"
import { genId as createId } from "../lib/print-utils"
import { buildDesignerPrintHtml } from "../lib/card-renderer"
import { BASE_URL } from "@/lib/api"

/* ── Types ── */
type CardTemplateWithDb = CardTemplate & { dbId?: number }
type DataSourceType = "school" | "excel"
type RightTab = "properties" | "data" | "layers"

interface ProjectData {
  dataSource:   DataSourceType
  excelRows:    any[]
  photoFiles:   Record<string, string>
  qrFiles:      Record<string, string>
  barcodeFiles: Record<string, string>
  currentIdx:   number  // 0-based
}

const EMPTY_TEMPLATE = (): CardTemplateWithDb => ({
  id:              createId(),
  name:            "New Card Design",
  cardWidth:       54,
  cardHeight:      85.6,
  orientation:     "portrait",
  backgroundColor: "#ffffff",
  frontElements:   [],
  backElements:    [],
  dbId:            undefined,
})

const EMPTY_PROJECT = (): ProjectData => ({
  dataSource:   "school",
  excelRows:    [],
  photoFiles:   {},
  qrFiles:      {},
  barcodeFiles: {},
  currentIdx:   0,
})

/* ── Crop modal ── */
function CropModal({
  src,
  onSave,
  onClose,
}: {
  src: string
  onSave: (cropped: string) => void
  onClose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 100, h: 100 })
  const [dragging, setDragging] = useState(false)
  const startRef = useRef({ mx: 0, my: 0, cx: 0, cy: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    startRef.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    const dx = e.clientX - startRef.current.mx
    const dy = e.clientY - startRef.current.my
    setCrop(c => ({
      ...c,
      x: Math.max(0, Math.min(startRef.current.cx + dx, 300 - c.w)),
      y: Math.max(0, Math.min(startRef.current.cy + dy, 400 - c.h)),
    }))
  }
  const handleSave = () => {
    const img = imgRef.current
    if (!img || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext("2d")
    if (!ctx) return
    const scaleX = img.naturalWidth  / 300
    const scaleY = img.naturalHeight / 400
    canvas.width  = crop.w * scaleX
    canvas.height = crop.h * scaleY
    ctx.drawImage(img,
      crop.x * scaleX, crop.y * scaleY,
      crop.w * scaleX, crop.h * scaleY,
      0, 0, canvas.width, canvas.height
    )
    onSave(canvas.toDataURL("image/jpeg", 0.92))
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-5 w-[380px] space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Crop className="w-4 h-4" /> Crop Photo
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className="relative overflow-hidden border rounded-lg cursor-move select-none"
          style={{ width: 300, height: 400, margin: "0 auto" }}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}>
          <img
            ref={imgRef}
            src={src}
            style={{ width: 300, height: 400, objectFit: "cover", display: "block" }}
            alt="crop"
            draggable={false}
          />
          {/* Overlay + crop box */}
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute border-2 border-white"
            style={{
              left: crop.x, top: crop.y,
              width: crop.w, height: crop.h,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
            }}
            onMouseDown={handleMouseDown}
          >
            {/* corner handles */}
            {[
              "top-0 left-0 cursor-nw-resize",
              "top-0 right-0 cursor-ne-resize",
              "bottom-0 left-0 cursor-sw-resize",
              "bottom-0 right-0 cursor-se-resize",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 bg-white border border-slate-400 ${cls}`}
                onMouseDown={e => {
                  e.stopPropagation()
                  // simple resize on corner drag
                }}
              />
            ))}
          </div>
        </div>
        {/* Crop size sliders */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <Label className="text-xs mb-1 block">Width</Label>
            <input type="range" min={40} max={300} value={crop.w}
              onChange={e => setCrop(c => ({ ...c, w: Number(e.target.value) }))}
              className="w-full" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Height</Label>
            <input type="range" min={40} max={400} value={crop.h}
              onChange={e => setCrop(c => ({ ...c, h: Number(e.target.value) }))}
              className="w-full" />
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            Apply Crop
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function CardDesignerPage() {
  const router = useRouter()

  /* ── Auth ── */
  const [loggedInRoleId,   setLoggedInRoleId]   = useState(0)
  const [loggedInSchoolId, setLoggedInSchoolId] = useState(0)
  const [isAdmin,  setIsAdmin]  = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    const roleId   = Number(localStorage.getItem("roleId"))
    const schoolId = Number(localStorage.getItem("schoolId"))
    setLoggedInRoleId(roleId)
    setLoggedInSchoolId(schoolId)
    setIsAdmin(roleId === 1)
    setMounted(true)
  }, [])

  /* ── Designer state ── */
  const [template, setTemplate]         = useState<CardTemplateWithDb>(EMPTY_TEMPLATE())
  const [activeSide, setActiveSide]     = useState<"front" | "back">("front")
  const [selectedId, setSelectedId]     = useState<string | null>(null)
  const [zoom, setZoom]                 = useState(2.5)
  const [darkCanvas, setDarkCanvas]     = useState(false)
  const [showPreview, setShowPreview]   = useState(false)
  const [history, setHistory]           = useState<CardTemplateWithDb[]>([])
  const [historyIdx, setHistoryIdx]     = useState(-1)
  const [saving, setSaving]             = useState(false)
  const [rightTab, setRightTab]         = useState<RightTab>("properties")

  /* ── Project / Data state ── */
  const [project, setProject]   = useState<ProjectData>(EMPTY_PROJECT())
  const [schools, setSchools]   = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [saveSchoolId, setSaveSchoolId] = useState<string>("")

  /* ── Dialogs ── */
  const [showSaveDialog, setShowSaveDialog]   = useState(false)
  const [showLoadDialog, setShowLoadDialog]   = useState(false)
  const [showProjectSetup, setShowProjectSetup] = useState(false)
  const [savedTemplates, setSavedTemplates]   = useState<any[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [cropSrc, setCropSrc]                 = useState<string | null>(null)

  /* ── Preview student data ── */
  const currentStudent = project.dataSource === "school"
    ? (students[project.currentIdx] ?? {
        fullName: "Prashant Pawar", firstName: "Prashant", lastName: "Pawar",
        rollNo: "1010", className: "I", divisionName: "A", bloodGroup: "A+",
        dob: "2015-12-04", studentId: "1001", parentName: "Ashok Pawar",
        emergencyContact: "9876543210",
      })
    : (project.excelRows[project.currentIdx] ?? {})
const excelColumns =
  project.excelRows && project.excelRows.length > 0
    ? Object.keys(project.excelRows[0])
    : []

  const totalRecords = project.dataSource === "school"
    ? (students.length || 1)
    : (project.excelRows.length || 1)

  /* ── Load schools ── */
  useEffect(() => {
    if (!mounted) return
    fetch(`${BASE_URL}/School/list`).then(r => r.json()).then(setSchools).catch(() => {})
    fetch(`${BASE_URL}/Student/getalwithstatus`).then(r => r.json()).then(d => setStudents(d || [])).catch(() => {})
  }, [mounted])

  /* ── Elements helpers ── */
  const elements = activeSide === "front" ? template.frontElements : template.backElements

  const setElements = useCallback((els: CardElement[]) => {
    setTemplate(prev => {
      const next = activeSide === "front"
        ? { ...prev, frontElements: els }
        : { ...prev, backElements: els }
      setHistory(h => [...h.slice(0, historyIdx + 1), next])
      setHistoryIdx(i => i + 1)
      return next
    })
  }, [activeSide, historyIdx])

  const selectedElement = elements.find(e => e.id === selectedId) || null
  const addElement      = (el: CardElement) => setElements([...elements, el])
  const updateElement   = (id: string, updates: Partial<CardElement>) =>
    setElements(elements.map(e => e.id === id ? { ...e, ...updates } : e))
  const deleteElement   = () => {
    if (!selectedId) return
    setElements(elements.filter(e => e.id !== selectedId))
    setSelectedId(null)
  }
  const duplicateElement = () => {
    if (!selectedElement) return
    const copy = { ...selectedElement, id: createId(), x: selectedElement.x + 3, y: selectedElement.y + 3 }
    setElements([...elements, copy])
    setSelectedId(copy.id)
  }
  const undo = () => {
    if (historyIdx <= 0) return
    setHistoryIdx(i => i - 1)
    setTemplate(history[historyIdx - 1])
  }
  const redo = () => {
    if (historyIdx >= history.length - 1) return
    setHistoryIdx(i => i + 1)
    setTemplate(history[historyIdx + 1])
  }
  const newTemplate = () => {
    if (!confirm("Start new template? Unsaved changes will be lost.")) return
    setTemplate(EMPTY_TEMPLATE())
    setActiveSide("front")
    setSelectedId(null)
    setHistory([])
    setHistoryIdx(-1)
  }

  /* ── Load templates ── */
  const loadTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const data = await fetch(`${BASE_URL}/CardTemplate/list`).then(r => r.json())
      setSavedTemplates(data || [])
      setShowLoadDialog(true)
    } catch { alert("Failed to load templates") }
    finally { setLoadingTemplates(false) }
  }
  const loadTemplateById = async (templateId: number) => {
    try {
      const data = await fetch(`${BASE_URL}/CardTemplate/${templateId}`).then(r => r.json())
      setTemplate({
        id:              createId(),
        dbId:            data.templateId,
        name:            data.name,
        schoolId:        data.schoolId,
        cardWidth:       Number(data.cardWidth),
        cardHeight:      Number(data.cardHeight),
        orientation:     data.orientation,
        backgroundColor: data.backgroundColor,
        backgroundImage: data.backgroundImage || undefined,
        frontElements:   JSON.parse(data.frontElements || "[]"),
        backElements:    JSON.parse(data.backElements  || "[]"),
      })
      setActiveSide("front")
      setSelectedId(null)
      setHistory([])
      setHistoryIdx(-1)
      setShowLoadDialog(false)
    } catch { alert("Failed to load template") }
  }
  const deleteTemplateById = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await fetch(`${BASE_URL}/CardTemplate/${id}`, { method: "DELETE" })
    setSavedTemplates(p => p.filter(t => t.templateId !== id))
  }

  /* ── Save ── */
  const saveTemplate = async () => {
    if (!template.name.trim()) { alert("Please enter a template name"); return }
    setSaving(true)
    try {
      const schoolId = isAdmin ? (saveSchoolId ? Number(saveSchoolId) : null) : loggedInSchoolId || null
      const res  = await fetch(`${BASE_URL}/CardTemplate/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId:      template.dbId || null,
          name:            template.name,
          schoolId,
          cardWidth:       template.cardWidth,
          cardHeight:      template.cardHeight,
          orientation:     template.orientation,
          backgroundColor: template.backgroundColor,
          backgroundImage: template.backgroundImage || null,
          frontElements:   JSON.stringify(template.frontElements),
          backElements:    JSON.stringify(template.backElements),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTemplate(prev => ({ ...prev, dbId: data.templateId }))
        setShowSaveDialog(false)
        alert(`✅ ${data.message} (${data.templateCode})`)
      } else { alert("❌ " + data.message) }
    } catch { alert("Failed to save") }
    finally { setSaving(false) }
  }

  /* ── Print current card ── */
  const printCurrentCard = () => {
    const html = buildDesignerPrintHtml(
      [currentStudent], {},
      template.frontElements,
      template.backElements,
      template.cardWidth,
      template.cardHeight,
      template.backgroundColor,
      template.backgroundImage,
      template.orientation,
      "Both", 0, 0, 1
    )
    const win = window.open("", "_blank")
    if (win) { win.document.write(html); win.document.close() }
  }

  /* ── Print all cards ── */
  const printAllCards = () => {
    const data = project.dataSource === "school" ? students : project.excelRows
    if (!data.length) { alert("No records to print"); return }
    const html = buildDesignerPrintHtml(
      data, {},
      template.frontElements,
      template.backElements,
      template.cardWidth,
      template.cardHeight,
      template.backgroundColor,
      template.backgroundImage,
      template.orientation,
      "Both", 0, 0, 1
    )
    const win = window.open("", "_blank")
    if (win) { win.document.write(html); win.document.close() }
  }

  /* ── Excel import ── */
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const XLSX = await import("xlsx")
      const buf  = await file.arrayBuffer()
      const wb   = XLSX.read(buf)
      const ws   = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(ws) as any[]
      // setProject(p => ({ ...p, excelRows: rows, currentIdx: 0 }))
      // alert(`✅ Loaded ${rows.length} records from Excel`)
      setProject(p => ({ ...p, excelRows: rows, currentIdx: 0 }))
setShowPreview(true)  // ✅ ADD THIS LINE
alert(`✅ Loaded ${rows.length} records from Excel`)
    } catch { alert("Failed to read Excel file") }
  }

  /* ── Folder import for photos/QR/barcodes ── */
  const handleFolderImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photoFiles" | "qrFiles" | "barcodeFiles"
  ) => {
    const files = e.target.files
    if (!files?.length) return
    const result: Record<string, string> = {}
    const sortedFiles = Array.from(files).sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true })
    )
    for (const file of sortedFiles) {
      if (!file.type.startsWith("image/")) continue
      const b64 = await new Promise<string>((res) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result as string)
        reader.readAsDataURL(file)
      })
      result[file.name] = b64
    }
    // setProject(p => ({ ...p, [field]: result }))
    // alert(`✅ Loaded ${Object.keys(result).length} files`)

    setProject(p => ({ ...p, [field]: result }))
setShowPreview(true)  // ✅ ADD THIS LINE
alert(`✅ Loaded ${Object.keys(result).length} files`)
  }

  /* ── Preview data (resolves dynamic fields + folder files) ── */
  const previewSchool = schools.find(s => s.schoolId === currentStudent?.schoolId) ||
    { schoolName: "IDS International School", schoolAddress: "Pune, Maharashtra" }

  /* ── Photo keys sorted (for index-based access) ── */
  const photoKeys    = Object.keys(project.photoFiles).sort((a,b) => a.localeCompare(b, undefined, { numeric: true }))
  const qrKeys       = Object.keys(project.qrFiles).sort((a,b) => a.localeCompare(b, undefined, { numeric: true }))
  const barcodeKeys  = Object.keys(project.barcodeFiles).sort((a,b) => a.localeCompare(b, undefined, { numeric: true }))

  const currentPhotoSrc    = project.photoFiles[photoKeys[project.currentIdx]]    || currentStudent?.photoPath || ""
  const currentQrSrc       = project.qrFiles[qrKeys[project.currentIdx]]          || ""
  const currentBarcodeSrc  = project.barcodeFiles[barcodeKeys[project.currentIdx]] || ""

  /* ── Enriched preview student with folder data ── */
  const enrichedStudent = {
    ...currentStudent,
    photoPath:     currentPhotoSrc,
    qrImagePath:   currentQrSrc,
    barcodeImagePath: currentBarcodeSrc,
  }

  if (!mounted) return null

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden" style={{ userSelect: "none" }}>

      {/* ══ TOP TOOLBAR ══ */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-3 gap-2 shrink-0 overflow-x-auto">

        {/* Back */}
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-700 shrink-0" />

        {/* New + Open */}
        <button onClick={newTemplate}
          className="text-slate-400 hover:text-white text-xs border border-slate-600
            px-2 py-1 rounded hover:border-slate-400 transition-colors shrink-0">
          + New
        </button>
        <button onClick={loadTemplates} disabled={loadingTemplates}
          className="flex items-center gap-1 text-slate-400 hover:text-white text-xs
            border border-slate-600 px-2 py-1 rounded hover:border-slate-400 shrink-0">
          <FolderOpen className="w-3.5 h-3.5" />
          {loadingTemplates ? "..." : "Open"}
        </button>

        <div className="h-5 w-px bg-slate-700 shrink-0" />

        {/* Template name */}
        <input
          value={template.name}
          onChange={e => setTemplate(p => ({ ...p, name: e.target.value }))}
          className="h-7 w-40 text-xs bg-slate-700 border border-slate-600 text-white
            rounded px-2 focus:outline-none focus:border-blue-500 shrink-0"
        />

        {/* BG Color */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-slate-400">BG</span>
          <input
            type="color"
            value={template.backgroundColor}
            onChange={e => setTemplate(p => ({ ...p, backgroundColor: e.target.value }))}
            className="w-8 h-6 rounded cursor-pointer border border-slate-600 p-0.5 bg-transparent"
            title="Card Background Color"
          />
          <span className="text-[10px] text-slate-400 font-mono">{template.backgroundColor}</span>
        </div>

        {/* Front/Back toggle */}
        <div className="flex rounded border border-slate-600 overflow-hidden shrink-0">
          {(["front", "back"] as const).map(s => (
            <button key={s} onClick={() => { setActiveSide(s); setSelectedId(null) }}
              className={`px-3 py-1 text-xs font-medium transition-colors
                ${activeSide === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {s === "front" ? "◼ Front" : "◻ Back"}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-slate-700 shrink-0" />

        {/* Zoom */}
        <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} className="text-slate-400 hover:text-white shrink-0">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 w-10 text-center shrink-0">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(5, z + 0.5))} className="text-slate-400 hover:text-white shrink-0">
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-700 shrink-0" />

        {/* Undo/Redo */}
        <button onClick={undo} disabled={historyIdx <= 0} className="text-slate-400 hover:text-white disabled:opacity-30 shrink-0">
          <Undo className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={historyIdx >= history.length - 1} className="text-slate-400 hover:text-white disabled:opacity-30 shrink-0">
          <Redo className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Dark/Light canvas toggle */}
        <button onClick={() => setDarkCanvas(d => !d)}
          className={`p-1.5 rounded transition-colors shrink-0
            ${darkCanvas ? "bg-slate-600 text-yellow-400" : "text-slate-400 hover:text-white"}`}
          title="Toggle canvas dark/light">
          {darkCanvas ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Live preview */}
        <button onClick={() => setShowPreview(p => !p)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs shrink-0
            ${showPreview ? "bg-green-600 text-white" : "text-slate-400 border border-slate-600 hover:text-white"}`}>
          <Monitor className="w-3.5 h-3.5" />
          Preview
        </button>

        {/* Element count */}
        <Badge variant="outline" className="text-slate-400 border-slate-600 text-[10px] shrink-0">
          {elements.length} el
        </Badge>

        {/* Print current */}
        <button onClick={printCurrentCard}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-slate-600
            text-slate-400 hover:text-white hover:border-slate-400 shrink-0">
          <Play className="w-3 h-3" /> Print 1
        </button>

        {/* Print all */}
        <button onClick={printAllCards}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-green-700
            text-green-400 hover:bg-green-700 hover:text-white shrink-0">
          <Printer className="w-3.5 h-3.5" /> Print All
        </button>

        {/* Save */}
        <button onClick={() => setShowSaveDialog(true)} disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium
            bg-blue-600 hover:bg-blue-700 text-white shrink-0">
          <Save className="w-3.5 h-3.5" />
          Save
        </button>
      </div>

      {/* ══ MAIN AREA (fixed height = 100vh - 48px toolbar) ══ */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── LEFT: Tools + Layers (fixed width) ── */}
        <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col shrink-0">
          <ToolPanel
            onAddElement={addElement}
            selectedElement={selectedElement}
            onDelete={deleteElement}
            onDuplicate={duplicateElement}
            onToggleVisible={() =>
              selectedElement && updateElement(selectedElement.id, { visible: !selectedElement.visible })}
            onToggleLock={() =>
              selectedElement && updateElement(selectedElement.id, { locked: !selectedElement.locked })}
          />
        </div>

        {/* ── CENTER: Canvas ── */}
        <div className={`flex-1 min-w-0 flex items-center justify-center overflow-auto
          ${darkCanvas ? "bg-slate-950" : "bg-slate-200"}`}>
          <DesignerCanvas
            elements={elements}
            cardWidth={template.cardWidth}
            cardHeight={template.cardHeight}
            backgroundColor={template.backgroundColor}
            backgroundImage={template.backgroundImage}
            selectedId={selectedId}
            zoom={zoom}
            previewStudent={showPreview ? enrichedStudent : undefined}
            previewSchool={showPreview ? previewSchool : undefined}
            onSelect={setSelectedId}
            onMove={(id, x, y) => updateElement(id, { x, y })}
            onResize={(id, w, h) => updateElement(id, { width: w, height: h })}
          />
        </div>

        {/* ── RIGHT: Tabbed panel (fixed width) ── */}
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 min-h-0">

          {/* Tab header */}
          <div className="flex border-b border-slate-200 shrink-0">
            {([
              { id: "properties", label: "Props",  icon: Settings2 },
              { id: "data",       label: "Data",   icon: Database   },
              { id: "layers",     label: "Layers", icon: Layers     },
            ] as { id: RightTab; label: string; icon: any }[]).map(tab => {
              const Icon = tab.icon
              return (
                <button key={tab.id} onClick={() => setRightTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium
                    border-b-2 transition-colors
                    ${rightTab === tab.id
                      ? "border-blue-600 text-blue-700 bg-blue-50"
                      : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab content — scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">

            {/* ── PROPERTIES TAB ── */}
           {rightTab === "properties" && (
  <PropertyPanel
    element={selectedElement}
    onChange={updates => selectedElement && updateElement(selectedElement.id, updates)}
    excelColumns={project.dataSource === "excel" ? excelColumns : []}
  />
)}

            {/* ── DATA TAB ── */}
            {rightTab === "data" && (
              <div className="p-3 space-y-4">

                {/* Data source selector */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Data Source
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { val: "school", label: "School DB", icon: Database },
                      { val: "excel",  label: "Excel File", icon: FileSpreadsheet },
                    ] as const).map(({ val, label, icon: Icon }) => (
                      <button key={val}
                        onClick={() => setProject(p => ({ ...p, dataSource: val, currentIdx: 0 }))}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs
                          font-medium transition-all
                          ${project.dataSource === val
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-500 hover:border-blue-300"}`}>
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Excel upload (only when excel selected) */}
                {project.dataSource === "excel" && (
                  <div className="space-y-2 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      <p className="text-xs font-semibold text-slate-700">Excel Data</p>
                      {project.excelRows.length > 0 && (
                        <Badge className="ml-auto text-[10px] bg-green-100 text-green-700 border-0">
                          {project.excelRows.length} rows
                        </Badge>
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border
                      border-dashed border-slate-300 cursor-pointer hover:border-blue-400
                      text-xs text-slate-500 hover:text-blue-600 transition-colors">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      {project.excelRows.length > 0 ? "Replace Excel" : "Select Excel file (.xlsx)"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden"
                        onChange={handleExcelUpload} />
                    </label>
                    {project.excelRows.length > 0 && (
                      <div className="bg-slate-50 rounded p-2 text-[10px] text-slate-500">
                        Columns: {Object.keys(project.excelRows[0] || {}).join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Asset folders */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Asset Folders
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Files are matched by sort order (1st file = record 1, 2nd = record 2...)
                  </p>

                  {/* Photos folder */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-slate-600">Photos</span>
                      </div>
                      {Object.keys(project.photoFiles).length > 0 && (
                        <Badge className="text-[10px] bg-blue-50 text-blue-600 border-0">
                          {Object.keys(project.photoFiles).length} files
                        </Badge>
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-2 py-1.5 rounded border
                      border-dashed border-slate-300 cursor-pointer hover:border-blue-400
                      text-[11px] text-slate-500 hover:text-blue-600 transition-colors">
                      <FolderOpen className="w-3 h-3" />
                      {Object.keys(project.photoFiles).length > 0 ? "Change folder" : "Select photo folder"}
                      <input type="file" accept="image/*" multiple className="hidden"
                        // @ts-ignore
                        webkitdirectory=""
                        onChange={e => handleFolderImport(e, "photoFiles")} />
                    </label>
                  </div>

                  {/* QR folder */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-xs font-medium text-slate-600">QR Codes</span>
                      </div>
                      {Object.keys(project.qrFiles).length > 0 && (
                        <Badge className="text-[10px] bg-purple-50 text-purple-600 border-0">
                          {Object.keys(project.qrFiles).length} files
                        </Badge>
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-2 py-1.5 rounded border
                      border-dashed border-slate-300 cursor-pointer hover:border-purple-400
                      text-[11px] text-slate-500 hover:text-purple-600 transition-colors">
                      <FolderOpen className="w-3 h-3" />
                      {Object.keys(project.qrFiles).length > 0 ? "Change folder" : "Select QR folder"}
                      <input type="file" accept="image/*" multiple className="hidden"
                        // @ts-ignore
                        webkitdirectory=""
                        onChange={e => handleFolderImport(e, "qrFiles")} />
                    </label>
                  </div>

                  {/* Barcode folder */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-slate-600">Barcodes</span>
                      </div>
                      {Object.keys(project.barcodeFiles).length > 0 && (
                        <Badge className="text-[10px] bg-amber-50 text-amber-600 border-0">
                          {Object.keys(project.barcodeFiles).length} files
                        </Badge>
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-2 py-1.5 rounded border
                      border-dashed border-slate-300 cursor-pointer hover:border-amber-400
                      text-[11px] text-slate-500 hover:text-amber-600 transition-colors">
                      <FolderOpen className="w-3 h-3" />
                      {Object.keys(project.barcodeFiles).length > 0 ? "Change folder" : "Select barcode folder"}
                      <input type="file" accept="image/*" multiple className="hidden"
                        // @ts-ignore
                        webkitdirectory=""
                        onChange={e => handleFolderImport(e, "barcodeFiles")} />
                    </label>
                  </div>
                </div>

                {/* Record navigator */}
                <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Record Navigator
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProject(p => ({ ...p, currentIdx: Math.max(0, p.currentIdx - 1) }))}
                      disabled={project.currentIdx === 0}
                      className="p-1.5 rounded border border-slate-200 hover:border-blue-400
                        text-slate-500 hover:text-blue-600 disabled:opacity-30">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-sm font-bold text-blue-700">
                        {project.currentIdx + 1}
                      </span>
                      <span className="text-xs text-slate-400"> / {totalRecords}</span>
                    </div>
                    <button
                      onClick={() => setProject(p => ({ ...p, currentIdx: Math.min(totalRecords - 1, p.currentIdx + 1) }))}
                      disabled={project.currentIdx >= totalRecords - 1}
                      className="p-1.5 rounded border border-slate-200 hover:border-blue-400
                        text-slate-500 hover:text-blue-600 disabled:opacity-30">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Jump to record */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Jump to:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalRecords}
                      defaultValue={1}
                      onChange={e => {
                        const v = Number(e.target.value)
                        if (v >= 1 && v <= totalRecords)
                          setProject(p => ({ ...p, currentIdx: v - 1 }))
                      }}
                      className="w-16 h-6 text-xs border border-slate-200 rounded px-2
                        focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  {/* Current record preview */}
                  {showPreview && (
                    <div className="bg-slate-50 rounded p-2 text-[10px] text-slate-500 space-y-0.5">
                      <p className="font-semibold text-slate-600">
                        {currentStudent?.fullName || currentStudent?.name || `Record ${project.currentIdx + 1}`}
                      </p>
                      {currentPhotoSrc && <p>📷 Photo loaded</p>}
                      {currentQrSrc    && <p>📱 QR loaded</p>}
                      {currentBarcodeSrc && <p>📊 Barcode loaded</p>}
                    </div>
                  )}
                  {/* Print buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button onClick={printCurrentCard}
                      className="flex items-center justify-center gap-1 py-1.5 rounded border
                        border-blue-200 text-blue-600 text-xs hover:bg-blue-50">
                      <Play className="w-3 h-3" /> Print #{ project.currentIdx + 1}
                    </button>
                    <button onClick={printAllCards}
                      className="flex items-center justify-center gap-1 py-1.5 rounded border
                        border-green-200 text-green-700 text-xs hover:bg-green-50">
                      <Printer className="w-3 h-3" /> Print All
                    </button>
                  </div>
                </div>

                {/* Crop photo */}
                {currentPhotoSrc && (
                  <div className="border border-slate-200 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Photo Tools
                    </p>
                    <div className="flex items-center gap-3">
                      <img src={currentPhotoSrc} className="w-12 h-14 object-cover rounded border" alt="Current" />
                      <div className="space-y-1.5">
                        <button onClick={() => setCropSrc(currentPhotoSrc)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded border
                            border-slate-200 text-xs text-slate-600 hover:border-blue-400
                            hover:text-blue-600 w-full">
                          <Crop className="w-3 h-3" /> Crop Photo
                        </button>
                        <button
                          onClick={() => setDarkCanvas(d => !d)}
                          className="flex items-center gap-1.5 px-2 py-1 rounded border
                            border-slate-200 text-xs text-slate-600 hover:border-slate-400 w-full">
                          {darkCanvas ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                          {darkCanvas ? "Light view" : "Dark view"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── LAYERS TAB ── */}
            {rightTab === "layers" && (
              <LayerPanel
                elements={elements}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onToggleVisible={id => {
                  const el = elements.find(e => e.id === id)
                  if (el) updateElement(id, { visible: !el.visible })
                }}
                onToggleLock={id => {
                  const el = elements.find(e => e.id === id)
                  if (el) updateElement(id, { locked: !el.locked })
                }}
                onReorder={() => {}}
              />
            )}
          </div>

          {/* Bottom — card info strip */}
          <div className="border-t border-slate-200 px-3 py-2 shrink-0 bg-slate-50
            flex items-center justify-between text-[10px] text-slate-400">
            <span>{template.cardWidth}×{template.cardHeight}mm · {template.orientation}</span>
            <span>{template.frontElements.length}F / {template.backElements.length}B elements</span>
          </div>
        </div>
      </div>

      {/* ══ CROP MODAL ══ */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onSave={cropped => {
            // Apply cropped photo to the current record's photo file
            const newKey = photoKeys[project.currentIdx] || `photo_${project.currentIdx + 1}.jpg`
            setProject(p => ({
              ...p,
              photoFiles: { ...p.photoFiles, [newKey]: cropped }
            }))
            setCropSrc(null)
          }}
          onClose={() => setCropSrc(null)}
        />
      )}

      {/* ══ LOAD DIALOG ══ */}
      {showLoadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4
            max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Saved Templates</h3>
                <p className="text-sm text-slate-400">{savedTemplates.length} found</p>
              </div>
              <button onClick={() => setShowLoadDialog(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {savedTemplates.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-300">
                  <span className="text-4xl mb-3">📄</span>
                  <p className="text-sm">No saved templates yet</p>
                </div>
              ) : savedTemplates.map((t: any) => (
                <div key={t.templateId}
                  className="flex items-center justify-between p-4 rounded-xl border
                    border-slate-200 hover:border-blue-300 hover:bg-blue-50/50
                    transition-all cursor-pointer group"
                  onClick={() => loadTemplateById(t.templateId)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-14 rounded-lg border border-slate-200 shrink-0"
                      style={{ background: t.backgroundColor || "#ffffff" }} />
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-blue-700">{t.name}</p>
                      <p className="text-xs text-slate-400">
                        {Number(t.cardWidth)}×{Number(t.cardHeight)}mm · {t.orientation} · {t.templateCode}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Front: {(() => { try { return JSON.parse(t.frontElements || "[]").length } catch { return 0 } })()} el
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Back: {(() => { try { return JSON.parse(t.backElements || "[]").length } catch { return 0 } })()} el
                        </span>
                        {t.schoolId
                          ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">School</span>
                          : <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Shared</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={e => { e.stopPropagation(); loadTemplateById(t.templateId) }}
                      className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                      Edit
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteTemplateById(t.templateId, t.name) }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-500 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between">
              <Button variant="outline" onClick={() => setShowLoadDialog(false)}>Cancel</Button>
              <Button onClick={() => { setShowLoadDialog(false); newTemplate() }}
                className="bg-green-600 hover:bg-green-700 text-white">
                + Create New
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SAVE DIALOG ══ */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Save Template</h3>
              <p className="text-sm text-slate-400">
                {template.dbId ? "Update existing" : "Save as new"}
              </p>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Template Name *</Label>
              <Input
                value={template.name}
                onChange={e => setTemplate(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. IDS School Card 2025"
                className="h-10"
              />
            </div>
            {isAdmin && (
              <div>
                <Label className="text-sm mb-1.5 block">
                  Assign to School
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </Label>
                <select
                  value={saveSchoolId}
                  onChange={e => setSaveSchoolId(e.target.value)}
                  className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Schools (Shared)</option>
                  {schools.map((s: any) => (
                    <option key={s.schoolId} value={s.schoolId}>{s.schoolName}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="bg-slate-50 rounded-lg p-3 border text-xs text-slate-500 space-y-1">
              <div className="flex justify-between"><span>Size</span><span>{template.cardWidth}×{template.cardHeight}mm</span></div>
              <div className="flex justify-between"><span>Orientation</span><span className="capitalize">{template.orientation}</span></div>
              <div className="flex justify-between"><span>Front elements</span><span>{template.frontElements.length}</span></div>
              <div className="flex justify-between"><span>Back elements</span><span>{template.backElements.length}</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={saving || !template.name.trim()}
                onClick={saveTemplate}>
                {saving ? "Saving..." : template.dbId ? "Update" : "Save Template"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}