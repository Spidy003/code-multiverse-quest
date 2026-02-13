import { motion } from 'framer-motion';
import { useState } from 'react';
import { HudPanel } from '../hud/HudPanel';
import { HudButton } from '../hud/HudButton';
import { GauntletProgress, defaultStones } from './GauntletProgress';
import { Play, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ProgrammingLanguage } from './LanguageSelection';

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: Record<ProgrammingLanguage, string>;
  hints: string[];
  testExpected: number;
}

const spaceStoneChallenge: Challenge = {
  id: 'space-1',
  title: 'STABILIZE THE SPACE STONE',
  description: 'The Space Stone\'s coordinates are fluctuating. Write a function to calculate the distance between two points in space.',
  instructions: [
    'Create a function called calculateDistance',
    'It should accept two points with x,y coordinates',
    'Return the Euclidean distance between them',
    'Round the result to 2 decimal places'
  ],
  starterCode: {
    javascript: `// Calculate the distance between two points in space
function calculateDistance(point1, point2) {
  // Your code here
  
}

// Test your function
const result = calculateDistance({x: 0, y: 0}, {x: 3, y: 4});
console.log(result); // Should output: 5`,

    python: `import math

# Calculate the distance between two points in space
def calculate_distance(point1, point2):
    # Your code here
    pass

# Test your function
result = calculate_distance({"x": 0, "y": 0}, {"x": 3, "y": 4})
print(result)  # Should output: 5`,

    java: `public class Solution {
    // Calculate the distance between two points in space
    public static double calculateDistance(int x1, int y1, int x2, int y2) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        double result = calculateDistance(0, 0, 3, 4);
        System.out.println(result); // Should output: 5.0
    }
}`
  },
  hints: [
    'Remember the Pythagorean theorem: a² + b² = c²',
    'Use Math.sqrt() / math.sqrt() for square root',
    'Use rounding to get clean results'
  ],
  testExpected: 5,
};

// Piston API for Python and Java execution
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

const languageRuntime: Record<ProgrammingLanguage, { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
};

async function executeWithPiston(code: string, lang: ProgrammingLanguage): Promise<{ stdout: string; stderr: string }> {
  const runtime = languageRuntime[lang];
  const response = await fetch(PISTON_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: runtime.language,
      version: runtime.version,
      files: [{ name: lang === 'java' ? 'Solution.java' : `main.${lang === 'python' ? 'py' : 'js'}`, content: code }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Execution service returned ${response.status}`);
  }

  const data = await response.json();
  const run = data.run || {};
  return { stdout: run.stdout || '', stderr: run.stderr || '' };
}

function executeJsInWorker(code: string): Promise<{ logs: string[]; result: unknown; error: string | null }> {
  return new Promise((resolve) => {
    const TIMEOUT_MS = 5000;

    const workerCode = `
      self.window = undefined;
      self.document = undefined;
      self.XMLHttpRequest = undefined;
      self.fetch = undefined;
      self.importScripts = undefined;
      self.localStorage = undefined;
      self.sessionStorage = undefined;
      self.indexedDB = undefined;
      self.openDatabase = undefined;
      self.navigator = undefined;
      self.location = undefined;

      self.onmessage = function(e) {
        var userCode = e.data.code;
        var logs = [];
        var customConsole = {
          log: function() {
            var args = Array.prototype.slice.call(arguments);
            logs.push(args.map(function(a) { return JSON.stringify(a); }).join(' '));
          }
        };
        try {
          var fn = new Function('console', userCode);
          fn(customConsole);
          var testFn = new Function('console', userCode + '\\nreturn calculateDistance({x: 0, y: 0}, {x: 3, y: 4});');
          var result = testFn(customConsole);
          self.postMessage({ logs: logs, result: result, error: null });
        } catch (err) {
          self.postMessage({ logs: logs, result: null, error: err.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const timeout = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({ logs: ['Error: Code execution timed out (5s limit)'], result: null, error: 'timeout' });
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve(e.data);
    };

    worker.onerror = (e) => {
      clearTimeout(timeout);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({ logs: [], result: null, error: e.message || 'Execution failed' });
    };

    worker.postMessage({ code });
  });
}

interface SpaceStoneLevelProps {
  onComplete: () => void;
  onExit: () => void;
  language: ProgrammingLanguage;
}

export const SpaceStoneLevel = ({ onComplete, onExit, language }: SpaceStoneLevelProps) => {
  const [code, setCode] = useState(spaceStoneChallenge.starterCode[language]);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stones, setStones] = useState(defaultStones);

  const runCode = async () => {
    setIsRunning(true);
    setOutput([]);
    setStatus('idle');

    try {
      if (language === 'javascript') {
        // Use sandboxed Web Worker for JS
        const { logs, result, error } = await executeJsInWorker(code);

        if (error) {
          setOutput([...logs, `Error: ${error}`]);
          setStatus('error');
        } else {
          setOutput(logs);
          if (result === 5) {
            setStatus('success');
            setStones(prev => prev.map(s => s.name === 'Space' ? { ...s, collected: true } : s));
          } else {
            setStatus('error');
          }
        }
      } else {
        // Use Piston API for Python and Java
        const { stdout, stderr } = await executeWithPiston(code, language);

        const outputLines: string[] = [];

        if (stdout.trim()) {
          outputLines.push(...stdout.trim().split('\n'));
        }

        if (stderr.trim()) {
          outputLines.push(...stderr.trim().split('\n').map(l => `Error: ${l}`));
          setOutput(outputLines);
          setStatus('error');
        } else {
          setOutput(outputLines);

          // Check result from stdout
          const lastLine = stdout.trim().split('\n').pop()?.trim() || '';
          const numericResult = parseFloat(lastLine);

          if (numericResult === 5 || numericResult === 5.0) {
            setStatus('success');
            setStones(prev => prev.map(s => s.name === 'Space' ? { ...s, collected: true } : s));
          } else {
            setStatus('error');
          }
        }
      }
    } catch (err: any) {
      setOutput([`Error: ${err.message || 'Execution failed. Check your connection.'}`]);
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

  const langLabel = language === 'javascript' ? 'JavaScript' : language === 'python' ? 'Python' : 'Java';

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
            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary uppercase tracking-wider">{langLabel}</span>
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
                  Code Editor — {langLabel}
                </span>
                <HudButton 
                  variant="primary" 
                  size="sm" 
                  onClick={runCode}
                  disabled={isRunning}
                >
                  {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                  {isRunning ? 'Running...' : 'Run Code'}
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
                  <span className="text-muted-foreground">
                    {isRunning ? 'Executing code...' : 'Run your code to see output...'}
                  </span>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className={line.startsWith('Error:') ? 'text-destructive' : 'text-foreground'}>
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
