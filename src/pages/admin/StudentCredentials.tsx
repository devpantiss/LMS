import { useEffect, useRef, useState } from 'react';
import { Copy, Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge, Button, Card } from '../../components/ui';

export function StudentCredentials({ studentId, initialPassword, onClose }: { studentId:string; initialPassword?:string; onClose:()=>void }) {
 const { trainees, credentials, generateStudentCredential } = useAppStore();
 const user = trainees.find(t=>t.id===studentId)!;
 const credential = credentials[studentId];
 const [password,setPassword] = useState(initialPassword || '');
 const [visible,setVisible] = useState(false);
 const [busy,setBusy] = useState(false);
 const [message,setMessage] = useState('');
 const dialog = useRef<HTMLDialogElement>(null);
 useEffect(()=>{dialog.current?.showModal()},[]);
 const generate = async () => {setBusy(true);setMessage('');try{setPassword(await generateStudentCredential(studentId));setVisible(false);setMessage('New credentials generated. The previous password no longer works.')}catch{setMessage('Unable to generate credentials. Please try again.')}finally{setBusy(false)}};
 return <dialog ref={dialog} className="assignment-editor credential-editor" aria-labelledby="credential-title" onCancel={e=>{if(busy)e.preventDefault();else onClose()}}><Card><header><Badge tone="violet"><KeyRound size={13}/> STUDENT ACCESS</Badge><h2 id="credential-title">Credentials for {user.name}</h2><p>Manage this trainee’s sign-in details and registered email.</p></header><dl className="credential-details"><div><dt>Registered email</dt><dd>{user.email}</dd></div><div><dt>Student ID</dt><dd>{credential?.loginId || 'Not generated'}</dd></div><div><dt>Email delivery</dt><dd><Badge tone="warning">Not sent</Badge></dd></div></dl>
 {password && <div className="credential-password"><label htmlFor="generated-password">Generated password</label><div><input id="generated-password" type={visible?'text':'password'} value={password} readOnly autoComplete="off"/><Button variant="ghost" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(!visible)}>{visible?<EyeOff/>:<Eye/>}</Button></div><p>Copy it before closing. The original password cannot be retrieved later.</p><Button variant="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(`Student ID: ${credential.loginId}\nEmail: ${user.email}\nPassword: ${password}`);setMessage('Credentials copied.')}catch{setMessage('Clipboard access is unavailable. Select and copy the details manually.')}}}><Copy/> Copy credentials</Button></div>}
 <div className="credential-delivery-note"><Mail size={18}/><p>Email delivery is not connected. These credentials work in this browser’s local prototype only. A backend and email provider are required to send working access details to students.</p></div>
 {message && <p role="status" className="credential-message">{message}</p>}
 <footer><Button variant="ghost" disabled={busy} onClick={onClose}>Close</Button><Button variant="secondary" disabled={busy} onClick={generate}><KeyRound/>{busy?'Generating…':credential?'Reset password':'Generate credentials'}</Button><Button disabled={busy} onClick={async()=>{if(!credential)await generate();setMessage('Not sent: connect a backend and email provider before sending credentials.')}}><Mail/> Send credentials</Button></footer></Card></dialog>;
}
