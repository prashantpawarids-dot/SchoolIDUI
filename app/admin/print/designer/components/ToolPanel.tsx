"use client"
import { Button } from "@/components/ui/button"
import { Type, Image, Barcode, QrCode, Square, Minus, MousePointer, Trash2, Copy, Eye, EyeOff, Lock, Unlock } from "lucide-react"
import type { CardElement } from "../../lib/card-types"
import { createDefaultElement } from "../../lib/print-utils"

interface Props {
  onAddElement: (el: CardElement) => void
  selectedElement: CardElement | null
  onDelete: () => void
  onDuplicate: () => void
  onToggleVisible: () => void
  onToggleLock: () => void
}

const TOOLS = [
  { type: "text",    icon: Type,         label: "Text"    },
  { type: "image",   icon: Image,        label: "Photo"   },
  { type: "barcode", icon: Barcode,      label: "Barcode" },
  { type: "qrcode",  icon: QrCode,       label: "QR Code" },
  { type: "shape",   icon: Square,       label: "Shape"   },
  { type: "line",    icon: Minus,        label: "Line"    },
]

export default function ToolPanel({ onAddElement, selectedElement, onDelete, onDuplicate, onToggleVisible, onToggleLock }: Props) {
  return (
    <div className="w-16 bg-slate-900 flex flex-col items-center py-4 gap-1 h-full border-r border-slate-700">
      {/* Add tools */}
      <div className="flex flex-col gap-1 w-full px-2">
        {TOOLS.map(tool => {
          const Icon = tool.icon
          return (
            <button
              key={tool.type}
              onClick={() => onAddElement(createDefaultElement(tool.type as CardElement["type"]))}
              title={`Add ${tool.label}`}
              className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-slate-400
                hover:bg-slate-700 hover:text-white transition-all group w-full">
              <Icon className="w-4 h-4" />
              <span className="text-[9px]">{tool.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex-1" />

      {/* Selected element actions */}
      {selectedElement && (
        <div className="flex flex-col gap-1 w-full px-2 border-t border-slate-700 pt-2">
          <button onClick={onDuplicate} title="Duplicate"
            className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white">
            <Copy className="w-4 h-4" />
            <span className="text-[9px]">Copy</span>
          </button>
          <button onClick={onToggleVisible} title="Toggle Visible"
            className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white">
            {selectedElement.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-[9px]">Show</span>
          </button>
          <button onClick={onToggleLock} title="Lock/Unlock"
            className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white">
            {selectedElement.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span className="text-[9px]">Lock</span>
          </button>
          <button onClick={onDelete} title="Delete"
            className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-red-400 hover:bg-red-900/40 hover:text-red-300">
            <Trash2 className="w-4 h-4" />
            <span className="text-[9px]">Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}