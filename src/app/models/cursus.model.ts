import { Theme } from './theme.model';
import { User } from './user.model';

export interface Cursus {
  id: number;
  name: string;
  price?: number;
  theme?: Theme | string;
  created_by?: User; 
  updated_by?: User; 
  lessons?: any[]; 
  created_at?: string;
  updated_at?: string;
}

export interface CursusEnrollment {
  id: number;
  user?: User; 
  cursus?: Cursus;
  inscription?: string; 
  isValidated?: boolean;
  validatedAt?: string; 
  created_at?: string;
  updated_at?: string;
}

