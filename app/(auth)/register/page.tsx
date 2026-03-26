import type { Metadata } from "next";
import AuthWrapper from "@/components/auth/AuthWrapper";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create your TaskPulse account to start Pomodoro focus sessions, log breaks, and build streaks with a clear view of your time.",
  robots: { index: false, follow: false },
};

const Register = () => {
  return (
    <AuthWrapper mode="register">
      <RegisterForm />
    </AuthWrapper>
  );
};

export default Register;
