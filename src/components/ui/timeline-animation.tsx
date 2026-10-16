"use client";
import React from "react";
import { motion, useInView } from "framer-motion";

export function TimelineContent({
  as: Component = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: {
  as?: any;
  animationNum?: number;
  timelineRef?: React.RefObject<any>;
  customVariants?: any;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  const defaultRef = React.useRef(null);
  const targetRef = timelineRef || defaultRef;
  const isInView = useInView(targetRef, { once: true, margin: "-10%" });

  const defaultVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const variants = customVariants || defaultVariants;
  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      ref={defaultRef}
      custom={animationNum}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

export default TimelineContent;
