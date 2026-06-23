"use client"
import Barcode from "react-barcode"

export default function BarcodeElement({
  value, type, showText, width, height
}: {
  value: string; type: string; showText: boolean; width: number; height: number
}) {
  if (!value) return <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Barcode</div>

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Barcode
        value={value || "000000"}
        format={type as any}
        width={1.2}
        height={height * 3.5}
        fontSize={showText ? 8 : 0}
        margin={0}
        displayValue={showText}
      />
    </div>
  )
}