'use client'

import React from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MonitorList } from '@/components/MonitorList'

const fetcher = () => api.getMonitors()
const incidentsFetcher = () => api.getIncidents()

export default function DashboardPage() {
  const { data: monitors } = useSWR('/monitors', fetcher, { refreshInterval: 10000 })
  const { data: incidents } = useSWR('/incidents', incidentsFetcher, { refreshInterval: 15000 })

  const totalMonitors = monitors?.length ?? 0
  const upMonitors = monitors?.filter((m: any) => m.status === 'UP').length ?? 0
  const downMonitors = monitors?.filter((m: any) => m.status === 'DOWN').length ?? 0
  const openIncidents = (incidents as any[])?.filter((i: any) => !i.resolvedAt).length ?? 0

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Good morning! Here's your monitoring overview.
          </p>
        </div>
        <Link href="/monitors/new">
          <Button className="gap-2 px-6 h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold">
            <Plus className="h-5 w-5" /> Create Monitor
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
             <Activity className="h-12 w-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Monitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMonitors}</div>
            <p className="text-xs text-muted-foreground mt-1">Configured endpoints</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-emerald-500/20 bg-emerald-500/[0.03] shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute top-0 right-0 p-3 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform">
             <CheckCircle className="h-12 w-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{upMonitors}</div>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-full h-1.5 bg-emerald-500/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${totalMonitors > 0 ? (upMonitors / totalMonitors) * 100 : 0}%` }}
                  />
               </div>
               <span className="text-[10px] whitespace-nowrap font-bold text-emerald-600/70">
                 {totalMonitors > 0 ? Math.round((upMonitors / totalMonitors) * 100) : 0}%
               </span>
            </div>
          </CardContent>
        </Card>

        <Card className={`relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${downMonitors > 0 ? 'border-destructive/20 bg-destructive/[0.03]' : 'border-border/50 bg-card'}`}>
          <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform ${downMonitors > 0 ? 'text-destructive' : ''}`}>
             <AlertTriangle className="h-12 w-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Down</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${downMonitors > 0 ? 'text-destructive' : ''}`}>{downMonitors}</div>
            <p className="text-xs text-muted-foreground mt-1">{downMonitors > 0 ? 'Action required immediately' : 'System nominal'}</p>
          </CardContent>
        </Card>

        <Card className={`relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${openIncidents > 0 ? 'border-orange-500/20 bg-orange-500/[0.03]' : 'border-border/50 bg-card'}`}>
          <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform ${openIncidents > 0 ? 'text-orange-500' : ''}`}>
             <Clock className="h-12 w-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider">Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${openIncidents > 0 ? 'text-orange-500' : ''}`}>{openIncidents}</div>
            <p className="text-xs mt-1">
              {openIncidents > 0 ? (
                <Link href="/incidents" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1">
                  View active <Plus className="h-3 w-3 rotate-45" />
                </Link>
              ) : (
                <span className="text-muted-foreground">All resolved</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monitor List Section */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your Monitors</h2>
          <div className="flex items-center gap-2">
             <span className="text-xs text-muted-foreground">Auto-refreshing every 10s</span>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
           <MonitorList />
        </div>
      </section>
    </div>
  )
}
