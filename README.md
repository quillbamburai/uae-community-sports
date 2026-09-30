# Community Sports

Two products for a UAE government design challenge: guaranteed court
bookings for a community sports service.

**Live prototype**

- Phone app — https://quillbamburai.github.io/uae-community-sports/
- Courtside kiosk — https://quillbamburai.github.io/uae-community-sports/kiosk/

## The problem

Bookings fell from 2,100 a month to 780 while attendance stayed high. Two
causes, both about enforcement rather than demand:

- Walk-ins take courts that are already booked, so booking buys nothing.
- Around a third of bookings are no-shows, so courts sit empty while people
  are turned away.

## The mechanism

A booking holds the court for **five minutes** past its start. Check in at
the courtside screen and the court is yours; don't, and it releases back to
the available list. That single rule is what makes a booking worth making,
and both products state it plainly rather than burying it in terms.

Around it sit a **trust score** — a civic standing that moves only on whether
a booking was honoured — and perks that standing earns.

## Two products, one foundation

The phone app is held at arm's length; the kiosk is read from a metre away
while standing. They share colour, radius and the type family. They do not
share the type scale: the kiosk runs at roughly double.

## Running it

```
npm install
npm run dev
```

The app is at `/`, the kiosk at `/kiosk`.

## Design

Screens and the design system are in Figma, file `UAE-GOV`. Every value in
the build was measured off those frames rather than approximated.
