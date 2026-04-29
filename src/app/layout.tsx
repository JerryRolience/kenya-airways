import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/global/theme/theme-provider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Kenya Airways | Book Flights Online",
  description:
    "Book and manage Kenya Airways flights online. Choose from Executive, Middle, and Economy class. Instant confirmation.",
  keywords: ["Kenya Airways", "flight booking", "Nairobi", "online tickets"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={geist.variable} suppressHydrationWarning>
        <body
          className={`${geist.className} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

          <Toaster richColors position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
