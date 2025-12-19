'use client'

import { useState } from 'react'
import { MaterialSymbolsOutlined } from './MaterialSymbols'

interface HabitToggleProps {
  habitId: string
  isCompleted: boolean
  onToggle: (habitId: string, completed: boolean) => Promise<void>
}

export default function HabitToggle({
  habitId,
  isCompleted: initialCompleted,
  onToggle,
}: HabitToggleProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const newState = !isCompleted
      await onToggle(habitId, newState)
      setIsCompleted(newState)
    } catch (error) {
      console.error('Error toggling habit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <label className="custom-checkbox relative flex items-center justify-center cursor-pointer">
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleToggle}
        disabled={loading}
        className="sr-only"
      />
      <div className="w-8 h-8 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 transition-all duration-200 flex items-center justify-center group-hover:border-success">
        {isCompleted && (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </svg>
        )}
      </div>
    </label>
  )
}

