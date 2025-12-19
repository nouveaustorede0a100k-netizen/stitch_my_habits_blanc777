'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MaterialSymbolsOutlined } from './MaterialSymbols'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: 'home', label: 'Home' },
  { href: '/habits', icon: 'check_circle', label: 'Habits' },
  { href: '/goals', icon: 'flag', label: 'Goals' },
  { href: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { href: '/statistics', icon: 'bar_chart', label: 'Stats' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 w-full max-w-md mx-auto bg-white/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 pb-safe-bottom pt-3 px-6 z-50 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-text-light dark:text-slate-400 hover:text-primary'
              )}
            >
              <div
                className={cn(
                  'p-1 rounded-xl transition-colors',
                  isActive && 'bg-primary/10 dark:bg-primary/20'
                )}
              >
                <MaterialSymbolsOutlined
                  name={item.icon}
                  className={cn(
                    'text-2xl',
                    isActive && 'fill-current'
                  )}
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1, 'wght' 400" }
                      : undefined
                  }
                />
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

