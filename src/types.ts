export 
interface Task {
  id: string;
  title: string;
  description: string;
  type: string;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';
  progress: number;
  total: number;
  goal: number;
  reward: number;
}


export interface User {
  id: number;
  username: string;
  email: string;
  joined_at: string;
  total_seconds: number;
  level: string;
  xp: number;
  xp_to_next_level: number;
  talent: { name: string; description: string; rank: string }[];
  achievements: { name: string; description: string; grade: string; date: string }[];
  ranking: number;
  gender: string;
  avatar: string;
  job: string;
  rank: string;
  stats:{
    STR: number
    VIT: number
    AGI: number
    INT: number
    WIS: number
    Free: number
};
}

export interface Skill {
  name: string;
  description: string;
  rank: string;
}

export interface Achievement {
  title: string;
  achievement: string;
  grade: string;
}

export interface Leader {
  rank: number;
  name: string;
  initials: string;
  level: number;
  title: string;
  rankTier: string;
  combatPower: string;
  isCurrentUser: boolean;
}