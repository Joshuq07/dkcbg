// Shared types for box logic

export type BoxEntry = {
  session_id: string
  level: number
  box_type: string
  user_email: string
  value: string | null
  star: boolean | null
  lost: boolean | null
}
