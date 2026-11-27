import { useMemo, useState } from 'react';
import { CalendarDays, Check, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { type Task, type Priority, PRIORITY_LABEL, PRIORITY_RANK, formatDate, isOverdue } from '../types';

interface Props {
  tasks: Task[];
  onNew: () => void;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}

export default function TaskList({ tasks, onNew, onToggle, onEdit, onDelete }: Props) {
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sort, setSort] = useState('due');
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const list = tasks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      if (status === 'pending') return t.status !== 'COMPLETED';
      if (status === 'completed') return t.status === 'COMPLETED';
      if (status === 'overdue') return isOverdue(t);
      return true;
    });
    return list.sort((a, b) => {
      if (sort === 'priority') return PRIORITY_RANK[(a.priority ?? 'MEDIUM') as Priority] - PRIORITY_RANK[(b.priority ?? 'MEDIUM') as Priority];
      if (sort === 'recent') return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
      return (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999');
    });
  }, [tasks, status, priority, sort, q]);

  return (
    <>
      <div className="filters">
        <div className="search"><Search size={16} /><input placeholder="Pesquisar pelo título" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Pesquisar tarefas" /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status">
          <option value="all">Todos os status</option><option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option><option value="overdue">Atrasadas</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filtrar por prioridade">
          <option value="all">Todas as prioridades</option><option value="HIGH">Alta</option>
          <option value="MEDIUM">Média</option><option value="LOW">Baixa</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar">
          <option value="due">Ordenar por prazo</option><option value="priority">Ordenar por prioridade</option>
          <option value="recent">Mais recentes</option>
        </select>
      </div>

      {shown.length === 0 ? (
        <div className="panel empty">
          <p>{tasks.length ? 'Nenhuma tarefa corresponde aos filtros.' : 'Você ainda não tem tarefas. Crie a primeira para começar.'}</p>
          {!tasks.length && <button className="btn primary" onClick={onNew}><Plus size={16} /> Criar tarefa</button>}
        </div>
      ) : (
        <ul className="tasks">
          {shown.map((t) => {
            const done = t.status === 'COMPLETED';
            const late = isOverdue(t);
            const p = (t.priority ?? 'MEDIUM') as Priority;
            return (
              <li key={t.id} className={`task ${done ? 'done' : ''} ${late ? 'late' : ''}`}>
                <button className="check" onClick={() => onToggle(t)} aria-label={done ? 'Marcar como pendente' : 'Marcar como concluída'}>
                  {done && <Check size={14} />}
                </button>
                <div className="task-body">
                  <div className="task-title">{t.title}</div>
                  {t.description && <div className="task-desc">{t.description}</div>}
                  <div className="chips">
                    <span className={`chip p-${p}`}>{PRIORITY_LABEL[p]}</span>
                    {t.category && <span className="chip">{t.category}</span>}
                    <span className={`chip date ${late ? 'late' : ''}`}><CalendarDays size={12} /> {formatDate(t.dueDate)}{late ? ' · atrasada' : ''}</span>
                  </div>
                </div>
                <div className="row-actions">
                  <button className="icon-btn" onClick={() => onEdit(t)} aria-label="Editar"><Pencil size={16} /></button>
                  <button className="icon-btn danger" onClick={() => onDelete(t)} aria-label="Excluir"><Trash2 size={16} /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
