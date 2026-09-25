import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, ChevronRight, FolderOpen, GraduationCap, KeyRound, Search, UserPlus, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { StudentCredentials } from './StudentCredentials';
import { courses } from '../../data/mock';
import { batches, centers, projects } from '../../data/training';
import { useAppStore } from '../../store/useAppStore';
import { Avatar, Badge, Button, Card, EmptyState, PageHeader } from '../../components/ui';
import type { TrainingAssignment, User } from '../../types';

const blankAssignment: TrainingAssignment = { projectId: '', centerId: '', batchId: '', courseId: '' };

export function AdminUsers() {
 const { trainees, training, saveTrainee, credentials, generateStudentCredential } = useAppStore();
 const [params,setParams]=useSearchParams();
 const project=projects.find(p=>p.id===params.get('project'));
 const center=centers.find(c=>c.id===params.get('center')&&c.projectId===project?.id);
 const batch=batches.find(b=>b.id===params.get('batch')&&b.centerId===center?.id);
 const unassigned=params.get('view')==='unassigned';
 const [credentialView,setCredentialView]=useState<{id:string;password?:string}|null>(null);
 const [saving,setSaving]=useState(false);
 const navigateLevel=(projectId?:string,centerId?:string,batchId?:string)=>{setQuery('');setParams({...projectId?{project:projectId}:{},...centerId?{center:centerId}:{},...batchId?{batch:batchId}:{}})};
 const [query, setQuery] = useState('');
 const [editing, setEditing] = useState<User | 'new' | null>(null);
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [assignment, setAssignment] = useState(blankAssignment);
 const [error, setError] = useState('');
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(() => { if(editing) dialog.current?.showModal(); }, [editing]);
 const open = (user: User | 'new') => {
  setEditing(user); setName(user === 'new' ? '' : user.name); setEmail(user === 'new' ? '' : user.email);
  setAssignment(user === 'new' ? {projectId:project?.id||'',centerId:center?.id||'',batchId:batch?.id||'',courseId:batch?.courseId||''} : training[user.id] || blankAssignment); setError('');
 };
 const selectedCourse = courses.find(c => c.id === assignment.courseId);
 const rows = trainees.filter(t=>unassigned?!training[t.id]:training[t.id]?.batchId===batch?.id).filter(t => `${t.name} ${t.email} ${courses.find(c => c.id === training[t.id]?.courseId)?.jobRole || ''}`.toLowerCase().includes(query.toLowerCase()));
 const count=(predicate:(a:TrainingAssignment)=>boolean)=>trainees.filter(t=>training[t.id]&&predicate(training[t.id])).length;
 const options=batch||unassigned?[]:center?batches.filter(b=>b.centerId===center.id).map(b=>({id:b.id,name:b.name,detail:courses.find(c=>c.id===b.courseId)?.title||'',count:count(a=>a.batchId===b.id),secondary:'One job role · one course',icon:GraduationCap,open:()=>navigateLevel(project!.id,center.id,b.id)})):project?centers.filter(c=>c.projectId===project.id).map(c=>({id:c.id,name:c.name,detail:'Training center',count:count(a=>a.centerId===c.id),secondary:`${batches.filter(b=>b.centerId===c.id).length} batches`,icon:Building2,open:()=>navigateLevel(project.id,c.id)})):projects.map(p=>({id:p.id,name:p.name,detail:p.segment,count:count(a=>a.projectId===p.id),secondary:`${centers.filter(c=>c.projectId===p.id).length} centers`,icon:FolderOpen,open:()=>navigateLevel(p.id)}));
 const visibleOptions=options.filter(o=>`${o.name} ${o.detail}`.toLowerCase().includes(query.toLowerCase()));
 return <div><PageHeader eyebrow="STUDENT ADMINISTRATION" title="Trainees & assignments" description="Select a project, center, and batch to manage students and their login credentials." actions={<Button onClick={() => open('new')}><UserPlus /> Add trainee</Button>} />
 <nav className="trainee-breadcrumb" aria-label="Training hierarchy"><button onClick={()=>navigateLevel()}>All projects</button>{project&&<><ChevronRight size={14}/><button onClick={()=>navigateLevel(project.id)}>{project.name}</button></>}{center&&<><ChevronRight size={14}/><button onClick={()=>navigateLevel(project!.id,center.id)}>{center.name}</button></>}{batch&&<><ChevronRight size={14}/><span aria-current="page">{batch.name}</span></>}{unassigned&&<><ChevronRight size={14}/><span aria-current="page">Unassigned trainees</span></>}</nav>
 <div className="trainee-level-heading"><div><h2>{unassigned?'Unassigned trainees':batch?batch.name:center?'Select a batch':project?'Select a training center':'Your projects'}</h2><p>{batch?courses.find(c=>c.id===batch.courseId)?.title:unassigned?'Assign a project, center, and batch to complete onboarding.':'Open a card to see the next level of training.'}</p></div>{!project&&!unassigned&&<Button variant="secondary" onClick={()=>{setQuery('');setParams({view:'unassigned'})}}>Unassigned <Badge>{trainees.filter(t=>!training[t.id]).length}</Badge></Button>}</div>
 <div className="table-tools"><label><Search/><input aria-label={batch||unassigned?'Search students':'Search training groups'} placeholder={batch||unassigned?'Search student name or email':'Search this level'} value={query} onChange={e=>setQuery(e.target.value)}/></label><Badge>{batch||unassigned?`${rows.length} students`:`${visibleOptions.length} ${center?'batches':project?'centers':'projects'}`}</Badge></div>
 {batch||unassigned?<div className="trainee-table-wrap"><table className="trainee-table"><caption className="visually-hidden">{batch?.name||'Unassigned'} student roster and credential management</caption><thead><tr><th scope="col">Student</th><th scope="col">Registered email</th><th scope="col">Student ID</th><th scope="col">Status</th><th scope="col">Credentials</th><th scope="col">Actions</th></tr></thead><tbody>{rows.map(user=><tr key={user.id}><td><div className="trainee-name"><Avatar name={user.name}/><b>{user.name}</b></div></td><td>{user.email}</td><td><span className="student-login-id" title={credentials[user.id]?.loginId}>{credentials[user.id]?.loginId||'Not generated'}</span></td><td><Badge tone={user.status==='Active'?'success':'warning'}>{user.status}</Badge></td><td><Badge tone={credentials[user.id]?'violet':'neutral'}>{credentials[user.id]?'Generated · not sent':'Not generated'}</Badge></td><td><div className="trainee-row-actions"><Button variant="secondary" onClick={()=>open(user)}>{training[user.id]?'Edit':'Assign training'}</Button><Button variant="ghost" onClick={()=>setCredentialView({id:user.id})}><KeyRound/> Credentials</Button></div></td></tr>)}</tbody></table>{!rows.length&&<EmptyState icon={<Users/>} title={query?'No matching students':'No students in this batch'} body={query?'Try a different name or email.':'Add a trainee to start building this batch.'}/>}</div>:<div className="training-group-grid">{visibleOptions.map(o=><button key={o.id} className="training-group-card" onClick={o.open}><header><span className="training-group-icon"><o.icon/></span><Badge>{o.detail}</Badge></header><h3>{o.name}</h3><p>{o.secondary}</p><footer><span><Users size={15}/><b>{o.count}</b> trainees</span><ArrowRight size={18}/></footer></button>)}{!visibleOptions.length&&<Card><EmptyState icon={<Search/>} title="No matching groups" body="Try a different search."/></Card>}</div>}
 {credentialView&&<StudentCredentials studentId={credentialView.id} initialPassword={credentialView.password} onClose={()=>setCredentialView(null)}/>}
 {editing && <dialog ref={dialog} className="assignment-editor" aria-labelledby="assignment-title" onCancel={e => {if(saving)e.preventDefault();else setEditing(null)}}><Card><form onSubmit={async e => {
  e.preventDefault();
  if(saving)return;
  setSaving(true);setError('');
  const user: User = { ...(editing === 'new' ? { id: crypto.randomUUID(), role: 'student' as const, status: 'Active' as const, progress: 0, lastActive: 'Just added', avatar: name.slice(0,1) } : editing), name: name.trim(), email: email.trim().toLowerCase(), department: selectedCourse?.category || '' };
  if (!saveTrainee(user, assignment)) { setError('Check the assignment and use a unique student email.');setSaving(false); return; }
  navigateLevel(assignment.projectId,assignment.centerId,assignment.batchId);
  try {const password=editing==='new'?await generateStudentCredential(user.id):undefined;setEditing(null);if(password)setCredentialView({id:user.id,password});}
  catch {setError('Trainee saved, but credential generation failed. Open Credentials from the student table to retry.');setEditing(user);}
  finally {setSaving(false);}
 }}><header><Badge tone="violet">ADMIN ASSIGNMENT</Badge><h2 id="assignment-title">{editing === 'new' ? 'Add trainee' : `Training for ${editing.name}`}</h2><p>Enter the student’s registered email and training placement. New trainees receive a generated student ID and password. Email sending requires a connected delivery service.</p></header>
 <div className="assignment-fields"><label>Full name<input autoFocus required value={name} onChange={e => setName(e.target.value)} /></label><label>Registered email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
 <label>Project<select required value={assignment.projectId} onChange={e => setAssignment({ ...blankAssignment, projectId: e.target.value })}><option value="">Select project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
 <label>Training center<select required disabled={!assignment.projectId} value={assignment.centerId} onChange={e => setAssignment({ ...assignment, centerId: e.target.value, batchId: '', courseId: '' })}><option value="">Select center</option>{centers.filter(c => c.projectId === assignment.projectId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
 <label>Batch<select required disabled={!assignment.centerId} value={assignment.batchId} onChange={e => { const batch = batches.find(b => b.id === e.target.value); setAssignment({ ...assignment, batchId: batch?.id || '', courseId: batch?.courseId || '' }); }}><option value="">Select batch</option>{batches.filter(b => b.centerId === assignment.centerId).map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
 <label>Job role / course<input readOnly value={selectedCourse ? `${selectedCourse.jobRole} — ${selectedCourse.title}` : ''} placeholder="Set automatically from the batch" /></label></div>
 {error && <p role="alert">{error}</p>}<footer><Button type="button" variant="secondary" disabled={saving} onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" disabled={saving || !assignment.courseId || !name.trim() || !email.trim()}>{saving?'Saving…':editing==='new'?'Add trainee & generate credentials':'Save assignment'}</Button></footer></form></Card></dialog>}
 </div>;
}
