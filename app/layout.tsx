import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ColorThemeProvider } from '@/components/color-theme-provider'
import { AppSidebar } from '@/components/app-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Panel de Administracion',
  description: 'Sistema de gestion de activos y prestamos',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#111114' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <TooltipProvider delayDuration={0}>
              <div className="flex min-h-screen">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
            </TooltipProvider>
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
