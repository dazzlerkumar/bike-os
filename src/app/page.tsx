import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col justify-between bg-background text-foreground overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-gradient-to-r from-glacier-blue/25 via-racing-red/15 to-glacier-blue/30 blur-3xl opacity-70"
      />

      <header className="relative z-10 w-full border-b border-border/60 bg-card/60 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3.5 sm:max-w-xl">
          <div className="flex items-center gap-2.5">
            <Image
              src="/tripmeter-primary.svg"
              alt="tripmeter"
              width={32}
              height={32}
              className="size-8 rounded-lg shadow-2xs"
              priority
            />
            <span className="font-bold tracking-tight text-foreground text-base">
              tripmeter
            </span>
          </div>

          <span className="rounded-full border border-border bg-polar-white px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            v0.1
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:max-w-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-xs shadow-2xs">
            <span className="size-2 rounded-full bg-racing-red" />
            Two-Wheeler Companion & PDI
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl leading-[1.1]">
            Welcome to <br />
            <span className="bg-gradient-to-r from-foreground via-foreground to-racing-red bg-clip-text text-transparent">
              tripmeter
            </span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Inspect your new motorcycle or scooter before signing delivery,
            catch defects early, and keep your machine in peak condition.
          </p>

          <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
            <Link
              href="/pdi"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-13 w-full bg-racing-red font-bold text-white shadow-md shadow-racing-red/25 hover:bg-racing-red/90 justify-center gap-2",
              )}
            >
              <span>Launch PDI Checklist</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 w-full max-w-md text-left">
            <div className="rounded-xl border border-border bg-card/60 p-3 shadow-2xs backdrop-blur-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                Offline Ready
              </span>
              <p className="text-xs text-foreground/90 font-medium leading-tight">
                Works without signal at showroom
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3 shadow-2xs backdrop-blur-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                Zero Login
              </span>
              <p className="text-xs text-foreground/90 font-medium leading-tight">
                No registration or account needed
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3 shadow-2xs backdrop-blur-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                Private
              </span>
              <p className="text-xs text-foreground/90 font-medium leading-tight">
                Data saved locally on your device
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full border-t border-border/60 py-4 text-center text-xs text-muted-foreground pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <p className="font-mono text-[11px]">
          tripmeter • pre-delivery inspection
        </p>
      </footer>
    </div>
  );
}
