import type { CardElement, CardTemplate } from "./card-types"

/* ── Resolve dynamic field value from student data ── */
// export function resolveText(text: string, student: any, school: any): string {
//   if (!text) return ""
//   return text
//     .replace(/\{fullName\}/g,         student?.fullName         || "")
//     .replace(/\{firstName\}/g,        student?.firstName        || "")
//     .replace(/\{lastName\}/g,         student?.lastName         || "")
//     .replace(/\{rollNo\}/g,           String(student?.rollNo    || ""))
//     .replace(/\{className\}/g,        student?.className        || "")
//     .replace(/\{divisionName\}/g,     student?.divisionName     || "")
//     .replace(/\{bloodGroup\}/g,       student?.bloodGroup       || "")
//     .replace(/\{dob\}/g,              student?.dob
//       ? new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
//       : "")
//     .replace(/\{schoolName\}/g,       school?.schoolName        || "")
//     .replace(/\{schoolAddress\}/g,    school?.schoolAddress     || "")
//     .replace(/\{parentName\}/g,       student?.parentName       || "")
//     .replace(/\{emergencyContact\}/g, student?.emergencyContact || "")
//     .replace(/\{studentId\}/g,        String(student?.studentId || ""))
// }

/* ── Resolve ANY field from student/excel data ── */
export function resolveText(text: string, student: any, school: any): string {
  if (!text) return ""

  let result = text

  // ── Fixed school fields ──
  result = result
    .replace(/\{fullName\}/g,         student?.fullName         || student?.FullName         || "")
    .replace(/\{firstName\}/g,        student?.firstName        || student?.FirstName        || "")
    .replace(/\{lastName\}/g,         student?.lastName         || student?.LastName         || "")
    .replace(/\{rollNo\}/g,           String(student?.rollNo    || student?.RollNo           || ""))
    .replace(/\{className\}/g,        student?.className        || student?.ClassName        || "")
    .replace(/\{divisionName\}/g,     student?.divisionName     || student?.DivisionName     || "")
    .replace(/\{bloodGroup\}/g,       student?.bloodGroup       || student?.BloodGroup       || "")
    .replace(/\{dob\}/g,              student?.dob || student?.DOB
      ? new Date(student?.dob || student?.DOB).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "")
    .replace(/\{schoolName\}/g,       school?.schoolName        || school?.SchoolName        || "")
    .replace(/\{schoolAddress\}/g,    school?.schoolAddress     || school?.SchoolAddress     || "")
    .replace(/\{parentName\}/g,       student?.parentName       || student?.ParentName       || "")
    .replace(/\{emergencyContact\}/g, student?.emergencyContact || student?.EmergencyContact || "")
    .replace(/\{studentId\}/g,        String(student?.studentId || student?.StudentId       || ""))
    .replace(/\{academicYear\}/g,     student?.academicYear     || student?.AcademicYear     || "")

  // ── Dynamic Excel columns — replace {ColumnName} with matching value ──
  if (student) {
    const remaining = result.match(/\{[^}]+\}/g) || []
    for (const placeholder of remaining) {
      const key = placeholder.slice(1, -1) // strip { }
      // Try exact key, then case-insensitive match
      const val = student[key]
        ?? Object.entries(student).find(([k]) => k.toLowerCase() === key.toLowerCase())?.[1]
        ?? ""
      result = result.replace(placeholder, String(val))
    }
  }

  return result
}

/* ── mm to px conversion (96dpi) ── */
export const mmToPx = (mm: number) => mm * 3.7795275591

/* ── px to mm conversion ── */
export const pxToMm = (px: number) => px / 3.7795275591

/* ── Generate unique element ID ── */
export const genId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`

/* ── Default new element by type ── */
export function createDefaultElement(type: CardElement["type"]): CardElement {
  const base = { id: genId(), x: 10, y: 10, width: 30, height: 10, rotation: 0, visible: true, locked: false, opacity: 1 }
  switch (type) {
    case "text":    return { ...base, type, text: "Text", fontSize: 10, fontFamily: "Arial", color: "#000000", fontWeight: "normal", textAlign: "center" }
    case "image":   return { ...base, type, width: 20, height: 25, objectFit: "cover", borderRadius: 2 }
    case "barcode": return { ...base, type, width: 40, height: 12, barcodeType: "code128", barcodeValue: "{rollNo}", showText: true }
    case "qrcode":  return { ...base, type, width: 15, height: 15, qrValue: "{studentId}", qrErrorLevel: "M" }
    case "shape":   return { ...base, type, width: 40, height: 8, shapeType: "rectangle", backgroundColor: "#1d4ed8", borderRadius: 2 }
    case "line":    return { ...base, type, width: 40, height: 1, shapeType: "line", borderColor: "#000000", borderWidth: 1 }
    default:        return { ...base, type }
  }
}