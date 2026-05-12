import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          {children}
          <Toaster
            theme="system"
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--toast-bg)",
                border: "1px solid var(--toast-border)",
                color: "var(--toast-color)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
