'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main dark:bg-background-dark p-4">
      <div className="max-w-md w-full bg-card-bg dark:bg-surface-dark rounded-3xl p-8 shadow-soft text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-display font-bold text-text-dark dark:text-white mb-2">
          Erreur Serveur
        </h1>
        <p className="text-text-light dark:text-slate-400 mb-6">
          Une erreur est survenue lors du chargement de l'application.
        </p>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
            Causes probables :
          </p>
          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
            <li>Base de données non configurée</li>
            <li>Variables d'environnement manquantes</li>
            <li>Schéma Prisma non initialisé</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Réessayer
          </Button>
          <Link href="/auth/signin">
            <Button variant="outline" className="w-full">
              Aller à la connexion
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs text-text-light dark:text-slate-400">
            Consultez{' '}
            <a
              href="https://github.com/nouveaustorede0a100k-netizen/stitch_my_habits_blanc777/blob/main/FIX_ERROR.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              FIX_ERROR.md
            </a>{' '}
            pour plus d'informations.
          </p>
        </div>
      </div>
    </div>
  )
}

