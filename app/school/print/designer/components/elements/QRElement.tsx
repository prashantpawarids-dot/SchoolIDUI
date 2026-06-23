"use client"
import { useEffect, useRef } from "react"
import QRCode from "qrcode"

export default function QRElement({ value, size }: { value: string; size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return
    QRCode.toCanvas(canvasRef.current, value || "QR", {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
    }).catch(console.error)
  }, [value, size])

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
}