import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOnboarding, type OnboardingStep, STEP_ROUTES } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Rocket, Check, HelpCircle, RotateCcw, QrCode, FileText, Inbox } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const GettingStarted: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { steps, completedCount, totalSteps, activeGuide, startGuide, completeStep, skipAllSteps, isOnboardingVisible, isOnboardingStatusLoading } = useOnboarding();

  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const [reportInfoOpen, setReportInfoOpen] = useState(false);

  useEffect(() => {
    if (!isOnboardingStatusLoading && !isOnboardingVisible) {
      navigate('/dashboard', { replace: true });
    }
  }, [isOnboardingStatusLoading, isOnboardingVisible, navigate]);

  const handleStartGuide = (stepId: OnboardingStep) => {
    // The "create report" step has no guided UI flow because reports are
    // created externally by scanning a QR code. Show a tutorial popup instead.
    if (stepId === 'create-report') {
      setReportInfoOpen(true);
      return;
    }
    startGuide(stepId);
    // Do NOT navigate — the guide highlights the sidebar nav item first (step 1).
    // When the user clicks it, they'll naturally land on the target page (step 2).
  };

  const handleCompleteStep = () => {
    if (activeGuide) {
      completeStep(activeGuide);
    }
  };

  const handleRestartGuide = (stepId: OnboardingStep) => {
    if (stepId === 'create-report') {
      setReportInfoOpen(true);
      return;
    }
    startGuide(stepId);
  };

  const stepTranslations: Record<OnboardingStep, { title: string; description: string }> = {
    'create-building': {
      title: t('gettingStarted.steps.building.title'),
      description: t('gettingStarted.steps.building.description'),
    },
    'create-room': {
      title: t('gettingStarted.steps.room.title'),
      description: t('gettingStarted.steps.room.description'),
    },
    'create-asset': {
      title: t('gettingStarted.steps.asset.title'),
      description: t('gettingStarted.steps.asset.description'),
    },
    'generate-qr': {
      title: t('gettingStarted.steps.qr.title'),
      description: t('gettingStarted.steps.qr.description'),
    },
    'create-report': {
      title: t('gettingStarted.steps.report.title'),
      description: t('gettingStarted.steps.report.description'),
    },
    'upload-document': {
      title: t('gettingStarted.steps.document.title'),
      description: t('gettingStarted.steps.document.description'),
    },
    'create-recurring-task': {
      title: t('gettingStarted.steps.recurringTask.title'),
      description: t('gettingStarted.steps.recurringTask.description'),
    },
  };

  // Avoid flashing the onboarding UI while we don't yet know onBoardingDone status
  if (isOnboardingStatusLoading || !isOnboardingVisible) {
    return <div className="min-h-full bg-background" />;
  }

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section */}
      <div>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 gap-10 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-sm text-primary font-medium mb-6">
                <Rocket className="h-4 w-4" />
                {t('gettingStarted.badge')}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {t('gettingStarted.heading')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('gettingStarted.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-foreground mb-6">
          {t('gettingStarted.stepsHeading')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step) => {
              const trans = stepTranslations[step.id];
              const isActive = activeGuide === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-shadow ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-background hover:shadow-sm'
                  }`}
                >
                  {/* Step number / check */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                    step.completed
                      ? 'bg-primary/10 text-primary'
                      : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? <Check className="h-5 w-5" /> : step.index + 1}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${
                      step.completed
                        ? 'text-primary'
                        : isActive
                          ? 'text-foreground'
                          : 'text-foreground'
                    }`}>
                      {trans.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {trans.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isActive && !step.completed && (
                      <>
                        <Button
                          size="sm"
                          onClick={handleCompleteStep}
                        >
                          {t('gettingStarted.completeStep')}
                        </Button>
                        <button
                          onClick={() => handleRestartGuide(step.id)}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          {t('gettingStarted.restartGuide')}
                        </button>
                      </>
                    )}
                    {!isActive && !step.completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary hover:bg-primary/5"
                        onClick={() => handleStartGuide(step.id)}
                      >
                        {t('gettingStarted.startGuide')}
                      </Button>
                    )}
                    {step.completed && !isActive && (
                      <button
                        onClick={() => handleRestartGuide(step.id)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {t('gettingStarted.restartGuide')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Progress Card */}
            <div className="rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">
                {t('gettingStarted.progress')}
              </h3>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>{completedCount} {t('gettingStarted.of')} {totalSteps} {t('gettingStarted.stepsCompleted')}</span>
                <span className="font-semibold text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <Button
                variant="default"
                className="w-full mt-4"
                onClick={() => { skipAllSteps(); navigate('/dashboard', { replace: true }); }}
              >
                {t('gettingStarted.skipAll')}
              </Button>
            </div>

            {/* Support Card */}
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  {t('gettingStarted.needSupport')}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {t('gettingStarted.supportDescription')}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open('https://zeeg.me/mendigo/onboarding', '_blank')}
              >
                {t('gettingStarted.bookCall')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial popup for the "Create Report" step.
          Reports are submitted externally (by scanning a QR code), so there's
          no in-app flow to highlight. Show an explanation instead. */}
      <Dialog open={reportInfoOpen} onOpenChange={setReportInfoOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('gettingStarted.reportTutorial.title')}</DialogTitle>
            <DialogDescription>
              {t('gettingStarted.reportTutorial.intro')}
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-4 mt-2">
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {t('gettingStarted.reportTutorial.step1Title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('gettingStarted.reportTutorial.step1Desc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {t('gettingStarted.reportTutorial.step2Title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('gettingStarted.reportTutorial.step2Desc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {t('gettingStarted.reportTutorial.step3Title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('gettingStarted.reportTutorial.step3Desc')}
                </p>
              </div>
            </li>
          </ol>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setReportInfoOpen(false)}
            >
              {t('common.close')}
            </Button>
            <Button
              onClick={() => {
                setReportInfoOpen(false);
                completeStep('create-report');
              }}
            >
              {t('gettingStarted.reportTutorial.gotIt')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GettingStarted;
