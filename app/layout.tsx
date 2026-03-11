import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import Navbar from "@/components/ui/Navbar";
import { getIsLoggedIn } from "@/lib/auth-server";
import { AuthStoreInitializer } from "@/components/AuthInitializer";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TaskPulse",
  description: "A modern Pomodoro productivity timer to help you stay focused.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getIsLoggedIn();

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={` antialiased`}>
        <Providers>
          {/* Initialize client auth store from server-side JWT on first render */}
          <AuthStoreInitializer loggedIn={loggedIn} />
          <div className="h-screen overflow-hidden">
            <Navbar />

            <main className="h-full overflow-y-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
