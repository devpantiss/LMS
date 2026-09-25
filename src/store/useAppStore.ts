import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialNotifications } from '../data/mock';
import { demoAccounts } from '../data/auth';
import { initialTrainees, initialTraining, validTraining } from '../data/training';
import { generateCredential, hashPassword, type StudentCredential } from '../services/credentials';
import { studentId } from '../data/training';
import type { User, TrainingAssignment, Notification, Role } from '../types';

type Toast = { id:number; message:string; tone?:'success'|'info' };
interface AppState {
 studentProgress:Record<string,{completedLessons:string[];submittedAssignments:string[]}>; currentStudentId:string; credentials:Record<string,StudentCredential>; generateStudentCredential:(id:string)=>Promise<string>;
 role:Role; isAuthenticated:boolean; theme:'light'|'dark'; sidebar:boolean; commandOpen:boolean; notifications:Notification[];
 trainees:User[]; training:Record<string,TrainingAssignment>; saveTrainee:(user:User,assignment:TrainingAssignment)=>boolean; completedLessons:string[]; submittedAssignments:string[]; publishedCourses:string[];
 toasts:Toast[];
 login:(email:string,password:string)=>Promise<Role|null>; logout:()=>void; toggleTheme:()=>void; toggleSidebar:()=>void; setCommandOpen:(v:boolean)=>void;
 markAllRead:()=>void; completeLesson:(id:string)=>void; submitAssignment:(id:string)=>void;
 publishCourse:(id:string)=>void; addToast:(message:string,tone?:Toast['tone'])=>void; dismissToast:(id:number)=>void;
}
export const useAppStore=create<AppState>()(persist((set,get)=>({
 studentProgress:{},currentStudentId:studentId,credentials:{},
 role:'student',isAuthenticated:false,theme:'dark',sidebar:true,commandOpen:false,notifications:initialNotifications,
 trainees:initialTrainees,training:initialTraining,completedLessons:[],submittedAssignments:[],publishedCourses:[],toasts:[],
 login:async(email,password)=>{const activateStudent=(id:string)=>{const s=get();const saved={...s.studentProgress,[s.currentStudentId]:{completedLessons:s.completedLessons,submittedAssignments:s.submittedAssignments}};const progress=saved[id]||{completedLessons:[],submittedAssignments:[]};set({role:'student',currentStudentId:id,isAuthenticated:true,studentProgress:saved,...progress})};const identifier=email.trim().toLowerCase();const user=get().trainees.find(t=>t.email.toLowerCase()===identifier||get().credentials[t.id]?.loginId.toLowerCase()===identifier);const credential=user&&get().credentials[user.id];if(credential&&user){if(user.status==='Inactive'||await hashPassword(password,credential.salt)!==credential.passwordHash)return null;activateStudent(user.id);return 'student'}const account=demoAccounts.find(a=>a.email===identifier&&a.password===password);if(!account)return null;if(account.role==='student')activateStudent(studentId);else set({role:account.role,isAuthenticated:true});return account.role},
 generateStudentCredential:async(id)=>{if(get().role!=='admin'||!get().isAuthenticated||!get().trainees.some(t=>t.id===id))throw new Error('Only an administrator can generate student credentials.');const result=await generateCredential(get().credentials[id]?.loginId);if(get().role!=='admin'||!get().isAuthenticated)throw new Error('Your admin session ended. Sign in again.');set(s=>({credentials:{...s.credentials,[id]:result.credential}}));return result.password},
 logout:()=>set({isAuthenticated:false,commandOpen:false}),toggleTheme:()=>set(s=>({theme:s.theme==='light'?'dark':'light'})),toggleSidebar:()=>set(s=>({sidebar:!s.sidebar})),setCommandOpen:(commandOpen)=>set({commandOpen}),
 markAllRead:()=>set(s=>({notifications:s.notifications.map(n=>({...n,read:true}))})),
 saveTrainee:(user,assignment)=>{if(get().role!=='admin'||!get().isAuthenticated||user.role!=='student'||!user.name.trim()||!user.email.trim()||!validTraining(assignment))return false;if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)||demoAccounts.some(a=>a.email===user.email.toLowerCase()&&(a.role!=='student'||user.id!==studentId)))return false;if(get().trainees.some(t=>t.id!==user.id&&t.email.toLowerCase()===user.email.toLowerCase()))return false;const changed=get().training[user.id]?.courseId!==assignment.courseId;set(s=>({trainees:s.trainees.some(t=>t.id===user.id)?s.trainees.map(t=>t.id===user.id?user:t):[user,...s.trainees],training:{...s.training,[user.id]:assignment},...(changed?{studentProgress:{...s.studentProgress,[user.id]:{completedLessons:[],submittedAssignments:[]}}}:{}),...(changed&&user.id===s.currentStudentId?{completedLessons:[],submittedAssignments:[]}: {})}));get().addToast('Student training assignment saved','success');return true},
 completeLesson:(id)=>{if(!get().completedLessons.includes(id))set(s=>({completedLessons:[...s.completedLessons,id]}));get().addToast('Lesson complete · +40 XP','success')},
 submitAssignment:(id)=>{set(s=>({submittedAssignments:[...new Set([...s.submittedAssignments,id])]}));get().addToast('Assignment submitted successfully','success')},
 publishCourse:(id)=>{set(s=>({publishedCourses:[...new Set([...s.publishedCourses,id])]}));get().addToast('Course published','success')},
 addToast:(message,tone='info')=>{const id=Date.now();set(s=>({toasts:[...s.toasts,{id,message,tone}]}));setTimeout(()=>get().dismissToast(id),3200)},dismissToast:(id)=>set(s=>({toasts:s.toasts.filter(t=>t.id!==id)})),
}),{name:'pantiss-universe',version:3,migrate:(state)=>{const previous=state as Record<string,unknown>;const {enrolled,...rest}=previous;return {...rest,trainees:initialTrainees,training:initialTraining}},partialize:(s)=>({role:s.role,isAuthenticated:s.isAuthenticated,currentStudentId:s.currentStudentId,credentials:s.credentials,studentProgress:s.studentProgress,theme:s.theme,trainees:s.trainees,training:s.training,completedLessons:s.completedLessons,submittedAssignments:s.submittedAssignments,publishedCourses:s.publishedCourses})}));
