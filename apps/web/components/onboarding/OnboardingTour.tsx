"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ONBOARDING_STEPS, OnboardingStep } from "./onboarding-steps";
import { OnboardingTooltip } from "./OnboardingTooltip";
import { updateOnboardingProgress, completeOnboarding } from "@/lib/api";
import { useOnboarding } from "./OnboardingProvider";

export function OnboardingTour() {
  const { active, currentStepIndex, setCurrentStepIndex, setTourActive, user, refreshUser } = useOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = active ? ONBOARDING_STEPS[currentStepIndex] : null;

  // Substitute path parameters in route templates
  const getRoutePath = (routeTemplate: string) => {
    return routeTemplate
      .replace("{projectId}", "proj-001")
      .replace("{assetId}", "ast-001")
      .replace("{findingId}", "fdg-001");
  };

  // Route synchronization
  useEffect(() => {
    if (!active || !step) return;

    const targetPath = getRoutePath(step.route);
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  }, [active, step, pathname, router]);

  // Sync step coordinates
  useEffect(() => {
    if (!active || !step) {
      setRect(null);
      return;
    }

    const updateCoordinates = () => {
      // Don't search if path doesn't match yet
      const targetPath = getRoutePath(step.route);
      if (pathname !== targetPath) {
        setRect(null);
        return;
      }

      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el) {
        setRect(el.getBoundingClientRect() as DOMRect);
      } else {
        setRect(null);
      }
    };

    updateCoordinates();

    // Check again periodically (poller for loaded assets/async elements)
    const interval = setInterval(updateCoordinates, 250);

    window.addEventListener("resize", updateCoordinates);
    window.addEventListener("scroll", updateCoordinates);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateCoordinates);
      window.removeEventListener("scroll", updateCoordinates);
    };
  }, [active, step, currentStepIndex, pathname]);

  if (!active || !step) return null;

  const handleNext = async () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = ONBOARDING_STEPS[nextIndex];
      setCurrentStepIndex(nextIndex);
      
      try {
        await updateOnboardingProgress(nextStep.id);
      } catch (e) {
        console.error("Failed to sync progress to backend", e);
      }
    }
  };

  const handleBack = async () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevStep = ONBOARDING_STEPS[prevIndex];
      setCurrentStepIndex(prevIndex);
      
      try {
        await updateOnboardingProgress(prevStep.id);
      } catch (e) {
        console.error("Failed to sync progress to backend", e);
      }
    }
  };

  const handleSkip = async () => {
    setTourActive(false);
    try {
      await completeOnboarding();
      await refreshUser();
    } catch (e) {
      console.error("Failed to mark onboarding as completed", e);
    }
  };

  const handleFinish = async () => {
    setTourActive(false);
    try {
      await completeOnboarding();
      await refreshUser();
      router.push("/dashboard");
    } catch (e) {
      console.error("Failed to finish onboarding", e);
    }
  };

  const tooltipCoords = rect
    ? {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        placement: step.placement || "bottom",
      }
    : null;

  return (
    <>
      {/* Background Mask */}
      {rect ? (
        <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
          <div
            style={{
              top: rect.top - 6,
              left: rect.left - 6,
              width: rect.width + 12,
              height: rect.height + 12,
            }}
            className="absolute rounded-2xl ring-[9999px] ring-slate-950/75 ring-offset-2 ring-offset-blue-500 transition-all duration-300 pointer-events-none shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300" />
      )}

      {/* Floating Tour Tooltip */}
      <OnboardingTooltip
        step={step}
        currentStepIndex={currentStepIndex}
        totalSteps={ONBOARDING_STEPS.length}
        onNext={handleNext}
        onBack={handleBack}
        onSkip={handleSkip}
        onFinish={handleFinish}
        coords={tooltipCoords}
      />
    </>
  );
}
