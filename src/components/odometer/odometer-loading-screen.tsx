"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OdometerLoadingScreenProps {
  onComplete?: () => void;
}

const SPEED_TICKS = Array.from({ length: 21 }, (_, i) => {
  const speed = i * 10;
  const isMajor = speed % 20 === 0;
  const angleDeg = -120 + (speed / 200) * 240;
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const rInner = isMajor ? 104 : 110;
  const rOuter = 118;
  const rText = 88;

  return {
    speed,
    isMajor,
    x1: 150 + rInner * cos,
    y1: 150 + rInner * sin,
    x2: 150 + rOuter * cos,
    y2: 150 + rOuter * sin,
    tx: 150 + rText * cos,
    ty: 150 + rText * sin + 4,
  };
});

export function OdometerLoadingScreen({
  onComplete,
}: OdometerLoadingScreenProps) {
  const [phase, setPhase] = useState<"igniting" | "exiting">("igniting");
  const [speed, setSpeed] = useState(0);

  const handleSkip = useCallback(() => {
    setPhase("exiting");
    setTimeout(() => {
      onComplete?.();
    }, 200);
  }, [onComplete]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete?.();
      return;
    }

    const startTime = performance.now();
    let frameId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;

      let currentSpeed = 0;
      if (elapsed < 750) {
        const p = Math.min(1, elapsed / 750);
        currentSpeed = 200 * (1 - (1 - p) ** 3);
      } else if (elapsed < 880) {
        currentSpeed = 200;
      } else if (elapsed < 1650) {
        const p = Math.min(1, (elapsed - 880) / 770);
        const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
        currentSpeed = 200 * (1 - eased);
      } else {
        currentSpeed = 0;
      }

      setSpeed(currentSpeed);

      if (elapsed < 1950) {
        frameId = requestAnimationFrame(animate);
      } else {
        setPhase("exiting");
        setTimeout(() => {
          onComplete?.();
        }, 350);
      }
    };

    frameId = requestAnimationFrame(animate);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete, handleSkip]);

  const needleAngle = -120 + (speed / 200) * 240;

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-polar-white select-none overflow-hidden p-6 transition-opacity duration-500",
        phase === "exiting" ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      <button
        type="button"
        onClick={handleSkip}
        aria-label="Skip boot sequence"
        className="absolute inset-0 size-full cursor-pointer bg-transparent border-0 p-0 m-0 z-0"
      />

      <div
        className="pointer-events-none absolute w-96 h-96 rounded-full bg-radial from-glacier-blue/30 via-glacier-blue/10 to-transparent blur-3xl opacity-75"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center size-72">
          <div className="relative flex size-full items-center justify-center">
            <svg
              className="absolute inset-0 size-full"
              viewBox="0 0 300 300"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="needle-shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="#e4002B"
                    floodOpacity="0.45"
                  />
                </filter>
              </defs>

              <path
                d="M 46.9 209.5 A 119 119 0 1 1 253.1 209.5"
                fill="none"
                stroke="#9cc6e0"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity="0.85"
              />

              <path
                d="M 52.5 204.5 A 110 110 0 1 1 247.5 204.5"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.6"
              />

              {SPEED_TICKS.map((tick) => (
                <g key={tick.speed}>
                  <line
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    stroke={tick.isMajor ? "#334155" : "#94a3b8"}
                    strokeWidth={tick.isMajor ? 2.2 : 1.2}
                    strokeLinecap="round"
                  />
                  {tick.isMajor && (
                    <text
                      x={tick.tx}
                      y={tick.ty}
                      textAnchor="middle"
                      fill="#334155"
                      fontSize="10.5"
                      fontWeight="bold"
                      className="font-mono select-none"
                    >
                      {tick.speed}
                    </text>
                  )}
                </g>
              ))}

              <text
                x="150"
                y="118"
                textAnchor="middle"
                fill="#64748b"
                fontSize="12"
                fontWeight="bold"
                letterSpacing="1.5"
                className="font-mono select-none uppercase"
              >
                km/h
              </text>

              <circle
                cx="150"
                cy="150"
                r="13"
                fill="#0f172a"
                stroke="#9cc6e0"
                strokeWidth="2"
              />
              <g
                transform={`rotate(${needleAngle} 150 150)`}
                filter="url(#needle-shadow)"
              >
                <path
                  d="M 147.5 150 L 148.5 174 A 2 2 0 0 0 151.5 174 L 152.5 150 L 151 38 L 150 32 L 149 38 Z"
                  fill="#e4002B"
                  stroke="#b90022"
                  strokeWidth="0.5"
                />
              </g>

            </svg>
            <div className="flex items-center gap-2 mt-20">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-sans">
                bike<span className="text-racing-red">OS</span>
              </span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
