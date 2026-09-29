import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

/* Alliance No.1 — the brand face. Self-hosted from public/fonts. */
const alliance = localFont({
  src: [
    { path: "../public/fonts/alliance/AllianceNo1-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/alliance/AllianceNo1-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/alliance/AllianceNo1-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-alliance",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Community Sports — Booking",
  description: "Book a court, and know it will be there when you arrive.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={alliance.variable}>
      <body>{children}</body>
    </html>
  )
}
