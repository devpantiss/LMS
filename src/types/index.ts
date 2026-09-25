export type Role = 'student' | 'teacher' | 'admin';
export type CourseStatus = 'In progress' | 'Assigned' | 'Completed' | 'Saved' | 'Draft' | 'Published' | 'Review';
export interface Course { id:string; title:string; segment:string; jobRole:string; category:string; instructor:string; progress:number; rating:number; learners:string; duration:string; lessons:number; level:string; skills:string[]; status:CourseStatus; color:string; next:string; description:string; }
export interface NavItem { label:string; path:string; icon:string; }
export interface User { id:string; name:string; role:Role|'instructor'; email:string; department:string; status:'Active'|'At risk'|'Inactive'; progress:number; lastActive:string; avatar:string; }
export interface Notification { id:number; title:string; detail:string; kind:string; time:string; read:boolean; }
export interface Assignment { id:string; title:string; course:string; due:string; points:number; status:'Due soon'|'Submitted'|'Graded'|'Overdue'; grade?:number; }
export interface Lesson { track?:'Theory'|'Practicals'; id:string; title:string; type:'Video'|'Article'|'Quiz'|'Assignment'; duration:string; complete:boolean; locked?:boolean; }
export interface Module { id:string; title:string; lessons:Lesson[]; }

export interface TrainingAssignment { projectId:string; centerId:string; batchId:string; courseId:string; }
