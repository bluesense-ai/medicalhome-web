export interface Task {
  id: string;
  consult_id: string;
  due_date: string;
  title: string;
  status: string;
  details: string;
  assigned_to: [];
}