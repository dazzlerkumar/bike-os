import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, RotateCcw } from "lucide-react"

interface PDIHeaderProps {
  vehicleDetails: {
    make: string
    model: string
    variant: string
    dealership: string
  }
  progressPercent: number
  passedCount: number
  flaggedCount: number
  totalCount: number
  isDark: boolean
  onToggleTheme: () => void
  onOpenSummary: () => void
  onReset: () => void
}

export function PDIHeader({
  vehicleDetails,
  progressPercent,
  passedCount,
  flaggedCount,
  totalCount,
  isDark,
  onToggleTheme,
  onReset,
}: PDIHeaderProps) {
  const handleResetConfirm = () => {
    if (window.confirm("Reset all inspection progress and start a fresh checklist?")) {
      onReset()
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-baseline gap-1.5 shrink-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              bikeOS
            </h1>
            <Badge variant="accent" className="text-[10px] font-mono px-1.5 py-0 h-4">
              PDI
            </Badge>
          </div>
          <span className="text-muted-foreground/40 text-xs hidden sm:inline">•</span>
          <p className="text-xs text-muted-foreground truncate hidden xs:block sm:block">
            {vehicleDetails.make} {vehicleDetails.model}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono bg-muted/50 px-2 py-1 rounded-md border border-border/60">
            <span className="text-emerald-500 font-semibold">{passedCount}P</span>
            {flaggedCount > 0 && (
              <span className="text-racing-red font-semibold">{flaggedCount}F</span>
            )}
            <span className="text-muted-foreground">/{totalCount}</span>
            <span className="text-muted-foreground/40">|</span>
            <span className="font-semibold text-foreground">{progressPercent}%</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            className="size-8 p-0 rounded-lg"
            title="Toggle dark/light theme"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetConfirm}
            className="size-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
            title="Reset inspection"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
