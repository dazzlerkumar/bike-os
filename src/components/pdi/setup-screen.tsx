"use client";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type BikeSetup,
  defaultBikeSetup,
  itemAppliesToSetup,
  PDI_ZONES,
} from "@/lib/pdi-data";

interface SetupScreenProps {
  initialSetup: BikeSetup;
  bikeModel?: string;
  onSave: (setup: BikeSetup, bikeModel: string) => void;
  onSkip: () => void;
  onBack: () => void;
}

interface ArchetypePreset {
  id: string;
  title: string;
  subtitle: string;
  setup: BikeSetup;
}

const PRESETS: ArchetypePreset[] = [
  {
    id: "standard_motorcycle",
    title: "Standard Motorcycle",
    subtitle:
      "Chain drive, disc/ABS brakes, air or oil cooled (e.g. Hunter, Classic, FZ)",
    setup: {
      drive: "chain",
      brakes: "abs",
      tyres: "all",
      cooling: "air",
      start: "electric_only",
      fuelSystem: "all",
    },
  },
  {
    id: "scooter",
    title: "Scooter / Automatic",
    subtitle:
      "CVT belt drive, CBS or drum brakes, air-cooled (e.g. Activa, Jupiter, Access)",
    setup: {
      drive: "belt",
      brakes: "cbs",
      tyres: "all",
      cooling: "air",
      start: "electric_kick",
      fuelSystem: "all",
    },
  },
  {
    id: "liquid_cooled",
    title: "Liquid-Cooled Performance",
    subtitle:
      "Radiator coolant, dual ABS, chain drive (e.g. Duke 390, Himalayan 450, R15)",
    setup: {
      drive: "chain",
      brakes: "abs",
      tyres: "all",
      cooling: "liquid",
      start: "electric_only",
      fuelSystem: "all",
    },
  },
  {
    id: "all",
    title: "All Checks (Show Everything)",
    subtitle: "Do not filter any items, show complete 67-point inspection",
    setup: defaultBikeSetup,
  },
];

export function SetupScreen({
  initialSetup,
  bikeModel: initialBikeModel = "",
  onSave,
  onSkip,
  onBack,
}: SetupScreenProps) {
  const [setup, setSetup] = useState<BikeSetup>(initialSetup);
  const [model, setModel] = useState<string>(initialBikeModel);
  const [showCustom, setShowCustom] = useState(false);

  const selectedPresetId = useMemo(() => {
    for (const preset of PRESETS) {
      if (
        preset.setup.drive === setup.drive &&
        preset.setup.brakes === setup.brakes &&
        preset.setup.cooling === setup.cooling &&
        preset.setup.start === setup.start
      ) {
        return preset.id;
      }
    }
    return "custom";
  }, [setup]);

  const activeCount = useMemo(() => {
    return PDI_ZONES.flatMap((z) => z.items).filter((item) =>
      itemAppliesToSetup(item, setup),
    ).length;
  }, [setup]);

  const updateField = <K extends keyof BikeSetup>(
    field: K,
    value: BikeSetup[K],
  ) => {
    setSetup((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 sm:py-10 flex flex-col gap-6">
      <header className="flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider">
          <span className="size-2 rounded-full bg-racing-red" />
          <span className="font-bold text-foreground">bikeOS</span>
        </div>
      </header>

      <div className="flex flex-col gap-2 pt-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          Tailor your checklist
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select your vehicle type so we can remove checks that do not apply to
          your bike.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="bike-model-input"
          className="text-xs font-semibold text-foreground flex items-center justify-between"
        >
          <span>Vehicle Model (Optional)</span>
          <span className="text-[11px] font-normal text-muted-foreground">
            For delivery receipt
          </span>
        </label>
        <input
          id="bike-model-input"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="e.g. Royal Enfield Hunter 350, Activa 6G, Duke 250"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-glacier-blue/50"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          Choose Vehicle Type
        </span>
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSetup(preset.setup)}
                className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-glacier-blue/60 bg-glacier-blue/10 dark:bg-glacier-blue/15 shadow-2xs"
                    : "border-border/80 bg-card hover:border-border text-foreground"
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className={`text-sm font-bold tracking-tight ${
                      isSelected ? "text-foreground" : "text-foreground/90"
                    }`}
                  >
                    {preset.title}
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {preset.subtitle}
                  </span>
                </div>
                <div
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors mt-0.5 ${
                    isSelected
                      ? "border-glacier-blue bg-glacier-blue text-slate-900"
                      : "border-muted-foreground/30 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/80 pt-3">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground py-1 select-none"
        >
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="size-3.5 text-glacier-blue" />
            <span>
              Advanced component tuning{" "}
              {selectedPresetId === "custom" && "(Custom active)"}
            </span>
          </div>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${
              showCustom ? "rotate-180" : ""
            }`}
          />
        </button>

        {showCustom && (
          <div className="flex flex-col gap-4 p-3.5 rounded-xl border border-border/80 bg-card/60">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Drive Transmission
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                    className={`min-h-10 rounded-lg border text-xs font-medium transition-all ${
                      setup.drive === option.id
                        ? "border-glacier-blue bg-glacier-blue/20 text-foreground font-bold shadow-2xs"
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
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "Any" },
                  { id: "abs", label: "Disc & ABS" },
                  { id: "neither", label: "Drum only" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      updateField("brakes", option.id as BikeSetup["brakes"])
                    }
                    className={`min-h-10 rounded-lg border text-xs font-medium transition-all ${
                      setup.brakes === option.id
                        ? "border-glacier-blue bg-glacier-blue/20 text-foreground font-bold shadow-2xs"
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
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "Any" },
                  { id: "air", label: "Air or Oil" },
                  { id: "liquid", label: "Liquid Cooled" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      updateField("cooling", option.id as BikeSetup["cooling"])
                    }
                    className={`min-h-10 rounded-lg border text-xs font-medium transition-all ${
                      setup.cooling === option.id
                        ? "border-glacier-blue bg-glacier-blue/20 text-foreground font-bold shadow-2xs"
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
                    className={`min-h-10 rounded-lg border text-xs font-medium transition-all ${
                      setup.start === option.id
                        ? "border-glacier-blue bg-glacier-blue/20 text-foreground font-bold shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 pt-2">
        <Button
          type="button"
          size="lg"
          onClick={() => onSave(setup, model)}
          className="w-full justify-between bg-racing-red text-white hover:bg-racing-red/90 shadow-md shadow-racing-red/20 font-bold text-base py-6 px-5 transition-all"
        >
          <span>Start Inspection ({activeCount} Checks)</span>
          <ChevronRight className="size-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="w-full text-muted-foreground hover:text-foreground text-xs font-medium"
        >
          Skip tailoring, show all checks
        </Button>
      </div>
    </div>
  );
}
