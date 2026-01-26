import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import multiverseBg from '@/assets/multiverse-bg.jpg';
import infinityStones from '@/assets/infinity-stones.png';

interface CinematicIntroProps {
  onComplete: () => void;
}

const cinematicSteps = [
  { text: "ACCESSING STARK INDUSTRIES NETWORK...", duration: 2000 },
  { text: "MULTIVERSE THREAT DETECTED", duration: 2000 },
  { text: "INFINITY STONES CORRUPTED BY THANOS", duration: 2500 },
  { text: "INITIATING EMERGENCY PROTOCOL", duration: 2000 },
  { text: "HEROES NEEDED: CODERS ONLY", duration: 2500 },
];

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStones, setShowStones] = useState(false);

  useEffect(() => {
    if (currentStep < cinematicSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        if (currentStep === 2) {
          setShowStones(true);
        }
      }, cinematicSteps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      const completeTimer = setTimeout(onComplete, 1500);
      return () => clearTimeout(completeTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={multiverseBg} 
          alt="Multiverse" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 hud-grid opacity-20" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-8">
        <AnimatePresence mode="wait">
          {currentStep < cinematicSteps.length && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.h1
                className={`text-2xl md:text-4xl font-bold tracking-wider ${
                  currentStep >= 1 ? 'text-destructive text-glow' : 'text-primary text-glow-subtle'
                }`}
                animate={currentStep >= 1 ? { 
                  textShadow: [
                    '0 0 10px currentColor',
                    '0 0 30px currentColor',
                    '0 0 10px currentColor'
                  ]
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {cinematicSteps[currentStep].text}
              </motion.h1>

              {/* Infinity Stones appear */}
              {showStones && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex justify-center"
                >
                  <img 
                    src={infinityStones} 
                    alt="Infinity Stones"
                    className="w-64 h-64 object-contain animate-float drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {currentStep >= cinematicSteps.length && (
            <motion.div
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-black text-secondary text-glow tracking-widest">
                CODE AVENGERS
              </h1>
              <p className="text-xl text-primary text-glow-subtle">
                MULTIVERSE RESCUE PROTOCOL
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {cinematicSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
              animate={index === currentStep ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-muted-foreground hover:text-foreground text-sm uppercase tracking-wider transition-colors"
      >
        Skip Intro →
      </motion.button>
    </motion.div>
  );
};
