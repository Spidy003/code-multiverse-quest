import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HudPanelProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gold' | 'danger';
  animate?: boolean;
}

export const HudPanel = ({ 
  children, 
  className = '',
  variant = 'default',
  animate = true
}: HudPanelProps) => {
  const variantStyles = {
    default: 'border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.15)]',
    gold: 'border-secondary/30 shadow-[0_0_30px_hsl(var(--secondary)/0.15)]',
    danger: 'border-destructive/30 shadow-[0_0_30px_hsl(var(--destructive)/0.15)]'
  };

  const glowColors = {
    default: 'from-transparent via-primary/30 to-transparent',
    gold: 'from-transparent via-secondary/30 to-transparent',
    danger: 'from-transparent via-destructive/30 to-transparent'
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-lg
        bg-gradient-to-br from-card/80 to-card/40
        backdrop-blur-xl border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {/* Top highlight line */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${glowColors[variant]}`} />
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/50" />

      {/* Scan line effect */}
      <motion.div
        className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r ${glowColors[variant]} opacity-50`}
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {children}
    </motion.div>
  );
};
