import type { FC, LegacyRef } from "react";
import { useEffect, useRef } from "react";
import { animate } from "~/utils/animateUtils";

type AnimationType = "fadeUp" | "fadeIn";

const withAnimateOnLoad = <Props extends object>({
  WrappedComponent,
  duration = 300,
  type = "fadeIn",
}: {
  WrappedComponent: FC<Props>;
  duration?: number;
  type?: AnimationType;
}) => {
  return function WithData(props: Props) {
    const element = useRef<HTMLDivElement>();

    useEffect(() => {
      animate({
        element,
        type,
        duration,
      });
    }, []);

    return (
      <div ref={element as LegacyRef<HTMLDivElement>}>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withAnimateOnLoad;
