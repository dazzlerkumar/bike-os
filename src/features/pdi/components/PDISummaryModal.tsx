import { useState } from "react"
import type { PDIInspectionSession } from "../types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Copy,
  Printer,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"

interface PDISummaryModalProps {
  isOpen: boolean
  session: PDIInspectionSession
  stats: {
    total: number
    passed: number
    flagged: number
    pending: number
    blockers: number
    majors: number
    minors: number
    progressPercent: number
    verdict: "hold" | "caution" | "ready" | "in_progress"
    flaggedList: Array<{
      sectionTitle: string
      sectionId: string
      item: {
        id: string
        title: string
        status: string
        severity?: "minor" | "major" | "blocker"
        defectNote?: string
      }
    }>
  }
  onClose: () => void
  onGenerateWhatsApp: () => string
}

export function PDISummaryModal({
  isOpen,
  session,
  stats,
  onClose,
  onGenerateWhatsApp,
}: PDISummaryModalProps) {
  const [copied, setCopied] = useState(false)
  const [bridged, setBridged] = useState(false)

  if (!isOpen) return null

  const handleCopyWhatsApp = async () => {
    const text = onGenerateWhatsApp()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleBridgeToProfile = () => {
    const bikeProfile = {
      make: session.vehicleDetails.make,
      model: session.vehicleDetails.model,
      variant: session.vehicleDetails.variant,
      dealership: session.vehicleDetails.dealership,
      deliveryDate: new Date().toISOString(),
      currentOdometer: Number(session.baseline.odometer) || 0,
      baselineFrontTyrePsi: Number(session.baseline.frontTyrePressurePsi) || 29,
      baselineRearTyrePsi: Number(session.baseline.rearTyrePressurePsi) || 33,
      flaggedDefectsCount: stats.flagged,
      inspectionSessionId: session.sessionId,
    }
    try {
      localStorage.setItem("bikeos_profile_v1", JSON.stringify(bikeProfile))
      setBridged(true)
      setTimeout(() => setBridged(false), 2500)
    } catch {
      // Storage unavailable
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-card text-card-foreground border-t sm:border border-border w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-250 print:border-none print:shadow-none print:max-h-none print:rounded-none">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-2.5 sm:hidden" />

        <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between gap-3 shrink-0 print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
                PDI Inspection Summary
              </h2>
              <Badge variant="outline" className="font-mono text-xs">
                {stats.progressPercent}% Checked
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {session.vehicleDetails.make} {session.vehicleDetails.model} • {session.vehicleDetails.dealership}
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg active:scale-95 transition-transform"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div
            className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3.5 ${
              stats.verdict === "hold"
                ? "bg-racing-red/10 border-racing-red/40 text-racing-red"
                : stats.verdict === "caution"
                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                : stats.verdict === "ready"
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                : "bg-muted/40 border-border text-foreground"
            }`}
          >
            {stats.verdict === "hold" ? (
              <ShieldAlert className="size-8 shrink-0 text-racing-red" />
            ) : (
              <ShieldCheck className="size-8 shrink-0" />
            )}
            <div className="space-y-0.5">
              <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-wide">
                {stats.verdict === "hold"
                  ? "Delivery Hold Recommended"
                  : stats.verdict === "caution"
                  ? "Caution: Issues Flagged For Rectification"
                  : stats.verdict === "ready"
                  ? "Ready For Handover & Gate Pass"
                  : "Inspection In Progress"}
              </h3>
              <p className="text-xs opacity-90 leading-relaxed">
                {stats.verdict === "hold"
                  ? `${stats.blockers} critical blocker(s) recorded. Refuse gate clearance until resolved.`
                  : stats.verdict === "caution"
                  ? `${stats.flagged} defect(s) logged. Request dealer rectification slip before signing.`
                  : stats.verdict === "ready"
                  ? "All verified checklist points passed without defects."
                  : `${stats.pending} items remain unverified.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl border border-border bg-muted/20 text-center">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                Done
              </span>
              <span className="font-heading text-base sm:text-lg font-bold text-foreground">
                {stats.passed + stats.flagged}/{stats.total}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-border bg-muted/20 text-center">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                Blockers
              </span>
              <span
                className={`font-heading text-base sm:text-lg font-bold ${
                  stats.blockers > 0 ? "text-racing-red" : "text-foreground"
                }`}
              >
                {stats.blockers}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-border bg-muted/20 text-center">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                Defects
              </span>
              <span className="font-heading text-base sm:text-lg font-bold text-foreground">
                {stats.flagged}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-border bg-muted/20 text-center">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                Odo
              </span>
              <span className="font-heading text-base sm:text-lg font-bold text-foreground font-mono">
                {session.baseline.odometer} km
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Flagged Defects For Dealer Action ({stats.flaggedList.length})
            </h4>

            {stats.flaggedList.length === 0 ? (
              <div className="p-5 rounded-xl border border-dashed border-border text-center space-y-1">
                <CheckCircle2 className="size-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-foreground">
                  Zero Defects Flagged
                </p>
                <p className="text-[11px] text-muted-foreground">
                  All inspected items passed showroom standards.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {stats.flaggedList.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-border bg-card space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-muted-foreground shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-foreground truncate">
                          {entry.sectionTitle}: {entry.item.title}
                        </span>
                      </div>
                      <Badge
                        variant={
                          entry.item.severity === "blocker"
                            ? "racing"
                            : entry.item.severity === "major"
                            ? "default"
                            : "glacier"
                        }
                        className="text-[10px] uppercase font-mono shrink-0"
                      >
                        {entry.item.severity || "Flagged"}
                      </Badge>
                    </div>
                    {entry.item.defectNote && (
                      <p className="text-xs font-mono text-muted-foreground bg-muted/40 p-2 rounded-lg">
                        {entry.item.defectNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-3.5 sm:p-5 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 print:hidden pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={handleCopyWhatsApp}
              className="min-h-[44px] rounded-xl text-xs font-semibold gap-1.5 touch-manipulation"
            >
              <Copy className="size-4 shrink-0" />
              <span>{copied ? "Copied!" : "WhatsApp Copy"}</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrint}
              className="min-h-[44px] rounded-xl text-xs font-semibold gap-1.5 touch-manipulation"
            >
              <Printer className="size-4 shrink-0" />
              <span>Print / PDF</span>
            </Button>
          </div>

          <Button
            variant="accent"
            size="lg"
            onClick={handleBridgeToProfile}
            className="w-full sm:w-auto min-h-[44px] rounded-xl text-xs font-bold gap-1.5 touch-manipulation shadow-sm"
          >
            <span>{bridged ? "Bike Profile Initialized!" : "Start Bike Logbook"}</span>
            <ArrowRight className="size-4 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  )
}
