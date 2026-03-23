import type { CardElement } from "./card-types"
import { resolveText } from "./print-utils"

/* ── Render a single element as inline HTML string ── */
function renderElementHtml(
  el: CardElement,
  student: any,
  school: any,
  cardW: number,
  cardH: number
): string {
  if (!el.visible) return ""

  const left   = (el.x      / cardW * 100).toFixed(3)
  const top    = (el.y      / cardH * 100).toFixed(3)
  const width  = (el.width  / cardW * 100).toFixed(3)
  const height = (el.height / cardH * 100).toFixed(3)

  const baseStyle = `
    position:absolute;
    left:${left}%;
    top:${top}%;
    width:${width}%;
    height:${height}%;
    transform:rotate(${el.rotation || 0}deg);
    opacity:${el.opacity ?? 1};
    box-sizing:border-box;
    overflow:hidden;
  `

  const textVal    = resolveText(el.text    || "", student, school)
  const barcodeVal = resolveText(el.barcodeValue || (el.dataField ? `{${el.dataField}}` : "000000"), student, school)
  const qrVal      = resolveText(el.qrValue      || (el.dataField ? `{${el.dataField}}` : "QR"), student, school)

  switch (el.type) {

    case "text":
      return `
        <div style="${baseStyle}
          display:flex;
          align-items:center;
          justify-content:${el.textAlign === "left" ? "flex-start" : el.textAlign === "right" ? "flex-end" : "center"};
          font-size:${el.fontSize || 10}pt;
          font-family:${el.fontFamily || "Arial"},sans-serif;
          font-weight:${el.fontWeight || "normal"};
          font-style:${el.fontStyle || "normal"};
          color:${el.color || "#000000"};
          white-space:nowrap;
          padding:0 1px;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">${textVal || ""}</div>`

    case "image": {
      const imgSrc = el.dataField === "photoPath"
        ? (student?.photoPath || "")
        : el.dataField === "schoolLogo"
          ? (school?.schoolLogo ? `data:image/png;base64,${school.schoolLogo}` : "")
          : el.src || ""

      return imgSrc
        ? `<div style="${baseStyle}
            border-radius:${el.borderRadius || 0}mm;
            -webkit-print-color-adjust:exact;
            print-color-adjust:exact;
          ">
            <img src="${imgSrc}"
              style="width:100%;height:100%;
                object-fit:${el.objectFit || "cover"};
                border-radius:${el.borderRadius || 0}mm;
                display:block;" />
          </div>`
        : `<div style="${baseStyle}
            background:#e2e8f0;
            border-radius:${el.borderRadius || 0}mm;
            display:flex;align-items:center;justify-content:center;
            font-size:6pt;color:#94a3b8;
          ">${el.dataField === "photoPath" ? "Photo" : "Image"}</div>`
    }

    case "shape":
    case "line":
      return `
        <div style="${baseStyle}
          background:${el.shapeType === "line" ? "transparent" : (el.backgroundColor || "#1d4ed8")};
          border:${el.borderWidth || 0}px solid ${el.borderColor || "transparent"};
          ${el.shapeType === "line"
            ? `border-bottom:${el.borderWidth || 1}px solid ${el.borderColor || "#000"};`
            : ""}
          border-radius:${el.borderRadius || 0}mm;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        "></div>`

    case "barcode":
      // Render as text fallback for print (real barcode needs canvas)
      return `
        <div style="${baseStyle}
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          background:#fff;
          font-family:'Libre Barcode 128',monospace;
          font-size:${(el.height || 10) * 2.5}pt;
          color:#000;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">
          <div style="font-size:inherit;line-height:1;">${barcodeVal}</div>
          ${el.showText !== false
            ? `<div style="font-family:Arial;font-size:6pt;margin-top:1px;">${barcodeVal}</div>`
            : ""}
        </div>`

    case "qrcode":
      // QR as Google Charts API (works in print window)
      const qrSize = Math.min(el.width, el.height)
      const qrUrl  = `https://chart.googleapis.com/chart?chs=${Math.round(qrSize * 10)}x${Math.round(qrSize * 10)}&cht=qr&chl=${encodeURIComponent(qrVal)}&choe=UTF-8`
      return `
        <div style="${baseStyle}
          display:flex;align-items:center;justify-content:center;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
        ">
          <img src="${qrUrl}"
            style="width:100%;height:100%;object-fit:contain;display:block;" />
        </div>`

    default:
      return ""
  }
}

/* ── Render full card side as HTML string ── */
export function renderCardSideHtml(
  elements: CardElement[],
  student: any,
  school: any,
  cardW: number,
  cardH: number,
  backgroundColor: string,
  backgroundImage?: string,
  orientation: string = "portrait"
): string {
  const isLandscape = orientation === "landscape"
  const w = isLandscape ? `${cardH}mm` : `${cardW}mm`
  const h = isLandscape ? `${cardW}mm` : `${cardH}mm`

  const elementsHtml = elements
    .map(el => renderElementHtml(el, student, school, cardW, cardH))
    .join("\n")

  return `
    <div style="
      position:relative;
      width:${w};
      height:${h};
      overflow:hidden;
      background:${backgroundColor};
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
      box-sizing:border-box;
    ">
      ${backgroundImage
        ? `<img src="data:image/png;base64,${backgroundImage}"
            style="position:absolute;inset:0;width:100%;height:100%;
              object-fit:cover;display:block;" />`
        : ""}
      ${elementsHtml}
    </div>`
}

/* ── Build full print HTML for all selected students ── */
export function buildDesignerPrintHtml(
  students: any[],
  school: any,
  frontElements: CardElement[],
  backElements:  CardElement[],
  cardW:         number,
  cardH:         number,
  backgroundColor: string,
  backgroundImage: string | undefined,
  orientation:   string,
  printSide:     string,
  brightness:    number,
  contrast:      number,
  copies:        number
): string {
  const isLandscape = orientation === "landscape"
  const pageW = isLandscape ? `${cardH}mm` : `${cardW}mm`
  const pageH = isLandscape ? `${cardW}mm` : `${cardH}mm`

  const brightnessVal = `brightness(${1 + brightness / 100})`
  const contrastVal   = `contrast(${1 + contrast / 100})`

  const showFront = printSide === "Front" || printSide === "Both"
  const showBack  = printSide === "Back"  || printSide === "Both"

  let cardsHtml = ""

  for (let copy = 0; copy < copies; copy++) {
    for (const student of students) {
      if (showFront) {
        cardsHtml += renderCardSideHtml(
          frontElements, student, school,
          cardW, cardH, backgroundColor, backgroundImage, orientation
        )
      }
      if (showBack) {
        cardsHtml += renderCardSideHtml(
          backElements, student, school,
          cardW, cardH, "#f8fafc", undefined, orientation
        )
      }
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>ID Cards</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after { margin:0; padding:0; box-sizing:border-box; }
    html,body {
      margin:0; padding:0; background:#fff;
      -webkit-print-color-adjust:exact;
      print-color-adjust:exact;
    }
    @page { size:${pageW} ${pageH}; margin:0; }
    body { filter:${brightnessVal} ${contrastVal}; }
    @media print {
      *{
        -webkit-print-color-adjust:exact!important;
        print-color-adjust:exact!important;
      }
    }
  </style>
</head>
<body>
  ${cardsHtml}
  <script>
    window.onload = function() {
      var imgs = document.querySelectorAll('img');
      var loaded = 0;
      if (!imgs.length) { window.print(); return; }
      imgs.forEach(function(img) {
        if (img.complete) { loaded++; if (loaded === imgs.length) window.print(); }
        else {
          img.onload = img.onerror = function() {
            loaded++;
            if (loaded === imgs.length) window.print();
          };
        }
      });
    };
  <\/script>
</body>
</html>`
}