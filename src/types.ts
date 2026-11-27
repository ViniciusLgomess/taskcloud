import type { Schema } from '../amplify/data/resource';

export type Task = Schema['Task']['type'];
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export interface TaskForm {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: string;
}

export const CATEGORIES = ['Trabalho', 'Estudos', 'Pessoal', 'Saúde', 'Finanças', 'Outros'];
export const PRIORITY_LABEL: Record<Priority, string> = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta' };
export const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export const today = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD local
export const isOverdue = (t: Task) => t.status !== 'COMPLETED' && !!t.dueDate && t.dueDate < today();
export const formatDate = (d?: string | null) => (d ? d.split('-').reverse().join('/') : 'Sem prazo');
