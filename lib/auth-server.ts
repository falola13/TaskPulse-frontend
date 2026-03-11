import { cookies } from "next/headers";
import { isJwtValid } from "@/lib/jwt";

// Fast server-side auth check:
// - Reads the JWT from the cookie set via js-cookie on login
// - Decodes it locally and checks the `exp` claim
// - No network call to the backend → very cheap and scalable
export async function getIsLoggedIn() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  return isJwtValid(accessToken);
}
