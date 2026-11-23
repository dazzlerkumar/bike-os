import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function App() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 sm:p-10 font-sans transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">bikeOS</h1>
              <Badge variant="accent">v0.1</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Design tokens & component registry
            </p>
          </div>
          <Button variant="outline" onClick={toggleTheme}>
            Toggle {isDark ? "Light Canvas" : "Dark Cockpit"}
          </Button>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Design Token Palette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-border">
              <CardHeader>
                <div className="h-16 rounded-md bg-polar-white border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-900 font-mono text-xs font-semibold shadow-inner">
                  #f1f3f4
                </div>
                <CardTitle className="mt-2">Polar White</CardTitle>
                <CardDescription>Primary Color & Contrast Base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="polar">Primary Token</Badge>
                <p className="text-xs text-muted-foreground">
                  Used for high-contrast readout, card canvases, and light cockpit base.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <div className="h-16 rounded-md bg-glacier-blue flex items-center justify-center text-slate-950 font-mono text-xs font-semibold shadow-inner">
                  #9cc6e0
                </div>
                <CardTitle className="mt-2">Glacier Blue</CardTitle>
                <CardDescription>Secondary Color & Telemetry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="glacier">Secondary Token</Badge>
                <p className="text-xs text-muted-foreground">
                  Used for secondary controls, service schedules, indicators, and focus rings.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <div className="h-16 rounded-md bg-racing-red flex items-center justify-center text-white font-mono text-xs font-semibold shadow-inner">
                  #e4002B
                </div>
                <CardTitle className="mt-2">Racing Red</CardTitle>
                <CardDescription>Accent Color & Alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="racing">Accent Token</Badge>
                <p className="text-xs text-muted-foreground">
                  Used for critical alerts, overdues, quick-log actions, and highlighted states.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Component Registry Actions</h2>
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Primary Default</Button>
                <Button variant="secondary">Glacier Secondary</Button>
                <Button variant="accent">Racing Red Accent</Button>
                <Button variant="outline">Outline Action</Button>
                <Button variant="ghost">Ghost State</Button>
                <Button variant="destructive">Destructive Action</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
