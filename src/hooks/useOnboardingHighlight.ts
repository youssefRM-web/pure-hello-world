/**
 * @deprecated The multi-step onboarding guide is now driven globally by
 * `<OnboardingGuide />` mounted in AppLayout. This hook is kept as a no-op
 * for backwards compatibility with existing call-sites and can be removed
 * once all imports are cleaned up.
 */
export function useOnboardingHighlight(_step?: unknown) {
  // intentionally empty — see OnboardingGuide.tsx
}
