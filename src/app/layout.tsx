import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/common/toast";

export const metadata: Metadata = {
  title: "Bank of America — Online Banking",
  description:
    "A frontend-only demonstration of a US online banking portal. All accounts, balances and transactions are fictional.",
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
