export type Sport = "Football" | "Padel" | "Tennis" | "Badminton"

/** What the kiosk is showing. The court's state, not the app's. */
export type CourtState =
  /** Booked, nobody has checked in, grace period running. */
  | "awaiting"
  /** Someone checked in legitimately. */
  | "in-play"
  /** No booking. Anyone may claim it. */
  | "available"
  /** Someone scanned but the booking is for a different court or time. */
  | "rejected"

export type Court = {
  id: string
  name: string
  sport: Sport
  /** Players the court holds — 12 for a football pitch, 4 for padel. */
  capacity: number
  surface: string
  amenities: string[]
  image: string
  pricePerHour: number
}

export type Slot = {
  id: string
  courtId: string
  /** "14:30" — 24h, matching the kiosk clock. */
  start: string
  end: string
  /** ISO date. */
  date: string
  available: boolean
  /** Set when a slot is discounted, e.g. after a cancellation. */
  discountPct?: number
}

export type Booking = {
  id: string
  courtId: string
  slotId: string
  /** Who the kiosk names when the court is awaiting them. */
  bookedFor: string
  date: string
  start: string
  end: string
  players: number
  /** Where the booking currently sits. */
  status: "upcoming" | "awaiting" | "in-play" | "completed" | "released" | "no-show"
  /** Perk attached at booking time, e.g. the coffee. */
  perk?: string
  paid: number
}

/**
 * Trust is a civic standing, not a game score. It moves on whether a person
 * honoured their booking — nothing else.
 */
export type TrustEvent = {
  id: string
  date: string
  /** Positive for honoured, negative for a no-show or late release. */
  delta: number
  reason: string
}

export type TrustTier = {
  name: string
  /** Score at which this tier begins. */
  from: number
  /** What the tier grants. Stated plainly — these are entitlements. */
  benefit: string
}

/** A promo encountered while scrolling, not pinned above the list. */
export type Promo = {
  id: string
  kind: "perk" | "cancellation" | "invite"
  headline: string
  detail: string
  /** Where it sits in the browse list — promos are interleaved deliberately. */
  afterIndex: number
}

/** An existing booking short of players, open for someone to join. */
export type OpenSpot = {
  id: string
  courtId: string
  date: string
  start: string
  /** e.g. 11 of 12 — one place left. */
  filled: number
  capacity: number
  organiser: string
  pricePerPlayer: number
}
