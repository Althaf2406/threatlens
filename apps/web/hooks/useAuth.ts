import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  planName: string;
  projectLimit: number;
  tokenLimit: number;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: string | null;
  onboardingStep?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error: any) {
        if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
          setUser(null);
        } else {
          console.error("Auth fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return { user, loading, logout, setUser };
}
