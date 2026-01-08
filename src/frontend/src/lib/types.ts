export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
}
