import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const

export default function ProfileSettings() {
  const navigate = useNavigate()

  // Profile state
  const [fullName, setFullName] = useState('Elite Warrior')
  const [email] = useState('fighter@osmio.app')

  // Physical stats
  const [weight, setWeight] = useState('84.5')
  const [height, setHeight] = useState('188')
  const [age, setAge] = useState('28')

  // Training preferences
  const [preferredTime, setPreferredTime] = useState('Tarde')
  const [trainingDays, setTrainingDays] = useState<Record<string, boolean>>({
    L: true,
    M: true,
    X: false,
    J: true,
    V: true,
    S: false,
    D: false,
  })

  // Notifications
  const [trainingReminders, setTrainingReminders] = useState(true)
  const [mealReminders, setMealReminders] = useState(true)

  const toggleDay = (day: string) => {
    setTrainingDays((prev) => ({ ...prev, [day]: !prev[day] }))
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-5 py-2 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} aria-label="Volver" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md text-on-surface">Perfil y Configuración</h1>
        </div>
        <span aria-label="Configuración" className="material-symbols-outlined text-on-surface-variant">settings</span>
      </header>

      <div className="px-5 py-4 space-y-5 max-w-sm mx-auto">
        {/* Profile Section */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-5">
          <h3 className="font-label-caps text-label-caps text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary-fixed">person</span>
            Perfil
          </h3>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">person</span>
              </div>
              <button aria-label="Cambiar foto de perfil" className="absolute bottom-0 right-0 w-7 h-7 bg-primary-fixed rounded-full flex items-center justify-center border-2 border-surface cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="material-symbols-outlined text-[14px] text-on-primary-fixed">photo_camera</span>
              </button>
            </div>
            <div>
              <p className="font-headline-md text-headline-md text-on-surface">{fullName}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{email}</p>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="mb-3">
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-dim border border-outline-variant py-2.5 px-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
            />
          </div>

          {/* Email Input (disabled) */}
          <div className="mb-3">
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-surface-dim border border-outline-variant py-2.5 px-3 font-body-lg text-body-lg text-on-surface-variant opacity-60 cursor-not-allowed focus:outline-none"
            />
          </div>

          <button className="font-label-caps text-label-caps text-primary-fixed hover:underline active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
            Editar Perfil
          </button>
        </div>

        {/* Physical Stats */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-5">
          <h3 className="font-label-caps text-label-caps text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary-fixed">monitor_weight</span>
            Estadísticas Físicas
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Weight */}
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">Peso</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant py-2.5 px-3 pr-8 font-data-display text-[14px] text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant">kg</span>
              </div>
            </div>
            {/* Height */}
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">Altura</label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant py-2.5 px-3 pr-8 font-data-display text-[14px] text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant">cm</span>
              </div>
            </div>
            {/* Age */}
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">Edad</label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant py-2.5 px-3 pr-8 font-data-display text-[14px] text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant">años</span>
              </div>
            </div>
          </div>
        </div>

        {/* Training Preferences */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-5">
          <h3 className="font-label-caps text-label-caps text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary-fixed">fitness_center</span>
            Preferencias de Entrenamiento
          </h3>

          {/* Preferred Time */}
          <div className="mb-4">
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-2">Horario Preferido</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-surface-dim border border-outline-variant py-2.5 px-3 font-label-caps text-label-caps text-on-surface focus:outline-none focus:border-primary-fixed transition-all appearance-none cursor-pointer"
            >
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>

          {/* Training Days */}
          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-2">Días de Entrenamiento</label>
            <div className="flex gap-2">
              {dayLabels.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 py-2.5 font-label-caps text-label-caps transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                    trainingDays[day]
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : 'bg-surface-dim border border-outline-variant text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container/50 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-5">
          <h3 className="font-label-caps text-label-caps text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary-fixed">notifications</span>
            Notificaciones
          </h3>

          <div className="space-y-4">
            {/* Training Reminders */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">alarm</span>
                <span className="font-label-caps text-label-caps text-on-surface">Recordatorios de Entrenamiento</span>
              </div>
              <button
                role="switch"
                aria-checked={trainingReminders}
                aria-label="Recordatorios de entrenamiento"
                onClick={() => setTrainingReminders(!trainingReminders)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                  trainingReminders ? 'bg-primary-fixed' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                    trainingReminders ? 'left-5.5 bg-on-primary-fixed' : 'left-0.5 bg-surface-container'
                  }`}
                />
              </button>
            </div>

            {/* Meal Reminders */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">restaurant</span>
                <span className="font-label-caps text-label-caps text-on-surface">Recordatorios de Comidas</span>
              </div>
              <button
                role="switch"
                aria-checked={mealReminders}
                aria-label="Recordatorios de comidas"
                onClick={() => setMealReminders(!mealReminders)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${
                  mealReminders ? 'bg-primary-fixed' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                    mealReminders ? 'left-5.5 bg-on-primary-fixed' : 'left-0.5 bg-surface-container'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => navigate('/')}
          className="w-full bg-error-container text-on-error-container font-label-caps text-label-caps py-3.5 hover:brightness-110 active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Cerrar Sesión
        </button>
      </div>

    </div>
  )
}
