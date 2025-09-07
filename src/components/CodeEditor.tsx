import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';
import { loadPyodide } from 'pyodide';

interface CodeEditorProps {
  initialCode?: string;
  onRunCode?: (code: string, output: string) => void;
  onSubmitExercise?: (code: string, output: string) => void;
  onComplete?: () => void; // Add onComplete for project completion
  exerciseId?: string; // Add exerciseId to save code per exercise
  isExerciseCompleted?: boolean; // Track if exercise is already completed
  userId?: string; // Add userId to make localStorage user-specific
  submittedResponses?: { [exerciseId: string]: { code: string; output: string; submittedAt: string } };
}

export function CodeEditor({ 
  initialCode = '', 
  onRunCode, 
  onSubmitExercise, 
  onComplete,
  exerciseId, 
  isExerciseCompleted = false, 
  userId = '',
  submittedResponses = {}
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputQueue, setInputQueue] = useState<string[]>([]);
  const inputResolveRef = useRef<((value: string) => void) | null>(null);
  const pyodideRef = useRef(null);

  // Initialize Pyodide
  useEffect(() => {
    const initializePyodide = async () => {
      // Enable Pyodide in both development and production for input() support
      console.log('Initializing Pyodide...');

      if (!pyodideRef.current) {
        setIsPyodideLoading(true);
        try {
          const pyodideInstance = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/"
          });
          
          // Set up basic Python environment
          pyodideInstance.runPython(`
            import sys
            from io import StringIO
          `);
          
          pyodideRef.current = pyodideInstance;
          setPyodide(pyodideInstance);
          setIsPyodideLoading(false);
        } catch (error) {
          console.error('Failed to load Pyodide:', error);
          setIsPyodideLoading(false);
        }
      }
    };

    initializePyodide();
  }, []);

  // Load saved code and output when component mounts or exerciseId changes
  useEffect(() => {
    if (exerciseId && userId) {
      console.log('CodeEditor loading code for:', exerciseId);
      console.log('submittedResponses:', submittedResponses);
      
      // First check database for submitted responses
      const dbResponse = submittedResponses[exerciseId];
      if (dbResponse) {
        console.log('Found database response:', dbResponse);
        setCode(dbResponse.code);
        setOutput(dbResponse.output);
        return;
      }
      
      // Fall back to localStorage
      const savedCode = localStorage.getItem(`exercise_code_${userId}_${exerciseId}`);
      const savedOutput = localStorage.getItem(`exercise_output_${userId}_${exerciseId}`);
      
      console.log('localStorage savedCode:', savedCode);
      console.log('localStorage savedOutput:', savedOutput);
      
      if (savedCode) {
        setCode(savedCode);
      } else if (initialCode) {
        setCode(initialCode);
      }
      if (savedOutput) {
        setOutput(savedOutput);
      }
    }
  }, [exerciseId, initialCode, userId, submittedResponses]);

  // Check for syntax errors
  const checkSyntax = (code: string): string[] => {
    const errors: string[] = [];
    
    try {
      // Basic syntax checks
      const lines = code.split('\n');
      
      // Check for unmatched parentheses, brackets, and quotes
      let parenCount = 0;
      let bracketCount = 0;
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Skip comments
        if (trimmedLine.startsWith('#')) continue;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          const prevChar = j > 0 ? line[j - 1] : '';
          
          // Handle strings
          if (!inString && (char === '"' || char === "'")) {
            inString = true;
            stringChar = char;
          } else if (inString && char === stringChar && prevChar !== '\\') {
            inString = false;
            stringChar = '';
          }
          
          // Only check brackets if not in string
          if (!inString) {
            if (char === '(') parenCount++;
            else if (char === ')') parenCount--;
            else if (char === '[') bracketCount++;
            else if (char === ']') bracketCount--;
            else if (char === '{') braceCount++;
            else if (char === '}') braceCount--;
          }
        }
        
        // Check for common syntax errors
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          // Check for missing colon after if, for, while, def, class, etc.
          const controlStructures = ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'try', 'except', 'finally'];
          for (const structure of controlStructures) {
            if (trimmedLine.includes(structure) && !trimmedLine.includes(':') && !trimmedLine.includes('#')) {
              errors.push(`Line ${i + 1}: Missing colon (:) after '${structure}'`);
            }
          }
          
          // Check for indentation issues (basic check)
          if (trimmedLine.startsWith(' ') && i > 0) {
            const prevLine = lines[i - 1].trim();
            if (prevLine && !prevLine.endsWith(':') && !prevLine.endsWith('\\')) {
              // This might be an indentation error, but we'll be lenient
            }
          }
        }
      }
      
      // Check for unmatched brackets
      if (parenCount !== 0) {
        errors.push(`Unmatched parentheses: ${parenCount > 0 ? 'missing' : 'extra'} ${Math.abs(parenCount)} closing ${parenCount > 0 ? ')' : '('}`);
      }
      if (bracketCount !== 0) {
        errors.push(`Unmatched square brackets: ${bracketCount > 0 ? 'missing' : 'extra'} ${Math.abs(bracketCount)} closing ${bracketCount > 0 ? ']' : '['}`);
      }
      if (braceCount !== 0) {
        errors.push(`Unmatched curly braces: ${braceCount > 0 ? 'missing' : 'extra'} ${Math.abs(braceCount)} closing ${braceCount > 0 ? '}' : '{'}`);
      }
      
      // Check for unterminated strings
      if (inString) {
        errors.push(`Unterminated string: missing closing ${stringChar}`);
      }
      
    } catch (error) {
      errors.push('Syntax check failed');
    }
    
    return errors;
  };

  // Check if code meets exercise requirements
  const checkExerciseRequirements = (code: string): boolean => {
    if (!exerciseId) return false;

    const codeLines = code.toLowerCase().split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    // Specific validation for each exercise type
    if (exerciseId.startsWith('dt-')) {
      // Data types exercises - need assignment and print
      const hasAssignment = codeLines.some(line => line.includes('=') && !line.includes('=='));
      const hasPrint = codeLines.some(line => line.includes('print'));
      
      if (exerciseId === 'dt-1') {
        // String variable with name
        const hasStringVar = codeLines.some(line => line.includes('=') && (line.includes('"') || line.includes("'")));
        return hasStringVar && hasPrint;
      } else if (exerciseId === 'dt-2') {
        // Integer and float variables
        const hasIntVar = codeLines.some(line => line.includes('=') && /^\s*\w+\s*=\s*\d+\s*$/.test(line));
        const hasFloatVar = codeLines.some(line => line.includes('=') && line.includes('.'));
        return hasIntVar && hasFloatVar && hasPrint;
      } else if (exerciseId === 'dt-3') {
        // Boolean variables
        const hasBooleanVar = codeLines.some(line => line.includes('=') && (line.includes('true') || line.includes('false')));
        return hasBooleanVar && hasPrint;
      } else if (exerciseId === 'dt-8') {
        // Multiple data types with type()
        const hasTypeFunction = codeLines.some(line => line.includes('type('));
        return hasAssignment && hasPrint && hasTypeFunction;
      } else {
        // General data types - just need assignment and print
        return hasAssignment && hasPrint;
      }
    } else if (exerciseId.startsWith('print-')) {
      return codeLines.some(line => line.includes('print'));
    } else if (exerciseId.startsWith('math-') || exerciseId.startsWith('input-')) {
      return codeLines.some(line => line.includes('input') || line.includes('+') || line.includes('-') || line.includes('*') || line.includes('/'));
    } else if (exerciseId.startsWith('bool-') || exerciseId.startsWith('if-')) {
      return codeLines.some(line => line.includes('if') || line.includes('and') || line.includes('or'));
    } else if (exerciseId.startsWith('loop-') || exerciseId.startsWith('list-')) {
      return codeLines.some(line => line.includes('for') || line.includes('while') || line.includes('['));
    } else if (exerciseId.startsWith('func-')) {
      return codeLines.some(line => line.includes('def')) && 
             codeLines.some(line => line.includes('('));
    } else if (exerciseId.startsWith('project-')) {
      // Projects have no validation requirements - always allow submission
      return true;
    }
    
    return false;
  };

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (exerciseId && userId && code !== initialCode) {
      localStorage.setItem(`exercise_code_${userId}_${exerciseId}`, code);
      setIsSaved(true);
      setIsSubmitted(false); // Reset submitted state when code changes
      // Clear the saved indicator after 2 seconds
      setTimeout(() => setIsSaved(false), 2000);
    }
    
    // Pyodide will handle syntax checking, so we clear any previous errors
    setSyntaxErrors([]);
  }, [code, exerciseId, initialCode, userId]);

  // Save output to localStorage whenever it changes
  useEffect(() => {
    if (exerciseId && userId && output) {
      localStorage.setItem(`exercise_output_${userId}_${exerciseId}`, output);
    }
  }, [output, exerciseId, userId]);

  // Update canSubmit whenever code changes
  useEffect(() => {
    if (exerciseId) {
      const meetsRequirements = checkExerciseRequirements(code);
      setCanSubmit(meetsRequirements);
    }
  }, [code, exerciseId]);

  // Simple Python interpreter for basic educational examples
  // Run Python code using Pyodide or fallback to simple interpreter
  const runPythonCode = async (code: string): Promise<string> => {
    try {
      // If Pyodide is available, use it
      if (pyodideRef.current) {
        // Clear previous output
        pyodideRef.current.runPython(`
          import sys
          from io import StringIO
          sys.stdout = StringIO()
        `);

        // Execute the user's code with input handling
        return await executeWithInputHandling(code);
      } else {
        // Fallback to simple interpreter if Pyodide is not available
        console.log('Pyodide not available, using simple interpreter');
        return runSimplePythonCode(code);
      }
    } catch (error) {
      console.error('Error in runPythonCode:', error);
      return `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`;
    }
  };

  // Execute Python code with input handling
  const executeWithInputHandling = async (code: string): Promise<string> => {
    let output = '';
    
    // Preprocess the code to handle input() calls
    const processedCode = await preprocessCodeForInput(code);
    
    try {
      // Execute the preprocessed code
      pyodideRef.current.runPython(processedCode);
      
      // If successful, capture output and return
      output = pyodideRef.current.runPython("sys.stdout.getvalue()");
      return output || 'Code executed successfully (no output)';
      
    } catch (error) {
      console.error('Error in executeWithInputHandling:', error);
      throw error;
    }
  };

  // Preprocess code to handle input() calls
  const preprocessCodeForInput = async (code: string): Promise<string> => {
    let processedCode = code;
    
    // Find all input() calls and replace them with user input
    const inputRegex = /input\s*\(\s*([^)]*)\s*\)/g;
    let match;
    const inputMatches = [];
    
    // First, collect all input() calls
    while ((match = inputRegex.exec(code)) !== null) {
      inputMatches.push({
        fullMatch: match[0],
        prompt: match[1] ? match[1].replace(/['"]/g, '') : '', // Remove quotes
        index: match.index
      });
    }
    
    // Process each input() call sequentially
    for (const inputMatch of inputMatches) {
      // Show input prompt and wait for user input
      setIsWaitingForInput(true);
      setInputPrompt(inputMatch.prompt);
      
      // Wait for user to provide input
      const userInput = await waitForUserInput();
      
      // Replace the input() call with the actual value
      processedCode = processedCode.replace(inputMatch.fullMatch, `"${userInput}"`);
    }
    
    return processedCode;
  };

  // Wait for user input
  const waitForUserInput = (): Promise<string> => {
    return new Promise((resolve) => {
      inputResolveRef.current = resolve;
    });
  };

  // Handle input submission
  const handleInputSubmit = () => {
    if (inputValue.trim() && inputResolveRef.current) {
      const value = inputValue.trim();
      setInputValue('');
      setIsWaitingForInput(false);
      setInputPrompt('');
      inputResolveRef.current(value);
      inputResolveRef.current = null;
    }
  };

  // Simple Python interpreter fallback for development
  const runSimplePythonCode = (code: string): string => {
    try {
      const lines = code.split('\n').filter(line => line.trim());
      let output = '';
      let variables: { [key: string]: any } = {};

      for (const line of lines) {
        const trimmed = line.trim();
        
        // Handle print statements
        if (trimmed.startsWith('print(')) {
          const match = trimmed.match(/print\(([^)]+)\)/);
          if (match) {
            let content = match[1];
            
            // Handle string literals
            if (content.startsWith('"') && content.endsWith('"')) {
              output += content.slice(1, -1) + '\n';
            } else if (content.startsWith("'") && content.endsWith("'")) {
              output += content.slice(1, -1) + '\n';
            } else if (variables[content]) {
              output += variables[content] + '\n';
            } else {
              // Try to evaluate simple expressions
              try {
                const result = Function('"use strict"; return (' + content + ')')();
                output += result + '\n';
              } catch {
                output += content + '\n';
              }
            }
          }
        }
        
        // Handle variable assignments
        else if (trimmed.includes(' = ')) {
          const [varName, value] = trimmed.split(' = ');
          if (value.startsWith('"') && value.endsWith('"')) {
            variables[varName] = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            variables[varName] = value.slice(1, -1);
          } else if (!isNaN(Number(value))) {
            variables[varName] = Number(value);
          } else {
            variables[varName] = value;
          }
        }
        
        // Handle simple functions
        else if (trimmed.startsWith('def ')) {
          // For now, just acknowledge function definition
          output += `Function defined: ${trimmed}\n`;
        }
        
        // Handle input() calls in development mode
        else if (trimmed.includes('input(')) {
          const match = trimmed.match(/input\(([^)]*)\)/);
          if (match) {
            const prompt = match[1] ? match[1].slice(1, -1) : '';
            output += `${prompt}[Simulated input: "test_input"]\n`;
          }
        }
        
        // Handle for loops (simple case)
        else if (trimmed.startsWith('for ')) {
          const match = trimmed.match(/for\s+(\w+)\s+in\s+range\((\d+)\):/);
          if (match) {
            const [, varName, count] = match;
            const loopContent = lines[lines.indexOf(line) + 1]?.trim();
            if (loopContent && loopContent.startsWith('    print(')) {
              const printMatch = loopContent.match(/print\(([^)]+)\)/);
              if (printMatch) {
                for (let i = 0; i < parseInt(count); i++) {
                  variables[varName] = i;
                  let printContent = printMatch[1];
                  if (printContent === varName) {
                    output += i + '\n';
                  } else {
                    output += printContent.replace(new RegExp(varName, 'g'), i.toString()) + '\n';
                  }
                }
              }
            }
          }
        }
      }

      return output || 'Code executed successfully (no output)';
    } catch (error) {
      console.error('Error in runSimplePythonCode:', error);
      return `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`;
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    try {
      const result = await runPythonCode(code);
      setOutput(result);
      setIsRunning(false);
      onRunCode?.(code, result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsRunning(false);
      onRunCode?.(code, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitExercise = async () => {
    if (!code.trim()) return;
    
    // Run the code to get fresh output for submission
    setIsRunning(true);
    try {
      const result = await runPythonCode(code);
      setOutput(result);
      setIsSubmitted(true);
      
      // Save to database via the parent component
      onSubmitExercise?.(code, result);
      
      // Also save to localStorage for immediate access
      if (exerciseId && userId) {
        localStorage.setItem(`exercise_code_${userId}_${exerciseId}`, code);
        localStorage.setItem(`exercise_output_${userId}_${exerciseId}`, result);
      }
      
      // If this is a project, also mark it as complete
      if (exerciseId && exerciseId.startsWith('project-') && onComplete) {
        onComplete();
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };


  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    
    // Clear saved data from localStorage
    if (exerciseId && userId) {
      localStorage.removeItem(`exercise_code_${userId}_${exerciseId}`);
      localStorage.removeItem(`exercise_output_${userId}_${exerciseId}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              Python Code Editor
              {isSaved && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  ✓ Saved
                </span>
              )}
              {syntaxErrors.length > 0 && (
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  ⚠️ {syntaxErrors.length} Error{syntaxErrors.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                disabled={isRunning || isPyodideLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleRunCode}
                disabled={isRunning || isPyodideLoading}
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isPyodideLoading ? 'Loading Python...' : isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your Python code here..."
            className="font-mono min-h-[200px] bg-gray-900 text-green-400 border-gray-700"
            style={{ fontFamily: 'monospace' }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-black text-white p-4 rounded min-h-[100px] overflow-auto font-mono whitespace-pre-wrap">
            {output || 'Click "Run Code" to see the output here...'}
          </pre>
        </CardContent>
      </Card>

      {/* User Input Section */}
      {isWaitingForInput && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              📝 User Input Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-blue-600 font-medium">
                {inputPrompt || "Enter your input:"}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleInputSubmit();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your input here..."
                  autoFocus
                />
                <Button
                  onClick={handleInputSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!inputValue.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Syntax Errors Display */}
      {syntaxErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              ⚠️ Syntax Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syntaxErrors.map((error, index) => (
                <div key={index} className="text-red-600 text-sm font-mono bg-red-100 p-2 rounded border-l-4 border-red-400">
                  {error}
                </div>
              ))}
            </div>
            <p className="text-red-600 text-xs mt-2">
              💡 Fix these errors before running your code for the best results!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Submit Exercise Button - only show for exercises when requirements are met */}
      {exerciseId && exerciseId !== 'free-editor' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${canSubmit ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${canSubmit ? 'text-green-600' : 'text-gray-500'}`}>
                  {isSubmitted 
                    ? 'Exercise submitted! ✅'
                    : canSubmit 
                      ? (isExerciseCompleted 
                          ? 'Exercise completed! You can still submit updated solutions.' 
                          : 'Requirements met! Ready to submit your solution.')
                      : 'Write code that meets the exercise requirements to submit.'
                  }
                </span>
              </div>
              <Button
                onClick={handleSubmitExercise}
                className={canSubmit ? "text-white font-bold shadow-lg transition-all duration-200" : "bg-gray-400 cursor-not-allowed"}
                size="sm"
                disabled={!canSubmit || isPyodideLoading}
                style={{ 
                  minHeight: '36px',
                  fontSize: '14px',
                  border: canSubmit ? '2px solid #22c55e' : '2px solid #9ca3af',
                  borderRadius: '6px',
                  backgroundColor: canSubmit ? '#10b981' : '#9ca3af'
                }}
                onMouseEnter={(e) => {
                  if (canSubmit) {
                    e.currentTarget.style.backgroundColor = '#15803d';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canSubmit) {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
    </div>
  );
}