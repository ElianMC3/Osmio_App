import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { AppProviders } from './providers'

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  )
}
