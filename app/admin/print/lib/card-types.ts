export type ElementType = "text" | "image" | "barcode" | "qrcode" | "shape" | "line"

export interface CardElement {
  id: string
  type: ElementType
  x: number        // mm from left
  y: number        // mm from top
  width: number    // mm
  height: number   // mm
  rotation: number // degrees

  // Text specific
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: "normal" | "bold"
  fontStyle?: "normal" | "italic"
  color?: string
  textAlign?: "left" | "center" | "right"
  dataField?: string  // dynamic: "fullName" | "rollNo" | "className" etc

  // Image specific
  src?: string        // base64 or URL
  objectFit?: "cover" | "contain" | "fill"
  borderRadius?: number

  // Barcode specific
  barcodeType?: "code128" | "code39" | "ean13" | "upca"
  barcodeValue?: string
  showText?: boolean

  // QR specific
  qrValue?: string
  qrErrorLevel?: "L" | "M" | "Q" | "H"

  // Shape specific
  shapeType?: "rectangle" | "circle" | "line"
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number

  // Visibility
  visible?: boolean
  locked?: boolean
  opacity?: number
}

export interface CardTemplate {
  id: string
   dbId?: number 
  name: string
  schoolId?: number
  cardWidth: number   // mm (default 54)
  cardHeight: number  // mm (default 85.6)
  orientation: "portrait" | "landscape"
  backgroundColor: string
  backgroundImage?: string  // base64
  frontElements: CardElement[]
  backElements: CardElement[]
  createdOn?: string
  updatedOn?: string
}

export const DYNAMIC_FIELDS = [
  { label: "Full Name",       value: "fullName"       },
  { label: "First Name",      value: "firstName"      },
  { label: "Last Name",       value: "lastName"       },
  { label: "Roll Number",     value: "rollNo"         },
  { label: "Class",           value: "className"      },
  { label: "Division",        value: "divisionName"   },
  { label: "Date of Birth",   value: "dob"            },
  { label: "Blood Group",     value: "bloodGroup"     },
  { label: "School Name",     value: "schoolName"     },
  { label: "School Address",  value: "schoolAddress"  },
  { label: "Academic Year",   value: "academicYear"   },
  { label: "Student ID",      value: "studentId"      },
  { label: "Parent Name",     value: "parentName"     },
  { label: "Emergency Contact", value: "emergencyContact" },
]

export const CARD_SIZES = {
  CR80:    { width: 54,   height: 85.6,  label: "CR80 (Standard ID)"     },
  CR79:    { width: 53.9, height: 85.5,  label: "CR79"                   },
  CR100:   { width: 68.5, height: 99,    label: "CR100 (Large)"           },
  A6:      { width: 105,  height: 148,   label: "A6"                      },
  CUSTOM:  { width: 54,   height: 85.6,  label: "Custom"                  },
}