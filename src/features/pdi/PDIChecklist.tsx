import { useState } from "react"
import { usePDISession } from "./usePDISession"
import { PDIHeader } from "./components/PDIHeader"
import { SectionNav } from "./components/SectionNav"
import { PDISectionCard } from "./components/PDISectionCard"
import { BaselineCard } from "./components/BaselineCard"
import { DefectModal } from "./components/DefectModal"
import { PDISummaryModal } from "./components/PDISummaryModal"
import { MobileCockpitBar } from "./components/MobileCockpitBar"
import type { DefectSeverity, InspectionItem } from "./types"
import { CheckCheck, Filter, Layers, ListFilter } from "lucide-react"

interface PDIChecklistProps {
  isDark: boolean
  onToggleTheme: () => void
}

export function PDIChecklist({ isDark, onToggleTheme }: PDIChecklistProps) {
  const {
    session,
    stats,
    setItemStatus,
    setDefect,
    quickPassSection,
    updateBaseline,
    resetSession,
    generateWhatsAppMessage,
  } = usePDISession()

  const [activeSectionId, setActiveSectionId] = useState(session.sections[0]?.id || "papers")
  const [filterMode, setFilterMode] = useState<"all" | "flagged" | "pending">("all")
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"step" | "scroll">("step")

  const [defectModalTarget, setDefectModalTarget] = useState<{
    sectionId: string
    itemId: string
  } | null>(null)

  const currentSectionIndex = session.sections.findIndex((s) => s.id === activeSectionId)
  const activeSection = session.sections[currentSectionIndex] || session.sections[0]

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id)
    if (viewMode === "scroll") {
      const element = document.getElementById(`section-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      handleSelectSection(session.sections[currentSectionIndex - 1].id)
    }
  }

  const handleNextSection = () => {
    if (currentSectionIndex < session.sections.length - 1) {
      handleSelectSection(session.sections[currentSectionIndex + 1].id)
    }
  }

  const handleOpenDefectModal = (sectionId: string, itemId: string) => {
    setDefectModalTarget({ sectionId, itemId })
  }

  const handleCloseDefectModal = () => {
    setDefectModalTarget(null)
  }

  const handleSaveDefect = (severity: DefectSeverity, note: string) => {
    if (!defectModalTarget) return
    setDefect(defectModalTarget.sectionId, defectModalTarget.itemId, severity, note)
  }

  const currentDefectItem: { item: InspectionItem; sectionTitle: string } | null = (() => {
    if (!defectModalTarget) return null
    const sec = session.sections.find((s) => s.id === defectModalTarget.sectionId)
    const it = sec?.items.find((i) => i.id === defectModalTarget.itemId)
    if (!sec || !it) return null
    return { item: it, sectionTitle: sec.title }
  })()

  const handleQuickPassAll = () => {
    if (window.confirm("Mark all remaining pending items as passed?")) {
      session.sections.forEach((s) => quickPassSection(s.id))
    }
  }

  const displayedSections = (
    viewMode === "step" && activeSection ? [activeSection] : session.sections
  )
    .map((sec) => {
      if (filterMode === "flagged") {
        return {
          ...sec,
          items: sec.items.filter((item) => item.status === "flagged"),
        }
      }
      if (filterMode === "pending") {
        return {
          ...sec,
          items: sec.items.filter((item) => item.status === "pending"),
        }
      }
      return sec
    })
    .filter((sec) => sec.items.length > 0)

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 select-none touch-manipulation">
      <PDIHeader
        vehicleDetails={session.vehicleDetails}
        progressPercent={stats.progressPercent}
        passedCount={stats.passed}
        flaggedCount={stats.flagged}
        totalCount={stats.total}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onReset={resetSession}
      />

      <div className="sticky top-[48px] z-30 bg-background/95 backdrop-blur-md border-b border-border/70 py-1.5 px-3 sm:px-6">
        <SectionNav
          sections={session.sections}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          sectionMetrics={stats.sectionMetrics}
        />
      </div>

      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-3 space-y-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterMode === "all"
                  ? "bg-foreground text-background font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilterMode("pending")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterMode === "pending"
                  ? "bg-foreground text-background font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilterMode("flagged")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                filterMode === "flagged"
                  ? "bg-racing-red text-white font-semibold shadow-2xs"
                  : "text-racing-red hover:underline"
              }`}
            >
              Flagged ({stats.flagged})
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === "step" ? "scroll" : "step"))}
              className="min-h-[32px] px-2.5 rounded-lg border border-border bg-card text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-all active:scale-95"
              title="Toggle between single section step walkaround or continuous scroll"
            >
              {viewMode === "step" ? (
                <>
                  <Layers className="size-3.5 text-glacier-blue-600 dark:text-glacier-blue-300" />
                  <span>Step Mode</span>
                </>
              ) : (
                <>
                  <ListFilter className="size-3.5" />
                  <span>Scroll All</span>
                </>
              )}
            </button>

            {stats.pending > 0 && filterMode === "all" && (
              <button
                type="button"
                onClick={handleQuickPassAll}
                className="min-h-[32px] px-2 rounded-lg border border-border bg-card text-[11px] text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1"
                title="Mark all remaining items as passed"
              >
                <CheckCheck className="size-3.5 text-emerald-500" />
                <span>Pass All</span>
              </button>
            )}
          </div>
        </div>

        <BaselineCard
          baseline={session.baseline}
          onUpdateBaseline={updateBaseline}
        />

        <div className="space-y-4">
          {displayedSections.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-xl space-y-2">
              <Filter className="size-6 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground">
                No items in this group match filter "{filterMode}".
              </p>
              <button
                onClick={() => setFilterMode("all")}
                className="text-xs font-semibold text-glacier-blue underline"
              >
                Clear filter
              </button>
            </div>
          ) : (
            displayedSections.map((section) => (
              <PDISectionCard
                key={section.id}
                section={section}
                onSetItemStatus={setItemStatus}
                onOpenDefectModal={handleOpenDefectModal}
                onQuickPassSection={quickPassSection}
              />
            ))
          )}
        </div>
      </main>

      <MobileCockpitBar
        currentSectionIndex={currentSectionIndex >= 0 ? currentSectionIndex : 0}
        totalSections={session.sections.length}
        currentSectionLabel={activeSection?.shortLabel || "Group"}
        progressPercent={stats.progressPercent}
        passedCount={stats.passed}
        flaggedCount={stats.flagged}
        totalCount={stats.total}
        onPrevSection={handlePrevSection}
        onNextSection={handleNextSection}
        onOpenSummary={() => setIsSummaryOpen(true)}
      />

      <DefectModal
        isOpen={Boolean(defectModalTarget)}
        item={currentDefectItem?.item || null}
        sectionTitle={currentDefectItem?.sectionTitle || ""}
        onClose={handleCloseDefectModal}
        onSave={handleSaveDefect}
      />

      <PDISummaryModal
        isOpen={isSummaryOpen}
        session={session}
        stats={stats}
        onClose={() => setIsSummaryOpen(false)}
        onGenerateWhatsApp={generateWhatsAppMessage}
      />
    </div>
  )
}
