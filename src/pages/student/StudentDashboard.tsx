import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Clock3, Lock, Play, Target, Wrench } from 'lucide-react';
import { courses } from '../../data/mock';
import { batches, centers, projects } from '../../data/training';
import { getCourseModules, getDailyAssessments } from '../../data/courseTraining';
import { useAppStore } from '../../store/useAppStore';
import { Badge, Button, Card, Progress, SectionTitle, StatCard } from '../../components/ui';
import { Catalog } from './Catalog';
import type { Module } from '../../types';
import hero from '../../assets/industrial-skills-hero.png';

type Track = 'Theory' | 'Practicals';
function NextModules({ track, modules, completed, courseId }: { track: Track; modules: Module[]; completed: string[]; courseId: string }) {
 const navigate = useNavigate();
 const Icon = track === 'Theory' ? BookOpen : Wrench;
 const sessions = modules.flatMap(module => module.lessons.filter(l => l.track === track && l.type !== 'Quiz').map(lesson => ({ ...lesson, module: module.title })));
 const done = (lesson: typeof sessions[number]) => lesson.complete || completed.includes(lesson.id);
 const pending = sessions.filter(lesson => !done(lesson));
 const next = pending.find(lesson => !lesson.locked) || pending[0];
 const count = sessions.filter(done).length;
 return <Card className="dashboard-track"><header><span className="dashboard-track-icon"><Icon /></span><div><small>YOUR NEXT MODULES</small><h2>{track}</h2></div><Badge tone={pending.length ? 'violet' : 'success'}>{count}/{sessions.length} complete</Badge></header>
 <Progress value={sessions.length ? Math.round(count / sessions.length * 100) : 0} small />
 {next ? <div className="dashboard-next-session"><span>{next.module}</span><h3>{next.title}</h3><p><Clock3 size={14} />{next.duration}<span>·</span>{next.locked ? 'Awaiting unlock' : 'Ready to start'}</p><Button disabled={next.locked} onClick={() => navigate(`/student/courses/${courseId}/learn/${next.id}`)}>{next.locked ? <Lock size={16} /> : <Play size={16} />}{next.locked ? 'Complete earlier sessions first' : `Continue ${track.toLowerCase()}`}</Button></div> : <div className="dashboard-next-session"><span>{sessions.length ? 'All published sessions completed' : 'Your training plan'}</span><h3>{sessions.length ? `${track} up to date` : `${track} modules coming soon`}</h3><p>{sessions.length ? 'Review your learning while your trainer prepares the next module.' : 'Your trainer will publish your next modules here.'}</p><Button variant="secondary" onClick={() => navigate(`/student/courses/${courseId}?tab=${track}`)}>{sessions.length ? 'Review modules' : 'View training plan'}<ArrowRight size={16} /></Button></div>}
 {pending.filter(l => l.id !== next?.id).slice(0,2).map(lesson => <div className="dashboard-queued-session" key={lesson.id}>{lesson.locked ? <Lock /> : <Icon />}<div><b>{lesson.title}</b><small>{lesson.module} · {lesson.duration}</small></div><Badge>{lesson.locked ? 'Locked' : 'Up next'}</Badge></div>)}
 <button className="dashboard-card-link" onClick={() => navigate(`/student/courses/${courseId}?tab=${track}`)}>View all {track.toLowerCase()} modules<ArrowRight size={15} /></button>
 </Card>;
}

export function StudentDashboard() {const currentStudentId=useAppStore(s=>s.currentStudentId);
 const navigate = useNavigate();
 const { hash } = useLocation();
 const { training, trainees, completedLessons, submittedAssignments } = useAppStore();
 const assignment = training[currentStudentId];
 const course = courses.find(c => c.id === assignment?.courseId);
 const trainee = trainees.find(t => t.id === currentStudentId);
 if (hash === '#practicals') return <Navigate to="/student/assignments" replace />;
 if (!course || !assignment) return <Catalog />;
 const modules = getCourseModules(course.id);
 const sessions = modules.flatMap(m => m.lessons).filter(l => l.type !== 'Quiz');
 const complete = sessions.filter(l => l.complete || completedLessons.includes(l.id));
 const next = sessions.find(l => !l.complete && !l.locked && !completedLessons.includes(l.id));
 const assessments = getDailyAssessments(course.id);
 const due = assessments.filter(a => a.status === 'Due today' && !submittedAssignments.includes(a.id));
 const graded = assessments.filter(a => a.score !== undefined);
 const average = graded.length ? Math.round(graded.reduce((sum,a) => sum + a.score!,0) / graded.length) : null;
 const minutes = complete.reduce((sum,l) => sum + parseInt(l.duration),0);
 const progress = sessions.length ? Math.round(complete.length / sessions.length * 100) : 0;
 return <div className="dashboard-page training-dashboard"><div className="welcome-line"><div><span className="eyebrow">YOUR TRAINING WORKSPACE</span><h1>Welcome, {trainee?.name || 'trainee'}</h1><p>{due.length ? `${due.length} daily assessments need your attention. Here’s what’s next in your training.` : 'Keep building your skills, one session at a time.'}</p></div><Badge tone="violet">{course.jobRole}</Badge></div>
 <section className="continue-hero"><img src={hero} alt="Industrial skills training workshop" /><div className="hero-shade" /><div className="continue-copy"><Badge tone="glass">{course.segment} · YOUR ASSIGNED COURSE</Badge><p>{course.title}</p><h2>{next?.title || 'Your next step starts here'}</h2><span>{next ? `${next.track} · ${next.duration}` : 'View your modules and training plan'}</span><div className="hero-progress"><Progress value={progress} /><b>{progress}%</b></div><small className="dashboard-hero-caption">{complete.length} of {sessions.length} published sessions complete</small><Button onClick={() => navigate(next ? `/student/courses/${course.id}/learn/${next.id}` : `/student/courses/${course.id}`)}><Play size={17} />{next ? 'Continue training' : 'View course'}</Button></div></section>
 <div className="dashboard-metrics"><StatCard label="Sessions completed" value={`${complete.length}/${sessions.length}`} detail="Across theory and practicals" icon={<CheckCircle2 />} /><StatCard label="Learning time completed" value={`${Math.floor(minutes/60)}h ${minutes%60}m`} detail="Duration of completed sessions" icon={<Clock3 />} /><StatCard label="Assessments due" value={String(due.length)} detail={`${due.filter(a=>a.type==='Theory').length} theory · ${due.filter(a=>a.type==='Practical').length} practical`} icon={<ClipboardCheck />} /><StatCard label="Assessment average" value={average === null ? '—' : `${average}%`} detail={graded.length ? `Across ${graded.length} graded assessments` : 'No graded assessments yet'} icon={<Target />} /></div>
 <SectionTitle title="Keep your training moving" subtitle="Your next sessions in both learning tracks" />
 <div className="dashboard-tracks">{(['Theory','Practicals'] as const).map(track => <div key={track} id={track === 'Practicals' ? 'practicals' : undefined} tabIndex={track === 'Practicals' ? -1 : undefined}><NextModules track={track} modules={modules} completed={completedLessons} courseId={course.id} /></div>)}</div>
 <div className="dashboard-bottom"><Card className="dashboard-assessments"><SectionTitle title="Theory assessments" subtitle="Daily knowledge checks for your assigned course" action={<Button variant="ghost" onClick={() => navigate(`/student/courses/${course.id}?tab=Assessments`)}>View all<ArrowRight size={15} /></Button>} />
 {assessments.filter(a => a.type === 'Theory' && a.status === 'Due today').map(a => { const submitted = submittedAssignments.includes(a.id); return <button className="dashboard-assessment-row" key={a.id} onClick={() => navigate(a.route || `/student/courses/${course.id}?tab=Assessments`)}><span className="dashboard-track-icon">{a.type === 'Theory' ? <BookOpen /> : <Wrench />}</span><span><b>{a.title}</b><small>Day {a.day} · {a.type} · {a.duration}</small></span><Badge tone={submitted ? 'success' : 'warning'}>{submitted ? 'Submitted' : 'Due today'}</Badge><ArrowRight size={16} /></button>; })}
 {!assessments.some(a=>a.type==='Theory' && a.status==='Due today') && <p>Your trainer will schedule theory assessments here.</p>}
 </Card><Card className="dashboard-placement"><SectionTitle title="Your training placement" subtitle="Assigned by your administrator" /><dl>{[['Project',projects.find(p=>p.id===assignment.projectId)?.name],['Center',centers.find(c=>c.id===assignment.centerId)?.name],['Batch',batches.find(b=>b.id===assignment.batchId)?.name],['Lead trainer',course.instructor]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value || 'Not assigned'}</dd></div>)}</dl><button className="dashboard-card-link" onClick={() => navigate('/student/learning')}>View training details<ArrowRight size={15} /></button></Card></div>
 </div>;
}
