export type DefectSeverity = "minor" | "major" | "blocker"

export type InspectionItemStatus = "pending" | "passed" | "flagged"

export interface InspectionItem {
  id: string
  title: string
  description: string
  status: InspectionItemStatus
  severity?: DefectSeverity
  defectNote?: string
  isCrucial?: boolean
}

export interface InspectionSection {
  id: string
  title: string
  shortLabel: string
  description: string
  items: InspectionItem[]
}

export interface BaselineTelemetry {
  odometer: string
  chassisNumberScanned: string
  frontTyrePressurePsi: string
  rearTyrePressurePsi: string
  engineOilStatus: "ok" | "low" | "unverified"
  fuelLevelBars: string
}

export interface PDIInspectionSession {
  sessionId: string
  createdAt: string
  updatedAt: string
  vehicleDetails: {
    make: string
    model: string
    variant: string
    dealership: string
  }
  baseline: BaselineTelemetry
  sections: InspectionSection[]
}
