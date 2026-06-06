"use client";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { School, User, CheckCircle, XCircle, Plus } from "lucide-react";

interface Admin {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface School {
  schoolId: number;
  schoolName: string;
}

interface Assignment {
  mapId: number;
  userId: number;
  schoolId: number;
}

export default function AssignSchoolsPage() {
  const [admins, setAdmins]           = useState<Admin[]>([]);
  const [schools, setSchools]         = useState<School[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selAdmin, setSelAdmin]       = useState<Admin | null>(null);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      // Load all admins (roleId=1 is Admin in old system)
      const usersRes = await fetch(`${BASE_URL}/Auth/users`).then(r => r.json());
      const adminUsers = (usersRes || []).filter((u: any) => u.roleId === 1);

      // Load personal details for names
      const detailsRes = await fetch(`${BASE_URL}/Auth/userdetails`).then(r => r.json());

      const adminsWithNames = adminUsers.map((u: any) => {
        const detail = (detailsRes || []).find((d: any) => d.userId === u.userId);
        return {
          userId:    u.userId,
          username:  u.username,
          firstName: detail?.firstName ?? "",
          lastName:  detail?.lastName  ?? "",
          email:     detail?.email     ?? "",
        };
      });
      setAdmins(adminsWithNames);

      // Load all schools (SuperAdmin sees all)
      const schoolsRes = await fetch(`${BASE_URL}/School/list`).then(r => r.json());
      setSchools(schoolsRes || []);

      // Load assignments
      const assignRes = await fetch(`${BASE_URL}/Auth/schoolassignments`).then(r => r.json());
      setAssignments(assignRes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const isAssigned = (userId: number, schoolId: number) =>
    assignments.some(a => a.userId === userId && a.schoolId === schoolId);

  const toggleAssignment = async (admin: Admin, school: School) => {
    setLoading(true);
    setMsg("");
    try {
      if (isAssigned(admin.userId, school.schoolId)) {
        // Unassign
        await fetch(`${BASE_URL}/Auth/unassignschool`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: admin.userId, schoolId: school.schoolId }),
        });
        setAssignments(prev => prev.filter(a =>
          !(a.userId === admin.userId && a.schoolId === school.schoolId)
        ));
        setMsg(`✅ Unassigned ${school.schoolName} from ${admin.firstName || admin.username}`);
      } else {
        // Assign
        await fetch(`${BASE_URL}/Auth/assignschool`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: admin.userId, schoolId: school.schoolId }),
        });
        setAssignments(prev => [...prev, {
          mapId: Date.now(),
          userId: admin.userId,
          schoolId: school.schoolId
        }]);
        setMsg(`✅ Assigned ${school.schoolName} to ${admin.firstName || admin.username}`);
      }
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("❌ Failed to update assignment");
    } finally {
      setLoading(false);
    }
  };

  const getAdminSchools = (userId: number) =>
    schools.filter(s => isAssigned(userId, s.schoolId));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign Schools to Admins"
        description="SuperAdmin can assign or unassign schools to admin users"
      />

      {msg && (
        <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Admin List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" /> Admin Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {admins.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No admin users found</p>
            )}
            {admins.map(admin => (
              <div
                key={admin.userId}
                onClick={() => setSelAdmin(admin)}
                className={`p-3 rounded-lg cursor-pointer border transition-all ${
                  selAdmin?.userId === admin.userId
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                }`}>
                <p className="font-medium text-sm">
                  {admin.firstName || admin.lastName
                    ? `${admin.firstName} ${admin.lastName}`.trim()
                    : admin.username}
                </p>
                <p className="text-xs text-slate-400">{admin.username}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {getAdminSchools(admin.userId).length === 0
                    ? <span className="text-[10px] text-slate-400">No schools assigned</span>
                    : getAdminSchools(admin.userId).map(s => (
                      <Badge key={s.schoolId} variant="secondary" className="text-[10px]">
                        {s.schoolName}
                      </Badge>
                    ))
                  }
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* School Assignment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <School className="w-4 h-4" />
              {selAdmin
                ? `Schools for: ${selAdmin.firstName || selAdmin.username}`
                : "Select an admin to assign schools"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selAdmin ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                <User className="w-16 h-16 mb-3" />
                <p className="text-sm">Click an admin on the left to manage their schools</p>
              </div>
            ) : (
              <div className="space-y-2">
                {schools.map(school => {
                  const assigned = isAssigned(selAdmin.userId, school.schoolId);
                  return (
                    <div key={school.schoolId}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        assigned
                          ? "border-green-300 bg-green-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}>
                      <div className="flex items-center gap-3">
                        {assigned
                          ? <CheckCircle className="w-5 h-5 text-green-500" />
                          : <XCircle className="w-5 h-5 text-slate-300" />
                        }
                        <div>
                          <p className="font-medium text-sm">{school.schoolName}</p>
                          <p className="text-xs text-slate-400">ID: {school.schoolId}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={assigned ? "destructive" : "default"}
                        disabled={loading}
                        onClick={() => toggleAssignment(selAdmin, school)}
                        className={assigned ? "" : "bg-green-600 hover:bg-green-700 text-white"}>
                        {assigned ? "Unassign" : "Assign"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}