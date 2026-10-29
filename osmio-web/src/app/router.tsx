import { Routes, Route, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Skeleton } from 'boneyard-js/react'
import { AppShellSkeleton } from '@/design-system/skeletons/fixtures'
import { DesktopLayout } from '../design-system/components/DesktopLayout'
import { Redirect } from '../shared/components/Redirect'
import { AuthGuard } from '../shared/components/AuthGuard'
import { useAuth } from '../shared/hooks/useAuth'
import LoginScreen from '../features/auth/screens/LoginScreen'
import ResetPasswordScreen from '../features/auth/screens/ResetPasswordScreen'
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
import SettingsScreen from '../features/settings/screens/SettingsScreen'

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <Skeleton
        name="app-shell"
        loading={loading}
        select="viewport"
        transition={180}
        className="block"
        fixture={<AppShellSkeleton />}
        fallback={<AppShellSkeleton />}
      >
        {null}
      </Skeleton>
    )
  }
  return <Redirect to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as const },
}

/**
 * Outlet animado: congela el elemento de la ruta saliente con `useOutlet()`
 * para que AnimatePresence reproduzca la salida sin que La ruta nueva
 * se cuele dentro del subtree en salida.
 */
function PageOutlet() {
  const location = useLocation()
  const lenis = useLenis()
  const outlet = useOutlet()

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
      return
    }
    window.scrollTo(0, 0)
  }

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTop}>
      <motion.div key={location.pathname} {...pageTransition} className="min-h-dvh">
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Shell persistente: AuthGuard + DesktopLayout + Outlet animado en una ruta
 * de layout sin path. El chrome (Header, tab bar, cápsula flotante, sidebar)
 * se monta una vez y sobrevive a los cambios de ruta; solo la página transita.
 */
function AppShell() {
  return (
    <AuthGuard>
      <DesktopLayout>
        <PageOutlet />
      </DesktopLayout>
    </AuthGuard>
  )
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />
      <Route element={<AppShell />}>
        <Route path="/setup" element={<InitialSetupWizard />} />
        <Route path="/dashboard" element={<DashboardHoy />} />
        <Route path="/logging" element={<DisciplineSelector />} />
        <Route path="/logging/strength" element={<StrengthActiveSession />} />
        <Route path="/logging/strength/picker" element={<ExercisePicker />} />
        <Route path="/logging/strength/history" element={<ExerciseHistory />} />
        <Route path="/strength/routine" element={<MyRoutine />} />
        <Route path="/logging/combat" element={<CombatLogForm />} />
        <Route path="/analysis/strength" element={<StrengthAnalysis />} />
        <Route path="/analysis/combat" element={<CombatLoadAnalysis />} />
        <Route path="/analysis/consistency" element={<ConsistencyMap />} />
        <Route path="/history" element={<MonthlyCalendar />} />
        <Route path="/history/:date" element={<DayDetail />} />
        <Route path="/nutrition" element={<NutritionDashboard />} />
        <Route path="/nutrition/quick-add" element={<QuickAddMeal />} />
        <Route path="/nutrition/:date" element={<DayNutritionDetail />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Route>
    </Routes>
  )
}

export function AppRouter() {
  return <AnimatedRoutes />
}
