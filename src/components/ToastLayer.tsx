import { CheckCircle2, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
export function ToastLayer(){const {toasts,dismissToast}=useAppStore();return <div className="toast-layer" aria-live="polite">{toasts.map(t=><div className="toast" key={t.id}><CheckCircle2 size={19}/><span>{t.message}</span><button onClick={()=>dismissToast(t.id)} aria-label="Dismiss"><X size={16}/></button></div>)}</div>}
