"use client";

import { ArrowLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BikeSetup } from "@/lib/pdi-data";

interface SetupScreenProps {
  initialSetup: BikeSetup;
  bikeModel?: string;
  onSave: (setup: BikeSetup, bikeModel: string) => void;
  onSkip: () => void;
  onBack: () => void;
}

export function SetupScreen({
  initialSetup,
  bikeModel: initialBikeModel = "",
  onSave,
  onSkip,
  onBack,
}: SetupScreenProps) {
  const [setup, setSetup] = useState<BikeSetup>(initialSetup);
  const [model, setModel] = useState<string>(initialBikeModel);

  const updateField = <K extends keyof BikeSetup>(
    field: K,
    value: BikeSetup[K],
  ) => {
    setSetup((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-mono text-muted-foreground">
          Optional Setup
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-glacier-blue" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Tailor your checklist
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Select your bike configuration so we can remove irrelevant checks
          (like coolant levels on air-cooled bikes). You can skip this or change
          it anytime.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="bike-model-input"
          className="text-xs font-semibold text-foreground"
        >
          Bike model name or variant (optional)
        </label>
        <input
          id="bike-model-input"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g. Royal Enfield Hunter 350, KTM Duke 250, Activa 6G"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-5 pt-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Drive Transmission
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "all", label: "Any" },
              { id: "chain", label: "Chain" },
              { id: "belt", label: "Belt" },
              { id: "shaft", label: "Shaft" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updateField("drive", option.id as BikeSetup["drive"])
                }
                className={`min-h-11 rounded-lg border text-xs font-medium transition-all ${
                  setup.drive === option.id
                    ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Brake Setup
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "all", label: "Any" },
              { id: "abs", label: "Dual ABS" },
              { id: "cbs", label: "Single/CBS" },
              { id: "neither", label: "Drum only" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updateField("brakes", option.id as BikeSetup["brakes"])
                }
                className={`min-h-11 rounded-lg border text-xs font-medium transition-all ${
                  setup.brakes === option.id
                    ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tyre Type
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "all", label: "Any" },
              { id: "tubeless", label: "Tubeless" },
              { id: "tube", label: "Tube Type" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updateField("tyres", option.id as BikeSetup["tyres"])
                }
                className={`min-h-11 rounded-lg border text-xs font-medium transition-all ${
                  setup.tyres === option.id
                    ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Engine Cooling
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "all", label: "Any" },
              { id: "air", label: "Air cooled" },
              { id: "oil", label: "Oil cooled" },
              { id: "liquid", label: "Liquid cooled" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updateField("cooling", option.id as BikeSetup["cooling"])
                }
                className={`min-h-11 rounded-lg border text-xs font-medium transition-all ${
                  setup.cooling === option.id
                    ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Starter System
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "all", label: "Any" },
              { id: "electric_only", label: "Self only" },
              { id: "electric_kick", label: "Self + Kick" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  updateField("start", option.id as BikeSetup["start"])
                }
                className={`min-h-11 rounded-lg border text-xs font-medium transition-all ${
                  setup.start === option.id
                    ? "border-foreground bg-foreground text-background font-bold shadow-xs"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onSkip}
          className="w-full sm:w-1/2 order-2 sm:order-1 text-muted-foreground hover:text-foreground"
        >
          Skip, show everything
        </Button>
        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={() => onSave(setup, model)}
          className="w-full sm:w-1/2 order-1 sm:order-2 bg-foreground text-background font-semibold"
        >
          <span>Continue</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
