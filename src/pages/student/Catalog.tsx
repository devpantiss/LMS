import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { courses } from '../../data/mock';
import { projects, centers, batches } from '../../data/training';
import { useAppStore } from '../../store/useAppStore';
import { Card, CourseCard, EmptyState, PageHeader, Badge } from '../../components/ui';

export function Catalog() {const currentStudentId=useAppStore(s=>s.currentStudentId);
 const navigate = useNavigate();
 const assignment = useAppStore(s => s.training[currentStudentId]);
 const course = courses.find(c => c.id === assignment?.courseId);
 return <div><PageHeader eyebrow="MY TRAINING" title="Your assigned training" description="Your administrator manages your project, center, batch, and job role." />
 {course && assignment ? <><Card className="training-placement"><Badge tone="violet">Assigned by admin</Badge><dl>
 {[['Project', projects.find(p => p.id === assignment.projectId)?.name], ['Training center', centers.find(c => c.id === assignment.centerId)?.name], ['Batch', batches.find(b => b.id === assignment.batchId)?.name], ['Job role', course.jobRole]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
 </dl></Card><div className="assigned-course"><CourseCard course={course} onOpen={() => navigate(`/student/courses/${course.id}`)} /></div></> : <Card><EmptyState icon={<BookOpen />} title="Your training is being arranged" body="Your administrator will assign your project, center, batch, and course. Contact your center for an update." /></Card>}
 </div>;
}
