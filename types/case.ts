export interface Case {
  id: string;
  title: string;
  client_id: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  budget?: number;
  start_date?: string;
  due_date?: string;
  description: string;
  progress: number;
  created_at: string;
  client?: {
    name: string;
    email: string;
    company: string;
  };
  assigned_user?: {
    name: string;
    email: string;
  };
} 