import { Routes, Route, Navigate } from 'react-router-dom'
import { DesktopLayout } from '../design-system/components/DesktopLayout'
import { AuthGuard } from '../shared/components/AuthGuard'
import { useAuth } from '../shared/hooks/useAuth'
import LoginScreen from '../features/auth/screens/LoginScreen'
import InitialSetupWizard from '../features/onboarding/screens/InitialSetupWizard'
import DashboardHoy from '../features/home/screens/DashboardHoy'
import DisciplineSelector from '../features/logging/screens/DisciplineSelector'
import StrengthActiveSession from '../features/logging/screens/StrengthActiveSession'
import ExercisePicker from '../features/logging/screens/ExercisePicker'
import ExerciseHistory from '../features/logging/screens/ExerciseHistory'
import MyRoutine from '../features/strength/screens/MyRoutine'
import CombatLogForm from '../features/logging/screens/CombatLogForm'
import StrengthAnalysis from '../features/analysis/screens/StrengthAnalysis'
import CombatLoadAnalysis from '../features/analysis/screens/CombatLoadAnalysis'
import ConsistencyMap from '../features/analysis/screens/ConsistencyMap'
import MonthlyCalendar from '../features/history/screens/MonthlyCalendar'
import DayDetail from '../features/history/screens/DayDetail'
import NutritionDashboard from '../features/nutrition/screens/NutritionDashboard'
import QuickAddMeal from '../features/nutrition/screens/QuickAddMeal'
import DayNutritionDetail from '../features/nutrition/screens/DayNutritionDetail'
import ProfileSettings from '../features/profile/screens/ProfileSettings'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DesktopLayout>{children}</DesktopLayout>
    </AuthGuard>
  )
}

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050705] flex items-center justify-center">
        <p className="font-label-caps text-sm text-text-muted animate-pulse">Cargando…</p>
      </div>
    )
  }
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/setup" element={<ProtectedRoute><InitialSetupWizard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardHoy /></ProtectedRoute>} />
      <Route path="/logging" element={<ProtectedRoute><DisciplineSelector /></ProtectedRoute>} />
      <Route path="/logging/strength" element={<ProtectedRoute><StrengthActiveSession /></ProtectedRoute>} />
      <Route path="/logging/strength/picker" element={<ProtectedRoute><ExercisePicker /></ProtectedRoute>} />
      <Route path="/logging/strength/history" element={<ProtectedRoute><ExerciseHistory /></ProtectedRoute>} />
      <Route path="/strength/routine" element={<ProtectedRoute><MyRoutine /></ProtectedRoute>} />
      <Route path="/logging/combat" element={<ProtectedRoute><CombatLogForm /></ProtectedRoute>} />
      <Route path="/analysis/strength" element={<ProtectedRoute><StrengthAnalysis /></ProtectedRoute>} />
      <Route path="/analysis/combat" element={<ProtectedRoute><CombatLoadAnalysis /></ProtectedRoute>} />
      <Route path="/analysis/consistency" element={<ProtectedRoute><ConsistencyMap /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><MonthlyCalendar /></ProtectedRoute>} />
      <Route path="/history/:date" element={<ProtectedRoute><DayDetail /></ProtectedRoute>} />
      <Route path="/nutrition" element={<ProtectedRoute><NutritionDashboard /></ProtectedRoute>} />
      <Route path="/nutrition/quick-add" element={<ProtectedRoute><QuickAddMeal /></ProtectedRoute>} />
      <Route path="/nutrition/:date" element={<ProtectedRoute><DayNutritionDetail /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
    </Routes>
  )
}
