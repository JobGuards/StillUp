'use client'

import React from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

const fetcher = () => api.getIncidents()

export default function IncidentsPage() {
  const { data: incidents, error, isLoading } = useSWR('/incidents', fetcher, {
    refreshInterval: 15000,
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground">
          View and manage all monitoring incidents.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex h-48 items-center justify-center text-destructive">
          Failed to load incidents.
        </div>
      )}

      {!isLoading && !error && incidents?.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center p-8">
          <CheckCircle className="mb-4 h-12 w-12 text-emerald-500 opacity-50" />
          <h3 className="text-lg font-semibold">No incidents</h3>
          <p className="text-sm text-muted-foreground">All your monitors are healthy. Great work!</p>
        </div>
      )}

      {!isLoading && !error && incidents && incidents.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead>Monitor</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident: any) => (
                <TableRow key={incident.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <IncidentTypeBadge type={incident.type} />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{incident.monitor?.name || incident.monitorId}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{incident.monitorId}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium">{formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true })}</div>
                    <div className="text-[10px] text-muted-foreground">{format(new Date(incident.startedAt), 'PPp')}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {incident.resolvedAt ? (
                      <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                        <CheckCircle className="h-3 w-3" />
                        {Math.floor((new Date(incident.resolvedAt).getTime() - new Date(incident.startedAt).getTime()) / 60000)}m
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-destructive animate-pulse font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        Ongoing
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {incident.resolvedAt ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Resolved</Badge>
                    ) : (
                      <Badge variant="destructive" className="shadow-sm shadow-destructive/20">Open</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function IncidentTypeBadge({ type }: { type: string }) {
  switch (type) {
    case 'missed':
      return <Badge variant="outline" className="gap-1 border-orange-500/20 bg-orange-500/10 text-orange-500"><Clock className="h-3 w-3" /> Missed</Badge>
    case 'failed':
      return <Badge variant="outline" className="gap-1 border-destructive/20 bg-destructive/10 text-destructive"><AlertTriangle className="h-3 w-3" /> Failed</Badge>
    case 'late':
      return <Badge variant="outline" className="gap-1 border-amber-500/20 bg-amber-500/10 text-amber-500"><Clock className="h-3 w-3" /> Late</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}
