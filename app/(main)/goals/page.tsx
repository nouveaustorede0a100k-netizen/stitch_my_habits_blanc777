import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MaterialSymbolsOutlined } from '@/components/MaterialSymbols'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function getGoalsData(userId: string, period: string = 'week') {
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      period,
      status: 'in_progress',
    },
    include: {
      subGoals: true,
    },
    orderBy: {
      priority: 'desc',
    },
  })

  const totalProgress =
    goals.length > 0
      ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
      : 0

  return {
    goals,
    totalProgress: Math.round(totalProgress),
  }
}

export default async function GoalsPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const period = searchParams.period || 'week'
  const data = await getGoalsData(session.user.id, period)

  const periodLabels: Record<string, string> = {
    day: 'Jour',
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
  }

  const priorityLabels: Record<string, string> = {
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Basse',
  }

  const priorityColors: Record<string, string> = {
    high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    low: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-background-main/80 dark:bg-background-dark/80 backdrop-blur-xl pt-safe-top transition-all">
        <div className="flex items-center justify-between px-6 py-4">
          <button className="group flex size-10 items-center justify-center rounded-full bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <MaterialSymbolsOutlined
              name="menu"
              className="text-[24px] group-hover:scale-110 transition-transform"
            />
          </button>
          <h1 className="text-xl font-display font-bold tracking-tight text-text-dark dark:text-white">
            Mes Objectifs
          </h1>
          <button className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-white dark:border-surface-dark shadow-sm">
            {session.user.image ? (
              <img
                alt="User profile portrait"
                className="h-full w-full object-cover"
                src={session.user.image}
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">
                {session.user.name?.[0] || session.user.email[0].toUpperCase()}
              </div>
            )}
          </button>
        </div>
        <div className="px-6 pb-4">
          <div className="flex h-12 w-full items-center justify-between rounded-2xl bg-white dark:bg-surface-dark p-1.5 shadow-sm border border-slate-100 dark:border-slate-700 relative">
            {(['day', 'week', 'month', 'year'] as const).map((p, index) => {
              const isActive = period === p
              const translateX = index * 100
              return (
                <label
                  key={p}
                  className="relative z-10 flex flex-1 cursor-pointer items-center justify-center h-full rounded-xl text-xs font-bold transition-colors"
                >
                  <input
                    type="radio"
                    name="period"
                    value={p}
                    defaultChecked={isActive}
                    className="hidden peer"
                  />
                  <span
                    className={`relative z-20 transition-colors duration-200 ${
                      isActive
                        ? 'text-white dark:text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {periodLabels[p]}
                  </span>
                  {isActive && (
                    <div
                      className="absolute left-1.5 w-[calc(25%-0.5rem)] h-9 bg-primary dark:bg-primary rounded-xl shadow-md shadow-primary/30 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
                      style={{ transform: `translateX(${translateX}%)` }}
                    />
                  )}
                </label>
              )
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 px-6 pt-2 pb-32 overflow-y-auto no-scrollbar">
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 shadow-xl shadow-indigo-500/20 text-white transform transition-transform hover:scale-[1.01] duration-300">
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center justify-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                  En bonne voie
                </span>
              </div>
              <h2 className="text-3xl font-display font-black tracking-tight">
                Votre Progression
              </h2>
              <p className="font-medium text-indigo-100/90 text-sm mt-0.5">
                Vous êtes au top ! 🚀
              </p>
            </div>
            <div className="relative size-20 flex items-center justify-center">
              <svg
                className="size-full -rotate-90 transform drop-shadow-lg"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-white/20"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-white drop-shadow-md"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${data.totalProgress}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold leading-none">
                  {data.totalProgress}
                  <span className="text-xs align-top">%</span>
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-8 -bottom-8 size-32 rounded-full bg-yellow-300/20 blur-2xl"></div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-display font-bold text-text-dark dark:text-white flex items-center gap-2">
              Objectifs en cours
              <span className="flex items-center justify-center size-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                {data.goals.length}
              </span>
            </h3>
            <Link
              href="/goals/new"
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Voir tout
            </Link>
          </div>

          {data.goals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light dark:text-slate-400 mb-4">
                Aucun objectif pour cette période
              </p>
              <Link
                href="/goals/new"
                className="text-primary font-semibold hover:underline"
              >
                Créer un objectif
              </Link>
            </div>
          ) : (
            data.goals.map((goal) => (
              <div
                key={goal.id}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark p-5 shadow-soft border border-slate-100 dark:border-slate-800 transition-all hover:shadow-float hover:border-indigo-100 dark:hover:border-indigo-900/30"
              >
                <div className="flex gap-4 items-start">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 shadow-sm border border-orange-100 dark:border-orange-900/20">
                    <MaterialSymbolsOutlined name="flag" className="text-[24px]" />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0 gap-2">
                    <div className="flex justify-between items-start">
                      <h4 className="truncate text-base font-display font-bold text-text-dark dark:text-white">
                        {goal.title}
                      </h4>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold border ${priorityColors[goal.priority]}`}
                      >
                        {priorityLabels[goal.priority]}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="truncate text-xs font-medium text-slate-400 dark:text-slate-500">
                        {goal.description}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-3 w-full">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-500 ease-out"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                        {Math.round(goal.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Link
        href="/goals/new"
        className="absolute bottom-24 right-6 z-40"
      >
        <button className="flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-glow hover:scale-110 hover:rotate-90 active:scale-95 transition-all duration-300 group">
          <MaterialSymbolsOutlined
            name="add"
            className="text-[32px] group-hover:scale-110 transition-transform"
          />
        </button>
      </Link>
    </>
  )
}

