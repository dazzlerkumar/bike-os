import { useState } from "react"
import type { BaselineTelemetry } from "../types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Gauge, ChevronDown, ChevronUp } from "lucide-react"

interface BaselineCardProps {
  baseline: BaselineTelemetry
  onUpdateBaseline: (field: keyof BaselineTelemetry, value: string) => void
}

export function BaselineCard({ baseline, onUpdateBaseline }: BaselineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border border-border bg-card shadow-2xs overflow-hidden">
      <CardHeader
        onClick={() => setIsExpanded((prev) => !prev)}
        className="p-3.5 cursor-pointer hover:bg-muted/30 transition-colors flex flex-row items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-glacier-blue/20 text-glacier-blue-800 dark:text-glacier-blue-300">
            <Gauge className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Delivery Telemetry</CardTitle>
            <p className="text-[11px] text-muted-foreground font-mono">
              Odo: {baseline.odometer} km • Tyres: {baseline.frontTyrePressurePsi}/{baseline.rearTyrePressurePsi} PSI • Oil: {baseline.engineOilStatus.toUpperCase()}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? "Collapse telemetry" : "Expand telemetry"}
        >
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-3.5 pt-0 space-y-3 border-t border-border/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Odometer (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="100"
                  value={baseline.odometer}
                  onChange={(e) => onUpdateBaseline("odometer", e.target.value)}
                  placeholder="8"
                  className="w-full min-h-[42px] rounded-lg border border-border bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="absolute right-2.5 top-3 text-[11px] text-muted-foreground font-mono">
                  km
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Front Tyre (PSI)
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={baseline.frontTyrePressurePsi}
                  onChange={(e) => onUpdateBaseline("frontTyrePressurePsi", e.target.value)}
                  placeholder="29"
                  className="w-full min-h-[42px] rounded-lg border border-border bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="absolute right-2.5 top-3 text-[11px] text-muted-foreground font-mono">
                  PSI
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Rear Tyre (PSI)
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  value={baseline.rearTyrePressurePsi}
                  onChange={(e) => onUpdateBaseline("rearTyrePressurePsi", e.target.value)}
                  placeholder="33"
                  className="w-full min-h-[42px] rounded-lg border border-border bg-background px-3 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="absolute right-2.5 top-3 text-[11px] text-muted-foreground font-mono">
                  PSI
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block">
                Engine Oil Sight
              </label>
              <div className="flex gap-1 h-[42px]">
                {(["ok", "low", "unverified"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onUpdateBaseline("engineOilStatus", status)}
                    className={`flex-1 rounded-lg border text-[10px] font-mono uppercase transition-all touch-manipulation ${
                      baseline.engineOilStatus === status
                        ? status === "ok"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                          : status === "low"
                          ? "border-racing-red bg-racing-red/15 text-racing-red font-bold"
                          : "border-border bg-muted text-foreground font-semibold"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {status === "unverified" ? "Unchk" : status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
