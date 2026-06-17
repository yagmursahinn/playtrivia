"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#fb64d0", "#59b0f7", "#d4e157", "#ffd6e8", "#e8ffd6", "#d6ecff"];

type ConfettiParticle = {
  id: number;
  left: number;
  delay: number;
  drift: number;
  color: string;
  rotate: number;
  size: number;
  fallDistance: number;
};

function createParticles(): ConfettiParticle[] {
  return Array.from({ length: 16 }, (_, index) => ({
    id: index,
    left: 8 + Math.random() * 84,
    delay: Math.random() * 0.15,
    drift: (Math.random() - 0.5) * 80,
    color: COLORS[index % COLORS.length]!,
    rotate: Math.random() * 180,
    size: 6 + Math.random() * 4,
    fallDistance: 100 + Math.random() * 60,
  }));
}

type QuizConfettiProps = {
  active: boolean;
};

export function QuizConfetti({ active }: QuizConfettiProps) {
  const [particles] = useState(createParticles);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.left}%`,
            top: "12%",
            width: particle.size,
            height: particle.size * 0.6,
            backgroundColor: particle.color,
          }}
          initial={{ opacity: 0.9, y: 0, x: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: 0,
            y: particle.fallDistance,
            x: particle.drift,
            rotate: particle.rotate,
            scale: 0.5,
          }}
          transition={{
            duration: 1,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
