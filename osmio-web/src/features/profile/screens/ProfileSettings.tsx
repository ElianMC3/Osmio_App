import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const

export default function ProfileSettings() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('Elite Warrior')
  const [email] = useState('fighter@osmio.app')
  const [weight, setWeight] = useState('84.5')
  const [height, setHeight] = useState('188')
  const [age, setAge] = useState('28')
  const [preferredTime, setPreferredTime] = useState('Tarde')
  const [trainingDays, setTrainingDays] = useState<Record<string, boolean>>({
    L: true, M: true, X: false, J: true, V: true, S: false, D: false,
  })
  const [trainingReminders, setTrainingReminders] = useState(true)
  const [mealReminders, setMealReminders] = useState(true)

  const toggleDay = (day: string) => {
    setTrainingDays((prev) => ({ ...prev, [day]: !prev[day] }))
  }

  const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Title */}
      <div className="border-b border-outline-variant/30 pb-4">
        <h1 className="font-headline-md text-headline-md text-on-surface">Perfil y Configuración</h1>
        <p className="font-label-caps text-xs text-on-surface-variant opacity-70">
          Gestiona tu información personal, estadísticas y preferencias de entrenamiento
        </p>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 opacity-5">
          <span className="material-symbols-outlined text-[200px] text-on-surface">person</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-primary-fixed/30">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
            </div>
            <button
              aria-label="Cambiar foto de perfil"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-fixed rounded-full flex items-center justify-center border-2 border-surface cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-on-primary-fixed">photo_camera</span>
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="font-headline-md text-2xl text-on-surface font-bold">{fullName}</p>
            <p className="font-label-sm text-sm text-on-surface-variant mt-0.5">{email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className="font-label-caps text-[10px] text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/30 px-3 py-1 rounded-full">
                Luchador Elite
              </span>
              <span className="font-label-caps text-[10px] text-secondary bg-secondary/10 border border-secondary/30 px-3 py-1 rounded-full">
                Racha: 12 días
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6 text-center flex-shrink-0">
            <div>
              <p className="font-data-display text-xl text-on-surface font-bold">{weight}</p>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">kg</p>
            </div>
            <div>
              <p className="font-data-display text-xl text-on-surface font-bold">{height}</p>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">cm</p>
            </div>
            <div>
              <p className="font-data-display text-xl text-primary-fixed font-bold">{bmi}</p>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">IMC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column grid for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">person</span>
            Información de Perfil
          </h3>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-4 font-body-lg text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
            />
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-4 font-body-lg text-sm text-on-surface-variant opacity-60 cursor-not-allowed focus:outline-none"
            />
          </div>

          <button className="font-label-caps text-xs text-primary-fixed hover:underline active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Editar Credenciales
          </button>
        </div>

        {/* Physical Stats */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">monitor_weight</span>
            Estadísticas Físicas
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Peso</label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-3 pr-9 font-data-display text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant">kg</span>
              </div>
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Altura</label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-3 pr-9 font-data-display text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant">cm</span>
              </div>
            </div>
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Edad</label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-3 pr-9 font-data-display text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-label-caps text-[10px] text-on-surface-variant">años</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 text-center">
            <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">IMC Calculado</p>
            <p className="font-data-display text-2xl text-primary-fixed font-bold">{bmi}</p>
            <p className="font-label-caps text-[10px] text-on-surface-variant mt-1">
              {parseFloat(bmi) < 18.5 ? 'Bajo peso' : parseFloat(bmi) < 25 ? 'Peso normal' : parseFloat(bmi) < 30 ? 'Sobrepeso' : 'Obesidad'}
            </p>
          </div>
        </div>

        {/* Training Preferences */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">fitness_center</span>
            Preferencias de Entrenamiento
          </h3>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 uppercase tracking-wider">Horario Preferido</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-surface-dim border border-outline-variant rounded-xl py-3 px-4 font-label-caps text-sm text-on-surface focus:outline-none focus:border-primary-fixed transition-all appearance-none cursor-pointer"
            >
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>

          <div>
            <label className="font-label-caps text-[10px] text-on-surface-variant block mb-2 uppercase tracking-wider">Días de Entrenamiento</label>
            <div className="flex gap-2">
              {dayLabels.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex-1 py-3 font-label-caps text-sm rounded-xl transition-all duration-200 active:scale-[0.98] cursor-pointer font-bold ${
                    trainingDays[day]
                      ? 'bg-primary-fixed text-on-primary-fixed shadow-lg'
                      : 'bg-surface-dim border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary-fixed/40'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 space-y-4">
          <h3 className="font-label-caps text-sm text-on-surface font-bold flex items-center gap-2 border-b border-outline-variant/30 pb-3">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">notifications</span>
            Notificaciones
          </h3>

          <div className="space-y-5">
            {/* Training Reminders */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">alarm</span>
                </div>
                <div>
                  <p className="font-label-caps text-sm text-on-surface font-bold">Recordatorios de Entrenamiento</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">Aviso 30 min antes</p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={trainingReminders}
                aria-label="Recordatorios de entrenamiento"
                onClick={() => setTrainingReminders(!trainingReminders)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  trainingReminders ? 'bg-primary-fixed' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                    trainingReminders ? 'left-6 bg-on-primary-fixed' : 'left-0.5 bg-surface-container'
                  }`}
                />
              </button>
            </div>

            {/* Meal Reminders */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">restaurant</span>
                </div>
                <div>
                  <p className="font-label-caps text-sm text-on-surface font-bold">Recordatorios de Comidas</p>
                  <p className="font-label-sm text-xs text-on-surface-variant">Horarios de nutrición</p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={mealReminders}
                aria-label="Recordatorios de comidas"
                onClick={() => setMealReminders(!mealReminders)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                  mealReminders ? 'bg-primary-fixed' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                    mealReminders ? 'left-6 bg-on-primary-fixed' : 'left-0.5 bg-surface-container'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={() => navigate('/')}
        className="w-full bg-error-container text-on-error-container font-label-caps text-sm font-bold py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Cerrar Sesión
      </button>
    </div>
  )
}
