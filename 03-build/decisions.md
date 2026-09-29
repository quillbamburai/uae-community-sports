# Decisions

Choices made during the build and why — the ones worth being asked about.

## Two products, not two screens

The phone app and the courtside kiosk are **separate experiences on separate
devices**: a handheld phone and a vertically-mounted iPad at the court. They
share a token system and component language, but not a layout system — the
kiosk is read from standing distance and never held.

## Promos are woven into the scroll

Promotional cards (free coffee, cancellation discounts) sit **between** pitch
cards rather than pinned to the top of the list. They are part of the browsing
rhythm, encountered while scanning rather than presented up front.

*Why:* a banner at the top is an advertisement you scroll past. A promo
encountered between two real options reads as one of the options.

## 5-minute grace period

A booking holds the court for five minutes past its start time. If nobody
checks in at the kiosk, it auto-releases and the slot returns to the available
list.

*Why:* it is the mechanism that makes both problems solvable at once — the
booker gets a guarantee worth having, and a no-show stops holding the court
hostage. Short enough that a released court is still useful to someone else.

## Trust score: +4 means "to the next tier"

The score is 86. The `+4` is the distance to 90, where the next reward tier
unlocks — not points recently earned.

*Why:* framing it as remaining distance makes the next action legible. "You
earned 4 points" is a receipt; "4 points to go" is an invitation.

## Trust, not gamification

The score is presented as a civic standing — like a library record or a driving
licence — rather than a game mechanic. No streaks, badges, confetti or levels.

*Why:* the brief is explicit that this is a government utility. A score that
looks like a game undermines the seriousness of the enforcement it is backing.
