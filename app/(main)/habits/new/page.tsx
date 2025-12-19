'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MaterialSymbolsOutlined } from '@/components/MaterialSymbols'
import Button from '@/components/ui/Button'

const categories = [
  { name: 'Health', icon: 'favorite', color: '#ef5777' },
  { name: 'Learn', icon: 'emoji_objects', color: '#6366f1' },
  { name: 'Water', icon: 'water_drop', color: '#38bdf8' },
  { name: 'Mind', icon: 'spa', color: '#10b981' },
  { name: 'Work', icon: 'work', color: '#f59e0b' },
]

export default function NewHabitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    category: 'Health',
    frequency: 'daily',
    specificDays: [] as number[],
    reminderEnabled: true,
    reminderTime: '08:00',
    motivation: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      specificDays: prev.specificDays.includes(day)
        ? prev.specificDays.filter((d) => d !== day)
        : [...prev.specificDays, day],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          frequency: formData.frequency,
          specificDays:
            formData.frequency === 'weekly' ? formData.specificDays : undefined,
          reminderEnabled: formData.reminderEnabled,
          reminderTime: formData.reminderEnabled ? formData.reminderTime : null,
          motivation: formData.motivation || undefined,
          icon: '⭐',
          color: categories.find((c) => c.name === formData.category)?.color,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la création')
        return
      }

      router.push('/habits')
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full bg-white dark:bg-background-dark flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-50 dark:from-slate-900 via-white dark:via-slate-900 to-transparent -z-10"></div>
      <div className="flex w-full justify-center pt-4 pb-2 cursor-grab">
        <div className="h-1.5 w-12 rounded-full bg-gray-200 dark:bg-slate-700"></div>
      </div>

      <div className="px-6 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-text-dark dark:text-white tracking-tight">
            Nouvelle Habitude
          </h1>
          <p className="text-text-light dark:text-slate-400 text-sm font-medium">
            Petits pas, grands résultats ✨
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-blue-50 dark:to-blue-900/20 flex items-center justify-center shadow-sm rotate-3">
          <MaterialSymbolsOutlined
            name="rocket_launch"
            className="text-blue-500 dark:text-blue-400 text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-36 space-y-8"
      >
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-widest ml-1">
            Nom de l'habitude
          </label>
          <div className="relative group">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/20 rounded-2xl py-4 pl-4 pr-10 text-lg font-bold placeholder-gray-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-0 transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-card"
              placeholder="ex: Course matinale"
            />
            <MaterialSymbolsOutlined
              name="edit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-widest ml-1">
            Catégorie
          </label>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.name })}
                className={`flex flex-col items-center gap-2 min-w-[76px] group ${
                  formData.category === cat.name ? '' : 'opacity-60 hover:opacity-100'
                } transition-all active:scale-95`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-all ${
                    formData.category === cat.name
                      ? 'border-current shadow-current/20'
                      : 'border-transparent group-hover:border-current/20 group-hover:bg-current/10'
                  }`}
                  style={{
                    backgroundColor:
                      formData.category === cat.name ? `${cat.color}20` : undefined,
                    color: formData.category === cat.name ? cat.color : undefined,
                    borderColor:
                      formData.category === cat.name ? cat.color : undefined,
                  }}
                >
                  <MaterialSymbolsOutlined
                    name={cat.icon}
                    className="text-3xl"
                    style={
                      formData.category === cat.name
                        ? { fontVariationSettings: "'FILL' 1" }
                        : undefined
                    }
                  />
                </div>
                <span
                  className={`text-xs font-bold ${
                    formData.category === cat.name
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {cat.name === 'Health'
                    ? 'Santé'
                    : cat.name === 'Learn'
                    ? 'Apprentissage'
                    : cat.name === 'Water'
                    ? 'Eau'
                    : cat.name === 'Mind'
                    ? 'Bien-être'
                    : 'Travail'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-widest ml-1">
            Fréquence
          </label>
          <div className="flex p-1.5 bg-gray-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, frequency: 'daily' })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                formData.frequency === 'daily'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              Quotidienne
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, frequency: 'weekly' })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                formData.frequency === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              Jours spécifiques
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, frequency: 'monthly' })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                formData.frequency === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              Mensuelle
            </button>
          </div>

          {formData.frequency === 'weekly' && (
            <div className="flex justify-between items-center px-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index + 1)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-transform hover:scale-110 ${
                    formData.specificDays.includes(index + 1)
                      ? 'bg-blue-500 text-white shadow-glow'
                      : 'bg-white dark:bg-slate-700 text-gray-400 dark:text-slate-500 border-2 border-gray-100 dark:border-slate-600 hover:border-blue-200 hover:text-blue-500'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="block text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-widest">
              Rappels
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.reminderEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, reminderEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
            </label>
          </div>
          {formData.reminderEnabled && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 hover:border-orange-200 transition-all cursor-pointer group">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">
                <MaterialSymbolsOutlined name="schedule" />
              </div>
              <div>
                <div className="text-xs font-semibold text-orange-600/70 dark:text-orange-400/70 uppercase">
                  Heure
                </div>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) =>
                    setFormData({ ...formData, reminderTime: e.target.value })
                  }
                  className="text-xl font-bold text-slate-800 dark:text-white bg-transparent border-none outline-none"
                />
              </div>
              <div className="flex-1"></div>
              <MaterialSymbolsOutlined
                name="expand_more"
                className="text-orange-300 dark:text-orange-600"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-text-light dark:text-slate-400 uppercase tracking-widest ml-1">
            Pourquoi cette habitude ?
          </label>
          <div className="relative">
            <textarea
              value={formData.motivation}
              onChange={(e) =>
                setFormData({ ...formData, motivation: e.target.value })
              }
              className="w-full bg-emerald-50/50 dark:bg-emerald-900/20 border-transparent rounded-2xl p-4 pl-12 text-sm font-medium text-slate-700 dark:text-slate-300 placeholder-emerald-700/30 dark:placeholder-emerald-400/30 resize-none focus:border-emerald-200 dark:focus:border-emerald-800 focus:bg-emerald-50 dark:focus:bg-emerald-900/30 focus:ring-0 transition-all"
              placeholder="Motivez votre futur vous ! ex: Pour me sentir plus en forme et plus fort..."
              rows={3}
            />
            <MaterialSymbolsOutlined
              name="format_quote"
              className="absolute top-4 left-4 text-emerald-400/80 dark:text-emerald-500/80"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 pt-4 pb-8 px-6 z-20">
          <div className="flex gap-4 items-center">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-[2]" disabled={loading}>
              {loading ? 'Création...' : 'Créer l\'habitude'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

