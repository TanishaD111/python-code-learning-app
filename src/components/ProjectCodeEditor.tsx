import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CodeEditor } from './CodeEditor';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface ProjectCodeEditorProps {
  projectId: string;
  onBack: () => void;
  onComplete: () => void;
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
    description: 'Create a fun story generator that asks users for words and creates a story!',
    startingCode: `# MadLibs Generator
# This project will create funny stories by asking users for words

# Step 1: Create variables to store user input
# Ask the user for different types of words
# Use input() function to get user input

# Example:
# name = input("Enter a name: ")
# adjective = input("Enter an adjective: ")

# Step 2: Create your story template
# Use f-strings or string formatting to insert the words

# Step 3: Print the final story
# Use print() to display the completed story

# Your code here:
`,
    requirements: [
      'Ask user for at least 3 different types of words (noun, adjective, verb, etc.)',
      'Use input() function to get user input',
      'Create a story template using the collected words',
      'Print the final story using print()',
      'Make it creative and fun!'
    ],
    hints: [
      'Use input("Your question: ") to ask for user input',
      'Store each input in a variable with a descriptive name',
      'Use f-strings like f"Once upon a time, there was a {adjective} {noun}"',
      'You can ask for: name, adjective, verb, animal, place, etc.'
    ]
  },
  quiz: {
    id: 'quiz',
    title: 'Python Quiz Game',
    description: 'Build an interactive quiz game to test Python knowledge!',
    startingCode: `# Python Quiz Game
# Create an interactive quiz with questions and answers

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

# Step 3: Keep track of score
# Count correct answers and display final score

# Step 4: Add user interaction
# Let users input their answers

# Your code here:
`,
    requirements: [
      'Create at least 5 quiz questions about Python',
      'Each question should have multiple choice answers (A, B, C, D)',
      'Keep track of the user\'s score',
      'Display the final score at the end',
      'Use functions to organize your code'
    ],
    hints: [
      'Use a list of dictionaries to store questions and answers',
      'Create a function like display_question(question) to show each question',
      'Use a for loop to go through all questions',
      'Keep a score variable and increment it for correct answers',
      'Use input() to get user answers'
    ]
  },
  wordle: {
    id: 'wordle',
    title: 'Word Guessing Game',
    description: 'Create a Wordle-style word guessing game with hints!',
    startingCode: `# Word Guessing Game (Wordle-style)
# Create a game where players guess a secret word

# Step 1: Choose a secret word
# Pick a word that players need to guess

# Step 2: Create a guessing loop
# Allow players to make multiple guesses

# Step 3: Provide feedback
# Tell players which letters are correct and in the right position
# Tell players which letters are correct but in the wrong position
# Tell players which letters are not in the word

# Step 4: Limit guesses
# Give players a limited number of attempts

# Step 5: Win/lose conditions
# Check if player guessed correctly or ran out of attempts

# Your code here:
`,
    requirements: [
      'Choose a secret word (5-6 letters recommended)',
      'Allow players to make guesses',
      'Provide feedback on each guess (correct position, wrong position, not in word)',
      'Limit the number of guesses (e.g., 6 attempts)',
      'Display win/lose message at the end'
    ],
    hints: [
      'Use a string for the secret word',
      'Create a loop that runs for a limited number of attempts',
      'Compare each letter of the guess with the secret word',
      'Use different symbols or colors to show feedback',
      'Consider using lists to track which letters have been guessed'
    ]
  }
};

export function ProjectCodeEditor({ projectId, onBack, onComplete }: ProjectCodeEditorProps) {
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
          />
        </CardContent>
      </Card>

      {/* Complete Project Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              When you're happy with your project, click below to mark it as complete!
            </p>
            <Button onClick={onComplete} size="lg" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

