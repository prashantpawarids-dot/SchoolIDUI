// lib/api.ts
export const BASE_URL = "https://localhost:7135/api";

/* =====================================================
   SCHOOL APIs
===================================================== */
export const getSchools = async () => {
  const res = await fetch(`${BASE_URL}/School/list`);
  if (!res.ok) throw new Error("Failed to fetch schools");
  return res.json();
};

export const getAcademicYears = async (schoolId: number) => {
  const res = await fetch(`${BASE_URL}/School/academicyear/${schoolId}`);
  if (!res.ok) throw new Error("Failed to fetch academic years");
  return res.json();
};

/* =====================================================
   CLASS & DIVISION APIs
===================================================== */
export const getClasses = async (schoolId: number) => {
  const res = await fetch(
    `${BASE_URL}/ClassDivision/getclasses?schoolId=${schoolId}`
  );
  if (!res.ok) throw new Error("Failed to fetch classes");
  return res.json();
};

export const getDivisions = async (classId: number) => {
  const res = await fetch(
    `${BASE_URL}/ClassDivision/getdivisions?classId=${classId}`
  );
  if (!res.ok) throw new Error("Failed to fetch divisions");
  return res.json();
};

/* =====================================================
   STUDENT APIs
===================================================== */
export const getStudents = async () => {
  const res = await fetch(`${BASE_URL}/Student/getall`);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
};

export const getStudentApplications = async (studentId: number) => {
  const res = await fetch(
    `${BASE_URL}/Student/applications/student/${studentId}`
  );
  if (!res.ok) throw new Error("Failed to fetch student applications");
  return res.json();
};

/* =====================================================
   ACCEPTED STUDENTS (ELIGIBLE FOR ID CARD PRINT)
===================================================== */
export const getAcceptedStudentsForPrint = async () => {
  const students = await getStudents();

  const acceptedStudents: any[] = [];

  for (const student of students) {
    if (!student.studentId) continue;

    try {
      const applications = await getStudentApplications(student.studentId);

      if (!applications || applications.length === 0) continue;

      // Get latest application by createdOn
      const latestApplication = applications.sort(
        (a: any, b: any) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
      )[0];

      if (latestApplication.status === "accept") {
        acceptedStudents.push({
          ...student,
          applicationStatus: "accept",
          applicationDate: latestApplication.createdOn,
        });
      }
    } catch (error) {
      console.error(
        "Error fetching application for student:",
        student.studentId,
        error
      );
    }
  }

  return acceptedStudents;
};
