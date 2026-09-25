import { courses, users } from './mock';
import type { User, TrainingAssignment } from '../types';

export const studentId = 'demo-student';
export const projects = [...new Set(courses.map(c => c.segment))].map((name, i) => ({ id: `project-${i}`, name: `${name} Skills Development`, segment: name }));
export const centers = projects.flatMap(p => ['Main Training Center', 'Regional Training Center'].map((name, i) => ({ id: `${p.id}-center-${i}`, projectId: p.id, name: `${p.segment} · ${name}` })));
export const batches = centers.flatMap(center => courses.filter(c => c.segment === projects.find(p => p.id === center.projectId)?.segment).map((course, i) => ({ id: `${center.id}-${course.id}`, centerId: center.id, courseId: course.id, name: `${course.jobRole} · Batch ${String(i + 1).padStart(2, '0')}` })));
export const initialTrainees: User[] = [{ id: studentId, name: 'Amit Kumar', email: 'student@pantiss.com', role: 'student', department: 'Electrical Trades', status: 'Active', progress: 62, lastActive: 'Today', avatar: 'AK' }, ...users.filter(u => u.role === 'student')];
export const initialTraining: Record<string, TrainingAssignment> = { [studentId]: { projectId: projects[0].id, centerId: centers[0].id, batchId: batches[0].id, courseId: batches[0].courseId } };
export function validTraining(a: TrainingAssignment) {
 return projects.some(p => p.id === a.projectId) && centers.some(c => c.id === a.centerId && c.projectId === a.projectId) && batches.some(b => b.id === a.batchId && b.centerId === a.centerId && b.courseId === a.courseId) && courses.some(c => c.id === a.courseId);
}
