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

export function ItemRow({
  item,
  answer,
  showHints,
  onUpdateAnswer,
}: ItemRowProps) {
  const currentState: ItemState = answer?.state || "unanswered";
  const [hintExpanded, setHintExpanded] = useState(false);
  const [undoNotice, setUndoNotice] = useState(false);
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
          ? "border-racing-red/50 bg-racing-red/[0.04]"
          : isOk
            ? "border-glacier-blue/60 bg-glacier-blue/[0.05]"
            : isNa
              ? "border-border/70 bg-muted/40 opacity-80"
              : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <span className="font-semibold text-sm leading-snug text-foreground">
            {item.label}
          </span>

          {shouldShowHint && (
            <p className="text-xs text-muted-foreground leading-relaxed transition-all">
              {item.hint}
            </p>
          )}

          {!showHints && (
            <button
              type="button"
              onClick={() => setHintExpanded(!hintExpanded)}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 hover:text-foreground font-medium w-fit mt-0.5"
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
          <span className="shrink-0 rounded bg-racing-red/15 px-2 py-0.5 font-mono text-[10px] font-bold text-racing-red">
            ISSUE
          </span>
        )}
        {isOk && (
          <span className="shrink-0 rounded bg-glacier-blue/25 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200">
            OK
          </span>
        )}
        {isNa && (
          <span className="shrink-0 rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
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
            placeholder={item.inputPlaceholder || "Enter value..."}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {item.inputUnit && (
            <span className="font-mono text-xs text-muted-foreground">
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
          className={`min-h-11 font-medium text-xs select-none ${
            isOk
              ? "bg-glacier-blue text-slate-950 border-glacier-blue shadow-xs font-bold"
              : "border-border hover:bg-muted"
          }`}
        >
          <CheckCircle2 className="size-4" />
          <span>OK</span>
        </Button>

        <Button
          type="button"
          variant={isIssue ? "destructive" : "outline"}
          size="sm"
          onClick={() => handleStateClick("issue")}
          className={`min-h-11 font-medium text-xs select-none ${
            isIssue
              ? "bg-racing-red text-white shadow-xs font-bold"
              : "border-border hover:bg-muted text-racing-red"
          }`}
        >
          <AlertTriangle className="size-4" />
          <span>Issue</span>
        </Button>

        <Button
          type="button"
          variant={isNa ? "secondary" : "outline"}
          size="sm"
          onClick={() => handleStateClick("na")}
          className={`min-h-11 font-medium text-xs select-none ${
            isNa
              ? "bg-muted text-foreground font-bold"
              : "border-border hover:bg-muted text-muted-foreground"
          }`}
        >
          <HelpCircle className="size-4" />
          <span>N/A</span>
        </Button>
      </div>

      {undoNotice && (
        <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-1.5 text-xs text-muted-foreground animate-fadeIn">
          <span>Notes and photos kept in case of mis-tap.</span>
          <button
            type="button"
            onClick={() => handleStateClick("issue")}
            className="flex items-center gap-1 font-semibold text-foreground hover:underline"
          >
            <RotateCcw className="size-3" />
            <span>Restore Issue</span>
          </button>
        </div>
      )}

      {isIssue && (
        <div className="flex flex-col gap-3 rounded-xl border border-racing-red/30 bg-background/90 p-3 mt-1">
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`note-${item.id}`}
              className="text-xs font-semibold text-foreground"
            >
              What is wrong?
            </label>
            <textarea
              id={`note-${item.id}`}
              rows={2}
              value={answer?.note || ""}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="e.g. Scratched paint on left cowl, missing second key, tyre DOT is 2024..."
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Severity / Action
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "fix_before_delivery", label: "Fix before delivery" },
                { id: "get_in_writing", label: "Get it in writing" },
                { id: "cosmetic", label: "Cosmetic" },
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
                        ? "bg-racing-red text-white font-bold"
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
                Photos ({answer?.photos?.length || 0}/3)
              </span>

              {(answer?.photos?.length || 0) < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
                >
                  <span>Add photo</span>
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
                    {/* biome-ignore lint/performance/noImgElement: user captured base64 dataUrl */}
                    <img
                      src={photo.dataUrl}
                      alt="Inspection defect proof"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(photo.id)}
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

          {(item.dealerHint || item.defaultSeverity) && (
            <div className="rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground leading-relaxed border border-border/60">
              <span className="font-semibold text-foreground">
                Dealer hint:{" "}
              </span>
              {item.dealerHint ||
                "Ask for the issue to be documented on the delivery gate pass."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
