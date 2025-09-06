import { Trophy, Flame, Star, User, Crown } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface GameificationHeaderProps {
  xp: number;
  streak: number;
  level: number;
  nextLevelXp: number;
  user?: {
    displayName: string;
    email: string;
    role?: 'user' | 'admin';
  } | null;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
}

export function GameificationHeader({ xp, streak, level, nextLevelXp, user, onProfileClick, onAdminClick }: GameificationHeaderProps) {
  const progressPercentage = (xp / nextLevelXp) * 100;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl mb-1">🐍 Python Learner</h1>
          <p className="opacity-90">Master Python through interactive challenges!</p>
          {user && (
            <p className="text-sm opacity-75 mt-1">Hi {user.displayName.split(' ')[0]}!</p>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span>Level {level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span>{xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-300" />
            <span>{streak} day streak</span>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && onAdminClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAdminClick}
                className="text-white hover:bg-white/20 flex items-center gap-2"
                title="Admin Dashboard"
              >
                <Crown className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}
            {user && onProfileClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className="text-white hover:bg-white/20 flex items-center gap-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-white/20 text-white border border-white/30">
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <User className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Progress to Level {level + 1}</span>
          <span>{xp}/{nextLevelXp} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </div>
  );
}