// Mock API endpoint for login
export async function loginUser(username: string, password: string, role: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        token: "mock-token",
        role,
        user: { username, role },
      })
    }, 500)
  })
}
