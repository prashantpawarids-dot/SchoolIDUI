// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Bell,
//   ChevronDown,
//   LogOut,
//   Settings,
//   User,
//   GraduationCap,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import LogoImage from "@/asset/logo2.jpeg"; // adjust the path if needed
// import Image from "next/image";
// interface NavbarProps {
//   userRole?: string;
// }

// interface UserDetails {
//   firstName: string;
//   middleName?: string;
//   lastName: string;
//   email: string;
//   schoolId: number;
//   roleId: number;
// }

// interface School {
//   schoolId: number;
//   schoolName: string;
// }

// export function Navbar({ userRole = "Admin" }: NavbarProps) {
//   const router = useRouter();
//   const [userInitial, setUserInitial] = useState("U");
//   const [userName, setUserName] = useState(userRole); // fallback to role
//   const [userEmail, setUserEmail] = useState("");
//   const [schoolName, setSchoolName] = useState("ID Card Management System");
//   const [roleId, setRoleId] = useState<number>(0);

//   useEffect(() => {
//     const roleId = localStorage.getItem("roleId"); // string
//     const userId = localStorage.getItem("userId");
//     const schoolId = localStorage.getItem("schoolId");

//     if (!userId || !roleId) return;

//     const fetchUserData = async () => {
//       try {
//         // Fetch user details
//         const resUser = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/userdetails/${userId}`
//         );
//         if (!resUser.ok) throw new Error("Failed to fetch user");
//         const userData = await resUser.json();

//         const fullName = `${userData.firstName} ${userData.lastName}`.trim();
//         setUserName(fullName);
//         setUserInitial(fullName.charAt(0));
//         setUserEmail(userData.email);

//         // Only fetch school name for Parent (2) or School (4)
//         if (roleId === "2" || roleId === "4") {
//           const resSchool = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/School/list`
//           );
//           if (!resSchool.ok) throw new Error("Failed to fetch schools");
//           const schools = await resSchool.json();

//           const school = schools.find(
//             (s: any) => s.schoolId.toString() === schoolId
//           );
//           if (school) setSchoolName(school.schoolName);
//         }
//       } catch (err) {
//         console.error("Navbar fetch error:", err);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     router.push("/login");
//   };

//   const roleColors: Record<string, string> = {
//     Admin: "bg-primary",
//     Parent: "bg-accent",
//     Partner: "bg-green-600",
//     School: "bg-blue-600",
//   };

//   const displayedRole =
//     roleId === 2 ? "Parent" : roleId === 4 ? "School" : userRole;

//   return (
//     <nav className="bg-card border-b border-border sticky top-0 z-50">
//       <div className="h-16 px-6 flex items-center justify-between">
//         {/* Logo / School */}
//         <div className="flex items-center gap-3">
//           <div className="w-20 h-20 flex items-center justify-center mb-3">
//             <Image
//               src={LogoImage}
//               alt="Logo"
//               width={60}
//               height={40}
//               className="object-contain rounded-xl border-2 border-gray-300"
//             />
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-foreground">
//               IDS ID SMART TECH
//             </h1>
//             <p className="text-xs text-muted-foreground">{schoolName}</p>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center gap-4">
//           {/* Notifications */}
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="w-5 h-5 text-muted-foreground" />
//             <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
//               3
//             </span>
//           </Button>

//           {/* User Menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="flex items-center gap-2 h-10 px-3">
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback
//                     className={`${
//                       roleColors[displayedRole] || "bg-primary"
//                     } text-white text-sm`}>
//                     {userInitial}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="hidden md:block text-left">
//                   <p className="text-sm font-medium">{userName}</p>
//                   <p className="text-xs text-muted-foreground">
//                     {displayedRole}
//                   </p>
//                 </div>
//                 <ChevronDown className="w-4 h-4 text-muted-foreground" />
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-56">
//               <div className="px-3 py-2 border-b border-border">
//                 <p className="font-medium">{userName}</p>
//                 <p className="text-xs text-muted-foreground">{userEmail}</p>
//                 <Badge
//                   className={`mt-2 ${roleColors[displayedRole]} text-white`}>
//                   {displayedRole}
//                 </Badge>
//               </div>

//               <DropdownMenuItem className="cursor-pointer">
//                 <User className="w-4 h-4 mr-2" /> Profile
//               </DropdownMenuItem>

//               <DropdownMenuItem className="cursor-pointer">
//                 <Settings className="w-4 h-4 mr-2" /> Settings
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="cursor-pointer text-destructive focus:text-destructive">
//                 <LogOut className="w-4 h-4 mr-2" /> Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LogoImage from "@/asset/logo2.jpeg"; // Default logo
import Image from "next/image";

interface NavbarProps {
  userRole?: string;
}

export function Navbar({ userRole = "Admin" }: NavbarProps) {
  const router = useRouter();
  const [userInitial, setUserInitial] = useState("U");
  const [userName, setUserName] = useState(userRole);
  const [userEmail, setUserEmail] = useState("");
  const [schoolName, setSchoolName] = useState("ID Card Management System");
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number>(0);
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL = "/api/proxy";
  // useEffect(() => {
  //   const roleIdStr = localStorage.getItem("roleId");
  //   const userId = localStorage.getItem("userId");
  //   const schoolId = localStorage.getItem("schoolId");

  //   if (!userId || !roleIdStr) return;

  //   const roleIdNum = parseInt(roleIdStr, 10);
  //   setRoleId(roleIdNum);

  //   const fetchUserData = async () => {
  //     try {
  //       // Fetch user details
  //       const resUser = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/userdetails/${userId}`
  //       );
  //       if (!resUser.ok) throw new Error("Failed to fetch user");
  //       const userData = await resUser.json();

  //       const fullName = `${userData.firstName} ${userData.lastName}`.trim();
  //       setUserName(fullName);
  //       setUserInitial(fullName.charAt(0));
  //       setUserEmail(userData.email);

  //       // Only fetch school info for Parent or School users
  //       if (roleIdNum === 2 || roleIdNum === 4) {
  //         const resSchool = await fetch(
  //           `${process.env.NEXT_PUBLIC_API_BASE_URL}/School/list`
  //         );
  //         if (!resSchool.ok) throw new Error("Failed to fetch schools");
  //         const schools = await resSchool.json();

  //         const school = schools.find(
  //           (s: any) => s.schoolId.toString() === schoolId
  //         );

  //         if (school) {
  //           setSchoolName(school.schoolName);
  //           if (school.schoolLogo) {
  //             setSchoolLogo(`data:image/jpeg;base64,${school.schoolLogo}`);
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Navbar fetch error:", err);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
  const roleIdStr = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");
  const schoolId = localStorage.getItem("schoolId");

  if (!userId || !roleIdStr) return;

  const roleIdNum = parseInt(roleIdStr, 10);
  setRoleId(roleIdNum);

  const fetchUserData = async () => {
    try {
      // Fetch user details via proxy
      const resUser = await fetch(`${BASE_URL}/Auth/userdetails/${userId}`);
      const textUser = await resUser.text();

      // Check for HTML response
      if (textUser.trim().startsWith("<")) {
        console.error("Navbar fetch returned HTML instead of JSON:", textUser);
        return;
      }

      const userData = JSON.parse(textUser);

      const fullName = `${userData.firstName} ${userData.lastName}`.trim();
      setUserName(fullName);
      setUserInitial(fullName.charAt(0));
      setUserEmail(userData.email);

      // Only fetch school info for Parent or School users
      if (roleIdNum === 2 || roleIdNum === 4) {
        const resSchool = await fetch(`${BASE_URL}/School/list`);
        const textSchool = await resSchool.text();

        if (textSchool.trim().startsWith("<")) {
          console.error("School fetch returned HTML instead of JSON:", textSchool);
          return;
        }

        const schools = JSON.parse(textSchool);
        const school = schools.find(
          (s: any) => s.schoolId.toString() === schoolId
        );

        if (school) {
          setSchoolName(school.schoolName);
          if (school.schoolLogo) {
            setSchoolLogo(`data:image/jpeg;base64,${school.schoolLogo}`);
          }
        }
      }
    } catch (err) {
      console.error("Navbar fetch error:", err);
    }
  };

  fetchUserData();
}, []);


  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const roleColors: Record<string, string> = {
    Admin: "bg-primary",
    Parent: "bg-accent",
    Partner: "bg-green-600",
    School: "bg-blue-600",
  };

  const displayedRole =
    roleId === 2 ? "Parent" : roleId === 4 ? "School" : userRole;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Logo / School */}
        <div className="flex items-center gap-3">
          {/* <div className="w-20 h-20 flex items-center justify-center mb-0">
            <Image
              src={schoolLogo || LogoImage} // Dynamic logo
              alt={schoolName}
              width={60}
              height={58}
              className="object-contain rounded-xl border-2 border-gray-300"
            />
          </div> */}
          <div>
            <h1 className="text-lg font-bold text-foreground">{schoolName}</h1>
            {/* <p className="text-xs text-muted-foreground">{schoolName}</p> */}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-10 px-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback
                    className={`${
                      roleColors[displayedRole] || "bg-primary"
                    } text-white text-sm`}>
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {displayedRole}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
                <Badge
                  className={`mt-2 ${roleColors[displayedRole]} text-white`}>
                  {displayedRole}
                </Badge>
              </div>

              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
