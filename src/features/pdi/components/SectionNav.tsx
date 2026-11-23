import { useEffect, useRef } from "react"
import type { InspectionSection } from "../types"
import { AlertCircle, Check } from "lucide-react"

interface SectionNavProps {
  sections: InspectionSection[]
  activeSectionId: string
  onSelectSection: (id: string) => void
  sectionMetrics: Record<
    string,
    { total: number; passed: number; flagged: number; pending: number; isComplete: boolean }
  >
}

export function SectionNav({
  sections,
  activeSectionId,
  onSelectSection,
  sectionMetrics,
}: SectionNavProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(
      `[data-section-id="${activeSectionId}"]`
    ) as HTMLElement | null
    if (activeEl && containerRef.current) {
      const container = containerRef.current
      const scrollLeft =
        activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeSectionId])

  return (
    <nav
      ref={containerRef}
      className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none snap-x px-0.5"
    >
      {sections.map((section) => {
        const metric = sectionMetrics[section.id]
        const isActive = activeSectionId === section.id
        const isComplete = metric?.isComplete
        const hasFlag = (metric?.flagged || 0) > 0

        return (
          <button
            key={section.id}
            data-section-id={section.id}
            onClick={() => onSelectSection(section.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border snap-center shrink-0 min-h-[36px] touch-manipulation ${
              isActive
                ? "bg-foreground text-background border-foreground shadow-sm font-semibold scale-102"
                : isComplete
                ? hasFlag
                  ? "border-racing-red/40 bg-racing-red/10 text-racing-red"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-97"
            }`}
          >
            {hasFlag ? (
              <AlertCircle className="size-3 text-racing-red shrink-0" />
            ) : isComplete ? (
              <Check className="size-3 text-emerald-500 shrink-0" />
            ) : null}
            <span>{section.shortLabel}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive
                  ? "bg-background/25 text-background font-bold"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {metric ? `${metric.passed + metric.flagged}/${metric.total}` : ""}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
