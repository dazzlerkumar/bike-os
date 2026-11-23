import { useState } from "react"
import { PDIChecklist } from "./features/pdi/PDIChecklist"

export default function App() {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return <PDIChecklist isDark={isDark} onToggleTheme={toggleTheme} />
}