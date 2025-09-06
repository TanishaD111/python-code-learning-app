import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  onRunCode?: (code: string, output: string) => void;
  onSubmitExercise?: (code: string, output: string) => void;
  exerciseId?: string; // Add exerciseId to save code per exercise
  isExerciseCompleted?: boolean; // Track if exercise is already completed
  userId?: string; // Add userId to make localStorage user-specific
}

export function CodeEditor({ 
  initialCode = '', 
  onRunCode, 
  onSubmitExercise, 
  exerciseId, 
  isExerciseCompleted = false, 
  userId = ''
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);

  // Load saved code and output when component mounts or exerciseId changes
  useEffect(() => {
    if (exerciseId && userId) {
      const savedCode = localStorage.getItem(`exercise_code_${userId}_${exerciseId}`);
      const savedOutput = localStorage.getItem(`exercise_output_${userId}_${exerciseId}`);
      
      if (savedCode) {
        setCode(savedCode);
      } else if (initialCode) {
        setCode(initialCode);
      }
      if (savedOutput) {
        setOutput(savedOutput);
      }
    }
  }, [exerciseId, initialCode, userId]);

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
    
    // Check for syntax errors whenever code changes
    const errors = checkSyntax(code);
    setSyntaxErrors(errors);
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
  const runPythonCode = (code: string): string => {
    try {
      
      // Check for syntax errors first
      const errors = checkSyntax(code);
      if (errors.length > 0) {
        return `Syntax Error: ${errors[0]}`;
      }
      
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

      const result = output || 'Code executed successfully (no output)';
      return result;
    } catch (error) {
      console.error('Error in runPythonCode:', error);
      return `Error: ${error instanceof Error ? error.message : 'Something went wrong'}`;
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    
    // Simulate execution delay
    setTimeout(() => {
      try {
        const result = runPythonCode(code);
        setOutput(result);
        setIsRunning(false);
        onRunCode?.(code, result);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsRunning(false);
        onRunCode?.(code, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }, 500);
  };

  const handleSubmitExercise = () => {
    if (!code.trim() || !output) return;
    setIsSubmitted(true);
    onSubmitExercise?.(code, output);
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
                disabled={isRunning}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
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
                disabled={!canSubmit}
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