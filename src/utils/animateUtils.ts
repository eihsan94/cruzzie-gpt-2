import type { MutableRefObject } from "react";
export type AnimationType =
  | "fadeUp"
  | "fadeDown"
  | "fadeIn"
  | "fadeOut"
  | "slideLeft"
  | "slideRight";

export const animate = ({
  element,
  type = "fadeIn",
  duration = 300,
  cb,
}: {
  element: MutableRefObject<HTMLDivElement | undefined>;
  cb?: () => void;
  duration?: number;
  type?: AnimationType;
}) => {
  const setAnimation = ({
    start,
    end,
  }: {
    start: {
      opacity: string;
      transition: string;
      transform?: string;
    };
    end: {
      opacity: string;
      transform?: string;
    };
  }) => {
    if (element.current) {
      const { opacity, transform, transition } = start;
      element.current.style.opacity = opacity;
      element.current.style.transition = transition;
      if (transform) {
        element.current.style.transform = transform;
      }
    }
    setTimeout(() => {
      if (element.current) {
        const { opacity, transform } = end;
        element.current.style.opacity = opacity;
        if (transform) {
          element.current.style.transform = transform;
        }
        setTimeout(() => cb?.(), 100);
      }
    }, duration);
  };

  const animationType: { [key in AnimationType]: (cb?: () => void) => void } = {
    fadeUp: () =>
      setAnimation({
        start: {
          opacity: "0",
          transition: "opacity 0.3s, transform 0.3s",
          transform: "translateY(20px)",
        },
        end: {
          opacity: "1",
          transform: "translateY(0)",
        },
      }),
    fadeDown: () =>
      setAnimation({
        start: {
          opacity: "1",
          transition: "opacity 0.3s, transform 0.3s",
          transform: "translateY(0px)",
        },
        end: {
          opacity: "0",
          transform: "translateY(20px)",
        },
      }),
    fadeIn: () =>
      setAnimation({
        start: {
          opacity: "0",
          transition: "opacity 0.3s",
        },
        end: {
          opacity: "1",
        },
      }),
    fadeOut: () =>
      setAnimation({
        start: {
          opacity: "1",
          transition: "opacity 0.3s",
        },
        end: {
          opacity: "0",
        },
      }),
    slideLeft: () =>
      setAnimation({
        start: {
          opacity: "0",
          transition: "opacity 0.3s, transform 0.3s",
          transform: "translateX(20px)",
        },
        end: {
          opacity: "1",
          transform: "translateX(0px)",
        },
      }),
    slideRight: () =>
      setAnimation({
        start: {
          opacity: "0",
          transition: "opacity 0.3s, transform 0.3s",
          transform: "translateX(-20px)",
        },
        end: {
          opacity: "1",
          transform: "translateX(0px)",
        },
      }),
  };

  animationType[type](cb);
};
