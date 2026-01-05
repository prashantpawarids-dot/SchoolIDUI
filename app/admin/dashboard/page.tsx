"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
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

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL ="/api/proxy";



export default function AdminDashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalSchools, setTotalSchools] = useState(0);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);

  useEffect(() => {
    // Fetch all students
    fetch(`${BASE_URL}/Student/getall`)
      .then((res) => res.json())
      
      .then(async (students: any[]) => {
        setTotalStudents(students.length);

        const pendingStudents: any[] = [];

        for (const s of students) {
          const appRes = await fetch(
            `${BASE_URL}/Student/applications/student/${s.studentId}`
          );
          const appData = await appRes.json();

          // Only include pending applications
          if (
            appData.length > 0 &&
            appData[0].status !== "accept" &&
            appData[0].status !== "reject"
          ) {
            pendingStudents.push({
              studentId: s.studentId,
              fullName: s.fullName,
              className: s.className,
              divisionName: s.divisionName,
              status: "Pending",
              createdOn: new Date(appData[0].createdOn),
              firstName: s.firstName,
              lastName: s.lastName,
            });
          }
        }

        // Sort by createdOn descending (latest first)
        pendingStudents.sort(
          (a, b) => b.createdOn.getTime() - a.createdOn.getTime()
        );

        // Take top 5 for dashboard
        setRecentStudents(pendingStudents.slice(0, 5));
      })
      .catch((err) => console.error(err));

    // Fetch all users and filter parents
    fetch(`${BASE_URL}/Auth/users`)
      .then((res) => res.json())
      .then((data) => {
        const parents = data.filter((u: any) => u.roleId === 2);
        setTotalParents(parents.length);
      })
      .catch((err) => console.error(err));

    // Fetch all classes
    fetch(`${BASE_URL}/ClassDivision/getclasses`)
      .then((res) => res.json())
      .then((data) => setTotalClasses(data.length))
      .catch((err) => console.error(err));

    // Fetch all schools
    fetch(`${BASE_URL}/School/list`)
      .then((res) => res.json())
      .then((data) => setTotalSchools(data.length))
      .catch((err) => console.error(err));
  }, []);

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
      label: "Export Data",
      description: "Download reports & archives",
      icon: Download,
      color: "bg-green-600",
    },
    {
      id: "school-settings",
      href: "/admin/school",
      label: "School Settings",
      description: "Manage classes & divisions",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.id} href={action.href} passHref>
                <div className="p-4 border border-border rounded-xl hover:shadow-md hover:border-primary/30 cursor-pointer transition-all group">
                  <div
                    className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
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
        <CardHeader className="flex flex-row items-center justify-between">
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
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
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
                <Badge className="bg-amber-500">Pending</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
