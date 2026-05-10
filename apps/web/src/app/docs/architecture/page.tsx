'use client'

import React from 'react'
import { Server, Shield, Database, Lock, Zap } from 'lucide-react'
import { DocLayout } from '@/components/docs/DocLayout'

export default function ArchitectureDoc() {
  return (
    <DocLayout 
      title="Architecture" 
      subtitle="Engineering" 
      category="Infrastructure"
    >
      <div className="space-y-16">
        <p className="text-xl leading-relaxed">
          A modular, scalable, and security-hardened infrastructure built for high-performance monitoring.
        </p>

        <section className="space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StackItem title="Frontend" content="Next.js 15, Tailwind 4, Lucide" />
            <StackItem title="Backend" content="Express, Node.js, Fastify" />
            <StackItem title="Database" content="PostgreSQL, Redis" />
            <StackItem title="ORM" content="Prisma" />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">Core Components</h2>
          
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-acid-lime/10 flex items-center justify-center border border-acid-lime/20 text-acid-lime">
                <Server className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-widest text-xs text-foreground">API Gateway</h4>
                <p className="text-sm leading-relaxed">
                  Central entry point for all frontend requests and external heartbeats. Features multi-layered rate limiting and secure HttpOnly cookie-based JWT sessions.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-acid-lime/10 flex items-center justify-center border border-acid-lime/20 text-acid-lime">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Worker Engine</h4>
                <p className="text-sm leading-relaxed">
                  Resilient background workers that handle missed heartbeat detection, analytics aggregation, and intelligence scoring without blocking the main API threads.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-acid-lime/10 flex items-center justify-center border border-acid-lime/20 text-acid-lime">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="font-black uppercase tracking-widest text-xs text-foreground">Security Layer</h4>
                <p className="text-sm leading-relaxed">
                  Implements AES-256-GCM for field-level encryption of sensitive configurations. All mutation actions are logged in an immutable audit trail.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  )
}

function StackItem({ title, content }: { title: string, content: string }) {
  return (
    <div className="p-6 rounded-2xl border border-border/10 bg-card/30">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-acid-lime mb-2">{title}</h4>
      <p className="text-sm font-bold text-foreground">{content}</p>
    </div>
  )
}
