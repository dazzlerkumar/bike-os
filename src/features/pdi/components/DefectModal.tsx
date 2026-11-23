import { useState, useEffect } from "react"
import type { DefectSeverity, InspectionItem } from "../types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X } from "lucide-react"

interface DefectModalProps {
  isOpen: boolean
  item: InspectionItem | null
  sectionTitle: string
  onClose: () => void
  onSave: (severity: DefectSeverity, note: string) => void
}

const COMMON_TAGS = [
  "Scratch / paint rub",
  "Misaligned fitment",
  "Loose bolt / fastener",
  "Low fluid level",
  "Paperwork typo",
  "Fluid weeping / leak",
]

export function DefectModal({
  isOpen,
  item,
  sectionTitle,
  onClose,
  onSave,
}: DefectModalProps) {
  const [severity, setSeverity] = useState<DefectSeverity>("major")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (item) {
      setSeverity(item.severity || "major")
      setNote(item.defectNote || "")
    }
  }, [item])

  if (!isOpen || !item) return null

  const handleSave = () => {
    onSave(severity, note.trim())
    onClose()
  }

  const handleTagClick = (tag: string) => {
    setNote((prev) => (prev ? `${prev}, ${tag}` : tag))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-card text-card-foreground border-t sm:border border-border w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto sm:hidden" />

        <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-racing-red/15 text-racing-red shrink-0">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {sectionTitle}
              </p>
              <h3 className="font-heading text-base font-bold leading-tight text-foreground">
                {item.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg active:scale-95 transition-transform"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Defect Severity Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSeverity("minor")}
              className={`min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all touch-manipulation ${
                severity === "minor"
                  ? "border-glacier-blue bg-glacier-blue/15 text-foreground ring-2 ring-glacier-blue/60 font-bold"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <span>Minor</span>
              <span className="text-[10px] opacity-75 font-normal">Cosmetic</span>
            </button>

            <button
              type="button"
              onClick={() => setSeverity("major")}
              className={`min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all touch-manipulation ${
                severity === "major"
                  ? "border-amber-500 bg-amber-500/15 text-amber-500 ring-2 ring-amber-500/60 font-bold dark:text-amber-400"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <span>Major</span>
              <span className="text-[10px] opacity-75 font-normal">Dealer Fix</span>
            </button>

            <button
              type="button"
              onClick={() => setSeverity("blocker")}
              className={`min-h-[48px] flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all touch-manipulation ${
                severity === "blocker"
                  ? "border-racing-red bg-racing-red/15 text-racing-red ring-2 ring-racing-red/60 font-bold"
                  : "border-border bg-background hover:bg-muted text-muted-foreground"
              }`}
            >
              <span>Blocker</span>
              <span className="text-[10px] opacity-75 font-normal">Refuse Bike</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Quick Preset Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer active:scale-95 text-xs py-1 px-2.5 rounded-lg border-border bg-background font-normal"
                onClick={() => handleTagClick(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
            Defect Observation Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe defect clearly (e.g. Scuff mark on front mudguard tip, dealer promised polish before delivery)."
            rows={3}
            className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-sans"
          />
        </div>

        <div className="pt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex-1 min-h-[46px] rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            variant="accent"
            size="lg"
            onClick={handleSave}
            className="flex-1 min-h-[46px] rounded-xl text-xs font-semibold shadow-sm"
          >
            Save Observation
          </Button>
        </div>
      </div>
    </div>
  )
}
