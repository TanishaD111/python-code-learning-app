import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { GameificationHeader } from './components/GameificationHeader';
import { TopicExercises } from './components/TopicExercises';
import { CodeEditor } from './components/CodeEditor';
import { MiniProjects } from './components/MiniProjects';
import { ProjectCodeEditor } from './components/ProjectCodeEditor';
import { AuthForm } from './components/AuthForm';
import { UserProfile } from './components/UserProfile';
import { AdminProfile } from './components/AdminProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { BookOpen, Code, Gamepad2, ArrowLeft, Lightbulb, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { 
  auth, 
  firestore, 
  defaultProgress, 
  calculateLevel,
  getXpForNextLevel,
  onAuthStateChangedListener,
  signUp,
  signIn as signInUser,
  signOutUser,
  createUserProfile,
  getUserProgress,
  saveUserProgress,
  isAdmin,
  type User,
  type UserProgress 
} from './services/firebase-real';

// UserProgress interface now imported from firebase service

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  startingCode: string;
  solution: string;
  hint: string;
}

const topics = [
  { id: 'data-types-variables', name: 'Data Types + Variables', description: 'Learn about different data types and how to store values' },
  { id: 'printing-strings', name: 'Printing + String Concatenation + Casting', description: 'Display output and work with text and type conversion' },
  { id: 'math-input-comparison', name: 'Math Operators + User Input + Comparison Operations', description: 'Perform calculations, get user input, and compare values' },
  { id: 'boolean-conditionals', name: 'Boolean Logic + If/Else/Elif + Nested Conditionals', description: 'Make decisions in your code with logical operators and conditions' },
  { id: 'loops-lists', name: 'For-Loops + While-Loops + Lists', description: 'Repeat actions and work with collections of data' },
  { id: 'functions', name: 'Writing Functions', description: 'Create reusable blocks of code with parameters and return values' }
];

export default function App() {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Helper function to get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // App state
  const [progress, setProgress] = useState(defaultProgress);
  const [selectedTopic, setSelectedTopic] = useState('data-types-variables');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('lessons');
  const [showHint, setShowHint] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [exerciseCode, setExerciseCode] = useState<{ [key: string]: string }>({});

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Clear any existing localStorage from previous users
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('exercise_code_') || key.startsWith('exercise_output_')) && !key.includes(authUser.uid)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        await loadUserProgress(authUser.uid);
      } else {
        setProgress(defaultProgress);
      }
      
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load user progress from Firestore
  const loadUserProgress = async (userId: string) => {
    try {
      const userProgress = await getUserProgress(userId);
      
      if (userProgress) {
        // Check if it's a new day for streak calculation
        const today = new Date().toDateString();
        const lastLogin = new Date(userProgress.lastLoginDate);
        const daysDifference = Math.floor((new Date().getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));
        
        let updatedProgress = { 
          ...userProgress,
          // Ensure submittedResponses exists for existing users
          submittedResponses: userProgress.submittedResponses || {}
        };
        
        if (daysDifference === 1) {
          // Consecutive day - increase streak
          updatedProgress.streak += 1;
        } else if (daysDifference > 1) {
          // Missed days - reset streak
          updatedProgress.streak = 1;
        }
        
        updatedProgress.lastLoginDate = today;
        updatedProgress.level = calculateLevel(updatedProgress.xp);
        
        setProgress(updatedProgress);
        
        // Save updated progress if streak changed or if we added submittedResponses
        if (daysDifference >= 1 || !userProgress.submittedResponses) {
          await saveUserProgress(userId, updatedProgress);
        }
      } else {
        // First time user - create default progress
        const newProgress = { ...defaultProgress };
        setProgress(newProgress);
        await saveUserProgress(userId, newProgress);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      toast.error('Failed to load your progress. Please try again.');
    }
  };

  // Save progress to Firestore
  const saveProgress = async (newProgress: UserProgress) => {
    if (!user) return;
    
    try {
      await saveUserProgress(user.uid, newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress. Please check your connection.');
    }
  };

  // Authentication functions
  const handleSignUp = async (email: string, password: string, displayName: string) => {
    try {
      const newUser = await signUp(email, password, displayName);
      await createUserProfile(newUser);
      toast.success('Account created successfully! Welcome to Python Learner! 🎉');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInUser(email, password);
      toast.success('Welcome back! 🚀');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowProfile(false);
      
      // Clear all user-specific localStorage
      if (user?.uid) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith(`exercise_code_${user.uid}_`) || key.startsWith(`exercise_output_${user.uid}_`))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
      
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const addXp = async (amount: number) => {
    setProgress(prevProgress => {
      const newXp = prevProgress.xp + amount;
      const newLevel = calculateLevel(newXp);
      const leveledUp = newLevel > prevProgress.level;

      const updatedProgress = {
        ...prevProgress,
        xp: newXp,
        level: newLevel
      };

      // Save to database
      saveProgress(updatedProgress);

      if (leveledUp) {
        toast.success(`🎉 Level Up! You're now level ${newLevel}!`);
      }

      return updatedProgress;
    });
    // Note: XP earned message is now handled in the exercise completion logic
  };

  const handleStartExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setShowHint(false);
    setEditorKey(prev => prev + 1); // Force editor reset
    
    // Load previously submitted response if it exists, otherwise use starting code
    const submittedResponse = progress.submittedResponses?.[exercise.id];
    const codeToLoad = submittedResponse ? submittedResponse.code : exercise.startingCode;
    
    setExerciseCode(prev => ({
      ...prev,
      [exercise.id]: codeToLoad
    }));
  };


  const handleRunCode = async (code: string, output: string) => {
    // Update current code and check if it meets requirements
    if (currentExercise) {
      setExerciseCode(prev => ({
        ...prev,
        [currentExercise.id]: code
      }));
    }
  };

  const handleSubmitExercise = async (code: string, output: string) => {
    if (!currentExercise) return;

    // Store the submitted response
    const submittedResponse = {
      code,
      output,
      submittedAt: new Date().toISOString()
    };

    const updatedProgress = {
      ...progress,
      submittedResponses: {
        ...progress.submittedResponses,
        [currentExercise.id]: submittedResponse
      }
    };

    // Check if this exercise has been completed before (in database)
    const hasBeenCompleted = progress.completedExercises.includes(currentExercise.id);
    
    if (!hasBeenCompleted) {
      // First time completing this exercise - award XP and mark as completed
      updatedProgress.completedExercises = [...progress.completedExercises, currentExercise.id];
      
      // Update state first
      setProgress(updatedProgress);
      
      // Then save to database and add XP
      await saveProgress(updatedProgress);
      await addXp(currentExercise.xpReward);
      
      toast.success(`🎯 Exercise completed! Great job! +${currentExercise.xpReward} XP earned!`);
    } else {
      // Already completed - just update the response without awarding XP
      setProgress(updatedProgress);
      await saveProgress(updatedProgress);
      toast.info(`✅ Exercise resubmitted! No additional XP awarded.`);
    }
  };

  const handleCompleteProject = async (projectId: string) => {
    if (!progress.completedProjects.includes(projectId)) {
      const updatedProgress = {
        ...progress,
        completedProjects: [...progress.completedProjects, projectId]
      };
      setProgress(updatedProgress);
      await saveProgress(updatedProgress);
      
      const xpRewards = { madlibs: 50, quiz: 75, wordle: 100 };
      const xpReward = xpRewards[projectId as keyof typeof xpRewards] || 50;
      await addXp(xpReward);
      toast.success(`🚀 Project completed! Amazing work!`);
    }
  };

  const handleStartProject = (projectId: string) => {
    setCurrentProject(projectId);
    setCurrentExercise(null);
    setShowHint(false);
  };

  const handleBackToProjects = () => {
    setCurrentProject(null);
    setActiveTab('projects');
  };

  const nextLevelXp = getXpForNextLevel(progress.level);

  // Use completed exercises from database
  const allCompletedExercises = progress.completedExercises;

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg">Loading Python Learner...</p>
        </div>
      </div>
    );
  }

  // Show authentication form if user is not logged in
  if (!user) {
    return (
      <AuthForm
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
        loading={authLoading}
      />
    );
  }



  // Show user profile if requested
  if (showProfile) {
    return (
      isAdmin(user) ? (
        <AdminProfile
          user={user}
          onSignOut={handleSignOut}
          onBack={() => setShowProfile(false)}
        />
      ) : (
        <UserProfile
          user={user}
          progress={progress}
          onSignOut={handleSignOut}
          onBack={() => setShowProfile(false)}
        />
      )
    );
  }

  // Admin-only interface
  if (user && isAdmin(user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Admin Header - Same style as regular users */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl mb-1 flex items-center space-x-2">
                  <span>👑</span>
                  <span>Python Learner - Admin</span>
                </h1>
                <p className="opacity-90">Monitor user activity and progress</p>
                <p className="text-sm opacity-75 mt-1">Welcome, {user.displayName}!</p>
              </div>
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfile(true)}
                  className="text-white hover:bg-white/20 flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-white/20 text-white border border-white/30">
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <UserIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Admin Dashboard Content */}
          <AdminDashboard onBack={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <GameificationHeader 
          xp={progress.xp}
          streak={progress.streak}
          level={progress.level}
          nextLevelXp={nextLevelXp}
          user={user}
          onProfileClick={() => setShowProfile(true)}
        />

        {currentExercise ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentExercise(null)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    {currentExercise.title}
                    <Badge>{currentExercise.difficulty}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {currentExercise.description}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Hide' : 'Show'} Hint
                </Button>
              </div>
              
              {showHint && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm">💡 <strong>Hint:</strong> {currentExercise.hint}</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div key={editorKey}>
                <CodeEditor
                  initialCode={exerciseCode[currentExercise.id] || currentExercise.startingCode}
                  onRunCode={handleRunCode}
                  onSubmitExercise={handleSubmitExercise}
                  exerciseId={currentExercise.id}
                  isExerciseCompleted={progress.completedExercises.includes(currentExercise.id)}
                  userId={user?.uid || ''}
                />
              </div>
            </CardContent>
          </Card>
        ) : currentProject ? (
          <ProjectCodeEditor 
            projectId={currentProject}
            onBack={handleBackToProjects}
            onComplete={() => {
              handleCompleteProject(currentProject);
              setCurrentProject(null);
            }}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="lessons" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Lessons
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Mini Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Choose a Topic</CardTitle>
                  <CardDescription>
                    Select a Python topic to learn and practice with interactive exercises.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          <div>
                            <div>{topic.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {topic.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <TopicExercises
                topic={selectedTopic}
                completedExercises={allCompletedExercises}
                onStartExercise={handleStartExercise}
              />
            </TabsContent>

            <TabsContent value="editor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Free Code Editor</CardTitle>
                  <CardDescription>
                    Practice Python coding with our built-in editor. Experiment and learn!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeEditor 
                    initialCode="# Write your Python code here\nprint('Hello, Python!')" 
                    exerciseId="free-editor"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <MiniProjects
                completedProjects={progress.completedProjects}
                onCompleteProject={handleCompleteProject}
                onStartProject={handleStartProject}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}