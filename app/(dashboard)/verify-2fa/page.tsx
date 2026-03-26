import type { Metadata } from "next";
import Verify2FA from "@/components/auth/Verify2FA";

export const metadata: Metadata = {
  title: "Two-factor verification",
  description:
    "Enter your authenticator code to finish signing in to TaskPulse and protect your focus sessions and account.",
  robots: { index: false, follow: false },
};

const Verify2FAPage = () => {
  return <Verify2FA />;
};

export default Verify2FAPage;
