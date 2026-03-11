export interface LoginDTO {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  message: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ProfileResponse {
  message: string;

  success: true;
  data: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
}
