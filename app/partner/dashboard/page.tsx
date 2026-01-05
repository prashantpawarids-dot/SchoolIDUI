"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Eye, Users, BookOpen, GraduationCap, Filter, User, Phone, MapPin, Droplet, Calendar } from "lucide-react"
import type { Student, Class } from "@/lib/types"



// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL = "/api/proxy";



export default function PartnerDashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState<string>("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  function mapAppStatus(status: string): "Approved" | "Rejected" | "Pending" {
    if (status === "accept") return "Approved"
    if (status === "reject") return "Rejected"
    return "Pending"
  }

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`${BASE_URL}/Student/getall`)
        const allStudents: any[] = await res.json()

        const studentsWithStatus: Student[] = await Promise.all(
          allStudents.map(async (s: any) => {
            try {
              const appRes = await fetch(`${BASE_URL}/Student/applications/student/${s.studentId}`)
              const appData = await appRes.json()

              if (appData.length > 0) {
                const firstApp = appData[0]
                return { ...s, status: mapAppStatus(firstApp.status), createdOn: new Date(firstApp.createdOn) } as Student
              }

              return { ...s, status: "Pending" } as Student
            } catch {
              return { ...s, status: "Pending" } as Student
            }
          })
        )

        setStudents(studentsWithStatus)
      } catch (err) {
        console.error(err)
      }

      try {
        const classRes = await fetch(`${BASE_URL}/ClassDivision/getclasses`)
        const classData: Class[] = await classRes.json()
        setClasses(classData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo?.includes(searchTerm)
    const matchesClass = filterClass === "all" || s.classId?.toString() === filterClass
    return matchesSearch && matchesClass
  })

  const stats = [
    { icon: Users, label: "Total Students", value: students.length, color: "bg-primary" },
    { icon: BookOpen, label: "Total Classes", value: classes.length, color: "bg-accent" },
    { icon: GraduationCap, label: "Approved IDs", value: students.filter((s) => s.status === "Approved").length, color: "bg-green-600" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Partner Dashboard" description="View and access student information" />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="shadow-lg border-0">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.classId} value={cls.classId.toString()}>{cls.className}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>Showing {filteredStudents.length} students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Dialog key={student.studentId || student.rollNo}>
                <DialogTrigger asChild>
                  <div
                    onClick={() => setSelectedStudent(student)}
                    className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {student.photoPath ? (
                          <img src={student.photoPath} alt={student.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">{student.className} - {student.divisionName}</p>
                        <p className="text-xs text-muted-foreground mt-1">Roll: {student.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                      <Badge
                        variant="outline"
                        className={
                          student.status === "Approved"
                            ? "border-green-500 text-green-600"
                            : student.status === "Rejected"
                            ? "border-red-500 text-red-600"
                            : "border-amber-500 text-amber-600"
                        }
                      >
                        {student.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>

                {/* Dialog content rendered only on client */}
                {isClient && selectedStudent?.studentId === student.studentId && (
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Student Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {selectedStudent.photoPath ? (
                            <img
                              src={selectedStudent.photoPath}
                              alt={selectedStudent.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-10 h-10 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{selectedStudent.fullName}</h3>
                          <p className="text-muted-foreground">{selectedStudent.className} - Division {selectedStudent.divisionName}</p>
                          <Badge className="mt-2 bg-green-500">{selectedStudent.status}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border text-sm">
                        <div><span className="font-medium">First Name:</span> {selectedStudent.firstName}</div>
                        <div><span className="font-medium">Last Name:</span> {selectedStudent.lastName}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> DOB: {new Date(selectedStudent.dob).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><Droplet className="w-4 h-4 text-muted-foreground" /> Blood Group: {selectedStudent.bloodGroup}</div>
                        <div className="flex items-center gap-2 col-span-2"><Phone className="w-4 h-4 text-muted-foreground" /> Parent Phone: {selectedStudent.parentPhone}</div>
                        <div className="flex items-start gap-2 col-span-2"><MapPin className="w-4 h-4 text-muted-foreground mt-0.5" /> Address: {selectedStudent.address}</div>
                        <div className="flex items-center gap-2 col-span-2"><span className="font-medium">School Name:</span> {selectedStudent.schoolName}</div>
                        <div><span className="font-medium">Roll No:</span> {selectedStudent.rollNo}</div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">Parent/Guardian</p>
                        <p className="font-medium">{selectedStudent.parentName}</p>
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No students found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
