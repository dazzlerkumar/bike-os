import type { InspectionItem, InspectionItemStatus } from "../types"
import { Badge } from "@/components/ui/badge"
import { Check, AlertTriangle, RotateCcw, Edit3 } from "lucide-react"

interface PDIItemRowProps {
  item: InspectionItem
  onSetStatus: (status: InspectionItemStatus) => void
  onOpenDefectModal: () => void
}

export function PDIItemRow({
  item,
  onSetStatus,
  onOpenDefectModal,
}: PDIItemRowProps) {
  const isPassed = item.status === "passed"
  const isFlagged = item.status === "flagged"

  return (
    <article
      className={`p-3.5 sm:p-4 rounded-xl border transition-all space-y-3 ${
        isPassed
          ? "bg-muted/20 border-emerald-500/30 dark:border-emerald-500/20"
          : isFlagged
          ? "bg-racing-red/5 border-racing-red/40 dark:border-racing-red/30"
          : "bg-card border-border shadow-2xs hover:border-border/80"
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-sm leading-snug ${
                isPassed ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {item.title}
            </h3>
            {item.isCrucial && (
              <Badge variant="polar" className="text-[10px] uppercase font-mono tracking-wider h-4">
                Crucial
              </Badge>
            )}
          </div>

          {isFlagged && item.severity && (
            <Badge
              variant={
                item.severity === "blocker"
                  ? "racing"
                  : item.severity === "major"
                  ? "default"
                  : "glacier"
              }
              className="text-[10px] uppercase font-mono tracking-wider"
            >
              {item.severity}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
      </div>

      <div>
        {item.status === "pending" ? (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onSetStatus("passed")}
              className="min-h-[42px] px-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-xs flex items-center justify-center gap-1.5 active:bg-emerald-500/25 active:scale-98 transition-all touch-manipulation"
            >
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>Pass</span>
            </button>
            <button
              type="button"
              onClick={onOpenDefectModal}
              className="min-h-[42px] px-3 rounded-lg border border-racing-red/40 bg-racing-red/10 text-racing-red font-medium text-xs flex items-center justify-center gap-1.5 active:bg-racing-red/25 active:scale-98 transition-all touch-manipulation"
            >
              <AlertTriangle className="size-4 text-racing-red shrink-0" />
              <span>Flag Defect</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 pt-1">
            {isPassed && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/25">
                <Check className="size-4 shrink-0" />
                <span>Verified Satisfactory</span>
              </div>
            )}

            {isFlagged && (
              <button
                type="button"
                onClick={onOpenDefectModal}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-racing-red bg-racing-red/10 px-3 py-1.5 rounded-lg border border-racing-red/30 active:scale-98 transition-all touch-manipulation"
              >
                <Edit3 className="size-3.5 shrink-0" />
                <span>Edit Defect Note</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSetStatus("pending")}
              title="Reset to pending"
              className="min-h-[36px] min-w-[36px] flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-all p-1.5 rounded-lg border border-border bg-background touch-manipulation"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {isFlagged && item.defectNote && (
        <div className="pt-2 border-t border-racing-red/20 text-xs font-mono bg-racing-red/5 p-2.5 rounded-lg text-foreground/90">
          <span className="font-bold text-racing-red uppercase text-[10px] mr-1.5">
            Note:
          </span>
          {item.defectNote}
        </div>
      )}
    </article>
  )
}
