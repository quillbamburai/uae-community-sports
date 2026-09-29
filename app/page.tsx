"use client"

import { useState } from "react"
import {
  Browse, Confirm, CourtDetail, Home, PostSession, Success, Trust, WalkIn,
  type AppView,
} from "@/components/app-screens"

/**
 * The phone app. One stateful flow so the whole journey is clickable without
 * a router — this is a prototype for a walkthrough, not a production app.
 */
export default function AppPage() {
  const [view, setView] = useState<AppView>({ name: "home" })

  switch (view.name) {
    case "browse": return <Browse go={setView} />
    case "court": return <CourtDetail courtId={view.courtId} go={setView} />
    case "confirm": return <Confirm courtId={view.courtId} slotId={view.slotId} go={setView} />
    case "success": return <Success courtId={view.courtId} slotId={view.slotId} go={setView} />
    case "walkin": return <WalkIn go={setView} />
    case "trust": return <Trust go={setView} />
    case "post-session": return <PostSession go={setView} />
    default: return <Home go={setView} />
  }
}
