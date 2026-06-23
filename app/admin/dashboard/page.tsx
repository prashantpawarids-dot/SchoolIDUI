"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { useSchools } from "@/lib/school-context";
import { filterStudentsByRole, getAssignedSchoolIds, isSuperAdmin } from "@/lib/auth";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Users,
  UserCheck,
  BookOpen,
  Clock,
  ArrowRight,
  Printer,
  Download,
  Settings,
  TrendingUp,
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalSchools, setTotalSchools] = useState(0);

  const [recentStudents, setRecentStudents] = useState<any[]>([]);
const { schools } = useSchools();
  // =========================================
  // AUTH CHECK
  // =========================================
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const roleId = localStorage.getItem("roleId");

    if (!userId || !roleId) {
      router.push("/login");
      return;
    }

    setLoading(false);
  }, [router]);

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================
  useEffect(() => {
    if (loading) return;

    const fetchDashboardData = async () => {
      try {
        // =====================================
        // STUDENTS
        // =====================================
        const studentRes = await fetch(
          `${BASE_URL}/Student/getalwithstatus`
        );

        if (studentRes.ok) {
          const students = await studentRes.json();

          const studentArray = filterStudentsByRole(
  Array.isArray(students) ? students : students?.data || []
);
setTotalStudents(studentArray.length);

          const pendingStudents = studentArray
            .filter(
              (s: any) =>
                s.applicationStatus !== "accept" &&
                s.applicationStatus !== "reject"
            )
            .sort(
              (a: any, b: any) =>
                new Date(b.createdOn ?? 0).getTime() -
                new Date(a.createdOn ?? 0).getTime()
            )
            .slice(0, 5)
            .map((s: any) => ({
              studentId: s.studentId,
              fullName: s.fullName,
              className: s.className,
              divisionName: s.divisionName,
              status: "Pending",
              firstName: s.firstName,
              lastName: s.lastName,
            }));

          setRecentStudents(pendingStudents);
        }

        // =====================================
        // USERS
        // =====================================
        const usersRes = await fetch(`${BASE_URL}/Auth/users`);

        if (usersRes.ok) {
          const users = await usersRes.json();

          const usersArray = Array.isArray(users)
            ? users
            : users?.data || [];

          const ids = getAssignedSchoolIds();
const parents = isSuperAdmin()
  ? usersArray.filter((u: any) => u.roleId === 2)
  : usersArray.filter((u: any) => u.roleId === 2 && ids.includes(u.schoolId));
setTotalParents(parents.length);
        }

        // =====================================
        // CLASSES
        // =====================================
        const classRes = await fetch(
          `${BASE_URL}/ClassDivision/getclasses`
        );

        if (classRes.ok) {
          const classes = await classRes.json();

          const allClasses = Array.isArray(classes) ? classes : classes?.data || [];
const classArray = isSuperAdmin() ? allClasses : 
  allClasses.filter((c: any) => getAssignedSchoolIds().includes(c.schoolId));
setTotalClasses(classArray.length);
setTotalSchools(schools.length);
        }

       
      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    };

    fetchDashboardData();
  }, [loading,schools]);

  // =========================================
  // LOADING SCREEN
  // =========================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Dashboard...
      </div>
    );
  }

  // =========================================
  // STATS
  // =========================================
  const stats = [
    {
      id: "students",
      icon: <Users className="w-6 h-6" />,
      title: "Total Students",
      value: totalStudents.toString(),
      trend: "up" as const,
      trendPercent: 12,
    },
    {
      id: "parents",
      icon: <UserCheck className="w-6 h-6" />,
      title: "Active Parents",
      value: totalParents.toString(),
      trend: "up" as const,
      trendPercent: 8,
    },
    {
      id: "classes",
      icon: <BookOpen className="w-6 h-6" />,
      title: "Total Classes",
      value: totalClasses.toString(),
    },
    {
      id: "schools",
      icon: <Clock className="w-6 h-6" />,
      title: "Total Schools",
      value: totalSchools.toString(),
    },
  ];

  // =========================================
  // QUICK ACTIONS
  // =========================================
  const quickActions = [
    {
      id: "manage-students",
      href: "/admin/students",
      label: "Manage Students",
      description: "View & edit student data",
      icon: Users,
      color: "bg-primary",
    },
    {
      id: "print-id",
      href: "/admin/print",
      label: "Print ID Cards",
      description: "Generate & print ID cards",
      icon: Printer,
      color: "bg-accent",
    },
    {
      id: "export-data",
      href: "/admin/export",
      label: "Export Data & Import Student Data",
      description: "Download reports & archives",
      icon: Download,
      color: "bg-green-600",
    },
    {
      id: "school-management",
      href: "/admin/school",
      label: "School Manage and Academic Year ",
      description: "Manage classes & divisions",
      icon: Settings,
      color: "bg-purple-600",
    },
    {
      id: "import-data",
      href: "/admin/import",
      label: "import student Data",
      description: "Manage Student Data",
      icon: Settings,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Welcome back! Here's your school's overview."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>

          <CardDescription>
            Frequently used features
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.id} href={action.href} passHref>
                <div className="p-4 border border-border rounded-xl hover:shadow-md hover:border-primary/30 cursor-pointer transition-all group">
                  <div
                    className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </div>

                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>

                  <ArrowRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Pending Students */}
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Recent Pending Students</CardTitle>

            <CardDescription>
              Latest pending ID card applications
            </CardDescription>
          </div>

          <Link href="/admin/students">
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {recentStudents.map((student, idx) => (
              <div
                key={student.studentId ?? idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {student.firstName?.charAt(0)}
                      {student.lastName?.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium">{student.fullName}</p>

                    <p className="text-sm text-muted-foreground">
                      {student.className} - {student.divisionName}
                    </p>
                  </div>
                </div>

                <Badge className="bg-amber-500">
                  Pending
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}