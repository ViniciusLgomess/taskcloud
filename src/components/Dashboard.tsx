import { AlertTriangle, CheckCircle2, Clock, ListTodo, Plus } from 'lucide-react';
import { type Task, formatDate, isOverdue, PRIORITY_LABEL, type Priority } from '../types';

interface Props { tasks: Task[]; onNew: () => void; onSeeAll: () => void }

export default function Dashboard({ tasks, onNew, onSeeAll }: Props) {
  const done = tasks.filter((t) => t.status === 'COMPLETED').length;
  const overdue = tasks.filter(isOverdue).length;
  const pending = tasks.length - done;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const next = tasks
    .filter((t) => t.status !== 'COMPLETED')
    .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'))
    .slice(0, 5);

  const cards = [
    { label: 'Total de tarefas', value: tasks.length, Icon: ListTodo, cls: 'c-total' },
    { label: 'Pendentes', value: pending, Icon: Clock, cls: 'c-pending' },
    { label: 'Concluídas', value: done, Icon: CheckCircle2, cls: 'c-done' },
    { label: 'Atrasadas', value: overdue, Icon: AlertTriangle, cls: 'c-late' },
  ];

  return (
    <>
      <section className="stats">
        {cards.map(({ label, value, Icon, cls }) => (
          <div key={label} className={`stat ${cls}`}>
            <div className="stat-icon"><Icon size={20} /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head"><h3>Progresso geral</h3><span>{pct}%</span></div>
        <div className="bar"><div style={{ width: `${pct}%` }} /></div>
      </section>

      <section className="panel">
        <div className="panel-head"><h3>Próximas tarefas</h3><button className="link" onClick={onSeeAll}>Ver todas</button></div>
        {next.length === 0 ? (
          <div className="empty">
            <p>{tasks.length ? 'Tudo concluído por aqui. Bom trabalho!' : 'Você ainda não tem tarefas. Crie a primeira para começar.'}</p>
            {!tasks.length && <button className="btn primary" onClick={onNew}><Plus size={16} /> Criar tarefa</button>}
          </div>
        ) : (
          <ul className="mini-list">
            {next.map((t) => (
              <li key={t.id}>
                <span className={`dot p-${t.priority ?? 'MEDIUM'}`} title={PRIORITY_LABEL[(t.priority ?? 'MEDIUM') as Priority]} />
                <span className="mini-title">{t.title}</span>
                <span className={`mini-date ${isOverdue(t) ? 'late' : ''}`}>{formatDate(t.dueDate)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
