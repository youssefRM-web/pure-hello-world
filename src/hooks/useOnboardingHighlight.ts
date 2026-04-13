import { useEffect } from 'react';
import { useOnboarding, type OnboardingStep } from '@/contexts/OnboardingContext';

/**
 * Adds a pulsing highlight to the button with `data-onboarding-target={step}`
 * when that step is the active guide. Cleans up on unmount or guide change.
 */
export function useOnboardingHighlight(step: OnboardingStep) {
  const { activeGuide } = useOnboarding();

  useEffect(() => {
    if (activeGuide !== step) return;

    const selector = `[data-onboarding-target="${step}"]`;
    let currentElement: HTMLElement | null = null;

    const removeHighlight = () => {
      if (!currentElement) return;
      currentElement.classList.remove('onboarding-highlight');
      currentElement.removeEventListener('click', removeHighlight);
      currentElement = null;
    };

    const applyHighlight = () => {
      const nextElement = document.querySelector(selector);
      if (!(nextElement instanceof HTMLElement)) return false;

      if (currentElement === nextElement) return true;

      removeHighlight();
      currentElement = nextElement;
      currentElement.classList.add('onboarding-highlight');
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentElement.addEventListener('click', removeHighlight, { once: true });
      return true;
    };

    const observer = new MutationObserver(() => {
      if (currentElement && !document.body.contains(currentElement)) {
        currentElement = null;
      }
      applyHighlight();
    });

    applyHighlight();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
      removeHighlight();
    };
  }, [activeGuide, step]);
}
