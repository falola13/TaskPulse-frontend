import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
  });
};
