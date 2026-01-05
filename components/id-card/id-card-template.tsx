"use client"

import type { Student, SchoolSection } from "@/lib/types"

interface IDCardTemplateProps {
  student: Student
  school: SchoolSection
  showBack?: boolean
}

export function IDCardTemplate({ student, school, showBack = true }: IDCardTemplateProps) {
  return (
    <div className="id-card-wrapper w-60 text-[9px]">
      {/* Front Side */}
      <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-t-lg p-3">
        {/* School Header */}
        <div className="text-center border-b border-white/20 pb-2 mb-2">
          <div className="w-9 h-9 bg-white rounded-full mx-auto mb-1.5 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h3 className="font-bold text-[10px]">{school.tenantName}</h3>
          <p className="text-[7px] opacity-80 tracking-widest">STUDENT IDENTITY CARD</p>
        </div>

        {/* Student Photo */}
        <div className="text-center mb-2">
          <div className="w-14 h-16 bg-white rounded mx-auto mb-1.5 overflow-hidden border-2 border-white/30">
            <img
              src={student.photo || "/placeholder.svg?height=64&width=56&query=student portrait"}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-sm font-bold">{student.fullName}</h4>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-white/15 rounded px-2 py-1.5 text-center">
            <p className="opacity-75 text-[7px]">Class & Div</p>
            <p className="font-semibold">
              {student.className} - {student.divisionName}
            </p>
          </div>
          <div className="bg-white/15 rounded px-2 py-1.5 text-center">
            <p className="opacity-75 text-[7px]">Roll Number</p>
            <p className="font-semibold">{student.rollNo}</p>
          </div>
          <div className="bg-white/15 rounded px-2 py-1.5 text-center">
            <p className="opacity-75 text-[7px]">Blood Group</p>
            <p className="font-semibold text-yellow-300">{student.bloodGroup}</p>
          </div>
          <div className="bg-white/15 rounded px-2 py-1.5 text-center">
            <p className="opacity-75 text-[7px]">Date of Birth</p>
            <p className="font-semibold">
              {new Date(student.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Back Side */}
      {showBack && (
        <div className="bg-slate-50 rounded-b-lg p-3">
          <h5 className="font-bold text-primary text-[9px] mb-1.5">{school.tenantName}</h5>

          <div className="space-y-1 text-muted-foreground text-[8px] mb-2">
            <div className="flex items-start gap-1.5">
              <svg
                className="w-2.5 h-2.5 mt-0.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="leading-tight">{school.tenantAddress}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-2.5 h-2.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
              </svg>
              <span>{school.tenantPhone}</span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center gap-2 py-2 border-t border-b border-border mb-2">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="3" height="3" />
                <rect x="18" y="14" width="3" height="3" />
                <rect x="14" y="18" width="3" height="3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-[8px]">Emergency Contact</p>
              <p className="text-muted-foreground truncate">{student.parentName}</p>
              <p className="text-muted-foreground">{student.emergencyContact}</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="flex justify-between">
            <div className="text-center">
              <div className="w-12 border-b border-primary mb-1" />
              <p className="text-[7px] text-muted-foreground">Parent Sign</p>
            </div>
            <div className="text-center">
              <div className="w-12 border-b border-primary mb-1" />
              <p className="text-[7px] text-muted-foreground">Principal Sign</p>
            </div>
          </div>

          <p className="text-center text-[6px] text-muted-foreground mt-2">
            ID: {student.id} | Powered by School ID Management System
          </p>
        </div>
      )}
    </div>
  )
}

// Print-optimized version with fixed dimensions
export function IDCardPrintTemplate({ student, school }: IDCardTemplateProps) {
  return (
    <div style={{ width: "240px", pageBreakInside: "avoid", breakInside: "avoid" }}>
      <IDCardTemplate student={student} school={school} />
    </div>
  )
}
