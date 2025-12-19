import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateStreak, getStartOfDay } from '@/lib/utils'
import HabitCard from '@/components/HabitCard'
import { MaterialSymbolsOutlined } from '@/components/MaterialSymbols'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getHabitsData(userId: string) {
  const today = getStartOfDay()

  const habits = await prisma.habit.findMany({
    where: {
      userId,
    },
    include: {
      logs: {
        where: {
          date: {
            gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: {
          date: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const todayLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  })

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

  const activeHabits = habitsWithStats.filter((h) => h.isActive)
  const completedToday = activeHabits.filter((h) => h.isCompletedToday).length

  return {
    habits: habitsWithStats,
    stats: {
      total: habitsWithStats.length,
      active: activeHabits.length,
      completedToday,
    },
  }
}

export default async function HabitsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const data = await getHabitsData(session.user.id)
  const currentDate = new Date()

  return (
    <>
      <header className="pt-14 pb-4 px-6 flex justify-between items-center sticky top-0 z-20 bg-background-main/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div>
          <p className="text-text-light dark:text-slate-400 font-semibold text-sm mb-0.5">
            {currentDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <h1 className="text-3xl font-display font-extrabold text-text-dark dark:text-white tracking-tight">
            Mes Habitudes
          </h1>
        </div>
        <button className="relative w-12 h-12 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
          <MaterialSymbolsOutlined name="notifications" className="text-2xl" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-surface-dark rounded-full"></span>
        </button>
      </header>

      <section className="px-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-1">Vous vous en sortez bien ! 🌟</h2>
              <p className="text-indigo-100 text-sm font-medium">
                {data.stats.completedToday} habitudes complétées aujourd'hui.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <span className="text-3xl">🔥</span>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/30 rounded-full blur-2xl"></div>
        </div>
      </section>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-6 mb-6">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar py-1">
            <button className="flex-none px-5 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-md transition-transform active:scale-95">
              Toutes
            </button>
            <button className="flex-none px-5 py-2.5 rounded-full bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors active:scale-95">
              Santé
            </button>
            <button className="flex-none px-5 py-2.5 rounded-full bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 transition-colors active:scale-95">
              Productivité
            </button>
            <button className="flex-none px-5 py-2.5 rounded-full bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 font-semibold text-sm border border-slate-200 dark:border-slate-700 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-400 transition-colors active:scale-95">
              Autre
            </button>
          </div>
        </div>

        <div className="px-6 mb-5 flex items-center justify-between">
          <h3 className="font-bold text-lg text-text-dark dark:text-white">Vos Habitudes</h3>
          <div className="flex bg-white dark:bg-surface-dark p-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
            <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold transition-all">
              Actives
            </button>
            <button className="px-4 py-1.5 rounded-full text-slate-400 dark:text-slate-500 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Archivées
            </button>
          </div>
        </div>

        <div className="px-6 space-y-4 pb-24">
          {data.habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light dark:text-slate-400 mb-4">
                Aucune habitude pour le moment
              </p>
              <Link
                href="/habits/new"
                className="text-primary font-semibold hover:underline"
              >
                Créer votre première habitude
              </Link>
            </div>
          ) : (
            data.habits.map((habit) => (
              <div
                key={habit.id}
                className="bg-white dark:bg-surface-dark rounded-[2rem] p-5 shadow-card hover:shadow-card-hover transition-all duration-300 border border-slate-100 dark:border-slate-800 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300"
                      style={{
                        backgroundColor: `${habit.color || '#54A0FF'}20`,
                      }}
                    >
                      {habit.icon || '⭐'}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-text-dark dark:text-white leading-tight">
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <MaterialSymbolsOutlined
                          name="repeat"
                          className="text-[16px]"
                          style={{ color: habit.color || '#54A0FF' }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: habit.color || '#54A0FF' }}
                        >
                          {habit.frequency === 'daily'
                            ? 'Quotidienne'
                            : habit.frequency === 'weekly'
                            ? 'Hebdomadaire'
                            : 'Mensuelle'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    className={`w-12 h-12 rounded-full border border-slate-100 dark:border-slate-700 flex items-center justify-center transition-all duration-300 ${
                      habit.isCompletedToday
                        ? 'bg-green-400 text-white shadow-lg shadow-green-200'
                        : 'text-slate-300 dark:text-slate-600 hover:bg-green-400 hover:border-green-400 hover:text-white hover:shadow-lg hover:shadow-green-200'
                    }`}
                  >
                    <MaterialSymbolsOutlined
                      name="check"
                      className="text-xl"
                      style={
                        habit.isCompletedToday
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    />
                  </button>
                </div>
                <div className="flex items-end justify-between bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Série
                    </span>
                    <div className="flex items-center gap-1 text-orange-500">
                      <MaterialSymbolsOutlined
                        name="local_fire_department"
                        className="text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      />
                      <span className="font-bold text-base">{habit.streak || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-8">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const logDate = new Date()
                      logDate.setDate(logDate.getDate() - (6 - i))
                      const hasLog = habit.logs.some(
                        (log) =>
                          new Date(log.date).toDateString() === logDate.toDateString()
                      )
                      return (
                        <div
                          key={i}
                          className={`w-2 rounded-full ${
                            hasLog
                              ? 'bg-green-400'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                          style={{ height: hasLog ? '100%' : '40%' }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Link
        href="/habits/new"
        className="fixed bottom-24 right-6 z-30"
      >
        <button className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl shadow-slate-900/40 dark:shadow-slate-100/40 hover:scale-105 active:scale-95 transition-all duration-300">
          <MaterialSymbolsOutlined name="add" className="text-3xl" />
        </button>
      </Link>
    </>
  )
}

