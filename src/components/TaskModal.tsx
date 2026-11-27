import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, type Task, type TaskForm, type Priority } from '../types';

interface Props { task: Task | null; saving: boolean; onClose: () => void; onSave: (v: TaskForm) => void }

export default function TaskModal({ task, saving, onClose, onSave }: Props) {
  const [f, setF] = useState<TaskForm>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    dueDate: task?.dueDate ?? '',
    priority: (task?.priority ?? 'MEDIUM') as Priority,
    category: task?.category ?? CATEGORIES[0],
  });
  const set = <K extends keyof TaskForm>(k: K, v: TaskForm[K]) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (f.title.trim()) onSave(f); }}
      >
        <div className="dialog-head">
          <h3>{task ? 'Editar tarefa' : 'Nova tarefa'}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        </div>

        <label>Título
          <input autoFocus required maxLength={120} value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Ex.: Entregar trabalho de Cloud" />
        </label>
        <label>Descrição
          <textarea rows={3} maxLength={500} value={f.description} onChange={(e) => set('description', e.target.value)} placeholder="Detalhes opcionais" />
        </label>
        <div className="grid3">
          <label>Vencimento
            <input type="date" value={f.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          </label>
          <label>Prioridade
            <select value={f.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
              <option value="LOW">Baixa</option><option value="MEDIUM">Média</option><option value="HIGH">Alta</option>
            </select>
          </label>
          <label>Categoria
            <select value={f.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div className="actions">
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={saving || !f.title.trim()}>{saving ? 'Salvando…' : 'Salvar tarefa'}</button>
        </div>
      </form>
    </div>
  );
}
