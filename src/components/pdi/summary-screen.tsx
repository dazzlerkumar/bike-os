"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  HelpCircle,
  Printer,
  Share2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  ChecklistItemDef,
  InspectionRecord,
  ZoneDef,
} from "@/lib/pdi-data";
import { itemAppliesToSetup } from "@/lib/pdi-data";

interface SummaryScreenProps {
  inspection: InspectionRecord;
  zones: ZoneDef[];
  onBackToChecklist: () => void;
  onJumpToItem: (itemId: string, zoneId: string) => void;
  onStartNewInspection: () => void;
}

export function SummaryScreen({
  inspection,
  zones,
  onBackToChecklist,
  onJumpToItem,
  onStartNewInspection,
}: SummaryScreenProps) {
  const [copied, setCopied] = useState(false);
  const [showSkipped, setShowSkipped] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const allVisibleItems: ChecklistItemDef[] = [];
  for (const zone of zones) {
    for (const item of zone.items) {
      if (itemAppliesToSetup(item, inspection.setup)) {
        allVisibleItems.push(item);
      }
    }
  }

  const totalVisible = allVisibleItems.length;
  const answers = inspection.answers || {};

  const okItems = allVisibleItems.filter((i) => answers[i.id]?.state === "ok");
  const issueItems = allVisibleItems.filter(
    (i) => answers[i.id]?.state === "issue",
  );
  const naItems = allVisibleItems.filter((i) => answers[i.id]?.state === "na");
  const uncheckedItems = allVisibleItems.filter(
    (i) => !answers[i.id]?.state || answers[i.id]?.state === "unanswered",
  );

  const isAllAnswered = uncheckedItems.length === 0;
  const hasIssues = issueItems.length > 0;

  let headlineStatus: "not_finished" | "issues_to_resolve" | "all_clear";
  if (!isAllAnswered) {
    headlineStatus = "not_finished";
  } else if (hasIssues) {
    headlineStatus = "issues_to_resolve";
  } else {
    headlineStatus = "all_clear";
  }

  const chassisAnswer = answers["paperwork-chassis"]?.value;
  const engineAnswer = answers["paperwork-engine"]?.value;
  const odoAnswer = answers["controls-odometer-reading"]?.value;
  const frontTyrePressure = answers["front-tyre-pressure"]?.value;
  const rearTyrePressure = answers["rear-tyre-pressure"]?.value;
  const oilLevelAnswer = answers["engine-oil-level"]?.value;
  const freeServiceAnswer = answers["fuel-free-service"]?.value;

  const mustFixIssues = issueItems.filter(
    (i) => answers[i.id]?.severity === "fix_before_delivery",
  );
  const inWritingIssues = issueItems.filter(
    (i) => answers[i.id]?.severity === "get_in_writing",
  );
  const cosmeticIssues = issueItems.filter(
    (i) => answers[i.id]?.severity === "cosmetic",
  );
  const otherIssues = issueItems.filter(
    (i) =>
      !answers[i.id]?.severity ||
      (answers[i.id]?.severity !== "fix_before_delivery" &&
        answers[i.id]?.severity !== "get_in_writing" &&
        answers[i.id]?.severity !== "cosmetic"),
  );

  const generateDealerText = () => {
    const dateStr = new Date(inspection.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const lines: string[] = [
      `*PDI Delivery Inspection Report - ${inspection.bikeModel || "New Vehicle"}*`,
      `Date: ${dateStr}`,
    ];

    if (chassisAnswer) lines.push(`Chassis VIN: ${chassisAnswer}`);
    if (engineAnswer) lines.push(`Engine No: ${engineAnswer}`);
    if (odoAnswer) lines.push(`Starting Odometer: ${odoAnswer} km`);

    lines.push("");

    if (issueItems.length === 0) {
      lines.push(
        "Status: ALL CHECKS PASSED. Vehicle cleared for customer acceptance.",
      );
    } else {
      lines.push(
        `*Flagged Defects Requiring Dealer Endorsement (${issueItems.length}):*`,
      );
      issueItems.forEach((item, idx) => {
        const ans = answers[item.id];
        const severityLabel =
          ans?.severity === "fix_before_delivery"
            ? "FIX BEFORE DELIVERY"
            : ans?.severity === "get_in_writing"
              ? "GET IN WRITING"
              : ans?.severity === "cosmetic"
                ? "COSMETIC"
                : "FLAGGED";
        const note = ans?.note ? `: "${ans.note}"` : "";
        lines.push(`${idx + 1}. ${item.label} [${severityLabel}]${note}`);
      });
      lines.push("");
      lines.push(
        "Please confirm rectification or endorse on the gate pass with dealer stamp before handover.",
      );
    }

    lines.push("");
    lines.push("Generated via tripmeter Pre-Delivery Inspection.");
    return lines.join("\n");
  };

  const handleShareReport = async () => {
    const text = generateDealerText();
    const title = `PDI Report - ${inspection.bikeModel || "New Vehicle"}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
        });
        return;
      } catch {
        // Fallback to clipboard & WhatsApp
      }
    }

    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full px-4 py-6 sm:py-8 print:p-0 print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onBackToChecklist}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Checklist</span>
        </button>

        <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider">
          <span className="size-2 rounded-full bg-racing-red" />
          <span className="font-bold text-foreground">tripmeter</span>
        </div>
      </div>

      <div className="hidden print:block border-b-2 border-black pb-4 mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">
            tripmeter • Pre-Delivery Inspection (PDI) Certificate
          </h1>
          <span className="font-mono text-xs font-bold uppercase">
            Official Report
          </span>
        </div>
        <p className="text-xs text-gray-700 mt-1">
          Vehicle: <strong>{inspection.bikeModel || "New Motorcycle"}</strong> |
          Date:{" "}
          {new Date(inspection.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div
        className={`rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 shadow-xs bg-glacier-blue/10`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Delivery Handover Verdict
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {headlineStatus === "all_clear" && "Clearance: Approved to Sign"}
              {headlineStatus === "issues_to_resolve" &&
                "Clearance: Hold — Rectify Before Signing"}
              {headlineStatus === "not_finished" &&
                "Clearance: Inspection Incomplete"}
            </h2>
          </div>

          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold ${
              headlineStatus === "all_clear"
                ? "bg-glacier-blue text-slate-950 shadow-xs"
                : headlineStatus === "issues_to_resolve"
                  ? "bg-racing-red text-white shadow-md shadow-racing-red/25"
                  : "bg-muted text-foreground"
            }`}
          >
            {headlineStatus === "all_clear" && (
              <CheckCircle2 className="size-6" />
            )}
            {headlineStatus === "issues_to_resolve" && (
              <AlertTriangle className="size-6 text-white" />
            )}
            {headlineStatus === "not_finished" && (
              <FileCheck2 className="size-6" />
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
          {headlineStatus === "all_clear" &&
            "Every visible item has been inspected and verified with zero recorded defects. You can safely proceed with signing the dealer delivery note."}
          {headlineStatus === "issues_to_resolve" &&
            "Do not sign the delivery gate pass until these flagged defects are resolved or officially endorsed in writing with the dealer stamp."}
          {headlineStatus === "not_finished" &&
            `${uncheckedItems.length} checks remain uninspected. Signing the gate pass now relieves the dealership of legal responsibility for undiscovered flaws.`}
        </p>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/60 text-center font-mono text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px]">TOTAL</span>
            <span className="font-bold text-foreground">{totalVisible}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px]">VERIFIED</span>
            <span className="font-bold text-sky-950 dark:text-sky-200">
              {okItems.length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px]">ISSUES</span>
            <span className="font-bold text-racing-red">
              {issueItems.length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px]">SKIPPED</span>
            <span className="font-bold text-muted-foreground">
              {naItems.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 print:hidden">
        <Button
          type="button"
          size="lg"
          onClick={handleShareReport}
          className={`flex-1 font-bold text-xs sm:text-sm py-5 px-4 shadow-sm justify-center gap-1.5 transition-all ${
            hasIssues
              ? "bg-racing-red text-white hover:bg-racing-red/90 shadow-racing-red/25"
              : "bg-glacier-blue text-slate-950 hover:bg-glacier-blue/90 border border-glacier-blue"
          }`}
        >
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Share2 className="size-4" />
          )}
          <span>
            {copied
              ? "Report Copied to Clipboard"
              : "Send Report to Dealer (WhatsApp)"}
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handlePrint}
          className="gap-1.5 font-semibold text-xs border-border/80 hover:bg-muted py-5 px-4"
        >
          <Printer className="size-4 text-glacier-blue" />
          <span>Print / PDF</span>
        </Button>
      </div>

      {(chassisAnswer ||
        engineAnswer ||
        odoAnswer ||
        frontTyrePressure ||
        rearTyrePressure) && (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Baseline Vehicle Identity &amp; Readings
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sky-950 dark:text-sky-200 bg-glacier-blue/20 border border-glacier-blue/40 px-2 py-0.5 rounded-full">
              <ShieldCheck className="size-3 text-glacier-blue" />
              Day 1 Baseline
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {chassisAnswer && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  CHASSIS VIN STAMPING
                </span>
                <span className="font-mono font-bold text-foreground break-all pt-0.5">
                  {chassisAnswer}
                </span>
              </div>
            )}
            {engineAnswer && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  ENGINE NUMBER
                </span>
                <span className="font-mono font-bold text-foreground break-all pt-0.5">
                  {engineAnswer}
                </span>
              </div>
            )}
            {odoAnswer && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  DELIVERY ODOMETER
                </span>
                <span className="font-mono font-bold text-foreground pt-0.5">
                  {odoAnswer} km
                </span>
              </div>
            )}
            {frontTyrePressure && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  FRONT TYRE PRESSURE
                </span>
                <span className="font-mono font-bold text-foreground pt-0.5">
                  {frontTyrePressure} psi
                </span>
              </div>
            )}
            {rearTyrePressure && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  REAR TYRE PRESSURE
                </span>
                <span className="font-mono font-bold text-foreground pt-0.5">
                  {rearTyrePressure} psi
                </span>
              </div>
            )}
            {oilLevelAnswer && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  ENGINE OIL SIGHT GLASS
                </span>
                <span className="font-mono font-bold text-foreground pt-0.5">
                  {oilLevelAnswer}
                </span>
              </div>
            )}
            {freeServiceAnswer && (
              <div className="flex flex-col p-2.5 rounded-lg border border-border/80 bg-background/50">
                <span className="text-muted-foreground text-[10px] font-mono">
                  1ST FREE SERVICE
                </span>
                <span className="font-mono font-bold text-foreground pt-0.5">
                  {freeServiceAnswer}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasIssues && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-racing-red" />
              Flagged Defects Requiring Dealer Endorsement ({issueItems.length})
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {mustFixIssues.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-racing-red uppercase tracking-wider">
                  Mandatory: Fix Before Delivery ({mustFixIssues.length})
                </span>
                {mustFixIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                    onViewPhoto={(url) => setPreviewPhoto(url)}
                  />
                ))}
              </div>
            )}

            {inWritingIssues.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-mono font-bold text-sky-950 dark:text-sky-200 uppercase tracking-wider">
                  Endorse in Writing on Gate Pass ({inWritingIssues.length})
                </span>
                {inWritingIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                    onViewPhoto={(url) => setPreviewPhoto(url)}
                  />
                ))}
              </div>
            )}

            {cosmeticIssues.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  Cosmetic Paint &amp; Panel Flaws ({cosmeticIssues.length})
                </span>
                {cosmeticIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                    onViewPhoto={(url) => setPreviewPhoto(url)}
                  />
                ))}
              </div>
            )}

            {otherIssues.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
                  Other Observations ({otherIssues.length})
                </span>
                {otherIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                    onViewPhoto={(url) => setPreviewPhoto(url)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {uncheckedItems.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2.5 print:hidden">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
              <FileCheck2 className="size-4 text-glacier-blue" />
              Uninspected Items ({uncheckedItems.length})
            </span>
            <button
              type="button"
              onClick={onBackToChecklist}
              className="text-xs font-bold text-sky-950 dark:text-sky-200 hover:underline"
            >
              Resume Checklist &rarr;
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pt-1 max-h-48 overflow-y-auto">
            {uncheckedItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onJumpToItem(item.id, item.zoneId)}
                className="flex items-center justify-between text-left text-xs p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
              >
                <span>{item.label}</span>
                <span className="text-[10px] font-mono text-muted-foreground/70 shrink-0">
                  Inspect &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {naItems.length > 0 && (
        <div className="rounded-xl border border-border bg-card/60 p-3.5 flex flex-col gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setShowSkipped(!showSkipped)}
            className="flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="size-4" />
              Skipped / Not Applicable ({naItems.length})
            </span>
            {showSkipped ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>

          {showSkipped && (
            <div className="flex flex-col gap-1 pt-2 border-t border-border">
              {naItems.map((item) => (
                <div
                  key={item.id}
                  className="text-xs text-muted-foreground py-0.5"
                >
                  • {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Official Signatures Block for Print / PDF */}
      <div className="hidden print:flex flex-col gap-6 mt-8 pt-8 border-t-2 border-black">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
          Official Vehicle Delivery Acceptance &amp; Defect Endorsement
        </span>
        <div className="grid grid-cols-2 gap-10 pt-4">
          <div className="flex flex-col justify-between h-28 border-t border-black pt-2">
            <span className="text-xs font-bold">
              Customer Acceptance Signature
            </span>
            <span className="text-[10px] text-gray-600">
              Date: ________________________
            </span>
          </div>
          <div className="flex flex-col justify-between h-28 border-t border-black pt-2">
            <span className="text-xs font-bold">
              Dealership Representative &amp; Official Seal
            </span>
            <span className="text-[10px] text-gray-600">
              Date: ________________________
            </span>
          </div>
        </div>
      </div>

      {previewPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="relative max-w-lg w-full rounded-2xl overflow-hidden bg-black">
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 size-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-white/20"
            >
              <X className="size-4" />
            </button>
            {/* biome-ignore lint/performance/noImgElement: photo modal preview */}
            <img
              src={previewPhoto}
              alt="Defect proof fullscreen"
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-4 border-t border-border print:hidden">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onStartNewInspection}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Start a new inspection
        </Button>
      </div>
    </div>
  );
}

function IssueSummaryCard({
  item,
  answer,
  onJump,
  onViewPhoto,
}: {
  item: ChecklistItemDef;
  answer?: {
    note?: string;
    severity?: string;
    photos?: { id: string; dataUrl: string }[];
  };
  onJump: () => void;
  onViewPhoto: (dataUrl: string) => void;
}) {
  const severityLabel =
    answer?.severity === "fix_before_delivery"
      ? "Fix Before Delivery"
      : answer?.severity === "get_in_writing"
        ? "Get In Writing"
        : answer?.severity === "cosmetic"
          ? "Cosmetic"
          : "Flagged";

  const isFixBefore = answer?.severity === "fix_before_delivery";
  const isWriting = answer?.severity === "get_in_writing";

  return (
    <div
      className={`rounded-xl border p-3.5 flex flex-col gap-2.5 shadow-2xs bg-card ${
        isFixBefore
          ? "border-l-4 border-l-racing-red border-racing-red/40"
          : isWriting
            ? "border-l-4 border-l-glacier-blue border-glacier-blue/40"
            : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-xs sm:text-sm text-foreground leading-snug">
            {item.label}
          </span>
          <span
            className={`rounded-full px-2 py-0.2 font-mono text-[10px] font-bold ${
              isFixBefore
                ? "bg-racing-red/15 text-racing-red border border-racing-red/30"
                : isWriting
                  ? "bg-glacier-blue/20 text-sky-950 dark:text-sky-200 border border-glacier-blue/40"
                  : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {severityLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={onJump}
          className="text-[10px] font-mono font-bold text-sky-950 dark:text-sky-200 hover:underline shrink-0"
        >
          Edit &rarr;
        </button>
      </div>

      {answer?.note && (
        <p className="text-xs text-foreground bg-muted/40 p-2.5 rounded-lg italic border border-border/50">
          &ldquo;{answer.note}&rdquo;
        </p>
      )}

      {answer?.photos && answer.photos.length > 0 && (
        <div className="flex items-center gap-2 pt-0.5">
          {answer.photos.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onViewPhoto(p.dataUrl)}
              className="size-14 rounded-lg overflow-hidden border border-border bg-muted shrink-0 cursor-pointer p-0 block hover:opacity-90"
              title="View full evidence photo"
            >
              {/* biome-ignore lint/performance/noImgElement: user captured base64 dataUrl */}
              <img
                src={p.dataUrl}
                alt="Defect proof"
                className="size-full object-cover"
              />
            </button>
          ))}
          <span className="text-[10px] text-muted-foreground font-mono">
            Tap photo to enlarge
          </span>
        </div>
      )}

      <div className="text-[11px] text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50 leading-normal">
        <strong className="text-foreground">Showroom Action: </strong>
        {isFixBefore &&
          "Do not sign gate pass until dealership rectifies this issue."}
        {isWriting &&
          "Demand defect is endorsed on delivery receipt counter-signed with dealer stamp."}
        {!isFixBefore &&
          !isWriting &&
          "Record cosmetic blemish on warranty registration paper before handover."}
      </div>
    </div>
  );
}
