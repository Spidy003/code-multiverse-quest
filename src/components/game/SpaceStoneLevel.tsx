import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HudPanel } from '../hud/HudPanel';
import { HudButton } from '../hud/HudButton';
import { GauntletProgress, defaultStones } from './GauntletProgress';
import { Play, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: { input: string; expected: string }[];
}

const spaceStoneChallenge: Challenge = {
  id: 'space-1',
  title: 'STABILIZE THE SPACE STONE',
  description: 'The Space Stone\'s coordinates are fluctuating. Write a function to calculate the distance between two points in space.',
  instructions: [
    'Create a function called calculateDistance',
    'It should accept two points: {x, y} and {x, y}',
    'Return the Euclidean distance between them',
    'Round the result to 2 decimal places'
  ],
  starterCode: `// Calculate the distance between two points in space
function calculateDistance(point1, point2) {
  // Your code here
  
}

// Test your function
const result = calculateDistance({x: 0, y: 0}, {x: 3, y: 4});
console.log(result); // Should output: 5`,
  solution: `function calculateDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 100) / 100;
}`,
  hints: [
    'Remember the Pythagorean theorem: a² + b² = c²',
    'Use Math.sqrt() for square root',
    'Use Math.round() or toFixed() for rounding'
  ],
  testCases: [
    { input: '({x: 0, y: 0}, {x: 3, y: 4})', expected: '5' },
    { input: '({x: 1, y: 1}, {x: 4, y: 5})', expected: '5' },
    { input: '({x: 0, y: 0}, {x: 1, y: 1})', expected: '1.41' }
  ]
};

interface SpaceStoneLevelProps {
  onComplete: () => void;
  onExit: () => void;
}

export const SpaceStoneLevel = ({ onComplete, onExit }: SpaceStoneLevelProps) => {
  const [code, setCode] = useState(spaceStoneChallenge.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stones, setStones] = useState(defaultStones);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);
    setStatus('idle');

    try {
      // Create a custom console.log
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(a => JSON.stringify(a)).join(' '));
        }
      };

      // Execute the code
      const executeCode = new Function('console', code);
      executeCode(customConsole);

      setOutput(logs);

      // Check if solution is correct
      const testFunction = new Function('console', `
        ${code}
        return calculateDistance({x: 0, y: 0}, {x: 3, y: 4});
      `);
      
      const result = testFunction(customConsole);
      
      if (result === 5) {
        setStatus('success');
        // Collect the space stone
        setStones(prev => prev.map(s => 
          s.name === 'Space' ? { ...s, collected: true } : s
        ));
      } else {
        setStatus('error');
      }
    } catch (error: any) {
      setOutput([`Error: ${error.message}`]);
      setStatus('error');
    }

    setIsRunning(false);
  };

  const showNextHint = () => {
    setShowHint(true);
    if (currentHint < spaceStoneChallenge.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-primary/20 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HudButton variant="ghost" size="sm" onClick={onExit}>
              ← Exit
            </HudButton>
            <div className="w-px h-6 bg-primary/20" />
            <span className="text-sm text-muted-foreground">LEVEL 1</span>
          </div>
          
          <GauntletProgress stones={stones} />
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-stone-space animate-pulse shadow-[0_0_10px_hsl(var(--stone-space))]" />
            <span className="text-sm text-stone-space">Space Stone</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <HudPanel className="p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 rounded-full bg-stone-space animate-pulse shadow-[0_0_15px_hsl(var(--stone-space))]" />
                <h2 className="text-xl font-bold text-stone-space">
                  {spaceStoneChallenge.title}
                </h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {spaceStoneChallenge.description}
              </p>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Instructions
                </h3>
                <ul className="space-y-2">
                  {spaceStoneChallenge.instructions.map((instruction, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="text-primary mt-1">▸</span>
                      {instruction}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hints */}
              <div className="mt-6 pt-6 border-t border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider">
                    Hints
                  </h3>
                  <HudButton variant="ghost" size="sm" onClick={showNextHint}>
                    Show Hint
                  </HudButton>
                </div>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded bg-secondary/10 border border-secondary/20 text-sm text-secondary"
                  >
                    💡 {spaceStoneChallenge.hints[currentHint]}
                  </motion.div>
                )}
              </div>
            </HudPanel>
          </motion.div>

          {/* Code editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <HudPanel className="p-4 flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Code Editor
                </span>
                <HudButton 
                  variant="primary" 
                  size="sm" 
                  onClick={runCode}
                  disabled={isRunning}
                >
                  <Play size={14} />
                  Run Code
                </HudButton>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-background/50 border border-primary/20 rounded p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                spellCheck={false}
              />
            </HudPanel>

            {/* Output */}
            <HudPanel 
              className="p-4"
              variant={status === 'success' ? 'default' : status === 'error' ? 'danger' : 'default'}
            >
              <div className="flex items-center gap-2 mb-3">
                {status === 'success' && <CheckCircle className="text-stone-time" size={16} />}
                {status === 'error' && <XCircle className="text-destructive" size={16} />}
                {status === 'idle' && <AlertTriangle className="text-muted-foreground" size={16} />}
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Output
                </span>
              </div>
              
              <div className="font-mono text-sm space-y-1 min-h-[80px] max-h-32 overflow-auto">
                {output.length === 0 ? (
                  <span className="text-muted-foreground">Run your code to see output...</span>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className={status === 'error' ? 'text-destructive' : 'text-foreground'}>
                      {line}
                    </div>
                  ))
                )}
              </div>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-4 border-t border-primary/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-stone-time">
                      <CheckCircle size={20} />
                      <span className="font-semibold">Space Stone Stabilized!</span>
                    </div>
                    <HudButton variant="gold" size="sm" onClick={onComplete} className="flex-shrink-0">
                      Continue →
                    </HudButton>
                  </div>
                </motion.div>
              )}
            </HudPanel>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
