import { useState } from 'react'

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    reminders: true,
    weeklyReport: true,
    streakAlerts: false,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    { key: 'reminders' as const, label: 'Recordatorios diarios', desc: 'Te avisamos si no has registrado' },
    { key: 'weeklyReport' as const, label: 'Reporte semanal', desc: 'Resumen de tu progreso' },
    { key: 'streakAlerts' as const, label: 'Alertas de racha', desc: 'Cuando estás por perder tu racha' },
  ]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="font-semibold text-white mb-4">Notificaciones</h3>
      <div className="space-y-4">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-200">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                settings[key] ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${
                  settings[key] ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
