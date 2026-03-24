const API_SERVER = (process.env.NEXT_PUBLIC_API_BASE_URL || "")
  .replace("/api", "")

export function imgUrl(path?: string | null): string {
  if (!path) return "/placeholder.svg"
  if (path.startsWith("http"))      return path
  if (path.startsWith("/uploads/")) return `${API_SERVER}${path}`
  if (path.startsWith("data:"))     return path
  if (path.length > 100)            return `data:image/jpeg;base64,${path}`
  return "/placeholder.svg"
}