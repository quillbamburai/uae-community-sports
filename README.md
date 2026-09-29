# Community Sports — Booking

A response to a UAE government design challenge. Bookings at a community
sports facility fell from 2,100/month to 780 while attendance stayed high: no
enforcement meant booking bought you nothing, and a third of bookings were
no-shows holding courts empty.

**Two products, on two devices.**

| | |
|---|---|
| **The app** `/` | Phone. Browse, book, check in, trust standing. |
| **The kiosk** `/kiosk` | Vertical iPad at each court. The enforcement mechanism. |

## Run

```bash
npm install
npm run dev
```

Then `localhost:3000` for the app, `localhost:3000/kiosk` for the court screen.

## The mechanism

A booking holds the court for **five minutes** past its start. Check in at the
kiosk and it is yours; miss it and the court auto-releases to the available
list, and your trust standing drops six points.

That single rule does the work: the booker gets a guarantee worth having, and
a no-show stops holding a court hostage.

## Structure

```
00-brief/     The brief and scope
01-inputs/    Sketches, moodboard, references
02-system/    Tokens, guidelines, layout rules
03-build/     Prompts and decisions
04-output/    Exports and documents
```

See `03-build/decisions.md` for the choices made and why.
