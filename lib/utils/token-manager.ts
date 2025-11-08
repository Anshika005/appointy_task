export function getAuthHeader(token: string | null) {
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export function verifyToken(token: string): boolean {
  try {
    const parts = token.split(".")
    return parts.length === 3
  } catch {
    return false
  }
}
