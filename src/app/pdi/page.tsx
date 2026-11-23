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

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLdHowTo)}</script>
      <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>

      <div className="min-h-dvh flex flex-col bg-background text-foreground">
        <PdiClient />

        {/* Server-Rendered SEO Content and Fallback Guide for Crawlers & Search Engines */}
        <section className="print:hidden border-t border-border bg-card/40 py-12 px-4 sm:px-6">
          <div className="mx-auto max-w-xl flex flex-col gap-8">
            <header className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-glacier-blue uppercase tracking-wider">
                Vehicle Buyer Guide
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Complete Two-Wheeler Pre-Delivery Inspection Checklist
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use this comprehensive showroom checklist to inspect every
                critical component of your new motorcycle or scooter before
                signing the delivery acceptance receipt.
              </p>
            </header>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-foreground">
                Inspection Zones &amp; Checklist Items
              </h3>

              <div className="flex flex-col gap-3">
                {PDI_ZONES.map((zone) => (
                  <details
                    key={zone.id}
                    className="group rounded-xl border border-border bg-card p-4 transition-all"
                  >
                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-sm text-foreground list-none select-none">
                      <span>
                        {zone.order}. {zone.title} ({zone.items.length} checks)
                      </span>
                      <span className="text-xs text-muted-foreground group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="text-xs text-muted-foreground pt-2 pb-3">
                      {zone.description}
                    </p>
                    <ol className="flex flex-col gap-2 border-t border-border pt-3 text-xs text-foreground/90 pl-4 list-decimal">
                      {zone.items.map((item) => (
                        <li key={item.id} className="leading-relaxed">
                          <strong>{item.label}</strong>
                          <p className="text-muted-foreground mt-0.5">
                            {item.hint}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </details>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4 border-t border-border">
              <h3 className="text-lg font-bold text-foreground">
                Frequently Asked Questions
              </h3>

              <div className="flex flex-col gap-3 text-xs leading-relaxed">
                <article className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1.5">
                  <h4 className="font-semibold text-sm text-foreground">
                    Can a motorcycle dealer force me to sign the delivery note
                    first?
                  </h4>
                  <p className="text-muted-foreground">
                    Never sign the delivery acceptance receipt until you have
                    personally inspected the vehicle in bright light. Once you
                    sign, the dealer is legally relieved of responsibility for
                    cosmetic flaws, paint scratches, and missing accessories.
                  </p>
                </article>

                <article className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1.5">
                  <h4 className="font-semibold text-sm text-foreground">
                    What documents must match the physical vehicle?
                  </h4>
                  <p className="text-muted-foreground">
                    The 17-digit Chassis VIN stamped on the headstock and the
                    engine number stamped on the crankcase must match the Tax
                    Invoice, Insurance Policy, and Temporary Registration papers
                    down to every single digit.
                  </p>
                </article>

                <article className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1.5">
                  <h4 className="font-semibold text-sm text-foreground">
                    What if the dealer doesn&apos;t allow a test ride?
                  </h4>
                  <p className="text-muted-foreground">
                    Many dealerships do not allow dynamic road rides before
                    permanent registration. In that case, mark the test ride
                    zone as N/A in the checklist, and conduct all stationary
                    engine, idle, and clutch checks on the centre stand.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
