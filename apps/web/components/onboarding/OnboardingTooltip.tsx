import React from "react";
import { OnboardingStep } from "./onboarding-steps";

interface Coords {
  top: number;
  left: number;
  width: number;
  height: number;
  placement: "top" | "bottom" | "left" | "right" | "center";
}

interface OnboardingTooltipProps {
  step: OnboardingStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onFinish: () => void;
  coords: Coords | null;
}

export function OnboardingTooltip({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onFinish,
  coords,
}: OnboardingTooltipProps) {
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Compute styles depending on coordinates
  let style: React.CSSProperties = {};
  let tooltipClass = "";

  if (coords && coords.placement !== "center") {
    const margin = 12;
    tooltipClass = "absolute z-50 w-80 max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl transition-all duration-300";

    // Place tooltip based on requested position relative to element
    if (coords.placement === "bottom") {
      style = {
        top: coords.top + coords.height + margin,
        left: Math.max(16, coords.left + coords.width / 2 - 160), // Center align width is 320px
      };
    } else if (coords.placement === "top") {
      style = {
        top: Math.max(16, coords.top - margin - 220), // approximate tooltip height
        left: Math.max(16, coords.left + coords.width / 2 - 160),
      };
    } else if (coords.placement === "right") {
      style = {
        top: coords.top + coords.height / 2 - 100,
        left: coords.left + coords.width + margin,
      };
    } else if (coords.placement === "left") {
      style = {
        top: coords.top + coords.height / 2 - 100,
        left: Math.max(16, coords.left - margin - 336), // tooltip width (320px) + margin
      };
    }
  } else {
    // Fallback: render centered modal in viewport
    tooltipClass = "fixed z-50 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
  }

  return (
    <div style={style} className={tooltipClass} role="dialog">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
        <button
          onClick={onSkip}
          className="text-xs font-medium text-slate-500 hover:text-slate-300 transition"
          title="Skip onboarding tour"
        >
          Skip Tour
        </button>
      </div>

      <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">{step.text}</p>

      {step.safetyBoundary && (
        <div className="mb-4 rounded-xl border border-blue-900/50 bg-blue-950/40 p-3 text-xs text-blue-300 leading-relaxed font-medium">
          <p className="font-semibold text-blue-200 mb-1">Safety Guardrail:</p>
          {step.safetyBoundary}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div>
          {currentStepIndex > 0 && (
            <button
              onClick={onBack}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
            >
              Back
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {isLastStep ? (
            <button
              onClick={onFinish}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={onNext}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
