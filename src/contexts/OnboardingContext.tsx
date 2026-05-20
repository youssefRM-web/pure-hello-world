import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useOrganizationQuery } from '@/hooks/queries/useOrganizationQuery';

export type OnboardingStep =
  | 'create-building'
  | 'create-room'
  | 'create-asset'
  | 'generate-qr'
  | 'create-report'
  | 'upload-document'
  | 'create-recurring-task';

export interface OnboardingStepConfig {
  id: OnboardingStep;
  index: number;
  completed: boolean;
}

interface OnboardingContextType {
  isOnboardingVisible: boolean;
  isOnboardingStatusLoading: boolean;
  steps: OnboardingStepConfig[];
  completedCount: number;
  totalSteps: number;
  activeGuide: OnboardingStep | null;
  guideSubStep: number;
  startGuide: (step: OnboardingStep) => void;
  completeStep: (step: OnboardingStep) => void;
  stopGuide: () => void;
  skipAllSteps: () => void;
  dismissOnboarding: () => void;
  setGuideSubStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'mendigo_onboarding_steps';

const ALL_STEPS: OnboardingStep[] = [
  'create-building',
  'create-room',
  'create-asset',
  'generate-qr',
  'create-report',
  'upload-document',
  'create-recurring-task',
];

const STEP_TOAST_KEYS: Record<OnboardingStep, string> = {
  'create-building': 'building',
  'create-room': 'room',
  'create-asset': 'asset',
  'generate-qr': 'qr',
  'create-report': 'report',
  'upload-document': 'document',
  'create-recurring-task': 'recurringTask',
};

export const STEP_ROUTES: Record<OnboardingStep, string> = {
  'create-building': '/dashboard/building',
  'create-room': '/dashboard/spaces',
  'create-asset': '/dashboard/assets',
  'generate-qr': '/dashboard/qr-codes',
  'create-report': '/dashboard/',
  'upload-document': '/dashboard/documents',
  'create-recurring-task': '/dashboard/tasks',
};

function loadCompleted(): Set<OnboardingStep> {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();

    const validSteps = parsed.filter((step): step is OnboardingStep =>
      typeof step === 'string' && ALL_STEPS.includes(step as OnboardingStep),
    );

    return new Set(validSteps);
  } catch {
    return new Set();
  }
}

function saveCompleted(set: Set<OnboardingStep>) {
  if (set.size === 0) {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    return;
  }

  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify([...set]));
}

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(loadCompleted);
  const { organization, isLoading: isOrgLoading, refetch: refetchOrganization } = useOrganizationQuery();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // Source of truth for "dismissed" is the organization's onBoardingDone flag.
  const dismissed = organization?.onBoardingDone === true;

  const [activeGuide, setActiveGuide] = useState<OnboardingStep | null>(null);
  const [guideSubStep, setGuideSubStep] = useState(0);

  useEffect(() => {
    saveCompleted(completedSteps);
  }, [completedSteps]);

  const steps: OnboardingStepConfig[] = ALL_STEPS.map((id, index) => ({
    id,
    index,
    completed: completedSteps.has(id),
  }));

  const completedCount = completedSteps.size;
  const totalSteps = ALL_STEPS.length;
  const allComplete = completedCount >= totalSteps;
  const isOnboardingVisible = !dismissed && !allComplete;

  const startGuide = useCallback((step: OnboardingStep) => {
    setActiveGuide(step);
    setGuideSubStep(0);
  }, []);

  const completeStep = useCallback((step: OnboardingStep) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(step);

      saveCompleted(next);

      const key = STEP_TOAST_KEYS[step];
      const toastMessages: Record<string, string> = {
        building: t("gettingStarted.completionToast.building"),
        room: t("gettingStarted.completionToast.room"),
        asset: t("gettingStarted.completionToast.asset"),
        qr:  t("gettingStarted.completionToast.qr"),
        report: t("gettingStarted.completionToast.report"),
        document: t("gettingStarted.completionToast.document"),
        recurringTask: t("gettingStarted.completionToast.recurringTask"),
      };

      toast.success(toastMessages[key] || "Step completed!", {
        duration: 5000,
        position: "top-center",
      });

      if (next.size >= ALL_STEPS.length) {
        setTimeout(() => {
          toast.success("🎉 All steps completed! You're all set.", {
            duration: 6000,
            position: "top-center",
          });
        }, 1500);
      }

      return next;
    });
    setActiveGuide(null);
    setGuideSubStep(0);
  }, [t]);

  const stopGuide = useCallback(() => {
    setActiveGuide(null);
    setGuideSubStep(0);
  }, []);

  const markOnboardingDoneOnServer = useCallback(async () => {
    const orgId = organization?._id;
    if (!orgId) return;
    try {
      await api.patch(`/organization/${orgId}`, { onBoardingDone: true });
      await refetchOrganization();
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      
    } catch (err) {
      console.error('Failed to update onBoardingDone on organization', err);
      toast.error('Failed to skip onboarding. Please try again.');
    }
  }, [organization?._id, refetchOrganization, queryClient]);

  const skipAllSteps = useCallback(() => {
    setActiveGuide(null);
    setGuideSubStep(0);
    saveCompleted(new Set());
    setCompletedSteps(new Set());
    void markOnboardingDoneOnServer();
  }, [markOnboardingDoneOnServer]);

  const dismissOnboarding = useCallback(() => {
    void markOnboardingDoneOnServer();
  }, [markOnboardingDoneOnServer]);

  return (
    <OnboardingContext.Provider value={{
      isOnboardingVisible,
      isOnboardingStatusLoading: isOrgLoading,
      steps,
      completedCount,
      totalSteps,
      activeGuide,
      guideSubStep,
      startGuide,
      completeStep,
      stopGuide,
      skipAllSteps,
      dismissOnboarding,
      setGuideSubStep,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
