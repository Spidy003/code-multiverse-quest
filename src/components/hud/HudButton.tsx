import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface HudButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
}

export const HudButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  glowing = false,
  className = '',
  disabled,
  ...props
}: HudButtonProps) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-primary/20 to-primary/10
      border-primary/50 text-primary
      hover:from-primary/30 hover:to-primary/20 hover:border-primary
      hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)]
    `,
    secondary: `
      bg-gradient-to-r from-muted/50 to-muted/30
      border-muted-foreground/30 text-foreground
      hover:from-muted/70 hover:to-muted/50 hover:border-muted-foreground/50
    `,
    gold: `
      bg-gradient-to-r from-secondary/20 to-secondary/10
      border-secondary/50 text-secondary
      hover:from-secondary/30 hover:to-secondary/20 hover:border-secondary
      hover:shadow-[0_0_30px_hsl(var(--secondary)/0.4)]
    `,
    danger: `
      bg-gradient-to-r from-destructive/20 to-destructive/10
      border-destructive/50 text-destructive
      hover:from-destructive/30 hover:to-destructive/20 hover:border-destructive
      hover:shadow-[0_0_30px_hsl(var(--destructive)/0.4)]
    `,
    ghost: `
      bg-transparent border-transparent text-muted-foreground
      hover:bg-muted/20 hover:text-foreground hover:border-primary/30
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded border
        font-semibold uppercase tracking-wider
        transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${glowing ? 'animate-pulse-glow' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
