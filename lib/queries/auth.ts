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
