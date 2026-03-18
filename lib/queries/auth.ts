import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useAuthStore } from "../store/authStore";

export const useRegister = () => {
  const { setLoggedIn } = useAuthStore();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      setLoggedIn(true);
    },
  });
};
export const useLogin = () => {
  const { setLoggedIn } = useAuthStore();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      setLoggedIn(true);
    },
  });
};

export const useTwoFactor = () => {
  const generate2FAMutation = useMutation({
    mutationFn: authService.generate2FA,
  });
  const enable2FAMutation = useMutation({
    mutationFn: authService.enable2FA,
  });
  const disable2FAMutation = useMutation({
    mutationFn: authService.disable2FA,
  });
  const verifyMutation = useMutation({
    mutationFn: authService.verify2FA,
  });
  return {
    generate2FAMutation,
    enable2FAMutation,
    disable2FAMutation,
    verifyMutation,
  };
};
