import type { Metadata } from "next";
import AuthWrapper from "@/components/auth/AuthWrapper";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to TaskPulse to sync timed focus sessions, breaks, and streaks across devices. Email login or continue with Google and GitHub.",
  robots: { index: false, follow: false },
};

const Login = () => {
  return (
    <AuthWrapper mode="login">
      <LoginForm />
    </AuthWrapper>
  );
};

export default Login;
