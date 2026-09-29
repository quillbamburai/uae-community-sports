"use client"

import { COLOR, TYPE } from "@/components/mid-fidelity"

/**
 * Shared primitives for the phone app. The kiosk has its own scale and does
 * not use these — it is read from standing distance, not held.
 */

export function Screen({
  children,
  pad = true,
  fill = false,
}: {
  children: React.ReactNode
  pad?: boolean
  /** Pin to the viewport height, for screens with a footer on the fold. */
  fill?: boolean
}) {
  return (
    <div
      className={`mx-auto flex w-full max-w-[420px] flex-col ${pad ? "px-5" : ""}`}
      style={{
        minHeight: "100dvh",
        /* `fill` pins the screen to the viewport so a footer can sit on the
           fold. Without it the screen grows and the page scrolls — which is
           what a long list wants. */
        ...(fill ? { height: "100dvh" } : null),
        background: COLOR.canvas,
      }}
    >
      {children}
    </div>
  )
}

export function Card({
  children,
  onClick,
  padded = true,
}: {
  children: React.ReactNode
  onClick?: () => void
  padded?: boolean
}) {
  const Tag = onClick ? "button" : "div"
  return (
    <Tag
      onClick={onClick}
      className={`w-full overflow-hidden text-left transition-opacity ${
        onClick ? "hover:opacity-90" : ""
      } ${padded ? "p-4" : ""}`}
      style={{
        background: COLOR.surface,
        borderRadius: "var(--radius-panel)",
      }}
    >
      {children}
    </Tag>
  )
}

export function Button({
  children,
  onClick,
  variant = "primary",
  full = true,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "quiet"
  full?: boolean
  disabled?: boolean
}) {
  const style =
    variant === "primary"
      ? { background: "var(--color-brand-600)", color: COLOR.inverse }
      : variant === "secondary"
        ? { background: COLOR.surface, color: COLOR.text, outline: `1px solid ${COLOR.border}` }
        : { background: "transparent", color: COLOR.muted }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-12 items-center justify-center rounded-[var(--radius-field)] transition-opacity hover:opacity-90 disabled:opacity-40 ${
        full ? "w-full" : "px-5"
      } ${TYPE.control}`}
      style={style}
    >
      {children}
    </button>
  )
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "neutral" | "brand" | "trust" | "warning" | "danger" | "success"
}) {
  const tones = {
    neutral: { background: COLOR.well, color: COLOR.muted },
    brand: { background: "var(--color-brand-50)", color: "var(--color-brand-700)" },
    trust: { background: "var(--color-trust-surface)", color: "var(--color-trust)" },
    warning: { background: COLOR.warningSurface, color: COLOR.warning },
    danger: { background: COLOR.dangerSurface, color: COLOR.danger },
    success: { background: COLOR.successSurface, color: COLOR.success },
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[var(--radius-pill)] px-2.5 py-1 ${TYPE.columnHeader}`}
      style={tones[tone]}
    >
      {children}
    </span>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={TYPE.panelTitle} style={{ color: COLOR.faint }}>
      {children}
    </h2>
  )
}

/** Top bar for inner screens: back, title, optional right slot. */
export function TopBar({
  title,
  onBack,
  right,
}: {
  title?: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  return (
    <header className="flex shrink-0 items-center gap-3 py-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-field)]"
          style={{ background: COLOR.surface, color: COLOR.text }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
      )}
      {title && (
        <span className={TYPE.itemName} style={{ color: COLOR.text, fontSize: 17 }}>
          {title}
        </span>
      )}
      <span className="ml-auto">{right}</span>
    </header>
  )
}

/** A court photograph. Illustrative blocks — no photography in this build. */
export function CourtImage({
  kind,
  height = 120,
  sport = "Football",
}: {
  kind: string
  height?: number
  sport?: string
}) {
  const palettes: Record<string, [string, string]> = {
    "football-1": ["#2E7D52", "#1B6149"],
    "football-2": ["#357F58", "#1F5B45"],
    "padel-1": ["#2F6E7A", "#1E4E58"],
    "padel-2": ["#35707C", "#22535D"],
    "tennis-1": ["#4A6E8A", "#2F4A5E"],
    "badminton-1": ["#7A6142", "#54432E"],
  }
  const [from, to] = palettes[kind] ?? ["#5E594F", "#34312B"]
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height, background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {/* Markings match the sport, so a card reads as the right court at a
          glance rather than a generic green block. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 120"
        preserveAspectRatio="none"
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.5"
        aria-hidden
      >
        <rect x="14" y="12" width="292" height="96" />
        <path d="M160 12 L160 108" />
        {sport === "Football" && (
          <>
            <circle cx="160" cy="60" r="20" />
            <rect x="14" y="36" width="34" height="48" />
            <rect x="272" y="36" width="34" height="48" />
          </>
        )}
        {sport === "Padel" && (
          <>
            <path d="M14 60 L306 60" strokeDasharray="4 4" />
            <path d="M84 12 L84 108M236 12 L236 108" />
          </>
        )}
        {sport === "Tennis" && (
          <>
            <rect x="52" y="28" width="216" height="64" />
            <path d="M52 60 L268 60" />
            <path d="M110 28 L110 92M210 28 L210 92" />
          </>
        )}
        {sport === "Badminton" && (
          <>
            <rect x="40" y="24" width="240" height="72" />
            <path d="M40 60 L280 60" strokeDasharray="4 4" />
            <path d="M100 24 L100 96M220 24 L220 96" />
          </>
        )}
      </svg>
    </div>
  )
}
