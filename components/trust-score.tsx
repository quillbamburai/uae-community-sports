"use client"

import { COLOR, TYPE } from "@/components/mid-fidelity"
import { tierFor, trustTiers } from "@/lib/mock-data"

/**
 * Trust standing.
 *
 * Presented as a civic record — closer to a licence than a game score. No
 * streaks, badges or levels: the number moves only on whether a booking was
 * honoured, and the copy says so plainly.
 *
 * The figure to the right is the distance to the next tier, not points
 * recently earned. "4 to go" is an invitation; "you earned 4" is a receipt.
 */
export function TrustScore({
  score,
  compact = false,
}: {
  score: number
  compact?: boolean
}) {
  const { current, next, toNext } = tierFor(score)
  const floor = current.from
  const ceiling = next?.from ?? 100
  const pct = Math.min(100, ((score - floor) / (ceiling - floor)) * 100)

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className="numeric"
          style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 15, color: COLOR.text }}
        >
          {score}
        </span>
        <span className={TYPE.meta} style={{ color: COLOR.muted }}>
          {current.name}
        </span>
      </span>
    )
  }

  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: COLOR.surface, borderRadius: "var(--radius-panel)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className={TYPE.columnHeader} style={{ color: COLOR.faint }}>
            Trust standing
          </span>
          <span className="flex items-baseline gap-1.5">
            <span
              className="numeric"
              style={{
                fontFamily: "var(--font-family-display)",
                fontWeight: 600,
                fontSize: 44,
                lineHeight: "48px",
                letterSpacing: "var(--letter-spacing-tightest)",
                color: COLOR.text,
              }}
            >
              {score}
            </span>
            <span className={TYPE.rowValue} style={{ color: COLOR.faint }}>
              / 100
            </span>
          </span>
        </div>
        <span
          className={`shrink-0 rounded-[var(--radius-pill)] px-3 py-1.5 ${TYPE.columnHeader}`}
          style={{ background: "var(--color-trust-surface)", color: "var(--color-trust)" }}
        >
          {current.name}
        </span>
      </div>

      {/* Progress runs between tier boundaries, not 0–100 — the distance that
          matters is to the next standing, not to a perfect score. */}
      <div className="flex flex-col gap-2">
        <div
          className="h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)]"
          style={{ background: "var(--color-trust-track)" }}
        >
          <div
            className="h-full rounded-[var(--radius-pill)]"
            style={{ width: `${pct}%`, background: "var(--color-trust)" }}
          />
        </div>
        {next ? (
          <span className={TYPE.meta} style={{ color: COLOR.muted }}>
            <b style={{ color: COLOR.text }}>{toNext} points</b> to {next.name} —{" "}
            {next.benefit.toLowerCase()}
          </span>
        ) : (
          <span className={TYPE.meta} style={{ color: COLOR.muted }}>
            Highest standing. {current.benefit}
          </span>
        )}
      </div>
    </div>
  )
}

/** The full tier ladder — shown on the trust detail screen. */
export function TrustTiers({ score }: { score: number }) {
  const { current } = tierFor(score)
  return (
    <div className="flex flex-col gap-2">
      {trustTiers.map((t) => {
        const here = t.name === current.name
        const reached = score >= t.from
        return (
          <div
            key={t.name}
            className="flex items-start gap-3 p-4"
            style={{
              background: COLOR.surface,
              borderRadius: "var(--radius-well)",
              outline: here ? `1.5px solid var(--color-trust)` : undefined,
            }}
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-pill)]"
              style={{
                background: reached ? "var(--color-trust)" : COLOR.well,
                color: reached ? COLOR.inverse : COLOR.faint,
              }}
            >
              {reached && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              )}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="flex items-baseline gap-2">
                <span className={TYPE.itemName} style={{ color: COLOR.text }}>
                  {t.name}
                </span>
                <span className={TYPE.meta} style={{ color: COLOR.faint }}>
                  {t.from}+
                </span>
              </span>
              <span className={TYPE.meta} style={{ color: COLOR.muted }}>
                {t.benefit}
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
