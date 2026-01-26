import { motion } from 'framer-motion';

interface InfinityStone {
  name: string;
  color: string;
  collected: boolean;
  glowColor: string;
}

interface GauntletProgressProps {
  stones: InfinityStone[];
  className?: string;
}

export const GauntletProgress = ({ stones, className = '' }: GauntletProgressProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {stones.map((stone, index) => (
        <motion.div
          key={stone.name}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="relative group"
        >
          <motion.div
            className={`
              w-8 h-8 rounded-full border-2
              flex items-center justify-center
              transition-all duration-300
              ${stone.collected 
                ? `bg-gradient-radial from-${stone.color} to-transparent border-${stone.color}` 
                : 'bg-muted/30 border-muted-foreground/30'
              }
            `}
            style={{
              background: stone.collected 
                ? `radial-gradient(circle, ${stone.glowColor}, ${stone.glowColor}40, transparent)`
                : undefined,
              borderColor: stone.collected ? stone.glowColor : undefined,
              boxShadow: stone.collected 
                ? `0 0 20px ${stone.glowColor}, 0 0 40px ${stone.glowColor}60`
                : undefined
            }}
            animate={stone.collected ? {
              boxShadow: [
                `0 0 20px ${stone.glowColor}, 0 0 40px ${stone.glowColor}60`,
                `0 0 30px ${stone.glowColor}, 0 0 60px ${stone.glowColor}80`,
                `0 0 20px ${stone.glowColor}, 0 0 40px ${stone.glowColor}60`,
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {stone.collected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stone.glowColor }}
              />
            )}
          </motion.div>
          
          {/* Tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <span className="text-xs text-muted-foreground">{stone.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const defaultStones: InfinityStone[] = [
  { name: 'Space', color: 'stone-space', collected: false, glowColor: '#3B82F6' },
  { name: 'Reality', color: 'stone-reality', collected: false, glowColor: '#EF4444' },
  { name: 'Mind', color: 'stone-mind', collected: false, glowColor: '#EAB308' },
  { name: 'Time', color: 'stone-time', collected: false, glowColor: '#22C55E' },
  { name: 'Power', color: 'stone-power', collected: false, glowColor: '#A855F7' },
  { name: 'Soul', color: 'stone-soul', collected: false, glowColor: '#F97316' },
];
