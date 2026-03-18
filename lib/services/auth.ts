import api from "@/lib/api";
import {
  AuthResponse,
  LoginDTO,
  ProfileResponse,
  RegisterDto,
} from "../types/auth";
import Cookies from "js-cookie";

export const authService = {
  login: async (data: LoginDTO) => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    const token = res.data.token;
    if (token) {
      Cookies.set("access_token", token);
    }
    return res;
  },

  register: async (data: RegisterDto) => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    const token = res.data.token;
    if (token) {
      Cookies.set("access_token", token);
    }
    return res;
  },
  getProfile: () => api.get<ProfileResponse>("/auth/profile"),

  logout: () => api.post("/auth/logout"),

  generate2FA: async () =>
    api.post<{ qrCode: string; secret: string }>("/auth/2fa/generate"),

  enable2FA: async ({ code }: { code: string }) =>
    api.post("/auth/2fa/enable", { code }),
  disable2FA: async () => api.post("/auth/2fa/disable"),
  verify2FA: async ({ code }: { code: string }) =>
    api.post("/auth/2fa/verify", { code }),
};
