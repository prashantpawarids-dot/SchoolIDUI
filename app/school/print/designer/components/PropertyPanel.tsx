"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DYNAMIC_FIELDS } from "../../lib/card-types"
import type { CardElement } from "../../lib/card-types"

// interface Props {
//   element: CardElement | null
//   onChange: (updates: Partial<CardElement>) => void
// }

interface Props {
  element: CardElement | null
  onChange: (updates: Partial<CardElement>) => void
  excelColumns?: string[]  // ← add this
}

export default function PropertyPanel({ element, onChange,excelColumns  }: Props) {
  if (!element) return (
    <div className="w-64 bg-slate-50 border-l p-4 flex items-center justify-center">
      <p className="text-sm text-slate-400 text-center">Select an element to edit properties</p>
    </div>
  )

  return (
    <div className="w-64 bg-white border-l overflow-y-auto flex flex-col">
      <div className="p-3 border-b bg-slate-50">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Properties</p>
        <p className="text-sm font-semibold text-slate-800 capitalize">{element.type} Element</p>
      </div>

      <div className="p-3 space-y-4 flex-1">

        {/* Position & Size */}
        <section>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Position & Size</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: "X (mm)", key: "x" },
              { label: "Y (mm)", key: "y" },
              { label: "W (mm)", key: "width" },
              { label: "H (mm)", key: "height" },
            ].map(f => (
              <div key={f.key}>
                <Label className="text-xs mb-1 block">{f.label}</Label>
                <Input
                  type="number" step="0.5"
                  value={(element as any)[f.key] || 0}
                  onChange={e => onChange({ [f.key]: Number(e.target.value) })}
                  className="h-7 text-xs"
                />
              </div>
            ))}
            <div>
              <Label className="text-xs mb-1 block">Rotation °</Label>
              <Input
                type="number" step="1"
                value={element.rotation || 0}
                onChange={e => onChange({ rotation: Number(e.target.value) })}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Opacity %</Label>
              <Input
                type="number" min={0} max={100}
                value={Math.round((element.opacity ?? 1) * 100)}
                onChange={e => onChange({ opacity: Number(e.target.value) / 100 })}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </section>

        {/* TEXT properties */}
        {element.type === "text" && (
          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Text</p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs mb-1 block">Content</Label>
                <Input value={element.text || ""} onChange={e => onChange({ text: e.target.value })} className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-xs mb-1 block">Dynamic Field</Label>
                {/* <Select value={element.dataField || ""} onValueChange={v => onChange({ text: `{${v}}`, dataField: v })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Bind to field..." /></SelectTrigger>
                  <SelectContent>
                    {DYNAMIC_FIELDS.map(f => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}

                <Select
  value={element.dataField || ""}
  onValueChange={v => onChange({ text: `{${v}}`, dataField: v })}
>
  <SelectTrigger className="h-7 text-xs">
    <SelectValue placeholder="Bind to field..." />
  </SelectTrigger>

  <SelectContent>
    {/* School fields */}
    <SelectItem value="" disabled className="text-xs text-slate-400">
      — School fields —
    </SelectItem>

    {DYNAMIC_FIELDS.map(f => (
      <SelectItem key={f.value} value={f.value} className="text-xs">
        {f.label}
      </SelectItem>
    ))}

    {/* Folder assets */}
    <SelectItem value="photoPath" className="text-xs">
      📷 Photo (from folder)
    </SelectItem>
    <SelectItem value="qrImagePath" className="text-xs">
      📱 QR image (from folder)
    </SelectItem>
    <SelectItem value="barcodeImagePath" className="text-xs">
      📊 Barcode image (from folder)
    </SelectItem>

    {/* Excel columns */}
    {(excelColumns || []).length > 0 && (
      <>
        <SelectItem value="" disabled className="text-xs text-slate-400">
          — Excel columns —
        </SelectItem>

        {(excelColumns || []).map(col => (
          <SelectItem key={col} value={col} className="text-xs">
            📊 {col}
          </SelectItem>
        ))}
      </>
    )}
  </SelectContent>
</Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs mb-1 block">Font Size</Label>
                  <Input type="number" value={element.fontSize || 10} onChange={e => onChange({ fontSize: Number(e.target.value) })} className="h-7 text-xs" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Color</Label>
                  <input type="color" value={element.color || "#000000"} onChange={e => onChange({ color: e.target.value })}
                    className="h-7 w-full rounded border cursor-pointer" />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Font Family</Label>
                <Select value={element.fontFamily || "Arial"} onValueChange={v => onChange({ fontFamily: v })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia", "Verdana"].map(f => (
                      <SelectItem key={f} value={f} className="text-xs" style={{ fontFamily: f }}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onChange({ fontWeight: element.fontWeight === "bold" ? "normal" : "bold" })}
                  className={`flex-1 h-7 text-xs rounded border font-bold ${element.fontWeight === "bold" ? "bg-blue-600 text-white" : "bg-white"}`}>
                  B
                </button>
                <button onClick={() => onChange({ fontStyle: element.fontStyle === "italic" ? "normal" : "italic" })}
                  className={`flex-1 h-7 text-xs rounded border italic ${element.fontStyle === "italic" ? "bg-blue-600 text-white" : "bg-white"}`}>
                  I
                </button>
                {["left", "center", "right"].map(a => (
                  <button key={a} onClick={() => onChange({ textAlign: a as any })}
                    className={`flex-1 h-7 text-xs rounded border ${element.textAlign === a ? "bg-blue-600 text-white" : "bg-white"}`}>
                    {a === "left" ? "≡L" : a === "center" ? "≡C" : "≡R"}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BARCODE properties */}
        {element.type === "barcode" && (
          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Barcode</p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs mb-1 block">Value / Field</Label>
                <Select value={element.dataField || ""} onValueChange={v => onChange({ barcodeValue: `{${v}}`, dataField: v })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Bind field..." /></SelectTrigger>
                  <SelectContent>
                    {DYNAMIC_FIELDS.map(f => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Barcode Type</Label>
                <Select value={element.barcodeType || "code128"} onValueChange={v => onChange({ barcodeType: v as any })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code128" className="text-xs">Code 128</SelectItem>
                    <SelectItem value="code39"  className="text-xs">Code 39</SelectItem>
                    <SelectItem value="ean13"   className="text-xs">EAN-13</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={element.showText ?? true} onChange={e => onChange({ showText: e.target.checked })} />
                Show text below barcode
              </label>
            </div>
          </section>
        )}

        {/* QR properties */}
        {element.type === "qrcode" && (
          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">QR Code</p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs mb-1 block">Data Field</Label>
                <Select value={element.dataField || ""} onValueChange={v => onChange({ qrValue: `{${v}}`, dataField: v })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Bind field..." /></SelectTrigger>
                  <SelectContent>
                    {DYNAMIC_FIELDS.map(f => (
                      <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Error Correction</Label>
                <Select value={element.qrErrorLevel || "M"} onValueChange={v => onChange({ qrErrorLevel: v as any })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L" className="text-xs">L (7%)</SelectItem>
                    <SelectItem value="M" className="text-xs">M (15%)</SelectItem>
                    <SelectItem value="Q" className="text-xs">Q (25%)</SelectItem>
                    <SelectItem value="H" className="text-xs">H (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        )}

        {/* SHAPE properties */}
        {(element.type === "shape" || element.type === "line") && (
          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shape</p>
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs mb-1 block">Fill Color</Label>
                  <input type="color" value={element.backgroundColor || "#1d4ed8"}
                    onChange={e => onChange({ backgroundColor: e.target.value })}
                    className="h-7 w-full rounded border cursor-pointer" />
                </div>
                <div>
                  <Label className="text-xs mb-1 block">Border Color</Label>
                  <input type="color" value={element.borderColor || "#000000"}
                    onChange={e => onChange({ borderColor: e.target.value })}
                    className="h-7 w-full rounded border cursor-pointer" />
                </div>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Border Radius (mm)</Label>
                <Input type="number" value={element.borderRadius || 0}
                  onChange={e => onChange({ borderRadius: Number(e.target.value) })}
                  className="h-7 text-xs" />
              </div>
            </div>
          </section>
        )}

        {/* IMAGE properties */}
        {element.type === "image" && (
          <section>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image</p>
            <div className="space-y-2">
              <div>
                <Label className="text-xs mb-1 block">Source</Label>
                <Select value={element.dataField || "custom"} onValueChange={v => onChange({ dataField: v })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photoPath"   className="text-xs">Student Photo</SelectItem>
                    <SelectItem value="schoolLogo"  className="text-xs">School Logo</SelectItem>
                    <SelectItem value="custom"      className="text-xs">Custom Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Fit</Label>
                <Select value={element.objectFit || "cover"} onValueChange={v => onChange({ objectFit: v as any })}>
                  <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover"   className="text-xs">Cover</SelectItem>
                    <SelectItem value="contain" className="text-xs">Contain</SelectItem>
                    <SelectItem value="fill"    className="text-xs">Fill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-1 block">Border Radius (mm)</Label>
                <Input type="number" value={element.borderRadius || 0}
                  onChange={e => onChange({ borderRadius: Number(e.target.value) })}
                  className="h-7 text-xs" />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}