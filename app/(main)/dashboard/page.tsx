import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getStartOfDay, formatDate, calculateStreak, getCompletionRate } from '@/lib/utils'
import HabitCard from '@/components/HabitCard'
import { MaterialSymbolsOutlined } from '@/components/MaterialSymbols'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getDashboardData(userId: string) {
  const today = getStartOfDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())

  // Get active habits
  const habits = await prisma.habit.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      logs: {
        where: {
          date: {
            gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: {
          date: 'desc',
        },
      },
    },
  })

  // Get today's logs
  const todayLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  })

  // Get today's goals
  const todayGoals = await prisma.goal.findMany({
    where: {
      userId,
      period: 'day',
      status: 'in_progress',
      startDate: {
        lte: today,
      },
      OR: [
        { dueDate: null },
        { dueDate: { gte: today } },
      ],
    },
    take: 5,
    orderBy: {
      priority: 'desc',
    },
  })

  // Calculate stats
  const habitsWithStats = habits.map((habit) => {
    const logs = habit.logs.map((log) => ({
      date: log.date,
      completed: log.completed,
    }))
    const streak = calculateStreak(logs)
    const isCompletedToday = todayLogs.some(
      (log) => log.habitId === habit.id && log.completed
    )

    return {
      ...habit,
      logs,
      streak,
      isCompletedToday,
    }
  })

  const completedToday = habitsWithStats.filter((h) => h.isCompletedToday).length
  const totalHabits = habitsWithStats.length
  const completionRate = getCompletionRate(completedToday, totalHabits)

  // Get week progress
  const weekLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: {
        gte: startOfWeek,
      },
      completed: true,
    },
  })

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    const dayLogs = weekLogs.filter((log) => {
      const logDate = new Date(log.date)
      return (
        logDate.getDate() === date.getDate() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getFullYear() === date.getFullYear()
      )
    })
    return {
      date,
      completed: dayLogs.length > 0,
      count: dayLogs.length,
    }
  })

  return {
    habits: habitsWithStats,
    goals: todayGoals,
    stats: {
      completedToday,
      totalHabits,
      completionRate,
    },
    weekDays,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const data = await getDashboardData(session.user.id)
  const currentDate = new Date()
  const greeting = getGreeting()

  return (
    <>
      <header className="flex items-center justify-between p-6 pb-2 z-10">
        <button className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-text-dark dark:text-white">
          <MaterialSymbolsOutlined name="menu" className="text-3xl" />
        </button>
        <div className="flex items-center justify-end">
          <button className="relative flex items-center justify-center overflow-hidden rounded-full h-11 w-11 bg-white dark:bg-surface-dark ring-4 ring-white dark:ring-surface-dark shadow-sm">
            {session.user.image ? (
              <img
                alt="User Profile"
                className="object-cover h-full w-full"
                src={session.user.image}
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                {session.user.name?.[0] || session.user.email[0].toUpperCase()}
              </div>
            )}
          </button>
        </div>
      </header>

      <div className="px-6 py-2">
        <p className="text-secondary font-bold text-sm mb-1 tracking-wide uppercase">
          {greeting}, {session.user.name || 'Utilisateur'}! ☀️
        </p>
        <h1 className="text-text-dark dark:text-white tracking-tight text-3xl font-display font-semibold leading-tight">
          {formatDate(currentDate)}
        </h1>
      </div>

      <div className="px-6 py-4">
        <div className="bg-card-bg dark:bg-surface-dark rounded-3xl p-6 shadow-soft border border-gray-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-soft dark:bg-primary/20 rounded-full opacity-50"></div>
          <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full opacity-50"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-text-dark dark:text-white text-xl font-display font-bold">
                  Progression du jour
                </p>
                <p className="text-text-light dark:text-slate-400 text-sm mt-1 font-medium">
                  {data.stats.completedToday} sur {data.stats.totalHabits} habitudes complétées
                </p>
              </div>
              <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <MaterialSymbolsOutlined
                  name="emoji_events"
                  className="text-success text-xl"
                />
                <span className="text-success font-bold text-lg font-display">
                  {data.stats.completionRate}%
                </span>
              </div>
            </div>
            <div className="relative h-4 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.stats.completionRate}%` }}
              ></div>
            </div>
            <p className="text-text-light dark:text-slate-400 text-xs mt-3 font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20">
                <MaterialSymbolsOutlined
                  name="trending_up"
                  className="text-[12px] text-primary"
                />
              </span>
              {data.stats.completionRate >= 80
                ? "Vous êtes au top aujourd'hui ! Continuez ! 🚀"
                : data.stats.completionRate >= 50
                ? "Bon travail ! Vous y êtes presque ! 💪"
                : "C'est un bon début ! Continuez ! 🌟"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-text-dark dark:text-white text-xl font-display font-bold">
            Cette semaine
          </h2>
          <Link
            href="/calendar"
            className="text-secondary text-sm font-bold bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            Voir tout
          </Link>
        </div>
        <div className="flex justify-between items-center bg-card-bg dark:bg-surface-dark p-4 rounded-2xl shadow-card border border-gray-50 dark:border-slate-800">
          {data.weekDays.map((day, index) => {
            const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
            const isToday =
              day.date.getDate() === currentDate.getDate() &&
              day.date.getMonth() === currentDate.getMonth() &&
              day.date.getFullYear() === currentDate.getFullYear()
            return (
              <div
                key={index}
                className={`flex flex-col items-center gap-2 ${
                  isToday ? 'transform scale-110' : ''
                }`}
              >
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isToday
                      ? 'text-primary'
                      : 'text-text-light dark:text-slate-400'
                  }`}
                >
                  {dayNames[day.date.getDay()]}
                </span>
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold ${
                    isToday
                      ? 'bg-primary text-white shadow-lg shadow-orange-200'
                      : day.completed
                      ? 'bg-green-100 dark:bg-green-900/30 text-success'
                      : 'bg-gray-50 dark:bg-slate-700 text-text-light dark:text-slate-400'
                  }`}
                >
                  {day.completed ? (
                    <MaterialSymbolsOutlined name="check" className="text-lg" />
                  ) : (
                    day.date.getDate()
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-6 py-4 flex-1">
        <h2 className="text-text-dark dark:text-white text-xl font-display font-bold mb-4 flex items-center gap-2">
          Habitudes du jour
          <span className="text-sm font-normal text-text-light dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
            {data.habits.length}
          </span>
        </h2>
        <div className="flex flex-col gap-4">
          {data.habits.length === 0 ? (
            <div className="text-center py-8 text-text-light dark:text-slate-400">
              <p className="mb-4">Aucune habitude pour aujourd'hui</p>
              <Link
                href="/habits/new"
                className="text-primary font-semibold hover:underline"
              >
                Créer votre première habitude
              </Link>
            </div>
          ) : (
            data.habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))
          )}
        </div>
      </div>

      <div className="px-6 py-4 pb-28">
        <h2 className="text-text-dark dark:text-white text-xl font-display font-bold mb-4">
          Objectifs du jour
        </h2>
        <div className="flex flex-col gap-3 bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-card border border-gray-100 dark:border-slate-800">
          {data.goals.length === 0 ? (
            <p className="text-text-light dark:text-slate-400 text-sm text-center py-4">
              Aucun objectif pour aujourd'hui
            </p>
          ) : (
            data.goals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <label className="custom-checkbox mt-0.5 relative flex items-center justify-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    defaultChecked={goal.progress === 100}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-slate-600 bg-transparent transition-colors duration-200 flex items-center justify-center hover:border-primary">
                    <svg
                      className="w-3.5 h-3.5 text-white hidden"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                </label>
                <div className="flex-1">
                  <p className="text-text-dark dark:text-white text-sm font-semibold leading-tight">
                    {goal.title}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                    goal.priority === 'high'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
                      : goal.priority === 'medium'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-500'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-400'
                  }`}
                >
                  {goal.priority === 'high'
                    ? 'Élevée'
                    : goal.priority === 'medium'
                    ? 'Moyenne'
                    : 'Basse'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <Link
        href="/habits/new"
        className="fixed bottom-24 right-6 size-16 bg-primary text-white rounded-2xl shadow-floating flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 z-50 animate-subtle-bounce group"
      >
        <MaterialSymbolsOutlined
          name="add"
          className="text-4xl group-hover:rotate-90 transition-transform duration-300"
        />
      </Link>
    </>
  )
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}
