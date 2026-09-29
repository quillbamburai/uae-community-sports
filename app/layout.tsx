import type { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"

/* Self-hosted by next/font — no network request at render, so the fonts are
   present on first paint rather than swapping in. */
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sora",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Community Sports — Booking",
  description: "Book a court, and know it will be there when you arrive.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
