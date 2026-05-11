'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { ShieldCheck, ArrowRight, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function GuardsPage() {
  const [executions, setExecutions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGuardedExecutions()
      .then(setExecutions)
      .catch(err => console.error('Failed to fetch executions', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-acid-lime/10 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-acid-lime" />
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Guarded Replays</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Track and audit your background job side-effects. ReplayGuard ensures that retrying failed jobs is safe by preventing duplicate operations.
        </p>
      </div>

      <div className="glass-panel overflow-hidden border border-border/10 rounded-[2rem] bg-background/20 backdrop-blur-3xl shadow-2xl shadow-black/40">
        <div className="p-6 border-b border-border/5 bg-foreground/[0.02]">
          <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Executions
          </h2>
        </div>

        <div className="divide-y divide-border/5">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-acid-lime/30 border-t-acid-lime rounded-full animate-spin" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Scanning Sentinel Logs...</span>
            </div>
          ) : executions.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center gap-6 text-center">
              <div className="p-4 bg-secondary/30 rounded-full">
                <AlertCircle className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-foreground">No guarded executions detected</h3>
                <p className="text-sm text-muted-foreground ">Integrate the @stillup/guard-sdk into your background jobs to enable replay safety.</p>
              </div>
              <Link href="/docs/replay-guard" className="bg-foreground text-background px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                View SDK Docs
              </Link>
            </div>
          ) : (
            executions.map((exe) => (
              <div key={exe.id} className="p-6 hover:bg-foreground/[0.02] transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl border ${
                      exe.status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/20' : 
                      exe.status === 'FAILED' ? 'bg-red-500/10 border-red-500/20' : 
                      'bg-acid-lime/10 border-acid-lime/20'
                    }`}>
                      {exe.status === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                       exe.status === 'FAILED' ? <XCircle className="w-5 h-5 text-red-500" /> : 
                       <Clock className="w-5 h-5 text-acid-lime" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground group-hover:text-acid-lime transition-colors">{exe.monitor?.name || 'Untitled Job'}</h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-foreground/5 text-muted-foreground uppercase tracking-tighter">Attempt #{exe.attempt}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-medium text-muted-foreground">{format(new Date(exe.startedAt), 'MMM d, h:mm a')}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] font-bold text-acid-lime uppercase tracking-widest">{exe._count?.sideEffects || 0} Side Effects Guarded</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">External ID</div>
                      <code className="text-[10px] font-mono bg-foreground/5 px-2 py-1 rounded text-foreground/70">{exe.externalId || 'N/A'}</code>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-acid-lime transition-all" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          label="Total Guards" 
          value={executions.length.toString()} 
          description="Active sentinel protections"
        />
        <StatsCard 
          label="Duplicates Blocked" 
          value="0" 
          description="Potential double-executions saved"
        />
        <StatsCard 
          label="Safety Score" 
          value="100%" 
          description="Overall runtime reliability"
        />
      </div>
    </div>
  )
}

function StatsCard({ label, value, description }: { label: string, value: string, description: string }) {
  return (
    <div className="glass-panel p-6 border border-border/10 rounded-3xl bg-background/20 backdrop-blur-2xl hover:border-acid-lime/20 transition-colors">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
      <div className="text-4xl font-black mt-2 text-foreground tracking-tighter">{value}</div>
      <p className="text-[10px] font-medium text-muted-foreground/60 mt-2">{description}</p>
    </div>
  )
}
