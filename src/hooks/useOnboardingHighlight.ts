import { useEffect } from 'react';
import { useOnboarding, type OnboardingStep } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';

const TOOLTIP_KEYS: Record<OnboardingStep, string> = {
  'create-building': 'gettingStarted.tooltips.building',
  'create-room': 'gettingStarted.tooltips.room',
  'create-asset': 'gettingStarted.tooltips.asset',
  'generate-qr': 'gettingStarted.tooltips.qr',
  'create-report': 'gettingStarted.tooltips.report',
  'upload-document': 'gettingStarted.tooltips.document',
  'create-recurring-task': 'gettingStarted.tooltips.recurringTask',
};

/**
 * Adds a pulsing highlight + anchored tooltip to the button with
 * `data-onboarding-target={step}` when that step is the active guide.
 */
export function useOnboardingHighlight(step: OnboardingStep) {
  const { activeGuide } = useOnboarding();
  const { t } = useLanguage();

  useEffect(() => {
    if (activeGuide !== step) return;

    const selector = `[data-onboarding-target="${step}"]`;
    let currentElement: HTMLElement | null = null;
    let tooltipEl: HTMLDivElement | null = null;
    let dismissed = false;

    const removeTooltip = () => {
      if (tooltipEl) {
        tooltipEl.remove();
        tooltipEl = null;
      }
    };

    const positionTooltip = () => {
      if (!currentElement || !tooltipEl) return;
      const rect = currentElement.getBoundingClientRect();
      tooltipEl.style.top = `${rect.bottom + window.scrollY + 15}px`;
      tooltipEl.style.left = `${rect.left + window.scrollX + rect.width / 30}px`;
    };

    const createTooltip = () => {
      removeTooltip();
      if (!currentElement || dismissed) return;

      tooltipEl = document.createElement('div');
      tooltipEl.className = 'onboarding-tooltip';
      tooltipEl.textContent = t(TOOLTIP_KEYS[step]);
      document.body.appendChild(tooltipEl);
      positionTooltip();
    };

    const removeHighlight = () => {
      dismissed = true;
      if (currentElement) {
        currentElement.classList.remove('onboarding-highlight');
        currentElement.removeEventListener('click', removeHighlight);
        currentElement = null;
      }
      removeTooltip();
    };

    const applyHighlight = () => {
      if (dismissed) return false;
      const nextElement = document.querySelector(selector);
      if (!(nextElement instanceof HTMLElement)) return false;

      if (currentElement === nextElement) {
        positionTooltip();
        return true;
      }

      if (currentElement) {
        currentElement.classList.remove('onboarding-highlight');
        currentElement.removeEventListener('click', removeHighlight);
      }
      currentElement = nextElement;
      currentElement.classList.add('onboarding-highlight');
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentElement.addEventListener('click', removeHighlight, { once: true });

      setTimeout(createTooltip, 400);
      return true;
    };

    const observer = new MutationObserver(() => {
      if (dismissed) return;
      if (currentElement && !document.body.contains(currentElement)) {
        currentElement = null;
        removeTooltip();
      }
      applyHighlight();
    });

    applyHighlight();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Reposition on scroll/resize
    const handleReposition = () => positionTooltip();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
      removeHighlight();
    };
  }, [activeGuide, step, t]);
}
