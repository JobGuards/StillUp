'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ModeToggle } from '@/components/ModeToggle'
import { Zap, Shield, Terminal, BookOpen, ChevronRight } from 'lucide-react'

interface DocLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  category?: string
}

export function DocLayout({ children, title, subtitle, category }: DocLayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { title: 'Introduction', href: '/docs/introduction', icon: <Zap className="w-4 h-4" /> },
    { title: 'Architecture', href: '/docs/architecture', icon: <Shield className="w-4 h-4" /> },
    { title: 'API Reference', href: '/docs/api-reference', icon: <Terminal className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-500 selection:bg-acid-lime selection:text-primary-foreground">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 p-8 border-r border-border/5 hidden lg:block h-screen sticky top-0 bg-[#f5f5f5]/50 dark:bg-[#0d0d0d]/50 backdrop-blur-xl">
          <div className="space-y-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-acid-lime flex items-center justify-center shadow-lg shadow-acid-lime/20 group-hover:scale-110 transition-transform">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-black tracking-tighter text-xl uppercase italic">StillUp</span>
            </Link>

            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-4">Core Documentation</h2>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        isActive 
                          ? 'bg-acid-lime text-primary-foreground shadow-lg shadow-acid-lime/10' 
                          : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {item.title}
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="pt-12 border-t border-border/5">
              <p className="text-[10px] font-bold text-muted-foreground/40 px-4">v1.0.0-alpha</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-20 flex items-center justify-between px-8 sm:px-16 lg:px-24 border-b border-border/5 sticky top-0 z-50 bg-[#fafafa]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-foreground">{category || 'Guide'}</span>
            </div>
            <ModeToggle />
          </header>

          <main className="p-8 sm:p-16 lg:p-24 max-w-4xl mx-auto w-full">
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="space-y-4">
                {subtitle && (
                  <div className="flex items-center gap-2 text-acid-lime">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{subtitle}</span>
                  </div>
                )}
                <h1 className="text-6xl font-black tracking-tighter text-foreground dark:text-[#f0f0f0] uppercase italic">
                  {title}
                </h1>
              </div>

              <div className="prose prose-invert max-w-none text-[#444] dark:text-[#aaa] leading-relaxed font-medium">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
