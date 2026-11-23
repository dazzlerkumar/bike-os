import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

interface MobileCockpitBarProps {
  currentSectionIndex: number
  totalSections: number
  currentSectionLabel: string
  progressPercent: number
  passedCount: number
  flaggedCount: number
  totalCount: number
  onPrevSection: () => void
  onNextSection: () => void
  onOpenSummary: () => void
}

export function MobileCockpitBar({
  currentSectionIndex,
  totalSections,
  currentSectionLabel,
  progressPercent,
  passedCount,
  flaggedCount,
  totalCount,
  onPrevSection,
  onNextSection,
  onOpenSummary,
}: MobileCockpitBarProps) {
  const isFirst = currentSectionIndex === 0
  const isLast = currentSectionIndex === totalSections - 1

  return (
    <aside
      aria-label="Mobile Cockpit Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl transition-colors pb-[env(safe-area-inset-bottom)]"
    >
      <div className="h-1 w-full bg-muted overflow-hidden flex">
        <div
          className="bg-emerald-500 transition-all duration-300"
          style={{ width: `${(passedCount / totalCount) * 100}%` }}
        />
        <div
          className="bg-racing-red transition-all duration-300"
          style={{ width: `${(flaggedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevSection}
            disabled={isFirst}
            className="h-10 w-9 p-0 rounded-lg text-muted-foreground disabled:opacity-30"
            title="Previous group"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <div className="px-1.5 text-center min-w-[70px]">
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Group {currentSectionIndex + 1}/{totalSections}
            </span>
            <span className="text-xs font-semibold text-foreground truncate max-w-[85px] block">
              {currentSectionLabel}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onNextSection}
            disabled={isLast}
            className="h-10 w-9 p-0 rounded-lg text-muted-foreground disabled:opacity-30"
            title="Next group"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {flaggedCount > 0 && (
            <Badge variant="accent" className="h-8 px-2 text-xs font-mono font-bold">
              {flaggedCount} Flagged
            </Badge>
          )}

          <Button
            variant="accent"
            size="sm"
            onClick={onOpenSummary}
            className="h-10 px-3.5 rounded-lg text-xs font-semibold gap-1.5 shadow-sm active:scale-98"
          >
            <FileText className="size-4" />
            <span>Summary ({progressPercent}%)</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
