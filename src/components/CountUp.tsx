"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, useSpring, useTransform } from "motion/react";

export function CountUp({
  value,
  className,
  style,
}: {
  value: number;
  className?: string;
  style?: CSSProperties;
}) {
  const spring = useSpring(0, { stiffness: 70, damping: 18, mass: 0.8 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [text, setText] = useState("0");

  useEffect(() => {
    const t = setTimeout(() => spring.set(value), 120);
    return () => clearTimeout(t);
  }, [spring, value]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(String(v)));
    return () => unsub();
  }, [display]);

  return (
    <motion.span className={className} style={style}>
      {text}
    </motion.span>
  );
}
