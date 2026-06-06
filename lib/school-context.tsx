"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/lib/api";
import { filterSchoolsByRole, filterStudentsByRole } from "@/lib/auth";

interface SchoolContextType {
  schools: any[];
  assignedSchoolIds: number[];
  reloadSchools: () => void;
}

const SchoolContext = createContext<SchoolContextType>({
  schools: [],
  assignedSchoolIds: [],
  reloadSchools: () => {},
});

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<any[]>([]);
  const [assignedSchoolIds, setAssignedSchoolIds] = useState<number[]>([]);

  const loadSchools = async () => {
    try {
      const data = await fetch(`${BASE_URL}/School/list`).then(r => r.json());
      const filtered = filterSchoolsByRole(data || []);
      setSchools(filtered);
      setAssignedSchoolIds(filtered.map((s: any) => s.schoolId));
    } catch {}
  };

  useEffect(() => { loadSchools(); }, []);

  return (
    <SchoolContext.Provider value={{ schools, assignedSchoolIds, reloadSchools: loadSchools }}>
      {children}
    </SchoolContext.Provider>
  );
}

export const useSchools = () => useContext(SchoolContext);