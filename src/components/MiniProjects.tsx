import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Gamepad2, Brain, Shuffle, CheckCircle, Code, Play } from 'lucide-react';

interface MiniProjectsProps {
  completedProjects: string[];
  onCompleteProject: (projectId: string) => void;
  onStartProject: (projectId: string) => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
}

const projects: Project[] = [
  {
    id: 'madlibs',
    title: 'MadLibs Generator',
    description: 'Create funny stories by filling in words!',
    icon: Shuffle,
    difficulty: 'Easy',
    xpReward: 50
  },
  {
    id: 'quiz',
    title: 'Python Quiz Game',
    description: 'Test your Python knowledge with a fun quiz!',
    icon: Brain,
    difficulty: 'Medium',
    xpReward: 75
  },
  {
    id: 'wordle',
    title: 'Word Guessing Game',
    description: 'Build a Wordle-style word guessing game!',
    icon: Gamepad2,
    difficulty: 'Hard',
    xpReward: 100
  }
];

export function MiniProjects({ completedProjects, onCompleteProject, onStartProject }: MiniProjectsProps) {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <h2>Mini Projects</h2>
        <Badge variant="secondary">
          {completedProjects.length}/{projects.length} completed
        </Badge>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => {
          const isCompleted = completedProjects.includes(project.id);
          const IconComponent = project.icon;
          
          return (
            <Card key={project.id} className={`transition-all ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {project.title}
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                    <span className="text-sm text-orange-600">{project.xpReward} XP</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProject === project.id ? (
                    <ProjectContent 
                      project={project} 
                      onComplete={() => {
                        // Test mode - no completion tracking, just close
                        setActiveProject(null);
                      }}
                      onCancel={() => setActiveProject(null)}
                      isTestMode={true}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setActiveProject(project.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Test Project
                      </Button>
                      <Button 
                        onClick={() => onStartProject(project.id)}
                        variant={isCompleted ? "outline" : "default"}
                        className="flex-1"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Start Project
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ProjectContent({ project, onComplete, onCancel, isTestMode = false }: { 
  project: Project; 
  onComplete: () => void; 
  onCancel: () => void;
  isTestMode?: boolean;
}) {
  if (project.id === 'madlibs') {
    return <MadLibsProject onComplete={onComplete} onCancel={onCancel} isTestMode={isTestMode} />;
  } else if (project.id === 'quiz') {
    return <QuizProject onComplete={onComplete} onCancel={onCancel} isTestMode={isTestMode} />;
  } else if (project.id === 'wordle') {
    return <WordleProject onComplete={onComplete} onCancel={onCancel} isTestMode={isTestMode} />;
  }
  return null;
}

function MadLibsProject({ onComplete, onCancel, isTestMode = false }: { onComplete: () => void; onCancel: () => void; isTestMode?: boolean }) {
  const [inputs, setInputs] = useState({
    noun: '',
    adjective: '',
    verb: '',
    animal: ''
  });
  const [story, setStory] = useState('');

  const generateStory = () => {
    if (Object.values(inputs).some(val => !val.trim())) {
      alert('Please fill in all the words!');
      return;
    }

    const newStory = `Once upon a time, there was a ${inputs.adjective} ${inputs.noun}. 
    It loved to ${inputs.verb} with a friendly ${inputs.animal}. 
    They had amazing adventures together and became the best of friends!`;
    
    setStory(newStory);
  };

  return (
    <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3>MadLibs Story Generator</h3>
        {isTestMode && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Test Mode
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Noun:</label>
          <Input
            value={inputs.noun}
            onChange={(e) => setInputs({...inputs, noun: e.target.value})}
            placeholder="e.g., dragon"
          />
        </div>
        <div>
          <label className="block mb-1">Adjective:</label>
          <Input
            value={inputs.adjective}
            onChange={(e) => setInputs({...inputs, adjective: e.target.value})}
            placeholder="e.g., magical"
          />
        </div>
        <div>
          <label className="block mb-1">Verb:</label>
          <Input
            value={inputs.verb}
            onChange={(e) => setInputs({...inputs, verb: e.target.value})}
            placeholder="e.g., dance"
          />
        </div>
        <div>
          <label className="block mb-1">Animal:</label>
          <Input
            value={inputs.animal}
            onChange={(e) => setInputs({...inputs, animal: e.target.value})}
            placeholder="e.g., elephant"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={generateStory}>Generate Story!</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      {story && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4>Your Story:</h4>
          <p className="mt-2 italic">{story}</p>
          <Button onClick={onComplete} className="mt-4">
            {isTestMode ? 'Try Again' : 'Complete Project!'}
          </Button>
        </div>
      )}
    </div>
  );
}

function QuizProject({ onComplete, onCancel, isTestMode = false }: { onComplete: () => void; onCancel: () => void; isTestMode?: boolean }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What does 'print()' do in Python?",
      options: ["Prints text to the screen", "Creates a variable", "Starts a loop", "Defines a function"],
      correct: 0
    },
    {
      question: "Which symbol is used for comments in Python?",
      options: ["//", "/*", "#", "<!--"],
      correct: 2
    },
    {
      question: "What keyword is used to create a function?",
      options: ["function", "def", "create", "func"],
      correct: 1
    }
  ];

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg text-center">
        <h3>Quiz Complete!</h3>
        <div className="text-2xl">🎉</div>
        <p>You scored {score} out of {questions.length}!</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={resetQuiz} variant="outline">Try Again</Button>
          <Button onClick={onComplete}>
            {isTestMode ? 'Close Test' : 'Complete Project!'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3>Python Quiz</h3>
          {isTestMode && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Test Mode
            </Badge>
          )}
        </div>
        <Badge>Question {currentQuestion + 1}/{questions.length}</Badge>
      </div>
      
      <div className="space-y-4">
        <p>{questions[currentQuestion].question}</p>
        <div className="grid gap-2">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswer(index)}
              className="justify-start"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function WordleProject({ onComplete, onCancel, isTestMode = false }: { onComplete: () => void; onCancel: () => void; isTestMode?: boolean }) {
  const [word] = useState('PYTHON');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (currentGuess.length !== 6) {
      alert('Please enter a 6-letter word!');
      return;
    }

    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses);

    if (currentGuess.toUpperCase() === word) {
      setGameWon(true);
      setGameOver(true);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
    }

    setCurrentGuess('');
  };

  const getLetterColor = (letter: string, index: number, guess: string) => {
    if (letter === word[index]) return 'bg-green-500 text-white';
    if (word.includes(letter)) return 'bg-yellow-500 text-white';
    return 'bg-gray-300';
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameWon(false);
    setGameOver(false);
  };

  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3>Word Guessing Game</h3>
          <p className="text-sm text-gray-600">Guess the 6-letter programming word!</p>
        </div>
        {isTestMode && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Test Mode
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        {guesses.map((guess, guessIndex) => (
          <div key={guessIndex} className="flex gap-1">
            {guess.split('').map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`w-10 h-10 flex items-center justify-center border-2 rounded ${getLetterColor(letter, letterIndex, guess)}`}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {!gameOver && (
        <div className="space-y-2">
          <Input
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.slice(0, 6))}
            placeholder="Enter your guess..."
            maxLength={6}
          />
          <Button onClick={handleGuess} className="w-full">
            Submit Guess
          </Button>
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-4">
          {gameWon ? (
            <div>
              <div className="text-2xl">🎉</div>
              <p>Congratulations! You guessed PYTHON!</p>
            </div>
          ) : (
            <div>
              <div className="text-2xl">😢</div>
              <p>Game over! The word was PYTHON.</p>
            </div>
          )}
          
          <div className="flex gap-2 justify-center">
            <Button onClick={resetGame} variant="outline">Play Again</Button>
            <Button onClick={onComplete}>
              {isTestMode ? 'Close Test' : 'Complete Project!'}
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}