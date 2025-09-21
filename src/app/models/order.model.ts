import { User } from './user.model';

export interface Order {
  id: number;
  date: string; 
  status: string; 
  stripeOrderId?: string; 
  amount: number; 
  user?: User; 
  orderItems?: OrderItem[]; 
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: number;
  price: number; 
  orderId?: any; 
  lesson?: any; 
  cursus?: any; 
  created_at?: string;
  updated_at?: string;
}

