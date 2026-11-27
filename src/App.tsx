import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { CheckCircle2, LayoutDashboard, ListChecks, LogOut, Plus, XCircle } from 'lucide-react';
import type { Schema } from '../amplify/data/resource';
import type { Task, TaskForm } from './types';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';

const client = generateClient<Schema>();
type View = 'dashboard' | 'tasks';
interface Toast { id: number; kind: 'ok' | 'err'; text: string }

export default function App({ signOut, email }: { signOut: () => void; email: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');
  const [modal, setModal] = useState<{ task: Task | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  // Lê do DynamoDB (via AppSync) e recebe atualizações em tempo real
  useEffect(() => {
    const sub = client.models.Task.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        setTasks([...items]);
        if (isSynced) setLoading(false);
      },
      error: () => {
        setLoading(false);
        notify('err', 'Não foi possível carregar as tarefas. Verifique sua conexão.');
      },
    });
    return () => sub.unsubscribe();
  }, []);

  async function run(action: () => Promise<{ errors?: unknown[] }>, okMsg: string, errMsg: string) {
    try {
      const res = await action();
      if (res.errors?.length) throw new Error('graphql');
      notify('ok', okMsg);
      return true;
    } catch {
      notify('err', errMsg);
      return false;
    }
  }

  async function save(v: TaskForm) {
    setSaving(true);
    const body = {
      title: v.title.trim(),
      description: v.description.trim() || null,
      dueDate: v.dueDate || null,
      priority: v.priority,
      category: v.category,
    };
    const editing = modal?.task;
    const ok = editing
      ? await run(() => client.models.Task.update({ id: editing.id, ...body }), 'Tarefa atualizada.', 'Não foi possível atualizar a tarefa.')
      : await run(() => client.models.Task.create({ ...body, status: 'PENDING' }), 'Tarefa criada.', 'Não foi possível criar a tarefa.');
    setSaving(false);
    if (ok) setModal(null);
  }

  const toggle = (t: Task) =>
    run(
      () => client.models.Task.update({ id: t.id, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }),
      t.status === 'COMPLETED' ? 'Tarefa reaberta.' : 'Tarefa concluída.',
      'Não foi possível alterar o status.',
    );

  async function confirmDelete() {
    if (!toDelete) return;
    await run(() => client.models.Task.delete({ id: toDelete.id }), 'Tarefa excluída.', 'Não foi possível excluir a tarefa.');
    setToDelete(null);
  }

  const nav = (v: View, label: string, Icon: typeof ListChecks) => (
    <button className={`nav-item ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
      <Icon size={18} /> <span>{label}</span>
    </button>
  );

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="logo-mark sm">✓</span> TaskCloud</div>
        <nav>
          {nav('dashboard', 'Painel', LayoutDashboard)}
          {nav('tasks', 'Minhas tarefas', ListChecks)}
        </nav>
        <div className="side-foot">
          <div className="user" title={email}>{email}</div>
          <button className="nav-item" onClick={signOut}><LogOut size={18} /> <span>Sair</span></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h2>{view === 'dashboard' ? 'Painel' : 'Minhas tarefas'}</h2>
          <button className="btn primary" onClick={() => setModal({ task: null })}><Plus size={16} /> Nova tarefa</button>
        </header>

        {loading ? (
          <div className="center"><div className="spinner" aria-label="Carregando" /></div>
        ) : view === 'dashboard' ? (
          <Dashboard tasks={tasks} onNew={() => setModal({ task: null })} onSeeAll={() => setView('tasks')} />
        ) : (
          <TaskList tasks={tasks} onNew={() => setModal({ task: null })} onToggle={toggle} onEdit={(t) => setModal({ task: t })} onDelete={setToDelete} />
        )}
      </main>

      {modal && <TaskModal task={modal.task} saving={saving} onClose={() => setModal(null)} onSave={save} />}

      {toDelete && (
        <div className="overlay" onClick={() => setToDelete(null)}>
          <div className="dialog small" role="alertdialog" onClick={(e) => e.stopPropagation()}>
            <h3>Excluir tarefa?</h3>
            <p>“{toDelete.title}” será removida permanentemente. Essa ação não pode ser desfeita.</p>
            <div className="actions">
              <button className="btn" onClick={() => setToDelete(null)}>Cancelar</button>
              <button className="btn danger" onClick={confirmDelete}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>
            {t.kind === 'ok' ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
