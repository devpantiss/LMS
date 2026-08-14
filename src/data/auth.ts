import type { Role } from '../types';

export type DemoAccount = {
  role: Role;
  name: string;
  email: string;
  password: string;
  description: string;
};

export const demoAccounts: DemoAccount[] = [
  { role: 'student', name: 'Amit Kumar', email: 'student@pantiss.com', password: 'student123', description: 'courses, practicals, skills and credentials' },
  { role: 'teacher', name: 'Rajesh Kumar', email: 'teacher@pantiss.com', password: 'teacher123', description: 'Batches, practical assessments and progress' },
  { role: 'admin', name: 'Neha Verma', email: 'admin@pantiss.com', password: 'admin123', description: 'Trades, trainers, centers and placement readiness' },
];
