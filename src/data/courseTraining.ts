import { modules } from './mock';

type DailyAssessment = { id: string; day: number; module: string; title: string; type: 'Theory' | 'Practical'; duration: string; status: 'Graded' | 'Due today' | 'Scheduled'; score?: number; route?: string; instructions: string };
export const dailyAssessments: DailyAssessment[] = [
 { id: 'day1-theory', day: 1, module: 'Safety & Trade Foundations', title: 'Workshop safety knowledge check', type: 'Theory', duration: '15 min', status: 'Graded', score: 90, instructions: 'Identify workshop hazards, PPE requirements, and the correct isolation sequence.' },
 { id: 'day1-practical', day: 1, module: 'Safety & Trade Foundations', title: 'PPE and isolation demonstration', type: 'Practical', duration: '30 min', status: 'Graded', score: 88, instructions: 'Demonstrate tool inspection, PPE selection, and lockout/tagout under trainer observation.' },
 { id: 'day2-theory', day: 2, module: 'Industrial Power Systems', title: 'Motor control knowledge check', type: 'Theory', duration: '15 min', status: 'Due today', route: '/student/quiz/checkpoint', instructions: 'Answer the daily theory questions on isolation, motor protection, and safe testing. The competency threshold is 80%.' },
 { id: 'a1', day: 2, module: 'Industrial Power Systems', title: 'Motor Starter Wiring Practical', type: 'Practical', duration: '45 min', status: 'Due today', route: '/student/assignments/a1', instructions: 'Complete the wiring task with your trainer and submit your job card, observation checklist, and photographs.' },
 { id: 'day3-theory', day: 3, module: 'Installation & Troubleshooting', title: 'Fault diagnosis knowledge check', type: 'Theory', duration: '20 min', status: 'Scheduled', instructions: 'Review fault symptoms, test sequences, and safe restoration procedures. Your trainer will release this assessment.' },
 { id: 'day3-practical', day: 3, module: 'Installation & Troubleshooting', title: 'Control panel fault-finding task', type: 'Practical', duration: '60 min', status: 'Scheduled', instructions: 'Locate and report a simulated control-panel fault under supervision. Your trainer will release this assessment.' },
];

export const getCourseModules = (courseId?: string) => courseId === 'industrial-electrician' ? modules : [];
export const getDailyAssessments = (courseId?: string) => courseId === 'industrial-electrician' ? dailyAssessments : [];
