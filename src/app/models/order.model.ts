import { User } from './user.model';
import { OrderItem } from './order-item.model';

export interface Order {
  '@id'?: string;
  '@type'?: string;
  '@context'?: string;
  id?: number;
  date: string; 
  status: string; 
  stripeOrderId?: string; 
  amount: number; 
  user?: User; 
  orderItems?: OrderItem[]; 
  created_at?: string;
  updated_at?: string;
}


