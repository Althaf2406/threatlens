"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, User } from "@/hooks/useAuth";
import { ONBOARDING_STEPS } from "./onboarding-steps";
import { getCurrentUser, resetOnboarding } from "@/lib/api";
import { OnboardingTour } from "./OnboardingTour";

interface OnboardingContextProps {
  active: boolean;
  setTourActive: (active: boolean) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  user: User | null;
  refreshUser: () => Promise<void>;
  restartTour: () => Promise<void>;
  loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, loading } = useAuth();
  const [active, setTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const refreshUser = async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch (e) {
      console.error("Error refreshing user context", e);
    }
  };

  const restartTour = async () => {
    try {
      await resetOnboarding();
      const u = await getCurrentUser();
      setUser(u);
      setCurrentStepIndex(0);
      setTourActive(true);
    } catch (e) {
      console.error("Failed to reset onboarding state", e);
    }
  };

  // Sync state with user profile
  useEffect(() => {
    if (loading) return;

    if (user && !user.onboardingCompleted) {
      setTourActive(true);
      if (user.onboardingStep) {
        const idx = ONBOARDING_STEPS.findIndex((s) => s.id === user.onboardingStep);
        if (idx !== -1) {
          setCurrentStepIndex(idx);
        } else {
          setCurrentStepIndex(0);
        }
      } else {
        setCurrentStepIndex(0);
      }
    } else {
      setTourActive(false);
    }
  }, [user, loading]);

  return (
    <OnboardingContext.Provider
      value={{
        active,
        setTourActive,
        currentStepIndex,
        setCurrentStepIndex,
        user,
        refreshUser,
        restartTour,
        loading,
      }}
    >
      {children}
      {active && <OnboardingTour />}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
