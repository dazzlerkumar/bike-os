import type { InspectionItemStatus, InspectionSection } from "../types"
import { PDIItemRow } from "./PDIItemRow"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCheck } from "lucide-react"

interface PDISectionCardProps {
  section: InspectionSection
  onSetItemStatus: (sectionId: string, itemId: string, status: InspectionItemStatus) => void
  onOpenDefectModal: (sectionId: string, itemId: string) => void
  onQuickPassSection: (sectionId: string) => void
}

export function PDISectionCard({
  section,
  onSetItemStatus,
  onOpenDefectModal,
  onQuickPassSection,
}: PDISectionCardProps) {
  const total = section.items.length
  const passed = section.items.filter((i) => i.status === "passed").length
  const flagged = section.items.filter((i) => i.status === "flagged").length
  const pending = total - (passed + flagged)
  const isAllComplete = pending === 0

  return (
    <section
      id={`section-${section.id}`}
      className="scroll-mt-36 rounded-xl border border-border bg-card shadow-xs overflow-hidden transition-all"
    >
      <div className="p-4 sm:p-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
              {section.title}
            </h2>
            <Badge
              variant={isAllComplete ? (flagged > 0 ? "accent" : "polar") : "outline"}
              className="text-xs font-mono"
            >
              {passed + flagged}/{total} Done
            </Badge>
            {flagged > 0 && (
              <Badge variant="accent" className="text-[10px] font-mono">
                {flagged} Flagged
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{section.description}</p>
        </div>

        {pending > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuickPassSection(section.id)}
            className="text-xs self-start sm:self-auto gap-1.5 h-8"
          >
            <CheckCheck className="size-3.5 text-emerald-500" />
            <span>Pass Remaining ({pending})</span>
          </Button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-2.5">
        {section.items.map((item) => (
          <PDIItemRow
            key={item.id}
            item={item}
            onSetStatus={(status) => onSetItemStatus(section.id, item.id, status)}
            onOpenDefectModal={() => onOpenDefectModal(section.id, item.id)}
          />
        ))}
      </div>
    </section>
  )
}
