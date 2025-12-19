'use client'

import { Habit } from '@prisma/client'
import { cn } from '@/lib/utils'
import { MaterialSymbolsOutlined } from './MaterialSymbols'
import HabitToggle from './HabitToggle'

interface HabitCardProps {
  habit: Habit & {
    logs?: { date: Date; completed: boolean }[]
    streak?: number
    isCompletedToday?: boolean
  }
  showStreak?: boolean
}

export default function HabitCard({
  habit,
  showStreak = true,
}: HabitCardProps) {
  const toggleHabit = async (habitId: string, completed: boolean) => {
    const response = await fetch(`/api/habits/${habitId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    })
    if (!response.ok) {
      throw new Error('Failed to toggle habit')
    }
  }
  const icon = habit.icon || '⭐'
  const color = habit.color || '#54A0FF'

  return (
    <div
      className={cn(
        'group flex items-center gap-4 bg-card-bg p-4 pr-5 rounded-2xl shadow-soft hover:shadow-md transition-all duration-200 border-l-4',
        {
          'opacity-70': !habit.isActive,
        }
      )}
      style={{ borderLeftColor: color }}
    >
      <div
        className="flex-shrink-0 size-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-text-dark font-bold text-base font-display truncate">
          {habit.name}
        </h3>
        {showStreak && habit.streak !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <MaterialSymbolsOutlined
              name="local_fire_department"
              className="text-primary text-[16px] fill-1"
            />
            <span className="text-text-light text-xs font-semibold">
              {habit.streak} Day Streak
            </span>
          </div>
        )}
      </div>
      <HabitToggle
        habitId={habit.id}
        isCompleted={habit.isCompletedToday || false}
        onToggle={toggleHabit}
      />
    </div>
  )
}

