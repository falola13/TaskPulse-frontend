import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile & security",
  description:
    "View and update your TaskPulse profile, manage security settings, and configure two-factor authentication for your account.",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
