// Production types for School ID Card System

export const ROLES = {
  ADMIN: 1,
  PARENT: 2,
  PARTNER: 3,
  SCHOOL:4
} as const

export type RoleId = (typeof ROLES)[keyof typeof ROLES]

export interface User {
  id: number
  username: string
  fullName: string
  email: string
  phone: string
  roleId: RoleId
  roleName: string
  isActive: boolean
  createdAt: string
}

export interface Student {
  id: number
  firstName: string
  middleName: string
  lastName: string
  fullName: string
  dob: string
  bloodGroup: string
  classId: number
  className: string
  divisionId: number
  divisionName: string
  rollNo: string
  address: string
  photoPath : string
  parentId: number
  parentName: string
  parentPhone: string
  emergencyContact: string
  status: "Approved" | "Pending" | "Rejected"
  rejectionReason?: string
  recordStatus: "A" | "D" | "U"
  createdAt: string
  schoolId: number
  academicYearId: number
  studentId:number,
  schoolName:string
}

export interface SchoolSection {
  id: number
  tenantName: string
  tenantAddress: string
  tenantPhone: string
  tenantEmail: string
  logoUrl: string
  recordStatus: "A" | "D"
  createdOn: string
}

export interface Class {
  classId: number
  className: string
  schoolId: number
  academicYearId: number
  recordStatus?: "A" | "D"
}


export interface Division {
  divisionId: number
  divisionName: string
  classId: number
  recordStatus: "A" | "D"
schoolId: number
}

// ✅ Add these new types
export interface School {
  schoolId: number
  schoolName: string
  schoolAddress?: string
  contactPerson?: string
  contactNumber?: string
}

export interface AcademicYear {
  academicYearId: number
  academicYear: string
}

interface AddStudentPayload {
  parentId: number
  schoolId: number   // required by your API but not in Student type
  academicYearId: number
  classId: number
  divisionId: number
  firstName: string
  middleName?: string
  lastName: string
  dob: string
  bloodGroup: string
  address: string
  photo?: string
}


export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  username: string
  password: string
  roleId: RoleId
}
