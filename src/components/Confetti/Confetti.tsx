/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import ReactConfetti from "react-confetti";

// REFER TO THE PROPS HERE https://alampros.github.io/react-confetti/?path=/story/props-demos--knobs
export const Confetti = () => {
  const { width, height } = useWindowSize();
  return (
    <ReactConfetti
      width={width}
      height={height}
      recycle={false}
      gravity={0.1}
      numberOfPieces={500}
    />
  );
};
