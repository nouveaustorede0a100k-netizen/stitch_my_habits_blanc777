import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getEndOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
  return new Date(d.setDate(diff))
}

export function getStartOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getStartOfYear(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 0, 1)
}

export function calculateStreak(logs: { date: Date }[]): number {
  if (logs.length === 0) return 0

  const sortedLogs = [...logs]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((log) => getStartOfDay(log.date))

  let streak = 0
  const today = getStartOfDay()
  let currentDate = today

  for (const logDate of sortedLogs) {
    const logDateStr = logDate.toDateString()
    const currentDateStr = currentDate.toDateString()

    if (logDateStr === currentDateStr) {
      streak++
      currentDate = new Date(currentDate)
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (logDateStr < currentDateStr) {
      break
    }
  }

  return streak
}

export function getCompletionRate(
  completed: number,
  total: number
): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

