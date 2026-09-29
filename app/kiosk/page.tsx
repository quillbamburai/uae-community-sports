"use client"

import { useState } from "react"
import { Kiosk } from "@/components/kiosk"
import type { CourtState } from "@/lib/types"

const STATES: { id: CourtState; label: string }[] = [
  { id: "awaiting", label: "Booked — awaiting" },
  { id: "in-play", label: "Checked in" },
  { id: "available", label: "Available" },
  { id: "rejected", label: "Reserved — rejected" },
]

/**
 * The courtside screen, with a state switcher for the walkthrough. The
 * switcher is demo scaffolding — on the real device the state comes from the
 * booking system.
 */
export default function KioskPage() {
  const [state, setState] = useState<CourtState>("awaiting")
  return (
    <div className="flex min-h-[100dvh] flex-col items-center gap-6 py-8" style={{ background: "#0C0B09" }}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {STATES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setState(s.id)}
            className="rounded-full px-4 py-2 text-[13px] font-medium transition-opacity hover:opacity-80"
            style={
              s.id === state
                ? { background: "#FFFFFF", color: "#1A1815" }
                : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }
            }
          >
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)", borderRadius: 18, overflow: "hidden" }}>
        <Kiosk state={state} onStateChange={setState} />
      </div>
      <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
        Vertical iPad · mounted at the court
      </span>
    </div>
  )
}
