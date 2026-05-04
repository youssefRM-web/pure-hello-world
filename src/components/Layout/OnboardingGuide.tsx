import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboarding, type OnboardingStep, STEP_ROUTES } from '@/contexts/OnboardingContext';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Map each onboarding step to a logical guide key used in translations
 * (`guide.<key>.stepN.{title,desc}`) and the maximum sub-step count.
 */
const GUIDE_KEYS: Record<OnboardingStep, string> = {
  'create-building': 'building',
  'create-room': 'room',
  'create-asset': 'asset',
  'generate-qr': 'qr',
  'create-report': 'report',
  'upload-document': 'document',
  'create-recurring-task': 'task',
};

const TOTAL_SUB_STEPS = 3;

/**
 * Mounted once globally. Drives the multi-step guided walkthrough by
 * highlighting `[data-onboarding-target="<step>-step<N>"]` elements
 * and showing a floating tooltip with title + description.
 *
 * Step 3 is the modal — completion happens externally via `completeStep()`
 * called from each modal's `onSuccess`.
 */
const OnboardingGuide: React.FC = () => {
  const { activeGuide, guideSubStep, setGuideSubStep, stopGuide } = useOnboarding();
  const { t } = useLanguage();
  const location = useLocation();
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const highlightedRef = useRef<HTMLElement | null>(null);

  // Auto-advance to step 2 once user lands on the page that contains the action button.
  useEffect(() => {
    if (!activeGuide) return;
    const targetRoute = STEP_ROUTES[activeGuide];
    if (!targetRoute) return;
    const onTargetRoute =
      location.pathname === targetRoute ||
      location.pathname === targetRoute.replace(/\/$/, '') ||
      location.pathname.startsWith(targetRoute);
    if (onTargetRoute && guideSubStep < 1) {
      setGuideSubStep(1);
    }
  }, [activeGuide, guideSubStep, location.pathname, setGuideSubStep]);

  // Immediately hide any existing tooltip/highlight on route change so the
  // previous step's UI doesn't linger while the new page is loading.
  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.classList.remove('onboarding-highlight');
      highlightedRef.current = null;
    }
    tooltipRef.current?.remove();
    tooltipRef.current = null;
  }, [location.pathname]);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    if (!activeGuide) {
      return;
    }

    const guideKey = GUIDE_KEYS[activeGuide];
    const subIndex = Math.min(Math.max(guideSubStep, 0), TOTAL_SUB_STEPS - 1);
    const stepNum = subIndex + 1;
    const primarySelector = `[data-onboarding-target="${activeGuide}-step${stepNum}"]`;
    // For step 3 (modal), fall back to any open Radix dialog if no explicit target.
    const fallbackSelector = stepNum === 3 ? '[role="dialog"]' : null;

    const titleText = t(`guide.${guideKey}.step${stepNum}.title`);
    const descText = t(`guide.${guideKey}.step${stepNum}.desc`);

    const positionTooltip = () => {
      const el = highlightedRef.current;
      const tip = tooltipRef.current;
      if (!el || !tip) return;
      const rect = el.getBoundingClientRect();
      const tipRect = tip.getBoundingClientRect();
      const margin = 16;

      // Step 3 (modal) → pin to viewport bottom-right, fixed positioning.
      // The modal itself is huge and centered, so we don't anchor to its rect.
      if (stepNum === 3) {
        tip.style.position = 'fixed';
        const left = Math.max(8, window.innerWidth - tipRect.width - margin);
        const top = Math.max(8, window.innerHeight - tipRect.height - margin);
        tip.style.top = `${top}px`;
        tip.style.left = `${left}px`;
        tip.dataset.placement = 'fixed';
        return;
      }
      tip.style.position = 'absolute';

      // Default: prefer below; if not enough space, place above
      let top = rect.bottom + window.scrollY + margin;
      const placeAbove = rect.bottom + tipRect.height + margin > window.innerHeight;
      if (placeAbove) {
        top = rect.top + window.scrollY - tipRect.height - margin;
        tip.dataset.placement = 'top';
      } else {
        tip.dataset.placement = 'bottom';
      }
      let left = rect.left + window.scrollX + rect.width / 2 - tipRect.width / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
      tip.style.top = `${top}px`;
      tip.style.left = `${left}px`;
    };

    const buildTooltip = () => {
      cleanupTooltip();
      const tip = document.createElement('div');
      tip.className = 'onboarding-guide-tooltip';
      tip.innerHTML = `
        <div class="ogt-step">${t('guide.currentStep')} ${stepNum}/${TOTAL_SUB_STEPS}</div>
        <div class="ogt-title"></div>
        <div class="ogt-desc"></div>
        <button class="ogt-close" aria-label="Close">×</button>
      `;
      (tip.querySelector('.ogt-title') as HTMLElement).textContent = titleText;
      (tip.querySelector('.ogt-desc') as HTMLElement).textContent = descText;
      tip.querySelector('.ogt-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        stopGuide();
      });
      document.body.appendChild(tip);
      tooltipRef.current = tip;
      // Defer positioning to next frame so we have measured size
      requestAnimationFrame(positionTooltip);
    };

    const handleClick = () => {
      if (cancelled) return;
      // Advance only on steps 1 and 2 (step 3 = modal handled by completeStep).
      if (subIndex < TOTAL_SUB_STEPS - 1) {
        // Immediately hide the current tooltip + highlight so they don't
        // linger over the previous page while the next page is loading.
        detachHighlight();
        cleanupTooltip();
        cancelled = true;
        setTimeout(() => {
          setGuideSubStep(subIndex + 1);
        }, 250);
      }
    };

    const attach = (allowPoll = true) => {
      if (cancelled) return;
      let el: Element | null = document.querySelector(primarySelector);
      if (!(el instanceof HTMLElement) && fallbackSelector) {
        el = document.querySelector(fallbackSelector);
      }
      if (!(el instanceof HTMLElement)) {
        if (allowPoll) {
          frame = window.requestAnimationFrame(() => attach(true));
        }
        return;
      }
      if (highlightedRef.current === el) {
        // Same element already highlighted — do nothing (prevents loop).
        return;
      }
      detachHighlight();
      highlightedRef.current = el;
      // Don't draw the pulsing outline around the modal itself on step 3 —
      // it wraps the entire dialog and looks broken.
      if (stepNum !== 3) {
        el.classList.add('onboarding-highlight');
      }
      el.addEventListener('click', handleClick);
      try {
        if (stepNum !== 3) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {
        /* noop */
      }
      buildTooltip();
    };

    const detachHighlight = () => {
      const el = highlightedRef.current;
      if (el) {
        el.classList.remove('onboarding-highlight');
        el.removeEventListener('click', handleClick);
      }
      highlightedRef.current = null;
    };

    const cleanupTooltip = () => {
      tooltipRef.current?.remove();
      tooltipRef.current = null;
    };

    function cleanup() {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      detachHighlight();
      cleanupTooltip();
    }

    attach(true);

    // Watch DOM changes (e.g., modal opening) to reattach if needed.
    let observerScheduled = false;
    const observer = new MutationObserver(() => {
      if (cancelled || observerScheduled) return;
      observerScheduled = true;
      requestAnimationFrame(() => {
        observerScheduled = false;
        if (cancelled) return;
        if (highlightedRef.current && !document.body.contains(highlightedRef.current)) {
          detachHighlight();
          cleanupTooltip();
        }
        attach(false);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const reposition = () => positionTooltip();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      cleanup();
    };
  }, [activeGuide, guideSubStep, setGuideSubStep, stopGuide, t, location.pathname]);

  return null;
};

export default OnboardingGuide;
