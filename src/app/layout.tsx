import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  opticalSizing: "auto",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Coffee++ — Campus Booth Ordering",
  description:
    "Coffee++ booth ordering system: browse the menu, place your order, and show your Order QR at the booth. Freshly brewed coffee, pastries, and a photo booth experience.",
  keywords: ["Coffee++", "booth", "coffee", "ordering", "campus", "school event"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Coffee++ — Campus Booth Ordering",
    description: "Order ahead, show your QR, skip the wait.",
    siteName: "Coffee++",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${jakarta.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
