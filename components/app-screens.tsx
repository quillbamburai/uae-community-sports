"use client"

import { useEffect, useState } from "react"
import { asset } from "@/lib/asset"
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
  | { name: "processing"; courtId: string; slotId: string; method: string }
  | { name: "success"; courtId: string; slotId: string }
  | { name: "walkin" }
  | { name: "trust" }
  | { name: "post-session" }

const money = (n: number) => `AED ${n}`

/**
 * Faces for the open-spot card. The point of that card is that these are real
 * people already playing, so it shows them rather than grey placeholders.
 */
const MEMBERS = [
  "/images/members/m1.jpg",
  "/images/members/m2.jpg",
  "/images/members/m3.jpg",
  "/images/members/m4.jpg",
  "/images/members/m5.png",
]


/* ------------------------------------------------------------------ home */

export function Home({ go }: { go: (v: AppView) => void }) {
  const upcoming = bookings.filter((b) => b.status === "awaiting" || b.status === "upcoming")
  const spot = openSpots[0]

  return (
    <Screen pad={false}>
      {/* The portrait is the only greeting — no name, no salutation bar. */}
      <div className="px-1.5 pt-11">
        <span
          className="flex h-[78px] w-[78px] items-center justify-center overflow-hidden rounded-full"
          style={{ background: COLOR.surface, border: "1px solid #FFFFFF" }}
        >
          <img src={asset("/images/profile.png")} alt="" className="h-[78px] w-auto object-contain" />
        </span>
      </div>

      <SectionHead label="Bookings" className="mt-[47px]" />

      {/* Two booking cards side by side — the photograph carries the card, and
          the type sits directly on it rather than in a strip beneath. */}
      <div className="mt-[24px] grid grid-cols-2 gap-1.5 px-1.5">
        <BookingCard
          photo="/images/football-outside.jpg"
          exposure={-0.68}
          fade={0.9}
          court="Court 1"
          sub="Football . 5-a-side"
          date="20 Sep"
          members="10 members confirmed"
          onClick={() => go({ name: "browse" })}
        />
        <BookingCard
          photo="/images/padel2.jpg"
          exposure={-0.46}
          court="Court 5"
          sub="Padel"
          date="13 Oct"
          members="2 members confirmed"
          onClick={() => go({ name: "browse" })}
        />
      </div>

      <div className="mt-1.5 px-1.5">
        <PillButton label="Schedule a new event" onClick={() => go({ name: "browse" })} />
      </div>

      <SectionHead label="Discover" className="mt-[79px]" />

      {/* Discover runs as a two-column mosaic: a light card and a dark one, then
          a wide card and a narrow one. The rhythm is deliberate — nothing is a
          full-width row until the reward card at the bottom. */}
      <div className="mt-[24px] flex flex-col gap-1.5 px-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <Vo2Card />
          <TrustCard score={user.trustScore} onClick={() => go({ name: "trust" })} />
        </div>

        {/* minmax(0,…) so the avatar row's intrinsic width cannot starve the
            voucher beside it — an `fr` alone respects min-content. */}
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "minmax(0, 283fr) minmax(0, 139fr)" }}
        >
          <OpenSpotCard
            tag="5-a-side: court 4"
            filled={spot.filled}
            capacity={spot.capacity}
            onClick={() => go({ name: "browse" })}
          />
          <Voucher />
        </div>

        <RewardCard onClick={() => go({ name: "trust" })} />
      </div>

      <div className="h-6" />
      <BottomNav go={go} />
    </Screen>
  )
}

/** A section heading with its jump arrow — "Bookings", "Discover". */
function SectionHead({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 px-1.5 ${className}`}>
      {/* Section heads sit at -3%; the screen titles are tighter, at -5%. */}
      <h2
        style={{
          fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
          lineHeight: "100%", letterSpacing: "-0.03em", color: COLOR.text,
        }}
      >
        {label}
      </h2>
      <ArrowChip />
    </div>
  )
}

/** The small dark disc with a downward caret that follows a section heading. */
function ArrowChip() {
  return (
    <span
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{ background: "#082539" }}
    >
      <svg width="8" height="6" viewBox="0 0 8 6" fill="#F5F5F2" aria-hidden>
        <path d="M0 0h8L4 6z" />
      </svg>
    </span>
  )
}

/** A booked session. The photo is the card; the type sits on top of it. */
function BookingCard({
  photo, court, sub, date, members, exposure, fade = 1, onClick,
}: {
  photo: string; court: string; sub: string; date: string
  members: string
  /** Figma exposure, e.g. -0.68. Applied as a brightness multiplier. */
  exposure: number
  /** Fill opacity, where the design sets one below 1. */
  fade?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden rounded-[16px] text-left"
      style={{ height: 185, background: "#0E1A2B" }}
    >
      {/* The photograph carries the type, so it is darkened by exposure the
          way the design does it — evenly, not with a gradient scrim. */}
      <img
        src={asset(photo)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: `brightness(${(1 + exposure).toFixed(2)})`, opacity: fade }}
      />
      <span className="absolute inset-0 flex flex-col px-[19px] pb-[22px] pt-[17px]">
        <span style={{ fontSize: 18, fontWeight: 600, lineHeight: "22px", color: "#FFFFFF" }}>
          {court}
        </span>
        <span className="mt-1" style={{ fontSize: 14, fontWeight: 500, lineHeight: "17px", letterSpacing: "-0.5px", color: "#FFFFFF" }}>
          {sub}
        </span>
        <span
          className="mt-auto"
          style={{
            fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 33,
            lineHeight: "120%", letterSpacing: "-0.1px", color: "#FFFFFF",
          }}
        >
          {date}
        </span>
        <span className="mt-[9px]" style={{ fontSize: 14, fontWeight: 500, lineHeight: "17px", letterSpacing: "-0.5px", color: "#FFFFFF" }}>
          {members}
        </span>
      </span>
    </button>
  )
}

/** The white pill CTA with its dark chevron chip. */
function PillButton({
  label, onClick, full = true, dark = false,
}: { label: string; onClick?: () => void; full?: boolean; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-between gap-2.5 rounded-[30px] py-3 pl-[14px] pr-2.5 ${full ? "w-full" : ""}`}
      style={{ background: dark ? COLOR.text : COLOR.surface }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.03em", color: dark ? "#FFFFFF" : COLOR.text }}>
        {label}
      </span>
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ background: dark ? "#FFFFFF" : COLOR.text }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={dark ? COLOR.text : "#FFFFFF"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6h7M6.5 3l3 3-3 3" />
        </svg>
      </span>
    </button>
  )
}

/** Fitness, read off the sessions actually attended. */
function Vo2Card() {
  return (
    <div
      className="flex flex-col rounded-[16px] px-4 pb-[18px] pt-5"
      style={{
        /* 185 to match the trust card beside it — the frame's 188 is the
           group's bounds including its stroke and shadow, not the card. */
        height: 185, background: COLOR.surface,
        boxShadow: "0 5px 11px rgba(0,0,0,0.05)",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.05em", color: "#000000" }}>
        Your V02 Max
      </span>
      <span
        className="mt-[12px]"
        style={{ fontSize: 11, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.5px", color: "rgba(6,45,72,0.5)" }}
      >
        Your fitness levels are
        <br />
        increasing, keep it up!
      </span>
      <span
        className="numeric mt-auto"
        style={{
          fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 36,
          lineHeight: "120%", letterSpacing: "-0.1px", color: "#062D48",
        }}
      >
        39.9
      </span>
      <span className="mt-[9px] flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#0E1A2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11 11 3M5 3h6v6" />
        </svg>
        <span className="numeric" style={{ fontSize: 14, fontWeight: 500, color: "rgba(14,26,43,0.6)" }}>
          0.05
        </span>
      </span>
    </div>
  )
}

/**
 * Trust standing. The artwork — navy ground, confetti and the glass medallion —
 * is one plate exported from the design; only the figures are live.
 */
function TrustCard({ score, onClick }: { score: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden rounded-[16px] bg-cover bg-center text-left"
      style={{ height: 185, backgroundImage: `url(${asset("/images/trust-card.png")})` }}
    >
      <span className="relative flex h-full flex-col px-[13px] pb-[21px] pt-[19px]">
        <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.5px", color: "#FFFFFF" }}>
          Trust score
        </span>
        <span className="mt-auto flex items-baseline gap-1">
          <span
            className="numeric"
            style={{
              fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 46,
              lineHeight: "50px", letterSpacing: "-1.8px", color: "#FFFFFF",
            }}
          >
            {score}
          </span>
          <span className="numeric" style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>
            / 100
          </span>
        </span>
        <span
          className="mt-[7px] h-[7px] w-full overflow-hidden rounded-full"
          style={{ background: "rgba(224,221,215,0.25)" }}
        >
          <span
            className="block h-full rounded-full"
            style={{ width: "58%", background: "#D3A08C" }}
          />
        </span>
      </span>
    </button>
  )
}

/** A booking short of players. The avatar row is the invitation. */
function OpenSpotCard({
  tag, filled, capacity, onClick,
}: { tag: string; filled: number; capacity: number; onClick: () => void }) {
  const more = Math.max(0, capacity - filled + 3)
  return (
    <div
      className="relative overflow-hidden rounded-[16px]"
      style={{ height: 185, background: COLOR.surface }}
    >
      {/* The tag sits inside the card, 12px in from its top-left corner. */}
      <span
        className="absolute flex h-[25px] items-center rounded-[24px] px-[9px]"
        style={{ left: 12, top: 12, background: "#D0A99B" }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "-0.5px", color: "#FFFFFF" }}>{tag}</span>
      </span>

      <button
        type="button"
        onClick={onClick}
        aria-label="Open spot"
        className="absolute flex h-12 w-12 items-center justify-center rounded-full"
        style={{ left: 212, top: 20, background: "#F4F4F4" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0E1A2B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11 11 3M5 3h6v6" />
        </svg>
      </button>

      <span
        className="absolute"
        style={{ left: 12, top: 69, fontSize: 18, fontWeight: 500, lineHeight: "115%", letterSpacing: "-0.05em", color: "#062D48" }}
      >
        Join for free:
        <br />
        open spot
      </span>

      {/* The members already playing sit to the left at 4px spacing; the count
          of everyone else is pushed to the card's right edge. */}
      <span
        className="absolute flex items-center justify-between"
        style={{ left: 12, right: 14, top: 141, height: 32 }}
      >
        <span className="flex items-center gap-1">
          {MEMBERS.map((src) => (
            <span
              key={src}
              className="h-8 w-8 shrink-0 overflow-hidden rounded-full"
              style={{ background: "#D9D9D9" }}
            >
              <img src={asset(src)} alt="" className="h-full w-full object-cover" />
            </span>
          ))}
        </span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: "#062D48" }}
        >
          <span className="numeric" style={{ fontSize: 11, color: "#FFFFFF" }}>+{more}</span>
        </span>
      </span>
    </div>
  )
}

/**
 * The coffee voucher. Small enough to sit beside the open-spot card on Home,
 * and wide enough to run as a full-width row on Browse — so it takes a
 * `layout` rather than being written twice.
 */
export function Voucher({ layout = "tile" }: { layout?: "tile" | "row" }) {
  if (layout === "row") {
    return (
      <div
        className="flex items-center overflow-hidden rounded-[16px] pl-[14px]"
        style={{ height: 102, background: COLOR.surface }}
      >
        <span style={{ fontSize: 18, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.05em", color: "#062D48" }}>
          Free coffee
          <br />
          voucher
        </span>
        <span
          className="ml-10 max-w-[92px]"
          style={{ fontSize: 11, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.5px", color: "rgba(6,45,72,0.5)" }}
        >
          A thank you from the team
        </span>
        <img
          src={asset("/images/coffee.png")}
          alt=""
          className="ml-auto mr-[10px] h-[85px] w-[121px] shrink-0 rounded-[12px] object-cover"
        />
      </div>
    )
  }
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[16px] px-[10px] pb-[10px] pt-[19px]"
      style={{ height: 185, background: COLOR.surface }}
    >
      <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "100%", letterSpacing: "-0.05em", color: "#062D48" }}>
        Free coffee
        <br />
        voucher
      </span>
      <span
        className="mt-3"
        style={{ fontSize: 11, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.5px", color: "rgba(6,45,72,0.5)" }}
      >
        A thank you from the team
      </span>
      {/* Measured off the component's own render: a 108x76 tile at L13, sitting
          flush on the card's foot. */}
      <span
        className="absolute bottom-0 overflow-hidden rounded-[26px]"
        style={{ left: 13, width: 108, height: 76, background: "#C08A63" }}
      >
        {/* The component crops the square artwork into a landscape tile with a
            0.5 scale, so the cup sits whole inside it rather than filling it. */}
        <img
          src={asset("/images/coffee.png")}
          alt=""
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 108, height: "auto" }}
        />
      </span>
    </div>
  )
}

/** The reward the standing has earned. The only full-width card on Home. */
function RewardCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-[14px] bg-cover bg-center"
      style={{ height: 279, backgroundImage: `url(${asset("/images/reward-card.png")})` }}
    >
      <span className="relative flex h-full flex-col px-6 pb-[22px] pt-[24px]">
        <span
          className="max-w-[360px]"
          style={{
            fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
            lineHeight: "100%", letterSpacing: "-0.05em", color: "#FFFFFF",
          }}
        >
          You&rsquo;re now a &lsquo;trusted member&rsquo;!
        </span>
        <span
          className="mt-[9px] max-w-[216px]"
          style={{ fontSize: 14, lineHeight: "115%", letterSpacing: "-0.03em", color: "#B9D9F7" }}
        >
          {user.name}, your loyalty has been rewarded with a range of deals
          personalised to you.
        </span>
        <span className="mt-auto">
          <PillButton label="Redeem now" onClick={onClick} full={false} />
        </span>
      </span>
    </div>
  )
}

/** Three destinations. The kiosk is a separate product and is not in here. */
function BottomNav({ go }: { go: (v: AppView) => void }) {
  const items = [
    { label: "Home", active: true, view: { name: "home" } as AppView,
      path: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" },
    { label: "Courts", active: false, view: { name: "browse" } as AppView,
      path: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
    { label: "Trust", active: false, view: { name: "trust" } as AppView,
      path: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  ]
  return (
    <nav
      className="sticky bottom-0 z-10 mt-auto flex h-20 shrink-0 items-center justify-center gap-6 px-5"
      style={{ background: COLOR.canvas }}
    >
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          onClick={() => go(it.view)}
          aria-label={it.label}
          className="flex h-20 w-[82px] flex-col items-center justify-center gap-1"
        >
          <svg
            width="26" height="26" viewBox="0 0 24 24"
            fill={it.label === "Home" ? "#0E1A2B" : "none"}
            stroke={it.active ? "#0E1A2B" : "rgba(1,28,49,0.35)"}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d={it.path} />
          </svg>
        </button>
      ))}
    </nav>
  )
}

/* ---------------------------------------------------------------- browse */

export function Browse({ go }: { go: (v: AppView) => void }) {
  /* The panel's selections narrow the rails below it. Kept in this screen
     rather than a store — the prototype has one search at a time. */
  const [date, setDate] = useState("Today")
  const [sport, setSport] = useState<string | null>(null)
  const [price, setPrice] = useState<string | null>(null)
  const [open, setOpen] = useState<null | "date" | "sport" | "price">(null)

  const priceCap =
    price === "Under AED 100" ? 100 : price === "Under AED 150" ? 150 : Infinity

  const bySport: { sport: string; courts: { court: Court; next: Slot }[] }[] = []
  for (const s of ["Padel", "Football", "Tennis", "Badminton"]) {
    if (sport && s !== sport) continue
    const seen = new Map<string, { court: Court; next: Slot }>()
    for (const slot of slots) {
      if (!slot.available) continue
      const court = courtById(slot.courtId)
      if (!court || court.sport !== s || seen.has(court.id)) continue
      if (court.pricePerHour > priceCap) continue
      seen.set(court.id, { court, next: slot })
    }
    if (seen.size) bySport.push({ sport: s, courts: [...seen.values()] })
  }

  return (
    <Screen pad={false}>
      {/* Back sits above the heading, in the space the frame leaves there,
          rather than over the type. */}
      <div className="px-3.5 pt-14">
        <button
          type="button"
          onClick={() => go({ name: "home" })}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: COLOR.surface, color: COLOR.text }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
      </div>

      <div className="px-3.5 pt-[30px]">
        <h1
          style={{
            fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
            lineHeight: "100%", letterSpacing: "-0.05em", color: COLOR.text,
          }}
        >
          Book new
          <br />
          appointment
        </h1>
      </div>

      {/* Search panel — the inputs resolve the browse, rather than filtering a
          list that is already on screen. */}
      <div className="mx-1.5 mt-[40px] rounded-[20px] p-3.5" style={{ background: COLOR.surface }}>
        <div className="grid grid-cols-2 gap-2.5">
          <Field
            label={date}
            placeholder="Check In"
            icon="calendar"
            active={open === "date"}
            onClick={() => setOpen(open === "date" ? null : "date")}
          />
          <Field
            label={date === "Today" ? "1 hour" : "1 hour"}
            placeholder="Check Out"
            icon="calendar"
            muted
            onClick={() => setOpen(open === "date" ? null : "date")}
          />
          <Field
            label={sport}
            placeholder="Type"
            icon="chevron"
            active={open === "sport"}
            onClick={() => setOpen(open === "sport" ? null : "sport")}
          />
          <Field
            label={price}
            placeholder="Price"
            icon="chevron"
            active={open === "price"}
            onClick={() => setOpen(open === "price" ? null : "price")}
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(null)}
          className="mt-[23px] flex h-11 w-full items-center justify-center gap-2.5 rounded-[14px]"
          style={{ background: COLOR.text, color: COLOR.inverse }}
        >
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.03em" }}>Search for courts</span>
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.5" />
              <path d="M10.5 10.5 14 14" />
            </svg>
          </span>
        </button>
      </div>

      {/* One horizontally scrolling rail per sport. */}
      {bySport.map(({ sport: s, courts: list }) => (
        <section key={s} className="mt-[55px]">
          <h2 className="px-3.5 pb-4" style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.05em", color: "#000000" }}>
            {s}
          </h2>
          <div className="flex gap-3 overflow-x-auto px-3.5 pb-1" style={{ scrollbarWidth: "none" }}>
            {list.map(({ court }, i) => (
              <CourtCard
                key={court.id}
                court={court}
                go={go}
                badge={court.popular ? "Popular" : i === 0 ? "15% Off" : undefined}
              />
            ))}
          </div>

          {/* The voucher follows the padel rail rather than sitting above the
              list — it is encountered while scanning, the same way the promos
              are, so it reads as an offer and not an advertisement. */}
          {s === "Padel" && (
            <div className="mt-4 px-3.5">
              <Voucher layout="row" />
            </div>
          )}
        </section>
      ))}

      {bySport.length === 0 && (
        <p className="px-3.5 pt-12 text-center" style={{ fontSize: 14, color: "rgba(6,45,72,0.6)" }}>
          No courts match that search. Try a wider price or another sport.
        </p>
      )}

      <div className="h-6" />
      <BottomNav go={go} />

      {open && (
        <PickerSheet
          kind={open}
          date={date}
          sport={sport}
          price={price}
          onPick={(value) => {
            if (open === "date") setDate(value ?? "Today")
            else if (open === "sport") setSport(value)
            else setPrice(value)
            setOpen(null)
          }}
          onClose={() => setOpen(null)}
        />
      )}
    </Screen>
  )
}

/**
 * The picker that a search field opens. A sheet over the screen rather than
 * chips inside the panel — choosing a date should not make the page move
 * under the thing you are reading.
 */
function PickerSheet({
  kind, date, sport, price, onPick, onClose,
}: {
  kind: "date" | "sport" | "price"
  date: string
  sport: string | null
  price: string | null
  onPick: (value: string | null) => void
  onClose: () => void
}) {
  const title = kind === "date" ? "Select a date" : kind === "sport" ? "Select a sport" : "Select a price"

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {/* The scrim closes the sheet, so there is always a way out. */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(6,26,43,0.45)", backdropFilter: "blur(2px)" }}
      />

      <div
        className="relative rounded-t-[24px] px-5 pb-7 pt-5"
        style={{ background: COLOR.canvas }}
      >
        <span className="mx-auto mb-5 block h-1 w-10 rounded-full" style={{ background: "rgba(6,45,72,0.2)" }} />

        <div className="mb-4 flex items-center justify-between">
          <span style={{ fontSize: 18, fontWeight: 500, color: COLOR.text }}>{title}</span>
          <button
            type="button"
            onClick={onClose}
            style={{ fontSize: 14, fontWeight: 500, color: "rgba(6,45,72,0.6)" }}
          >
            Close
          </button>
        </div>

        {kind === "date" ? (
          <DateGrid selected={date} onPick={onPick} />
        ) : (
          <div className="flex flex-col gap-1.5">
            {(kind === "sport"
              ? ["Padel", "Football", "Tennis", "Badminton"]
              : ["Under AED 100", "Under AED 150", "Any price"]
            ).map((opt) => {
              const on = kind === "sport" ? sport === opt : price === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onPick(on ? null : opt)}
                  className="flex h-14 items-center justify-between rounded-[14px] px-4"
                  style={{
                    background: COLOR.surface,
                    outline: on ? `1.5px solid ${COLOR.text}` : "none",
                    outlineOffset: -1.5,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: COLOR.text }}>{opt}</span>
                  {on && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={COLOR.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 8.5 3.5 3.5L13 5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/** A fortnight of dates. Enough to choose from without a full calendar. */
function DateGrid({
  selected, onPick,
}: { selected: string; onPick: (value: string) => void }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  /* The prototype's "today" is fixed so the data lines up with the slots. */
  const start = new Date("2026-12-14T00:00:00")

  const cells: { label: string; day: string; num: number }[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    cells.push({
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${days[(d.getDay() + 6) % 7]} ${d.getDate()}`,
      day: days[(d.getDay() + 6) % 7],
      num: d.getDate(),
    })
  }

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <span
            key={d}
            className="text-center"
            style={{ fontSize: 11, fontWeight: 500, color: "rgba(6,45,72,0.45)" }}
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((c) => {
          const on = selected === c.label
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => onPick(c.label)}
              className="flex h-12 items-center justify-center rounded-[12px]"
              style={{
                background: on ? COLOR.text : COLOR.surface,
                color: on ? "#FFFFFF" : COLOR.text,
              }}
            >
              <span className="numeric" style={{ fontSize: 15, fontWeight: 500 }}>{c.num}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-3" style={{ fontSize: 11, color: "rgba(6,45,72,0.5)" }}>
        Showing {selected}. Courts are released 30 days ahead for Trusted members.
      </p>
    </div>
  )
}

/** One field in the search panel. Shows its value once chosen, else its name. */
function Field({
  label, placeholder, icon, active, muted, onClick,
}: {
  label: string | null
  placeholder: string
  icon: "calendar" | "chevron"
  active?: boolean
  muted?: boolean
  onClick: () => void
}) {
  const chosen = Boolean(label)
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-14 items-center gap-2 rounded-[14px] px-4 text-left"
      style={{
        background: "var(--color-brand-50)",
        outline: active ? `1.5px solid ${COLOR.text}` : "none",
        outlineOffset: -1.5,
      }}
    >
      <span
        className="flex-1 truncate"
        style={{
          fontSize: 15, fontWeight: 500,
          color: chosen && !muted ? COLOR.text : "rgba(6,45,72,0.55)",
        }}
      >
        {label ?? placeholder}
      </span>
      {icon === "calendar" ? (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="rgba(6,45,72,0.55)" strokeWidth="1.5" strokeLinecap="round">
          <rect x="2" y="4" width="16" height="14" rx="2" /><path d="M2 8h16M6 2v4M14 2v4" />
        </svg>
      ) : (
        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" stroke="rgba(6,45,72,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1l5 5 5-5" />
        </svg>
      )}
    </button>
  )
}

/**
 * A court card: white shell with the photo inset, so the card's own white
 * carries the type rather than the photograph running to its edge. The meta
 * line is the court's amenities — what you get — not the next free slot.
 */
function CourtCard({
  court, go, badge,
}: { court: Court; go: (v: AppView) => void; badge?: string }) {
  return (
    <button
      type="button"
      onClick={() => go({ name: "court", courtId: court.id })}
      className="flex shrink-0 flex-col overflow-hidden rounded-[20px] p-3 text-left"
      style={{ width: 236, height: 300, background: COLOR.surface }}
    >
      <div className="relative shrink-0 overflow-hidden rounded-[14px]" style={{ height: 180 }}>
        <img src={asset(court.photo)} alt="" className="h-full w-full object-cover" />
        {badge && (
          <span
            className="absolute left-2.5 top-2.5 flex h-7 items-center rounded-[14px] px-3"
            style={{ background: COLOR.surface, fontSize: 12, fontWeight: 500, color: COLOR.text }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-[8px]">
        <span className="flex items-center gap-1.5">
          <svg width="14" height="13" viewBox="0 0 14 14" fill="#E5A338">
            <path d="M7 0l2 4.4 4.8.6-3.5 3.3.9 4.7L7 10.8 2.8 13l.9-4.7L.2 5l4.8-.6z" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500, color: COLOR.text }}>{court.rating}</span>
          <span style={{ fontSize: 14, color: "rgba(6,45,72,0.5)" }}>({court.reviews})</span>
        </span>
        <span
          className="mt-[8px]"
          style={{ fontSize: 20, fontWeight: 500, lineHeight: "27px", letterSpacing: "-0.05em", color: COLOR.text }}
        >
          {court.name}
        </span>
        {/* One line only — it truncates rather than wrapping, so every card in
            a rail keeps the same rhythm. */}
        <span
          className="mt-1.5 truncate"
          style={{ fontSize: 14, lineHeight: "19px", color: "rgba(6,45,72,0.6)" }}
        >
          {[court.surface, ...court.amenities].join(" · ").toLowerCase()}
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
  const chosen = courtSlots.find((s) => s.id === picked) ?? courtSlots[0]

  return (
    <Screen pad={false}>
      {/* A mosaic rather than one hero image: four tiles, the last carrying the
          count of what is not shown. */}
      <div className="flex shrink-0 flex-col gap-1.5 px-1.5 pt-6">
        <div className="flex gap-1.5">
          <PhotoTile src={court.photo} w={153} corner="tl" onClick={() => go({ name: "browse" })} />
          <PhotoTile src={court.photo} w={269} corner="tr" exposure={-0.61} />
        </div>
        <div className="flex gap-1.5">
          <PhotoTile src={court.photo} w={269} corner="bl" />
          <PhotoTile src={court.photo} w={153} corner="br" more="05+" />
        </div>
      </div>

      <div className="shrink-0 px-5">
        <span
          className="mt-[41px] flex h-[25px] w-fit items-center rounded-[24px] px-1.5"
          style={{ background: COLOR.surface }}
        >
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "-0.5px", color: "#000000" }}>Most popular</span>
        </span>

        <p className="mt-[15px]" style={{ fontSize: 14, fontWeight: 500, color: "#000000" }}>
          {court.sport} · up to {court.capacity} players
        </p>

        <h1
          className="mt-1.5"
          style={{
            fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
            lineHeight: "38px", letterSpacing: "-0.05em", color: "#000000",
          }}
        >
          {court.name}
        </h1>

        <p className="mt-1.5" style={{ fontSize: 14, lineHeight: "18px", color: "rgba(0,0,0,0.65)" }}>
          {[court.surface, ...court.amenities].join(" · ")}
        </p>
      </div>

      {/* Dimensions: the one thing people ask that a photograph cannot answer. */}
      <div
        className="mx-1.5 mt-[37px] flex shrink-0 overflow-hidden rounded-[16px]"
        style={{ height: 168, background: COLOR.surface }}
      >
        <div className="flex flex-1 flex-col px-[22px] py-[26px]">
          <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.05em", color: "#000000" }}>
            Dimensions
          </span>
          {/* The capacity is the part people are checking, so it carries full
              weight and an underline while the rest of the line recedes. */}
          <span
            className="mt-3 max-w-[128px]"
            style={{ fontSize: 11, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.5px", color: "rgba(6,45,72,0.5)" }}
          >
            {(() => {
              const m = court.dimensionsNote.match(/^(.*?)(\d+ people\.)$/)
              if (!m) return court.dimensionsNote
              return (
                <>
                  {m[1]}
                  <span style={{ color: "#062D48", textDecoration: "underline" }}>{m[2]}</span>
                </>
              )
            })()}
          </span>
          <span
            className="numeric mt-auto"
            style={{
              fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 36,
              lineHeight: "120%", letterSpacing: "-0.1px", color: "#062D48",
            }}
          >
            {court.dimensions}
          </span>
        </div>
        <img
          src={asset("/images/court-dimensions.png")}
          alt=""
          className="my-8 mr-[15px] h-[104px] w-[186px] shrink-0 rounded-[61px] object-contain"
        />
      </div>

      {/* Times run as a grid of three, so a whole evening is visible at once. */}
      <div className="mt-[35px] grid shrink-0 grid-cols-3 gap-1.5 px-1.5">
        {courtSlots.map((s) => {
          const on = s.id === picked
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setPicked(s.id)}
              className="flex h-[65px] flex-col items-center justify-center gap-[3px] rounded-[14px]"
              style={{ background: on ? COLOR.text : COLOR.surface }}
            >
              <span
                className="numeric"
                style={{ fontSize: 14, fontWeight: 500, color: on ? "#FFFFFF" : "#062D48" }}
              >
                {s.start}
              </span>
              <span style={{ fontSize: 11, color: on ? "rgba(255,255,255,0.70)" : "rgba(6,45,72,0.50)" }}>
                1 hour
              </span>
            </button>
          )
        })}
      </div>

      {/* Sits the slot grid 84px clear of the footer. The footer is sticky, so
          this is the gap that shows once the page is scrolled to the end. */}
      <div className="h-[84px] shrink-0" />

      {/* The footer states the rule before the commitment, not after it. */}
      <footer className="sticky bottom-0 mt-auto pt-5" style={{ background: COLOR.surface }}>
        <div
          className="mx-5 flex flex-col justify-center rounded-[16px] px-4"
          style={{ height: 80, background: "#B4E1EA" }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, lineHeight: "24px", color: COLOR.text }}>
            Check in within {GRACE_MINUTES} minutes
          </span>
          <span className="mt-1" style={{ fontSize: 11, lineHeight: "16px", color: COLOR.text }}>
            The court is held until {chosen ? addMinutes(chosen.start, GRACE_MINUTES) : "—"}
          </span>
        </div>

        <div className="mt-[30px] flex items-center justify-between px-5">
          <span style={{ fontSize: 14, lineHeight: "18px", color: "rgba(6,45,72,0.6)" }}>
            {chosen ? `${chosen.start}–${chosen.end}` : "—"} · 1 hour
          </span>
          <span
            className="numeric"
            style={{
              fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 24,
              lineHeight: "30px", letterSpacing: "-0.2px", color: COLOR.text,
            }}
          >
            {money(court.pricePerHour)}
          </span>
        </div>

        <div className="px-1.5 pb-5 pt-[19px]">
          <PillButton
            label="Continue to booking"
            dark
            onClick={() =>
              chosen && go({ name: "pay", courtId: court.id, slotId: chosen.id })
            }
          />
        </div>
      </footer>
    </Screen>
  )
}

/** One tile of the court mosaic. Only the outer corners of the block round. */
function PhotoTile({
  src, w, corner, more, exposure = -0.58, onClick,
}: {
  src: string; w: number
  corner: "tl" | "tr" | "bl" | "br"
  more?: string
  /** Figma exposure for this tile. */
  exposure?: number
  onClick?: () => void
}) {
  const radius = {
    tl: "16px 0 0 0", tr: "0 16px 0 0", bl: "0 0 0 16px", br: "0 0 16px 0",
  }[corner]
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width: w, height: 145, borderRadius: radius }}
    >
      <img
        src={asset(src)}
        alt=""
        className="h-full w-full object-cover"
        style={{ filter: `brightness(${(1 + exposure).toFixed(2)})` }}
      />
      {more && (
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span className="numeric" style={{ fontSize: 20, fontWeight: 500, color: "#FFFFFF" }}>
            {more}
          </span>
        </span>
      )}
      {onClick && (
        <button
          type="button"
          onClick={onClick}
          aria-label="Back"
          className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: COLOR.surface, color: COLOR.text }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
      )}
    </div>
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

/**
 * Payment. The booking is restated in full before the method is chosen — the
 * grace period is a commitment on both sides, so the terms stay visible right
 * up to the moment of paying.
 */
export function Payment({
  courtId, slotId, go,
}: {
  courtId: string
  slotId: string
  go: (v: AppView) => void
}) {
  const court = courtById(courtId)!
  const slot = slots.find((s) => s.id === slotId)!
  const [method, setMethod] = useState("apple")

  const methods = [
    { id: "apple", name: "Apple Pay", note: "Face ID", logo: "/images/logos/apple-pay.svg" },
    { id: "visa", name: "Visa ···· 4821", note: "Expires 04/28", logo: "/images/logos/visa.svg" },
    { id: "pot", name: "Club credit", note: `${money(user.potCredit)} in the pot`, logo: null },
  ]

  return (
    <Screen pad={false}>
      {/* Back returns to the court, so a payment can be abandoned without
          losing the slot that was chosen. */}
      <div className="px-3.5 pt-14">
        <button
          type="button"
          onClick={() => go({ name: "court", courtId })}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: COLOR.surface, color: COLOR.text }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
      </div>

      <h1
        className="px-3.5 pt-[30px]"
        style={{
          fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
          lineHeight: "100%", letterSpacing: "-0.05em", color: COLOR.text,
        }}
      >
        Book new
        <br />
        appointment
      </h1>

      {/* What is being bought, in the court's own terms. */}
      <div className="mx-1.5 mt-[35px] rounded-[16px] px-[22px] py-5" style={{ background: COLOR.surface }}>
        <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "24px", color: "#000000" }}>
          Your booking
        </span>
        <div className="mt-[14px] flex flex-col gap-[11px]">
          <SummaryRow label="Sport" value={court.sport} />
          <SummaryRow label="Players" value={`up to ${court.capacity}`} />
          <SummaryRow label="Surface" value={court.surface} />
        </div>
      </div>

      <div className="mx-1.5 mt-1.5 rounded-[16px] px-[22px] py-[22px]" style={{ background: COLOR.surface }}>
        <div className="flex items-baseline justify-between">
          <span style={{ fontSize: 14, color: "rgba(6,45,72,0.6)" }}>
            {court.name} · {slot.start}
          </span>
          <span className="numeric" style={{ fontSize: 14, fontWeight: 500, color: "#062D48" }}>
            {money(court.pricePerHour)}
          </span>
        </div>
        <div className="my-[15px] h-px w-full" style={{ background: "rgba(6,45,72,0.12)" }} />
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "24px", color: "#000000" }}>
            Due now
          </span>
          <span
            className="numeric"
            style={{
              fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 24,
              lineHeight: "32px", color: COLOR.text,
            }}
          >
            {money(court.pricePerHour)}
          </span>
        </div>
      </div>

      <div className="mt-[59px] flex items-baseline justify-between px-3.5">
        <span className="flex items-center gap-3">
          <h2
            style={{
              fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
              lineHeight: "100%", letterSpacing: "-0.05em", color: COLOR.text,
            }}
          >
            Payment
          </h2>
        </span>
        <button
          type="button"
          style={{ fontSize: 14, fontWeight: 500, color: "#000000", textDecoration: "underline" }}
        >
          Add new
        </button>
      </div>

      <div className="mt-[19px] flex flex-col gap-1.5 px-1.5">
        {methods.map((m) => {
          const on = m.id === method
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className="flex h-[74px] items-center gap-3 rounded-[16px] px-[22px] text-left"
              style={{
                background: COLOR.surface,
                outline: on ? `1.5px solid ${COLOR.text}` : "none",
                outlineOffset: -1.5,
              }}
            >
              <span
                className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
                style={{
                  border: `1.5px solid ${on ? COLOR.text : "rgba(6,45,72,0.25)"}`,
                }}
              >
                {on && (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLOR.text }} />
                )}
              </span>
              <span className="flex flex-1 flex-col">
                <span style={{ fontSize: 18, fontWeight: 500, lineHeight: "24px", color: "#000000" }}>
                  {m.name}
                </span>
                <span style={{ fontSize: 11, lineHeight: "15px", color: "rgba(6,45,72,0.5)" }}>
                  {m.note}
                </span>
              </span>
              {/* The brand mark sits on the right edge, so the row scans as
                  name first and payment rail second. */}
              {m.logo && (
                <img
                  src={asset(m.logo)}
                  alt=""
                  className="shrink-0 object-contain"
                  style={{ height: m.id === "apple" ? 44 : 18, width: "auto" }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Clears the sticky footer. */}
      <div className="h-[167px] shrink-0" />

      <footer className="sticky bottom-0 mt-auto pt-9" style={{ background: COLOR.surface }}>
        <div className="flex items-center justify-between px-5">
          <span style={{ fontSize: 14, lineHeight: "18px", color: "rgba(6,45,72,0.6)" }}>
            {slot.start}–{slot.end} · 1 hour
          </span>
          <span
            className="numeric"
            style={{
              fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 24,
              lineHeight: "30px", letterSpacing: "-0.2px", color: COLOR.text,
            }}
          >
            {money(court.pricePerHour)}
          </span>
        </div>
        <div className="px-1.5 pb-5 pt-[19px]">
          <PillButton
            label={`Pay ${court.pricePerHour} AED`}
            dark
            onClick={() => go({ name: "processing", courtId, slotId, method })}
          />
        </div>
      </footer>
    </Screen>
  )
}

/** A label/value pair in the booking summary. */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span style={{ fontSize: 14, lineHeight: "19px", color: "rgba(6,45,72,0.6)" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500, lineHeight: "19px", color: "#062D48" }}>
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------ payment processing */

/**
 * The bank's moment. A payment is the one step where a wait is reassuring
 * rather than annoying — so it is shown honestly, with the rail's own mark,
 * and moves on by itself.
 */
export function Processing({
  courtId, slotId, method, go,
}: {
  courtId: string
  slotId: string
  method: string
  go: (v: AppView) => void
}) {
  const court = courtById(courtId)!
  const [step, setStep] = useState(0)

  const stages = [
    "Contacting your bank",
    "Authorising payment",
    "Confirming your court",
  ]

  const logo =
    method === "visa" ? "/images/logos/visa.svg"
    : method === "apple" ? "/images/logos/apple-pay.svg"
    : null

  useEffect(() => {
    if (step >= stages.length) {
      const done = setTimeout(() => go({ name: "success", courtId, slotId }), 620)
      return () => clearTimeout(done)
    }
    const t = setTimeout(() => setStep((n) => n + 1), 900)
    return () => clearTimeout(t)
  }, [step, courtId, slotId, go, stages.length])

  return (
    <Screen pad={false}>
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* The card brand, held still while its own rail is being called. */}
        <span
          className="flex items-center justify-center rounded-[20px]"
          style={{ width: 132, height: 84, background: COLOR.surface }}
        >
          {logo ? (
            <img
              src={asset(logo)}
              alt=""
              className="object-contain"
              style={{ height: method === "apple" ? 54 : 26, width: "auto" }}
            />
          ) : (
            <span style={{ fontSize: 15, fontWeight: 500, color: COLOR.text }}>Club credit</span>
          )}
        </span>

        <span
          className="numeric mt-8"
          style={{
            fontFamily: "var(--font-family-display)", fontWeight: 400, fontSize: 32,
            lineHeight: "100%", letterSpacing: "-0.05em", color: COLOR.text,
          }}
        >
          {money(court.pricePerHour)}
        </span>

        <span
          className="mt-3 text-center"
          style={{ fontSize: 14, lineHeight: "19px", color: "rgba(6,45,72,0.6)" }}
        >
          {step < stages.length ? stages[step] : "Payment approved"}
        </span>

        {/* Three ticks, filling as each stage clears. */}
        <span className="mt-9 flex items-center gap-2">
          {stages.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i <= step ? 34 : 18,
                background: i <= step ? "#D3A08C" : "rgba(6,45,72,0.18)",
              }}
            />
          ))}
        </span>

        <span
          className="mt-10 text-center"
          style={{ fontSize: 11, lineHeight: "16px", color: "rgba(6,45,72,0.45)" }}
        >
          Do not close this screen.
          <br />
          Your court is held while the payment clears.
        </span>
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
