import { motion } from 'framer-motion';
import { DiJavascript1, DiPython, DiJava } from 'react-icons/di';
import { HudPanel } from '../hud/HudPanel';
import { HudButton } from '../hud/HudButton';

export type ProgrammingLanguage = 'javascript' | 'python' | 'java';

interface LanguageCardProps {
  language: ProgrammingLanguage;
  isSelected: boolean;
  onSelect: (language: ProgrammingLanguage) => void;
}

const languageConfig = {
  javascript: {
    name: 'JavaScript',
    icon: DiJavascript1,
    color: '#F7DF1E',
    description: 'Dynamic & versatile. Powers the modern web.',
    accent: 'from-yellow-500/20 to-yellow-600/10'
  },
  python: {
    name: 'Python',
    icon: DiPython,
    color: '#3776AB',
    description: 'Clean & powerful. The language of AI.',
    accent: 'from-blue-500/20 to-blue-600/10'
  },
  java: {
    name: 'Java',
    icon: DiJava,
    color: '#ED8B00',
    description: 'Enterprise-grade. Write once, run anywhere.',
    accent: 'from-orange-500/20 to-orange-600/10'
  }
};

export const LanguageCard = ({ language, isSelected, onSelect }: LanguageCardProps) => {
  const config = languageConfig[language];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(language)}
      className="cursor-pointer"
    >
      <HudPanel
        className={`
          p-6 transition-all duration-300
          ${isSelected 
            ? 'ring-2 ring-primary shadow-[0_0_40px_hsl(var(--primary)/0.3)]' 
            : 'hover:border-primary/50'
          }
        `}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accent} rounded-lg`} />
        
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <motion.div
            animate={isSelected ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <Icon 
              size={64} 
              style={{ color: config.color }}
              className={isSelected ? 'drop-shadow-[0_0_20px_currentColor]' : ''}
            />
          </motion.div>
          
          <h3 className="text-xl font-bold text-foreground">{config.name}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
          
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-primary text-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Selected
            </motion.div>
          )}
        </div>
      </HudPanel>
    </motion.div>
  );
};

interface LanguageSelectionProps {
  onSelect: (language: ProgrammingLanguage) => void;
  onContinue: () => void;
  selectedLanguage: ProgrammingLanguage | null;
}

export const LanguageSelection = ({ onSelect, onContinue, selectedLanguage }: LanguageSelectionProps) => {
  const languages: ProgrammingLanguage[] = ['javascript', 'python', 'java'];

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold gradient-text-primary mb-2">
          SELECT YOUR WEAPON
        </h2>
        <p className="text-muted-foreground">
          Choose the language you'll use to save the multiverse
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {languages.map((lang, index) => (
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LanguageCard
              language={lang}
              isSelected={selectedLanguage === lang}
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </div>

      {selectedLanguage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <HudButton 
            variant="gold" 
            size="lg" 
            glowing
            onClick={onContinue}
          >
            Initialize Mission
          </HudButton>
        </motion.div>
      )}
    </div>
  );
};
