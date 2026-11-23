"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileCheck2,
  HelpCircle,
  Printer,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const [showLogbookCard, setShowLogbookCard] = useState(true);

  // Compute all visible items based on bike setup
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

  // Baseline readings captured
  const chassisAnswer = answers["paperwork-chassis"]?.value;
  const engineAnswer = answers["paperwork-engine"]?.value;
  const odoAnswer = answers["controls-odometer-reading"]?.value;
  const frontTyrePressure = answers["front-tyre-pressure"]?.value;
  const rearTyrePressure = answers["rear-tyre-pressure"]?.value;
  const oilLevelAnswer = answers["engine-oil-level"]?.value;
  const freeServiceAnswer = answers["fuel-free-service"]?.value;

  // Group issues by severity
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
      `*PDI Inspection Summary - ${inspection.bikeModel || "New Vehicle"}*`,
      `Date: ${dateStr}`,
    ];

    if (chassisAnswer) lines.push(`Chassis / VIN: ${chassisAnswer}`);
    if (engineAnswer) lines.push(`Engine No: ${engineAnswer}`);
    if (odoAnswer) lines.push(`Odometer: ${odoAnswer} km`);

    lines.push("");

    if (issueItems.length === 0) {
      lines.push("Status: All checklist items verified and in order.");
    } else {
      lines.push(`*Issues flagged for dealer action (${issueItems.length}):*`);
      issueItems.forEach((item, idx) => {
        const ans = answers[item.id];
        const severityLabel =
          ans?.severity === "fix_before_delivery"
            ? "Fix before delivery"
            : ans?.severity === "get_in_writing"
              ? "Endorse in writing"
              : ans?.severity === "cosmetic"
                ? "Cosmetic"
                : "Flagged";
        const note = ans?.note ? `: "${ans.note}"` : "";
        lines.push(`${idx + 1}. ${item.label} [${severityLabel}]${note}`);
      });
      lines.push("");
      lines.push(
        "Please confirm in writing that these items will be rectified before vehicle handover.",
      );
    }

    lines.push("");
    lines.push("Report generated via bikeOS PDI.");
    return lines.join("\n");
  };

  const handleCopyDealerText = () => {
    const text = generateDealerText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadJson = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(inspection, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pdi-report-${inspection.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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

        <span className="text-xs font-mono text-muted-foreground">
          Inspection Summary
        </span>
      </div>

      <div className="hidden print:block border-b pb-4 mb-4">
        <h1 className="text-2xl font-bold">
          bikeOS • Pre-Delivery Inspection (PDI) Report
        </h1>
        <p className="text-sm text-gray-600">
          Vehicle: {inspection.bikeModel || "New Motorcycle"} | Date:{" "}
          {new Date(inspection.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div
        className={`rounded-2xl border p-5 flex flex-col gap-3 shadow-xs ${
          headlineStatus === "all_clear"
            ? "border-glacier-blue bg-glacier-blue/10"
            : headlineStatus === "issues_to_resolve"
              ? "border-racing-red/50 bg-racing-red/10"
              : "border-border bg-card"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Overall Status
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              {headlineStatus === "all_clear" && "All Clear to Sign"}
              {headlineStatus === "issues_to_resolve" &&
                "Issues Found Before Delivery"}
              {headlineStatus === "not_finished" && "Inspection Incomplete"}
            </h2>
          </div>

          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-full font-bold ${
              headlineStatus === "all_clear"
                ? "bg-glacier-blue text-slate-900"
                : headlineStatus === "issues_to_resolve"
                  ? "bg-racing-red text-white"
                  : "bg-muted text-foreground"
            }`}
          >
            {headlineStatus === "all_clear" && (
              <CheckCircle2 className="size-6" />
            )}
            {headlineStatus === "issues_to_resolve" && (
              <AlertTriangle className="size-6" />
            )}
            {headlineStatus === "not_finished" && (
              <FileCheck2 className="size-6" />
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
          {headlineStatus === "all_clear" &&
            "Every visible item has been inspected and verified with zero recorded issues. You can proceed with signing the delivery documents."}
          {headlineStatus === "issues_to_resolve" &&
            "Do not accept delivery or sign the gate pass until these flagged issues are resolved or endorsed in writing with dealer stamp."}
          {headlineStatus === "not_finished" &&
            `You still have ${uncheckedItems.length} unchecked items out of ${totalVisible}. Finish all checks before signing delivery papers.`}
        </p>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/60 text-center font-mono text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px]">TOTAL</span>
            <span className="font-bold text-foreground">{totalVisible}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px]">VERIFIED</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
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
          variant="default"
          size="default"
          onClick={handleCopyDealerText}
          className="flex-1 sm:flex-none bg-foreground text-background font-semibold"
        >
          {copied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4" />
          )}
          <span>{copied ? "Copied Issues!" : "Copy for WhatsApp"}</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handlePrint}
          className="gap-1.5"
        >
          <Printer className="size-4" />
          <span>Print / PDF</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleDownloadJson}
          className="gap-1.5"
        >
          <Download className="size-4" />
          <span>Save Data</span>
        </Button>
      </div>

      {(chassisAnswer ||
        engineAnswer ||
        odoAnswer ||
        frontTyrePressure ||
        rearTyrePressure) && (
        <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 shadow-2xs">
          <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            Baseline Vehicle Readings
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {chassisAnswer && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  Chassis / VIN
                </span>
                <span className="font-mono font-bold text-foreground break-all">
                  {chassisAnswer}
                </span>
              </div>
            )}
            {engineAnswer && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  Engine Number
                </span>
                <span className="font-mono font-bold text-foreground break-all">
                  {engineAnswer}
                </span>
              </div>
            )}
            {odoAnswer && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  Starting Odometer
                </span>
                <span className="font-mono font-bold text-foreground">
                  {odoAnswer} km
                </span>
              </div>
            )}
            {frontTyrePressure && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  Front Tyre Pressure
                </span>
                <span className="font-mono font-bold text-foreground">
                  {frontTyrePressure} psi
                </span>
              </div>
            )}
            {rearTyrePressure && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  Rear Tyre Pressure
                </span>
                <span className="font-mono font-bold text-foreground">
                  {rearTyrePressure} psi
                </span>
              </div>
            )}
            {oilLevelAnswer && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  Oil Level
                </span>
                <span className="font-mono font-bold text-foreground">
                  {oilLevelAnswer}
                </span>
              </div>
            )}
            {freeServiceAnswer && (
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">
                  1st Free Service Due
                </span>
                <span className="font-mono font-bold text-foreground">
                  {freeServiceAnswer}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasIssues && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="size-4 text-racing-red" />
              Flagged Issues ({issueItems.length})
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {mustFixIssues.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-racing-red uppercase tracking-wider">
                  Fix Before Delivery ({mustFixIssues.length})
                </span>
                {mustFixIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                  />
                ))}
              </div>
            )}

            {inWritingIssues.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Get In Writing on Delivery Note ({inWritingIssues.length})
                </span>
                {inWritingIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                  />
                ))}
              </div>
            )}

            {cosmeticIssues.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Cosmetic Blemishes ({cosmeticIssues.length})
                </span>
                {cosmeticIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
                  />
                ))}
              </div>
            )}

            {otherIssues.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Other Issues ({otherIssues.length})
                </span>
                {otherIssues.map((item) => (
                  <IssueSummaryCard
                    key={item.id}
                    item={item}
                    answer={answers[item.id]}
                    onJump={() => onJumpToItem(item.id, item.zoneId)}
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
              Unchecked Items ({uncheckedItems.length})
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tap to inspect
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
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
        <div className="rounded-xl border border-border bg-card/60 p-4 flex flex-col gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setShowSkipped(!showSkipped)}
            className="flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="size-4" />
              Skipped Items ({naItems.length})
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
                  className="text-xs text-muted-foreground py-1"
                >
                  • {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showLogbookCard && (
        <Card className="border-border bg-polar-white/60 dark:bg-card shadow-xs print:hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background font-mono font-bold text-xs">
                  OS
                </span>
                <span className="font-bold text-sm text-foreground">
                  Start your bike&apos;s logbook with bikeOS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogbookCard(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              We can keep this vehicle&apos;s starting odometer (
              {odoAnswer || "0"} km), tyre pressures, chassis VIN, and warranty
              follow-ups as the permanent Day 1 record in your bikeOS logbook to
              monitor maintenance and service dates.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleDownloadJson}
                className="bg-foreground text-background font-semibold"
              >
                <Sparkles className="size-3.5" />
                <span>Export Day 1 Logbook</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2 pt-4 border-t border-border print:hidden">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onStartNewInspection}
          className="text-muted-foreground hover:text-foreground"
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
}: {
  item: ChecklistItemDef;
  answer?: {
    note?: string;
    severity?: string;
    photos?: { id: string; dataUrl: string }[];
  };
  onJump: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5 flex flex-col gap-2 shadow-2xs">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-xs text-foreground leading-snug">
          {item.label}
        </span>
        <button
          type="button"
          onClick={onJump}
          className="text-[10px] font-mono text-muted-foreground hover:text-foreground shrink-0"
        >
          Edit &rarr;
        </button>
      </div>

      {answer?.note && (
        <p className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg italic">
          &ldquo;{answer.note}&rdquo;
        </p>
      )}

      {answer?.photos && answer.photos.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          {answer.photos.map((p) => (
            <div
              key={p.id}
              className="size-12 rounded-lg overflow-hidden border border-border bg-muted shrink-0"
            >
              {/* biome-ignore lint/performance/noImgElement: user captured base64 dataUrl */}
              <img
                src={p.dataUrl}
                alt="Defect"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
