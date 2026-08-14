import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { courses, initialNotifications } from '../data/mock';
import { demoAccounts } from '../data/auth';
import type { Notification, Role } from '../types';

type Toast = { id:number; message:string; tone?:'success'|'info' };
interface AppState {
 role:Role; isAuthenticated:boolean; theme:'light'|'dark'; sidebar:boolean; commandOpen:boolean; notifications:Notification[];
 enrolled:string[]; completedLessons:string[]; submittedAssignments:string[]; publishedCourses:string[];
 toasts:Toast[];
 login:(email:string,password:string)=>Role|null; logout:()=>void; toggleTheme:()=>void; toggleSidebar:()=>void; setCommandOpen:(v:boolean)=>void;
 markAllRead:()=>void; enroll:(id:string)=>void; completeLesson:(id:string)=>void; submitAssignment:(id:string)=>void;
 publishCourse:(id:string)=>void; addToast:(message:string,tone?:Toast['tone'])=>void; dismissToast:(id:number)=>void;
}
export const useAppStore=create<AppState>()(persist((set,get)=>({
 role:'student',isAuthenticated:false,theme:'dark',sidebar:true,commandOpen:false,notifications:initialNotifications,
 enrolled:courses.filter(c=>['In progress','Assigned','Completed'].includes(c.status)).map(c=>c.id),completedLessons:[],submittedAssignments:[],publishedCourses:[],toasts:[],
 login:(email,password)=>{const account=demoAccounts.find(a=>a.email===email.trim().toLowerCase()&&a.password===password);if(!account)return null;set({role:account.role,isAuthenticated:true});return account.role},
 logout:()=>set({isAuthenticated:false,commandOpen:false}),toggleTheme:()=>set(s=>({theme:s.theme==='light'?'dark':'light'})),toggleSidebar:()=>set(s=>({sidebar:!s.sidebar})),setCommandOpen:(commandOpen)=>set({commandOpen}),
 markAllRead:()=>set(s=>({notifications:s.notifications.map(n=>({...n,read:true}))})),
 enroll:(id)=>{if(!get().enrolled.includes(id))set(s=>({enrolled:[...s.enrolled,id]}));get().addToast('Course added to My Learning','success')},
 completeLesson:(id)=>{if(!get().completedLessons.includes(id))set(s=>({completedLessons:[...s.completedLessons,id]}));get().addToast('Lesson complete · +40 XP','success')},
 submitAssignment:(id)=>{set(s=>({submittedAssignments:[...new Set([...s.submittedAssignments,id])]}));get().addToast('Assignment submitted successfully','success')},
 publishCourse:(id)=>{set(s=>({publishedCourses:[...new Set([...s.publishedCourses,id])]}));get().addToast('Course published','success')},
 addToast:(message,tone='info')=>{const id=Date.now();set(s=>({toasts:[...s.toasts,{id,message,tone}]}));setTimeout(()=>get().dismissToast(id),3200)},dismissToast:(id)=>set(s=>({toasts:s.toasts.filter(t=>t.id!==id)})),
}),{name:'pantiss-universe',version:2,migrate:(state,version)=>version<2?{...(state as object),theme:'dark'}:state,partialize:(s)=>({role:s.role,isAuthenticated:s.isAuthenticated,theme:s.theme,enrolled:s.enrolled,completedLessons:s.completedLessons,submittedAssignments:s.submittedAssignments,publishedCourses:s.publishedCourses})}));
