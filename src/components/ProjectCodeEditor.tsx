import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CodeEditor } from './CodeEditor';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface ProjectCodeEditorProps {
  projectId: string;
  onBack: () => void;
  onComplete: () => void;
  onSubmitExercise?: (code: string, output: string) => void;
  userId?: string;
  submittedResponses?: { [exerciseId: string]: { code: string; output: string; submittedAt: string } };
}

interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  startingCode: string;
  requirements: string[];
  hints: string[];
}

const projectTemplates: { [key: string]: ProjectTemplate } = {
  madlibs: {
    id: 'madlibs',
    title: 'MadLibs Generator',
    description: 'Create a fun story generator using predefined word lists!',
    startingCode: `# MadLibs Generator
# This project will create funny stories using predefined word lists

# Step 1: Create lists of different types of words
# Create lists for names, adjectives, verbs, animals, places, etc.

# Example:
# names = ["Alice", "Bob", "Charlie", "Diana"]
# adjectives = ["brave", "silly", "mysterious", "colorful"]
# animals = ["dragon", "unicorn", "elephant", "butterfly"]

# Step 2: Create your story template
# Use f-strings or string formatting to insert random words

# Step 3: Print multiple story variations
# Use print() to display different story combinations

# Your code here:
`,
    requirements: [
      'Create at least 3 different word lists (names, adjectives, verbs, etc.)',
      'Each list should have at least 4 words',
      'Create a story template using the word lists',
      'Generate and print at least 3 different story variations',
      'Use random selection or indexing to pick words from lists'
    ],
    hints: [
      'Create lists like: names = ["Alice", "Bob", "Charlie"]',
      'Use f-strings like f"Once upon a time, {names[0]} met a {adjectives[1]} {animals[2]}"',
      'You can use random.choice() or just pick different indices like [0], [1], [2]',
      'Try creating multiple story templates for variety'
    ]
  },
  quiz: {
    id: 'quiz',
    title: 'Python Quiz Game',
    description: 'Build a quiz game that automatically tests Python knowledge!',
    startingCode: `# Python Quiz Game
# Create a quiz that automatically tests Python knowledge

# Step 1: Create a list of questions and answers
# Each question should have multiple choice options

# Example structure:
# questions = [
#   {
#     "question": "What does print() do?",
#     "options": ["A) Prints text", "B) Creates variables", "C) Starts loops"],
#     "correct": "A"
#   }
# ]

# Step 2: Create a function to display questions
# Loop through questions and show options

# Step 3: Create predefined answers
# Use a list of answers to simulate user responses

# Step 4: Keep track of score
# Count correct answers and display final score

# Your code here:
`,
    requirements: [
      'Create at least 5 quiz questions about Python',
      'Each question should have multiple choice answers (A, B, C, D)',
      'Create a list of predefined answers to simulate user responses',
      'Keep track of the score and display the final result',
      'Use functions to organize your code'
    ],
    hints: [
      'Use a list of dictionaries to store questions and answers',
      'Create a function like display_question(question) to show each question',
      'Use a list like answers = ["A", "B", "A", "C", "D"] for predefined responses',
      'Use a for loop to go through all questions and check answers',
      'Keep a score variable and increment it for correct answers'
    ]
  },
  wordle: {
    id: 'wordle',
    title: 'Word Guessing Game',
    description: 'Create a Wordle-style game that automatically tests word guesses!',
    startingCode: `# Word Guessing Game (Wordle-style)
# Create a game that automatically tests word guesses

# Step 1: Choose a secret word
# Pick a word that needs to be guessed

# Step 2: Create a list of guesses
# Define a list of words to test against the secret word

# Step 3: Create feedback function
# Tell which letters are correct and in the right position
# Tell which letters are correct but in the wrong position
# Tell which letters are not in the word

# Step 4: Test all guesses
# Loop through the guess list and provide feedback for each

# Step 5: Display results
# Show the feedback for each guess and final result

# Your code here:
`,
    requirements: [
      'Choose a secret word (5-6 letters recommended)',
      'Create a list of at least 4 different guess words',
      'Create a function to provide feedback on each guess',
      'Show feedback for each guess (correct position, wrong position, not in word)',
      'Display the results for all guesses'
    ],
    hints: [
      'Use a string for the secret word like secret = "PYTHON"',
      'Create a list like guesses = ["WORDS", "HELLO", "PYTHON", "CODING"]',
      'Create a function that compares each letter position',
      'Use symbols like ✓ for correct position, ~ for wrong position, ✗ for not in word',
      'Loop through your guess list and test each one'
    ]
  }
};

export function ProjectCodeEditor({ projectId, onBack, onComplete, onSubmitExercise, userId, submittedResponses }: ProjectCodeEditorProps) {
  const [showHints, setShowHints] = useState(false);
  const [showRequirements, setShowRequirements] = useState(true);
  
  const project = projectTemplates[projectId];
  
  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Not Found</CardTitle>
          <CardDescription>The selected project could not be found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={onBack} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {project.title}
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowRequirements(!showRequirements)}
                variant={showRequirements ? "default" : "outline"}
                size="sm"
              >
                {showRequirements ? 'Hide' : 'Show'} Requirements
              </Button>
              <Button 
                onClick={() => setShowHints(!showHints)}
                variant={showHints ? "default" : "outline"}
                size="sm"
              >
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Requirements */}
      {showRequirements && (
        <Card>
          <CardHeader>
            <CardTitle>Project Requirements</CardTitle>
            <CardDescription>What you need to build for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">{index + 1}.</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {showHints && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Hints & Tips</CardTitle>
            <CardDescription>Helpful guidance to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project.hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">💡</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
          <CardDescription>
            Build your {project.title} project! The starting code includes helpful comments to guide you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeEditor 
            initialCode={project.startingCode}
            exerciseId={`project-${projectId}`}
            onSubmitExercise={onSubmitExercise}
            onComplete={onComplete}
            userId={userId}
            submittedResponses={submittedResponses}
          />
        </CardContent>
      </Card>

    </div>
  );
}

