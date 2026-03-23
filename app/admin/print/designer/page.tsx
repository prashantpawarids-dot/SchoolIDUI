// "use client"
// import { useCallback, useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Save, Undo, Redo, ZoomIn, ZoomOut, ArrowLeft, Monitor } from "lucide-react"
// import ToolPanel from "./components/ToolPanel"
// import DesignerCanvas from "./components/DesignerCanvas"
// import PropertyPanel from "./components/PropertyPanel"
// import LayerPanel from "./components/LayerPanel"
// import type { CardElement, CardTemplate } from "../lib/card-types"
// import { CARD_SIZES } from "../lib/card-types"
// import { genId as createId } from "../lib/print-utils"
// import { BASE_URL } from "@/lib/api"

// /* ── Extended type with dbId ── */
// type CardTemplateWithDb = CardTemplate & { dbId?: number }

// const EMPTY_TEMPLATE = (): CardTemplateWithDb => ({
//   id:              createId(),
//   name:            "New Card Design",
//   cardWidth:       54,
//   cardHeight:      85.6,
//   orientation:     "portrait",
//   backgroundColor: "#1d4ed8",
//   frontElements:   [],
//   backElements:    [],
//   dbId:            undefined,
// })

// export default function CardDesignerPage() {
//   const router = useRouter()

//   /* ── Auth ── */
//   const [loggedInRoleId, setLoggedInRoleId]     = useState(0)
//   const [loggedInSchoolId, setLoggedInSchoolId] = useState(0)
//   const [isAdmin, setIsAdmin]                   = useState(false)
//   const [mounted, setMounted]                   = useState(false)

//   useEffect(() => {
//     const roleId  = Number(localStorage.getItem("roleId"))
//     const schoolId = Number(localStorage.getItem("schoolId"))
//     setLoggedInRoleId(roleId)
//     setLoggedInSchoolId(schoolId)
//     setIsAdmin(roleId === 1)
//     setMounted(true)
//   }, [])

//   /* ── Designer state ── */
//   const [template, setTemplate]         = useState<CardTemplateWithDb>(EMPTY_TEMPLATE())
//   const [activeSide, setActiveSide]     = useState<"front" | "back">("front")
//   const [selectedId, setSelectedId]     = useState<string | null>(null)
//   const [zoom, setZoom]                 = useState(2.5)
//   const [showPreview, setShowPreview]   = useState(false)
//   const [history, setHistory]           = useState<CardTemplateWithDb[]>([])
//   const [historyIdx, setHistoryIdx]     = useState(-1)
//   const [saving, setSaving]             = useState(false)

//   /* ── Save dialog state ── */
//   const [showSaveDialog, setShowSaveDialog] = useState(false)
//   const [saveSchoolId, setSaveSchoolId]     = useState<string>("")
//   const [schools, setSchools]               = useState<any[]>([])

//   /* ── Preview student data ── */
//   const [previewStudent] = useState<any>({
//     fullName:         "Prashant Pawar",
//     firstName:        "Prashant",
//     lastName:         "Pawar",
//     rollNo:           "1010",
//     className:        "I",
//     divisionName:     "A",
//     bloodGroup:       "A+",
//     dob:              "2015-12-04",
//     studentId:        "1001",
//     parentName:       "Ashok Pawar",
//     emergencyContact: "9876543210",
//   })

//   /* ── Load schools (admin only) ── */
//   useEffect(() => {
//     if (!mounted || !isAdmin) return
//     fetch(`${BASE_URL}/School/list`)
//       .then(r => r.json())
//       .then(setSchools)
//       .catch(console.error)
//   }, [mounted, isAdmin])

//   /* ── Elements helpers ── */
//   const elements = activeSide === "front" ? template.frontElements : template.backElements

//   const setElements = useCallback((els: CardElement[]) => {
//     setTemplate(prev => {
//       const next = activeSide === "front"
//         ? { ...prev, frontElements: els }
//         : { ...prev, backElements: els }
//       setHistory(h => [...h.slice(0, historyIdx + 1), next])
//       setHistoryIdx(i => i + 1)
//       return next
//     })
//   }, [activeSide, historyIdx])

//   const selectedElement = elements.find(e => e.id === selectedId) || null

//   const addElement    = (el: CardElement) => setElements([...elements, el])

//   const updateElement = (id: string, updates: Partial<CardElement>) =>
//     setElements(elements.map(e => e.id === id ? { ...e, ...updates } : e))

//   const deleteElement = () => {
//     if (!selectedId) return
//     setElements(elements.filter(e => e.id !== selectedId))
//     setSelectedId(null)
//   }

//   const duplicateElement = () => {
//     if (!selectedElement) return
//     const copy = { ...selectedElement, id: createId(), x: selectedElement.x + 3, y: selectedElement.y + 3 }
//     setElements([...elements, copy])
//     setSelectedId(copy.id)
//   }

//   const undo = () => {
//     if (historyIdx <= 0) return
//     setHistoryIdx(i => i - 1)
//     setTemplate(history[historyIdx - 1])
//   }

//   const redo = () => {
//     if (historyIdx >= history.length - 1) return
//     setHistoryIdx(i => i + 1)
//     setTemplate(history[historyIdx + 1])
//   }

//   /* ── Save to API ── */
//   const saveTemplate = async () => {
//     if (!template.name.trim()) { alert("Please enter a template name"); return }
//     setSaving(true)
//     try {
//       const schoolId = isAdmin
//         ? (saveSchoolId ? Number(saveSchoolId) : null)
//         : loggedInSchoolId || null

//       const res = await fetch(`${BASE_URL}/CardTemplate/save`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           templateId:      template.dbId || null,
//           name:            template.name,
//           schoolId,
//           cardWidth:       template.cardWidth,
//           cardHeight:      template.cardHeight,
//           orientation:     template.orientation,
//           backgroundColor: template.backgroundColor,
//           backgroundImage: template.backgroundImage || null,
//           frontElements:   JSON.stringify(template.frontElements),
//           backElements:    JSON.stringify(template.backElements),
//         }),
//       })

//       const data = await res.json()

//       if (data.success) {
//         setTemplate(prev => ({ ...prev, dbId: data.templateId }))
//         setShowSaveDialog(false)
//         alert(`✅ ${data.message} (${data.templateCode})`)
//       } else {
//         alert("❌ " + data.message)
//       }
//     } catch {
//       alert("Failed to save — check API connection")
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (!mounted) return null

//   return (
//     <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">

//       {/* ── TOP TOOLBAR ── */}
//       <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-3 shrink-0">

//         <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
//           <ArrowLeft className="w-4 h-4" />
//         </button>

//         <div className="h-5 w-px bg-slate-700" />

//         {/* Template name */}
//         <Input
//           value={template.name}
//           onChange={e => setTemplate(p => ({ ...p, name: e.target.value }))}
//           className="h-7 w-48 text-sm bg-slate-700 border-slate-600 text-white"
//         />

//         {/* Side toggle */}
//         <div className="flex rounded-lg border border-slate-600 overflow-hidden ml-2">
//           {(["front", "back"] as const).map(s => (
//             <button key={s}
//               onClick={() => { setActiveSide(s); setSelectedId(null) }}
//               className={`px-3 py-1 text-xs font-medium transition-colors
//                 ${activeSide === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
//               {s === "front" ? "◼ Front" : "◻ Back"}
//             </button>
//           ))}
//         </div>

//         <div className="h-5 w-px bg-slate-700" />

//         {/* Zoom */}
//         <button onClick={() => setZoom(z => Math.max(1, z - 0.5))}
//           className="text-slate-400 hover:text-white">
//           <ZoomOut className="w-4 h-4" />
//         </button>
//         <span className="text-xs text-slate-400 w-12 text-center">
//           {Math.round(zoom * 100)}%
//         </span>
//         <button onClick={() => setZoom(z => Math.min(5, z + 0.5))}
//           className="text-slate-400 hover:text-white">
//           <ZoomIn className="w-4 h-4" />
//         </button>

//         <div className="h-5 w-px bg-slate-700" />

//         {/* Undo / Redo */}
//         <button onClick={undo} disabled={historyIdx <= 0}
//           className="text-slate-400 hover:text-white disabled:opacity-30">
//           <Undo className="w-4 h-4" />
//         </button>
//         <button onClick={redo} disabled={historyIdx >= history.length - 1}
//           className="text-slate-400 hover:text-white disabled:opacity-30">
//           <Redo className="w-4 h-4" />
//         </button>

//         <div className="flex-1" />

//         {/* Element count badge */}
//         <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
//           {elements.length} elements
//         </Badge>

//         {/* Live preview toggle */}
//         <button onClick={() => setShowPreview(p => !p)}
//           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
//             ${showPreview
//               ? "bg-green-600 text-white"
//               : "text-slate-400 border border-slate-600 hover:text-white"}`}>
//           <Monitor className="w-3.5 h-3.5" />
//           {showPreview ? "Live Preview ON" : "Preview"}
//         </button>

//         {/* Save button */}
//         <Button size="sm"
//           onClick={() => setShowSaveDialog(true)}
//           disabled={saving}
//           className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">
//           <Save className="w-3.5 h-3.5 mr-1.5" />
//           Save
//         </Button>
//       </div>

//       {/* ── MAIN AREA ── */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* Tool panel */}
//         <ToolPanel
//           onAddElement={addElement}
//           selectedElement={selectedElement}
//           onDelete={deleteElement}
//           onDuplicate={duplicateElement}
//           onToggleVisible={() =>
//             selectedElement && updateElement(selectedElement.id, { visible: !selectedElement.visible })}
//           onToggleLock={() =>
//             selectedElement && updateElement(selectedElement.id, { locked: !selectedElement.locked })}
//         />

//         {/* Layer panel */}
//         <LayerPanel
//           elements={elements}
//           selectedId={selectedId}
//           onSelect={setSelectedId}
//           onToggleVisible={id => {
//             const el = elements.find(e => e.id === id)
//             if (el) updateElement(id, { visible: !el.visible })
//           }}
//           onToggleLock={id => {
//             const el = elements.find(e => e.id === id)
//             if (el) updateElement(id, { locked: !el.locked })
//           }}
//           onReorder={() => {}}
//         />

//         {/* Canvas */}
//         <DesignerCanvas
//           elements={elements}
//           cardWidth={template.cardWidth}
//           cardHeight={template.cardHeight}
//           backgroundColor={template.backgroundColor}
//           backgroundImage={template.backgroundImage}
//           selectedId={selectedId}
//           zoom={zoom}
//           previewStudent={showPreview ? previewStudent : undefined}
//           previewSchool={showPreview
//             ? { schoolName: "IDS International School", schoolAddress: "Pune, Maharashtra" }
//             : undefined}
//           onSelect={setSelectedId}
//           onMove={(id, x, y) => updateElement(id, { x, y })}
//           onResize={(id, w, h) => updateElement(id, { width: w, height: h })}
//         />

//         {/* Property panel */}
//         <PropertyPanel
//           element={selectedElement}
//           onChange={updates => selectedElement && updateElement(selectedElement.id, updates)}
//         />
//       </div>

//       {/* ══════════════════════════════════════
//           SAVE DIALOG
//       ══════════════════════════════════════ */}
//       {showSaveDialog && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">

//             <div>
//               <h3 className="text-lg font-bold text-slate-800">Save Template</h3>
//               <p className="text-sm text-slate-400">
//                 {template.dbId ? "Update existing template" : "Save as new template"}
//               </p>
//             </div>

//             {/* Name */}
//             <div>
//               <Label className="text-sm mb-1.5 block">Template Name <span className="text-red-500">*</span></Label>
//               <Input
//                 value={template.name}
//                 onChange={e => setTemplate(p => ({ ...p, name: e.target.value }))}
//                 placeholder="e.g. IDS School Card 2025"
//                 className="h-10"
//               />
//             </div>

//             {/* School dropdown — admin only */}
//             {isAdmin && (
//               <div>
//                 <Label className="text-sm mb-1.5 block">
//                   Assign to School
//                   <span className="text-slate-400 font-normal ml-1">(optional)</span>
//                 </Label>
//                 <select
//                   value={saveSchoolId}
//                   onChange={e => setSaveSchoolId(e.target.value)}
//                   className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="">All Schools (Shared)</option>
//                   {schools.map((s: any) => (
//                     <option key={s.schoolId} value={s.schoolId}>{s.schoolName}</option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-slate-400 mt-1">
//                   Leave blank to share template with all schools
//                 </p>
//               </div>
//             )}

//             {/* School user info */}
//             {!isAdmin && (
//               <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
//                 <p className="text-sm text-blue-700 font-medium">
//                   Template will be saved for your school
//                 </p>
//               </div>
//             )}

//             {/* Card info */}
//             <div className="bg-slate-50 rounded-lg p-3 border text-xs text-slate-500 space-y-1">
//               <div className="flex justify-between">
//                 <span>Size</span>
//                 <span className="font-medium">{template.cardWidth} × {template.cardHeight} mm</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Orientation</span>
//                 <span className="font-medium capitalize">{template.orientation}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Front elements</span>
//                 <span className="font-medium">{template.frontElements.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Back elements</span>
//                 <span className="font-medium">{template.backElements.length}</span>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-3 pt-1">
//               <Button variant="outline" className="flex-1"
//                 onClick={() => setShowSaveDialog(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 className="flex-1 bg-blue-600 hover:bg-blue-700"
//                 disabled={saving || !template.name.trim()}
//                 onClick={saveTemplate}>
//                 {saving ? "Saving..." : template.dbId ? "Update" : "Save Template"}
//               </Button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   )
// }


//new code

"use client"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, Undo, Redo, ZoomIn, ZoomOut, ArrowLeft, Monitor } from "lucide-react"
import ToolPanel from "./components/ToolPanel"
import DesignerCanvas from "./components/DesignerCanvas"
import PropertyPanel from "./components/PropertyPanel"
import LayerPanel from "./components/LayerPanel"
import type { CardElement, CardTemplate } from "../lib/card-types"
import { CARD_SIZES } from "../lib/card-types"
import { genId as createId } from "../lib/print-utils"
import { BASE_URL } from "@/lib/api"

/* ── Extended type with dbId ── */
type CardTemplateWithDb = CardTemplate & { dbId?: number }

const EMPTY_TEMPLATE = (): CardTemplateWithDb => ({
  id:              createId(),
  name:            "New Card Design",
  cardWidth:       54,
  cardHeight:      85.6,
  orientation:     "portrait",
  backgroundColor: "#c9ceda",
  frontElements:   [],
  backElements:    [],
  dbId:            undefined,
})

export default function CardDesignerPage() {
  const router = useRouter()

  /* ── Auth ── */
  const [loggedInRoleId, setLoggedInRoleId]     = useState(0)
  const [loggedInSchoolId, setLoggedInSchoolId] = useState(0)
  const [isAdmin, setIsAdmin]                   = useState(false)
  const [mounted, setMounted]                   = useState(false)

  useEffect(() => {
    const roleId   = Number(localStorage.getItem("roleId"))
    const schoolId = Number(localStorage.getItem("schoolId"))
    setLoggedInRoleId(roleId)
    setLoggedInSchoolId(schoolId)
    setIsAdmin(roleId === 1)
    setMounted(true)
  }, [])

  /* ── Designer state ── */
  const [template, setTemplate]       = useState<CardTemplateWithDb>(EMPTY_TEMPLATE())
  const [activeSide, setActiveSide]   = useState<"front" | "back">("front")
  const [selectedId, setSelectedId]   = useState<string | null>(null)
  const [zoom, setZoom]               = useState(2.5)
  const [showPreview, setShowPreview] = useState(false)
  const [history, setHistory]         = useState<CardTemplateWithDb[]>([])
  const [historyIdx, setHistoryIdx]   = useState(-1)
  const [saving, setSaving]           = useState(false)

  /* ── Save dialog state ── */
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveSchoolId, setSaveSchoolId]     = useState<string>("")
  const [schools, setSchools]               = useState<any[]>([])

  /* ── Load dialog state ── */
  const [showLoadDialog, setShowLoadDialog]       = useState(false)
  const [savedTemplates, setSavedTemplates]       = useState<any[]>([])
  const [loadingTemplates, setLoadingTemplates]   = useState(false)

  /* ── Preview student data ── */
  const [previewStudent] = useState<any>({
    fullName:         "Prashant Pawar",
    firstName:        "Prashant",
    lastName:         "Pawar",
    rollNo:           "1010",
    className:        "I",
    divisionName:     "A",
    bloodGroup:       "A+",
    dob:              "2015-12-04",
    studentId:        "1001",
    parentName:       "Ashok Pawar",
    emergencyContact: "9876543210",
  })

  /* ── Load schools (admin only) ── */
  useEffect(() => {
    if (!mounted || !isAdmin) return
    fetch(`${BASE_URL}/School/list`)
      .then(r => r.json())
      .then(setSchools)
      .catch(console.error)
  }, [mounted, isAdmin])

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

  const addElement    = (el: CardElement) => setElements([...elements, el])

  const updateElement = (id: string, updates: Partial<CardElement>) =>
    setElements(elements.map(e => e.id === id ? { ...e, ...updates } : e))

  const deleteElement = () => {
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

  /* ── New blank template ── */
  const newTemplate = () => {
    if (!confirm("Start new template? Unsaved changes will be lost.")) return
    setTemplate(EMPTY_TEMPLATE())
    setActiveSide("front")
    setSelectedId(null)
    setHistory([])
    setHistoryIdx(-1)
  }

  /* ── Load templates list from API ── */
  const loadTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const schoolParam = isAdmin ? "" : `?schoolId=${loggedInSchoolId}`
      const data = await fetch(`${BASE_URL}/CardTemplate/list${schoolParam}`)
        .then(r => r.json())
      setSavedTemplates(data || [])
      setShowLoadDialog(true)
    } catch {
      alert("Failed to load templates")
    } finally {
      setLoadingTemplates(false)
    }
  }

  /* ── Load single template into designer ── */
  const loadTemplateById = async (templateId: number) => {
    try {
      const data = await fetch(`${BASE_URL}/CardTemplate/${templateId}`)
        .then(r => r.json())

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
    } catch {
      alert("Failed to load template")
    }
  }

  /* ── Delete saved template ── */
  const deleteTemplateById = async (templateId: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await fetch(`${BASE_URL}/CardTemplate/${templateId}`, { method: "DELETE" })
      setSavedTemplates(prev => prev.filter(t => t.templateId !== templateId))
    } catch {
      alert("Failed to delete template")
    }
  }

  /* ── Save to API ── */
  const saveTemplate = async () => {
    if (!template.name.trim()) { alert("Please enter a template name"); return }
    setSaving(true)
    try {
      const schoolId = isAdmin
        ? (saveSchoolId ? Number(saveSchoolId) : null)
        : loggedInSchoolId || null

      const res = await fetch(`${BASE_URL}/CardTemplate/save`, {
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
      } else {
        alert("❌ " + data.message)
      }
    } catch {
      alert("Failed to save — check API connection")
    } finally {
      setSaving(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">

      {/* ── TOP TOOLBAR ── */}
      <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-3 shrink-0">

        <button onClick={() => router.back()} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* ✅ New + Open buttons */}
        <button onClick={newTemplate}
          title="New Template"
          className="text-slate-400 hover:text-white text-xs border border-slate-600
            px-2 py-1 rounded-lg hover:border-slate-400 transition-colors">
          + New
        </button>

        <Button size="sm" variant="ghost"
          onClick={loadTemplates}
          disabled={loadingTemplates}
          className="text-slate-400 hover:text-white border border-slate-600
            h-7 text-xs hover:border-slate-400">
          {loadingTemplates ? "Loading..." : "📂 Open"}
        </Button>

        <div className="h-5 w-px bg-slate-700" />

        {/* Template name */}
        <Input
          value={template.name}
          onChange={e => setTemplate(p => ({ ...p, name: e.target.value }))}
          className="h-7 w-48 text-sm bg-slate-700 border-slate-600 text-white"
        />

        {/* Side toggle */}
        <div className="flex rounded-lg border border-slate-600 overflow-hidden ml-2">
          {(["front", "back"] as const).map(s => (
            <button key={s}
              onClick={() => { setActiveSide(s); setSelectedId(null) }}
              className={`px-3 py-1 text-xs font-medium transition-colors
                ${activeSide === s ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
              {s === "front" ? "◼ Front" : "◻ Back"}
            </button>
          ))}
        </div>

        {/* Background Color */}
<div className="flex items-center gap-2 ml-2">
  <span className="text-xs text-slate-400 shrink-0">BG Color</span>
  <input
    type="color"
    value={template.backgroundColor}
    onChange={e => setTemplate(p => ({ ...p, backgroundColor: e.target.value }))}
    className="w-8 h-7 rounded cursor-pointer border border-slate-600 p-0"
    title="Card Background Color"
  />
  <span className="text-xs text-slate-400 font-mono">
    {template.backgroundColor}
  </span>
</div>

        <div className="h-5 w-px bg-slate-700" />

        {/* Zoom */}
        <button onClick={() => setZoom(z => Math.max(1, z - 0.5))}
          className="text-slate-400 hover:text-white">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button onClick={() => setZoom(z => Math.min(5, z + 0.5))}
          className="text-slate-400 hover:text-white">
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-700" />

        {/* Undo / Redo */}
        <button onClick={undo} disabled={historyIdx <= 0}
          className="text-slate-400 hover:text-white disabled:opacity-30">
          <Undo className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={historyIdx >= history.length - 1}
          className="text-slate-400 hover:text-white disabled:opacity-30">
          <Redo className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Element count */}
        <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
          {elements.length} elements
        </Badge>

        {/* dbId indicator */}
        {template.dbId && (
          <Badge className="bg-green-700 text-white text-xs border-0">
            ID: {template.dbId}
          </Badge>
        )}

        {/* Live preview toggle */}
        <button onClick={() => setShowPreview(p => !p)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${showPreview
              ? "bg-green-600 text-white"
              : "text-slate-400 border border-slate-600 hover:text-white"}`}>
          <Monitor className="w-3.5 h-3.5" />
          {showPreview ? "Live Preview ON" : "Preview"}
        </button>

        {/* Save button */}
        <Button size="sm"
          onClick={() => setShowSaveDialog(true)}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white h-7 text-xs">
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Save
        </Button>
      </div>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-1 overflow-hidden">

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

        <DesignerCanvas
          elements={elements}
          cardWidth={template.cardWidth}
          cardHeight={template.cardHeight}
          backgroundColor={template.backgroundColor}
          backgroundImage={template.backgroundImage}
          selectedId={selectedId}
          zoom={zoom}
          previewStudent={showPreview ? previewStudent : undefined}
          previewSchool={showPreview
            ? { schoolName: "IDS International School", schoolAddress: "Pune, Maharashtra" }
            : undefined}
          onSelect={setSelectedId}
          onMove={(id, x, y) => updateElement(id, { x, y })}
          onResize={(id, w, h) => updateElement(id, { width: w, height: h })}
        />

        <PropertyPanel
          element={selectedElement}
          onChange={updates => selectedElement && updateElement(selectedElement.id, updates)}
        />
      </div>

      {/* ══════════════════════════════════════
          LOAD TEMPLATE DIALOG
      ══════════════════════════════════════ */}
      {showLoadDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-4
            max-h-[80vh] flex flex-col">

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Saved Templates</h3>
                <p className="text-sm text-slate-400">
                  {savedTemplates.length} template{savedTemplates.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <button onClick={() => setShowLoadDialog(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {savedTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                  <span className="text-4xl mb-3">📄</span>
                  <p className="text-sm">No saved templates yet</p>
                  <p className="text-xs mt-1">Create a design and click Save</p>
                </div>
              ) : (
                savedTemplates.map((t: any) => (
                  <div key={t.templateId}
                    className="flex items-center justify-between p-4 rounded-xl border
                      border-slate-200 hover:border-blue-300 hover:bg-blue-50/50
                      transition-all cursor-pointer group"
                    onClick={() => loadTemplateById(t.templateId)}>

                    <div className="flex items-center gap-3">
                      {/* Color preview */}
                      <div className="w-10 h-14 rounded-lg border border-slate-200 shrink-0 overflow-hidden"
                        style={{ background: t.backgroundColor || "#1d4ed8" }}>
                        {t.backgroundImage && (
                          <img src={`data:image/png;base64,${t.backgroundImage}`}
                            className="w-full h-full object-cover" alt="preview" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {Number(t.cardWidth)}×{Number(t.cardHeight)}mm
                          · {t.orientation}
                          · {t.templateCode}
                        </p>
                        <div className="flex gap-2 mt-1 flex-wrap">
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
                        <p className="text-[10px] text-slate-300 mt-1">
                          {new Date(t.createdOn).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm"
                        onClick={e => { e.stopPropagation(); loadTemplateById(t.templateId) }}
                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                        Edit
                      </Button>
                      <button
                        onClick={e => { e.stopPropagation(); deleteTemplateById(t.templateId, t.name) }}
                        className="h-8 px-3 text-xs rounded-lg border border-red-200
                          text-red-500 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => { setShowLoadDialog(false); newTemplate() }}
                className="bg-green-600 hover:bg-green-700 text-white">
                + Create New Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          SAVE DIALOG
      ══════════════════════════════════════ */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">

            <div>
              <h3 className="text-lg font-bold text-slate-800">Save Template</h3>
              <p className="text-sm text-slate-400">
                {template.dbId ? "Update existing template" : "Save as new template"}
              </p>
            </div>

            <div>
              <Label className="text-sm mb-1.5 block">
                Template Name <span className="text-red-500">*</span>
              </Label>
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
                <p className="text-xs text-slate-400 mt-1">
                  Leave blank to share template with all schools
                </p>
              </div>
            )}

            {!isAdmin && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-sm text-blue-700 font-medium">
                  Template will be saved for your school
                </p>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg p-3 border text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Size</span>
                <span className="font-medium">{template.cardWidth} × {template.cardHeight} mm</span>
              </div>
              <div className="flex justify-between">
                <span>Orientation</span>
                <span className="font-medium capitalize">{template.orientation}</span>
              </div>
              <div className="flex justify-between">
                <span>Front elements</span>
                <span className="font-medium">{template.frontElements.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Back elements</span>
                <span className="font-medium">{template.backElements.length}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1"
                onClick={() => setShowSaveDialog(false)}>
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