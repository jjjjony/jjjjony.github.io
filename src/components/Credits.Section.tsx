import { useStartTextAnimation } from "~/hooks/useStartTextAnimation";
import { useEffect, useRef, useState } from "react";
import { useIsInView } from "~/hooks/useIsInView";
import Link from "next/link";

const Credits = ({}: {}) => {
  return (
    <div className={`grid h-screen w-screen items-center justify-center`}>
      <div className="flex flex-col items-center justify-center justify-items-center space-y-5 px-[5vw]">
        <CreditsText />
        <CreditsSubtext />
      </div>
    </div>
  );
};

// ISSUE: R3F's custom render tree somehow prevents 'useIsInView' (intersection observer hook) from triggering ∴ component never intersects
// SOLUTION: Extract component that relies on 'useInView' hook
const CreditsText = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { currentWord, startAnimation } = useStartTextAnimation(
    "Created by Johnny Madigan",
    1.5
  );
  const textRef = useRef<HTMLHeadingElement>(null);
  const isInView = useIsInView(textRef);

  useEffect(() => {
    if (isHovered) {
      startAnimation();
    }
  }, [isHovered, startAnimation]);

  useEffect(() => {
    if (isInView) startAnimation();
  }, [isInView, startAnimation]);

  return (
    <h2
      ref={textRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glow-bg select-text whitespace-nowrap px-[0.75vw] text-center font-geistmono text-[4vw] tracking-tight sm:text-[3vw]
        ${isInView ? "animate-fadeIn" : "animate-fadeOut"}
      `}
    >
      {currentWord}
    </h2>
  );
};

// ISSUE: R3F's custom render tree somehow prevents 'useIsInView' (intersection observer hook) from triggering ∴ component never intersects
// SOLUTION: Extract component that relies on 'useInView' hook
const CreditsSubtext = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { currentWord, startAnimation } = useStartTextAnimation(
    "'Macbook Pro 13 inch' by chrisgreig (CC BY)",
    2.6
  );
  const linkRef = useRef<HTMLAnchorElement>(null);
  const isInView = useIsInView(linkRef);

  useEffect(() => {
    if (isHovered) {
      startAnimation();
    }
  }, [isHovered, startAnimation]);

  useEffect(() => {
    if (isInView) startAnimation();
  }, [isInView, startAnimation]);

  return (
    <Link
      ref={linkRef}
      target="_blank"
      href="https://skfb.ly/MWtY"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glow-bg whitespace-nowrap px-[0.75vw] text-center font-geistmono text-[2vw] tracking-tight sm:text-[1.5vw]
        ${isInView ? "animate-fadeIn" : "animate-fadeOut"}
      `}
    >
      {currentWord}
    </Link>
  );
};

export default Credits;
