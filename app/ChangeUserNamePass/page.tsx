"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Search, KeyRound, User, ShieldCheck } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

const ROLE_LABELS: Record<number, string> = {
  1: "Admin", 2: "Parent", 3: "Partner", 4: "School",
}

const ROLE_COLORS: Record<number, string> = {
  1: "bg-purple-100 text-purple-700",
  2: "bg-green-100 text-green-700",
  3: "bg-gray-100 text-gray-600",
  4: "bg-blue-100 text-blue-700",
}

export default function ChangeCredentialsPage() {
  const router = useRouter()

  const [loggedInSchoolId, setLoggedInSchoolId] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSchool, setIsSchool] = useState(false)
  const [isParent, setIsParent] = useState(false)
  const [loggedInUserId, setLoggedInUserId] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const roleId = Number(localStorage.getItem("roleId"))
    const schoolId = Number(localStorage.getItem("schoolId"))
    const userId = Number(localStorage.getItem("userId"))
    setLoggedInSchoolId(schoolId)
    setLoggedInUserId(userId)
    setIsAdmin(roleId === 1)
    setIsSchool(roleId === 4)
    setIsParent(roleId === 2)
    setMounted(true)
  }, [])

  const [schools, setSchools] = useState<any[]>([])
  const [filterSchool, setFilterSchool] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!mounted || !isAdmin) return
    fetch(`${API_BASE}/School/list`)
      .then(r => r.json())
      .then(setSchools)
      .catch(console.error)
  }, [mounted, isAdmin])

  useEffect(() => {
    if (!mounted || isParent) return
    const url = isAdmin
      ? filterSchool !== "all"
        ? `${API_BASE}/Auth/users/school/${filterSchool}`
        : `${API_BASE}/Auth/users`
      : `${API_BASE}/Auth/users/school/${loggedInSchoolId}`
    fetch(url)
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error)
  }, [mounted, filterSchool, isAdmin, isSchool, isParent, loggedInSchoolId])

  // Parent — load own user
  useEffect(() => {
    if (!mounted || !isParent || !loggedInUserId) return
    fetch(`${API_BASE}/Auth/user/${loggedInUserId}`)
      .then(r => { if (!r.ok) return null; return r.json() })
      .then(u => { if (u) { setSelectedUser(u); setNewUsername(u.username) } })
      .catch(console.error)
  }, [mounted, isParent, loggedInUserId])

  if (!mounted) return null

  const filteredUsers = users.filter(u => {
    const matchSearch = u.username?.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === "all" || u.roleId?.toString() === filterRole
    const matchSchool = isSchool ? u.schoolId === loggedInSchoolId : true
    return matchSearch && matchRole && matchSchool
  })

  const handleSelectUser = (user: any) => {
    setSelectedUser(user)
    setNewUsername(user.username)
    setNewPassword("")
    setConfirmPassword("")
    setMessage("")
    setIsError(false)
  }

  const handleSave = async () => {
    if (!selectedUser) return
    if (!newUsername.trim()) { setMessage("Username cannot be empty"); setIsError(true); return }
    if (newPassword && newPassword !== confirmPassword) {
      setMessage("Passwords do not match"); setIsError(true); return
    }
    if (newUsername === selectedUser.username && !newPassword) {
      setMessage("No changes made"); setIsError(true); return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/Auth/change-credentials/${selectedUser.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername: newUsername || null,
          newPassword: newPassword || null,
        }),
      })
      const data = await res.json()
      setMessage(data.message)
      setIsError(!data.success)
      if (data.success) {
        setUsers(prev => prev.map(u =>
          u.userId === selectedUser.userId ? { ...u, username: newUsername } : u
        ))
        setSelectedUser((prev: any) => ({ ...prev, username: newUsername }))
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch {
      setMessage("Failed to update credentials")
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => router.back()}>← Back</Button>
        <div>
          <h1 className="text-2xl font-bold">Change User Credentials</h1>
          <p className="text-sm text-muted-foreground">
            {isParent ? "Update your own login details" : "Search and update user login details"}
          </p>
        </div>
      </div>

      {/* Admin filters */}
      {isAdmin && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-1.5 block">School</Label>
                <Select value={filterSchool} onValueChange={v => {
                  setFilterSchool(v); setSelectedUser(null); setSearch("")
                }}>
                  <SelectTrigger><SelectValue placeholder="All Schools" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Schools</SelectItem>
                    {schools.map(s => (
                      <SelectItem key={s.schoolId} value={s.schoolId.toString()}>
                        {s.schoolName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Role</Label>
                <Select value={filterRole} onValueChange={v => {
                  setFilterRole(v); setSelectedUser(null)
                }}>
                  <SelectTrigger><SelectValue placeholder="All Roles" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">Parent</SelectItem>
                    <SelectItem value="4">School</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className={`grid gap-6 ${isParent ? "grid-cols-1 max-w-lg mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>

        {/* User list */}
        {(isAdmin || isSchool) && (
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-primary" /> Select User
              </CardTitle>
              {isSchool && (
                <p className="text-xs text-muted-foreground">Showing your school users only</p>
              )}
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {/* Search for school */}
              {isSchool && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              )}

              <div className="max-h-80 overflow-y-auto border rounded-lg divide-y">
                {filteredUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                    <User className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((u: any) => (
                    <div
                      key={u.userId}
                      onClick={() => handleSelectUser(u)}
                      className={`px-4 py-3 cursor-pointer text-sm
                        flex justify-between items-center transition-all
                        hover:bg-muted/50
                        ${selectedUser?.userId === u.userId
                          ? "bg-primary/5 border-l-4 border-primary font-semibold"
                          : "border-l-4 border-transparent"}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold uppercase">
                          {u.username?.[0] || "?"}
                        </div>
                        <span>{u.username}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.roleId] || "bg-gray-100 text-gray-600"}`}>
                        {ROLE_LABELS[u.roleId] || "Unknown"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <p className="text-xs text-muted-foreground text-right">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit form */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="w-4 h-4 text-primary" />
              {isParent
                ? "My Login Details"
                : selectedUser
                  ? `Editing: ${selectedUser.username}`
                  : "Update Credentials"}
            </CardTitle>
            {selectedUser && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[selectedUser.roleId] || ""}`}>
                  {ROLE_LABELS[selectedUser.roleId] || ""}
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            {!selectedUser && !isParent ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <ShieldCheck className="w-10 h-10 opacity-20" />
                <p className="text-sm">Select a user from the list to edit</p>
              </div>
            ) : (
              <>
                {message && (
                  <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg border
                    ${isError
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-green-50 text-green-700 border-green-200"}`}>
                    <span>{isError ? "⚠️" : "✅"}</span>
                    <span>{message}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Username
                  </Label>
                  <Input
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Enter username"
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" /> New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="h-10 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:underline">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {newPassword && (
                  <div className="space-y-1.5">
                    <Label>Confirm Password</Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className={`h-10 ${confirmPassword && newPassword !== confirmPassword
                        ? "border-red-400 focus-visible:ring-red-300"
                        : confirmPassword && newPassword === confirmPassword
                          ? "border-green-400 focus-visible:ring-green-300"
                          : ""}`}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500">⚠ Passwords do not match</p>
                    )}
                    {confirmPassword && newPassword === confirmPassword && (
                      <p className="text-xs text-green-600">✓ Passwords match</p>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  💡 Leave password blank to keep it unchanged
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 h-10">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  {!isParent && (
                    <Button
                      variant="outline"
                      className="h-10"
                      onClick={() => {
                        setSelectedUser(null)
                        setNewUsername("")
                        setNewPassword("")
                        setConfirmPassword("")
                        setMessage("")
                      }}>
                      Clear
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}