import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, CheckCircle2, MessageCircle, Plus, Search, Sparkles } from 'lucide-react';
import { Badge, Button, Card, EmptyState, PageHeader, Progress, SectionTitle, StatusBadge } from '../components/ui';
import { assignments, courses, users } from '../data/mock';
import { useAppStore } from '../store/useAppStore';

function downloadCsv(filename:string, rows:string[][]) {
  const csv=rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  const link=document.createElement('a');link.href=url;link.download=filename;link.click();URL.revokeObjectURL(url);
}

export function GenericPage({title,role='teacher'}:{title:string;role?:string}) {
  const lower=title.toLowerCase();
  const navigate=useNavigate();
  const {addToast}=useAppStore();
  const [query,setQuery]=useState('');
  const [createOpen,setCreateOpen]=useState(false);
  const [newTitle,setNewTitle]=useState('');
  const [replying,setReplying]=useState<number|null>(null);
  const [reply,setReply]=useState('');
  const [events,setEvents]=useState([['Today','Motor control practical','4:00–5:00 PM'],['Tomorrow','Trade-test review block','10:30 AM'],['Monday','Electrician batch induction','2:00–3:00 PM'],['Wednesday','Workshop safety drill','11:00 AM']]);
  const visible=useMemo(()=>assignments.concat(assignments).slice(0,7).filter(a=>`${a.title} ${a.course}`.toLowerCase().includes(query.toLowerCase())),[query]);
  const saveCreate=()=>{if(!newTitle.trim())return;addToast(`${newTitle.trim()} created`,'success');setCreateOpen(false);setNewTitle('')};

  if(lower.includes('calendar')) return <div>
    <PageHeader eyebrow="SCHEDULE" title={title} description="Plan teaching moments, deadlines, and learner support." actions={<Button onClick={()=>setCreateOpen(true)}><Plus/> Add event</Button>}/>
    <Card className="agenda-card"><SectionTitle title="This week"/>{events.map((event,i)=><div className="agenda-row" key={`${event[1]}-${i}`}><span><b>{event[0]}</b></span><CalendarDays/><div><b>{event[1]}</b><small>{event[2]}</small></div><Button variant="secondary" onClick={()=>addToast(`${event[1]} opened`)}>Open</Button></div>)}</Card>
    {createOpen&&<div className="modal-backdrop"><Card className="modal"><header><div><Badge tone="violet">NEW EVENT</Badge><h2>Add to calendar</h2><p>Create a learning event for this week.</p></div><button onClick={()=>setCreateOpen(false)}>×</button></header><label>Event name<input value={newTitle} onChange={e=>setNewTitle(e.target.value)} autoFocus placeholder="e.g. Project office hours"/></label><label>Day<select><option>Today</option><option>Tomorrow</option><option>Monday</option></select></label><label>Time<input type="time" defaultValue="16:00"/></label><footer><Button variant="secondary" onClick={()=>setCreateOpen(false)}>Cancel</Button><Button onClick={()=>{if(newTitle.trim()){setEvents([...events,['Upcoming',newTitle,'4:00–5:00 PM']]);saveCreate()}}}>Add event</Button></footer></Card></div>}
  </div>;

  if(lower.includes('discussion')) {const topics=['Why does the overload relay trip?','Feedback on the welding practical','How do we test hydraulic pressure?','Trade-test explanation for question 4'];return <div>
    <PageHeader eyebrow="COMMUNITY" title={title} description="Resolve questions quickly and keep course conversations useful."/>
    <div className="discussion-admin-grid"><Card><SectionTitle title="Unresolved questions" subtitle="6 need an instructor response"/>{topics.map((topic,i)=><div className="moderation-row" key={topic}><MessageCircle/><div><b>{topic}</b><small>{courses[i].title} · {i+1}h ago</small></div><Badge tone={i<2?'danger':'warning'}>{i<2?'Priority':'New'}</Badge><button onClick={()=>setReplying(i)}>Reply →</button></div>)}</Card><Card><SectionTitle title="Discussion health"/><div className="big-metric">92<small>%</small></div><p>Questions answered within 24 hours</p><Progress value={92}/></Card></div>
    {replying!==null&&<div className="modal-backdrop"><Card className="modal"><header><div><Badge tone="violet">REPLY</Badge><h2>{topics[replying]}</h2></div><button onClick={()=>setReplying(null)}>×</button></header><label>Your response<textarea value={reply} onChange={e=>setReply(e.target.value)} autoFocus placeholder="Write a helpful response…"/></label><footer><Button variant="secondary" onClick={()=>setReplying(null)}>Cancel</Button><Button disabled={!reply.trim()} onClick={()=>{addToast('Reply posted','success');setReplying(null);setReply('')}}>Post reply</Button></footer></Card></div>}
  </div>}

  if(lower.includes('gradebook')) return <div>
    <PageHeader eyebrow="LEARNER OUTCOMES" title={title} description="Review progress and update grades without spreadsheet friction." actions={<Button data-handled="true" variant="secondary" onClick={()=>{downloadCsv('gradebook.csv',[['Student','Architecture','Quiz 4','Project','Total'],...users.slice(0,10).map((u,i)=>[u.name,String(32+i%4*2),String(78+i%5*3),i%5===0?'Missing':`${82+i%4*3}%`,`${76+i%6*3}%`])]);addToast('Gradebook exported','success')}}>Export CSV</Button>}/>
    <Card className="gradebook"><div className="grade-row grade-head"><span>Student</span><span>Architecture</span><span>Quiz 4</span><span>Project</span><span>Total</span></div>{users.slice(0,10).map((user,i)=><div className="grade-row" key={user.id}><b>{user.name}</b><input defaultValue={32+i%4*2} onBlur={()=>addToast(`Grade updated for ${user.name}`,'success')}/><input defaultValue={78+i%5*3} onBlur={()=>addToast(`Quiz score updated for ${user.name}`,'success')}/><span className={i%5===0?'missing':''}>{i%5===0?'Missing':`${82+i%4*3}%`}</span><b>{76+i%6*3}%</b></div>)}</Card>
  </div>;

  return <div>
    <PageHeader eyebrow={role==='teacher'?'TEACHING WORKSPACE':'LEARNING'} title={title} description={`Everything you need to manage ${title.toLowerCase()} with clarity.`} actions={<Button onClick={()=>setCreateOpen(true)}><Sparkles/> Create with AI</Button>}/>
    <div className="stat-grid"><Card className="mini-stat"><BarChart3/><b>{lower.includes('assignment')?'24':'12'}</b><span>Active</span></Card><Card className="mini-stat"><CheckCircle2/><b>84%</b><span>On track</span></Card><Card className="mini-stat"><MessageCircle/><b>6</b><span>Needs review</span></Card></div>
    <Card className="generic-list"><div className="table-tools"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}`}/></label></div>{visible.length?visible.map((item,i)=><div className="generic-row" key={`${item.id}-${i}`}><span className="generic-icon"><CheckCircle2/></span><div><b>{item.title}</b><small>{item.course} · Updated {i+1}h ago</small></div><StatusBadge status={i%3===0?'Review':'Active'}/><button onClick={()=>navigate(`/teacher/grading/${item.id}`)}>Open →</button></div>):<EmptyState icon={<Search/>} title="No results" body="Try another search term."/>}</Card>
    {createOpen&&<div className="modal-backdrop"><Card className="modal"><header><div><Badge tone="violet">AI DRAFT</Badge><h2>Create {title.slice(0,-1)}</h2><p>Start with a title; the workspace will prepare the structure.</p></div><button onClick={()=>setCreateOpen(false)}>×</button></header><label>Title<input value={newTitle} onChange={e=>setNewTitle(e.target.value)} autoFocus placeholder={`New ${title.toLowerCase().slice(0,-1)} title`}/></label><footer><Button variant="secondary" onClick={()=>setCreateOpen(false)}>Cancel</Button><Button disabled={!newTitle.trim()} onClick={saveCreate}>Create draft</Button></footer></Card></div>}
  </div>;
}
