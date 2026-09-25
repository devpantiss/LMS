import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronDown, ClipboardCheck, Clock3, Lock, Play, Wrench } from 'lucide-react';
import { getCourseModules, getDailyAssessments } from '../../data/courseTraining';
import { Badge, Button, EmptyState, SectionTitle } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';

export function TrainingModules({ courseId, track }: { courseId: string; track: 'Theory' | 'Practicals' }) {
 const navigate = useNavigate();
 const completed = useAppStore(s => s.completedLessons);
 const list = getCourseModules(courseId).map(module => ({ ...module, lessons: module.lessons.filter(lesson => lesson.track === track && lesson.type !== 'Quiz') })).filter(module => module.lessons.length);
 return <section><SectionTitle title={`${track} modules`} subtitle={track === 'Theory' ? 'Build your knowledge with trainer-led lessons and reading material.' : 'Apply your learning through demonstrations and supervised workshop tasks.'} />
 {list.length ? <div className="curriculum">{list.map((module, index) => <details key={`${track}-${module.id}`} open={index === 0}><summary><span><b>{module.title}</b><small>{module.lessons.length} {module.lessons.length === 1 ? 'session' : 'sessions'} · {track}</small></span><ChevronDown /></summary>{module.lessons.map(lesson => <button className="curriculum-row training-session" key={lesson.id} disabled={lesson.locked} onClick={() => navigate(`/student/courses/${courseId}/learn/${lesson.id}`)}>
 {lesson.locked ? <Lock /> : lesson.complete || completed.includes(lesson.id) ? <CheckCircle2 /> : track === 'Practicals' ? <Wrench /> : lesson.type === 'Video' ? <Play /> : <BookOpen />}<span className="training-session-copy"><b>{lesson.title}</b><small>{lesson.locked ? 'Locked · complete earlier sessions' : lesson.complete || completed.includes(lesson.id) ? 'Completed' : lesson.type === 'Assignment' ? 'Supervised workshop' : lesson.type === 'Video' ? 'Video lesson' : 'Reading material'}</small></span><span>{lesson.duration}</span>
 </button>)}</details>)}</div> : <EmptyState icon={track === 'Theory' ? <BookOpen /> : <Wrench />} title={`No ${track.toLowerCase()} modules yet`} body="Your trainer will publish the modules for this course here." />}
 </section>;
}

export function DailyAssessments({ courseId }: { courseId: string }) {
 const [filter, setFilter] = useState('All');
 const submitted = useAppStore(s => s.submittedAssignments);
 const navigate = useNavigate();
 const assessments = getDailyAssessments(courseId);
 const visible = assessments.filter(a => filter === 'All' || a.type === filter);
 const days = [...new Set(visible.map(a => a.day))];
 return <section><SectionTitle title="Daily assessments" subtitle="Track your theory knowledge checks and practical evaluations for each training day." />
 <div className="assessment-filters" aria-label="Filter daily assessments">{['All', 'Theory', 'Practical'].map(type => <button key={type} aria-pressed={filter === type} className={filter === type ? 'active' : ''} onClick={() => setFilter(type)}>{type === 'All' ? 'All assessments' : type === 'Practical' ? 'Practicals' : type}<span>{assessments.filter(a => type === 'All' || a.type === type).length}</span></button>)}</div>
 {days.length ? <div className="daily-assessments">{days.map(day => <section className="assessment-day" key={day}><header><span className="training-day-number">{String(day).padStart(2, '0')}</span><div><h3>Training day {day}</h3><p>{visible.find(a => a.day === day)?.module}</p></div></header><div className="daily-assessment-grid">{visible.filter(a => a.day === day).map(a => {
 const status = submitted.includes(a.id) ? 'Submitted' : a.status;
 return <article className="daily-assessment-card" key={a.id}><div className="daily-assessment-meta"><span>{a.type === 'Theory' ? <BookOpen /> : <Wrench />}{a.type}</span><Badge tone={status === 'Graded' || status === 'Submitted' ? 'success' : status === 'Due today' ? 'warning' : 'neutral'}>{status}</Badge></div><h4>{a.title}</h4><p><Clock3 size={14} />{a.duration}<span>·</span>{a.score !== undefined ? `${a.score} / 100 points` : '100 points'}</p><details><summary>{a.status === 'Graded' ? 'View result' : 'Assessment details'}<ChevronDown size={15} /></summary><p>{a.instructions}</p>{a.score !== undefined && <Badge tone="success">Competent · {a.score}%</Badge>}</details>{a.route ? <Button variant={status === 'Submitted' ? 'secondary' : 'primary'} onClick={() => navigate(a.route!)}>{status === 'Submitted' ? 'View submission' : a.type === 'Theory' ? 'Start theory assessment' : 'Open practical assessment'}</Button> : a.status === 'Scheduled' ? <Button variant="secondary" disabled><Lock size={14} /> Awaiting trainer release</Button> : null}</article>;
 })}</div></section>)}</div> : <EmptyState icon={<ClipboardCheck />} title="No daily assessments yet" body="Your trainer will publish theory and practical assessments here." />}
 </section>;
}
