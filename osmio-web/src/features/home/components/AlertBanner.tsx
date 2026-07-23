import { AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface AlertBannerProps {
  message: string
  type?: 'warning' | 'success' | 'info'
}

const icons = {
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
}

const styles = {
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
}

export function AlertBanner({ message, type = 'info' }: AlertBannerProps) {
  const Icon = icons[type]
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${styles[type]}`}>
      <Icon size={18} />
      <span>{message}</span>
    </div>
  )
}
