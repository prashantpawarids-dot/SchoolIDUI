"use client"
import { useRef, useState, useCallback } from "react"
import { mmToPx, resolveText } from "../../lib/print-utils"
import type { CardElement } from "../../lib/card-types"
import QRElement from "./elements/QRElement"
import BarcodeElement from "./elements/BarcodeElement"

interface Props {
  elements: CardElement[]
  cardWidth: number   // mm
  cardHeight: number  // mm
  backgroundColor: string
  backgroundImage?: string
  selectedId: string | null
  zoom: number
  previewStudent?: any
  previewSchool?: any
  onSelect: (id: string | null) => void
  onMove: (id: string, x: number, y: number) => void
  onResize: (id: string, width: number, height: number) => void
}

export default function DesignerCanvas({
  elements, cardWidth, cardHeight, backgroundColor, backgroundImage,
  selectedId, zoom, previewStudent, previewSchool,
  onSelect, onMove, onResize
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null)

  const canvasW = mmToPx(cardWidth)  * zoom
  const canvasH = mmToPx(cardHeight) * zoom

  const handleMouseDown = useCallback((e: React.MouseEvent, el: CardElement) => {
    if (el.locked) return
    e.stopPropagation()
    onSelect(el.id)
    setDragging({ id: el.id, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y })
  }, [onSelect])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    const dxPx = e.clientX - dragging.startX
    const dyPx = e.clientY - dragging.startY
    const dxMm = dxPx / (3.7795275591 * zoom)
    const dyMm = dyPx / (3.7795275591 * zoom)
    onMove(dragging.id, Math.max(0, dragging.elX + dxMm), Math.max(0, dragging.elY + dyMm))
  }, [dragging, zoom, onMove])

  const handleMouseUp = useCallback(() => setDragging(null), [])

  const renderElement = (el: CardElement) => {
    if (!el.visible) return null

    const x     = mmToPx(el.x)      * zoom
    const y     = mmToPx(el.y)      * zoom
    const w     = mmToPx(el.width)  * zoom
    const h     = mmToPx(el.height) * zoom
    const isSelected = el.id === selectedId

    const style: React.CSSProperties = {
      position: "absolute", left: x, top: y, width: w, height: h,
      transform: `rotate(${el.rotation || 0}deg)`,
      opacity: el.opacity ?? 1,
      cursor: el.locked ? "default" : "move",
      outline: isSelected ? "2px solid #3b82f6" : "none",
      outlineOffset: "1px",
      boxSizing: "border-box",
      userSelect: "none",
    }

    const textVal = resolveText(el.text || "", previewStudent, previewSchool)
    const barcodeVal = resolveText(el.barcodeValue || el.dataField ? `{${el.dataField}}` : "000000", previewStudent, previewSchool)
    const qrVal = resolveText(el.qrValue || el.dataField ? `{${el.dataField}}` : "QR", previewStudent, previewSchool)

    let content: React.ReactNode = null

    switch (el.type) {
      case "text":
        content = (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: el.textAlign || "center",
            fontSize: (el.fontSize || 10) * zoom,
            fontFamily: el.fontFamily || "Arial",
            fontWeight: el.fontWeight || "normal",
            fontStyle: el.fontStyle || "normal",
            color: el.color || "#000",
            whiteSpace: "nowrap", overflow: "hidden",
            padding: "0 2px",
          }}>
            {textVal || el.text || "Text"}
          </div>
        )
        break

      case "image":
        const imgSrc = el.dataField === "photoPath"  ? (previewStudent?.photoPath  ? previewStudent.photoPath : "")
                     : el.dataField === "schoolLogo" ? (previewSchool?.schoolLogo  ? `data:image/png;base64,${previewSchool.schoolLogo}` : "")
                     : el.src || ""
        content = imgSrc
          ? <img src={imgSrc} style={{ width: "100%", height: "100%", objectFit: el.objectFit || "cover", borderRadius: mmToPx(el.borderRadius || 0) * zoom }} alt="" />
          : <div style={{ width: "100%", height: "100%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 * zoom, color: "#94a3b8", borderRadius: mmToPx(el.borderRadius || 0) * zoom }}>
              {el.dataField === "photoPath" ? "Photo" : el.dataField === "schoolLogo" ? "Logo" : "Image"}
            </div>
        break

      case "barcode":
        content = <BarcodeElement value={barcodeVal || "123456"} type={el.barcodeType || "code128"} showText={el.showText ?? true} width={el.width} height={el.height} />
        break

      case "qrcode":
        content = <QRElement value={qrVal || "QR"} size={Math.min(w, h)} />
        break

      case "shape":
      case "line":
        content = (
          <div style={{
            width: "100%", height: "100%",
            background: el.shapeType === "line" ? "transparent" : (el.backgroundColor || "#1d4ed8"),
            border: `${el.borderWidth || 0}px solid ${el.borderColor || "transparent"}`,
            borderBottom: el.shapeType === "line" ? `${el.borderWidth || 1}px solid ${el.borderColor || "#000"}` : undefined,
            borderRadius: mmToPx(el.borderRadius || 0) * zoom,
          }} />
        )
        break
    }

    return (
      <div key={el.id} style={style}
        onMouseDown={e => handleMouseDown(e, el)}
        onClick={e => { e.stopPropagation(); onSelect(el.id) }}>
        {content}
        {/* Resize handle */}
        {isSelected && !el.locked && (
          <div style={{
            position: "absolute", bottom: -4, right: -4,
            width: 8, height: 8, background: "#3b82f6",
            border: "1px solid white", borderRadius: 2, cursor: "se-resize",
          }} />
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-200 flex items-center justify-center overflow-auto"
      onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div ref={canvasRef}
        style={{ width: canvasW, height: canvasH, position: "relative", background: backgroundColor, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)", borderRadius: 4 }}
        onClick={() => onSelect(null)}>
        {/* Background image */}
        {backgroundImage && (
          <img src={backgroundImage} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} alt="bg" />
        )}
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${mmToPx(5) * zoom - 1}px, rgba(0,0,0,0.05) ${mmToPx(5) * zoom}px), repeating-linear-gradient(90deg, transparent, transparent ${mmToPx(5) * zoom - 1}px, rgba(0,0,0,0.05) ${mmToPx(5) * zoom}px)`,
        }} />
        {/* Elements */}
        {elements.map(renderElement)}
      </div>
    </div>
  )
}