import { useState, useEffect, useMemo, useCallback } from "react"
import type {
  BaselineTelemetry,
  DefectSeverity,
  InspectionItemStatus,
  PDIInspectionSession,
} from "./types"
import { defaultSections } from "./defaultChecklist"

const STORAGE_KEY = "bikeos_pdi_session_v1"

const initialBaseline: BaselineTelemetry = {
  odometer: "8",
  chassisNumberScanned: "",
  frontTyrePressurePsi: "29",
  rearTyrePressurePsi: "33",
  engineOilStatus: "ok",
  fuelLevelBars: "2",
}

function createInitialSession(): PDIInspectionSession {
  return {
    sessionId: `pdi-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehicleDetails: {
      make: "Royal Enfield",
      model: "Guerrilla 450",
      variant: "Flash / Brava Blue",
      dealership: "HSR Layout Motors",
    },
    baseline: initialBaseline,
    sections: defaultSections,
  }
}

export function usePDISession() {
  const [session, setSession] = useState<PDIInspectionSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as PDIInspectionSession
        if (parsed?.sections?.length) {
          return parsed
        }
      }
    } catch {
      // Fallback to default
    }
    return createInitialSession()
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      // Storage unavailable or full
    }
  }, [session])

  const setItemStatus = useCallback(
    (sectionId: string, itemId: string, status: InspectionItemStatus) => {
      setSession((prev) => {
        const nextSections = prev.sections.map((sec) => {
          if (sec.id !== sectionId) return sec
          return {
            ...sec,
            items: sec.items.map((item) => {
              if (item.id !== itemId) return item
              return {
                ...item,
                status,
                ...(status !== "flagged"
                  ? { severity: undefined, defectNote: undefined }
                  : {}),
              }
            }),
          }
        })
        return { ...prev, sections: nextSections, updatedAt: new Date().toISOString() }
      })
    },
    []
  )

  const setDefect = useCallback(
    (
      sectionId: string,
      itemId: string,
      severity: DefectSeverity,
      defectNote: string
    ) => {
      setSession((prev) => {
        const nextSections = prev.sections.map((sec) => {
          if (sec.id !== sectionId) return sec
          return {
            ...sec,
            items: sec.items.map((item) => {
              if (item.id !== itemId) return item
              return {
                ...item,
                status: "flagged" as const,
                severity,
                defectNote,
              }
            }),
          }
        })
        return { ...prev, sections: nextSections, updatedAt: new Date().toISOString() }
      })
    },
    []
  )

  const quickPassSection = useCallback((sectionId: string) => {
    setSession((prev) => {
      const nextSections = prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec
        return {
          ...sec,
          items: sec.items.map((item) =>
            item.status === "pending" ? { ...item, status: "passed" as const } : item
          ),
        }
      })
      return { ...prev, sections: nextSections, updatedAt: new Date().toISOString() }
    })
  }, [])

  const updateBaseline = useCallback(
    (field: keyof BaselineTelemetry, value: string) => {
      setSession((prev) => ({
        ...prev,
        baseline: {
          ...prev.baseline,
          [field]: value,
        },
        updatedAt: new Date().toISOString(),
      }))
    },
    []
  )

  const updateVehicleDetails = useCallback(
    (field: keyof PDIInspectionSession["vehicleDetails"], value: string) => {
      setSession((prev) => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [field]: value,
        },
        updatedAt: new Date().toISOString(),
      }))
    },
    []
  )

  const resetSession = useCallback(() => {
    const fresh = createInitialSession()
    setSession(fresh)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignored
    }
  }, [])

  const stats = useMemo(() => {
    let total = 0
    let passed = 0
    let flagged = 0
    let pending = 0
    let blockers = 0
    let majors = 0
    let minors = 0

    const sectionMetrics: Record<
      string,
      { total: number; passed: number; flagged: number; pending: number; isComplete: boolean }
    > = {}

    const flaggedList: Array<{
      sectionTitle: string
      sectionId: string
      item: (typeof defaultSections)[0]["items"][0]
    }> = []

    for (const sec of session.sections) {
      let secPassed = 0
      let secFlagged = 0
      let secPending = 0

      for (const item of sec.items) {
        total++
        if (item.status === "passed") {
          passed++
          secPassed++
        } else if (item.status === "flagged") {
          flagged++
          secFlagged++
          if (item.severity === "blocker") blockers++
          if (item.severity === "major") majors++
          if (item.severity === "minor") minors++
          flaggedList.push({
            sectionTitle: sec.title,
            sectionId: sec.id,
            item,
          })
        } else {
          pending++
          secPending++
        }
      }

      sectionMetrics[sec.id] = {
        total: sec.items.length,
        passed: secPassed,
        flagged: secFlagged,
        pending: secPending,
        isComplete: secPending === 0,
      }
    }

    const progressPercent = total > 0 ? Math.round(((passed + flagged) / total) * 100) : 0

    let verdict: "hold" | "caution" | "ready" | "in_progress" = "in_progress"
    if (blockers > 0) {
      verdict = "hold"
    } else if (flagged > 0) {
      verdict = "caution"
    } else if (pending === 0 && total > 0) {
      verdict = "ready"
    }

    return {
      total,
      passed,
      flagged,
      pending,
      blockers,
      majors,
      minors,
      progressPercent,
      sectionMetrics,
      flaggedList,
      verdict,
    }
  }, [session.sections])

  const generateWhatsAppMessage = useCallback(() => {
    const { vehicleDetails, baseline } = session
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

    const lines: string[] = [
      `*bikeOS PDI Inspection Report* - ${dateStr}`,
      `*Vehicle:* ${vehicleDetails.make} ${vehicleDetails.model} (${vehicleDetails.variant})`,
      `*Dealership:* ${vehicleDetails.dealership}`,
      `*Odometer Reading:* ${baseline.odometer} km`,
      `*Overall Status:* ${stats.verdict.toUpperCase()}`,
      `*Items Inspected:* ${stats.passed + stats.flagged}/${stats.total} (${stats.flagged} flagged)`,
      "",
    ]

    if (stats.flaggedList.length > 0) {
      lines.push("*FLAGGED ISSUES FOR DEALER ACTION:*")
      stats.flaggedList.forEach((entry, idx) => {
        const severityTag = (entry.item.severity || "UNSPECIFIED").toUpperCase()
        const note = entry.item.defectNote ? ` - "${entry.item.defectNote}"` : ""
        lines.push(`${idx + 1}. [${severityTag}] ${entry.sectionTitle}: ${entry.item.title}${note}`)
      })
      lines.push("")
      lines.push("Please acknowledge and rectify these points prior to delivery handover.")
    } else {
      lines.push("All verified checklist points passed without defects.")
    }

    return lines.join("\n")
  }, [session, stats])

  return {
    session,
    stats,
    setItemStatus,
    setDefect,
    quickPassSection,
    updateBaseline,
    updateVehicleDetails,
    resetSession,
    generateWhatsAppMessage,
  }
}
