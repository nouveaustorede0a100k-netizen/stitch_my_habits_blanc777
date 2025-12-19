import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MaterialSymbolsOutlined } from '@/components/MaterialSymbols'
import { redirect } from 'next/navigation'
import { calculateStreak, getStartOfDay } from '@/lib/utils'

async function getStatisticsData(userId: string, period: string = '7d') {
  const today = getStartOfDay()
  let startDate = new Date(today)

  switch (period) {
    case '7d':
      startDate.setDate(today.getDate() - 7)
      break
    case '30d':
      startDate.setDate(today.getDate() - 30)
      break
    case '90d':
      startDate.setDate(today.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(today.getFullYear() - 1)
      break
  }

  const habits = await prisma.habit.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      logs: {
        where: {
          date: {
            gte: startDate,
          },
        },
      },
    },
  })

  const totalLogs = await prisma.habitLog.count({
    where: {
      userId,
      date: {
        gte: startDate,
      },
      completed: true,
    },
  })

  const habitsWithStats = habits.map((habit) => {
    const logs = habit.logs.map((log) => ({
      date: log.date,
      completed: log.completed,
    }))
    const streak = calculateStreak(logs)
    const completedCount = logs.filter((l) => l.completed).length
    const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const completionRate = totalDays > 0 ? (completedCount / totalDays) * 100 : 0

    return {
      ...habit,
      streak,
      completionRate: Math.round(completionRate),
    }
  })

  const sortedHabits = [...habitsWithStats].sort(
    (a, b) => b.completionRate - a.completionRate
  )

  const overallCompletionRate =
    habitsWithStats.length > 0
      ? Math.round(
          habitsWithStats.reduce((sum, h) => sum + h.completionRate, 0) /
            habitsWithStats.length
        )
      : 0

  const longestStreak = Math.max(...habitsWithStats.map((h) => h.streak), 0)

  return {
    habits: sortedHabits.slice(0, 5),
    stats: {
      completionRate: overallCompletionRate,
      longestStreak,
      totalCompleted: totalLogs,
      totalHabits: habits.length,
    },
  }
}

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const period = searchParams.period || '7d'
  const data = await getStatisticsData(session.user.id, period)

  const periodLabels: Record<string, string> = {
    '7d': '7 Jours',
    '30d': '30 Jours',
    '90d': '90 Jours',
    '1y': '1 An',
  }

  const habitColors = [
    { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', gradient: 'from-purple-400 to-purple-600' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-400 to-blue-600' },
    { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', gradient: 'from-yellow-400 to-yellow-500' },
    { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', gradient: 'from-pink-400 to-pink-600' },
    { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-400 to-emerald-600' },
  ]

  return (
    <>
      <div className="sticky top-0 z-50 flex items-center bg-background-main/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-4 justify-between">
        <button className="text-text-dark dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm hover:scale-105 transition-transform active:scale-95 border border-slate-100 dark:border-slate-700">
          <MaterialSymbolsOutlined name="arrow_back" className="text-[20px]" />
        </button>
        <h2 className="text-text-dark dark:text-white text-xl font-display font-bold leading-tight tracking-tight text-center">
          Votre Progression
        </h2>
        <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm hover:scale-105 transition-transform active:scale-95 border border-slate-100 dark:border-slate-700 text-text-dark dark:text-white">
          <MaterialSymbolsOutlined name="more_horiz" className="text-[20px]" />
        </button>
      </div>

      <div className="px-6 py-2">
        <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-white dark:bg-surface-dark p-1.5 shadow-soft border border-slate-100 dark:border-slate-800">
          {(['7d', '30d', '90d', '1y'] as const).map((p) => {
            const isActive = period === p
            return (
              <label
                key={p}
                className="relative z-10 flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl transition-all duration-300"
              >
                <input
                  type="radio"
                  name="period"
                  value={p}
                  defaultChecked={isActive}
                  className="peer invisible w-0 absolute"
                />
                <span
                  className={`absolute inset-0 bg-primary opacity-0 transition-opacity duration-300 peer-checked:opacity-100 rounded-xl shadow-lg shadow-primary/30`}
                />
                <span
                  className={`relative z-20 text-xs font-bold transition-colors duration-200 ${
                    isActive
                      ? 'text-white dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {periodLabels[p]}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-card-bg dark:bg-surface-dark p-6 shadow-soft ring-1 ring-slate-100 dark:ring-white/5 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MaterialSymbolsOutlined
                    name="monitoring"
                    className="text-primary text-[18px]"
                  />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Taux de complétion
                </p>
              </div>
              <div className="flex items-baseline gap-3 mt-2">
                <p className="text-text-dark dark:text-white text-5xl font-display font-bold tracking-tight">
                  {data.stats.completionRate}%
                </p>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
                  <MaterialSymbolsOutlined name="arrow_upward" className="text-[14px]" />
                  <span>5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-2">
        <h3 className="text-text-dark dark:text-white text-lg font-display font-bold mb-4 px-1 flex items-center gap-2">
          Métriques clés
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative flex flex-col gap-1 p-5 rounded-[2rem] bg-card-bg dark:bg-surface-dark shadow-soft overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 size-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/30 text-white">
              <MaterialSymbolsOutlined name="check_circle" className="text-[20px]" />
            </div>
            <p className="relative z-10 text-text-dark dark:text-white text-3xl font-display font-bold">
              {data.stats.completionRate}%
            </p>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Taux de réussite
            </p>
          </div>
          <div className="relative flex flex-col gap-1 p-5 rounded-[2rem] bg-card-bg dark:bg-surface-dark shadow-soft overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-orange-100/50 dark:bg-orange-900/20 rounded-full blur-xl group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 size-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-2 shadow-lg shadow-orange-500/30 text-white">
              <MaterialSymbolsOutlined
                name="local_fire_department"
                className="text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              />
            </div>
            <p className="relative z-10 text-text-dark dark:text-white text-3xl font-display font-bold">
              {data.stats.longestStreak}
              <span className="text-sm font-bold ml-1 text-slate-400">Jours</span>
            </p>
            <p className="relative z-10 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              Plus longue série
            </p>
          </div>
          <div className="col-span-2 relative flex items-center justify-between p-6 rounded-[2rem] bg-card-bg dark:bg-surface-dark shadow-soft overflow-hidden ring-1 ring-slate-100 dark:ring-white/5 group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10 flex flex-col gap-1">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                Total complété
              </p>
              <p className="text-text-dark dark:text-white text-4xl font-display font-bold">
                {data.stats.totalCompleted}{' '}
                <span className="text-lg font-normal text-slate-400">Habitudes</span>
              </p>
            </div>
            <div className="relative z-10 size-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white rotate-3 group-hover:rotate-12 transition-transform duration-300">
              <MaterialSymbolsOutlined name="emoji_events" className="text-[28px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-text-dark dark:text-white text-lg font-display font-bold">
            Top 5 Habitudes
          </h3>
          <button className="text-primary hover:text-primary-dark text-sm font-bold bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-colors">
            Voir tout
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {data.habits.map((habit, index) => {
            const colors = habitColors[index % habitColors.length]
            return (
              <div
                key={habit.id}
                className="group flex items-center gap-4 p-4 rounded-[1.5rem] bg-card-bg dark:bg-surface-dark shadow-sm active:scale-[0.99] transition-all ring-1 ring-slate-100 dark:ring-white/5 hover:shadow-md"
              >
                <div
                  className={`size-12 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 group-hover:bg-gradient-to-br group-hover:from-current group-hover:text-white transition-colors duration-300`}
                >
                  <span className="text-2xl">{habit.icon || '⭐'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-text-dark dark:text-white font-display font-bold text-sm truncate">
                      {habit.name}
                    </p>
                    <div className={`flex items-center gap-1 text-xs font-bold ${colors.text}`}>
                      <MaterialSymbolsOutlined
                        name="local_fire_department"
                        className="text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      />
                      {habit.completionRate}%
                    </div>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                      style={{ width: `${habit.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

