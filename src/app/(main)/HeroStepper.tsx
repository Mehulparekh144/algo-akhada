"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
  icon: ReactNode;
}

interface HeroStepperProps {
  steps: Step[];
  autoPlayInterval?: number; // in milliseconds
}

export function HeroStepper({
  steps,
  autoPlayInterval = 5000,
}: HeroStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup Intersection Observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (stepsRef.current) {
      observerRef.current.observe(stepsRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVisible) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
      }, autoPlayInterval);
    }

    return () => clearInterval(interval);
  }, [steps.length, autoPlayInterval, isVisible]);

  // Scroll active step into view
  useEffect(() => {
    if (stepsRef.current && isVisible) {
      const activeElement = stepsRef.current.querySelector(
        `[data-step="${activeStep}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeStep, isVisible]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8" ref={stepsRef}>
      <div className="flex flex-col items-center">
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isPast = index < activeStep;

            return (
              <div
                key={index}
                data-step={index}
                className={cn(
                  "flex items-center gap-6 cursor-pointer transition-all duration-300",
                  isActive ? "scale-105" : "opacity-70 hover:opacity-90"
                )}
                onClick={() => setActiveStep(index)}
              >
                {/* Icon container */}
                <div
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : isPast
                      ? "bg-muted"
                      : "bg-background border-border"
                  )}
                >
                  {Icon}
                </div>

                {/* Content */}
                <div className="flex-1 max-w-sm">
                  <h3
                    className={cn(
                      "text-lg font-semibold mb-2 transition-colors",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
