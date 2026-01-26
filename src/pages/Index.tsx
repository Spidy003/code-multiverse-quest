import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ParticleField } from '../components/effects/ParticleField';
import { TypewriterText } from '../components/effects/TypewriterText';
import { HudPanel } from '../components/hud/HudPanel';
import { HudButton } from '../components/hud/HudButton';
import { LanguageSelection, ProgrammingLanguage } from '../components/game/LanguageSelection';
import { CinematicIntro } from '../components/game/CinematicIntro';
import { SpaceStoneLevel } from '../components/game/SpaceStoneLevel';
import { GauntletProgress, defaultStones } from '../components/game/GauntletProgress';
import multiverseBg from '@/assets/multiverse-bg.jpg';
import { Shield, Zap, Code2, User, LogIn } from 'lucide-react';

type GameState = 'login' | 'language-select' | 'cinematic' | 'playing' | 'completed';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('login');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [showSystemText, setShowSystemText] = useState(true);
  const [username, setUsername] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [stones, setStones] = useState(defaultStones);

  const handleLogin = () => {
    if (username.trim() || isGuest) {
      setGameState('language-select');
    }
  };

  const handleGuestEntry = () => {
    setIsGuest(true);
    setUsername('AGENT');
    setGameState('language-select');
  };

  const handleLanguageSelect = (language: ProgrammingLanguage) => {
    setSelectedLanguage(language);
  };

  const handleContinueToGame = () => {
    setGameState('cinematic');
  };

  const handleCinematicComplete = () => {
    setGameState('playing');
  };

  const handleLevelComplete = () => {
    // Update stones
    setStones(prev => prev.map(s => 
      s.name === 'Space' ? { ...s, collected: true } : s
    ));
    setGameState('completed');
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Global particle effect */}
      <ParticleField />

      {/* Background image with overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src={multiverseBg} 
          alt="Multiverse Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      {/* HUD Grid overlay */}
      <div className="fixed inset-0 hud-grid opacity-10 pointer-events-none z-0" />

      {/* Cinematic Intro */}
      <AnimatePresence>
        {gameState === 'cinematic' && (
          <CinematicIntro onComplete={handleCinematicComplete} />
        )}
      </AnimatePresence>

      {/* Game Level */}
      <AnimatePresence>
        {gameState === 'playing' && (
          <SpaceStoneLevel 
            onComplete={handleLevelComplete}
            onExit={() => setGameState('language-select')}
          />
        )}
      </AnimatePresence>

      {/* Completed Screen */}
      <AnimatePresence>
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          >
            <ParticleField colors={['#3B82F6', '#00D4FF']} />
            <div className="relative z-10 text-center space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 1 }}
                className="w-32 h-32 mx-auto rounded-full bg-gradient-radial from-stone-space to-transparent flex items-center justify-center shadow-[0_0_60px_hsl(var(--stone-space))]"
              >
                <div className="w-16 h-16 rounded-full bg-stone-space animate-pulse" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-bold text-stone-space text-glow"
              >
                SPACE STONE ACQUIRED
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <GauntletProgress stones={stones.map(s => 
                  s.name === 'Space' ? { ...s, collected: true } : s
                )} />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-muted-foreground"
              >
                The Space Stone has been stabilized. 5 more stones remain.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <HudButton 
                  variant="gold" 
                  size="lg"
                  onClick={() => setGameState('language-select')}
                >
                  Continue Mission
                </HudButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Screen */}
      <AnimatePresence>
        {gameState === 'login' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg">
              {/* Logo and Title */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-8"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-radial from-primary/30 to-transparent mb-6"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px hsl(var(--primary) / 0.3)',
                      '0 0 40px hsl(var(--primary) / 0.5)',
                      '0 0 20px hsl(var(--primary) / 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-10 h-10 text-primary" />
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl font-black tracking-wider mb-2">
                  <span className="gradient-text-primary">CODE</span>
                  <span className="text-secondary"> AVENGERS</span>
                </h1>
                
                <div className="h-6 overflow-hidden">
                  {showSystemText && (
                    <TypewriterText 
                      text="STARK INDUSTRIES ACCESS TERMINAL" 
                      speed={40}
                      className="text-sm text-muted-foreground tracking-widest"
                    />
                  )}
                </div>
              </motion.div>

              {/* Login Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <HudPanel className="p-8">
                  <div className="space-y-6">
                    {/* System status */}
                    <div className="flex items-center gap-3 p-3 rounded bg-primary/10 border border-primary/20">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs text-primary uppercase tracking-wider">
                        Multiverse Threat Level: Critical
                      </span>
                    </div>

                    {/* Username input */}
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        Agent Identification
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your codename..."
                          className="w-full bg-background/50 border border-primary/30 rounded px-10 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Login buttons */}
                    <div className="space-y-3">
                      <HudButton 
                        variant="primary" 
                        size="lg" 
                        className="w-full"
                        onClick={handleLogin}
                        disabled={!username.trim()}
                        glowing={!!username.trim()}
                      >
                        <LogIn size={18} />
                        Access Terminal
                      </HudButton>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-muted/30" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-card px-2 text-muted-foreground uppercase tracking-wider">
                            Or
                          </span>
                        </div>
                      </div>

                      <HudButton 
                        variant="secondary" 
                        size="lg" 
                        className="w-full"
                        onClick={handleGuestEntry}
                      >
                        <Zap size={18} />
                        Enter as Guest
                      </HudButton>
                    </div>

                    {/* Features */}
                    <div className="pt-6 border-t border-primary/10">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <Code2 className="w-6 h-6 text-primary mx-auto" />
                          <p className="text-xs text-muted-foreground">Learn to Code</p>
                        </div>
                        <div className="space-y-2">
                          <Zap className="w-6 h-6 text-secondary mx-auto" />
                          <p className="text-xs text-muted-foreground">Save Universes</p>
                        </div>
                        <div className="space-y-2">
                          <Shield className="w-6 h-6 text-stone-space mx-auto" />
                          <p className="text-xs text-muted-foreground">Collect Stones</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </HudPanel>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-xs text-muted-foreground mt-6"
              >
                © 2024 Stark Industries • Multiverse Division
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Selection Screen */}
      <AnimatePresence>
        {gameState === 'language-select' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen flex items-center justify-center p-4"
          >
            {/* Header with back button */}
            <div className="absolute top-4 left-4">
              <HudButton 
                variant="ghost" 
                size="sm"
                onClick={() => setGameState('login')}
              >
                ← Back
              </HudButton>
            </div>

            {/* Welcome message */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Agent:</span>
              <span className="text-sm text-primary font-semibold">{username || 'AGENT'}</span>
            </div>

            <LanguageSelection
              selectedLanguage={selectedLanguage}
              onSelect={handleLanguageSelect}
              onContinue={handleContinueToGame}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
