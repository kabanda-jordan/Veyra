import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veyra — Biometric Payments",
  description: "The future of payments is your fingerprint. Veyra uses WebAuthn and biometric authentication to make payments instant, secure, and passwordless.",
  keywords: ["biometric payments", "WebAuthn", "passkeys", "fintech", "digital wallet", "fingerprint payment"],
  authors: [{ name: "Veyra" }],
  openGraph: {
    title: "Veyra — Money on Your Fingerprint",
    description: "Pay with your fingerprint. No passwords, no cards, no PINs.",
    type: "website",
    url: "https://veyra.finance",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veyra — Biometric Payments",
    description: "Pay with your fingerprint. No passwords, no cards, no PINs.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-veyra-dark antialiased`}>
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#111118",
                border: "1px solid #1E1E2E",
                color: "#fff",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
