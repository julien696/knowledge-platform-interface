import { User } from './user.model';

export interface Lesson {
  id: number;
  name: string;
  description?: string;
  price?: number;
  videoUrl?: string;
  videoFile?: File;        
  videoName?: string;     
  cursus?: any; 
  created_by?: User; 
  updated_by?: User; 
  created_at?: string;
  updated_at?: string;
}

export interface LessonEnrollment {
  id: number;
  user?: User; 
  lesson?: Lesson;
  inscription?: string; 
  isValidated?: boolean;
  validatedAt?: string; 
  created_at?: string;
  updated_at?: string;
}

