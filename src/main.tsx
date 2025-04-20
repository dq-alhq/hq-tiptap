import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/app.tsx'
import { Providers } from '@/components/providers.tsx'
import { ToastProvider } from '@/components/ui'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Providers>
            <ToastProvider />
            <App />
        </Providers>
    </StrictMode>,
)
