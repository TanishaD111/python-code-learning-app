import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Target, 
  Flame, 
  Star,
  BookOpen,
  Code,
  LogOut,
  ArrowLeft
} from 'lucide-react';

interface UserProfileProps {
  user: {
    email: string;
    displayName: string;
    uid: string;
    createdAt?: string;
  };
  progress: {
    xp: number;
    streak: number;
    level: number;
    completedExercises: string[];
    completedProjects: string[];
    lastLoginDate: string;
  };
  onSignOut: () => void;
  onBack: () => void;
}

export function UserProfile({ user, progress, onSignOut, onBack }: UserProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateTotalExercises = () => {
    // Total exercises across all topics (20 each × 6 topics)
    return 120;
  };

  const calculateTotalProjects = () => {
    return 3; // MadLibs, Quiz, Wordle
  };

  const getXpForNextLevel = (level: number) => {
    return level * 100;
  };

  const nextLevelXp = getXpForNextLevel(progress.level);
  const progressPercentage = (progress.xp / nextLevelXp) * 100;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  const calculateCompletionPercentage = () => {
    const totalItems = calculateTotalExercises() + calculateTotalProjects();
    const completedItems = progress.completedExercises.length + progress.completedProjects.length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning
          </Button>
          <Button variant="outline" onClick={onSignOut} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{user.displayName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </CardDescription>
                {user.createdAt && (
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since {formatDate(user.createdAt)}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl">{progress.level}</p>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl">{progress.xp}</p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Flame className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl">{progress.streak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl">{calculateCompletionPercentage()}%</p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Details */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your journey through Python fundamentals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Level {progress.level} Progress</span>
                  <span>{progress.xp}/{nextLevelXp} XP</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span>Exercises Completed</span>
                  </div>
                  <Badge variant="secondary">
                    {progress.completedExercises.length}/{calculateTotalExercises()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-500" />
                    <span>Projects Completed</span>
                  </div>
                  <Badge variant="secondary">
                    {progress.completedProjects.length}/{calculateTotalProjects()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">Last login</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(progress.lastLoginDate)}
                    </p>
                  </div>
                </div>

                {progress.completedExercises.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Latest Exercise Completed</p>
                      <p className="text-xs text-muted-foreground">
                        Exercise #{progress.completedExercises[progress.completedExercises.length - 1]}
                      </p>
                    </div>
                  </div>
                )}

                {progress.completedProjects.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Latest Project Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {progress.completedProjects[progress.completedProjects.length - 1]}
                      </p>
                    </div>
                  </div>
                )}

                {progress.level > 1 && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Reached Level {progress.level}</p>
                      <p className="text-xs text-muted-foreground">
                        {progress.xp} XP earned
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {progress.completedExercises.length === 0 && progress.completedProjects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start your first exercise to see activity here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Badges you've earned on your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* First Exercise Badge */}
              {progress.completedExercises.length > 0 && (
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-center">First Steps</p>
                </div>
              )}

              {/* Level Up Badge */}
              {progress.level >= 2 && (
                <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-center">Level Up!</p>
                </div>
              )}

              {/* Project Completer Badge */}
              {progress.completedProjects.length > 0 && (
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-center">Project Master</p>
                </div>
              )}

              {/* Streak Badge */}
              {progress.streak >= 7 && (
                <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-2">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-center">On Fire!</p>
                </div>
              )}

              {/* High XP Badge */}
              {progress.xp >= 500 && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-center">XP Hunter</p>
                </div>
              )}

              {/* Completion Badge */}
              {calculateCompletionPercentage() >= 50 && (
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mb-2">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-center">Half Way!</p>
                </div>
              )}
            </div>

            {progress.completedExercises.length === 0 && progress.level === 1 && progress.streak === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Complete exercises and projects to earn achievement badges!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}