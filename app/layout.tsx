import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/auth-context'
import { LangProvider } from '@/app/lang'

export const metadata: Metadata = {
  title: 'BG Affiliate Dashboard',
  description: 'Hệ thống quản lý BG Affiliate',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <LangProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  )
}
