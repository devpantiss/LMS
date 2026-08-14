import { courses } from '../data/mock';
const wait=(ms=450)=>new Promise(r=>setTimeout(r,ms));
export const courseService={async getCourses(){await wait();return courses},async getCourse(id:string){await wait(250);return courses.find(c=>c.id===id)}};
