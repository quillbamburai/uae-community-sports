import type {
  Booking, Court, OpenSpot, Promo, Slot, TrustEvent, TrustTier,
} from "./types"

/** The person using the app. */
export const user = {
  name: "Quill",
  fullName: "David Quill",
  trustScore: 86,
  /** Credits held jointly with connected members — "in the pot". */
  potCredit: 140,
  connectedMembers: 6,
}

/**
 * Trust tiers. Framed as entitlements a standing earns, not levels unlocked —
 * the brief is explicit that this is a civic utility, not a game.
 */
export const trustTiers: TrustTier[] = [
  { name: "Standard", from: 0, benefit: "Book up to 7 days ahead" },
  { name: "Established", from: 70, benefit: "Book 14 days ahead · 10-minute grace" },
  { name: "Trusted", from: 90, benefit: "Book 30 days ahead · priority on cancellations" },
]

/** Recent movement, most recent first. Only honoured or missed bookings move it. */
export const trustEvents: TrustEvent[] = [
  { id: "t1", date: "2 Dec", delta: +2, reason: "Checked in on time — Pitch 3" },
  { id: "t2", date: "28 Nov", delta: +2, reason: "Checked in on time — Padel 1" },
  { id: "t3", date: "21 Nov", delta: -6, reason: "No-show — Court 2" },
  { id: "t4", date: "14 Nov", delta: +2, reason: "Checked in on time — Pitch 1" },
  { id: "t5", date: "9 Nov", delta: +2, reason: "Released early — court rebooked" },
]

export const courts: Court[] = [
  {
    id: "pitch-3", name: "Al Rahba Pitch 3", sport: "Football", capacity: 12,
    surface: "3G artificial", amenities: ["Floodlit", "Changing rooms", "Parking"],
    image: "football-1", pricePerHour: 180,
  },
  {
    id: "pitch-1", name: "Al Rahba Pitch 1", sport: "Football", capacity: 12,
    surface: "3G artificial", amenities: ["Floodlit", "Changing rooms", "Spectator seating"],
    image: "football-2", pricePerHour: 180,
  },
  {
    id: "padel-1", name: "Marina Padel 1", sport: "Padel", capacity: 4,
    surface: "Glass court", amenities: ["Floodlit", "Racket hire"],
    image: "padel-1", pricePerHour: 120,
  },
  {
    id: "padel-2", name: "Marina Padel 2", sport: "Padel", capacity: 4,
    surface: "Glass court", amenities: ["Floodlit", "Racket hire", "Covered"],
    image: "padel-2", pricePerHour: 140,
  },
  {
    id: "tennis-2", name: "Corniche Court 2", sport: "Tennis", capacity: 4,
    surface: "Acrylic hard", amenities: ["Floodlit", "Ball machine"],
    image: "tennis-1", pricePerHour: 100,
  },
  {
    id: "badminton-4", name: "Community Hall 4", sport: "Badminton", capacity: 4,
    surface: "Sprung timber", amenities: ["Indoor", "Air conditioned", "Racket hire"],
    image: "badminton-1", pricePerHour: 80,
  },
]

export const slots: Slot[] = [
  { id: "s1", courtId: "pitch-3", date: "2026-12-14", start: "14:30", end: "15:30", available: true },
  { id: "s2", courtId: "pitch-1", date: "2026-12-14", start: "15:00", end: "16:00", available: true, discountPct: 50 },
  { id: "s3", courtId: "padel-1", date: "2026-12-14", start: "16:00", end: "17:00", available: true },
  { id: "s4", courtId: "padel-2", date: "2026-12-14", start: "17:30", end: "18:30", available: true },
  { id: "s5", courtId: "tennis-2", date: "2026-12-14", start: "18:00", end: "19:00", available: true },
  { id: "s6", courtId: "badminton-4", date: "2026-12-14", start: "19:00", end: "20:00", available: true },
  { id: "s7", courtId: "pitch-3", date: "2026-12-14", start: "20:00", end: "21:00", available: true },
]

/**
 * Promos are interleaved into the browse list rather than pinned above it.
 * `afterIndex` is the card they follow — encountered while scanning, so they
 * read as one of the options rather than an advertisement scrolled past.
 */
export const promos: Promo[] = [
  {
    id: "p1", kind: "perk", afterIndex: 1,
    headline: "Free coffee today",
    detail: "Book any court online and collect from the clubhouse.",
  },
  {
    id: "p2", kind: "cancellation", afterIndex: 3,
    headline: "50% off — just cancelled",
    detail: "Pitch 1 at 15:00 has come free. Half price if taken within the hour.",
  },
  {
    id: "p3", kind: "invite", afterIndex: 5,
    headline: "Invite a member",
    detail: "Both of you receive 30 credits toward a booking.",
  },
]

/** Bookings short of players — join instead of booking a court alone. */
export const openSpots: OpenSpot[] = [
  {
    id: "o1", courtId: "pitch-3", date: "2026-12-14", start: "14:30",
    filled: 11, capacity: 12, organiser: "Yousef A.", pricePerPlayer: 15,
  },
  {
    id: "o2", courtId: "pitch-1", date: "2026-12-15", start: "19:00",
    filled: 9, capacity: 12, organiser: "Marcus W.", pricePerPlayer: 15,
  },
]

export const bookings: Booking[] = [
  {
    id: "GS-4417", courtId: "pitch-3", slotId: "s1", bookedFor: "Dr. Omar Hassan",
    date: "2026-12-14", start: "14:30", end: "15:30", players: 12,
    status: "awaiting", perk: "Free coffee", paid: 180,
  },
  {
    id: "GS-4390", courtId: "padel-1", slotId: "s3", bookedFor: "David Quill",
    date: "2026-12-02", start: "18:00", end: "19:00", players: 4,
    status: "completed", paid: 120,
  },
  {
    id: "GS-4361", courtId: "tennis-2", slotId: "s5", bookedFor: "David Quill",
    date: "2026-11-28", start: "07:00", end: "08:00", players: 2,
    status: "completed", paid: 100,
  },
]

/**
 * The grace period, in minutes. A booking holds the court this long past its
 * start; if nobody checks in at the kiosk it auto-releases and returns to the
 * available list. This is the mechanism the whole product rests on.
 */
export const GRACE_MINUTES = 5

export const courtById = (id: string) => courts.find((c) => c.id === id)

/** The tier a score currently sits in, and the distance to the next. */
export function tierFor(score: number) {
  const sorted = [...trustTiers].sort((a, b) => b.from - a.from)
  const current = sorted.find((t) => score >= t.from) ?? trustTiers[0]
  const next = trustTiers.find((t) => t.from > score)
  return {
    current,
    next,
    /** Points remaining to the next tier — what the "+4" in the sketch means. */
    toNext: next ? next.from - score : 0,
  }
}
