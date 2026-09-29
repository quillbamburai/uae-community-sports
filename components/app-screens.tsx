"use client"

import { useState } from "react"
import { COLOR, TYPE } from "@/components/mid-fidelity"
import { Button, Card, CourtImage, Pill, Screen, SectionLabel, TopBar } from "@/components/ui"
import { TrustScore, TrustTiers } from "@/components/trust-score"
import {
  bookings, courtById, courts, openSpots, promos, slots, trustEvents, user, GRACE_MINUTES,
} from "@/lib/mock-data"
import type { Court, Slot } from "@/lib/types"

export type AppView =
  | { name: "home" }
  | { name: "browse" }
  | { name: "court"; courtId: string }
  | { name: "confirm"; courtId: string; slotId: string }
  | { name: "pay"; courtId: string; slotId: string }
  | { name: "success"; courtId: string; slotId: string }
  | { name: "walkin" }
  | { name: "trust" }
  | { name: "post-session" }

const money = (n: number) => `AED ${n}`

/* ------------------------------------------------------------------ home */

export function Home({ go }: { go: (v: AppView) => void }) {
  const next = bookings.find((b) => b.status === "awaiting")
  return (
    <Screen>
      <header className="flex shrink-0 items-center justify-between py-5">
        <button type="button" aria-label="Menu" className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-field)]" style={{ background: COLOR.surface, color: COLOR.text }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <span className={TYPE.meta} style={{ color: COLOR.muted }}>Al Rahba Community Club</span>
      </header>

      <h1
        style={{
          fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 28,
          lineHeight: "34px", letterSpacing: "-0.02em", color: COLOR.text,
        }}
      >
        Welcome, {user.name}
      </h1>

      <div className="mt-5 flex flex-col gap-3">
        <button type="button" onClick={() => go({ name: "trust" })} className="text-left">
          <TrustScore score={user.trustScore} />
        </button>

        {/* The live booking, if one is waiting to be checked in. */}
        {next && (
          <Card>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-pill)]" style={{ background: COLOR.warningSurface, color: COLOR.warning }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                </svg>
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={TYPE.itemName} style={{ color: COLOR.text }}>
                  {courtById(next.courtId)?.name} · {next.start}
                </span>
                <span className={TYPE.meta} style={{ color: COLOR.muted }}>
                  Today · scan at the court to check in
                </span>
              </div>
              <Pill tone="warning">{GRACE_MINUTES} min grace</Pill>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => go({ name: "browse" })}>Book a court</Button>
          <Button variant="secondary" onClick={() => go({ name: "walkin" })}>
            Available now
          </Button>
        </div>
      </div>

      {/* Looking for one more — a secondary loop, not a headline. */}
      <div className="mt-7 flex flex-col gap-2.5">
        <SectionLabel>Looking for one more</SectionLabel>
        {openSpots.map((o) => {
          const court = courtById(o.courtId)
          return (
            <Card key={o.id} onClick={() => go({ name: "browse" })}>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[var(--radius-well)]">
                  <CourtImage kind={court?.image ?? "football-1"} height={44} sport={court?.sport} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={TYPE.itemName} style={{ color: COLOR.text }}>
                    {court?.name}
                  </span>
                  <span className={TYPE.meta} style={{ color: COLOR.muted }}>
                    {o.organiser} · {o.start} · {o.capacity - o.filled} {o.capacity - o.filled === 1 ? "place" : "places"} left
                  </span>
                </div>
                <span className={TYPE.rowValue} style={{ color: COLOR.text }}>
                  {money(o.pricePerPlayer)}
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Activity: cancellations, perks, invites. */}
      <div className="mt-7 flex flex-col gap-2.5 pb-8">
        <SectionLabel>Activity</SectionLabel>
        {promos.map((p) => (
          <Card key={p.id} onClick={() => go({ name: "browse" })}>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                <Pill tone={p.kind === "cancellation" ? "danger" : p.kind === "perk" ? "trust" : "brand"}>
                  {p.kind === "cancellation" ? "Just freed" : p.kind === "perk" ? "Perk" : "Invite"}
                </Pill>
                <span className={TYPE.itemName} style={{ color: COLOR.text }}>{p.headline}</span>
              </span>
              <span className={TYPE.meta} style={{ color: COLOR.muted }}>{p.detail}</span>
            </div>
          </Card>
        ))}

        <Card onClick={() => go({ name: "browse" })}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className={TYPE.itemName} style={{ color: COLOR.text }}>Book again</span>
              <span className={TYPE.meta} style={{ color: COLOR.muted }}>
                Marina Padel 1 · your last booking
              </span>
            </div>
            <Chevron />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className={TYPE.itemName} style={{ color: COLOR.text }}>In the pot</span>
              <span className={TYPE.meta} style={{ color: COLOR.muted }}>
                Shared with {user.connectedMembers} members
              </span>
            </div>
            <span className="numeric" style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 20, color: COLOR.text }}>
              {money(user.potCredit)}
            </span>
          </div>
        </Card>
      </div>
    </Screen>
  )
}

/* ---------------------------------------------------------------- browse */

export function Browse({ go }: { go: (v: AppView) => void }) {
  const bySport: { sport: string; courts: { court: Court; next: Slot }[] }[] = []
  for (const sport of ["Padel", "Football", "Tennis", "Badminton"]) {
    const seen = new Map<string, { court: Court; next: Slot }>()
    for (const slot of slots) {
      if (!slot.available) continue
      const court = courtById(slot.courtId)
      if (!court || court.sport !== sport || seen.has(court.id)) continue
      seen.set(court.id, { court, next: slot })
    }
    if (seen.size) bySport.push({ sport, courts: [...seen.values()] })
  }

  return (
    <Screen pad={false}>
      <div className="px-5 pb-1 pt-6">
        <h1
          style={{
            fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
            lineHeight: "38px", letterSpacing: "-0.3px", color: COLOR.text,
          }}
        >
          Book new
          <br />
          appointment
        </h1>
      </div>

      {/* Search panel — the inputs resolve the browse, rather than filtering
          a list that is already on screen. */}
      <div className="mx-1.5 mt-4 rounded-[20px] p-3.5" style={{ background: COLOR.surface }}>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Check In", "calendar"], ["Check Out", "calendar"],
            ["Type", "chevron"], ["Price", "chevron"],
          ].map(([label, icon]) => (
            <span
              key={label}
              className="flex h-14 items-center gap-2 rounded-[14px] px-4"
              style={{ background: "var(--color-brand-50)" }}
            >
              <span className="flex-1" style={{ fontSize: 15, fontWeight: 500, color: COLOR.text }}>
                {label}
              </span>
              {icon === "calendar" ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={COLOR.muted} strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="4" width="16" height="14" rx="2" /><path d="M2 8h16M6 2v4M14 2v4" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={COLOR.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              )}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="mt-3 flex h-14 w-full items-center justify-center rounded-[14px]"
          style={{ background: COLOR.text, color: COLOR.inverse, fontSize: 15, fontWeight: 500 }}
        >
          Search courts
        </button>
      </div>

      {/* One horizontally scrolling rail per sport. */}
      {bySport.map(({ sport, courts: list }) => (
        <section key={sport} className="mt-8">
          <h2 className="px-5 pb-4" style={{ fontSize: 18, fontWeight: 500, color: COLOR.text }}>
            {sport}
          </h2>
          <div
            className="flex gap-3.5 overflow-x-auto px-5 pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {list.map(({ court, next }, i) => (
              <CourtCard
                key={court.id}
                court={court}
                next={next}
                go={go}
                badge={i === 0 ? "15% Off" : undefined}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="h-10" />
    </Screen>
  )
}

/**
 * A court card: white shell with the photo inset, so the card's own white
 * carries the type rather than the photograph running to its edge.
 */
function CourtCard({
  court, next, go, badge,
}: { court: Court; next: Slot; go: (v: AppView) => void; badge?: string }) {
  return (
    <button
      type="button"
      onClick={() => go({ name: "court", courtId: court.id })}
      className="shrink-0 overflow-hidden rounded-[20px] text-left"
      style={{ width: 236, background: COLOR.surface }}
    >
      <div className="relative m-3 overflow-hidden rounded-[14px]" style={{ height: 180 }}>
        <img
          src={court.photo}
          alt=""
          className="h-full w-full object-cover"
        />
        {badge && (
          <span
            className="absolute left-2.5 top-2.5 rounded-[14px] px-3 py-1.5"
            style={{ background: COLOR.surface, fontSize: 12, fontWeight: 500, color: COLOR.text }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* 16px inset and generous leading — the card breathes rather than
          packing the text against its edges. */}
      <div className="flex flex-col gap-1.5 px-4 pb-5">
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--color-trust)">
            <path d="M7 0l2 4.4 4.8.6-3.5 3.3.9 4.7L7 10.8 2.8 13l.9-4.7L.2 5l4.8-.6z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500, color: COLOR.text }}>{court.rating}</span>
          <span style={{ fontSize: 14, color: COLOR.faint }}>({court.reviews})</span>
        </span>
        <span style={{ fontSize: 20, fontWeight: 500, lineHeight: "26px", color: COLOR.text }}>
          {court.name}
        </span>
        <span style={{ fontSize: 14, lineHeight: "20px", color: COLOR.muted }}>
          Next free {next.start} · AED {court.pricePerHour}
        </span>
      </div>
    </button>
  )
}

/* ----------------------------------------------------------- court detail */

export function CourtDetail({ courtId, go }: { courtId: string; go: (v: AppView) => void }) {
  const court = courtById(courtId)!
  const courtSlots = slots.filter((s) => s.courtId === courtId && s.available)
  const [picked, setPicked] = useState(courtSlots[0]?.id)
  const chosen = courtSlots.find((s) => s.id === picked)

  return (
    <Screen pad={false} fill>
      <div className="relative shrink-0">
        <CourtImage kind={court.image} height={220} sport={court.sport} />
        <div className="absolute left-5 top-4">
          <button type="button" onClick={() => go({ name: "browse" })} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-field)]" style={{ background: COLOR.surface, color: COLOR.text }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5 pt-5">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-2">
            <Pill tone="brand">{court.sport}</Pill>
            <span className={TYPE.meta} style={{ color: COLOR.muted }}>
              up to {court.capacity} players
            </span>
          </span>
          <h1 style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", color: COLOR.text }}>
            {court.name}
          </h1>
          <span className={TYPE.meta} style={{ color: COLOR.muted }}>
            {court.surface} · {court.amenities.join(" · ")}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <SectionLabel>Today</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {courtSlots.map((s) => {
              const on = s.id === picked
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPicked(s.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-[var(--radius-well)] py-3 ${TYPE.control}`}
                  style={
                    on
                      ? { background: "var(--color-brand-600)", color: COLOR.inverse }
                      : { background: COLOR.surface, color: COLOR.text }
                  }
                >
                  {s.start}
                  <span className={TYPE.meta} style={{ color: on ? "rgba(255,255,255,0.7)" : COLOR.faint }}>
                    1 hour
                  </span>
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* The action sits on the fold, not at the end of the content — the
          price and CTA are visible whatever the court's slot count. */}
      <div
        className="flex shrink-0 flex-col gap-3 px-5 pb-6 pt-4"
        style={{ background: COLOR.surface, borderTop: `1px solid ${COLOR.hairline}` }}
      >
        <div className="flex items-center justify-between">
          <span className={TYPE.meta} style={{ color: COLOR.muted }}>
            {chosen ? `${chosen.start}–${chosen.end} · 1 hour` : "Select a time"}
          </span>
          <span className="numeric" style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 22, color: COLOR.text }}>
            {money(court.pricePerHour)}
          </span>
        </div>
        <Button
          disabled={!picked}
          onClick={() => picked && go({ name: "confirm", courtId, slotId: picked })}
        >
          Continue
        </Button>
      </div>
    </Screen>
  )
}

/* --------------------------------------------------------------- confirm */

export function Confirm({
  courtId, slotId, go,
}: { courtId: string; slotId: string; go: (v: AppView) => void }) {
  const court = courtById(courtId)!
  const slot = slots.find((s) => s.id === slotId)!

  const price = slot.discountPct
    ? Math.round(court.pricePerHour * (1 - slot.discountPct / 100))
    : court.pricePerHour

  return (
    <Screen>
      <TopBar title="Confirm booking" onBack={() => go({ name: "court", courtId })} />
      <div className="flex flex-1 flex-col gap-3 pb-8">
        <Card>
          <div className="flex flex-col gap-3">
            <Row label="Court" value={court.name} />
            <Row label="Sport" value={court.sport} />
            <Row label="Date" value="Sunday 14 December" />
            <Row label="Time" value={`${slot.start}–${slot.end}`} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-pill)]" style={{ background: "var(--color-trust)", color: COLOR.inverse }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z" /><path d="M16 10h2a2 2 0 0 1 0 4h-2" />
              </svg>
            </span>
            <div className="flex flex-col gap-0.5">
              <span className={TYPE.itemName} style={{ color: COLOR.text }}>Free coffee included</span>
              <span className={TYPE.meta} style={{ color: COLOR.muted }}>Collect from the clubhouse on arrival</span>
            </div>
          </div>
        </Card>

        {/* The enforcement terms, stated where the commitment is made. */}
        <div className="flex flex-col gap-2 p-4" style={{ background: COLOR.warningSurface, borderRadius: "var(--radius-panel)" }}>
          <span className={TYPE.itemName} style={{ color: COLOR.warning }}>
            Check in within {GRACE_MINUTES} minutes
          </span>
          <span className={TYPE.meta} style={{ color: COLOR.warning }}>
            The court is held for you until {addMinutes(slot.start, GRACE_MINUTES)}. Scan at
            the court screen to claim it. After that it returns to the available list and
            your standing drops 6 points.
          </span>
        </div>

        <Card>
          <div className="flex flex-col gap-3">
            <Row label="Court hire" value={money(court.pricePerHour)} />
            {slot.discountPct && (
              <Row label={`Cancellation discount (${slot.discountPct}%)`} value={`−${money(court.pricePerHour - price)}`} />
            )}
            <div className="mt-1 flex items-baseline justify-between border-t pt-3" style={{ borderColor: COLOR.hairline }}>
              <span className={TYPE.itemName} style={{ color: COLOR.text }}>Total</span>
              <span className="numeric" style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 24, color: COLOR.text }}>
                {money(price)}
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-auto flex flex-col gap-2">
          <Button onClick={() => go({ name: "pay", courtId, slotId })}>
            Continue to payment
          </Button>
          <span className={`text-center ${TYPE.meta}`} style={{ color: COLOR.faint }}>
            Free cancellation up to 2 hours before
          </span>
        </div>
      </div>
    </Screen>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <span className={TYPE.meta} style={{ color: COLOR.muted }}>{label}</span>
      <span className={`shrink-0 ${TYPE.rowValue}`} style={{ color: COLOR.text }}>{value}</span>
    </span>
  )
}

function addMinutes(hhmm: string, mins: number) {
  const [h, m] = hhmm.split(":").map(Number)
  const t = h * 60 + m + mins
  return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`
}


/* --------------------------------------------------------------- payment */

const METHODS = [
  { id: "apple", label: "Apple Pay", detail: "Face ID" },
  { id: "card", label: "Visa ···· 4821", detail: "Expires 04/28" },
  { id: "pot", label: "Club credit", detail: "AED 140 in the pot" },
]

export function Payment({
  courtId, slotId, go,
}: { courtId: string; slotId: string; go: (v: AppView) => void }) {
  const court = courtById(courtId)!
  const slot = slots.find((s) => s.id === slotId)!
  const [method, setMethod] = useState("apple")
  const [paying, setPaying] = useState(false)

  const price = slot.discountPct
    ? Math.round(court.pricePerHour * (1 - slot.discountPct / 100))
    : court.pricePerHour
  const usingPot = method === "pot"
  const fromPot = usingPot ? Math.min(user.potCredit, price) : 0
  const due = price - fromPot

  return (
    <Screen>
      <TopBar title="Payment" onBack={() => go({ name: "confirm", courtId, slotId })} />
      <div className="flex flex-1 flex-col gap-3 pb-8">
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Pay with</SectionLabel>
          {METHODS.map((m) => {
            const on = m.id === method
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className="flex items-center gap-3 p-4 text-left"
                style={{
                  background: COLOR.surface,
                  borderRadius: "var(--radius-panel)",
                  outline: on ? `1.5px solid var(--color-brand-600)` : `1px solid transparent`,
                }}
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-pill)]"
                  style={{ border: `1.5px solid ${on ? "var(--color-brand-600)" : COLOR.bar}` }}
                >
                  {on && <span className="h-1.5 w-1.5 rounded-[var(--radius-pill)]" style={{ background: "var(--color-brand-600)" }} />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={TYPE.itemName} style={{ color: COLOR.text }}>{m.label}</span>
                  <span className={TYPE.meta} style={{ color: COLOR.muted }}>{m.detail}</span>
                </span>
              </button>
            )
          })}
        </div>

        <Card>
          <div className="flex flex-col gap-3">
            <Row label={`${court.name} · ${slot.start}`} value={money(court.pricePerHour)} />
            {slot.discountPct && (
              <Row label={`Cancellation discount (${slot.discountPct}%)`} value={`−${money(court.pricePerHour - price)}`} />
            )}
            {usingPot && <Row label="From club credit" value={`−${money(fromPot)}`} />}
            <div className="mt-1 flex items-baseline justify-between border-t pt-3" style={{ borderColor: COLOR.hairline }}>
              <span className={TYPE.itemName} style={{ color: COLOR.text }}>Due now</span>
              <span className="numeric" style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 24, color: COLOR.text }}>
                {money(due)}
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-auto flex flex-col gap-2">
          <Button
            disabled={paying}
            onClick={() => {
              setPaying(true)
              setTimeout(() => go({ name: "success", courtId, slotId }), 1400)
            }}
          >
            {paying ? "Processing…" : `Pay ${money(due)}`}
          </Button>
          <span className={`text-center ${TYPE.meta}`} style={{ color: COLOR.faint }}>
            Refunded in full if you cancel more than 2 hours ahead
          </span>
        </div>
      </div>
    </Screen>
  )
}

/* --------------------------------------------------------------- success */

export function Success({
  courtId, slotId, go,
}: { courtId: string; slotId: string; go: (v: AppView) => void }) {
  const court = courtById(courtId)!
  const slot = slots.find((s) => s.id === slotId)!
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-pill)]" style={{ background: COLOR.successSurface, color: COLOR.success }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <h1 style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 24, color: COLOR.text }}>
            Court booked
          </h1>
          <span className={`text-center ${TYPE.meta}`} style={{ color: COLOR.muted }}>
            {court.name} · Sunday 14 December · {slot.start}
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 p-6" style={{ background: COLOR.surface, borderRadius: "var(--radius-panel)" }}>
          <QrBlock size={168} />
          <span className={`text-center ${TYPE.meta}`} style={{ color: COLOR.muted }}>
            Show this at the court screen to check in
          </span>
        </div>

        {/* What honouring this booking is worth — the incentive stated at the
            moment the commitment is made, not after the fact. */}
        <div className="flex w-full items-center gap-3 p-4" style={{ background: "var(--color-trust-surface)", borderRadius: "var(--radius-panel)" }}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-pill)]" style={{ background: "var(--color-trust)", color: COLOR.inverse }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 4 6.5v5c0 4.2 3.2 7.6 8 8.5 4.8-.9 8-4.3 8-8.5v-5Z" />
            </svg>
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={TYPE.itemName} style={{ color: COLOR.text }}>
              Check in on time for +2
            </span>
            <span className={TYPE.meta} style={{ color: COLOR.muted }}>
              {user.trustScore} → {user.trustScore + 2}. Two more bookings reaches Trusted.
            </span>
          </span>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Button variant="secondary">Add to calendar</Button>
          {/* Demo shortcut: jump to the state after the session has been played. */}
          <Button variant="quiet" onClick={() => go({ name: "post-session" })}>
            Skip ahead — after the session
          </Button>
          <Button variant="quiet" onClick={() => go({ name: "home" })}>Done</Button>
        </div>
      </div>
    </Screen>
  )
}

/** A QR placeholder — deterministic so it looks like a real code, not noise. */
export function QrBlock({ size = 160, dark = false }: { size?: number; dark?: boolean }) {
  const n = 21
  const cell = size / n
  const cells: React.ReactNode[] = []
  const finder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (finder(r, c)) continue
      // Deterministic pattern — stable across renders.
      const on = ((r * 7 + c * 13 + ((r * c) % 5)) % 3) !== 0
      if (!on) continue
      cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} />)
    }
  }
  const ink = dark ? "#FFFFFF" : "#1A1815"
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} fill="none" stroke={ink} strokeWidth={cell} />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} fill={ink} />
    </>
  )
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill={ink} aria-label="Booking QR code">
      {cells}
      <Finder x={cell / 2} y={cell / 2} />
      <Finder x={size - cell * 7.5} y={cell / 2} />
      <Finder x={cell / 2} y={size - cell * 7.5} />
    </svg>
  )
}

/* ---------------------------------------------------------------- walk-in */

export function WalkIn({ go }: { go: (v: AppView) => void }) {
  const free = slots.filter((s) => s.available).slice(0, 4)
  return (
    <Screen>
      <TopBar title="Available now" onBack={() => go({ name: "home" })} />
      <div className="flex flex-col gap-2 pb-4">
        <span className={TYPE.meta} style={{ color: COLOR.muted }}>
          Courts free in the next hour. Claim one and check in at the court screen.
        </span>
      </div>
      <div className="flex flex-col gap-3 pb-8">
        {free.map((s) => {
          const court = courtById(s.courtId)!
          return (
            <Card key={s.id} onClick={() => go({ name: "confirm", courtId: court.id, slotId: s.id })}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-well)]">
                  <CourtImage kind={court.image} height={48} sport={court.sport} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={TYPE.itemName} style={{ color: COLOR.text }}>{court.name}</span>
                  <span className={TYPE.meta} style={{ color: COLOR.muted }}>
                    {court.sport} · free from {s.start}
                  </span>
                </div>
                <Pill tone="success">Free</Pill>
              </div>
            </Card>
          )
        })}
      </div>
    </Screen>
  )
}

/* ------------------------------------------------------------------ trust */

export function Trust({ go }: { go: (v: AppView) => void }) {
  return (
    <Screen>
      <TopBar title="Trust standing" onBack={() => go({ name: "home" })} />
      <div className="flex flex-col gap-5 pb-8">
        <TrustScore score={user.trustScore} />

        <div className="flex flex-col gap-2.5">
          <SectionLabel>Standings</SectionLabel>
          <TrustTiers score={user.trustScore} />
        </div>

        <div className="flex flex-col gap-2.5">
          <SectionLabel>Recent</SectionLabel>
          <Card>
            <div className="flex flex-col">
              {trustEvents.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 py-3"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${COLOR.hairline}` }}
                >
                  <span
                    className={`w-9 shrink-0 numeric ${TYPE.rowValue}`}
                    style={{ color: e.delta > 0 ? COLOR.success : COLOR.danger }}
                  >
                    {e.delta > 0 ? `+${e.delta}` : e.delta}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className={TYPE.itemName} style={{ color: COLOR.text }}>{e.reason}</span>
                    <span className={TYPE.meta} style={{ color: COLOR.faint }}>{e.date}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <span className={TYPE.meta} style={{ color: COLOR.muted }}>
            Your standing moves only on whether a booking was honoured.
          </span>
        </div>
      </div>
    </Screen>
  )
}

/* ---------------------------------------------------------- post-session */

export function PostSession({ go }: { go: (v: AppView) => void }) {
  const newScore = user.trustScore + 2
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-pill)]" style={{ background: COLOR.successSurface, color: COLOR.success }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div className="flex flex-col items-center gap-1.5">
          <h1 style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 24, color: COLOR.text }}>
            Session complete
          </h1>
          <span className={`text-center ${TYPE.meta}`} style={{ color: COLOR.muted }}>
            Al Rahba Pitch 3 · 14:30–15:30
          </span>
        </div>

        <div className="flex w-full flex-col gap-3 p-5" style={{ background: COLOR.surface, borderRadius: "var(--radius-panel)" }}>
          <div className="flex items-center justify-between">
            <span className={TYPE.meta} style={{ color: COLOR.muted }}>Checked in on time</span>
            <span className={TYPE.rowValue} style={{ color: COLOR.success }}>+2</span>
          </div>
          <div className="flex items-baseline justify-between border-t pt-3" style={{ borderColor: COLOR.hairline }}>
            <span className={TYPE.itemName} style={{ color: COLOR.text }}>Trust standing</span>
            <span className="numeric" style={{ fontFamily: "var(--font-family-display)", fontWeight: 600, fontSize: 24, color: COLOR.text }}>
              {newScore}
            </span>
          </div>
          <span className={TYPE.meta} style={{ color: COLOR.muted }}>
            {90 - newScore} points to Trusted — priority on cancellations.
          </span>
        </div>

        <Button onClick={() => go({ name: "home" })}>Done</Button>
      </div>
    </Screen>
  )
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLOR.faint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}
