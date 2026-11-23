"use client";

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  ChecklistItemDef,
  IssueSeverity,
  ItemAnswer,
  ItemState,
  PhotoItem,
} from "@/lib/pdi-data";
import { compressImage } from "@/lib/pdi-storage";

interface ItemRowProps {
  item: ChecklistItemDef;
  answer?: ItemAnswer;
  showHints: boolean;
  onUpdateAnswer: (itemId: string, answer: ItemAnswer) => void;
}

const COMMON_DEFECT_CHIPS = [
  "Paint scratch / swirl",
  "Odometer over 15 km",
  "Fluid weeping / leak",
  "Banjo bolt / caliper seal",
  "Loose fitting / bolt",
  "Missing second key / toolkit",
];

export function ItemRow({
  item,
  answer,
  showHints,
  onUpdateAnswer,
}: ItemRowProps) {
  const currentState: ItemState = answer?.state || "unanswered";
  const [hintExpanded, setHintExpanded] = useState(false);
  const [undoNotice, setUndoNotice] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOk = currentState === "ok";
  const isIssue = currentState === "issue";
  const isNa = currentState === "na";

  const handleStateClick = (targetState: ItemState) => {
    const nextState = currentState === targetState ? "unanswered" : targetState;

    if (currentState === "issue" && nextState !== "issue") {
      setUndoNotice(true);
      setTimeout(() => setUndoNotice(false), 8000);
    }

    onUpdateAnswer(item.id, {
      state: nextState,
      value: answer?.value || "",
      note: answer?.note || "",
      severity: answer?.severity || item.defaultSeverity,
      photos: answer?.photos || [],
      updatedAt: Date.now(),
    });
  };

  const handleValueChange = (val: string) => {
    onUpdateAnswer(item.id, {
      state: currentState === "unanswered" ? "ok" : currentState,
      value: val,
      note: answer?.note || "",
      severity: answer?.severity || item.defaultSeverity,
      photos: answer?.photos || [],
      updatedAt: Date.now(),
    });
  };

  const handleNoteChange = (note: string) => {
    onUpdateAnswer(item.id, {
      state: currentState,
      value: answer?.value || "",
      note,
      severity: answer?.severity || item.defaultSeverity,
      photos: answer?.photos || [],
      updatedAt: Date.now(),
    });
  };

  const handleQuickChipClick = (chipText: string) => {
    const existing = answer?.note?.trim() || "";
    const updated = existing ? `${existing}; ${chipText}` : chipText;
    handleNoteChange(updated);
  };

  const handleSeveritySelect = (severity: IssueSeverity) => {
    onUpdateAnswer(item.id, {
      state: currentState,
      value: answer?.value || "",
      note: answer?.note || "",
      severity: answer?.severity === severity ? undefined : severity,
      photos: answer?.photos || [],
      updatedAt: Date.now(),
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const existingPhotos = answer?.photos || [];
    if (existingPhotos.length >= 3) return;

    try {
      const file = files[0];
      const dataUrl = await compressImage(file, 1200, 0.75);
      const newPhoto: PhotoItem = {
        id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dataUrl,
        timestamp: Date.now(),
      };

      onUpdateAnswer(item.id, {
        state: currentState,
        value: answer?.value || "",
        note: answer?.note || "",
        severity: answer?.severity || item.defaultSeverity,
        photos: [...existingPhotos, newPhoto],
        updatedAt: Date.now(),
      });
    } catch {
      // Photo capture fallback
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    const existingPhotos = answer?.photos || [];
    onUpdateAnswer(item.id, {
      state: currentState,
      value: answer?.value || "",
      note: answer?.note || "",
      severity: answer?.severity || item.defaultSeverity,
      photos: existingPhotos.filter((p) => p.id !== photoId),
      updatedAt: Date.now(),
    });
  };

  const shouldShowHint = showHints || hintExpanded;

  return (
    <div
      id={`item-${item.id}`}
      className={`flex flex-col gap-2.5 rounded-xl border p-3.5 transition-all shadow-2xs ${
        isIssue
          ? "border-racing-red/60 bg-racing-red/[0.04]"
          : isOk
            ? "border-glacier-blue/50 bg-glacier-blue/[0.04]"
            : isNa
              ? "border-border/60 bg-muted/30 opacity-75"
              : "border-border/80 bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="font-semibold text-sm leading-snug text-foreground">
            {item.label}
          </span>

          {shouldShowHint && (
            <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">
              {item.hint}
            </p>
          )}

          {!showHints && (
            <button
              type="button"
              onClick={() => setHintExpanded(!hintExpanded)}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-glacier-blue font-medium w-fit py-0.5 transition-colors"
            >
              <span>{hintExpanded ? "Hide how to check" : "How to check"}</span>
              {hintExpanded ? (
                <ChevronUp className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          )}
        </div>

        {isIssue && (
          <span className="shrink-0 rounded-full bg-racing-red/15 border border-racing-red/30 px-2 py-0.5 font-mono text-[10px] font-bold text-racing-red">
            ISSUE
          </span>
        )}
        {isOk && (
          <span className="shrink-0 rounded-full bg-glacier-blue/20 border border-glacier-blue/40 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-950 dark:text-sky-200">
            OK
          </span>
        )}
        {isNa && (
          <span className="shrink-0 rounded-full bg-muted border border-border px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
            N/A
          </span>
        )}
      </div>

      {item.type === "number_entry" && (
        <div className="flex items-center gap-2 pt-0.5">
          <input
            type="text"
            value={answer?.value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={item.inputPlaceholder || "Enter measured value..."}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-glacier-blue"
          />
          {item.inputUnit && (
            <span className="font-mono text-xs text-muted-foreground font-semibold">
              {item.inputUnit}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 pt-1">
        <Button
          type="button"
          variant={isOk ? "default" : "outline"}
          size="sm"
          onClick={() => handleStateClick("ok")}
          className={`min-h-11 font-medium text-xs select-none transition-all ${
            isOk
              ? "bg-glacier-blue text-slate-950 border-glacier-blue shadow-2xs font-bold hover:bg-glacier-blue/90"
              : "border-border/80 hover:bg-glacier-blue/10 hover:border-glacier-blue/40 text-foreground"
          }`}
        >
          <CheckCircle2
            className={`size-4 ${isOk ? "text-slate-950" : "text-glacier-blue"}`}
          />
          <span>OK</span>
        </Button>

        <Button
          type="button"
          variant={isIssue ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleStateClick("issue")}
          className={`min-h-11 font-medium text-xs select-none transition-all ${
            isIssue
              ? "bg-racing-red text-white shadow-md shadow-racing-red/25 font-bold hover:bg-racing-red/90"
              : "border-border/80 text-racing-red hover:bg-racing-red/10 hover:border-racing-red/40"
          }`}
        >
          <AlertTriangle className="size-4 text-racing-red" />
          <span>Issue</span>
        </Button>

        <Button
          type="button"
          variant={isNa ? "secondary" : "outline"}
          size="sm"
          onClick={() => handleStateClick("na")}
          className={`min-h-11 font-medium text-xs select-none transition-all ${
            isNa
              ? "bg-muted text-foreground font-bold border-border"
              : "border-border/80 hover:bg-muted text-muted-foreground"
          }`}
        >
          <HelpCircle className="size-4" />
          <span>N/A</span>
        </Button>
      </div>

      {undoNotice && (
        <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-1.5 text-xs text-muted-foreground animate-fadeIn border border-border">
          <span>Notes &amp; photos saved in case of mis-tap.</span>
          <button
            type="button"
            onClick={() => handleStateClick("issue")}
            className="flex items-center gap-1 font-semibold text-racing-red hover:underline"
          >
            <RotateCcw className="size-3" />
            <span>Restore Issue</span>
          </button>
        </div>
      )}

      {isIssue && (
        <div className="flex flex-col gap-3 rounded-xl border border-racing-red/30 bg-card p-3 mt-1 shadow-2xs">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-racing-red">
              Flagged Defect Note
            </span>

            <div className="flex flex-wrap gap-1 pb-1">
              {COMMON_DEFECT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickChipClick(chip)}
                  className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={answer?.note || ""}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Describe issue (e.g. Scratched fuel tank, odometer at 28 km, weeping front caliper bolt)..."
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-racing-red resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
              Severity / Action Demanded
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "fix_before_delivery", label: "Fix before delivery" },
                { id: "get_in_writing", label: "Get in writing" },
                { id: "cosmetic", label: "Cosmetic flaw" },
              ].map((chip) => {
                const isSelected = answer?.severity === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() =>
                      handleSeveritySelect(chip.id as IssueSeverity)
                    }
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isSelected
                        ? chip.id === "fix_before_delivery"
                          ? "bg-racing-red text-white font-bold shadow-2xs"
                          : chip.id === "get_in_writing"
                            ? "bg-glacier-blue text-slate-950 font-bold shadow-2xs"
                            : "bg-muted text-foreground font-bold"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Camera className="size-3.5 text-glacier-blue" />
                Evidence Photos ({answer?.photos?.length || 0}/3)
              </span>

              {(answer?.photos?.length || 0) < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-950 dark:text-sky-200 hover:underline"
                >
                  <span>+ Take photo</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {answer?.photos && answer.photos.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {answer.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group size-16 shrink-0 rounded-lg overflow-hidden border border-border bg-muted"
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewPhoto(photo.dataUrl)}
                      className="size-full p-0 border-0 bg-transparent cursor-pointer block"
                      title="View photo evidence fullscreen"
                    >
                      {/* biome-ignore lint/performance/noImgElement: user captured base64 dataUrl */}
                      <img
                        src={photo.dataUrl}
                        alt="Inspection defect proof"
                        className="size-full object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(photo.id);
                      }}
                      className="absolute top-1 right-1 size-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-racing-red transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

          <div className="rounded-lg border-l-2 border-l-racing-red border border-border bg-muted/40 p-2.5 text-xs leading-relaxed text-muted-foreground">
            <span className="font-bold text-foreground">
              Dealer Negotiation Script:{" "}
            </span>
            {item.dealerHint ||
              "Do not accept verbal promises. Demand this defect is officially endorsed on the delivery gate pass with dealer stamp."}
          </div>
        </div>
      )}
    </div>
  );
}
