import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { courses } from '../../data/mock';
import { Button, CourseCard, EmptyState, PageHeader } from '../../components/ui';

export function Catalog({learning=false}:{learning?:boolean}) {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All');
  const [level,setLevel]=useState('All levels');
  const [sort,setSort]=useState<'Recommended'|'Rating'|'Shortest'>('Recommended');
  const [view,setView]=useState<'grid'|'list'>('grid');
  const [filtersOpen,setFiltersOpen]=useState(false);
  const navigate=useNavigate();
  const data=useMemo(()=>courses.filter(c=>(!learning||c.progress>0||['Assigned','Completed'].includes(c.status))&&(category==='All'||c.category===category)&&(level==='All levels'||c.level===level)&&`${c.title} ${c.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='Rating'?b.rating-a.rating:sort==='Shortest'?parseInt(a.duration)-parseInt(b.duration):0),[query,category,level,sort,learning]);
  const cycleSort=()=>setSort(sort==='Recommended'?'Rating':sort==='Rating'?'Shortest':'Recommended');
  return <div>
    <PageHeader eyebrow={learning?'MY TRAINING':'COURSE CATALOG'} title={learning?'My courses':'Explore courses'} description={learning?'Theory, workshop practice, and assessments in one place.':'Industry-aligned courses built for employable, safety-first skills.'} actions={!learning?<Button variant={filtersOpen?'secondary':'primary'} onClick={()=>setFiltersOpen(v=>!v)}>{filtersOpen?<X/>:<Filter/>} {filtersOpen?'Close filters':'Filters'}</Button>:undefined}/>
    {filtersOpen&&<div className="catalog-filter-panel card"><div><label>Level</label><select value={level} onChange={e=>setLevel(e.target.value)}><option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div><div><label>Minimum rating</label><span>4.0 and above</span></div><Button variant="ghost" onClick={()=>{setLevel('All levels');setCategory('All');setQuery('')}}>Reset filters</Button></div>}
    <div className="catalog-tools"><label className="search-field"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={learning?'Search my courses':'Search a trade or machine role'}/></label><div className="category-tabs">{['All','Electrical Trades','Fabrication','Heavy Equipment','Maintenance','Safety'].map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="view-toggle"><button aria-label="Grid view" className={view==='grid'?'active':''} onClick={()=>setView('grid')}><LayoutGrid/></button><button aria-label="List view" className={view==='list'?'active':''} onClick={()=>setView('list')}><List/></button></div></div>
    <div className="result-line"><span><b>{data.length}</b> courses</span><button onClick={cycleSort}><SlidersHorizontal/> {sort}</button></div>
    {data.length?<div className={`catalog-grid ${view==='list'?'list-view':''}`}>{data.map(c=><CourseCard course={c} key={c.id} compact={view==='list'} onOpen={()=>navigate(`/student/courses/${c.id}`)}/>)}</div>:<div className="card"><EmptyState icon={<Search/>} title="No matching courses" body="Try clearing a filter or searching for another skill."/></div>}
  </div>;
}
