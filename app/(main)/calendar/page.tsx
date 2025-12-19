import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MaterialSymbolsOutlined } from '@/components/MaterialSymbols'
import { redirect } from 'next/navigation'
import { getStartOfDay, getStartOfMonth } from '@/lib/utils'

async function getCalendarData(userId: string, year: number, month: number) {
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  const logs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      completed: true,
    },
    include: {
      habit: true,
    },
  })

  // Group logs by date
  const logsByDate = new Map<string, typeof logs>()
  logs.forEach((log) => {
    const dateKey = log.date.toISOString().split('T')[0]
    if (!logsByDate.has(dateKey)) {
      logsByDate.set(dateKey, [])
    }
    logsByDate.get(dateKey)!.push(log)
  })

  return { logsByDate, totalCompleted: logs.length }
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const currentDate = new Date()
  const year = searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear()
  const month = searchParams.month ? parseInt(searchParams.month) : currentDate.getMonth()

  const data = await getCalendarData(session.user.id, year, month)

  // Generate calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ]

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const getDayStatus = (day: number) => {
    const date = new Date(year, month, day)
    const dateKey = date.toISOString().split('T')[0]
    const dayLogs = data.logsByDate.get(dateKey) || []
    const completedCount = dayLogs.length

    if (completedCount === 0) return 'missed'
    if (completedCount >= 3) return 'perfect'
    if (completedCount >= 2) return 'good'
    return 'partial'
  }

  const isToday = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <>
      <header className="flex items-center justify-between p-6 sticky top-0 z-50 bg-background-main/95 dark:bg-background-dark/95 backdrop-blur-md">
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-white dark:hover:bg-surface-dark transition-colors text-text-dark dark:text-white shadow-sm bg-white/50 dark:bg-surface-dark/50">
          <MaterialSymbolsOutlined name="arrow_back_ios_new" className="text-[20px]" />
        </button>
        <h1 className="text-xl font-display font-bold tracking-tight text-text-dark dark:text-white">
          Progression Mensuelle
        </h1>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-white dark:hover:bg-surface-dark transition-colors text-text-dark dark:text-white shadow-sm bg-white/50 dark:bg-surface-dark/50">
          <MaterialSymbolsOutlined name="settings" className="text-[24px]" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-6 pb-28">
        <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-primary to-secondary rounded-3xl p-5 text-white shadow-soft">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Continuez comme ça !</p>
            <h2 className="text-2xl font-display font-bold">Excellente série 🔥</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
            <span className="text-3xl">🏆</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-surface-dark text-text-light dark:text-slate-400 hover:text-primary transition-colors">
              <MaterialSymbolsOutlined name="chevron_left" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-display font-bold text-text-dark dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <span className="text-xs text-text-light dark:text-slate-400 font-medium">
                {data.totalCompleted} Habitudes complétées
              </span>
            </div>
            <button className="p-2 rounded-xl hover:bg-white dark:hover:bg-surface-dark text-text-light dark:text-slate-400 hover:text-primary transition-colors">
              <MaterialSymbolsOutlined name="chevron_right" />
            </button>
          </div>

          <div className="bg-card-bg dark:bg-surface-dark rounded-3xl p-6 shadow-soft border border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-7 mb-4">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-bold tracking-widest uppercase text-text-light dark:text-slate-400 opacity-60"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-3 gap-x-1">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square flex items-center justify-center text-gray-300 dark:text-slate-600 text-sm"
                >
                  {new Date(year, month, 0).getDate() - startingDayOfWeek + i + 1}
                </div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const status = getDayStatus(day)
                const today = isToday(day)

                return (
                  <button
                    key={day}
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all ${
                      today
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-2 ring-offset-2 ring-primary'
                        : status === 'perfect'
                        ? 'bg-success text-white shadow-md shadow-success/30'
                        : status === 'good'
                        ? 'bg-success/20 text-success'
                        : status === 'partial'
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm font-bold">{day}</span>
                    {status !== 'missed' && (
                      <div className="w-1 h-1 bg-current rounded-full mt-0.5"></div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2 overflow-x-auto">
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-[10px] text-text-light dark:text-slate-400 font-medium uppercase tracking-wider">
                  Parfait
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success/20"></div>
                <span className="text-[10px] text-text-light dark:text-slate-400 font-medium uppercase tracking-wider">
                  Bien
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-900/30"></div>
                <span className="text-[10px] text-text-light dark:text-slate-400 font-medium uppercase tracking-wider">
                  Partiel
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/30"></div>
                <span className="text-[10px] text-text-light dark:text-slate-400 font-medium uppercase tracking-wider">
                  Manqué
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

