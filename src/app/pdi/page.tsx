import { PdiClient } from "@/components/pdi/pdi-client";
import { PDI_ZONES } from "@/lib/pdi-data";

export default function PdiPage() {
  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Perform a Pre-Delivery Inspection (PDI) on a New Two-Wheeler",
    description:
      "A comprehensive step-by-step checklist to inspect a new motorcycle or scooter before signing the dealer delivery note.",
    totalTime: "PT25M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "0",
    },
    supply: [
      { "@type": "HowToSupply", name: "Vehicle Tax Invoice" },
      { "@type": "HowToSupply", name: "Active Insurance Cover Note" },
      { "@type": "HowToSupply", name: "Two Original Vehicle Keys" },
      { "@type": "HowToSupply", name: "Smartphone with Camera & Flashlight" },
    ],
    step: PDI_ZONES.map((zone, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: zone.title,
      itemListElement: zone.items.map((item, itemIdx) => ({
        "@type": "HowToDirection",
        position: itemIdx + 1,
        text: `${item.label} - ${item.hint}`,
      })),
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Pre-Delivery Inspection (PDI) for a bike?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Pre-Delivery Inspection (PDI) is a thorough physical, mechanical, and documentation check carried out before signing the delivery acceptance note. It helps buyers catch cosmetic damage, chassis number errors, and fluid leaks before taking custody.",
        },
      },
      {
        "@type": "Question",
        name: "Can a dealer refuse to let me inspect the bike?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Buyers have the legal right to inspect the vehicle they are paying for in daylight. If a dealer resists or rushes the inspection, do not sign the delivery gate pass until all checks are completed.",
        },
      },
      {
        "@type": "Question",
        name: "What is an acceptable odometer reading on a new bike?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "New motorcycles and scooters typically show between 1 km and 15 km on the odometer from factory testing and dealer yard transit. If the odometer exceeds 25-30 km, ask the dealer for a written explanation.",
        },
      },
      {
        "@type": "Question",
        name: "Why is the tyre DOT manufacture date important?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tyres have a 4-digit DOT date code (WWYY). Tyres degrade over time even when unused. New bikes should have tyres manufactured within the past 6 months to ensure safety and full rubber lifespan.",
        },
      },
      {
        "@type": "Question",
        name: "What should I do if I find paint scratches or mechanical issues?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Document the issue with clear photos and notes. Ask the dealer to rectify the defect before delivery or endorse the rectification in writing with an official stamp on the delivery receipt.",
        },
      },
    ],
  };

  const referenceGuide = (
    <section
      id="pdi-reference-guide"
      className="print:hidden border-t border-border pt-8 mt-2 flex flex-col gap-6"
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-sky-950 dark:text-sky-200 bg-glacier-blue/20 border border-glacier-blue/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Technical Manual
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-glacier-blue/50 via-racing-red/40 to-transparent" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
          Two-Wheeler Delivery Inspection Protocol
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Showroom checklist reference covering physical integrity, mechanical
          sealing, electrical diagnostics, and legal paperwork.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
          Protocol Zones ({PDI_ZONES.length} Stages)
        </h3>

        <div className="flex flex-col gap-2.5">
          {PDI_ZONES.map((zone) => (
            <details
              key={zone.id}
              className="group rounded-xl border border-border/80 bg-card p-3.5 transition-all hover:border-glacier-blue/40"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs sm:text-sm text-foreground list-none select-none">
                <span className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-md bg-muted font-mono text-[11px] font-bold text-foreground">
                    {zone.order}
                  </span>
                  <span>{zone.title}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                    {zone.items.length} checks
                  </span>
                  <span className="group-open:rotate-180 transition-transform text-xs">
                    ▼
                  </span>
                </span>
              </summary>
              <p className="text-xs text-muted-foreground pt-2 pb-2.5">
                {zone.description}
              </p>
              <ol className="flex flex-col gap-2 border-t border-border/70 pt-2.5 text-xs text-foreground/90 pl-4 list-decimal">
                {zone.items.map((item) => (
                  <li key={item.id} className="leading-relaxed">
                    <strong className="text-foreground">{item.label}</strong>
                    <p className="text-muted-foreground mt-0.5">{item.hint}</p>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-border/70">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground font-mono">
          Showroom FAQ
        </h3>

        <div className="flex flex-col gap-2.5 text-xs leading-relaxed">
          <article className="rounded-xl border border-border/80 bg-card p-3.5 flex flex-col gap-1.5 hover:border-racing-red/30 transition-colors">
            <h4 className="font-bold text-xs sm:text-sm text-foreground">
              Can a dealer force me to sign the delivery receipt first?
            </h4>
            <p className="text-muted-foreground">
              Never sign the delivery acceptance receipt until you have
              personally inspected the vehicle in bright natural daylight. Once
              you sign, the dealership is legally relieved of responsibility for
              cosmetic flaws, paint scratches, and missing toolkits.
            </p>
          </article>

          <article className="rounded-xl border border-border/80 bg-card p-3.5 flex flex-col gap-1.5 hover:border-glacier-blue/40 transition-colors">
            <h4 className="font-bold text-xs sm:text-sm text-foreground">
              What documents must match the physical vehicle?
            </h4>
            <p className="text-muted-foreground">
              The 17-digit Chassis VIN stamped on the headstock and the engine
              number stamped on the crankcase must match the Tax Invoice,
              Insurance Policy, and Temporary Registration papers down to every
              single digit.
            </p>
          </article>

          <article className="rounded-xl border border-border/80 bg-card p-3.5 flex flex-col gap-1.5 hover:border-glacier-blue/40 transition-colors">
            <h4 className="font-bold text-xs sm:text-sm text-foreground">
              What if the dealer doesn&apos;t allow a test ride?
            </h4>
            <p className="text-muted-foreground">
              Many dealerships do not allow dynamic road rides before permanent
              registration. In that case, mark the test ride zone as N/A in the
              checklist, and conduct all stationary engine, idle, and clutch
              checks on the centre stand.
            </p>
          </article>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLdHowTo)}</script>
      <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>

      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        <PdiClient guideContent={referenceGuide} />
      </div>
    </>
  );
}
