'use client'

import React from 'react'
import { CheckCircle2, Zap, Shield, Search, ArrowRight } from 'lucide-react'
import { DocLayout } from '@/components/docs/DocLayout'

export default function IntroDoc() {
  return (
    <DocLayout 
      title="Introduction" 
      subtitle="The Vision" 
      category="Getting Started"
    >
      <div className="space-y-16">
        <p className="text-xl leading-relaxed">
          StillUp is an industry-leading, enterprise-grade heartbeat monitoring platform designed for modern, distributed infrastructure.
        </p>

        <section className="glass-panel border border-border/10 rounded-[2.5rem] p-10 bg-acid-lime/5">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-foreground">Why StillUp?</h3>
          <p className="mb-8 leading-relaxed">
            In a world of microservices and complex cloud environments, traditional monitoring often falls short. StillUp was built to solve the "Silent Failure" problem: services that are "technically up" but functionally unstable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureItem icon={<CheckCircle2 className="w-4 h-4" />} title="Intelligent Monitoring" />
            <FeatureItem icon={<Shield className="w-4 h-4" />} title="Security-First Architecture" />
            <FeatureItem icon={<Search className="w-4 h-4" />} title="Pattern Detection" />
            <FeatureItem icon={<Zap className="w-4 h-4" />} title="Premium UX" />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">Core Pillars</h2>
          <div className="grid gap-12">
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-3 text-acid-lime">01. Intelligent Monitoring</h4>
              <p className="leading-relaxed">
                Beyond binary status checks. StillUp calculates real-time **Health Scores** and detects **Recurring Failure Patterns** using historical data analysis.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-3 text-acid-lime">02. Security-First Architecture</h4>
              <p className="leading-relaxed">
                Built with security at the core. Featuring fine-grained RBAC, AES-256-GCM encryption for secrets, and comprehensive audit logs.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-widest text-xs mb-3 text-acid-lime">03. Premium UX</h4>
              <p className="leading-relaxed">
                A dashboard designed for clarity and speed. Glassmorphic UI, real-time heartbeat pulses, and rich notification integrations.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 pt-12 border-t border-border/10">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground" id="quick-start">Quick Start</h2>
          <p className="leading-relaxed">
            StillUp operates on a **Heartbeat Push** model. Instead of us polling your service, your service "pushes" a heartbeat to us via a simple POST request.
          </p>
          <div className="group relative p-8 bg-foreground/5 rounded-3xl border border-border/10 hover:border-acid-lime/30 transition-all">
            <code className="text-sm font-mono text-acid-lime">POST https://api.stillup.io/api/heartbeats</code>
            <div className="absolute right-8 top-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-acid-lime" />
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  )
}

function FeatureItem({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-acid-lime">{icon}</div>
      <span className="text-sm font-bold text-foreground/80">{title}</span>
    </div>
  )
}
