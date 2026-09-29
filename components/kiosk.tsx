"use client"

import { useEffect, useState } from "react"
import { COLOR } from "@/components/mid-fidelity"
import { QrBlock } from "@/components/app-screens"
import { courtById, GRACE_MINUTES } from "@/lib/mock-data"
import type { CourtState } from "@/lib/types"

/**
 * The courtside screen — a vertically-mounted iPad at each court.
 *
 * A different product from the phone app, not another screen in it. Everything
 * is scaled to be read from a metre away while standing: the state is legible
 * before you reach the screen, and the QR is the dominant element because
 * scanning is the only thing most people do here.
 *
 * The app's type roles do not apply — those are sized for a held device.
 */

const COURT_ID = "pitch-3"

/** Type scale for standing distance. Roughly double the app's. */
const K = {
  state: { fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 40, lineHeight: "46px", letterSpacing: "-0.02em" },
  name: { fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 56, lineHeight: "62px", letterSpacing: "-0.03em" },
  label: { fontSize: 18, lineHeight: "24px", letterSpacing: "0.06em", textTransform: "uppercase" as const, fontWeight: 500 },
  body: { fontSize: 22, lineHeight: "30px" },
  figure: { fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 64, lineHeight: "68px", letterSpacing: "-0.03em" },
}

export function Kiosk({
  state,
  onStateChange,
}: {
  state: CourtState
  onStateChange: (s: CourtState) => void
}) {
  const court = courtById(COURT_ID)!
  const [clock, setClock] = useState("14:35")
  const [secondsLeft, setSecondsLeft] = useState(GRACE_MINUTES * 60 - 29)

  /* The countdown is the whole mechanism — it has to be visibly running. */
  useEffect(() => {
    if (state !== "awaiting") return
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [state])

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date()
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const mmss = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`

  const surface =
    state === "in-play" ? "var(--color-brand-700)"
    : state === "rejected" ? "#7A2B2B"
    : state === "available" ? COLOR.surface
    : "#1A1815"

  const onDark = state !== "available"
  const ink = onDark ? "#FFFFFF" : COLOR.text
  const inkMuted = onDark ? "rgba(255,255,255,0.62)" : COLOR.muted

  return (
    <div
      className="mx-auto flex flex-col"
      style={{
        width: 820, height: 1180, background: surface,
        transition: "background 400ms ease-out",
      }}
    >
      {/* Head: identity and the live clock. Constant across every state. */}
      <header className="flex shrink-0 items-center justify-between px-12 pt-10">
        <span className="flex items-center gap-4">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-well)]"
            style={{ background: onDark ? "rgba(255,255,255,0.12)" : "var(--color-brand-600)", color: "#FFFFFF" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a15 15 0 0 0 0 18M12 3a15 15 0 0 1 0 18M3 12h18" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span style={{ ...K.label, color: inkMuted }}>{court.name}</span>
            <span style={{ fontSize: 20, color: ink, fontWeight: 500 }}>Al Rahba Community Club</span>
          </span>
        </span>
        <span className="numeric" style={{ ...K.figure, fontSize: 40, color: ink }}>{clock}</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-12">
        {state === "awaiting" && (
          <Awaiting name="Dr. Omar Hassan" start="14:30" mmss={mmss} />
        )}
        {state === "available" && <Available />}
        {state === "in-play" && <InPlay name="Dr. Omar Hassan" until="15:30" />}
        {state === "rejected" && <Rejected until="15:30" />}
      </div>

      {/* Foot: the sign-in affordance, present on every state. */}
      <footer className="flex shrink-0 flex-col gap-5 px-12 pb-12">
        <button
          type="button"
          onClick={() => onStateChange(state === "awaiting" ? "in-play" : "awaiting")}
          className="flex h-20 w-full items-center justify-between rounded-[var(--radius-panel)] px-8"
          style={{
            background: onDark ? "rgba(255,255,255,0.12)" : COLOR.well,
            color: ink,
          }}
        >
          <span style={{ ...K.state, fontSize: 26 }}>
            {state === "awaiting" ? "Scan to check in" : "Sign in"}
          </span>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <AuthButton label="Google" onDark={onDark} />
          <AuthButton label="Apple" onDark={onDark} />
        </div>
      </footer>
    </div>
  )
}

function Awaiting({ name, start, mmss }: { name: string; start: string; mmss: string }) {
  return (
    <div className="flex flex-col items-center gap-9">
      <div className="flex flex-col items-center gap-3">
        <span style={{ ...K.label, color: "rgba(255,255,255,0.62)" }}>Reserved for</span>
        <span className="text-center" style={{ ...K.name, color: "#FFFFFF" }}>{name}</span>
        <span
          className="mt-1 rounded-[var(--radius-pill)] px-5 py-2"
          style={{ background: "rgba(229,163,56,0.18)", color: "#E5A338", ...K.label }}
        >
          Booked — awaiting check-in
        </span>
      </div>

      <div className="rounded-[var(--radius-panel)] bg-white p-7">
        <QrBlock size={300} />
      </div>

      <div className="flex items-end gap-14">
        <Stat label="Booked" value={start} />
        <Stat label="Time left" value={mmss} urgent />
      </div>
    </div>
  )
}

function Available() {
  return (
    <div className="flex flex-col items-center gap-9">
      <div className="flex flex-col items-center gap-4">
        <span
          className="flex h-24 w-24 items-center justify-center rounded-[var(--radius-pill)]"
          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-600)" }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span style={{ ...K.name, color: COLOR.text }}>Available now</span>
        <span className="max-w-[520px] text-center" style={{ ...K.body, color: COLOR.muted }}>
          This court is free. Claim it here, or book ahead in the app to guarantee it.
        </span>
      </div>
      <div className="rounded-[var(--radius-panel)] p-7" style={{ background: COLOR.well }}>
        <QrBlock size={240} />
      </div>
      <span style={{ ...K.label, color: COLOR.faint }}>Scan to claim · 1 hour</span>
    </div>
  )
}

function InPlay({ name, until }: { name: string; until: string }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <span
        className="flex h-28 w-28 items-center justify-center rounded-[var(--radius-pill)]"
        style={{ background: "rgba(255,255,255,0.16)", color: "#FFFFFF" }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>
      <div className="flex flex-col items-center gap-3">
        <span style={{ ...K.name, color: "#FFFFFF" }}>Checked in</span>
        <span style={{ ...K.body, color: "rgba(255,255,255,0.72)" }}>{name}</span>
      </div>
      <div className="flex items-end gap-14">
        <Stat label="Court held until" value={until} />
        <Stat label="Standing" value="+2" />
      </div>
    </div>
  )
}

function Rejected({ until }: { until: string }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <span
        className="flex h-28 w-28 items-center justify-center rounded-[var(--radius-pill)]"
        style={{ background: "rgba(255,255,255,0.16)", color: "#FFFFFF" }}
      >
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 6 18 18M18 6 6 18" />
        </svg>
      </span>
      <div className="flex flex-col items-center gap-4">
        <span className="text-center" style={{ ...K.name, color: "#FFFFFF" }}>Court reserved</span>
        <span className="max-w-[540px] text-center" style={{ ...K.body, color: "rgba(255,255,255,0.78)" }}>
          This court is booked until {until}. Check the app for courts free now.
        </span>
      </div>
      <div className="rounded-[var(--radius-panel)] bg-white p-6">
        <QrBlock size={190} />
      </div>
      <span style={{ ...K.label, color: "rgba(255,255,255,0.62)" }}>
        Scan to see what is available
      </span>
    </div>
  )
}

function Stat({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <span className="flex flex-col items-center gap-1.5">
      <span style={{ ...K.label, color: urgent ? "#E5A338" : "rgba(255,255,255,0.62)" }}>{label}</span>
      <span className="numeric" style={{ ...K.figure, color: urgent ? "#E5A338" : "#FFFFFF" }}>
        {value}
      </span>
    </span>
  )
}

function AuthButton({ label, onDark }: { label: string; onDark: boolean }) {
  return (
    <button
      type="button"
      className="flex h-16 flex-1 items-center justify-center rounded-[var(--radius-field)]"
      style={{
        background: onDark ? "transparent" : COLOR.surface,
        outline: `1.5px solid ${onDark ? "rgba(255,255,255,0.24)" : COLOR.border}`,
        color: onDark ? "#FFFFFF" : COLOR.text,
        fontSize: 20,
        fontWeight: 500,
      }}
    >
      {label}
    </button>
  )
}
