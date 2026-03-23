"use client"
import { Eye, EyeOff, Lock, Unlock, GripVertical, Type, Image, QrCode, Square } from "lucide-react"
import type { CardElement } from "../../lib/card-types"

const ICONS: Record<string, any> = {
  text: Type, image: Image, barcode: Square, qrcode: QrCode, shape: Square, line: Square
}

interface Props {
  elements: CardElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onToggleVisible: (id: string) => void
  onToggleLock: (id: string) => void
  onReorder: (from: number, to: number) => void
}

export default function LayerPanel({ elements, selectedId, onSelect, onToggleVisible, onToggleLock }: Props) {
  return (
    <div className="w-48 bg-white border-r flex flex-col">
      <div className="p-2 border-b bg-slate-50">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Layers</p>
        <p className="text-[10px] text-slate-400">{elements.length} element{elements.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {[...elements].reverse().map((el, idx) => {
          const Icon = ICONS[el.type] || Square
          const isSelected = el.id === selectedId
          return (
            <div key={el.id}
              onClick={() => onSelect(el.id)}
              className={`flex items-center gap-1.5 px-2 py-1.5 cursor-pointer border-b border-slate-100
                hover:bg-slate-50 transition-colors
                ${isSelected ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}>
              <GripVertical className="w-3 h-3 text-slate-300 shrink-0" />
              <Icon className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-700 flex-1 truncate">
                {el.type === "text" ? (el.text || "Text").substring(0, 14)
                  : el.type === "image" ? (el.dataField || "Image")
                  : el.type}
              </span>
              <button onClick={e => { e.stopPropagation(); onToggleVisible(el.id) }}
                className="p-0.5 hover:text-blue-600">
                {el.visible !== false ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
              </button>
              <button onClick={e => { e.stopPropagation(); onToggleLock(el.id) }}
                className="p-0.5 hover:text-blue-600">
                {el.locked ? <Lock className="w-3 h-3 text-orange-400" /> : <Unlock className="w-3 h-3 text-slate-300" />}
              </button>
            </div>
          )
        })}
        {elements.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6 px-2">No elements yet. Use tools to add.</p>
        )}
      </div>
    </div>
  )
}