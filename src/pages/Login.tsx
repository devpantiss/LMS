import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, Eye, EyeOff, GraduationCap, LockKeyhole, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { demoAccounts, type DemoAccount } from '../data/auth';
import { useAppStore } from '../store/useAppStore';

const roleIcons = { student: BookOpen, teacher: GraduationCap, admin: ShieldCheck };

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, role, login, theme } = useAppStore();
  const [email, setEmail] = useState('student@pantiss.com');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  if (isAuthenticated) return <Navigate to={`/${role}`} replace />;

  const chooseAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    window.setTimeout(() => {
      const matchedRole = login(email, password);
      setSubmitting(false);
      if (matchedRole) navigate(`/${matchedRole}`, { replace: true });
      else setError('Those credentials don’t match a demo account. Choose one below to continue.');
    }, 350);
  };

  return <main className="login-page">
    <section className="login-story" aria-label="Pantiss learning platform">
      <div className="login-brand"><span><Sparkles size={20}/></span><div><strong>Pantiss</strong><small>Skill Universe</small></div></div>
      <div className="login-story-copy">
        <span className="login-kicker"><i/> Skills that power industry</span>
        <h1>Train for work.<br/><em>Build a future.</em></h1>
        <p>One institute platform for course training, workshop practice, equipment operations, safety, assessment, and placement readiness.</p>
        <div className="login-proof">
          <div><span><Users size={18}/></span><strong>1,580</strong><small>Active trainees</small></div>
          <div><span><BookOpen size={18}/></span><strong>24</strong><small>courses</small></div>
          <div><span><Check size={18}/></span><strong>86%</strong><small>Placement ready</small></div>
        </div>
      </div>
      <div className="login-orbit orbit-one"/><div className="login-orbit orbit-two"/><div className="login-glow"/>
      <footer>© 2026 Pantiss Institute of Industrial Skills</footer>
    </section>

    <section className="login-panel">
      <div className="login-form-wrap">
        <header><span className="login-mobile-mark"><Sparkles size={19}/></span><div className="eyebrow">WELCOME BACK</div><h2>Sign in to your training workspace</h2><p>Use a trainee, trainer, or institute admin demo account.</p></header>
        <form onSubmit={submit} noValidate>
          <label htmlFor="login-email">Email address</label>
          <div className="login-input"><span>@</span><input id="login-email" type="email" value={email} onChange={e=>{setEmail(e.target.value);setError('')}} autoComplete="username" placeholder="you@pantiss.com" required/></div>
          <label htmlFor="login-password">Password</label>
          <div className="login-input"><LockKeyhole size={17}/><input id="login-password" type={showPassword?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setError('')}} autoComplete="current-password" placeholder="Enter your password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff/>:<Eye/>}</button></div>
          {error&&<div className="login-error" role="alert">{error}</div>}
          <button className="login-submit" type="submit" disabled={!email||!password||submitting}><span>{submitting?'Opening workspace…':'Sign in'}</span><ArrowRight size={18}/></button>
        </form>
        <div className="demo-divider"><span>Demo access</span></div>
        <div className="demo-accounts">{demoAccounts.map(account=>{const Icon=roleIcons[account.role];const active=email===account.email;return <button type="button" className={active?'active':''} key={account.role} onClick={()=>chooseAccount(account)} aria-pressed={active}><span className={`demo-icon demo-${account.role}`}><Icon/></span><span><b>{account.role[0].toUpperCase()+account.role.slice(1)}</b><small>{account.email}</small></span><code>{account.password}</code><ArrowRight className="demo-arrow"/></button>})}</div>
        <p className="login-note"><ShieldCheck size={14}/> Demo only. No personal data is stored or transmitted.</p>
      </div>
    </section>
  </main>;
}
