import { type LegacyRef, type ReactElement } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import React, { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
// import { useTranslation } from 'react-i18next';
import { animate } from "~/utils/animateUtils";
import { Box, Button, HStack } from "@chakra-ui/react";
import { primaryButtonColor } from "~/styles/style";

export interface FormElement {
  el: ReactElement;
  disabledNext?: boolean;
  nextButtonLabel?: string;
  nextButton?: (handleNext: () => void, currStep?: number) => ReactElement;
  noButton?: boolean;
}

type StepFormProps = {
  formElements: FormElement[];
  submitButton?: ReactElement;
  currStep?: number;
  className?: string;
  noControl?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
};

const StepForm: React.FC<StepFormProps> = (props) => {
  // const { t } = useTranslation();
  const {
    formElements,
    submitButton,
    currStep,
    onNext,
    onPrev,
    noControl,
    className,
  } = props;
  const [currentStep, setCurrentStep] = useState<number>(currStep || 1);
  const ref = useRef<HTMLDivElement>();

  const slide = (type: "slideLeft" | "slideRight", cb?: () => void) => {
    animate({
      element: ref,
      type,
    });
    setTimeout(() => {
      cb?.();
    }, 300);
  };

  useEffect(() => {
    slide("slideLeft", () => setCurrentStep(currStep || 1));
  }, [currStep]);

  const handleNext = () => {
    onNext?.();
    slide("slideLeft", () => setCurrentStep(currentStep + 1));
  };

  const handlePrevious = () => {
    onPrev?.();
    slide("slideRight", () => setCurrentStep(currentStep - 1));
  };

  return (
    <Box
      ref={ref as LegacyRef<HTMLDivElement>}
      h="full"
      w="full"
      className={className || ""}>
      <Box h="full" py={!noControl ? 4 : 0}>
        {formElements[currentStep - 1]?.el}
      </Box>
      {formElements[currentStep - 1]?.noButton ? (
        <></>
      ) : (
        <>
          {!noControl && (
            <HStack spacing={2} justify="end" w="full">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  leftIcon={<ArrowLeftIcon />}>
                  Previous
                </Button>
              )}
              {currentStep < formElements.length ? (
                formElements[currentStep - 1]?.nextButton ? (
                  formElements[currentStep - 1]?.nextButton?.(
                    handleNext,
                    currentStep
                  )
                ) : (
                  <Button
                    {...primaryButtonColor}
                    onClick={handleNext}
                    rightIcon={<ArrowRightIcon />}
                    isDisabled={formElements[currentStep - 1]?.disabledNext}>
                    {formElements[currentStep - 1]?.nextButtonLabel || "Next"}
                  </Button>
                )
              ) : (
                <>{submitButton}</>
              )}
            </HStack>
          )}
        </>
      )}
    </Box>
  );
};

export default StepForm;
