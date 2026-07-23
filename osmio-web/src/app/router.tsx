import { Routes, Route } from 'react-router-dom'
import { DesktopLayout } from '../design-system/components/DesktopLayout'
import SplashWelcome from '../features/onboarding/screens/SplashWelcome'
import InitialSetupWizard from '../features/onboarding/screens/InitialSetupWizard'
import DashboardHoy from '../features/home/screens/DashboardHoy'
import DisciplineSelector from '../features/logging/screens/DisciplineSelector'
import StrengthActiveSession from '../features/logging/screens/StrengthActiveSession'
import ExercisePicker from '../features/logging/screens/ExercisePicker'
import ExerciseHistory from '../features/logging/screens/ExerciseHistory'
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

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashWelcome />} />
      <Route path="/setup" element={<InitialSetupWizard />} />
      <Route
        path="/dashboard"
        element={
          <DesktopLayout>
            <DashboardHoy />
          </DesktopLayout>
        }
      />
      <Route
        path="/logging"
        element={
          <DesktopLayout>
            <DisciplineSelector />
          </DesktopLayout>
        }
      />
      <Route
        path="/logging/strength"
        element={
          <DesktopLayout>
            <StrengthActiveSession />
          </DesktopLayout>
        }
      />
      <Route
        path="/logging/strength/picker"
        element={
          <DesktopLayout>
            <ExercisePicker />
          </DesktopLayout>
        }
      />
      <Route
        path="/logging/strength/history"
        element={
          <DesktopLayout>
            <ExerciseHistory />
          </DesktopLayout>
        }
      />
      <Route
        path="/logging/combat"
        element={
          <DesktopLayout>
            <CombatLogForm />
          </DesktopLayout>
        }
      />
      <Route
        path="/analysis/strength"
        element={
          <DesktopLayout>
            <StrengthAnalysis />
          </DesktopLayout>
        }
      />
      <Route
        path="/analysis/combat"
        element={
          <DesktopLayout>
            <CombatLoadAnalysis />
          </DesktopLayout>
        }
      />
      <Route
        path="/analysis/consistency"
        element={
          <DesktopLayout>
            <ConsistencyMap />
          </DesktopLayout>
        }
      />
      <Route
        path="/history"
        element={
          <DesktopLayout>
            <MonthlyCalendar />
          </DesktopLayout>
        }
      />
      <Route
        path="/history/:date"
        element={
          <DesktopLayout>
            <DayDetail />
          </DesktopLayout>
        }
      />
      <Route
        path="/nutrition"
        element={
          <DesktopLayout>
            <NutritionDashboard />
          </DesktopLayout>
        }
      />
      <Route
        path="/nutrition/quick-add"
        element={
          <DesktopLayout>
            <QuickAddMeal />
          </DesktopLayout>
        }
      />
      <Route
        path="/nutrition/:date"
        element={
          <DesktopLayout>
            <DayNutritionDetail />
          </DesktopLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <DesktopLayout>
            <ProfileSettings />
          </DesktopLayout>
        }
      />
    </Routes>
  )
}
