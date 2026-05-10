'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Check, Shield, Zap, Globe, Cpu } from 'lucide-react'
import { ModeToggle } from '@/components/ModeToggle'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for side projects and hobbies.',
      features: [
        'Up to 3 Monitors',
        '5 Minute Intervals',
        '7 Day History',
        'Email Alerts',
        'Public Status Page (StillUp branded)',
      ],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For growing startups and scaling apps.',
      features: [
        'Up to 50 Monitors',
        '30 Second Intervals',
        '90 Day History',
        'Slack & Discord Alerts',
        'Custom Public Slug',
        'Failure Pattern Analysis',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Advanced features for large-scale infra.',
      features: [
        'Unlimited Monitors',
        'Real-time Heartbeats',
        'Unlimited History',
        'Audit Logs API',
        'White-label Status Pages',
        'Dedicated Support',
      ],
      cta: 'Contact Sales',
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6 sm:p-24 selection:bg-acid-lime selection:text-primary-foreground relative">
      <div className="absolute top-8 right-8 z-50">
        <ModeToggle />
      </div>
      <div className="max-w-6xl mx-auto space-y-24">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acid-lime/10 border border-acid-lime/20">
            <Zap className="w-4 h-4 text-acid-lime" />
            <span className="text-xs font-black uppercase tracking-widest text-acid-lime">Fair Pricing</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground uppercase italic">
            Scale your <span className="text-acid-lime">Reliability</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            Choose the plan that fits your infrastructure. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-panel border-2 rounded-[3rem] p-10 flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                plan.highlight
                  ? 'border-acid-lime shadow-2xl shadow-acid-lime/10 bg-acid-lime/5'
                  : 'border-border/10 hover:border-foreground/20'
              }`}
            >
              <div className="space-y-4 mb-10">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">{plan.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-muted-foreground font-bold">/mo</span>}
                </div>
                <p className="text-muted-foreground font-medium">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-12">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-acid-lime/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-acid-lime" />
                    </div>
                    <span className="text-sm font-bold text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  plan.highlight
                    ? 'bg-acid-lime text-primary-foreground hover:scale-105 shadow-xl shadow-acid-lime/20'
                    : 'bg-foreground text-background hover:opacity-90'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* trust Section */}
        <div className="pt-24 border-t border-border/5 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <Shield className="w-8 h-8 text-acid-lime mx-auto md:mx-0" />
            <h3 className="text-xl font-black uppercase tracking-tight">Encrypted Secrets</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every webhook and API key is encrypted with AES-256-GCM. Your security is non-negotiable.
            </p>
          </div>
          <div className="space-y-4">
            <Globe className="w-8 h-8 text-acid-lime mx-auto md:mx-0" />
            <h3 className="text-xl font-black uppercase tracking-tight">Global Status</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Share your uptime with high-fidelity public status pages, optimized for all devices.
            </p>
          </div>
          <div className="space-y-4">
            <Cpu className="w-8 h-8 text-acid-lime mx-auto md:mx-0" />
            <h3 className="text-xl font-black uppercase tracking-tight">Pattern Intelligence</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We detect recurring failure windows automatically, so you can fix issues before they repeat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
