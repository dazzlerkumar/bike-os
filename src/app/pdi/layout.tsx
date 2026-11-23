import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
  "Free Bike PDI Checklist • Two-Wheeler Pre-Delivery Inspection Guide | tripmeter",
  description:
    "Comprehensive, interactive pre-delivery inspection (PDI) checklist for new bikes and scooters. Check chassis VIN, engine numbers, tyres, paintwork, fluids, electronics and paperwork before signing delivery.",
  keywords: [
    "bike PDI checklist",
    "two wheeler pre-delivery inspection",
    "motorcycle PDI guide",
    "scooter delivery checklist",
    "chassis VIN number check bike",
    "new motorcycle delivery India",
    "showroom bike inspection checklist",
    "bike PDI before signing delivery note",
  ],
  authors: [{ name: "tripmeter" }],
  creator: "tripmeter",
  publisher: "tripmeter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/pdi",
  },
  openGraph: {
    title: "Free Bike PDI Checklist • Inspect Your New Bike Before Signing",
    description:
      "Stand by your new bike with confidence. Catch defects, paperwork mismatches, and fluid leaks at the showroom. Free, private, and works offline.",
    url: "/pdi",
    siteName: "tripmeter",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Bike PDI Checklist • Showroom Pre-Delivery Inspection Guide",
    description:
      "Interactive 50+ point PDI checklist for new bikes and scooters. Works offline right in your mobile browser with zero sign-up.",
  },
};

export default function PdiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
